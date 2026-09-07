const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const certPath = process.env.DB_SSL_CA || path.join(__dirname, '..', 'certs', 'aiven-ca.pem');
const sslConfig = fs.existsSync(certPath)
  ? { rejectUnauthorized: true, ca: fs.readFileSync(certPath, 'utf8') }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cybernex',
  ...(sslConfig ? { ssl: sslConfig } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports = pool;
