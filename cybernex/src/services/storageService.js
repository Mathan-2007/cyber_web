/**
 * CyberNex - Storage Service
 *
 * Centralized service for managing all localStorage operations.
 * Provides:
 * - Consistent storage/retrieval of application data
 * - Data validation and default values
 * - Backup and restore functionality
 * - Automatic initialization of mock data
 */

import {
  APP_VERSION,
  ROLES,
  PERMISSIONS
} from '../utils/constants';
import { ADMIN_DEFAULT_PERMISSIONS, FACULTY_DEFAULT_PERMISSIONS, STUDENT_DEFAULT_PERMISSIONS } from '../permissions/rolePermissions';
import { apiRequest, getAuthToken } from './api';

// ===== STORAGE KEYS =====
const STORAGE_PREFIX = 'cybernex_';

export const STORAGE_KEYS = {
  // Authentication
  USER: `${STORAGE_PREFIX}user`,
  REMEMBER_ME: `${STORAGE_PREFIX}remember_me`,

  // Data
  USERS: `${STORAGE_PREFIX}users`,
  COURSES: `${STORAGE_PREFIX}courses`,
  LESSONS: `${STORAGE_PREFIX}lessons`,
  LABS: `${STORAGE_PREFIX}labs`,
  ASSESSMENTS: `${STORAGE_PREFIX}assessments`,
  RESULTS: `${STORAGE_PREFIX}results`,
  ATTENDANCE: `${STORAGE_PREFIX}attendance`,
  SCHEDULES: `${STORAGE_PREFIX}schedules`,
  VIOLATIONS: `${STORAGE_PREFIX}violations`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  AUDIT_LOGS: `${STORAGE_PREFIX}audit_logs`,
  RESTRICTIONS: `${STORAGE_PREFIX}restrictions`,
  BACKUPS: `${STORAGE_PREFIX}backups`,
  FACULTY: `${STORAGE_PREFIX}faculty`,
  STUDENT_GROUPS: `${STORAGE_PREFIX}student_groups`,

  // Settings
  SETTINGS: `${STORAGE_PREFIX}settings`,
  THEME: `${STORAGE_PREFIX}theme`,
  PERMISSIONS: `${STORAGE_PREFIX}permissions`,
  ASSESSMENT_UNLOCKS: `${STORAGE_PREFIX}assessment_unlocks`,
  STUDENT_PROGRESS: `${STORAGE_PREFIX}student_progress`,
  ASSESSMENT_GLOBAL_POLICY: `${STORAGE_PREFIX}assessment_global_policy`,
  ASSESSMENT_SESSIONS: `${STORAGE_PREFIX}assessment_sessions`,
  ASSESSMENT_QUESTION_SELECTIONS: `${STORAGE_PREFIX}assessment_question_selections`,

  // State
  LAST_ACTIVITY: `${STORAGE_PREFIX}last_activity`,
  APP_VERSION: `${STORAGE_PREFIX}app_version`,
};

// ===== STORAGE UTILITY FUNCTIONS =====

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} - Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

const persistToBackend = async (endpoint, method, payload) => {
  if (!getAuthToken()) throw new Error('Authentication required');

  try {
    const res = await apiRequest(endpoint, {
      method,
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {})
    });
    if (res === null || res === undefined) throw new Error(`Empty response from ${endpoint}`);
    return res;
  } catch (error) {
    console.error(`Backend sync failed for ${endpoint}:`, error.message);
    throw error;
  }
};

/**
 * Clear all application data from localStorage
 */
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// ===== DATA INITIALIZATION =====

/**
 * Initialize the app with empty local state for real backend-backed usage.
 * No demo or sample data is seeded here.
 */
export const initializeMockData = () => {
  const currentVersion = getItem(STORAGE_KEYS.APP_VERSION);

  if (currentVersion === APP_VERSION) {
    return;
  }

  if (!getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      notifications: { email: true, push: true, sound: true },
      assessment: { autoSubmit: true, showTimer: true, enableProctoring: false },
      dashboard: { widgets: ['stats', 'progress', 'recent-activity', 'quick-actions'] },
      language: 'en',
    });
  }

  if (!getItem(STORAGE_KEYS.THEME)) {
    setItem(STORAGE_KEYS.THEME, 'system');
  }

  if (!getItem(STORAGE_KEYS.PERMISSIONS)) {
    setItem(STORAGE_KEYS.PERMISSIONS, {
      [ROLES.ADMIN]: ADMIN_DEFAULT_PERMISSIONS,
      [ROLES.FACULTY]: FACULTY_DEFAULT_PERMISSIONS,
      [ROLES.STUDENT]: STUDENT_DEFAULT_PERMISSIONS,
    });
  }

  setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);
};

