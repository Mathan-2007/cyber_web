// ===== APP CONSTANTS =====
export const APP_NAME = 'cybernex';
export const APP_VERSION = '1.0.3';
export const APP_DESCRIPTION = 'Enterprise Cybersecurity Education & Assessment Platform';

// ===== ROLES =====
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

// ===== DEPARTMENTS =====
export const DEPARTMENTS = [
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'information_technology', label: 'Information Technology' },
  { value: 'software_engineering', label: 'Software Engineering' },
  { value: 'network_engineering', label: 'Network Engineering' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'ai_ml', label: 'AI/ML' },
  { value: 'cloud_computing', label: 'Cloud Computing' },
  { value: 'general', label: 'General Studies' }
];

// ===== PERMISSIONS =====
export const PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Course Management
  COURSES_VIEW: 'courses.view',
  COURSES_CREATE: 'courses.create',
  COURSES_EDIT: 'courses.edit',
  COURSES_DELETE: 'courses.delete',

  // Practice Labs
  PRACTICE_VIEW: 'practice.view',
  PRACTICE_MANAGE: 'practice.manage',

  // Assessments
  ASSESSMENT_VIEW: 'assessment.view',
  ASSESSMENT_CREATE: 'assessment.create',
  ASSESSMENT_MANAGE: 'assessment.manage',
  ASSESSMENT_START: 'assessment.start',
  ASSESSMENT_REVIEW: 'assessment.review',

  // Results
  RESULTS_VIEW: 'results.view',
  RESULTS_MANAGE: 'results.manage',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_MANAGE: 'attendance.manage',

  // Schedule
  SCHEDULE_VIEW: 'schedule.view',
  SCHEDULE_MANAGE: 'schedule.manage',

  // Faculty
  FACULTY_VIEW: 'faculty.view',
  FACULTY_MANAGE: 'faculty.manage',

  // Assets
  ASSETS_VIEW: 'assets.view',
  ASSETS_MANAGE: 'assets.manage',

  // Restrictions
  RESTRICTIONS_VIEW: 'restrictions.view',
  RESTRICTIONS_MANAGE: 'restrictions.manage',

  // Violations
  VIOLATIONS_VIEW: 'violations.view',
  VIOLATIONS_MANAGE: 'violations.manage',

  // Backup
  BACKUP_CREATE: 'backup.create',
  BACKUP_RESTORE: 'backup.restore',

  // Access Control
  ACCESS_CONTROL_MANAGE: 'access_control.manage',

  // System
  SYSTEM_MANAGE: 'system.manage',
};

// ===== ASSESSMENT STATES =====
export const ASSESSMENT_STATES = {
  LOCKED: 'Locked',
  ELIGIBLE: 'Eligible',
  SCHEDULED: 'Scheduled',
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  PASSED: 'Passed',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

// ===== ASSESSMENT TYPES =====
export const ASSESSMENT_TYPES = {
  KNOWLEDGE: 'Knowledge Assessment',
  PRACTICAL: 'Practical Assessment',
  SCENARIO: 'Scenario Assessment',
  CAPSTONE: 'Capstone Assessment',
};

// ===== QUESTION TYPES =====
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'Multiple Choice',
  MULTIPLE_SELECT: 'Multiple Select',
  TRUE_FALSE: 'True/False',
  SHORT_ANSWER: 'Short Answer',
  FLAG_SUBMISSION: 'Flag Submission',
  ORDERING: 'Ordering',
  SCENARIO_DECISION: 'Scenario Decision',
  LOG_ANALYSIS: 'Log Analysis',
};

// ===== DIFFICULTY LEVELS =====
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert',
};

// ===== CYBERSECURITY DOMAINS =====
export const CYBER_DOMAINS = [
  'Web Security',
  'Network Security',
  'Linux',
  'Windows',
  'Cloud Security',
  'SOC',
  'Digital Forensics',
  'Pentesting',
  'Active Directory',
  'Cryptography',
  'AI Security',
  'AI Engineering',
  'DevSecOps',
];

// ===== LEVELS =====
export const LEVELS = {
  1: 'Foundation',
  2: 'Security Fundamentals',
  3: 'Web Security',
  4: 'Network Security',
  5: 'Linux',
  6: 'Windows',
  7: 'Active Directory',
  8: 'Pentesting',
  9: 'SOC',
  10: 'Digital Forensics',
  11: 'Cloud & DevSecOps',
  12: 'AI Engineering & AI Security',
};

// ===== ATTENDANCE STATUSES =====
export const ATTENDANCE_STATUSES = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
};

// ===== VIOLATION TYPES =====
export const VIOLATION_TYPES = {
  TAB_SWITCH: 'Tab Switch',
  WINDOW_BLUR: 'Window Blur',
  COPY_ATTEMPT: 'Copy Attempt',
  PASTE_ATTEMPT: 'Paste Attempt',
  MULTIPLE_LOGIN: 'Multiple Login',
  SESSION_TIMEOUT: 'Session Timeout',
};

// ===== VIOLATION SEVERITY =====
export const VIOLATION_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// ===== RESTRICTION TYPES =====
export const RESTRICTION_TYPES = {
  LOGIN_DISABLED: 'Login disabled',
  COURSE_ACCESS_DISABLED: 'Course access disabled',
  PRACTICE_DISABLED: 'Practice disabled',
  ASSESSMENT_DISABLED: 'Assessment disabled',
  EXTERNAL_RESOURCES_DISABLED: 'External resources disabled',
  ACCOUNT_SUSPENDED: 'Account suspended',
};

// ===== RESTRICTION SEVERITY =====
export const RESTRICTION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// ===== CERTIFICATE STATES =====
export const CERTIFICATE_STATES = {
  LOCKED: 'Locked',
  ELIGIBLE: 'Eligible',
  ISSUED: 'Issued',
};

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPES = {
  ASSESSMENT_UNLOCKED: 'Assessment unlocked',
  ASSESSMENT_STARTING: 'Assessment starting',
  ASSESSMENT_DEADLINE: 'Assessment deadline',
  RESULT_PUBLISHED: 'Result published',
  COURSE_ASSIGNED: 'Course assigned',
  PRACTICE_COMPLETED: 'Practice completed',
  LEVEL_INCREASED: 'Level increased',
  RESTRICTION_ADDED: 'Restriction added',
  VIOLATION_DETECTED: 'Violation detected',
  BACKUP_CREATED: 'Backup created',
};

// ===== SEARCH TYPES =====
export const SEARCH_TYPES = {
  COURSES: 'Courses',
  LESSONS: 'Lessons',
  LABS: 'Labs',
  ASSESSMENTS: 'Assessments',
  STUDENTS: 'Students',
  FACULTY: 'Faculty',
  RESULTS: 'Results',
};

// ===== PAGINATION DEFAULTS =====
export const PAGINATION_DEFAULT = {
  PAGE: 1,
  LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50, 100],
};

// ===== STORAGE KEYS =====
// Note: STORAGE_KEYS is defined later in this file with additional keys

// ===== ASSESSMENT TIME CONSTANTS =====
export const ASSESSMENT_TIME = {
  WARNING_TIMES: [30, 10, 5, 1], // Minutes before auto-submit
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds in ms
};

// ===== LEVEL PROGRESSION RULES =====
export const LEVEL_PROGRESSION = {
  MIN_LEARNING_COMPLETION: 80, // 80% learning completion required
  MIN_PRACTICE_COMPLETION: 70, // 70% practice completion required
  MIN_ASSESSMENT_SCORE: 70,     // 70% assessment score required
};

// ===== PRACTICE LAB CATEGORIES =====
export const LAB_CATEGORIES = [
  'Web',
  'Network',
  'Linux',
  'Windows',
  'Active Directory',
  'SOC',
  'Forensics',
  'Cloud',
  'AI Security',
];

// ===== EXTERNAL RESOURCE PROVIDERS =====
export const RESOURCE_PROVIDERS = [
  { id: 'thm', name: 'TryHackMe', url: 'https://tryhackme.com' },
  { id: 'htb', name: 'Hack The Box Academy', url: 'https://academy.hackthebox.com' },
  { id: 'overthewire', name: 'OverTheWire', url: 'https://overthewire.org' },
  { id: 'cybernex', name: 'CyberNex Academy', url: '/student/learning/sql-injection' },
  { id: 'owasp', name: 'OWASP', url: 'https://owasp.org' },
  { id: 'microsoft', name: 'Microsoft Learn', url: 'https://learn.microsoft.com' },
  { id: 'google', name: 'Google Cybersecurity', url: 'https://cybersecurity.google' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com' },
  { id: 'book', name: 'Book', url: '' },
  { id: 'documentation', name: 'Official Documentation', url: '' },
];

// ===== API ENDPOINTS (for future backend integration) =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: '/api/users',
  COURSES: '/api/courses',
  LESSONS: '/api/lessons',
  LABS: '/api/labs',
  ASSESSMENTS: '/api/assessments',
  RESULTS: '/api/results',
  ATTENDANCE: '/api/attendance',
  SCHEDULES: '/api/schedules',
  VIOLATIONS: '/api/violations',
  BACKUPS: '/api/backups',
  AUDIT_LOGS: '/api/audit-logs',
};

