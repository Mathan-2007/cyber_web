/**
 * CyberNex - Role-Based Permission Mapping
 *
 * This file defines which permissions each role has by default.
 * Admins can override these in the Access Control matrix.
 */

import { ROLES } from '../utils/constants';
import { ALL_PERMISSIONS, USER_PERMISSIONS } from './permissions';

// ===== DEFAULT PERMISSIONS BY ROLE =====

/**
 * Admin master permissions.
 * Admin is the top authority: full user management, plus full master
 * control over assessments (question pools, global policy, live session
 * control, and per-assessment overrides for time/violations/fullscreen)
 * on top of everything faculty can already do.
 */
export const ADMIN_DEFAULT_PERMISSIONS = [
  // User Management
  USER_PERMISSIONS.VIEW,
  USER_PERMISSIONS.CREATE,
  USER_PERMISSIONS.EDIT,
  USER_PERMISSIONS.DELETE,
  USER_PERMISSIONS.DEACTIVATE,
  USER_PERMISSIONS.REACTIVATE,
  USER_PERMISSIONS.RESET_PASSWORD,
  USER_PERMISSIONS.CHANGE_ROLE,
  USER_PERMISSIONS.ASSIGN_COURSES,
  USER_PERMISSIONS.ASSIGN_LEVEL,
  USER_PERMISSIONS.MANAGE_RESTRICTIONS,

  // Assessments — admin is master over everything faculty can do, plus:
  'assessment.view',
  'assessment.create',
  'assessment.edit',
  'assessment.delete',
  'assessment.manage',
  'assessment.start',
  'assessment.review',
  'assessment.grade',
  'assessment.publish',
  'assessment.unlock',
  'assessment.lock',
  'assessment.reset_attempts',
  'assessment.set_duration',
  'assessment.set_passing_score',
  'assessment.set_difficulty',
  'assessment.set_level',
  'assessment.schedule',
  'assessment.assign_students',
  'assessment.manage_question_pool',
  'assessment.control_session',
  'assessment.set_global_policy',
  'assessment.override_time',
  'assessment.override_violations',
  'assessment.override_fullscreen',

  // Results & violations oversight
  'results.view',
  'results.view_all',
  'results.manage',
  'results.publish',
  'results.analyze',
  'violations.view',
  'violations.view_all',
  'violations.manage',
  'violations.review',
  'violations.dismiss',
  'violations.escalate',
  'violations.add_note',
];

/**
 * Faculty default permissions
 * Can create/edit courses, manage their students, etc.
 * Cannot manage other faculty or system settings
 */
export const FACULTY_DEFAULT_PERMISSIONS = [
  // User Management (limited)
  'users.view',

  // Course Management
  'courses.view',
  'courses.create',
  'courses.edit',
  'courses.delete',
  'courses.publish',
  'courses.unpublish',
  'courses.assign_students',
  'courses.set_prerequisites',
  'courses.set_difficulty',
  'courses.set_level',

  // Lesson Management
  'lessons.view',
  'lessons.create',
  'lessons.edit',
  'lessons.delete',

  // Practice Labs
  'practice.view',
  'practice.manage',
  'practice.create',
  'practice.edit',
  'practice.delete',
  'practice.validate_flags',
  'practice.track_progress',

  // Assessments
  'assessment.view',
  'assessment.create',
  'assessment.edit',
  'assessment.delete',
  'assessment.manage',
  'assessment.review',
  'assessment.grade',
  'assessment.publish',
  'assessment.unlock',
  'assessment.lock',
  'assessment.reset_attempts',
  'assessment.set_duration',
  'assessment.set_passing_score',
  'assessment.set_difficulty',
  'assessment.set_level',
  'assessment.schedule',
  'assessment.assign_students',

  // Results
  'results.view',
  'results.view_all',
  'results.manage',
  'results.publish',
  'results.analyze',

  // Attendance
  'attendance.view',
  'attendance.view_all',
  'attendance.manage',
  'attendance.mark_present',
  'attendance.mark_absent',
  'attendance.mark_late',
  'attendance.mark_excused',
  'attendance.export',

  // Schedule
  'schedule.view',
  'schedule.view_all',
  'schedule.manage',
  'schedule.create',
  'schedule.edit',
  'schedule.delete',
  'schedule.assign_students',

  // Violations
  'violations.view',
  'violations.view_all',
  'violations.manage',
  'violations.review',
  'violations.dismiss',
  'violations.escalate',
  'violations.add_note',

  // Assets
  'assets.view',
  'assets.manage',
  'assets.upload',
  'assets.edit',
  'assets.delete',
  'assets.tag',
];

/**
 * Student default permissions
 * Can view courses, practice, take assessments, etc.
 * Cannot manage anything
 */
