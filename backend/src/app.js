const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'cybernex-secret-key';

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

const verifyPassword = async (providedPassword, storedPassword) => {
  if (!providedPassword || !storedPassword) return false;

  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(providedPassword, storedPassword);
  }

  const normalizedProvided = String(providedPassword).trim();
  const normalizedStored = String(storedPassword).trim();

  return (
    normalizedStored === normalizedProvided ||
    normalizedStored.toLowerCase() === normalizedProvided.toLowerCase()
  );
};

const migrateLegacyPasswordIfNeeded = async (user, providedPassword) => {
  if (!user || !providedPassword || isBcryptHash(user.password)) return false;

  const normalizedProvided = String(providedPassword).trim();
  const normalizedStored = String(user.password || '').trim();
  const legacyMatches = normalizedStored === normalizedProvided ||
    normalizedStored.toLowerCase() === normalizedProvided.toLowerCase();

  if (!legacyMatches) return false;

  const hash = await bcrypt.hash(normalizedProvided, 12);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
  return true;
};

const fetchRoleResources = async (role = 'student') => {
  const [rows] = await pool.query(
    'SELECT * FROM role_resources WHERE role = ? ORDER BY sort_order ASC, id ASC',
    [role]
  );

  return rows.map((row) => ({
    id: row.id,
    path: row.path,
    icon: row.icon || '',
    menu: Boolean(row.menu),
    name: row.name || row.path,
    element: row.element || '',
    activity: Number(row.activity || 0)
  }));
};

const normalizeResourceItem = (resource) => {
  if (!resource) return null;

  if (typeof resource === 'string') {
    return {
      id: resource,
      path: resource,
      icon: '',
      menu: false,
      name: resource,
      element: '',
      activity: 0
    };
  }

  if (typeof resource === 'object') {
    const path = resource.path || resource.name || resource.element || '/';
    return {
      id: resource.id ?? path,
      path,
      icon: resource.icon || '',
      menu: Boolean(resource.menu),
      name: resource.name || path,
      element: resource.element || '',
      activity: Number(resource.activity ?? 0)
    };
  }

  return null;
};

const resolveUserResources = async (user = {}) => {
  const role = user.role || 'student';
  const defaultResources = await fetchRoleResources(role);
  const userResources = Array.isArray(user.resources) ? user.resources : [];
  const merged = new Map();

  [...defaultResources, ...userResources].forEach((resource) => {
    const normalized = normalizeResourceItem(resource);
    if (!normalized || !normalized.path) return;
    merged.set(normalized.path, normalized);
  });

  return [...merged.values()];
};

const createToken = (user) => jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role
  },
  JWT_SECRET,
  { expiresIn: '8h' }
);

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie || '';
  const cookieToken = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('cybernex_token='));
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : (cookieToken ? decodeURIComponent(cookieToken.split('=')[1]) : null);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