// ===== TIME FORMATS =====
export const TIME_FORMATS = {
  DATE: 'yyyy-MM-dd',
  TIME: 'HH:mm:ss',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATETIME: 'MMM dd, yyyy HH:mm',
};

// ===== FILE TYPES =====
export const FILE_TYPES = {
  PDF: 'application/pdf',
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  VIDEO: ['video/mp4', 'video/webm'],
  DOCUMENT: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// ===== MAX FILE SIZES =====
export const MAX_FILE_SIZES = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 50 * 1024 * 1024, // 50MB
};

// ===== DEFAULT AVATAR =====
export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=cybernex';

// ===== APP DEFAULT SETTINGS =====
export const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  notifications: {
    email: true,
    push: true,
    sound: true,
  },
  assessment: {
    autoSubmit: true,
    showTimer: true,
    enableProctoring: false,
  },
    dashboard: {
    widgets: ['stats', 'progress', 'recent-activity', 'quick-actions'],
  },
  language: 'en',
};

// ===== COURSE LEVEL HIERARCHY =====
export const COURSE_LEVELS = [
  {
    level: 1,
    name: 'Foundation',
    description: 'Basic computer and networking fundamentals',
    courses: [
      'Computer Fundamentals',
      'Networking Fundamentals',
      'Linux Fundamentals',
      'Windows Fundamentals',
      'Web Fundamentals',
      'Cybersecurity Fundamentals'
    ]
  },
  {
    level: 2,
    name: 'Security Fundamentals',
    description: 'Core security principles and concepts',
    courses: [
      'Security Principles',
      'Authentication',
      'Authorization',
      'Cryptography',
      'Vulnerability Management',
      'Security Monitoring'
    ]
  },
  {
    level: 3,
    name: 'Web Security',
    description: 'Web application security techniques',
    courses: [
      'HTTP',
      'Web Architecture',
      'Authentication Attacks',
      'Access Control',
      'SQL Injection',
      'XSS',
      'CSRF',
      'SSRF',
      'File Upload',
      'Command Injection',
      'API Security'
    ]
  },
  {
    level: 4,
    name: 'Network Security',
    description: 'Network security fundamentals and attacks',
    courses: [
      'TCP/IP',
      'DNS',
      'HTTP/HTTPS',
      'Network Enumeration',
      'Packet Analysis',
      'Network Attacks',
      'IDS/IPS',
      'Firewall Concepts'
    ]
  },
  {
    level: 5,
    name: 'Linux',
    description: 'Linux system administration and security',
    courses: [
      'Linux Basics',
      'Permissions',
      'Processes',
      'Services',
      'Bash',
      'Enumeration',
      'Privilege Escalation'
    ]
  },
  {
    level: 6,
    name: 'Windows',
    description: 'Windows system administration and security',
    courses: [
      'Windows Architecture',
      'PowerShell',
      'Users and Groups',
      'Services',
      'Registry',
      'Windows Enumeration',
      'Privilege Escalation'
    ]
  },
  {
    level: 7,
    name: 'Active Directory',
    description: 'Active Directory security and attacks',
    courses: [
      'AD Fundamentals',
      'Kerberos',
      'LDAP',
      'SMB',
      'Enumeration',
      'Authentication Attacks',
      'Privilege Escalation',
      'Lateral Movement',
      'Domain Compromise Concepts'
    ]
  },
  {
    level: 8,
    name: 'Pentesting',
    description: 'Penetration testing methodologies',
    courses: [
      'Reconnaissance',
      'Enumeration',
      'Vulnerability Discovery',
      'Exploitation',
      'Post Exploitation',
      'Privilege Escalation',
      'Pivoting',
      'Reporting'
    ]
  },
  {
    level: 9,
    name: 'SOC',
    description: 'Security Operations Center fundamentals',
    courses: [
      'SOC Fundamentals',
      'Log Analysis',
      'SIEM',
      'Detection Engineering',
      'Incident Response',
      'Threat Intelligence',
      'Malware Analysis Basics',
      'Alert Triage'
    ]
  },
  {
    level: 10,
    name: 'Digital Forensics',
    description: 'Digital forensics investigation techniques',
    courses: [
      'Disk Forensics',
      'Memory Forensics',
      'Network Forensics',
      'Timeline Analysis',
      'Evidence Handling'
    ]
  },
  {
    level: 11,
    name: 'Cloud & DevSecOps',
    description: 'Cloud security and DevSecOps practices',
    courses: [
      'Cloud Fundamentals',
      'IAM',
      'Cloud Networking',
      'Container Security',
      'Kubernetes Security',
      'CI/CD Security',
      'Secrets Management'
    ]
  },
  {
    level: 12,
    name: 'AI Engineering & AI Security',
    description: 'AI/ML fundamentals and security',
    courses: [
      'Python for AI',
      'ML Fundamentals',
      'LLM Fundamentals',
      'Prompt Engineering',
      'RAG',
      'AI APIs',
      'AI Security',
      'Prompt Injection',
      'Data Poisoning',
      'Model Security',
      'AI Red Teaming'
    ]
  }
];

// ===== AI ENGINEERING TRACK =====
export const AI_ENGINEERING_TRACK = [
  'Python for AI',
  'Data Structures',
  'ML fundamentals',
  'Neural networks',
  'Transformers',
  'LLMs',
  'Prompt engineering',
  'Embeddings',
  'Vector databases',
  'RAG',
  'Agents',
  'Evaluation',
  'AI security',
  'Prompt injection',
  'Model security',
  'AI red teaming'
];

// ===== PRACTICE LAB DIFFICULTY =====
export const LAB_DIFFICULTY = {
  EASY: { name: 'Easy', color: 'success' },
  MEDIUM: { name: 'Medium', color: 'warning' },
  HARD: { name: 'Hard', color: 'danger' },
  EXPERT: { name: 'Expert', color: 'purple' },
};

// ===== ASSESSMENT DEFAULT SETTINGS =====
export const ASSESSMENT_DEFAULTS = {
  duration: 90, // minutes
  passingScore: 70, // percentage
  attempts: 1,
  shuffleQuestions: true,
  showResultsImmediately: false,
  enableProctoring: true,
  allowHints: false,
};

// ===== TERMINAL COMMANDS (for simulation) =====
export const TERMINAL_COMMANDS = {
  help: {
    output: `Available commands:
  help        - Show this help message
  clear       - Clear the terminal
  whoami      - Show current user
  pwd         - Show current directory
  ls          - List directory contents
  cat         - Display file content
  nmap        - Network mapper
  curl        - Transfer a URL
  grep        - Search text
  netstat     - Network statistics
  ps          - Process status
  ifconfig    - Network interface config
  dig         - DNS lookup
  wget        - Download files
  python      - Python interpreter
  echo        - Display a line of text
  exit        - Exit the terminal`,
    color: 'blue'
  },
  whoami: {
    output: `student@cybernex-lab`,
    color: 'green'
  },
  pwd: {
    output: `/home/student/labs`,
    color: 'green'
  },
  'ls -la': {
    output: `total 24
drwxr-xr-x 4 student student 4096 Sep  3 10:00 .
drwxr-xr-x 4 student student 4096 Sep  3 10:00 ..
-rw-r--r-- 1 student student  220 Sep  3 09:50 .bash_history
-rw-r--r-- 1 student student  148 Sep  3 09:50 flag.txt
-rw-r--r-- 1 student student 3428 Sep  3 09:50 notes.md
drwxr-xr-x 2 student student 4096 Sep  3 09:55 tools`,
    color: 'white'
  },
  'cat flag.txt': {
    output: `CYBERNEX{Th1s_1s_4_S3cur3_Fl4g}`,
    color: 'yellow'
  },
    'nmap 10.10.10.10': {
    output: `Starting Nmap 7.92 ( https://nmap.org )
Nmap scan report for 10.10.10.10
Host is up (0.045s latency).
Not shown: 995 closed ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
3306/tcp open  mysql
8080/tcp open  http-proxy
Nmap done: 1 IP address (1 host up) scanned in 1.23 seconds`,
    color: 'white'
  },
  'curl http://10.10.10.10': {
    output: `HTTP/1.1 200 OK
Server: Apache/2.4.41
Date: Thu, 03 Sep 2026 10:00:00 GMT
Content-Type: text/html; charset=UTF-8

<html>
<head><title>Web Server</title></head>
<body>
<h1>Welcome to CyberNex Lab</h1>
<p>This is a sample web server for training purposes.</p>
</body>
</html>`,
    color: 'white'
  },
  'grep -i password notes.md': {
    output: `notes.md:admin:P@ssw0rd123
notes.md:user:Welcome123
notes.md:backup:S3cr3tK3y!`,
    color: 'red'
  },
  clear: {
    output: '',
    color: 'white',
    action: 'clear'
  }
};

