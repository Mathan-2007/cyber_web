const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cybernex',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

async function seed() {
  const db = await connection.getConnection();

  const adminPassword = await bcrypt.hash('admin123', 12);
  const facultyPassword = await bcrypt.hash('faculty123', 12);
  const studentPassword = await bcrypt.hash('student123', 12);

  await db.query(`
    INSERT INTO users (id, name, email, password, role, level)
    VALUES
      ('USER-001', 'Alice Admin', 'admin@cybernex.com', ?, 'admin', 12),
      ('USER-002', 'Dr. Elena Brooks', 'faculty@cybernex.com', ?, 'faculty', 10),
      ('USER-003', 'Jamal Singh', 'student@cybernex.com', ?, 'student', 4),
      ('USER-004', 'Priya Nair', 'priya@cybernex.com', ?, 'student', 3)
    ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), password = VALUES(password), role = VALUES(role), level = VALUES(level)
  `, [adminPassword, facultyPassword, studentPassword, studentPassword]);

  await db.query(`
    INSERT INTO role_resources (role, path, icon, menu, name, element, activity, sort_order)
    VALUES
      ('admin', '/dashboard', 'bxs-dashboard', TRUE, 'Dashboard', 'DashboardV2', 0, 1),
      ('admin', '/notifications', 'bx-bell', TRUE, 'Notifications', 'Notifications', 0, 2),
      ('admin', '/search', 'bx-search', FALSE, 'Search', 'SearchResults', 0, 3),
      ('admin', '/admin/dashboard', 'bxs-dashboard', TRUE, 'Admin Dashboard', 'AdminDashboard', 0, 10),
      ('admin', '/admin/users', 'bx-user', TRUE, 'Users', 'Users', 0, 11),
      ('admin', '/admin/courses', 'bxs-videos', TRUE, 'Courses Available', 'Courses', 0, 12),
      ('admin', '/admin/assessments', 'bx-file', TRUE, 'Assessments', 'FacultyAssessments', 0, 13),
      ('admin', '/admin/results', 'bx-bar-chart-alt-2', TRUE, 'Results', 'Results', 0, 14),
      ('admin', '/admin/attendance', 'bx-calendar-check', TRUE, 'Attendance', 'Attendance', 0, 15),
      ('admin', '/admin/schedule', 'bx-calendar', TRUE, 'Schedule', 'Schedule', 0, 16),
      ('admin', '/admin/faculty', 'bx-shield', TRUE, 'Faculty', 'Faculty', 0, 17),
      ('admin', '/admin/restrictions', 'bx-lock', TRUE, 'Security Management', 'Restrictions', 0, 18),
      ('admin', '/admin/student-level-control', 'bx-award', TRUE, 'Student Level Control', 'StudentLevelControl', 0, 19),
      ('admin', '/admin/reset', 'bx-reset', TRUE, 'Reset', 'Reset', 0, 20),
      ('admin', '/admin/levels', 'bx-layer', TRUE, 'Levels', 'Levels', 0, 21),
      ('admin', '/admin/assets', 'bx-data', TRUE, 'Assets', 'Assets', 0, 22),
      ('admin', '/admin/violations', 'bx-error', TRUE, 'Violations', 'Violations', 0, 23),
      ('admin', '/admin/backups', 'bx-database', TRUE, 'Backups', 'Backups', 0, 24),
      ('admin', '/admin/access-control', 'bx-lock-alt', TRUE, 'Access Control', 'AccessControl', 0, 25),
      ('admin', '/admin/audit-logs', 'bx-file-find', TRUE, 'Audit Logs', 'AuditLogs', 0, 26),
      ('faculty', '/dashboard', 'bxs-dashboard', TRUE, 'Dashboard', 'DashboardV2', 0, 1),
      ('faculty', '/notifications', 'bx-bell', TRUE, 'Notifications', 'Notifications', 0, 2),
      ('faculty', '/search', 'bx-search', FALSE, 'Search', 'SearchResults', 0, 3),
      ('faculty', '/faculty/dashboard', 'bxs-dashboard', TRUE, 'Faculty Dashboard', 'FacultyDashboard', 0, 10),
      ('faculty', '/faculty/students', 'bx-user', TRUE, 'Students', 'FacultyStudents', 0, 11),
      ('faculty', '/faculty/courses', 'bxs-videos', TRUE, 'Courses', 'FacultyCourses', 0, 12),
      ('faculty', '/faculty/practice', 'bx-book-reader', TRUE, 'Practice', 'FacultyPractice', 0, 13),
      ('faculty', '/faculty/assessments', 'bx-file', TRUE, 'Assessments', 'FacultyAssessments', 0, 14),
      ('faculty', '/faculty/results', 'bx-bar-chart-alt-2', TRUE, 'Results', 'FacultyResults', 0, 15),
      ('faculty', '/faculty/attendance', 'bx-calendar-check', TRUE, 'Attendance', 'FacultyAttendance', 0, 16),
      ('faculty', '/faculty/schedule', 'bx-calendar', TRUE, 'Schedule', 'FacultySchedule', 0, 17),
      ('faculty', '/faculty/violations', 'bx-shield', TRUE, 'Violations', 'FacultyViolations', 0, 18),
      ('student', '/dashboard', 'bxs-dashboard', TRUE, 'Dashboard', 'DashboardV2', 0, 1),
      ('student', '/notifications', 'bx-bell', TRUE, 'Notifications', 'Notifications', 0, 2),
      ('student', '/search', 'bx-search', FALSE, 'Search', 'SearchResults', 0, 3),
      ('student', '/student/dashboard', 'bxs-dashboard', TRUE, 'Student Dashboard', 'StudentDashboard', 0, 10),
      ('student', '/student/learning', 'bx-book-open', TRUE, 'Learning', 'Learning', 0, 11),
      ('student', '/student/roadmap', 'bx-route', TRUE, 'Roadmap', 'Roadmap', 0, 12),
      ('student', '/student/practice', 'bx-beaker', TRUE, 'Practice Labs', 'PracticeLabs', 0, 13),
      ('student', '/student/assessments', 'bx-file', TRUE, 'Assessments', 'StudentAssessments', 0, 14),
      ('student', '/student/progress', 'bx-trending-up', TRUE, 'Progress', 'StudentProgress', 0, 15),
      ('student', '/student/results', 'bx-bar-chart-alt-2', TRUE, 'Results', 'StudentResults', 0, 16),
      ('student', '/student/attendance', 'bx-calendar-check', TRUE, 'Attendance', 'StudentAttendance', 0, 17),
      ('student', '/student/schedule', 'bx-calendar', TRUE, 'Schedule', 'StudentSchedule', 0, 18)
    ON DUPLICATE KEY UPDATE icon = VALUES(icon), menu = VALUES(menu), name = VALUES(name), element = VALUES(element), activity = VALUES(activity), sort_order = VALUES(sort_order)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS roadmap (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      section_name VARCHAR(255) NOT NULL DEFAULT 'Overview',
      subtopic VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    INSERT INTO roadmap (title, section_name, subtopic)
    SELECT * FROM (
      SELECT 'Foundation' AS title, 'Fundamentals' AS section_name, 'Computer & Security Fundamentals' AS subtopic
      UNION ALL SELECT 'Foundation', 'Fundamentals', 'Operating Systems'
      UNION ALL SELECT 'Foundation', 'Fundamentals', 'Internet Fundamentals'
      UNION ALL SELECT 'Cybersecurity Core', 'Core Skills', 'Security Fundamentals'
      UNION ALL SELECT 'Cybersecurity Core', 'Core Skills', 'Networking'
      UNION ALL SELECT 'Cybersecurity Core', 'Core Skills', 'Linux'
      UNION ALL SELECT 'Cybersecurity Core', 'Core Skills', 'Windows'
      UNION ALL SELECT 'Cybersecurity Core', 'Core Skills', 'Web Security'
      UNION ALL SELECT 'Security Analyst', 'Operations', 'SOC Fundamentals'
      UNION ALL SELECT 'Security Analyst', 'Operations', 'SIEM'
      UNION ALL SELECT 'Security Analyst', 'Operations', 'Log Analysis'
      UNION ALL SELECT 'Security Analyst', 'Operations', 'Threat Intelligence'
      UNION ALL SELECT 'Penetration Tester', 'Offensive Security', 'Reconnaissance'
      UNION ALL SELECT 'Penetration Tester', 'Offensive Security', 'Web Application Security'
      UNION ALL SELECT 'Penetration Tester', 'Offensive Security', 'API Security'
      UNION ALL SELECT 'Penetration Tester', 'Offensive Security', 'Privilege Escalation'
      UNION ALL SELECT 'Security Engineer', 'Engineering', 'Infrastructure Security'
      UNION ALL SELECT 'Security Engineer', 'Engineering', 'Cloud Security'
      UNION ALL SELECT 'Security Engineer', 'Engineering', 'IAM & Access Control'
      UNION ALL SELECT 'Security Engineer', 'Engineering', 'DevSecOps'
      UNION ALL SELECT 'AI Security', 'Advanced Topics', 'LLM Fundamentals'
      UNION ALL SELECT 'AI Security', 'Advanced Topics', 'Prompt Injection'
      UNION ALL SELECT 'AI Security', 'Advanced Topics', 'AI Red Teaming'
      UNION ALL SELECT 'AI Security', 'Advanced Topics', 'Secure AI Pipelines'
    ) AS roadmap_seed
    WHERE NOT EXISTS (
      SELECT 1 FROM roadmap WHERE roadmap.title = roadmap_seed.title AND roadmap.section_name = roadmap_seed.section_name AND roadmap.subtopic = roadmap_seed.subtopic
    )
  `);

  await db.query(`
    INSERT INTO courses (id, title, category, domain, description, level, xp, duration, prerequisites, learning_outcomes)
    VALUES
      ('COURSE-SQLI-001', 'SQL Injection Fundamentals', 'web', 'Web Security', 'Learn how SQL injection works and how to prevent it.', 'Beginner', 150, 90, JSON_ARRAY(), JSON_ARRAY('Identify injection patterns', 'Use prepared statements', 'Explain attack impact')),
      ('COURSE-LIN-001', 'Linux Fundamentals', 'linux', 'Linux', 'Core Linux commands, file permissions, and command-line workflows.', 'Beginner', 180, 120, JSON_ARRAY(), JSON_ARRAY('Use shell commands', 'Understand permissions', 'Troubleshoot basic issues')),
      ('COURSE-NET-001', 'Networking Security', 'networking', 'Network Security', 'Understand network protocols and security controls.', 'Intermediate', 220, 150, JSON_ARRAY(), JSON_ARRAY('Understand TCP/IP', 'Inspect traffic', 'Apply defenses'))
    ON DUPLICATE KEY UPDATE title = VALUES(title), category = VALUES(category), domain = VALUES(domain), description = VALUES(description), level = VALUES(level), xp = VALUES(xp), duration = VALUES(duration), prerequisites = VALUES(prerequisites), learning_outcomes = VALUES(learning_outcomes)
  `);

  await db.query(`
    INSERT INTO lessons (id, course_id, title, section, type, duration, content, video_url, resources)
    VALUES
      ('LESSON-SQLI-1', 'COURSE-SQLI-001', 'Understanding SQL injection', 'Introduction', 'reading', 15, '<h2>Understanding SQL injection</h2><p>SQL injection occurs when untrusted input is inserted into a SQL query without proper validation or prepared statements. Attackers can modify the logic of the query to bypass authentication or read sensitive data.</p>', '', JSON_ARRAY('[{"title":"OWASP SQL Injection Guide","url":"https://owasp.org/www-community/attacks/SQL_Injection"}]')),
      ('LESSON-SQLI-2', 'COURSE-SQLI-001', 'Preventing SQL injection', 'Security Controls', 'reading', 20, '<h2>Preventing SQL injection</h2><p>Use parameterized queries, input validation, and least privilege access.</p>', '', JSON_ARRAY()),
      ('LESSON-LIN-1', 'COURSE-LIN-001', 'Linux Shell Basics', 'Introduction', 'video', 18, '<h2>Linux Shell Basics</h2><p>Learn the command line structure, environment, and shell basics.</p>', 'https://example.com/video', JSON_ARRAY()),
      ('LESSON-NET-1', 'COURSE-NET-001', 'TCP/IP Fundamentals', 'Core Concepts', 'reading', 25, '<h2>TCP/IP Fundamentals</h2><p>Understand how packets move across a network.</p>', '', JSON_ARRAY())
    ON DUPLICATE KEY UPDATE course_id = VALUES(course_id), title = VALUES(title), section = VALUES(section), type = VALUES(type), duration = VALUES(duration), content = VALUES(content), video_url = VALUES(video_url), resources = VALUES(resources)
  `);

  await db.query(`
    INSERT INTO labs (id, course_id, title, description, difficulty, estimated_time)
    VALUES
      ('LAB-SQLI-1', 'COURSE-SQLI-001', 'Injection lab', 'Practice identifying SQL injection vulnerabilities in a controlled environment.', 'Medium', 35),
      ('LAB-LIN-1', 'COURSE-LIN-001', 'Permission lab', 'Practice permission management and command chaining tasks.', 'Easy', 25)
    ON DUPLICATE KEY UPDATE course_id = VALUES(course_id), title = VALUES(title), description = VALUES(description), difficulty = VALUES(difficulty), estimated_time = VALUES(estimated_time)
  `);

  await db.query(`
    INSERT INTO assessments (id, title, description, domain, type, difficulty, duration, passing_score, total_questions)
    VALUES
      ('ASSESSMENT-SQLI-01', 'SQL Injection Assessment', 'Validate your knowledge of injection patterns and prevention.', 'Web Security', 'quiz', 'Medium', 45, 70, 5),
      ('ASSESSMENT-LIN-01', 'Linux Assessment', 'Check Linux command and privilege concepts.', 'Linux', 'quiz', 'Easy', 30, 70, 5)
    ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), domain = VALUES(domain), type = VALUES(type), difficulty = VALUES(difficulty), duration = VALUES(duration), passing_score = VALUES(passing_score), total_questions = VALUES(total_questions)
  `);

  await db.query(`
    INSERT INTO results (id, student_id, assessment_id, student_name, score, total_points, percentage, status)
    VALUES
      ('RESULT-001', 'USER-003', 'ASSESSMENT-SQLI-01', 'Jamal Singh', 4, 5, 80, 'passed'),
      ('RESULT-002', 'USER-004', 'ASSESSMENT-LIN-01', 'Priya Nair', 3, 5, 60, 'failed')
    ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), assessment_id = VALUES(assessment_id), student_name = VALUES(student_name), score = VALUES(score), total_points = VALUES(total_points), percentage = VALUES(percentage), status = VALUES(status)
  `);

  await db.query(`
    INSERT INTO settings (key_name, value)
    VALUES
      ('app_name', JSON_OBJECT('value', 'CyberNEX')),
      ('auto_backup', JSON_OBJECT('enabled', true))
    ON DUPLICATE KEY UPDATE value = VALUES(value)
  `);

  console.log('Seed data inserted successfully.');
  db.release();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
