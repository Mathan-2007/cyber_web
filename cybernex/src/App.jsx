import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';
import SharedLayout from './layouts/SharedLayout';

// Pages
const Login = lazy(() => import('./pages/auth/Login'));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));

// Shared Pages
const Dashboard = lazy(() => import('./pages/shared/Dashboard'));
const Notifications = lazy(() => import('./pages/shared/Notifications'));
const Settings = lazy(() => import('./pages/shared/Settings'));
const SearchResults = lazy(() => import('./pages/shared/SearchResults'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const Learning = lazy(() => import('./pages/student/Learning'));
const LearningDetail = lazy(() => import('./pages/student/LearningDetail'));
const LearningLesson = lazy(() => import('./pages/student/LearningLesson'));
const Roadmap = lazy(() => import('./pages/student/Roadmap'));
const PracticeLabs = lazy(() => import('./pages/student/PracticeLabs'));
const PracticeLabDetail = lazy(() => import('./pages/student/PracticeLabDetail'));
const StudentAssessments = lazy(() => import('./pages/student/Assessments'));
const AssessmentDetail = lazy(() => import('./pages/student/AssessmentDetail'));
const AssessmentTaking = lazy(() => import('./pages/student/AssessmentTaking'));
const StudentProgress = lazy(() => import('./pages/student/Progress'));
const StudentResults = lazy(() => import('./pages/student/Results'));
const ResultDetail = lazy(() => import('./pages/student/ResultDetail'));
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const StudentSchedule = lazy(() => import('./pages/student/Schedule'));

// Faculty Pages
const FacultyDashboard = lazy(() => import('./pages/faculty/Dashboard'));
const FacultyStudents = lazy(() => import('./pages/faculty/Students'));
const FacultyCourses = lazy(() => import('./pages/faculty/Courses'));
const FacultyPractice = lazy(() => import('./pages/faculty/Practice'));
const FacultyAssessments = lazy(() => import('./pages/faculty/Assessments'));
const FacultyResults = lazy(() => import('./pages/faculty/Results'));
const FacultyAttendance = lazy(() => import('./pages/faculty/Attendance'));
const FacultySchedule = lazy(() => import('./pages/faculty/Schedule'));
const FacultyViolations = lazy(() => import('./pages/faculty/Violations'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const UserForm = lazy(() => import('./pages/admin/UserForm'));
const Courses = lazy(() => import('./pages/admin/Courses'));
const CourseForm = lazy(() => import('./pages/admin/CourseForm'));
const Attendance = lazy(() => import('./pages/admin/Attendance'));
const Schedule = lazy(() => import('./pages/admin/Schedule'));
const Faculty = lazy(() => import('./pages/admin/Faculty'));
const FacultyForm = lazy(() => import('./pages/admin/FacultyForm'));
const Results = lazy(() => import('./pages/admin/Results'));
const Restrictions = lazy(() => import('./pages/admin/Restrictions'));
const RestrictionForm = lazy(() => import('./pages/admin/RestrictionForm'));
const Reset = lazy(() => import('./pages/admin/Reset'));
const Levels = lazy(() => import('./pages/admin/Levels'));
const LevelForm = lazy(() => import('./pages/admin/LevelForm'));
const Assets = lazy(() => import('./pages/admin/Assets'));
const AssetForm = lazy(() => import('./pages/admin/AssetForm'));
const BulkUnlock = lazy(() => import('./pages/admin/BulkUnlock'));
const Violations = lazy(() => import('./pages/admin/Violations'));
const ViolationDetail = lazy(() => import('./pages/admin/ViolationDetail'));
const Backups = lazy(() => import('./pages/admin/Backups'));
const BackupForm = lazy(() => import('./pages/admin/BackupForm'));
const AccessControl = lazy(() => import('./pages/admin/AccessControl'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const AssessmentControl = lazy(() => import('./pages/admin/AssessmentControl'));
const StudentLevelControl = lazy(() => import('./pages/admin/StudentLevelControl'));

const normalizeResourcePath = (resource) => {
  if (!resource) return null;
  if (typeof resource === 'string') return resource;
  if (typeof resource === 'object') return resource.path || resource.name || resource.element || null;
  return null;
};

const getResourcePaths = (resources = []) => {
  if (!Array.isArray(resources)) return [];
  return resources
    .map((resource) => normalizeResourcePath(resource))
    .filter(Boolean);
};

const getDashboardRouteFromResources = (resources = []) => {
  const preferred = ['/admin/dashboard', '/faculty/dashboard', '/student/dashboard', '/dashboard'];
  const resourcePaths = getResourcePaths(resources);
  return preferred.find((route) => resourcePaths.includes(route)) || '/dashboard';
};

const ProtectedResourceRoute = ({ resource, element }) => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-300">Loading CyberNEX…</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const fallbackResources = user.role ? [
    '/dashboard',
    '/notifications', '/search',
    '/student/dashboard', '/student/learning', '/student/roadmap', '/student/practice', '/student/assessments',
    '/student/progress', '/student/results', '/student/attendance', '/student/schedule',
    '/faculty/dashboard', '/faculty/students', '/faculty/courses', '/faculty/assessments', '/faculty/results',
    '/faculty/attendance', '/faculty/schedule', '/faculty/violations',
    '/admin/dashboard', '/admin/users', '/admin/courses', '/admin/assessments', '/admin/results',
    '/admin/attendance', '/admin/schedule', '/admin/faculty', '/admin/violations', '/admin/backups', '/admin/audit-logs'
  ] : [];
  const resources = getResourcePaths(Array.isArray(user.resources) && user.resources.length ? user.resources : fallbackResources);
  const canAccess = resources.includes(resource) || resources.includes('*') || resources.length === 0 || user.role === 'student';

  if (!canAccess) {
    return <Navigate to="/access-denied" replace />;
  }

  return element;
};

const HomeRedirect = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-300">Loading CyberNEX…</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const fallbackResources = user.role ? [
    '/dashboard',
    '/notifications', '/search',
    '/student/dashboard', '/student/learning', '/student/roadmap', '/student/practice', '/student/assessments',
    '/student/progress', '/student/results', '/student/attendance', '/student/schedule',
    '/faculty/dashboard', '/faculty/students', '/faculty/courses', '/faculty/assessments', '/faculty/results',
    '/faculty/attendance', '/faculty/schedule', '/faculty/violations',
    '/admin/dashboard', '/admin/users', '/admin/courses', '/admin/assessments', '/admin/results',
    '/admin/attendance', '/admin/schedule', '/admin/faculty', '/admin/violations', '/admin/backups', '/admin/audit-logs'
  ] : [];
  const resources = Array.isArray(user.resources) && user.resources.length ? user.resources : fallbackResources;
  const destination = getDashboardRouteFromResources(resources);
  return <Navigate to={destination} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <DataProvider>
            <Suspense fallback={<div className="min-h-screen grid place-items-center bg-slate-950 text-slate-300">Loading CyberNEX…</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Shared Routes (available to all authenticated users) */}
                <Route element={<SharedLayout />}>
                  <Route path="/dashboard" element={<ProtectedResourceRoute resource="/dashboard" element={<Dashboard />} />} />
                  <Route path="/notifications" element={<ProtectedResourceRoute resource="/notifications" element={<Notifications />} />} />
                  <Route path="/settings" element={<ProtectedResourceRoute resource="/settings" element={<Settings />} />} />
                  <Route path="/search" element={<ProtectedResourceRoute resource="/search" element={<SearchResults />} />} />
                </Route>

                {/* Student Routes */}
                <Route element={<StudentLayout />}>
                  <Route path="/student/dashboard" element={<ProtectedResourceRoute resource="/student/dashboard" element={<StudentDashboard />} />} />
                  <Route path="/student/learning" element={<ProtectedResourceRoute resource="/student/learning" element={<Learning />} />} />
                  <Route path="/student/learning/:courseId/:lessonId" element={<ProtectedResourceRoute resource="/student/learning" element={<LearningLesson />} />} />
                  <Route path="/student/learning/:courseId" element={<ProtectedResourceRoute resource="/student/learning" element={<LearningDetail />} />} />
                  <Route path="/student/roadmap" element={<ProtectedResourceRoute resource="/student/roadmap" element={<Roadmap />} />} />
                  <Route path="/student/roadmap/:pathId" element={<ProtectedResourceRoute resource="/student/roadmap" element={<Roadmap />} />} />
                  <Route path="/student/practice" element={<ProtectedResourceRoute resource="/student/practice" element={<PracticeLabs />} />} />
                  <Route path="/student/practice/:labId" element={<ProtectedResourceRoute resource="/student/practice" element={<PracticeLabDetail />} />} />
                  <Route path="/student/assessments" element={<ProtectedResourceRoute resource="/student/assessments" element={<StudentAssessments />} />} />
                  <Route path="/student/assessment/:assessmentId" element={<ProtectedResourceRoute resource="/student/assessments" element={<AssessmentDetail />} />} />
                  <Route path="/student/assessment/:assessmentId/take" element={<ProtectedResourceRoute resource="/student/assessments" element={<AssessmentTaking />} />} />
                  <Route path="/student/progress" element={<ProtectedResourceRoute resource="/student/progress" element={<StudentProgress />} />} />
                  <Route path="/student/results" element={<ProtectedResourceRoute resource="/student/results" element={<StudentResults />} />} />
                  <Route path="/student/results/:resultId" element={<ProtectedResourceRoute resource="/student/results" element={<ResultDetail />} />} />
                  <Route path="/student/attendance" element={<ProtectedResourceRoute resource="/student/attendance" element={<StudentAttendance />} />} />
                  <Route path="/student/schedule" element={<ProtectedResourceRoute resource="/student/schedule" element={<StudentSchedule />} />} />
                  <Route path="/student/notifications" element={<ProtectedResourceRoute resource="/notifications" element={<Notifications />} />} />
                  <Route path="/student/settings" element={<ProtectedResourceRoute resource="/settings" element={<Settings />} />} />
                </Route>

                {/* Faculty Routes */}
                <Route element={<FacultyLayout />}>
                  <Route path="/faculty/dashboard" element={<ProtectedResourceRoute resource="/faculty/dashboard" element={<FacultyDashboard />} />} />
                  <Route path="/faculty/students" element={<ProtectedResourceRoute resource="/faculty/students" element={<FacultyStudents />} />} />
                  <Route path="/faculty/courses" element={<ProtectedResourceRoute resource="/faculty/courses" element={<FacultyCourses />} />} />
                  <Route path="/faculty/practice" element={<ProtectedResourceRoute resource="/faculty/practice" element={<FacultyPractice />} />} />
                  <Route path="/faculty/assessments" element={<ProtectedResourceRoute resource="/faculty/assessments" element={<FacultyAssessments />} />} />
                  <Route path="/faculty/results" element={<ProtectedResourceRoute resource="/faculty/results" element={<FacultyResults />} />} />
                  <Route path="/faculty/attendance" element={<ProtectedResourceRoute resource="/faculty/attendance" element={<FacultyAttendance />} />} />
                  <Route path="/faculty/schedule" element={<ProtectedResourceRoute resource="/faculty/schedule" element={<FacultySchedule />} />} />
                  <Route path="/faculty/violations" element={<ProtectedResourceRoute resource="/faculty/violations" element={<FacultyViolations />} />} />
                  <Route path="/faculty/notifications" element={<ProtectedResourceRoute resource="/notifications" element={<Notifications />} />} />
                  <Route path="/faculty/settings" element={<ProtectedResourceRoute resource="/settings" element={<Settings />} />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<ProtectedResourceRoute resource="/admin/dashboard" element={<AdminDashboard />} />} />
                  <Route path="/admin/users" element={<ProtectedResourceRoute resource="/admin/users" element={<Users />} />} />
                  <Route path="/admin/users/new" element={<ProtectedResourceRoute resource="/admin/users" element={<UserForm />} />} />
                  <Route path="/admin/users/:userId/edit" element={<ProtectedResourceRoute resource="/admin/users" element={<UserForm />} />} />
                  <Route path="/admin/courses" element={<ProtectedResourceRoute resource="/admin/courses" element={<Courses />} />} />
                  <Route path="/admin/courses/new" element={<ProtectedResourceRoute resource="/admin/courses" element={<CourseForm />} />} />
                  <Route path="/admin/courses/:courseId/edit" element={<ProtectedResourceRoute resource="/admin/courses" element={<CourseForm />} />} />
                  <Route path="/admin/practice" element={<ProtectedResourceRoute resource="/admin/courses" element={<FacultyPractice />} />} />
                  <Route path="/admin/attendance" element={<ProtectedResourceRoute resource="/admin/attendance" element={<Attendance />} />} />
                  <Route path="/admin/schedule" element={<ProtectedResourceRoute resource="/admin/schedule" element={<Schedule />} />} />
                  <Route path="/admin/faculty" element={<ProtectedResourceRoute resource="/admin/faculty" element={<Faculty />} />} />
                  <Route path="/admin/faculty/new" element={<ProtectedResourceRoute resource="/admin/faculty" element={<FacultyForm />} />} />
                  <Route path="/admin/faculty/:facultyId/edit" element={<ProtectedResourceRoute resource="/admin/faculty" element={<FacultyForm />} />} />
                  <Route path="/admin/assessments" element={<ProtectedResourceRoute resource="/admin/assessments" element={<FacultyAssessments />} />} />
                  <Route path="/admin/results" element={<ProtectedResourceRoute resource="/admin/results" element={<Results />} />} />
                  <Route path="/admin/restrictions" element={<ProtectedResourceRoute resource="/admin/restrictions" element={<Restrictions />} />} />
                  <Route path="/admin/restrictions/new" element={<ProtectedResourceRoute resource="/admin/restrictions" element={<RestrictionForm />} />} />
                  <Route path="/admin/restrictions/:restrictionId/edit" element={<ProtectedResourceRoute resource="/admin/restrictions" element={<RestrictionForm />} />} />
                  <Route path="/admin/student-level-control" element={<ProtectedResourceRoute resource="/admin/student-level-control" element={<StudentLevelControl />} />} />
                  <Route path="/admin/reset" element={<ProtectedResourceRoute resource="/admin/reset" element={<Reset />} />} />
                  <Route path="/admin/levels" element={<ProtectedResourceRoute resource="/admin/levels" element={<Levels />} />} />
                  <Route path="/admin/levels/new" element={<ProtectedResourceRoute resource="/admin/levels" element={<LevelForm />} />} />
                  <Route path="/admin/levels/:levelId/edit" element={<ProtectedResourceRoute resource="/admin/levels" element={<LevelForm />} />} />
                  <Route path="/admin/assets" element={<ProtectedResourceRoute resource="/admin/assets" element={<Assets />} />} />
                  <Route path="/admin/assets/new" element={<ProtectedResourceRoute resource="/admin/assets" element={<AssetForm />} />} />
                  <Route path="/admin/assets/:assetId/edit" element={<ProtectedResourceRoute resource="/admin/assets" element={<AssetForm />} />} />
                  <Route path="/admin/bulk-unlock" element={<ProtectedResourceRoute resource="/admin/bulk-unlock" element={<BulkUnlock />} />} />
                  <Route path="/admin/violations" element={<ProtectedResourceRoute resource="/admin/violations" element={<Violations />} />} />
                  <Route path="/admin/violations/:violationId" element={<ProtectedResourceRoute resource="/admin/violations" element={<ViolationDetail />} />} />
                  <Route path="/admin/backups" element={<ProtectedResourceRoute resource="/admin/backups" element={<Backups />} />} />
                  <Route path="/admin/backups/new" element={<ProtectedResourceRoute resource="/admin/backups" element={<BackupForm />} />} />
                  <Route path="/admin/backups/:backupId/restore" element={<ProtectedResourceRoute resource="/admin/backups" element={<BackupForm />} />} />
                  <Route path="/admin/access-control" element={<ProtectedResourceRoute resource="/admin/access-control" element={<AccessControl />} />} />
                  <Route path="/admin/assessment-control" element={<ProtectedResourceRoute resource="/admin/assessment-control" element={<AssessmentControl />} />} />
                  <Route path="/admin/audit-logs" element={<ProtectedResourceRoute resource="/admin/audit-logs" element={<AuditLogs />} />} />
                  <Route path="/admin/notifications" element={<ProtectedResourceRoute resource="/notifications" element={<Notifications />} />} />
                </Route>

                {/* Default Redirects */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </DataProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