// ===== SAMPLE PRACTICE LABS =====
export const SAMPLE_LABS = [
  {
    id: 'WEB-001',
    title: 'Basic Web Enumeration',
    domain: 'Web Security',
    category: 'Web',
    difficulty: 'Easy',
    estimatedTime: 30,
    description: 'Learn to identify web technologies and hidden endpoints',
    objectives: [
      'Identify the web server software',
      'Find the robots.txt file',
      'Discover hidden endpoints',
      'Submit the flag'
    ],
    prerequisites: ['Web Fundamentals'],
    environment: 'Apache/2.4.41 on Ubuntu',
    tasks: [
      {
        id: 1,
        title: 'Identify the web server',
        description: 'Use the terminal to determine what web server is running',
        hint: 'Try using curl or nmap to check the server headers',
        flag: 'CYBERNEX{Apache_2.4.41}'
      },
      {
        id: 2,
        title: 'Find robots.txt',
        description: 'Locate the robots.txt file and identify disallowed paths',
        hint: 'Access /robots.txt directly in your browser or with curl',
        flag: 'CYBERNEX{disallow_admin}'
      },
      {
        id: 3,
        title: 'Discover hidden endpoint',
        description: 'Find the hidden /secret endpoint',
        hint: 'Check the robots.txt for clues',
        flag: 'CYBERNEX{H1dd3n_3ndp01nt}'
      },
      {
        id: 4,
        title: 'Submit the final flag',
        description: 'Combine all information to find the final flag',
        hint: 'Check the source code of the /secret page',
        flag: 'CYBERNEX{W3b_3num3r4t10n_M4st3r}'
      }
    ]
  },
  {
    id: 'LINUX-001',
    title: 'Linux Privilege Escalation',
    domain: 'Linux',
    category: 'Linux',
    difficulty: 'Hard',
    estimatedTime: 60,
    description: 'Practice privilege escalation techniques on a vulnerable Linux system',
    objectives: [
      'Enumerate the system',
      'Find vulnerable SUID binaries',
      'Exploit to gain root access',
      'Read the root flag'
    ],
    prerequisites: ['Linux Fundamentals', 'Linux Basics', 'Permissions'],
    environment: 'Ubuntu 20.04',
    tasks: [
      {
        id: 1,
        title: 'System Enumeration',
        description: 'Run basic enumeration commands to gather system information',
        hint: 'Try: uname -a, cat /etc/os-release, id',
        flag: 'CYBERNEX{Ubuntu_20.04}'
      },
      {
        id: 2,
        title: 'Find SUID Binaries',
        description: 'Locate binaries with SUID bit set',
        hint: 'Use: find / -perm -4000 -type f 2>/dev/null',
        flag: 'CYBERNEX{/usr/bin/find}'
      },
      {
        id: 3,
        title: 'Exploit Vulnerable Binary',
        description: 'Exploit the vulnerable binary to escalate privileges',
        hint: 'Check GTFOBins for the binary you found',
        flag: 'CYBERNEX{Pr1v1l3g3_3sc4l4t10n}'
      },
      {
        id: 4,
        title: 'Read Root Flag',
        description: 'Read the flag in /root/root.txt',
        hint: 'You need root access first',
        flag: 'CYBERNEX{R00t_Fl4g_4cqu1r3d}'
      }
    ]
  },
  {
    id: 'NET-001',
    title: 'Network Traffic Analysis',
    domain: 'Network Security',
    category: 'Network',
    difficulty: 'Medium',
    estimatedTime: 45,
    description: 'Analyze PCAP files to identify suspicious network traffic',
    objectives: [
      'Identify the attacking IP',
      'Determine the attack type',
      'Find the compromised credentials',
      'Extract the malware hash'
    ],
    prerequisites: ['Networking Fundamentals', 'TCP/IP', 'Packet Analysis'],
    environment: 'Wireshark',
    tasks: [
      {
        id: 1,
        title: 'Identify Attacking IP',
        description: 'Find the IP address initiating the attack',
        hint: 'Look for the IP with the most connection attempts',
        flag: 'CYBERNEX{192.168.1.100}'
      },
      {
        id: 2,
        title: 'Determine Attack Type',
        description: 'Identify what type of attack is being performed',
        hint: 'Check for repeated SYN packets without ACK',
        flag: 'CYBERNEX{SYN_Flood}'
      },
      {
        id: 3,
        title: 'Find Compromised Credentials',
        description: 'Locate any credentials being transmitted in cleartext',
        hint: 'Filter for HTTP traffic and look for POST requests',
        flag: 'CYBERNEX{admin:P@ssw0rd123}'
      }
    ]
  },
  {
    id: 'SQLI-HIDDEN-DATA',
    title: 'SQL injection vulnerability in WHERE clause allowing retrieval of hidden data',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Easy',
    estimatedTime: 25,
    description: 'This lab contains a SQL injection vulnerability in the product category filter. The task is to display one or more unreleased products using a malicious category value.',
    objectives: [
      'Intercept the category request in Burp Suite',
      'Inject a payload into the category parameter',
      'Confirm that unreleased products are returned',
      'Complete the challenge in the CyberNex lab environment'
    ],
    prerequisites: ['Basic SQL knowledge', 'Burp Suite basics'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Use Burp Suite to intercept and modify the request that sets the product category filter. Change the category parameter to the value \' +OR+1=1-- \' and submit the request to reveal unreleased products.',
    solutionSteps: [
      'Intercept the request that sets the category filter.',
      'Modify the category parameter to \' +OR+1=1--\'.',
      'Submit the request and confirm that unreleased products appear in the response.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Intercept the category request',
        description: 'Turn on intercept in Burp Suite and locate the category filter request.',
        hint: 'The vulnerable parameter is the category value in the product list request.',
        flag: 'SQLI-RETRIEVE-HIDDEN-DATA'
      },
      {
        id: 2,
        title: 'Inject an OR condition',
        description: 'Change the category parameter to the payload used to bypass the released filter.',
        hint: 'Use the payload: \' OR 1=1--',
        flag: 'SQLI-OR-1-1'
      },
      {
        id: 3,
        title: 'Confirm the exploit',
        description: 'Verify the response now includes unreleased products.',
        hint: 'Look for products that should normally be hidden.',
        flag: 'SQLI-DISCOVERED-UNRELEASED'
      }
    ]
  },
  {
    id: 'SQLI-LOGIN-BYPASS',
    title: 'SQL injection vulnerability allowing login bypass',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Easy',
    estimatedTime: 20,
    description: 'This lab demonstrates a SQL injection vulnerability in the login function that permits authentication bypass via the username parameter.',
    objectives: [
      'Intercept the login request',
      'Inject a malicious username',
      'Log in as administrator without a password'
    ],
    prerequisites: ['Burp Suite', 'SQL basics'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Intercept the login request and change the username parameter to administrator\'--. Submit the request to bypass the password check and log in as the administrator user.',
    solutionSteps: [
      'Intercept and alter the login request in Burp.',
      'Set the username to administrator\'--.',
      'Submit the request and verify that the application logs you in as the administrator user.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Modify the login request',
        description: 'Intercept the login request and alter the username field.',
        hint: 'The payload is administrator\'--.',
        flag: 'SQLI-LOGIN-BYPASS'
      },
      {
        id: 2,
        title: 'Bypass authentication',
        description: 'Submit the modified request and confirm the login works as the administrator.',
        hint: 'The password filter is neutralized by the injected comment sequence.',
        flag: 'ADMIN-ACCESS-GRANTED'
      }
    ]
  },
  {
    id: 'SQLI-DB-VERSION-ORACLE',
    title: 'SQL injection attack, querying the database type and version on Oracle',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Medium',
    estimatedTime: 35,
    description: 'Use a UNION attack to determine the database type and display the Oracle version string.',
    objectives: [
      'Determine the number of columns in the original query',
      'Find a text-compatible column',
      'Display the Oracle banner via a UNION attack'
    ],
    prerequisites: ['UNION attacks', 'Oracle syntax'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Determine the column count and find a text field, then use a UNION SELECT payload with FROM dual to query the Oracle database version string. Example: \' UNION SELECT BANNER, NULL FROM v$version--',
    solutionSteps: [
      'Use a UNION SELECT test to confirm that the query returns two text columns.',
      'Query the version banner with BANNER and NULL from v$version.',
      'Submit the final payload to display the database version string.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Identify the column structure',
        description: 'Determine how many columns the application query returns.',
        hint: 'Use UNION SELECT NULL values until the query succeeds.',
        flag: 'SQLI-ORACLE-COLUMNS-OK'
      },
      {
        id: 2,
        title: 'Display the database version',
        description: 'Use Oracle syntax to query the version banner.',
        hint: 'Use BANNER and the dual table.',
        flag: 'ORACLE-VERSION-DISCOVERED'
      }
    ]
  },
  {
    id: 'SQLI-DB-VERSION-MYSQL',
    title: 'SQL injection attack, querying the database type and version on MySQL and Microsoft',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Medium',
    estimatedTime: 30,
    description: 'Use a UNION attack to return the database version for MySQL or Microsoft SQL Server.',
    objectives: [
      'Confirm the query has two compatible text columns',
      'Use @@version to reveal the database version',
      'Capture the output and complete the challenge'
    ],
    prerequisites: ['UNION attacks', 'SQL syntax'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Use UNION SELECT to test the number of columns and display the database version with @@version. For MySQL this often looks like \' UNION SELECT @@version, NULL#.',
    solutionSteps: [
      'Confirm the original query returns two text-compatible columns.',
      'Inject a UNION SELECT payload that includes @@version.',
      'Submit the request and review the application response for the version information.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Verify the result set',
        description: 'Use a UNION test with a dummy string and NULL values to confirm the response format.',
        hint: 'The payload looks like \' UNION SELECT \'abc\',\'def\'#',
        flag: 'SQLI-MYSQL-COLUMNS-OK'
      },
      {
        id: 2,
        title: 'Display version information',
        description: 'Use @@version in the UNION payload to expose database details.',
        hint: 'The payload is \' UNION SELECT @@version, NULL#',
        flag: 'DB-VERSION-REVEALED'
      }
    ]
  },
  {
    id: 'SQLI-LIST-NON-ORACLE',
    title: 'SQL injection attack, listing the database contents on non-Oracle databases',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Hard',
    estimatedTime: 50,
    description: 'Use a UNION attack to enumerate database tables, inspect the users table, and retrieve all usernames and passwords.',
    objectives: [
      'List available database tables',
      'Examine the users table columns',
      'Retrieve credentials and log in as administrator'
    ],
    prerequisites: ['UNION attacks', 'information_schema'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Confirm the query columns, then query information_schema.tables and information_schema.columns to locate the credentials table and retrieve the usernames and passwords. Use the administrator password to sign in.',
    solutionSteps: [
      'Confirm the query returns two text columns.',
      'List tables with UNION SELECT table_name, NULL FROM information_schema.tables.',
      'Find the credentials table and inspect its columns with information_schema.columns.',
      'Query the usernames and passwords and log in as administrator.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Enumerate tables',
        description: 'Query the database metadata to identify the user credential table.',
        hint: 'Use information_schema.tables.',
        flag: 'TABLES-ENUMERATED'
      },
      {
        id: 2,
        title: 'Find the credentials columns',
        description: 'Determine the column names inside the user table.',
        hint: 'Search for the table with usernames and passwords.',
        flag: 'USER-COLUMNS-FOUND'
      },
      {
        id: 3,
        title: 'Dump the credentials',
        description: 'Retrieve the username and password values and log in as administrator.',
        hint: 'Use UNION SELECT username_abcdef, password_abcdef FROM users_abcdef--.',
        flag: 'ADMIN-LOGGED-IN'
      }
    ]
  },
  {
    id: 'SQLI-LIST-ORACLE',
    title: 'SQL injection attack, listing the database contents on Oracle',
    domain: 'Web Security',
    category: 'SQL Injection',
    difficulty: 'Hard',
    estimatedTime: 50,
    description: 'Use a UNION attack against an Oracle database to read table names, inspect the relevant columns, and recover the administrator credentials.',
    objectives: [
      'Confirm the result set shape',
      'List Oracle tables and columns',
      'Extract the administrator password and log in'
    ],
    prerequisites: ['Oracle syntax', 'UNION attacks'],
    environment: 'Web Browser + Burp Suite',
    accessUrl: '/student/practice',
    burpSuiteUrl: '/student/learning/sql-injection',
    instructions: 'Use a UNION SELECT with FROM dual to confirm the column structure, then query all_tables and all_tab_columns to locate the user table and its credential fields. Finally, dump the usernames and passwords and log in as the administrator.',
    solutionSteps: [
      'Use a UNION SELECT test payload with FROM dual to confirm the number of columns.',
      'Query all_tables to identify the credentials table.',
      'Use all_tab_columns to inspect the relevant columns.',
      'Select the username and password fields from the discovered table and log in as administrator.'
    ],
    tasks: [
      {
        id: 1,
        title: 'Confirm Oracle column structure',
        description: 'Use a UNION query that includes FROM dual to validate the output format.',
        hint: 'Relevant format: \' UNION SELECT \'abc\',\'def\' FROM dual--',
        flag: 'ORACLE-COLUMNS-OK'
      },
      {
        id: 2,
        title: 'Find the table and columns',
        description: 'Use all_tables and all_tab_columns to locate the credential table.',
        hint: 'Look for the table that stores usernames and passwords.',
        flag: 'ORACLE-USER-TABLE-FOUND'
      },
      {
        id: 3,
        title: 'Retrieve the admin password',
        description: 'Dump the valid table values and use the administrator credentials to login.',
        hint: 'Select username and password columns from the discovered table and find administrator.',
        flag: 'ORACLE-ADMIN-PASSWORD-RETRIEVED'
      }
    ]
  }
];

