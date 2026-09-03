/**
 * CyberNex Roadmap ("Cyber Atlas") configuration.
 *
 * This is a structural model layered on top of the real course data in
 * `utils/constants.js` (SAMPLE_COURSES). Each topic node MAY reference one
 * or more real course IDs via `courseIds`. Topics with no linked course are
 * upcoming content — the UI marks them "Coming soon" rather than inventing
 * fake courses or fake progress.
 *
 * Shape:
 *   ROADMAP.foundation      -> { id, title, tagline, topics: Topic[] }
 *   ROADMAP.core            -> { id, title, tagline, topics: Topic[] }
 *   ROADMAP.careers         -> CareerPath[]
 *   ROADMAP.advanced        -> { id, title, tagline, topics: Topic[] }
 *
 * Topic:  { id, title, domain, courseIds: string[] }
 * CareerPath: { id, title, summary, flow: string[], topics: Topic[] }
 */

export const ROADMAP_STATES = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const ROADMAP = {
  foundation: {
    id: 'foundation',
    title: 'Foundation',
    tagline: 'Build the basic computer science knowledge required to begin your cybersecurity journey.',
    topics: [
      { id: 'computer-fundamentals', title: 'Computer & Security Fundamentals', domain: 'Foundational', courseIds: ['COURSE-001'] },
      { id: 'operating-systems', title: 'Operating Systems', domain: 'Foundational', courseIds: [] },
      { id: 'internet-fundamentals', title: 'Internet Fundamentals', domain: 'Foundational', courseIds: [] },
    ],
  },

  core: {
    id: 'core',
    title: 'Cybersecurity Core',
    tagline: 'Develop the fundamental skills required across almost every cybersecurity career.',
    topics: [
      { id: 'security-fundamentals', title: 'Security Fundamentals', domain: 'Foundational', courseIds: [] },
      { id: 'networking', title: 'Networking', domain: 'Network Security', courseIds: ['COURSE-002'] },
      { id: 'linux', title: 'Linux', domain: 'Linux', courseIds: [] },
      { id: 'windows', title: 'Windows', domain: 'Windows', courseIds: [] },
      { id: 'web-security', title: 'Web Security', domain: 'Web Security', courseIds: [] },
    ],
  },

  careers: [
    {
      id: 'security-analyst',
      title: 'Security Analyst',
      summary: 'Detect threats, investigate incidents and build defensive security skills.',
      flow: ['Foundation', 'SOC', 'Detection', 'Investigation'],
      topics: [
        { id: 'soc-fundamentals', title: 'SOC Fundamentals', domain: 'SOC', courseIds: [] },
        { id: 'siem', title: 'SIEM', domain: 'SOC', courseIds: [] },
        { id: 'log-analysis', title: 'Log Analysis', domain: 'SOC', courseIds: [] },
        { id: 'detection-engineering', title: 'Detection Engineering', domain: 'SOC', courseIds: [] },
        { id: 'incident-response', title: 'Incident Response', domain: 'Digital Forensics', courseIds: [] },
        { id: 'threat-intelligence', title: 'Threat Intelligence', domain: 'SOC', courseIds: [] },
        { id: 'digital-forensics', title: 'Digital Forensics', domain: 'Digital Forensics', courseIds: [] },
      ],
    },
    {
      id: 'penetration-tester',
      title: 'Penetration Tester',
      summary: 'Learn offensive security, web application testing, enterprise attack paths and red teaming.',
      flow: ['Networking', 'Linux', 'Pentesting', 'Web', 'Red Team'],
      topics: [
        { id: 'pentesting-fundamentals', title: 'Pentesting Fundamentals', domain: 'Pentesting', courseIds: [] },
        { id: 'reconnaissance', title: 'Reconnaissance', domain: 'Pentesting', courseIds: [] },
        { id: 'web-application-security', title: 'Web Application Security', domain: 'Web Security', courseIds: [] },
        { id: 'api-security', title: 'API Security', domain: 'Web Security', courseIds: [] },
        { id: 'active-directory-security', title: 'Active Directory Security', domain: 'Active Directory', courseIds: [] },
        { id: 'privilege-escalation', title: 'Privilege Escalation', domain: 'Pentesting', courseIds: [] },
        { id: 'red-teaming', title: 'Red Teaming', domain: 'Pentesting', courseIds: [] },
      ],
    },
    {
      id: 'security-engineer',
      title: 'Security Engineer',
      summary: 'Build and secure infrastructure, cloud and modern development environments.',
      flow: ['Networking', 'Systems', 'Cloud', 'DevSecOps'],
      topics: [
        { id: 'infrastructure-security', title: 'Infrastructure Security', domain: 'Network Security', courseIds: [] },
        { id: 'cloud-security', title: 'Cloud Security', domain: 'Cloud Security', courseIds: [] },
        { id: 'iam', title: 'Identity & Access Management', domain: 'Cloud Security', courseIds: [] },
        { id: 'devsecops', title: 'DevSecOps', domain: 'DevSecOps', courseIds: [] },
        { id: 'container-security', title: 'Container Security', domain: 'Cloud Security', courseIds: [] },
      ],
    },
  ],

  advanced: {
    id: 'ai-security',
    title: 'AI Security & Advanced Paths',
    tagline: 'Extend your skillset into the security of AI systems and advanced engineering topics.',
    topics: [
      { id: 'python-for-ai', title: 'Python for AI', domain: 'AI Engineering', courseIds: [] },
      { id: 'machine-learning', title: 'Machine Learning', domain: 'AI Engineering', courseIds: [] },
      { id: 'llm-fundamentals', title: 'LLM Fundamentals', domain: 'AI Engineering', courseIds: [] },
      { id: 'ai-security-topic', title: 'AI Security', domain: 'AI Security', courseIds: [] },
      { id: 'prompt-injection', title: 'Prompt Injection', domain: 'AI Security', courseIds: [] },
      { id: 'ai-red-teaming', title: 'AI Red Teaming', domain: 'AI Security', courseIds: [] },
    ],
  },
};

/** Flat list of every topic list in the roadmap, tagged with its parent path id. */
export const getAllTopicLists = () => [
  { pathId: 'foundation', topics: ROADMAP.foundation.topics },
  { pathId: 'core', topics: ROADMAP.core.topics },
  ...ROADMAP.careers.map((c) => ({ pathId: c.id, topics: c.topics })),
  { pathId: 'ai-security', topics: ROADMAP.advanced.topics },
];

export const getCareerPathById = (pathId) =>
  ROADMAP.careers.find((c) => c.id === pathId);

export const getPathById = (pathId) => {
  if (pathId === 'foundation') return ROADMAP.foundation;
  if (pathId === 'core') return ROADMAP.core;
  if (pathId === 'ai-security') return ROADMAP.advanced;
  return getCareerPathById(pathId);
};

export default ROADMAP;