const withAuth = (router) => {
  router.use(requireAuth);
  return router;
};

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0]?.ok === 1 ? 'connected' : 'disconnected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await verifyPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await migrateLegacyPasswordIfNeeded(user, password);

    const authUser = sanitizeUser(user);
    const resources = await resolveUserResources(authUser);
    const permissions = resources.map((resource) => resource.path);
    const token = createToken({ ...user });

    res.cookie('cybernex_token', token, {
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 8 * 60 * 60 * 1000,
      httpOnly: false
    });

    return res.json({
      token,
      user: {
        ...authUser,
        resources,
        user_id: authUser.id,
        user_name: authUser.name,
        department: authUser.department || 'Computer Science and Engineering'
      },
      user_id: authUser.id,
      user_name: authUser.name,
      department: authUser.department || 'Computer Science and Engineering',
      resources,
      permissions,
      message: 'Login successful'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('cybernex_token', { path: '/' });
  return res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const authUser = sanitizeUser(user);
    const resources = await resolveUserResources(authUser);
    const permissions = resources.map((resource) => resource.path);
    return res.json({
      user: {
        ...authUser,
        resources,
        user_id: authUser.id,
        user_name: authUser.name,
        department: authUser.department || 'Computer Science and Engineering'
      },
      user_id: authUser.id,
      user_name: authUser.name,
      department: authUser.department || 'Computer Science and Engineering',
      resources,
      permissions
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch current user', error: error.message });
  }
});

app.post('/api/auth/register', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { id, name, email, password, role = 'student', level = 1 } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userId = id || `USER-${Date.now()}`;
    const passwordHash = await bcrypt.hash(String(password), 12);

    const [result] = await pool.query(
      'INSERT INTO users (id, name, email, password, role, level, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, role, level, 'active']
    );

    return res.status(201).json({
      id: userId,
      message: 'User created successfully',
      user: { id: userId, name, email, role, level }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

const protectedApi = express.Router();
withAuth(protectedApi);

protectedApi.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

protectedApi.get('/roadmap', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM roadmap ORDER BY layer ASC, path_order ASC, section_order ASC, subtopic_order ASC, id ASC'
    );

    const pathMap = new Map();

    rows.forEach((row) => {
      const title = String(row.title || 'Untitled path').trim() || 'Untitled path';
      const layer = Number(row.layer ?? 1);
      const pathOrder = Number(row.path_order ?? 1);
      const parentPathId = row.parent_path_id === null || row.parent_path_id === undefined ? null : Number(row.parent_path_id);
      const sectionOrder = Number(row.section_order ?? 1);
      const sectionName = String(row.section_name || 'Overview').trim() || 'Overview';
      const topicTitle = String(row.subtopic || 'Untitled topic').trim() || 'Untitled topic';
      const pathKey = `${title}|${layer}|${pathOrder}|${parentPathId ?? 'root'}`;

      if (!pathMap.has(pathKey)) {
        pathMap.set(pathKey, {
          id: Number(row.id),
          title,
          layer,
          path_order: pathOrder,
          parent_path_id: parentPathId,
          sections: new Map(),
          children: new Set(),
          topicCount: 0,
          anchor_id: Number(row.id)
        });
      }

      const pathEntry = pathMap.get(pathKey);
      pathEntry.id = Math.min(pathEntry.id, Number(row.id));
      if (parentPathId !== null) {
        pathEntry.parent_path_id = parentPathId;
      }

      const sectionKey = `${sectionOrder}|${sectionName}`;
      if (!pathEntry.sections.has(sectionKey)) {
        pathEntry.sections.set(sectionKey, {
          id: `${pathEntry.id}-section-${sectionOrder}`,
          order: sectionOrder,
          title: sectionName,
          topics: []
        });
      }

      pathEntry.sections.get(sectionKey).topics.push({
        id: Number(row.id),
        title: topicTitle,
        order: Number(row.subtopic_order ?? 1),
        status: 'open'
      });
      pathEntry.topicCount += 1;
    });

    const paths = Array.from(pathMap.values())
      .map((path) => {
        const sectionList = Array.from(path.sections.values())
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((section) => ({
            id: section.id,
            title: section.title,
            order: Number(section.order ?? 1),
            topics: section.topics
              .slice()
              .sort((a, b) => Number(a.order) - Number(b.order))
              .map((topic) => ({
                id: topic.id,
                title: topic.title,
                order: Number(topic.order ?? 1),
                status: topic.status || 'open'
              }))
          }));

        const normalized = {
          id: Number(path.id),
          title: path.title,
          layer: Number(path.layer ?? 1),
          path_order: Number(path.path_order ?? 1),
          parent_path_id: path.parent_path_id,
          summary: `Explore the ${path.title} path through ${sectionList.length} sections and ${path.topicCount} learning topics.`,
          sections: sectionList,
          children: []
        };

        return normalized;
      })
      .sort((a, b) => Number(a.layer) - Number(b.layer) || Number(a.path_order) - Number(b.path_order));

    const pathIndex = new Map(paths.map((path) => [Number(path.id), path]));
    paths.forEach((path) => {
      if (path.parent_path_id !== null) {
        const parent = pathIndex.get(Number(path.parent_path_id));
        if (parent && !parent.children.includes(path.id)) {
          parent.children.push(path.id);
        }
      }
    });

    const record = {
      paths,
      totalPaths: paths.length,
      totalTopics: rows.length,
      message: rows.length ? 'Roadmap loaded successfully' : 'No roadmap topics available'
    };

    return res.json(record);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch roadmap',
      error: error.message,
      paths: [],
      totalTopics: 0,
      totalPaths: 0
    });
  }
});