// ===== SAMPLE ASSESSMENTS =====
export const SAMPLE_ASSESSMENTS = [
  {
    id: 'ASSESS-WEB-001',
    title: 'Web Penetration Testing - Level 4',
    description: 'Comprehensive web application security assessment',
    type: ASSESSMENT_TYPES.PRACTICAL,
    domain: 'Web Security',
    level: 4,
    difficulty: DIFFICULTY_LEVELS.HARD,
    duration: 90,
    passingScore: 70,
    attempts: 2,
    questions: [
      {
        id: 1,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        question: 'What is the most common web vulnerability?',
        options: [
          'Buffer Overflow',
          'SQL Injection',
          'Cross-Site Scripting',
          'Denial of Service'
        ],
        correctAnswer: ['SQL Injection'],
        points: 5,
        difficulty: DIFFICULTY_LEVELS.EASY
      },
      {
        id: 2,
        type: QUESTION_TYPES.FLAG_SUBMISSION,
        question: 'Find and submit the hidden flag in the admin panel',
        description: 'The admin panel is vulnerable to directory traversal. Find the flag.',
        hint: 'Try accessing /admin/../../../../etc/passwd',
        correctAnswer: 'CYBERNEX{Dir3ct0ry_Tr4v3rs4l_Fl4g}',
        points: 20,
        difficulty: DIFFICULTY_LEVELS.MEDIUM
      },
      {
        id: 3,
        type: QUESTION_TYPES.SHORT_ANSWER,
        question: 'What HTTP header can be manipulated to perform cache poisoning?',
        correctAnswer: ['Host'],
        points: 10,
        difficulty: DIFFICULTY_LEVELS.MEDIUM
      }
    ],
    practicalTasks: [
      {
        id: 1,
        title: 'SQL Injection',
        description: 'Exploit the SQL injection vulnerability to dump the database',
        target: 'http://assessment.cybernex.local/login',
        hint: 'Try: admin\' OR \'1\'=\'1',
        flag: 'CYBERNEX{SQL1nj3ct10n_M4st3r}',
        points: 25
      },
      {
        id: 2,
        title: 'XSS Exploitation',
        description: 'Perform a stored XSS attack on the comment system',
        target: 'http://assessment.cybernex.local/comments',
        hint: 'Use <script>alert(1)</script> in the name field',
        flag: 'CYBERNEX{XSS_3xpl01t4t10n}',
        points: 25
      }
    ],
    startDate: '2026-09-10T09:00:00Z',
    endDate: '2026-09-10T11:00:00Z',
    isPublished: true
  },
  {
    id: 'ASSESS-NET-001',
    title: 'Network Security Assessment',
    description: 'Test your network security analysis skills',
    type: ASSESSMENT_TYPES.KNOWLEDGE,
    domain: 'Network Security',
    level: 4,
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    duration: 60,
    passingScore: 75,
    attempts: 3,
    questions: [
      {
        id: 1,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        question: 'Which protocol uses port 22?',
        options: ['HTTP', 'FTP', 'SSH', 'DNS'],
        correctAnswer: ['SSH'],
        points: 5
      },
      {
        id: 2,
        type: QUESTION_TYPES.MULTIPLE_SELECT,
        question: 'Which of the following are TCP ports? (Select all that apply)',
        options: ['22', '53', '80', '443', '161'],
        correctAnswer: ['22', '80', '443'],
        points: 10
      },
      {
        id: 3,
        type: QUESTION_TYPES.TRUE_FALSE,
        question: 'ARP is a routable protocol',
        correctAnswer: [false],
        points: 5
      }
    ],
    startDate: '2026-09-15T10:00:00Z',
    endDate: '2026-09-15T12:00:00Z',
    isPublished: true
  }
];

