import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, STORAGE_KEYS } from '../utils/constants';
import { getItem, setItem, removeItem, logAction } from '../services/storageService';
import { apiRequest, setAuthToken, clearAuthToken } from '../services/api';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';
import { getAllPermissionsForUser } from '../permissions/rolePermissions';

const DEFAULT_ROLE_RESOURCES = {
  admin: [
    '/dashboard', '/notifications', '/search',
    '/admin/dashboard', '/admin/users', '/admin/courses', '/admin/assessments', '/admin/results',
    '/admin/restrictions', '/admin/student-level-control', '/admin/violations', '/admin/backups', '/admin/audit-logs'
  ],
  faculty: [
    '/dashboard', '/notifications', '/search',
    '/faculty/dashboard', '/faculty/students', '/faculty/courses', '/faculty/assessments', '/faculty/results',
    '/faculty/attendance', '/faculty/schedule', '/faculty/violations'
  ],
  student: [
    '/dashboard', '/notifications', '/search',
    '/student/dashboard', '/student/learning', '/student/roadmap', '/student/practice', '/student/assessments',
    '/student/progress', '/student/results', '/student/attendance', '/student/schedule'
  ]
};

const getResourcesForRole = (role) => DEFAULT_ROLE_RESOURCES[role] || DEFAULT_ROLE_RESOURCES.student;

const normalizeResourcePath = (resource) => {
  if (!resource) return null;
  if (typeof resource === 'string') return resource;
  if (typeof resource === 'object') return resource.path || resource.name || resource.element || null;
  return null;
};

const normalizeResourceList = (resources = []) => {
  if (!Array.isArray(resources)) return [];
  return resources
    .map((resource) => normalizeResourcePath(resource))
    .filter(Boolean);
};

const resolveUserResources = (user) => {
  if (!user) return [];
  const baseResources = getResourcesForRole(user.role || 'student');
  const customResources = Array.isArray(user.resources) ? user.resources : [];
  const mergedPaths = [...baseResources, ...normalizeResourceList(customResources)];
  return [...new Set(mergedPaths)];
};

const getDefaultDashboardRoute = (resources = []) => {
  const preferred = ['/admin/dashboard', '/faculty/dashboard', '/student/dashboard', '/dashboard'];
  const resourcePaths = normalizeResourceList(resources);
  return preferred.find((resource) => resourcePaths.includes(resource)) || '/dashboard';
};

// ===== CREATE CONTEXT =====
const AuthContext = createContext(null);

// ===== PROVIDER COMPONENT =====
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage and verified backend session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('cybernex_token') || document.cookie
          .split('; ')
          .find((entry) => entry.startsWith('cybernex_token='))
          ?.split('=')[1];

        if (token) {
          try {
            const response = await apiRequest('/auth/me');
            const hydratedUser = {
              ...response.user,
              user_id: response.user_id || response.user?.user_id || response.user?.id,
              user_name: response.user_name || response.user?.user_name || response.user?.name,
              department: response.department || response.user?.department || 'Computer Science and Engineering',
              resources: response.resources || resolveUserResources(response.user),
              permissions: response.permissions || normalizeResourceList(response.resources || []),
              sessionExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
            };
            setUser(hydratedUser);
            setIsAuthenticated(true);
            setItem(STORAGE_KEYS.USER, hydratedUser);
            return;
          } catch (error) {
            console.warn('Stored backend session invalid, clearing token:', error.message);
            clearAuthToken();
            removeItem(STORAGE_KEYS.USER);
          }
        }

        setUser(null);
        setIsAuthenticated(false);
        removeItem(STORAGE_KEYS.USER);
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
      if (user.token) {
        setAuthToken(user.token);
      }
      logAction({
        action: 'LOGIN',
        userId: user.id,
        role: user.role,
        target: 'System',
        status: 'Success',
        details: { method: 'backend_or_local_storage' }
      });
    } else {
      removeItem(STORAGE_KEYS.USER);
      clearAuthToken();
    }
  }, [user]);

  // ===== LOGIN FUNCTION =====
  const login = useCallback(async (email, password) => {
    console.debug('[Auth] login called for', email);
    setIsLoading(true);

    try {
      // Clear any stale session before attempting a fresh login.
      clearAuthToken();
      removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setIsAuthenticated(false);

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const userToSet = {
        ...response.user,
        user_id: response.user_id || response.user?.user_id || response.user?.id,
        user_name: response.user_name || response.user?.user_name || response.user?.name,
        department: response.department || response.user?.department || 'Computer Science and Engineering',
        token: response.token,
        resources: response.resources || resolveUserResources(response.user),
        permissions: response.permissions || normalizeResourceList(response.resources || []),
        sessionExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      };

      setAuthToken(response.token);
      setUser(userToSet);
      setIsAuthenticated(true);

      const redirectPath = getDefaultDashboardRoute(userToSet.resources);
      navigate(redirectPath);
      setIsLoading(false);
      return { success: true, user: userToSet };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  }, [navigate]);

  // ===== LOGOUT FUNCTION =====
  const logout = useCallback(() => {
    try {
      const currentUser = user || getItem(STORAGE_KEYS.USER);

      if (currentUser) {
        logAction({
          action: 'LOGOUT',
          userId: currentUser.id,
          role: currentUser.role,
          target: 'System',
          status: 'Success'
        });
      }

      // Always clear auth state, even if the token exists without a populated user object.
      localStorage.removeItem('cybernex_token');
      document.cookie = 'cybernex_token=; path=/; max-age=0; samesite=lax';
      removeItem(STORAGE_KEYS.USER);
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('cybernex_token');
      document.cookie = 'cybernex_token=; path=/; max-age=0; samesite=lax';
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

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