// ===== DATA ACCESS FUNCTIONS =====

// Users (authoritative via backend)
export const getUsers = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/users');
  if (!Array.isArray(res)) throw new Error('Invalid response for users');
  return res;
};
export const setUsers = (users) => {
  console.warn('setUsers: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.USERS, users);
};
export const addUser = async (user) => {
  const res = await persistToBackend('/users', 'POST', user);
  return res.user || res;
};
export const updateUser = async (userId, updates) => {
  const res = await persistToBackend(`/users/${userId}`, 'PUT', updates);
  return res.user || res;
};
export const deleteUser = async (userId) => {
  return await persistToBackend(`/users/${userId}`, 'DELETE');
};

// Courses
export const getCourses = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/courses');
  if (!Array.isArray(res)) throw new Error('Invalid response for courses');
  return res;
};
export const setCourses = (courses) => {
  console.warn('setCourses: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.COURSES, courses);
};
export const addCourse = async (course) => {
  const res = await persistToBackend('/courses', 'POST', course);
  return res;
};
export const updateCourse = async (courseId, updates) => {
  const res = await persistToBackend(`/courses/${courseId}`, 'PUT', updates);
  return res;
};
export const deleteCourse = async (courseId) => {
  return await persistToBackend(`/courses/${courseId}`, 'DELETE');
};

// Lessons (stored within courses in our data model)
// Exporting for consistency
export const getLessons = async () => {
  const courses = await getCourses();
  return courses.flatMap(course => course.modules?.flatMap(module => module.lessons) || []);
};

// Labs
export const getLabs = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/labs');
  if (!Array.isArray(res)) throw new Error('Invalid response for labs');
  return res;
};
export const setLabs = (labs) => {
  console.warn('setLabs: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.LABS, labs);
};
export const addLab = async (lab) => await persistToBackend('/labs', 'POST', lab);
export const updateLab = async (labId, updates) => await persistToBackend(`/labs/${labId}`, 'PUT', updates);
export const deleteLab = async (labId) => await persistToBackend(`/labs/${labId}`, 'DELETE');

// Assessments
export const getAssessments = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/assessments');
  if (!Array.isArray(res)) throw new Error('Invalid response for assessments');
  return res;
};
export const setAssessments = (assessments) => {
  console.warn('setAssessments: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.ASSESSMENTS, assessments);
};
export const addAssessment = async (assessment) => await persistToBackend('/assessments', 'POST', assessment);
export const updateAssessment = async (assessmentId, updates) => await persistToBackend(`/assessments/${assessmentId}`, 'PUT', updates);
export const deleteAssessment = async (assessmentId) => await persistToBackend(`/assessments/${assessmentId}`, 'DELETE');

// Results
export const getResults = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/results');
  if (!Array.isArray(res)) throw new Error('Invalid response for results');
  return res;
};
export const setResults = (results) => {
  console.warn('setResults: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.RESULTS, results);
};
export const addResult = async (result) => await persistToBackend('/results', 'POST', result);
export const updateResult = async (resultId, updates) => await persistToBackend(`/results/${resultId}`, 'PUT', updates);
export const deleteResult = async (resultId) => await persistToBackend(`/results/${resultId}`, 'DELETE');

// Attendance
export const getAttendance = async () => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest('/attendance');
  if (!Array.isArray(res)) throw new Error('Invalid response for attendance');
  return res;
};
export const setAttendance = (attendance) => {
  console.warn('setAttendance: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.ATTENDANCE, attendance);
};
export const addAttendance = async (record) => await persistToBackend('/attendance', 'POST', record);
export const updateAttendance = async (recordId, updates) => await persistToBackend(`/attendance/${recordId}`, 'PUT', updates);
export const deleteAttendance = async (recordId) => await persistToBackend(`/attendance/${recordId}`, 'DELETE');

// Schedules (authoritative via backend)
export const getSchedules = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve schedules');
  const res = await apiRequest('/schedules');
  if (!Array.isArray(res)) throw new Error('Invalid response for schedules');
  return res;
};
export const setSchedules = (schedules) => {
  console.warn('setSchedules: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.SCHEDULES, schedules);
};
export const addSchedule = async (schedule) => await persistToBackend('/schedules', 'POST', schedule);
export const updateSchedule = async (scheduleId, updates) => await persistToBackend(`/schedules/${scheduleId}`, 'PUT', updates);
export const deleteSchedule = async (scheduleId) => await persistToBackend(`/schedules/${scheduleId}`, 'DELETE');

// Violations
export const getViolations = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve violations');
  const res = await apiRequest('/violations');
  if (!Array.isArray(res)) throw new Error('Invalid response for violations');
  return res;
};
export const setViolations = (violations) => {
  console.warn('setViolations: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.VIOLATIONS, violations);
};
export const addViolation = async (violation) => await persistToBackend('/violations', 'POST', violation);
export const updateViolation = async (violationId, updates) => await persistToBackend(`/violations/${violationId}`, 'PUT', updates);
export const deleteViolation = async (violationId) => await persistToBackend(`/violations/${violationId}`, 'DELETE');

// Notifications
export const getNotifications = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve notifications');
  const res = await apiRequest('/notifications');
  if (!Array.isArray(res)) throw new Error('Invalid response for notifications');
  return res;
};
export const setNotifications = (notifications) => {
  console.warn('setNotifications: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
};
export const addNotification = async (notification) => await persistToBackend('/notifications', 'POST', notification);
export const updateNotification = async (notificationId, updates) => await persistToBackend(`/notifications/${notificationId}`, 'PUT', updates);
export const deleteNotification = async (notificationId) => await persistToBackend(`/notifications/${notificationId}`, 'DELETE');

// Audit Logs
export const getAuditLogs = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve audit logs');
  const res = await apiRequest('/audit-logs');
  if (!Array.isArray(res)) throw new Error('Invalid response for audit logs');
  return res;
};
export const setAuditLogs = (logs) => {
  console.warn('setAuditLogs: local cache write (non-authoritative). Audit logs must be retrieved from the server.');
  return setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
};
export const addAuditLog = async (log) => {
  if (!getAuthToken()) throw new Error('Authentication required to add audit log');
  const payload = {
    actor_id: log.actorId || log.userId || null,
    action: log.action || '',
    entity: log.target || log.entity || '',
    details: log.details || {}
  };
  const res = await apiRequest('/audit-logs', { method: 'POST', body: JSON.stringify(payload) });
  if (!res) throw new Error('Failed to persist audit log');
  return res;
};