// ===== SAMPLE COURSES =====
export const SAMPLE_COURSES = [
  {
    id: 'COURSE-001',
    title: 'Computer Fundamentals',
    description: 'Introduction to computer systems and basic concepts',
    domain: CYBER_DOMAINS[0],
    level: 1,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    estimatedTime: 120,
    isPublished: true,
    prerequisites: [],
    learningObjectives: [
      'Understand computer architecture',
      'Learn about operating systems',
      'Basic networking concepts',
      'Introduction to security'
    ],
    modules: [
      {
        id: 'MOD-001',
        title: 'Computer Architecture',
        lessons: [
          {
            id: 'LESSON-001',
            title: 'Introduction to Computers',
            description: 'Overview of computer systems and components',
            content: 'Computers are... [Detailed content would go here]',
            estimatedTime: 15,
            resources: [
              { type: 'internal', title: 'Computer Basics PDF', url: '/resources/computer-basics.pdf' },
              { type: 'external', provider: 'YouTube', title: 'Computer Basics', url: 'https://youtube.com/watch?v=example' }
            ],
            completionStatus: false
          },
          {
            id: 'LESSON-002',
            title: 'Hardware Components',
            description: 'CPU, Memory, Storage, etc.',
            content: 'Hardware components include...',
            estimatedTime: 20,
            resources: [],
            completionStatus: false
          }
        ]
      }
    ]
  },
  {
    id: 'COURSE-002',
    title: 'Networking Fundamentals',
    description: 'Basics of computer networking',
    domain: CYBER_DOMAINS[1],
    level: 1,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    estimatedTime: 180,
    isPublished: true,
    prerequisites: ['Computer Fundamentals'],
    learningObjectives: [
      'Understand networking models',
      'Learn about IP addressing',
      'Basic protocol knowledge',
      'Network troubleshooting'
    ],
    modules: []
  },
  {
    id: 'COURSE-SQLI-001',
    title: 'SQL Injection Fundamentals',
    description: 'Learn how SQL injection works, how to detect it, and how to prevent it with safe database coding patterns.',
    domain: 'Web Security',
    level: 3,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    estimatedTime: 150,
    isPublished: true,
    prerequisites: ['Computer Fundamentals'],
    learningObjectives: [
      'Define SQL injection and explain why it is dangerous.',
      'Recognize common payload patterns and injection entry points.',
      'Differentiate between UNION, blind, and time-based SQLi.',
      'Use parameterized queries to prevent SQL injection in applications.'
    ],
    modules: [
      {
        id: 'MOD-SQLI-001',
        title: 'What is SQL injection?',
        lessons: [
          {
            id: 'LESSON-SQLI-001',
            title: 'Understanding SQL injection',
            description: 'An introduction to how user input is turned into a harmful database query.',
            content: 'SQL injection occurs when untrusted input is inserted into a SQL query without proper validation or prepared statements. Attackers can modify the logic of the query to bypass authentication or read sensitive data.',
            estimatedTime: 20,
            resources: [
              { type: 'internal', title: 'SQLi overview notes', url: '/resources/sqli-overview.pdf' },
              { type: 'internal', provider: 'CyberNex', title: 'SQL injection overview', url: '/student/learning/sql-injection' }
            ],
            completionStatus: false
          },
          {
            id: 'LESSON-SQLI-002',
            title: 'Impact and detection',
            description: 'Why SQL injection can lead to data theft, privilege escalation, and application compromise.',
            content: 'The impact may include exposing passwords, credit card data, user records, or backend infrastructure. Detection typically starts with single quote tests and boolean payloads such as OR 1=1 and OR 1=2.',
            estimatedTime: 25,
            resources: [],
            completionStatus: false
          }
        ]
      },
      {
        id: 'MOD-SQLI-002',
        title: 'Classic and advanced exploitation',
        lessons: [
          {
            id: 'LESSON-SQLI-003',
            title: 'Retrieving hidden data and login bypass',
            description: 'How attackers can extract hidden records or bypass authentication logic.',
            content: "Payloads like OR 1=1-- can reveal all products or bypass login logic. For example, administrator'-- removes the password check from a WHERE clause.",
            estimatedTime: 30,
            resources: [],
            completionStatus: false
          },
          {
            id: 'LESSON-SQLI-004',
            title: 'UNION attacks and blind SQLi',
            description: 'How to combine SELECT statements and infer true/false conditions without seeing query results.',
            content: 'A UNION attack appends a second query with matching column counts. Blind SQL injection relies on conditional errors, time delays, or out-of-band DNS interactions to infer the result of a boolean expression.',
            estimatedTime: 35,
            resources: [],
            completionStatus: false
          }
        ]
      },
      {
        id: 'MOD-SQLI-003',
        title: 'Prevention and secure coding',
        lessons: [
          {
            id: 'LESSON-SQLI-005',
            title: 'Prepared statements',
            description: 'The most important defense against SQL injection.',
            content: 'Prepared statements bind user input as data rather than executable SQL. This prevents attackers from altering the structure of the query while still allowing dynamic values to be used safely.',
            estimatedTime: 20,
            resources: [
              { type: 'external', provider: 'OWASP', title: 'SQL Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' }
            ],
            completionStatus: false
          },
          {
            id: 'LESSON-SQLI-006',
            title: 'Study summary and checklist',
            description: 'Review the core concepts and test yourself on the main SQLi patterns.',
            content: 'Remember: validate user input, use parameterized queries, and avoid building SQL dynamically from user-controlled values. The safest design pattern is to treat all input as data, never as query structure.',
            estimatedTime: 20,
            resources: [],
            completionStatus: false
          }
        ]
      }
    ]
  }
];

// ===== SAMPLE USERS =====
// ===== SAMPLE USERS =====
export const SAMPLE_USERS = [
  {
    id: 'USER-001',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    department: 'IT',
    level: 12,
    status: 'active',
    joinDate: '2026-01-01T00:00:00Z',
    lastActive: '2026-09-03T10:00:00Z',
    avatar: DEFAULT_AVATAR,
    permissions: Object.values(PERMISSIONS) // All permissions for admin
  },
  {
    id: 'USER-002',
    name: 'Faculty Member',
    email: 'faculty@gmail.com',
    password: 'faculty123',
    role: ROLES.FACULTY,
    department: 'Cybersecurity',
    level: 10,
    status: 'active',
    joinDate: '2026-01-15T00:00:00Z',
    lastActive: '2026-09-02T09:00:00Z',
    avatar: DEFAULT_AVATAR,
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.COURSES_CREATE,
      PERMISSIONS.COURSES_EDIT,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.PRACTICE_MANAGE,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_CREATE,
      PERMISSIONS.ASSESSMENT_MANAGE,
      PERMISSIONS.ASSESSMENT_REVIEW,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.RESULTS_MANAGE,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MANAGE,
      PERMISSIONS.SCHEDULE_VIEW,
      PERMISSIONS.SCHEDULE_MANAGE,
      PERMISSIONS.VIOLATIONS_VIEW
    ]
  },
  {
    id: 'USER-003',
    name: 'John Doe',
    email: 'student@gmail.com',
    password: 'student123',
    role: ROLES.STUDENT,
    department: 'Cybersecurity',
    level: 3,
    status: 'active',
    joinDate: '2026-02-01T00:00:00Z',
    lastActive: '2026-09-03T08:00:00Z',
    avatar: DEFAULT_AVATAR,
    permissions: [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.SCHEDULE_VIEW
    ],
    progress: {
      learning: { completed: 45, total: 60 },
      practice: { completed: 12, total: 30 },
      assessments: { completed: 3, total: 5 }
    },
    securityScore: 78,
    xp: 1250,
    streak: 5,
    lastAssessment: '2026-08-30T00:00:00Z'
  },
  {
    id: 'USER-004',
    name: 'Jane Smith',
    email: 'jane.smith@cybernex.edu',
    password: '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoE5Ma2v9cP9A7sW0x0vL5lz3o0l6i',
    role: ROLES.STUDENT,
    department: 'Information Security',
    level: 5,
    status: 'active',
    joinDate: '2026-01-20T00:00:00Z',
    lastActive: '2026-09-02T14:30:00Z',
    avatar: DEFAULT_AVATAR,
    permissions: [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.SCHEDULE_VIEW
    ],
    progress: {
      learning: { completed: 72, total: 80 },
      practice: { completed: 18, total: 25 },
      assessments: { completed: 6, total: 8 }
    },
    securityScore: 85,
    xp: 2450,
    streak: 12,
    lastAssessment: '2026-09-01T00:00:00Z'
  },
  {
    id: 'USER-005',
    name: 'Bob Johnson',
    email: 'bob.johnson@cybernex.edu',
    password: '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoE5Ma2v9cP9A7sW0x0vL5lz3o0l6i',
    role: ROLES.STUDENT,
    department: 'Computer Science',
    level: 2,
    status: 'active',
    joinDate: '2026-03-10T00:00:00Z',
    lastActive: '2026-09-01T16:00:00Z',
    avatar: DEFAULT_AVATAR,
    permissions: [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.PRACTICE_VIEW,
      PERMISSIONS.ASSESSMENT_VIEW,
      PERMISSIONS.ASSESSMENT_START,
      PERMISSIONS.RESULTS_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.SCHEDULE_VIEW
    ],
    progress: {
      learning: { completed: 30, total: 50 },
      practice: { completed: 8, total: 20 },
      assessments: { completed: 2, total: 4 }
    },
    securityScore: 65,
    xp: 800,
    streak: 3,
    lastAssessment: '2026-08-28T00:00:00Z'
  }
];

