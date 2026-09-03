import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ROLES, DEMO_CREDENTIALS } from '../../utils/constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Eye, EyeOff, User, Lock, ShieldCheck, Radio, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const { error: showError } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // rememberMe removed
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === ROLES.ADMIN ? '/admin/dashboard' :
                          user.role === ROLES.FACULTY ? '/faculty/dashboard' :
                          '/student/dashboard';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, error, user: loggedInUser } = await login(
        formData.email,
        formData.password
      );

      if (!success) {
        showError(error || 'Invalid email or password');
      }
    } catch (err) {
      showError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      if (creds) {
        await login(creds.email, creds.password);
      }
    } catch (err) {
      showError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] p-4 text-slate-100 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden border border-slate-700/80 bg-[#0b1728] shadow-2xl md:grid-cols-[1.1fr_.9fr] md:min-h-[680px]">
        <section className="relative hidden overflow-hidden border-r border-slate-700 p-10 md:flex md:flex-col md:justify-between">
          <div className="absolute -left-28 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative flex items-center gap-3 text-sm font-semibold tracking-[.18em] text-cyan-300"><ShieldCheck size={22} /> CYBERNEX</div>
          <div className="relative max-w-md"><p className="text-xs font-semibold tracking-[.2em] text-violet-300">SECURITY LEARNING OPERATIONS</p><h1 className="mt-5 text-5xl font-semibold leading-tight text-white">Build judgement, not just knowledge.</h1><p className="mt-5 leading-7 text-slate-400">A connected environment for learning security, practising safely, and validating skill.</p></div>
          <div className="relative grid gap-3 text-sm text-slate-300"><p className="flex items-center gap-3"><Radio size={16} className="text-cyan-400" /> Live curriculum status and progression</p><p className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> Role-aware learning and assessment access</p></div>
        </section>
        <div className="flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-900/80 shadow-none">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to CyberNEX
            </h1>
            <p className="text-slate-400 mt-1">
              Sign in to your security workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input pl-10"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me and forgot password removed per request */}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-400 dark:text-gray-500">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>

          {/* Demo Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin(ROLES.ADMIN)}
              disabled={isLoading}
            >
              <span className="text-sm">Admin</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin(ROLES.FACULTY)}
              disabled={isLoading}
            >
              <span className="text-sm">Faculty</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin(ROLES.STUDENT)}
              disabled={isLoading}
            >
              <span className="text-sm">Student</span>
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
            © {new Date().getFullYear()} cybernex. All rights reserved.
          </p>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
