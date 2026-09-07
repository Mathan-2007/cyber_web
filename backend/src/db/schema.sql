CREATE DATABASE IF NOT EXISTS cybernex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cybernex;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','faculty','student') NOT NULL,
  level INT DEFAULT 1,
  avatar VARCHAR(255) DEFAULT NULL,
  status ENUM('active','inactive','pending') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('admin','faculty','student') NOT NULL,
  path VARCHAR(255) NOT NULL,
  icon VARCHAR(255) DEFAULT '',
  menu BOOLEAN DEFAULT FALSE,
  name VARCHAR(255) DEFAULT '',
  element VARCHAR(255) DEFAULT '',
  activity INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  UNIQUE KEY unique_role_path (role, path)
);

CREATE TABLE IF NOT EXISTS roadmap (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  section_name VARCHAR(255) NOT NULL DEFAULT 'Overview',
  subtopic VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  domain VARCHAR(100),
  description TEXT,
  level VARCHAR(50),
  xp INT DEFAULT 0,
  duration INT DEFAULT 0,
  prerequisites JSON DEFAULT (JSON_ARRAY()),
  learning_outcomes JSON DEFAULT (JSON_ARRAY()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(64) PRIMARY KEY,
  course_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  section VARCHAR(255),
  type VARCHAR(50) DEFAULT 'reading',
  duration INT DEFAULT 10,
  content LONGTEXT,
  video_url VARCHAR(500) DEFAULT NULL,
  resources JSON DEFAULT (JSON_ARRAY()),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS labs (
  id VARCHAR(64) PRIMARY KEY,
  course_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  estimated_time INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  domain VARCHAR(100),
  type VARCHAR(100),
  difficulty VARCHAR(50),
  duration INT DEFAULT 60,
  passing_score INT DEFAULT 70,
  total_questions INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id VARCHAR(64) PRIMARY KEY,
  assessment_id VARCHAR(64) NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple-choice',
  options JSON DEFAULT (JSON_ARRAY()),
  correct_answer VARCHAR(255),
  difficulty VARCHAR(50) DEFAULT 'medium',
  points INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  assessment_id VARCHAR(64) NOT NULL,
  student_name VARCHAR(255),
  score INT DEFAULT 0,
  total_points INT DEFAULT 0,
  percentage INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'present',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date_time DATETIME,
  location VARCHAR(255),
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS violations (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64),
  assessment_id VARCHAR(64),
  type VARCHAR(100),
  severity VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open',
  note TEXT,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS backups (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'manual',
  created_by VARCHAR(64),
  size_mb DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(255) UNIQUE NOT NULL,
  value JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  actor_id VARCHAR(64),
  action VARCHAR(255),
  entity VARCHAR(255),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS student_progress (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  course_ids JSON DEFAULT (JSON_ARRAY()),
  completed_course_ids JSON DEFAULT (JSON_ARRAY()),
  completed_lesson_ids JSON DEFAULT (JSON_ARRAY()),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS access_grants (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  assessment_id VARCHAR(64) NOT NULL,
  unlocked BOOLEAN DEFAULT TRUE,
  expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

CREATE TABLE IF NOT EXISTS assessment_sessions (
  id VARCHAR(64) PRIMARY KEY,
  assessment_id VARCHAR(64) NOT NULL,
  is_live BOOLEAN DEFAULT TRUE,
  started_by VARCHAR(64),
  started_at DATETIME,
  ends_at DATETIME,
  time_limit_override INT DEFAULT NULL,
  full_screen_required BOOLEAN DEFAULT FALSE,
  max_violations INT DEFAULT NULL,
  questions_per_attempt INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) DEFAULT NULL,
  assessment_id VARCHAR(64) NOT NULL,
  student_id VARCHAR(64) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  score INT DEFAULT 0,
  total_points INT DEFAULT 0,
  FOREIGN KEY (session_id) REFERENCES assessment_sessions(id),
  FOREIGN KEY (assessment_id) REFERENCES assessments(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assessment_answers (
  id VARCHAR(64) PRIMARY KEY,
  attempt_id VARCHAR(64) NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  answer JSON,
  is_correct BOOLEAN DEFAULT FALSE,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id),
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id)
);