export const STUDENT_DEFAULT_PERMISSIONS = [
  // Courses
  'courses.view',

  // Lessons
  'lessons.view',
  'lessons.mark_complete',

  // Practice Labs
  'practice.view',
  'practice.start',
  'practice.validate_flags',
  'practice.track_progress',

  // Assessments
  'assessment.view',
  'assessment.start',
  'assessment.submit',

  // Results
  'results.view',

  // Attendance
  'attendance.view',

  // Schedule
  'schedule.view',
];

// ===== ROLE PERMISSION MAPPING =====
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ADMIN_DEFAULT_PERMISSIONS,
  [ROLES.FACULTY]: FACULTY_DEFAULT_PERMISSIONS,
  [ROLES.STUDENT]: STUDENT_DEFAULT_PERMISSIONS,
};

// ===== PERMISSION CHECK UTILITIES =====

/**
 * Get default permissions for a role
 * @param {string} role - User role
 * @returns {string[]} - Array of permission strings
 */
export const getDefaultPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if a role has a specific permission by default
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if role has permission
 */
export const roleHasPermission = (role, permission) => {
  const permissions = getDefaultPermissionsForRole(role);
  return permissions.includes(permission);
};

/**
 * Get all roles that have a specific permission by default
 * @param {string} permission - Permission to check
 * @returns {string[]} - Array of role names
 */
export const rolesWithPermission = (permission) => {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([role, permissions]) => permissions.includes(permission))
    .map(([role]) => role);
};

/**
 * Check if a user has a specific permission
 * @param {string} role - User role
 * @param {string[]} userPermissions - User's specific permissions (from custom assignments)
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (role, userPermissions = [], permission) => {
  // Check if permission exists
  if (!ALL_PERMISSIONS[permission]) {
    return false;
  }

  // Check role default permissions
  const defaultPermissions = getDefaultPermissionsForRole(role);
  if (defaultPermissions.includes(permission)) {
    return true;
  }

  // Check user-specific permissions
  return userPermissions.includes(permission);
};

/**
 * Get all permissions for a user (role defaults + custom)
 * @param {string} role - User role
 * @param {string[]} customPermissions - User's custom permissions
 * @returns {string[]} - Combined array of all permissions
 */
export const getAllPermissionsForUser = (role, customPermissions = []) => {
  const defaultPermissions = getDefaultPermissionsForRole(role);
  return [...new Set([...defaultPermissions, ...customPermissions])];
};

/**
 * Check if a user has all required permissions
 * @param {string} role - User role
 * @param {string[]} userPermissions - User's specific permissions
 * @param {string|string[]} requiredPermissions - Permission or array of permissions to check
 * @returns {boolean} - True if user has all required permissions
 */
export const hasAllPermissions = (role, userPermissions = [], requiredPermissions) => {
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  return permissions.every(permission =>
    hasPermission(role, userPermissions, permission)
  );
};

/**
 * Check if a user has any of the required permissions
 * @param {string} role - User role
 * @param {string[]} userPermissions - User's specific permissions
 * @param {string[]} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if user has any of the required permissions
 */
export const hasAnyPermission = (role, userPermissions = [], requiredPermissions) => {
  return requiredPermissions.some(permission =>
    hasPermission(role, userPermissions, permission)
  );
};

/**
 * Get permissions that a user doesn't have
 * @param {string} role - User role
 * @param {string[]} userPermissions - User's specific permissions
 * @param {string[]} requiredPermissions - Permissions to check against
 * @returns {string[]} - Array of missing permissions
 */
export const getMissingPermissions = (role, userPermissions = [], requiredPermissions) => {
  return requiredPermissions.filter(permission =>
    !hasPermission(role, userPermissions, permission)
  );
};

// ===== PROTECTED PERMISSIONS =====
/**
 * Permissions that cannot be removed from admins
 * Ensures at least one admin always has full access
 */
export const PROTECTED_ADMIN_PERMISSIONS = [
  'users.view',
  'users.create',
  'users.edit',
  'access_control.manage',
  'system.manage',
  ...Object.values(ALL_PERMISSIONS).filter(p =>
    p.startsWith('backup.') ||
    p.startsWith('access_control.') ||
    p.startsWith('system.')
  )
];

/**
 * Check if a permission is protected for admins
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if permission is protected
 */
export const isProtectedAdminPermission = (permission) => {
  return PROTECTED_ADMIN_PERMISSIONS.includes(permission);
};

// ===== EXPORT =====
export default {
  ADMIN_DEFAULT_PERMISSIONS,
  FACULTY_DEFAULT_PERMISSIONS,
  STUDENT_DEFAULT_PERMISSIONS,
  ROLE_PERMISSIONS,
  getDefaultPermissionsForRole,
  roleHasPermission,
  rolesWithPermission,
  hasPermission,
  getAllPermissionsForUser,
  hasAllPermissions,
  hasAnyPermission,
  getMissingPermissions,
  PROTECTED_ADMIN_PERMISSIONS,
  isProtectedAdminPermission,
};