// Restrictions
export const getRestrictions = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve restrictions');
  const res = await apiRequest('/restrictions');
  if (!Array.isArray(res)) throw new Error('Invalid response for restrictions');
  return res;
};
export const setRestrictions = (restrictions) => {
  console.warn('setRestrictions: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.RESTRICTIONS, restrictions);
};
export const addRestriction = async (restriction) => await persistToBackend('/restrictions', 'POST', restriction);
export const updateRestriction = async (restrictionId, updates) => await persistToBackend(`/restrictions/${restrictionId}`, 'PUT', updates);
export const deleteRestriction = async (restrictionId) => await persistToBackend(`/restrictions/${restrictionId}`, 'DELETE');

// Backups
export const getBackups = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve backups');
  const res = await apiRequest('/backups');
  if (!Array.isArray(res)) throw new Error('Invalid response for backups');
  return res;
};
export const setBackups = (backups) => {
  console.warn('setBackups: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.BACKUPS, backups);
};
export const addBackup = async (backup) => await persistToBackend('/backups', 'POST', backup);
export const deleteBackup = async (backupId) => await persistToBackend(`/backups/${backupId}`, 'DELETE');

// Faculty
export const getFaculty = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve faculty');
  const res = await apiRequest('/faculty');
  if (!Array.isArray(res)) throw new Error('Invalid response for faculty');
  return res;
};
export const setFaculty = (faculty) => {
  console.warn('setFaculty: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.FACULTY, faculty);
};
export const addFaculty = async (facultyMember) => await persistToBackend('/faculty', 'POST', facultyMember);
export const updateFaculty = async (facultyId, updates) => await persistToBackend(`/faculty/${facultyId}`, 'PUT', updates);
export const deleteFaculty = async (facultyId) => await persistToBackend(`/faculty/${facultyId}`, 'DELETE');

// Student Groups
export const getStudentGroups = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve student groups');
  const res = await apiRequest('/student-groups');
  if (!Array.isArray(res)) throw new Error('Invalid response for student groups');
  return res;
};
export const setStudentGroups = (groups) => {
  console.warn('setStudentGroups: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.STUDENT_GROUPS, groups);
};
export const addStudentGroup = async (group) => await persistToBackend('/student-groups', 'POST', group);
export const updateStudentGroup = async (groupId, updates) => await persistToBackend(`/student-groups/${groupId}`, 'PUT', updates);
export const deleteStudentGroup = async (groupId) => await persistToBackend(`/student-groups/${groupId}`, 'DELETE');

// Settings
export const getSettings = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve settings');
  const res = await apiRequest('/settings');
  return res || {};
};
export const setSettings = async (settings) => {
  if (!getAuthToken()) throw new Error('Authentication required to update settings');
  const res = await persistToBackend('/settings', 'POST', settings);
  // update local cache for UI only
  try { setItem(STORAGE_KEYS.SETTINGS, settings); } catch (e) { /* ignore cache failures */ }
  return res;
};
export const updateSettings = async (updates) => {
  return await setSettings(updates);
};

