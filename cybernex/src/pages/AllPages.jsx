import React from 'react';
import { Link } from 'react-router-dom';

const groups = [
  {
    title: 'Auth',
    links: [
      { to: '/login', label: 'Login' },
      { to: '/access-denied', label: 'Access Denied' },
    ]
  },
  {
    title: 'Shared',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
      { to: '/notifications', label: 'Notifications' },
      { to: '/settings', label: 'Settings' },
      { to: '/help', label: 'Help' },
      { to: '/search', label: 'Search Results' },
    ]
  },
  {
    title: 'Student',
    links: [
      { to: '/student/dashboard', label: 'Student Dashboard' },
      { to: '/student/learning', label: 'Learning' },
      { to: '/student/practice', label: 'Practice Labs' },
      { to: '/student/assessments', label: 'Assessments' },
      { to: '/student/results', label: 'Results' },
      { to: '/student/schedule', label: 'Schedule' },
    ]
  },
  {
    title: 'Faculty',
    links: [
      { to: '/faculty/dashboard', label: 'Faculty Dashboard' },
      { to: '/faculty/students', label: 'Students' },
      { to: '/faculty/courses', label: 'Courses' },
      { to: '/faculty/practice', label: 'Practice' },
    ]
  },
  {
    title: 'Admin',
    links: [
      { to: '/admin/dashboard', label: 'Admin Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/courses', label: 'Courses' },
      { to: '/admin/audit-logs', label: 'Audit Logs' },
      { to: '/admin/settings', label: 'Admin Settings' },
    ]
  }
];

export default function AllPages() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>CyberNEX — Pages Index</h1>
      <p style={{ marginBottom: 18 }}>Quick links to pages for QA. Some routes require authentication — use the login page first.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {groups.map(group => (
          <div key={group.title} style={{ border: '1px solid #e6e6e8', borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>{group.title}</h3>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {group.links.map(l => (
                <li key={l.to} style={{ marginBottom: 8 }}>
                  <Link to={l.to} style={{ color: '#2563eb' }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
