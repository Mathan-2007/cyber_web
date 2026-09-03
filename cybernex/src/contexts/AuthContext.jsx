import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, DEMO_CREDENTIALS, STORAGE_KEYS } from '../utils/constants';
import { getItem, setItem, removeItem, logAction, initializeMockData } from '../services/storageService';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';
import { getAllPermissionsForUser } from '../permissions/rolePermissions';

// ===== CREATE CONTEXT =====
const AuthContext = createContext(null);

// ===== PROVIDER COMPONENT =====
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        initializeMockData();
      } catch (err) {
        console.warn('Failed to initialize mock data:', err);
      }
      try {
        const storedUser = getItem(STORAGE_KEYS.USER);
        if (storedUser?.sessionExpiresAt && new Date(storedUser.sessionExpiresAt) <= new Date()) {
          removeItem(STORAGE_KEYS.USER);
        } else if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (user) {
      setItem(STORAGE_KEYS.USER, user);
      // Log login action
      logAction({
        action: 'LOGIN',
        userId: user.id,
        role: user.role,
        target: 'System',
        status: 'Success',
        details: { method: 'localStorage' }
      });
    } else {
      removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // ===== LOGIN FUNCTION =====
  const login = useCallback(async (email, password) => {
    console.debug('[Auth] login called for', email);
    setIsLoading(true);

    try {
      // Check demo credentials first
      const demoUser = Object.entries(DEMO_CREDENTIALS).find(([role, creds]) =>
        creds.email === email && creds.password === password
      );

      if (demoUser) {
        const [role, creds] = demoUser;
        // Match the demo role as a fallback. This keeps demo login working for
        // browsers that still contain an older sample email in local storage.
        const userData = getItem(STORAGE_KEYS.USERS, []).find(u => u.email === email) ||
          getItem(STORAGE_KEYS.USERS, []).find(u => u.role === role);

        if (userData) {
          // Use existing user data
          const userToSet = {
            ...userData,
            email: creds.email,
            password: creds.password,
            sessionExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
            // Ensure permissions are set
            permissions: userData.permissions ||
              (role === ROLES.ADMIN ? ADMIN_DEFAULT_PERMISSIONS :
               role === ROLES.FACULTY ? FACULTY_DEFAULT_PERMISSIONS :
               STUDENT_DEFAULT_PERMISSIONS)
          };

          console.debug('[Auth] demo user found, setting user:', userToSet.id);
          setUser(userToSet);
          setIsAuthenticated(true);

          // Log action
          logAction({
            action: 'LOGIN',
            userId: userToSet.id,
            role: userToSet.role,
            target: 'System',
            status: 'Success',
            details: { method: 'demo' }
          });

          // Redirect based on role
          const redirectPath = userToSet.role === ROLES.ADMIN ? '/admin/dashboard' :
                               userToSet.role === ROLES.FACULTY ? '/faculty/dashboard' :
                               '/student/dashboard';

          console.debug('[Auth] navigating to', redirectPath);
          navigate(redirectPath);
          setIsLoading(false);
          return { success: true, user: userToSet };
        }
      }

      // Check regular users
      const users = getItem(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);

      if (user) {
        // In a real app, you would verify the password hash here
        // For this frontend-only version, we'll just check if passwords match
        // Note: This is NOT secure for production - just for demo purposes
        if (user.password === password) {
          console.debug('[Auth] regular user authenticated:', user.id);
          setUser({ ...user, sessionExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() });
          setIsAuthenticated(true);

          // Log action
          logAction({
            action: 'LOGIN',
            userId: user.id,
            role: user.role,
            target: 'System',
            status: 'Success',
            details: { method: 'credentials' }
          });

          // Redirect based on role
          const redirectPath = user.role === ROLES.ADMIN ? '/admin/dashboard' :
                               user.role === ROLES.FACULTY ? '/faculty/dashboard' :
                               '/student/dashboard';

          console.debug('[Auth] navigating to', redirectPath);
          navigate(redirectPath);
          setIsLoading(false);
          return { success: true, user };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Invalid email or password' };
        }
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, [navigate]);

  // ===== LOGOUT FUNCTION =====
  const logout = useCallback(() => {
    try {
      // Log action before clearing
      if (user) {
        logAction({
          action: 'LOGOUT',
          userId: user.id,
          role: user.role,
          target: 'System',
          status: 'Success'
        });
      }

      setUser(null);
      setIsAuthenticated(false);
      removeItem(STORAGE_KEYS.USER);

      // no remember-me cleanup required

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [user, navigate]);

  // ===== DEMO LOGIN FUNCTIONS =====
  const demoLogin = useCallback((role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      return login(creds.email, creds.password);
    }
    return { success: false, error: 'Invalid demo role' };
  }, [login]);

  const loginAsAdmin = useCallback(() => demoLogin(ROLES.ADMIN), [demoLogin]);
  const loginAsFaculty = useCallback(() => demoLogin(ROLES.FACULTY), [demoLogin]);
  const loginAsStudent = useCallback(() => demoLogin(ROLES.STUDENT), [demoLogin]);

  const updateSessionUser = useCallback((updates) => {
    setUser(current => current ? { ...current, ...updates } : current);
  }, []);

  // ===== PERMISSION CHECKS =====
  const hasPermission = useCallback((permission) => {
    if (!user) return false;

    // The stored role matrix is authoritative, so an administrator's change
    // takes effect immediately for routes and actions—not just the sidebar.
    const matrix = getItem(STORAGE_KEYS.PERMISSIONS, {});
    const allPermissions = matrix[user.role] || getAllPermissionsForUser(user.role, user.permissions || []);
    return allPermissions.includes(permission);
  }, [user]);

  const hasAllPermissions = useCallback((permissions) => {
    if (!user) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionsArray.every(p => hasPermission(p));
  }, [user, hasPermission]);

  const hasAnyPermission = useCallback((permissions) => {
    if (!user) return false;

    const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionsArray.some(p => hasPermission(p));
  }, [user, hasPermission]);

  const getAllUserPermissions = useCallback(() => {
    if (!user) return [];
    const matrix = getItem(STORAGE_KEYS.PERMISSIONS, {});
    return matrix[user.role] || getAllPermissionsForUser(user.role, user.permissions || []);
  }, [user]);

  // ===== ROLE CHECKS =====
  const isAdmin = useCallback(() => user?.role === ROLES.ADMIN, [user]);
  const isFaculty = useCallback(() => user?.role === ROLES.FACULTY, [user]);
  const isStudent = useCallback(() => user?.role === ROLES.STUDENT, [user]);

  const hasRole = useCallback((roles) => {
    if (!user) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  }, [user]);

  // ===== USER PROPERTIES =====
  const getUserId = useCallback(() => user?.id, [user]);
  const getUserEmail = useCallback(() => user?.email, [user]);
  const getUserName = useCallback(() => user?.name, [user]);
  const getUserLevel = useCallback(() => user?.level || 1, [user]);
  const getUserDepartment = useCallback(() => user?.department, [user]);

  // ===== VALUE =====
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Authentication functions
    login,
    logout,
    demoLogin,
    loginAsAdmin,
    loginAsFaculty,
    loginAsStudent,
    updateSessionUser,

    // Permission functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getAllUserPermissions,

    // Role functions
    isAdmin,
    isFaculty,
    isStudent,
    hasRole,

    // User property getters
    getUserId,
    getUserEmail,
    getUserName,
    getUserLevel,
    getUserDepartment,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== CUSTOM HOOK =====
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ===== EXPORT =====
export { AuthProvider, useAuth };
export default AuthContext;