// Theme
export const getTheme = () => getItem(STORAGE_KEYS.THEME, 'system');
export const setTheme = (theme) => setItem(STORAGE_KEYS.THEME, theme);

// Permissions
export const getPermissions = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve permissions');
  const res = await apiRequest('/role-resources');

  if (!Array.isArray(res)) {
    return res?.resources || {};
  }

  const grouped = {};
  res.forEach((resource) => {
    const role = resource?.role || 'student';
    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(resource.path || resource.name || resource.element || '/');
  });

  return grouped;
};
export const setPermissions = (permissions) => {
  console.warn('setPermissions: local cache write (non-authoritative). Use backend endpoints for authoritative changes.');
  return setItem(STORAGE_KEYS.PERMISSIONS, permissions);
};
export const updateRolePermissions = async (role, permissions) => {
  if (!getAuthToken()) throw new Error('Authentication required');

  const items = Array.isArray(permissions) ? permissions : [];
  const lookLikeResources = items.some((item) => typeof item === 'string' && item.startsWith('/'));

  if (lookLikeResources) {
    const normalizedResources = items.map((item, index) => {
      const path = typeof item === 'string' ? item : (item?.path || item?.name || item?.element || '/');
      return {
        path,
        name: typeof item === 'string' ? path : (item?.name || path),
        icon: typeof item === 'string' ? '' : (item?.icon || ''),
        menu: typeof item === 'string' ? true : Boolean(item?.menu),
        element: typeof item === 'string' ? path : (item?.element || path),
        activity: typeof item === 'string' ? 0 : Number(item?.activity ?? 0),
        sort_order: typeof item === 'string' ? index + 1 : Number(item?.sort_order ?? index + 1),
      };
    });

    const res = await apiRequest(`/role-resources/${encodeURIComponent(role)}`, {
      method: 'PUT',
      body: JSON.stringify({ resources: normalizedResources })
    });

    return res?.resources || res || [];
  }

  const matrix = getItem(STORAGE_KEYS.PERMISSIONS, {});
  matrix[role] = Array.isArray(items) ? items : [];
  setItem(STORAGE_KEYS.PERMISSIONS, matrix);
  return matrix[role];
};

// Assessment access grants. The storage key keeps its legacy name so existing
// installations and backups stay compatible, but every new grant has an audit
// trail, expiry, status, and attempt budget rather than being a bare boolean.
const normalizeGrant = (grant, assessmentId, studentId) => {
  if (typeof grant === 'string') {
    return { id: `GRANT-${assessmentId}-${grant}`, studentId: grant, assessmentId, grantedBy: 'legacy', grantedAt: null, status: 'active', expiresAt: null, attemptsAllowed: 1, attemptsUsed: 0 };
  }
  return { status: 'active', expiresAt: null, attemptsAllowed: 1, attemptsUsed: 0, ...grant, assessmentId, studentId: grant.studentId || studentId };
};