// ===== SAMPLE FACULTY =====
export const SAMPLE_FACULTY = [
  {
    id: 'FAC-001',
    userId: 'USER-002', // Reference to faculty user
    department: 'Cybersecurity',
    courses: ['COURSE-001', 'COURSE-002'],
    studentGroups: ['GROUP-001', 'GROUP-002'],
    permissions: [
      PERMISSIONS.COURSES_VIEW,
      PERMISSIONS.COURSES_EDIT,
      PERMISSIONS.PRACTICE_MANAGE,
      PERMISSIONS.ASSESSMENT_MANAGE
    ],
    joinDate: '2026-01-15T00:00:00Z'
  }
];

// ===== SAMPLE STUDENT GROUPS =====
export const SAMPLE_STUDENT_GROUPS = [
  {
    id: 'GROUP-001',
    name: 'Cybersecurity Beginners',
    description: 'Level 1-3 students',
    facultyId: 'FAC-001',
    students: ['USER-003', 'USER-005'],
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'GROUP-002',
    name: 'Advanced Security',
    description: 'Level 4-6 students',
    facultyId: 'FAC-001',
    students: ['USER-004'],
    createdAt: '2026-02-15T00:00:00Z'
  }
];

// ===== SAMPLE ATTENDANCE =====
export const SAMPLE_ATTENDANCE = [
  {
    id: 'ATT-001',
    studentId: 'USER-003',
    date: '2026-09-01',
    courseId: 'COURSE-001',
    status: ATTENDANCE_STATUSES.PRESENT,
    checkIn: '2026-09-01T09:00:00Z',
    checkOut: '2026-09-01T11:00:00Z',
    percentage: 100
  },
  {
    id: 'ATT-002',
    studentId: 'USER-004',
    date: '2026-09-01',
    courseId: 'COURSE-002',
    status: ATTENDANCE_STATUSES.PRESENT,
    checkIn: '2026-09-01T09:05:00Z',
    checkOut: '2026-09-01T11:00:00Z',
    percentage: 95
  },
  {
    id: 'ATT-003',
    studentId: 'USER-005',
    date: '2026-09-01',
    courseId: 'COURSE-001',
    status: ATTENDANCE_STATUSES.LATE,
    checkIn: '2026-09-01T09:30:00Z',
    checkOut: '2026-09-01T11:00:00Z',
    percentage: 80
  },
  {
    id: 'ATT-004',
    studentId: 'USER-003',
    date: '2026-09-02',
    courseId: 'COURSE-002',
    status: ATTENDANCE_STATUSES.ABSENT,
    checkIn: null,
    checkOut: null,
    percentage: 0
  }
];

// ===== SAMPLE SCHEDULES =====
export const SAMPLE_SCHEDULES = [
  {
    id: 'SCHED-001',
    title: 'Web Security Workshop',
    description: 'Hands-on web security training session',
    type: 'Workshop',
    startDate: '2026-09-10T09:00:00Z',
    endDate: '2026-09-10T12:00:00Z',
    location: 'Room 101 / Online',
    facultyId: 'FAC-001',
    courseId: null,
    students: ['USER-003', 'USER-004', 'USER-005'],
    isRecurring: false,
    recurrence: null,
    color: '#3B82F6'
  },
  {
    id: 'SCHED-002',
    title: 'Network Security Lecture',
    description: 'Theoretical network security concepts',
    type: 'Course',
    startDate: '2026-09-08T10:00:00Z',
    endDate: '2026-09-08T11:30:00Z',
    location: 'Room 205',
    facultyId: 'FAC-001',
    courseId: 'COURSE-002',
    students: ['USER-003', 'USER-004', 'USER-005'],
    isRecurring: true,
    recurrence: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [1, 3], // Monday, Wednesday
      endDate: '2026-12-31T00:00:00Z'
    },
    color: '#10B981'
  },
  {
    id: 'SCHED-003',
    title: 'ASSESS-WEB-001',
    description: 'Web Penetration Testing Assessment',
    type: 'Exam',
    startDate: '2026-09-15T09:00:00Z',
    endDate: '2026-09-15T11:00:00Z',
    location: 'Online',
    facultyId: null,
    courseId: null,
    students: ['USER-003', 'USER-004'],
    isRecurring: false,
    recurrence: null,
    color: '#EF4444'
  },
  {
    id: 'SCHED-004',
    title: 'Holiday - Labor Day',
    description: 'No classes scheduled',
    type: 'Holiday',
    startDate: '2026-09-07T00:00:00Z',
    endDate: '2026-09-07T23:59:59Z',
    location: null,
    facultyId: null,
    courseId: null,
    students: [],
    isRecurring: false,
    recurrence: null,
    color: '#6B7280'
  }
];

// ===== SAMPLE VIOLATIONS =====
export const SAMPLE_VIOLATIONS = [
  {
    id: 'VIO-001',
    studentId: 'USER-003',
    assessmentId: 'ASSESS-WEB-001',
    type: VIOLATION_TYPES.TAB_SWITCH,
    severity: VIOLATION_SEVERITY.LOW,
    timestamp: '2026-08-30T10:15:23Z',
    details: {
      action: 'Switched to another browser tab',
      url: 'https://example.com',
      duration: 45 // seconds
    },
    status: 'Reviewed',
    reviewedBy: 'USER-001',
    reviewedAt: '2026-08-30T10:20:00Z',
    notes: 'First violation - warning issued',
    createdAt: '2026-08-30T10:15:23Z'
  },
  {
    id: 'VIO-002',
    studentId: 'USER-004',
    assessmentId: 'ASSESS-WEB-001',
    type: VIOLATION_TYPES.WINDOW_BLUR,
    severity: VIOLATION_SEVERITY.MEDIUM,
    timestamp: '2026-08-30T10:45:10Z',
    details: {
      action: 'Window lost focus',
      duration: 120 // seconds
    },
    status: 'Escalated',
    reviewedBy: 'USER-001',
    reviewedAt: '2026-08-30T11:00:00Z',
    notes: 'Multiple focus loss events detected',
    createdAt: '2026-08-30T10:45:10Z'
  },
    {
    id: 'VIO-003',
    studentId: 'USER-005',
    assessmentId: 'ASSESS-WEB-001',
    type: VIOLATION_TYPES.COPY_ATTEMPT,
    severity: VIOLATION_SEVERITY.HIGH,
    timestamp: '2026-08-30T11:20:15Z',
    details: {
      action: 'Attempted to copy text from assessment',
      text: 'What is the most common web vulnerability?',
      source: 'question'
    },
    status: 'Pending',
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
    createdAt: '2026-08-30T11:20:15Z'
  },
  {
    id: 'VIO-004',
    studentId: 'USER-003',
    assessmentId: 'ASSESS-NET-001',
    type: VIOLATION_TYPES.PASTE_ATTEMPT,
    severity: VIOLATION_SEVERITY.CRITICAL,
    timestamp: '2026-09-01T14:30:45Z',
    details: {
      action: 'Attempted to paste text into assessment',
      text: 'SQL Injection is the most common web vulnerability',
      destination: 'answer field'
    },
    status: 'Escalated',
    reviewedBy: 'USER-002',
    reviewedAt: '2026-09-01T15:00:00Z',
    notes: 'Paste detected during timed assessment - violation of academic integrity',
    createdAt: '2026-09-01T14:30:45Z'
  }
];

// ===== SAMPLE NOTIFICATIONS =====
export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    userId: 'USER-003',
    type: NOTIFICATION_TYPES.ASSESSMENT_UNLOCKED,
    title: 'New Assessment Available',
    message: 'The Web Penetration Testing Assessment (Level 4) has been unlocked for you.',
    data: {
      assessmentId: 'ASSESS-WEB-001',
      assessmentTitle: 'Web Penetration Testing - Level 4'
    },
    isRead: true,
    createdAt: '2026-08-29T16:00:00Z'
  },
  {
    id: 'NOTIF-002',
    userId: 'USER-003',
    type: NOTIFICATION_TYPES.ASSESSMENT_STARTING,
    title: 'Assessment Starting Soon',
    message: 'Your Web Penetration Testing Assessment starts in 1 hour (Sep 15, 9:00 AM).',
    data: {
      assessmentId: 'ASSESS-WEB-001',
      startTime: '2026-09-15T09:00:00Z'
    },
    isRead: false,
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'NOTIF-003',
    userId: 'USER-004',
    type: NOTIFICATION_TYPES.RESULT_PUBLISHED,
    title: 'Assessment Result Published',
    message: 'Your Network Security Assessment results are now available. Score: 88%',
    data: {
      resultId: 'RESULT-001',
      assessmentId: 'ASSESS-NET-001',
      score: 88,
      grade: 'A-'
    },
    isRead: false,
    createdAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'NOTIF-004',
    userId: 'USER-003',
    type: NOTIFICATION_TYPES.LEVEL_INCREASED,
    title: 'Level Up!',
    message: 'Congratulations! You have advanced to Level 4 - Network Security.',
    data: {
      newLevel: 4,
      levelName: 'Network Security',
      xpEarned: 500
    },
    isRead: true,
    createdAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'NOTIF-005',
    userId: 'USER-001',
    type: NOTIFICATION_TYPES.BACKUP_CREATED,
    title: 'Backup Created',
    message: 'System backup was successfully created on Sep 3, 2026 at 02:00 AM.',
    data: {
      backupId: 'BACKUP-001',
      size: '12.5 MB'
    },
    isRead: false,
    createdAt: '2026-09-03T02:00:00Z'
  }
];

