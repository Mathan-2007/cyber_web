import React, { useState, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ROLES } from '../../utils/constants';
import { ChevronLeft, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';

const getSidebarIcon = (iconName) => {
  const key = String(iconName || 'LayoutDashboard');
  return LucideIcons[key] || LucideIcons.LayoutDashboard;
};

/**
 * Main Sidebar component for navigation
 *
 * @param {object} props - Component props
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {function} props.onToggleCollapse - Function to toggle collapse state
 * @returns {JSX.Element} - Sidebar component
 */
const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const getNavItems = useCallback(() => {
    if (!user || !Array.isArray(user.resources)) return [];

    const dbItems = user.resources
      .filter((resource) => {
        const menuValue = resource?.menu;
        return menuValue === true || menuValue === 1 || menuValue === '1';
      })
      .map((resource) => {
        const normalizedPath = typeof resource === 'string' ? resource : resource.path;
        const iconName = typeof resource === 'string' ? resource : (resource.icon || 'LayoutDashboard');

        return {
          id: normalizedPath,
          label: resource.name || resource.path || normalizedPath,
          icon: iconName,
          path: normalizedPath,
        };
      })
      .sort((a, b) => {
        const aOrder = Number(a?.sortOrder ?? 0);
        const bOrder = Number(b?.sortOrder ?? 0);
        return aOrder - bOrder;
      });

    if (dbItems.length > 0) {
      return dbItems;
    }

    const fallbackPath = user.role === ROLES.ADMIN ? '/admin/dashboard' : user.role === ROLES.FACULTY ? '/faculty/dashboard' : '/student/dashboard';
    const fallbackItems = [
      { id: fallbackPath, label: 'Dashboard', icon: 'LayoutDashboard', path: fallbackPath },
      { id: '/notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
    ];

    return fallbackItems;
  }, [user]);

  // Toggle submenu
  const toggleSubmenu = useCallback((id) => {
    setActiveSubmenu(prev => prev === id ? null : id);
  }, []);

  // Check if nav item is active
  const isNavItemActive = useCallback((path) => {
    if (path === location.pathname) return true;

    // Check if current path starts with the nav item path
    if (location.pathname.startsWith(path)) {
      // For paths with parameters (e.g., /student/learning/:courseId)
      const pathParts = path.split('/').filter(Boolean);
      const locationParts = location.pathname.split('/').filter(Boolean);

      // Check if the first parts match
      return pathParts.every((part, index) =>
        index < locationParts.length &&
        (part.startsWith(':') || part === locationParts[index])
      );
    }

    return false;
  }, [location.pathname]);

  // Render nav item
  const renderNavItem = useCallback((item) => {
    const IconComponent = getSidebarIcon(item.icon);
    const isActive = isNavItemActive(item.path);

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={({ isActive: linkActive }) => `
          sidebar-link ${linkActive || isActive ? 'sidebar-link-active' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
        `}
        onClick={() => toggleSubmenu(null)}
      >
        <span className="w-5 h-5 flex-shrink-0 inline-flex items-center justify-center">
          <IconComponent className="w-5 h-5" />
        </span>
        {!isCollapsed && <span>{item.label}</span>}
      </NavLink>
    );
  }, [isCollapsed, isNavItemActive, toggleSubmenu, isDarkMode]);

  return (
    <aside
      className={`
        app-sidebar fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700 transition-all duration-300
        ${isCollapsed ? 'app-sidebar--collapsed w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">CyberNex</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-4rem)] p-4 overflow-y-auto">
        <div className="space-y-1">
          {getNavItems().map(item => renderNavItem(item))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={logout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