export const getAssessmentUnlocks = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve assessment unlocks');
  const grants = await apiRequest('/access-grants');
  // normalize to map by assessmentId
  const map = {};
  (grants || []).forEach(g => {
    const aid = g.assessment_id || g.assessmentId;
    if (!aid) return;
    if (!map[aid]) map[aid] = [];
    map[aid].push(g);
  });
  // Optionally cache locally (non-authoritative)
  setAssessmentUnlocks(map);
  return map;
};
export const setAssessmentUnlocks = (unlocks) => setItem(STORAGE_KEYS.ASSESSMENT_UNLOCKS, unlocks);
// Access grants - server-backed implementations
export const unlockAssessmentForStudent = async (assessmentId, studentId, options = {}) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const payload = {
    student_id: studentId,
    assessment_id: assessmentId,
    expires_at: options.expiresAt || null
  };
  const res = await apiRequest('/access-grants', { method: 'POST', body: JSON.stringify(payload) });
  // Return created grant ID or server response
  return res || null;
};

export const lockAssessmentForStudent = async (assessmentId, studentId) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  // Find existing grant for student and assessment
  const grants = await apiRequest(`/access-grants/${encodeURIComponent(studentId)}`);
  const grant = (grants || []).find(g => g.assessment_id === assessmentId || g.assessmentId === assessmentId);
  if (!grant) throw new Error('No access grant found to lock');
  const id = grant.id || grant.ID || grant.id;
  await apiRequest(`/access-grants/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ unlocked: false }) });
  return { id, locked: true };
};

export const isAssessmentUnlockedForStudent = async (assessmentId, studentId) => {
  if (!getAuthToken()) return false;
  const grants = await apiRequest(`/access-grants/${encodeURIComponent(studentId)}`);
  const grant = (grants || []).find(g => g.assessment_id === assessmentId || g.assessmentId === assessmentId);
  if (!grant) return false;
  if (grant.unlocked === 0 || grant.unlocked === false) return false;
  if (grant.expires_at && new Date(grant.expires_at) <= new Date()) return false;
  return true;
};

export const getAssessmentAccessForStudent = async (assessmentId, studentId) => {
  if (!getAuthToken()) return null;
  const grants = await apiRequest(`/access-grants/${encodeURIComponent(studentId)}`);
  const grant = (grants || []).find(g => g.assessment_id === assessmentId || g.assessmentId === assessmentId);
  if (!grant) return null;
  const status = (grant.unlocked === 0 || grant.unlocked === false) ? 'revoked' : (grant.expires_at && new Date(grant.expires_at) <= new Date() ? 'expired' : 'open');
  return { ...grant, status };
};

export const recordAssessmentAttempt = async (assessmentId, studentId) => {
  // The backend currently does not manage attempt counters in `access_grants`.
  // For now record an audit log server-side and return a simple marker.
  if (!getAuthToken()) throw new Error('Authentication required');
  await apiRequest('/audit-logs', { method: 'POST', body: JSON.stringify({ action: 'ASSESSMENT_ATTEMPT', entity: 'Assessment', details: { assessmentId, studentId } }) });
  return { recorded: true };
};

// Synchronous cached helper for code that expects immediate checks (uses local cache)
export const getCachedAssessmentAccessForStudent = (assessmentId, studentId) => {
  const unlocks = getItem(STORAGE_KEYS.ASSESSMENT_UNLOCKS, {});
  const grant = (unlocks[assessmentId] || []).find(g => g.studentId === studentId || g.student_id === studentId);
  if (!grant) return null;
  const isExpired = grant.expiresAt && new Date(grant.expiresAt) <= new Date();
  if (isExpired) return { ...grant, status: 'expired' };
  if (grant.status !== 'active' && grant.unlocked !== 1 && grant.unlocked !== true) return { ...grant, status: 'revoked' };
  return { ...grant, status: 'open' };
};

// ===== ASSESSMENT GLOBAL POLICY =====
// Admin-controlled defaults applied to every assessment unless a
// per-assessment or per-session override exists.
export const DEFAULT_GLOBAL_ASSESSMENT_POLICY = {
  timeLimit: 60,          // minutes
  questionsPerAttempt: 5, // how many questions are drawn from a level's pool
  maxViolations: 3,       // proctoring signals allowed before auto-submit
  fullScreenRequired: true,
  updatedAt: null,
  updatedBy: null,
};

export const getGlobalAssessmentPolicy = () => ({
  ...DEFAULT_GLOBAL_ASSESSMENT_POLICY,
  ...getItem(STORAGE_KEYS.ASSESSMENT_GLOBAL_POLICY, {}),
});

export const setGlobalAssessmentPolicy = (policy, updatedBy = null) => {
  const merged = {
    ...getGlobalAssessmentPolicy(),
    ...policy,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  setItem(STORAGE_KEYS.ASSESSMENT_GLOBAL_POLICY, merged);
  return merged;
};

// ===== ASSESSMENT LIVE SESSIONS =====
// A "session" is how admin/faculty opens an assessment to every student at
// once (instead of unlocking students one by one). While isLive is true and
// the current time is before endsAt, every student may enter. Per-student
// grants from unlockAssessmentForStudent still work for individual
// exceptions/extensions on top of this.
export const getAssessmentSessions = async () => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve assessment sessions');
  const res = await apiRequest('/assessment-sessions');
  if (!Array.isArray(res)) throw new Error('Invalid response for assessment sessions');
  // normalize to map by assessmentId for cache
  const map = {};
  (res || []).forEach(s => {
    const aid = s.assessment_id || s.assessmentId;
    if (!aid) return;
    map[aid] = s;
  });
  setAssessmentSessions(map);
  return map;
};
export const setAssessmentSessions = (sessions) => setItem(STORAGE_KEYS.ASSESSMENT_SESSIONS, sessions);

export const getCachedAssessmentSession = (assessmentId) => {
  const sessions = getItem(STORAGE_KEYS.ASSESSMENT_SESSIONS, {});
  return sessions[assessmentId] || null;
};

export const startAssessmentSession = async (assessmentId, options = {}) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const payload = {
    assessment_id: assessmentId,
    is_live: true,
    started_by: options.startedBy || null,
    ends_at: options.endsAt || null,
    time_limit_override: options.timeLimitOverride || null,
    full_screen_required: options.fullScreenRequired || false,
    max_violations: options.maxViolations || null,
    questions_per_attempt: options.questionsPerAttempt || null
  };
  const res = await apiRequest('/assessment-sessions', { method: 'POST', body: JSON.stringify(payload) });
  return res;
};

export const extendAssessmentSession = async (sessionId, extraMinutes) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest(`/assessment-sessions/${encodeURIComponent(sessionId)}`, { method: 'PUT', body: JSON.stringify({ /* caller should supply fields */ }) });
  return res;
};

export const stopAssessmentSession = async (sessionId) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const res = await apiRequest(`/assessment-sessions/${encodeURIComponent(sessionId)}`, { method: 'PUT', body: JSON.stringify({ is_live: false }) });
  return res;
};

export const isAssessmentSessionLive = (assessmentId) => {
  const session = getCachedAssessmentSession(assessmentId);
  if (!session || !session.is_live && !session.isLive) return false;
  const endsAt = session.ends_at || session.endsAt;
  if (endsAt && new Date(endsAt) <= new Date()) return false;
  return session.is_live === 1 || session.is_live === true || session.isLive === true;
};

// ===== PER-STUDENT RANDOMIZED QUESTION SELECTION =====
// Once a student's subset of questions is drawn from the pool for an
// attempt, it's pinned here so refreshing the page doesn't reshuffle it.
export const getQuestionSelections = () => getItem(STORAGE_KEYS.ASSESSMENT_QUESTION_SELECTIONS, {});
export const getQuestionSelectionFor = (assessmentId, studentId) => {
  const all = getQuestionSelections();
  return all[assessmentId]?.[studentId] || null;
};
export const setQuestionSelectionFor = (assessmentId, studentId, questionIds) => {
  const all = getQuestionSelections();
  const updated = {
    ...all,
    [assessmentId]: { ...(all[assessmentId] || {}), [studentId]: questionIds },
  };
  setItem(STORAGE_KEYS.ASSESSMENT_QUESTION_SELECTIONS, updated);
  return questionIds;
};
export const clearQuestionSelectionFor = (assessmentId, studentId) => {
  const all = getQuestionSelections();
  if (!all[assessmentId]) return;
  const { [studentId]: _drop, ...rest } = all[assessmentId];
  setItem(STORAGE_KEYS.ASSESSMENT_QUESTION_SELECTIONS, { ...all, [assessmentId]: rest });
};

// Student Progress
export const getStudentProgress = async (studentId) => {
  if (!getAuthToken()) throw new Error('Authentication required to retrieve student progress');
  try {
    const res = await apiRequest(`/student-progress/${encodeURIComponent(studentId)}`);
    if (!res || Object.keys(res).length === 0) return null;
    return res;
  } catch (error) {
    throw new Error('Failed to fetch student progress: ' + error.message);
  }
};
export const setStudentProgress = async (studentId, progress) => {
  if (!getAuthToken()) throw new Error('Authentication required to save student progress');
  try {
    const payload = { student_id: studentId, ...progress };
    const res = await apiRequest('/student-progress', { method: 'POST', body: JSON.stringify(payload) });
    return res;
  } catch (error) {
    throw new Error('Failed to save student progress: ' + error.message);
  }
};
export const updateStudentProgress = async (studentId, updates) => {
  const currentProgress = await getStudentProgress(studentId);
  const updatedProgress = { ...currentProgress, ...updates };
  await setStudentProgress(studentId, updatedProgress);
  return updatedProgress;
};

// ===== BACKUP & RESTORE FUNCTIONS =====

/**
 * Create a backup of all application data
 * @param {object} options - Backup options
 * @param {string} options.createdBy - User ID who created the backup
 * @param {string} options.description - Backup description
 * @returns {object} - Backup object
 */
export const createBackup = async (options = {}) => {
  if (!getAuthToken()) throw new Error('Authentication required to create backup');
  try {
    const auditLogs = await getAuditLogs();
    const users = await getUsers();
    const courses = await getCourses();
    const labs = await getLabs();
    const assessments = await getAssessments();
    const results = await getResults();
    const attendance = await getAttendance();
    const schedules = await getSchedules();
    const violations = await getViolations();
    const notifications = await getNotifications();
    const restrictions = getRestrictions();
    const faculty = getFaculty();
    const studentGroups = getStudentGroups();
    const settings = getSettings();
    const permissions = getPermissions();
    const assessmentUnlocks = await getAssessmentUnlocks();
    const studentProgress = getItem(STORAGE_KEYS.STUDENT_PROGRESS, {});

    const backup = {
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      data: {
        users,
        courses,
        labs,
        assessments,
        results,
        attendance,
        schedules,
        violations,
        notifications,
        auditLogs,
        restrictions,
        faculty,
        studentGroups,
        settings,
        permissions,
        assessmentUnlocks,
        studentProgress
      },
      createdBy: options.createdBy || 'system',
      description: options.description || ''
    };

    backup.id = `backup-${Date.now()}`;
    backup.fileName = `cybernex-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    // Save to backups list (cache only)
    const backups = getBackups();
    const newBackup = { id: backup.id, timestamp: backup.timestamp, fileName: backup.fileName, createdBy: backup.createdBy, description: backup.description };
    setBackups([newBackup, ...backups]);

    return backup;
  } catch (error) {
    throw new Error('Failed to create backup: ' + error.message);
  }
  addBackup(backup);

  return backup;
};