// ===== SAMPLE AUDIT LOGS =====
export const SAMPLE_AUDIT_LOGS = [
  {
    id: 'AUDIT-001',
    userId: 'USER-003',
    role: ROLES.STUDENT,
    action: 'LOGIN',
    target: 'System',
    targetId: null,
    status: 'Success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: null,
    timestamp: '2026-09-03T08:00:00Z'
  },
  {
    id: 'AUDIT-002',
    userId: 'USER-001',
    role: ROLES.ADMIN,
    action: 'USER_CREATED',
    target: 'User',
    targetId: 'USER-005',
    status: 'Success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: { name: 'Bob Johnson', email: 'bob.johnson@cybernex.edu', role: ROLES.STUDENT },
    timestamp: '2026-03-10T10:00:00Z'
  },
  {
    id: 'AUDIT-003',
    userId: 'USER-002',
    role: ROLES.FACULTY,
    action: 'ASSESSMENT_UNLOCKED',
    target: 'Assessment',
    targetId: 'ASSESS-WEB-001',
    status: 'Success',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { studentId: 'USER-003', assessmentId: 'ASSESS-WEB-001' },
    timestamp: '2026-08-29T15:45:00Z'
  },
  {
    id: 'AUDIT-004',
    userId: 'USER-003',
    role: ROLES.STUDENT,
    action: 'ASSESSMENT_STARTED',
    target: 'Assessment',
    targetId: 'ASSESS-WEB-001',
    status: 'Success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: null,
    timestamp: '2026-08-30T09:00:00Z'
  },
  {
    id: 'AUDIT-005',
    userId: 'USER-003',
    role: ROLES.STUDENT,
    action: 'ASSESSMENT_SUBMITTED',
    target: 'Assessment',
    targetId: 'ASSESS-WEB-001',
    status: 'Success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { score: 78, timeTaken: 5400 }, // 90 minutes in seconds
    timestamp: '2026-08-30T10:30:00Z'
  },
  {
    id: 'AUDIT-006',
    userId: 'USER-001',
    role: ROLES.ADMIN,
    action: 'RESULT_PUBLISHED',
    target: 'Result',
    targetId: 'RESULT-001',
    status: 'Success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: { studentId: 'USER-003', assessmentId: 'ASSESS-WEB-001', score: 78 },
    timestamp: '2026-08-30T11:00:00Z'
  },
  {
    id: 'AUDIT-007',
    userId: 'USER-002',
    role: ROLES.FACULTY,
    action: 'RESTRICTION_ADDED',
    target: 'Restriction',
    targetId: 'REST-001',
    status: 'Success',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: { userId: 'USER-005', type: 'PRACTICE_DISABLED', reason: 'Policy violation' },
    timestamp: '2026-08-28T14:30:00Z'
  },
  {
    id: 'AUDIT-008',
    userId: 'USER-001',
    role: ROLES.ADMIN,
    action: 'BACKUP_CREATED',
    target: 'Backup',
    targetId: 'BACKUP-001',
    status: 'Success',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: { size: '12.5 MB', fileCount: 452 },
    timestamp: '2026-09-03T02:00:00Z'
  }
];

// ===== SAMPLE BACKUPS =====
export const SAMPLE_BACKUPS = [
  {
    id: 'BACKUP-001',
    createdBy: 'USER-001',
    createdAt: '2026-09-03T02:00:00Z',
    size: 12.5, // in MB
    fileCount: 452,
    version: APP_VERSION,
    status: 'Complete',
    description: 'Daily automated backup',
    isEncrypted: true,
    fileName: `cybernex-backup-${APP_VERSION}-20260903-020000.json`,
    downloadUrl: '/backups/BACKUP-001.json'
  },
  {
    id: 'BACKUP-002',
    createdBy: 'USER-001',
    createdAt: '2026-09-02T02:00:00Z',
    size: 11.8,
    fileCount: 430,
    version: APP_VERSION,
    status: 'Complete',
    description: 'Daily automated backup',
    isEncrypted: true,
    fileName: `cybernex-backup-${APP_VERSION}-20260902-020000.json`,
    downloadUrl: '/backups/BACKUP-002.json'
  },
  {
    id: 'BACKUP-003',
    createdBy: 'USER-001',
    createdAt: '2026-09-01T15:30:00Z',
    size: 12.2,
    fileCount: 445,
    version: APP_VERSION,
    status: 'Complete',
    description: 'Manual backup before system update',
    isEncrypted: true,
    fileName: `cybernex-backup-${APP_VERSION}-20260901-153000.json`,
    downloadUrl: '/backups/BACKUP-003.json'
  }
];

// ===== SAMPLE RESULTS =====
export const SAMPLE_RESULTS = [
  {
    id: 'RESULT-001',
    studentId: 'USER-003',
    assessmentId: 'ASSESS-WEB-001',
    score: 78,
    percentage: 78,
    grade: 'C+',
    status: 'Passed',
    startedAt: '2026-08-30T09:00:00Z',
    submittedAt: '2026-08-30T10:30:00Z',
    timeTaken: 5400, // 90 minutes in seconds
    attempt: 1,
    maxAttempts: 2,
    questions: [
      { questionId: 1, answer: ['SQL Injection'], isCorrect: true, pointsEarned: 5 },
      { questionId: 2, answer: 'CYBERNEX{Dir3ct0ry_Tr4v3rs4l_Fl4g}', isCorrect: true, pointsEarned: 20 },
      { questionId: 3, answer: ['Host'], isCorrect: true, pointsEarned: 10 }
    ],
    practicalTasks: [
      { taskId: 1, answer: 'CYBERNEX{SQL1nj3ct10n_M4st3r}', isCorrect: true, pointsEarned: 25 },
      { taskId: 2, answer: 'CYBERNEX{XSS_3xpl01t4t10n}', isCorrect: false, pointsEarned: 0 }
    ],
    knowledgeScore: 85,
    practicalScore: 70,
    securityScore: 82,
    skillBreakdown: {
      web: 80,
      network: 75,
      linux: 60,
      windows: 50,
      ad: 40,
      soc: 30,
      cloud: 20,
      ai: 10
    },
    violations: ['VIO-001'],
    feedback: 'Good work on the theoretical questions. Need more practice with XSS attacks.',
    published: true,
    publishedAt: '2026-08-30T11:00:00Z',
    publishedBy: 'USER-001'
  },
  {
    id: 'RESULT-002',
    studentId: 'USER-004',
    assessmentId: 'ASSESS-NET-001',
    score: 88,
    percentage: 88,
    grade: 'B+',
    status: 'Passed',
    startedAt: '2026-09-01T10:00:00Z',
    submittedAt: '2026-09-01T10:55:00Z',
    timeTaken: 3300, // 55 minutes in seconds
    attempt: 1,
    maxAttempts: 3,
    questions: [
      { questionId: 1, answer: ['SSH'], isCorrect: true, pointsEarned: 5 },
      { questionId: 2, answer: ['22', '80', '443'], isCorrect: true, pointsEarned: 10 },
      { questionId: 3, answer: [false], isCorrect: true, pointsEarned: 5 }
    ],
    practicalTasks: [],
    knowledgeScore: 88,
    practicalScore: 0,
    securityScore: 88,
    skillBreakdown: {
      web: 90,
      network: 95,
      linux: 85,
      windows: 80,
      ad: 70,
      soc: 60,
      cloud: 50,
      ai: 40
    },
    violations: ['VIO-002'],
    feedback: 'Excellent performance on the network security assessment!',
    published: true,
    publishedAt: '2026-09-02T10:00:00Z',
    publishedBy: 'USER-002'
  },
    {
    id: 'RESULT-003',
    studentId: 'USER-005',
    assessmentId: 'ASSESS-WEB-001',
    score: 65,
    percentage: 65,
    grade: 'D',
    status: 'Failed',
    startedAt: '2026-09-01T14:00:00Z',
    submittedAt: '2026-09-01T15:30:00Z',
    timeTaken: 5400,
    attempt: 1,
    maxAttempts: 2,
    questions: [
      { questionId: 1, answer: ['Cross-Site Scripting'], isCorrect: false, pointsEarned: 0 },
      { questionId: 2, answer: 'WRONG_FLAG', isCorrect: false, pointsEarned: 0 },
      { questionId: 3, answer: ['User-Agent'], isCorrect: false, pointsEarned: 0 }
    ],
    practicalTasks: [
      { taskId: 1, answer: 'WRONG_ANSWER', isCorrect: false, pointsEarned: 0 },
      { taskId: 2, answer: 'NOT_A_FLAG', isCorrect: false, pointsEarned: 0 }
    ],
    knowledgeScore: 50,
    practicalScore: 40,
    securityScore: 65,
    skillBreakdown: {
      web: 60,
      network: 55,
      linux: 40,
      windows: 30,
      ad: 20,
      soc: 10,
      cloud: 5,
      ai: 0
    },
    violations: ['VIO-003', 'VIO-004'],
    feedback: 'Needs significant improvement. Review web security fundamentals and practice more.',
    published: true,
    publishedAt: '2026-09-02T14:00:00Z',
    publishedBy: 'USER-002'
  }
];