protectedApi.post('/users/bulk', requireRole('admin'), async (req, res) => {
  try {
    const rawUsers = Array.isArray(req.body) ? req.body : (req.body?.users || []);

    if (!Array.isArray(rawUsers) || rawUsers.length === 0) {
      return res.status(400).json({ message: 'At least one user is required for bulk import' });
    }

    const createdUsers = [];

    for (const item of rawUsers) {
      const name = String(item?.name || '').trim();
      const email = String(item?.email || '').trim();
      const role = ['admin', 'faculty', 'student'].includes(item?.role) ? item.role : 'student';
      const status = ['active', 'inactive', 'pending'].includes(item?.status) ? item.status : 'active';
      const level = Number(item?.level) || 1;
      const password = String(item?.password || 'TempPass123!');

      if (!name || !email) {
        continue;
      }

      const finalPassword = String(password || 'TempPass123!');
      const userId = item?.id || `USER-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      await pool.query(
        'INSERT INTO users (id, name, email, password, role, level, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, name, email, finalPassword, role, level, status]
      );

      createdUsers.push({ id: userId, name, email, role, level, status });
    }

    if (!createdUsers.length) {
      return res.status(400).json({ message: 'No valid users were imported. Check the required fields: name and email.' });
    }

    return res.status(201).json({
      users: createdUsers,
      count: createdUsers.length,
      message: `${createdUsers.length} user(s) created successfully`
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to import users', error: error.message });
  }
});

protectedApi.post('/users', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, name, email, password, role = 'student', level = 1, status = 'active' } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const userId = id || `USER-${Date.now()}`;
    const finalPassword = password || 'tempPassword';
    const hashedPassword = await bcrypt.hash(String(finalPassword), 12);

    const [result] = await pool.query(
      'INSERT INTO users (id, name, email, password, role, level, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, level, status]
    );

    return res.status(201).json({ user: { id: userId, name, email, role, level, status }, message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

protectedApi.put('/users/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { name, email, role, level, status } = req.body || {};
    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }
    if (role !== undefined) { updates.push('role = ?'); values.push(role); }
    if (level !== undefined) { updates.push('level = ?'); values.push(level); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }

    if (!updates.length) return res.status(400).json({ message: 'No user fields provided' });

    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

protectedApi.delete('/users/:id', requireRole('admin'), async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const targetUserId = req.params.id;
    const getUserChildTables = async () => {
      const [rows] = await connection.query(
        `SELECT TABLE_NAME, COLUMN_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = DATABASE()
           AND REFERENCED_TABLE_NAME = 'users'
           AND REFERENCED_COLUMN_NAME = 'id'`
      );
      return rows;
    };

    await connection.beginTransaction();

    const childTables = await getUserChildTables();
    for (const { TABLE_NAME, COLUMN_NAME } of childTables) {
      const safeTable = TABLE_NAME.replace(/[^A-Za-z0-9_]/g, '');
      const safeColumn = COLUMN_NAME.replace(/[^A-Za-z0-9_]/g, '');
      if (!safeTable || !safeColumn) continue;
      await connection.query(
        `DELETE FROM \`${safeTable}\` WHERE \`${safeColumn}\` = ?`,
        [targetUserId]
      );
    }

    await connection.query('DELETE FROM users WHERE id = ?', [targetUserId]);

    await connection.commit();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed during user deletion:', rollbackError);
      }
    }

    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  } finally {
    connection.release();
  }
});

protectedApi.get('/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

protectedApi.get('/courses/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Course not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
});

protectedApi.post('/courses', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, title, category, domain, description, level, xp = 0, duration = 0 } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Course title is required' });

    const courseId = id || `COURSE-${Date.now()}`;
    await pool.query(
      'INSERT INTO courses (id, title, category, domain, description, level, xp, duration, prerequisites, learning_outcomes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(), JSON_ARRAY())',
      [courseId, title, category || 'general', domain || 'General', description || '', level || 'Beginner', xp, duration]
    );

    res.status(201).json({ id: courseId, message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
});