/**
 * Download a backup file
 * @param {object} backup - Backup object to download
 */
export const downloadBackup = (backup) => {
  const data = JSON.stringify(backup.data, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = backup.fileName || 'cybernex-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Restore application data from a backup
 * @param {object} backup - Backup object to restore
 * @param {boolean} verifyVersion - Whether to verify app version
 * @returns {object} - Result object with success status
 */
 export const restoreBackup = async (backup, verifyVersion = true) => {
  // Verify backup structure
  if (!backup || !backup.data || !backup.version) {
    return {
      success: false,
      error: 'Invalid backup file structure',
    };
  }

  // Verify version if required
  if (verifyVersion && backup.version !== APP_VERSION) {
    return {
      success: false,
      error: `Backup version ${backup.version} does not match current app version ${APP_VERSION}`,
    };
  }

  try {
    // Restore must be performed by the backend.
    // Do not write authoritative domain data directly to localStorage.
    const result = await persistToBackend('/backups/restore', 'POST', backup);

    return {
      success: true,
      message: 'Backup restored successfully',
      result,
    };
  } catch (error) {
    console.error('Error restoring backup:', error);

    return {
      success: false,
      error: 'Failed to restore backup: ' + error.message,
    };
  }
};

/**
 * Import backup from file
 * @param {File} file - Backup file
 * @returns {Promise<object>} - Promise resolving to backup object or error
 */
export const importBackupFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        resolve(backup);
      } catch (error) {
        reject(new Error('Invalid backup file format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };

    reader.readAsText(file);
  });
};

// ===== AUDIT LOGGING HELPERS =====

/**
 * Log an action to the audit log
 * @param {object} action - Action details
 * @param {string} action.action - Action type (e.g., 'LOGIN', 'USER_CREATED')
 * @param {string} action.userId - User ID
 * @param {string} action.role - User role
 * @param {string} action.target - Target type (e.g., 'User', 'Course')
 * @param {string} action.targetId - Target ID
 * @param {string} action.status - Status ('Success' or 'Failure')
 * @param {object} action.details - Additional details
 */
export const logAction = (action) => {
  const log = {
    id: `AUDIT-${Date.now()}`,
    userId: action.userId || 'anonymous',
    role: action.role || ROLES.STUDENT,
    action: action.action,
    target: action.target,
    targetId: action.targetId,
    status: action.status || 'Success',
    ipAddress: action.ipAddress || 'unknown',
    userAgent: action.userAgent || navigator.userAgent,
    details: action.details,
    timestamp: new Date().toISOString()
  };

  _callAddAuditLog(log);
  return log;
};
// Note: `addAuditLog` is async; ensure rejections are logged but do not fallback to localStorage
const _callAddAuditLog = (log) => {
  addAuditLog(log).catch(err => console.error('Failed to persist audit log:', err.message));
};

// ===== EXPORT =====
export default {
  // Storage keys
  STORAGE_KEYS,

  // Utility functions
  getItem,
  setItem,
  removeItem,
  clearAll,

  // Initialization
  initializeMockData,

  // Data access functions
  // Users
  getUsers,
  setUsers,
  addUser,
  updateUser,
  deleteUser,

  // Courses
  getCourses,
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  getLessons,

  // Labs
  getLabs,
  setLabs,
  addLab,
  updateLab,
  deleteLab,

  // Assessments
  getAssessments,
  setAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,

  // Results
  getResults,
  setResults,
  addResult,
  updateResult,
  deleteResult,

  // Attendance
  getAttendance,
  setAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,

  // Schedules
  getSchedules,
  setSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,

  // Violations
  getViolations,
  setViolations,
  addViolation,
  updateViolation,
  deleteViolation,

  // Notifications
  getNotifications,
  setNotifications,
  addNotification,
  updateNotification,
  deleteNotification,

  // Audit Logs
  getAuditLogs,
  setAuditLogs,
  addAuditLog,

  // Restrictions
  getRestrictions,
  setRestrictions,
  addRestriction,
  updateRestriction,
  deleteRestriction,

  // Backups
  getBackups,
  setBackups,
  addBackup,
  deleteBackup,
  createBackup,
  downloadBackup,
  restoreBackup,
  importBackupFromFile,

  // Faculty
  getFaculty,
  setFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,

  // Student Groups
  getStudentGroups,
  setStudentGroups,
  addStudentGroup,
  updateStudentGroup,
  deleteStudentGroup,

  // Settings
  getSettings,
  setSettings,
  updateSettings,

  // Theme
  getTheme,
  setTheme,

  // Permissions
  getPermissions,
  setPermissions,
  updateRolePermissions,

  // Assessment Unlocks
  getAssessmentUnlocks,
  setAssessmentUnlocks,
  unlockAssessmentForStudent,
  lockAssessmentForStudent,
  isAssessmentUnlockedForStudent,
  getAssessmentAccessForStudent,
  recordAssessmentAttempt,

  // Assessment Global Policy
  getGlobalAssessmentPolicy,
  setGlobalAssessmentPolicy,

  // Assessment Live Sessions
  getAssessmentSessions,
  getCachedAssessmentSession,
  startAssessmentSession,
  extendAssessmentSession,
  stopAssessmentSession,
  isAssessmentSessionLive,

  // Per-student randomized question selection
  getQuestionSelections,
  getQuestionSelectionFor,
  setQuestionSelectionFor,
  clearQuestionSelectionFor,

  // Student Progress
  getStudentProgress,
  setStudentProgress,
  updateStudentProgress,

  // Audit logging
  logAction,
};