// ===== SAMPLE RESTRICTIONS =====
export const SAMPLE_RESTRICTIONS = [
  {
    id: 'REST-001',
    userId: 'USER-005',
    type: RESTRICTION_TYPES.PRACTICE_DISABLED,
    reason: 'Multiple policy violations during assessments',
    createdBy: 'USER-002',
    createdAt: '2026-08-28T14:30:00Z',
    expiry: '2026-09-15T00:00:00Z',
    status: 'Active',
    notes: 'Student caught using external resources during timed assessment'
  },
  {
    id: 'REST-002',
    userId: 'USER-003',
    type: RESTRICTION_TYPES.COURSE_ACCESS_DISABLED,
    reason: 'Temporary restriction for maintenance',
    createdBy: 'USER-001',
    createdAt: '2026-09-01T10:00:00Z',
    expiry: '2026-09-05T10:00:00Z',
    status: 'Active',
    notes: 'Access to Level 5 courses temporarily disabled during system update'
  },
  {
    id: 'REST-003',
    userId: 'USER-004',
    type: RESTRICTION_TYPES.LOGIN_DISABLED,
    reason: 'Account security review',
    createdBy: 'USER-001',
    createdAt: '2026-08-30T09:00:00Z',
    expiry: '2026-08-30T10:00:00Z',
    status: 'Expired',
    notes: 'Temporary lockout due to suspicious login attempts'
  }
];

// ===== VALIDATION PATTERNS =====
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  FLAG: /^CYBERNEX\{[A-Za-z0-9_!@#$%^&*()\-+=]{10,50}\}$/,
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,
  COURSE_ID: /^[A-Z]{2,4}-\d{3,5}$/,
  LAB_ID: /^[A-Z]{2,5}-\d{3,5}$/,
  ASSESSMENT_ID: /^ASSESS-[A-Z]{2,5}-\d{3,5}$/,
};

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_FLAG: 'Flag format must be CYBERNEX{...}',
  ASSESSMENT_LOCKED: 'This assessment is locked. Contact your instructor.',
  ASSESSMENT_EXPIRED: 'This assessment has expired.',
  MAX_ATTEMPTS_REACHED: 'You have reached the maximum number of attempts for this assessment.',
  TIMED_OUT: 'Your time has expired. Assessment submitted automatically.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  CONFIRM_ACTION: (action) => `Are you sure you want to ${action}? This action cannot be undone.`,
  DANGEROUS_ACTION: (action) => `Type "${action.toUpperCase()}" to confirm this dangerous action.`,
};

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You are now logged in.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  COURSE_CREATED: 'Course created successfully.',
  COURSE_UPDATED: 'Course updated successfully.',
  ASSESSMENT_CREATED: 'Assessment created successfully.',
  ASSESSMENT_UNLOCKED: 'Assessment unlocked for selected students.',
  ASSESSMENT_STARTED: 'Assessment started. Good luck!',
  ASSESSMENT_SUBMITTED: 'Assessment submitted successfully.',
  RESULT_PUBLISHED: 'Results published successfully.',
  BACKUP_CREATED: 'Backup created successfully.',
  BACKUP_RESTORED: 'Backup restored successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  PROGRESS_SAVED: 'Your progress has been saved.',
};

// ===== TIME CONSTANTS =====
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  // Authentication
  USER: 'cybernex_user',
  USER_TOKEN: 'cybernex_token',
  REMEMBER_ME: 'cybernex_remember_me',

  // Data
  USERS: 'cybernex_users',
  COURSES: 'cybernex_courses',
  LESSONS: 'cybernex_lessons',
  LABS: 'cybernex_labs',
  ASSESSMENTS: 'cybernex_assessments',
  RESULTS: 'cybernex_results',
  ATTENDANCE: 'cybernex_attendance',
  SCHEDULES: 'cybernex_schedules',
  VIOLATIONS: 'cybernex_violations',
  NOTIFICATIONS: 'cybernex_notifications',
  AUDIT_LOGS: 'cybernex_audit_logs',
  RESTRICTIONS: 'cybernex_restrictions',
  BACKUPS: 'cybernex_backups',

  // Settings
  SETTINGS: 'cybernex_settings',
  THEME: 'cybernex_theme',
  PERMISSIONS: 'cybernex_permissions',

  // State
  ASSESSMENT_UNLOCKS: 'cybernex_assessment_unlocks',
  STUDENT_PROGRESS: 'cybernex_student_progress',
  LAST_ACTIVITY: 'cybernex_last_activity',
};

// ===== CERTIFICATE TEMPLATES =====
export const CERTIFICATE_TEMPLATES = [
  {
    id: 'CERT-FOUNDATIONS',
    name: 'Cybersecurity Foundations',
    description: 'Awarded for completing Level 1-3 courses',
    criteria: {
      levels: [1, 2, 3],
      minCompletion: 100,
      minScore: 70
    },
    template: {
      title: 'Cybersecurity Foundations Certificate',
      subtitle: 'Awarded for demonstrating fundamental cybersecurity knowledge',
      background: '/certificates/foundations-bg.jpg',
      signature: '/certificates/signature.png'
    }
  },
  {
    id: 'CERT-PENTESTING',
    name: 'Pentesting Fundamentals',
    description: 'Awarded for completing penetration testing track',
    criteria: {
      requiredCourses: ['Pentesting'],
      minPractice: 15,
      minAssessmentScore: 80
    },
    template: {
      title: 'Penetration Testing Fundamentals Certificate',
      subtitle: 'Awarded for demonstrating penetration testing skills',
      background: '/certificates/pentesting-bg.jpg',
      signature: '/certificates/signature.png'
    }
  },
  {
    id: 'CERT-SOC',
    name: 'SOC Analyst Fundamentals',
    description: 'Awarded for completing SOC track',
    criteria: {
      requiredCourses: ['SOC'],
      minPractice: 10,
      minAssessmentScore: 75
    },
    template: {
      title: 'Security Operations Center Analyst Certificate',
      subtitle: 'Awarded for demonstrating SOC analysis capabilities',
      background: '/certificates/soc-bg.jpg',
      signature: '/certificates/signature.png'
    }
  },
  {
    id: 'CERT-AI-SECURITY',
    name: 'AI Security Fundamentals',
    description: 'Awarded for completing AI Security track',
    criteria: {
      requiredCourses: ['AI Security', 'AI Engineering'],
      minPractice: 8,
      minAssessmentScore: 80
    },
    template: {
      title: 'AI Security Specialist Certificate',
      subtitle: 'Awarded for demonstrating AI security knowledge',
      background: '/certificates/ai-bg.jpg',
      signature: '/certificates/signature.png'
    }
  }
];

// ===== EXPORT ALL CONSTANTS =====
export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  ROLES,
  DEPARTMENTS,
  PERMISSIONS,
  ASSESSMENT_STATES,
  ASSESSMENT_TYPES,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  CYBER_DOMAINS,
  LEVELS,
  ATTENDANCE_STATUSES,
  VIOLATION_TYPES,
  VIOLATION_SEVERITY,
  RESTRICTION_TYPES,
  RESTRICTION_SEVERITY,
  CERTIFICATE_STATES,
  NOTIFICATION_TYPES,
  SEARCH_TYPES,
  PAGINATION_DEFAULT,
  STORAGE_KEYS,
  ASSESSMENT_TIME,
  LEVEL_PROGRESSION,
  LAB_CATEGORIES,
  RESOURCE_PROVIDERS,
  API_ENDPOINTS,
  TIME_FORMATS,
  FILE_TYPES,
  MAX_FILE_SIZES,
  DEFAULT_AVATAR,
  DEFAULT_SETTINGS,
  COURSE_LEVELS,
  AI_ENGINEERING_TRACK,
  LAB_DIFFICULTY,
  ASSESSMENT_DEFAULTS,
  TERMINAL_COMMANDS,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TIME_CONSTANTS,
  CERTIFICATE_TEMPLATES
};
