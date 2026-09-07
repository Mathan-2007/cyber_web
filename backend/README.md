# CyberNEX Backend

This backend provides the application data for the CyberNEX frontend through a MySQL-backed REST API.

## Setup

1. Create a MySQL database named `cybernex`.
2. Copy `.env.example` to `.env` and update your database credentials.
3. Install dependencies:

```bash
npm install
```

4. Import the schema:

```bash
mysql -u root -p < src/db/schema.sql
```

5. Seed the database:

```bash
npm run seed
```

6. Start the API:

```bash
npm run dev
```

## Available API endpoints

- `GET /api/health`
- `GET /api/users`
- `GET /api/courses`
- `GET /api/courses/:id`
- `GET /api/lessons`
- `GET /api/lessons/:courseId`
- `GET /api/labs`
- `GET /api/assessments`
- `GET /api/results`
- `GET /api/dashboard`
- `GET /api/settings`
- `GET /api/backups`
- `POST /api/backups`
- `DELETE /api/backups/:id`

The frontend can consume these endpoints while keeping the UI focused on presentation and interaction.