protectedApi.put('/courses/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { title, category, domain, description, level, xp, duration } = req.body || {};
    await pool.query(
      'UPDATE courses SET title = ?, category = ?, domain = ?, description = ?, level = ?, xp = ?, duration = ? WHERE id = ?',
      [title, category, domain, description, level, xp, duration, req.params.id]
    );
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
});

protectedApi.delete('/courses/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
});

protectedApi.get('/lessons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lessons ORDER BY created_at ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lessons', error: error.message });
  }
});

protectedApi.get('/lessons/:courseId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lessons WHERE course_id = ? ORDER BY created_at ASC', [req.params.courseId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lessons for course', error: error.message });
  }
});

protectedApi.get('/labs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM labs ORDER BY created_at ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch labs', error: error.message });
  }
});

protectedApi.get('/assessments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assessments ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assessments', error: error.message });
  }
});

protectedApi.post('/assessments', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, title, description, domain, type, difficulty, duration, passing_score, total_questions } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Assessment title is required' });

    const assessmentId = id || `ASSESSMENT-${Date.now()}`;
    await pool.query(
      'INSERT INTO assessments (id, title, description, domain, type, difficulty, duration, passing_score, total_questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [assessmentId, title, description || '', domain || 'General', type || 'quiz', difficulty || 'medium', duration || 60, passing_score || 70, total_questions || 5]
    );

    res.status(201).json({ id: assessmentId, message: 'Assessment created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assessment', error: error.message });
  }
});

protectedApi.put('/assessments/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { title, description, domain, type, difficulty, duration, passing_score, total_questions } = req.body || {};
    await pool.query(
      'UPDATE assessments SET title = ?, description = ?, domain = ?, type = ?, difficulty = ?, duration = ?, passing_score = ?, total_questions = ? WHERE id = ?',
      [title, description, domain, type, difficulty, duration, passing_score, total_questions, req.params.id]
    );
    res.json({ message: 'Assessment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update assessment', error: error.message });
  }
});

protectedApi.delete('/assessments/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM assessments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete assessment', error: error.message });
  }
});

protectedApi.get('/results', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM results ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch results', error: error.message });
  }
});

protectedApi.post('/results', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const { id, student_id, assessment_id, student_name, score, total_points, percentage, status = 'pending' } = req.body || {};
    const resultId = id || `RESULT-${Date.now()}`;
    await pool.query(
      'INSERT INTO results (id, student_id, assessment_id, student_name, score, total_points, percentage, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [resultId, student_id, assessment_id, student_name, score, total_points, percentage, status]
    );
    res.status(201).json({ id: resultId, message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save result', error: error.message });
  }
});

protectedApi.get('/attendance', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM attendance ORDER BY date DESC, created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
});

protectedApi.post('/attendance', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, student_id, date, status, remarks } = req.body || {};
    const attendanceId = id || `ATT-${Date.now()}`;
    await pool.query(
      'INSERT INTO attendance (id, student_id, date, status, remarks) VALUES (?, ?, ?, ?, ?)',
      [attendanceId, student_id, date, status || 'present', remarks || '']
    );
    res.status(201).json({ id: attendanceId, message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record attendance', error: error.message });
  }
});

protectedApi.get('/schedules', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules ORDER BY date_time ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedules', error: error.message });
  }
});

protectedApi.post('/schedules', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, title, date_time, location, type } = req.body || {};
    const scheduleId = id || `SCH-${Date.now()}`;
    await pool.query(
      'INSERT INTO schedules (id, title, date_time, location, type) VALUES (?, ?, ?, ?, ?)',
      [scheduleId, title, date_time, location || '', type || 'session']
    );
    res.status(201).json({ id: scheduleId, message: 'Schedule created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create schedule', error: error.message });
  }
});

protectedApi.get('/violations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM violations ORDER BY detected_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch violations', error: error.message });
  }
});

protectedApi.get('/violations/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM violations WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Violation not found' });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch violation', error: error.message });
  }
});

protectedApi.post('/violations', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, student_id, assessment_id, type, severity, status = 'open', note } = req.body || {};
    const violationId = id || `VIOL-${Date.now()}`;
    await pool.query(
      'INSERT INTO violations (id, student_id, assessment_id, type, severity, status, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [violationId, student_id, assessment_id, type, severity, status, note || '']
    );
    res.status(201).json({ id: violationId, message: 'Violation recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record violation', error: error.message });
  }
});

protectedApi.put('/violations/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const updates = [];
    const values = [];

    const { status, resolved_by, resolved_at, action_taken, note } = req.body || {};
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (resolved_by !== undefined) { updates.push('resolved_by = ?'); values.push(resolved_by); }
    if (resolved_at !== undefined) { updates.push('resolved_at = ?'); values.push(resolved_at); }
    if (action_taken !== undefined) { updates.push('action_taken = ?'); values.push(action_taken); }
    if (note !== undefined) { updates.push('note = ?'); values.push(note); }

    if (!updates.length) return res.status(400).json({ message: 'No fields provided to update' });

    await pool.query(`UPDATE violations SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    return res.json({ message: 'Violation updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update violation', error: error.message });
  }
});

protectedApi.delete('/violations/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM violations WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Violation deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete violation', error: error.message });
  }
});

protectedApi.get('/notifications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

protectedApi.post('/notifications', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const { id, user_id, title, message, is_read = false } = req.body || {};
    const notificationId = id || `NOTIF-${Date.now()}`;
    await pool.query(
      'INSERT INTO notifications (id, user_id, title, message, is_read) VALUES (?, ?, ?, ?, ?)',
      [notificationId, user_id, title, message, is_read]
    );
    res.status(201).json({ id: notificationId, message: 'Notification created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

protectedApi.get('/audit-logs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
});

protectedApi.get('/audit-logs/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Audit log not found' });
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch audit log', error: error.message });
  }
});

protectedApi.get('/restrictions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings ORDER BY updated_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restrictions', error: error.message });
  }
});

protectedApi.get('/faculty', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', ['faculty']);
    res.json(rows.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch faculty', error: error.message });
  }
});

protectedApi.get('/student-groups', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', ['student']);
    res.json(rows.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student groups', error: error.message });
  }
});

protectedApi.get('/dashboard', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [courses] = await pool.query('SELECT COUNT(*) AS total FROM courses');
    const [assessments] = await pool.query('SELECT COUNT(*) AS total FROM assessments');
    const [results] = await pool.query('SELECT AVG(percentage) AS average_score FROM results');

    res.json({
      users: users[0]?.total || 0,
      courses: courses[0]?.total || 0,
      assessments: assessments[0]?.total || 0,
      averageScore: Number(results[0]?.average_score || 0).toFixed(0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
});

protectedApi.get('/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT key_name, value FROM settings');
    const settings = {};
    rows.forEach((row) => {
      settings[row.key_name] = row.value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
});

protectedApi.post('/settings', requireRole('admin'), async (req, res) => {
  try {
    const entries = req.body || {};
    const keys = Object.keys(entries);

    for (const keyName of keys) {
      await pool.query('INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [keyName, JSON.stringify(entries[keyName])]);
    }

    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save settings', error: error.message });
  }
});

protectedApi.get('/backups', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM backups ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch backups', error: error.message });
  }
});

protectedApi.get('/role-resources', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM role_resources ORDER BY role, sort_order ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch role resources', error: error.message });
  }
});

protectedApi.put('/role-resources/:role', requireRole('admin'), async (req, res) => {
  try {
    const role = String(req.params.role || '').toLowerCase();
    const allowedRoles = ['admin', 'faculty', 'student'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided for resource update' });
    }

    const rawResources = Array.isArray(req.body?.resources) ? req.body.resources : (Array.isArray(req.body) ? req.body : []);

    const normalizedResources = rawResources
      .map((resource, index) => {
        if (typeof resource === 'string') {
          return {
            path: resource,
            icon: '',
            menu: false,
            name: resource,
            element: resource,
            activity: 0,
            sort_order: index + 1,
          };
        }

        const path = resource?.path || resource?.name || resource?.element || '';
        if (!path) return null;

        return {
          path,
          icon: resource?.icon || '',
          menu: Boolean(resource?.menu),
          name: resource?.name || path,
          element: resource?.element || path,
          activity: Number(resource?.activity ?? 0),
          sort_order: Number(resource?.sort_order ?? index + 1),
        };
      })
      .filter(Boolean);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM role_resources WHERE role = ?', [role]);

      for (const resource of normalizedResources) {
        await connection.query(
          'INSERT INTO role_resources (role, path, icon, menu, name, element, activity, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [role, resource.path, resource.icon, resource.menu ? 1 : 0, resource.name, resource.element, resource.activity, resource.sort_order]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    const [rows] = await pool.query('SELECT * FROM role_resources WHERE role = ? ORDER BY sort_order ASC, id ASC', [role]);
    return res.json({ role, resources: rows });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update role resources', error: error.message });
  }
});

// ===== Assessment Questions =====
protectedApi.get('/assessment-questions/:assessmentId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assessment_questions WHERE assessment_id = ? ORDER BY created_at ASC', [req.params.assessmentId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assessment questions', error: error.message });
  }
});

protectedApi.post('/assessment-questions', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, assessment_id, question_text, question_type = 'multiple-choice', options = [], correct_answer = null, difficulty = 'medium', points = 1 } = req.body || {};
    if (!assessment_id || !question_text) return res.status(400).json({ message: 'assessment_id and question_text are required' });
    const qid = id || `Q-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    await pool.query('INSERT INTO assessment_questions (id, assessment_id, question_text, question_type, options, correct_answer, difficulty, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [qid, assessment_id, question_text, question_type, JSON.stringify(options), correct_answer, difficulty, points]);
    res.status(201).json({ id: qid, message: 'Question created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
});

protectedApi.put('/assessment-questions/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { question_text, question_type, options, correct_answer, difficulty, points } = req.body || {};
    const updates = [];
    const values = [];
    if (question_text !== undefined) { updates.push('question_text = ?'); values.push(question_text); }
    if (question_type !== undefined) { updates.push('question_type = ?'); values.push(question_type); }
    if (options !== undefined) { updates.push('options = ?'); values.push(JSON.stringify(options)); }
    if (correct_answer !== undefined) { updates.push('correct_answer = ?'); values.push(correct_answer); }
    if (difficulty !== undefined) { updates.push('difficulty = ?'); values.push(difficulty); }
    if (points !== undefined) { updates.push('points = ?'); values.push(points); }
    if (!updates.length) return res.status(400).json({ message: 'No fields provided' });
    await pool.query(`UPDATE assessment_questions SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    res.json({ message: 'Question updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
});

protectedApi.delete('/assessment-questions/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM assessment_questions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
});

// ===== Assessment Sessions, Attempts, and Answers =====
protectedApi.get('/assessment-sessions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assessment_sessions ORDER BY started_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assessment sessions', error: error.message });
  }
});

protectedApi.post('/assessment-sessions', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, assessment_id, is_live = true, started_by = req.user?.id || 'system', started_at = null, ends_at = null, time_limit_override = null, full_screen_required = false, max_violations = null, questions_per_attempt = null } = req.body || {};
    if (!assessment_id) return res.status(400).json({ message: 'assessment_id is required' });
    const sid = id || `SESSION-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    await pool.query('INSERT INTO assessment_sessions (id, assessment_id, is_live, started_by, started_at, ends_at, time_limit_override, full_screen_required, max_violations, questions_per_attempt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [sid, assessment_id, is_live ? 1 : 0, started_by, started_at, ends_at, time_limit_override, full_screen_required ? 1 : 0, max_violations, questions_per_attempt]);
    res.status(201).json({ id: sid, message: 'Session started' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create assessment session', error: error.message });
  }
});

protectedApi.put('/assessment-sessions/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { is_live, ends_at, time_limit_override, full_screen_required, max_violations, questions_per_attempt } = req.body || {};
    const updates = [];
    const values = [];
    if (is_live !== undefined) { updates.push('is_live = ?'); values.push(is_live ? 1 : 0); }
    if (ends_at !== undefined) { updates.push('ends_at = ?'); values.push(ends_at); }
    if (time_limit_override !== undefined) { updates.push('time_limit_override = ?'); values.push(time_limit_override); }
    if (full_screen_required !== undefined) { updates.push('full_screen_required = ?'); values.push(full_screen_required ? 1 : 0); }
    if (max_violations !== undefined) { updates.push('max_violations = ?'); values.push(max_violations); }
    if (questions_per_attempt !== undefined) { updates.push('questions_per_attempt = ?'); values.push(questions_per_attempt); }
    if (!updates.length) return res.status(400).json({ message: 'No fields provided' });
    await pool.query(`UPDATE assessment_sessions SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    res.json({ message: 'Session updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update session', error: error.message });
  }
});

protectedApi.delete('/assessment-sessions/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM assessment_sessions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session', error: error.message });
  }
});

// Attempts
protectedApi.post('/assessment-attempts', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const { id, session_id, assessment_id, student_id } = req.body || {};
    if (!assessment_id || !student_id) return res.status(400).json({ message: 'assessment_id and student_id are required' });
    // enforce access: check access_grants or live session
    const [grants] = await pool.query('SELECT * FROM access_grants WHERE student_id = ? AND assessment_id = ? LIMIT 1', [student_id, assessment_id]);
    const grant = grants[0];
    const [sessions] = await pool.query('SELECT * FROM assessment_sessions WHERE assessment_id = ? AND is_live = 1', [assessment_id]);
    const liveSession = sessions[0];
    if (!grant && !liveSession) return res.status(403).json({ message: 'No access to start attempt' });

    const attemptId = id || `ATT-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    await pool.query('INSERT INTO assessment_attempts (id, session_id, assessment_id, student_id, started_at, status) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)', [attemptId, session_id || null, assessment_id, student_id, 'in_progress']);
    res.status(201).json({ id: attemptId, message: 'Attempt started' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start attempt', error: error.message });
  }
});

protectedApi.post('/assessment-attempts/:id/submit', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const attemptId = req.params.id;
    const { answers = [], score = 0, total_points = 0, status = 'submitted' } = req.body || {};
    // Save answers
    for (const ans of answers) {
      const aid = ans.id || `ANS-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      await pool.query('INSERT INTO assessment_answers (id, attempt_id, question_id, answer, is_correct, points) VALUES (?, ?, ?, ?, ?, ?)', [aid, attemptId, ans.question_id, JSON.stringify(ans.answer), ans.is_correct ? 1 : 0, ans.points || 0]);
    }
    await pool.query('UPDATE assessment_attempts SET submitted_at = CURRENT_TIMESTAMP, status = ?, score = ?, total_points = ? WHERE id = ?', [status, score, total_points, attemptId]);
    res.json({ message: 'Attempt submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit attempt', error: error.message });
  }
});

protectedApi.get('/assessment-attempts/:attemptId/answers', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assessment_answers WHERE attempt_id = ? ORDER BY created_at ASC', [req.params.attemptId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch answers', error: error.message });
  }
});

protectedApi.post('/backups', requireRole('admin'), async (req, res) => {
  try {
    const { id, name, type = 'manual', created_by, size_mb = 0, status = 'available' } = req.body;

    const [result] = await pool.query(
      'INSERT INTO backups (id, name, type, created_by, size_mb, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id || `BACKUP-${Date.now()}`, name || 'Manual Backup', type, created_by || 'system', size_mb, status]
    );

    res.status(201).json({ id: result.insertId, message: 'Backup created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create backup', error: error.message });
  }
});

protectedApi.post('/backups/restore', requireRole('admin'), async (req, res) => {
  try {
    // NOTE: Full restore operation is intentionally performed on the server to avoid clients
    // mutating authoritative data. Implementing a complete restore requires careful
    // validation and transactional writes across many tables. For now, return a clear
    // not-implemented response so the frontend does not attempt a local restore.
    return res.status(501).json({ success: false, message: 'Server-side restore not implemented. Please run restore tooling on the server.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Restore failed', error: error.message });
  }
});

protectedApi.delete('/backups/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM backups WHERE id = ?', [req.params.id]);
    res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete backup', error: error.message });
  }
});

// ===== Access Grants (server-backed) =====
protectedApi.get('/access-grants', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM access_grants ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch access grants', error: error.message });
  }
});

protectedApi.get('/access-grants/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM access_grants WHERE student_id = ? ORDER BY created_at DESC', [req.params.studentId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch access grants for student', error: error.message });
  }
});

protectedApi.post('/access-grants', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { id, student_id, assessment_id, unlocked = true, expires_at = null } = req.body || {};
    if (!student_id || !assessment_id) return res.status(400).json({ message: 'student_id and assessment_id are required' });
    const grantId = id || `GRANT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    await pool.query(
      'INSERT INTO access_grants (id, student_id, assessment_id, unlocked, expires_at, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [grantId, student_id, assessment_id, unlocked ? 1 : 0, expires_at]
    );
    res.status(201).json({ id: grantId, message: 'Access grant created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create access grant', error: error.message });
  }
});

protectedApi.put('/access-grants/:id', requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { unlocked, expires_at } = req.body || {};
    const updates = [];
    const values = [];
    if (unlocked !== undefined) { updates.push('unlocked = ?'); values.push(unlocked ? 1 : 0); }
    if (expires_at !== undefined) { updates.push('expires_at = ?'); values.push(expires_at); }
    if (!updates.length) return res.status(400).json({ message: 'No fields provided to update' });
    await pool.query(`UPDATE access_grants SET ${updates.join(', ')} WHERE id = ?`, [...values, req.params.id]);
    res.json({ message: 'Access grant updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update access grant', error: error.message });
  }
});

protectedApi.delete('/access-grants/:id', requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM access_grants WHERE id = ?', [req.params.id]);
    res.json({ message: 'Access grant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete access grant', error: error.message });
  }
});

// ===== Audit Logs (persisted server-side) =====
protectedApi.post('/audit-logs', async (req, res) => {
  try {
    const { id, actor_id, action, entity, details } = req.body || {};
    const logId = id || `AUD-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const actor = actor_id || (req.user && req.user.id) || null;
    const detailsJson = details ? JSON.stringify(details) : null;
    await pool.query(
      'INSERT INTO audit_logs (id, actor_id, action, entity, details, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [logId, actor, action || '', entity || '', detailsJson]
    );
    res.status(201).json({ id: logId, message: 'Audit log recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record audit log', error: error.message });
  }
});

// ===== Student Progress (server-backed) =====
protectedApi.get('/student-progress/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM student_progress WHERE student_id = ? LIMIT 1', [req.params.studentId]);
    if (!rows.length) return res.json({});
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student progress', error: error.message });
  }
});

protectedApi.post('/student-progress', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const { id, student_id, course_ids = [], completed_course_ids = [], completed_lesson_ids = [] } = req.body || {};
    if (!student_id) return res.status(400).json({ message: 'student_id is required' });

    const [existing] = await pool.query('SELECT id FROM student_progress WHERE student_id = ? LIMIT 1', [student_id]);
    if (existing.length) {
      await pool.query(
        'UPDATE student_progress SET course_ids = ?, completed_course_ids = ?, completed_lesson_ids = ?, updated_at = CURRENT_TIMESTAMP WHERE student_id = ?',
        [JSON.stringify(course_ids), JSON.stringify(completed_course_ids), JSON.stringify(completed_lesson_ids), student_id]
      );
      return res.json({ message: 'Student progress updated' });
    }

    const progressId = id || `PROG-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    await pool.query(
      'INSERT INTO student_progress (id, student_id, course_ids, completed_course_ids, completed_lesson_ids, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [progressId, student_id, JSON.stringify(course_ids), JSON.stringify(completed_course_ids), JSON.stringify(completed_lesson_ids)]
    );
    res.status(201).json({ id: progressId, message: 'Student progress created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save student progress', error: error.message });
  }
});

protectedApi.put('/student-progress/:id', requireRole('admin', 'faculty', 'student'), async (req, res) => {
  try {
    const { course_ids, completed_course_ids, completed_lesson_ids } = req.body || {};
    const updates = [];
    const values = [];
    if (course_ids !== undefined) { updates.push('course_ids = ?'); values.push(JSON.stringify(course_ids)); }
    if (completed_course_ids !== undefined) { updates.push('completed_course_ids = ?'); values.push(JSON.stringify(completed_course_ids)); }
    if (completed_lesson_ids !== undefined) { updates.push('completed_lesson_ids = ?'); values.push(JSON.stringify(completed_lesson_ids)); }
    if (!updates.length) return res.status(400).json({ message: 'No fields provided to update' });
    await pool.query(`UPDATE student_progress SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [...values, req.params.id]);
    res.json({ message: 'Student progress updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student progress', error: error.message });
  }
});

app.use('/api', protectedApi);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
