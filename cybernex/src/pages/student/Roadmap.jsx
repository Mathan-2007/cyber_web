// src/pages/student/Roadmap.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROADMAP } from '../../data/roadmapConfig';
import { getTopicListStatus, getOverallProgress } from '../../utils/roadmapProgress';
import {
  Cpu, Globe, Network, Terminal, MonitorCog, ShieldCheck,
  Search, Bug, Cloud, Sparkles, Lock, CheckCircle2, PlayCircle,
  ArrowRight, ChevronDown, Compass,
} from 'lucide-react';

/* Icon + accent per topic domain, so nodes read at a glance like THM's
   colored path icons — without reusing any of their artwork. */
const DOMAIN_ICON = {
  Foundational: Cpu,
  'Network Security': Network,
  Linux: Terminal,
  Windows: MonitorCog,
  'Web Security': Globe,
  SOC: Search,
  'Digital Forensics': Search,
  Pentesting: Bug,
  'Active Directory': ShieldCheck,
  'Cloud Security': Cloud,
  DevSecOps: Cloud,
  'AI Security': Sparkles,
  'AI Engineering': Sparkles,
};

/* One accent theme per career branch/column */
const BRANCH_THEME = {
  'security-analyst': { text: 'text-cyan-400', ring: 'ring-cyan-400/40', bg: 'bg-cyan-500/10', bar: 'bg-cyan-500' },
  'penetration-tester': { text: 'text-rose-400', ring: 'ring-rose-400/40', bg: 'bg-rose-500/10', bar: 'bg-rose-500' },
  'security-engineer': { text: 'text-amber-400', ring: 'ring-amber-400/40', bg: 'bg-amber-500/10', bar: 'bg-amber-500' },
  'ai-security': { text: 'text-violet-400', ring: 'ring-violet-400/40', bg: 'bg-violet-500/10', bar: 'bg-violet-500' },
};

/* --- small building blocks --------------------------------------- */

const Connector = ({ active }) => (
  <div className="flex flex-col items-center py-1" aria-hidden="true">
    <div className={`w-px h-6 ${active ? 'bg-cyan-400/60' : 'bg-gray-700'}`} />
    <ChevronDown size={14} className={active ? 'text-cyan-400' : 'text-gray-700'} />
  </div>
);

const SectionHeaderNode = ({ title, description }) => (
  <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-center">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    {description && <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>}
  </div>
);

/* A single trunk topic node (Foundation / Core) */
const TrunkNode = ({ topic }) => {
  const Icon = DOMAIN_ICON[topic.domain] || Cpu;
  const locked = topic.state === 'locked';
  const completed = topic.state === 'completed';
  const inProgress = topic.state === 'in-progress';

  const StateIcon = completed ? CheckCircle2 : locked ? Lock : inProgress ? PlayCircle : ArrowRight;
  const stateColor = completed ? 'text-emerald-400' : locked ? 'text-gray-500' : 'text-cyan-400';

  const inner = (
    <div
      className={`w-full max-w-sm flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
        locked
          ? 'border-gray-800 bg-gray-800/40 opacity-60'
          : 'border-gray-700 bg-gray-800 hover:border-cyan-400/50'
      }`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-700/70 ${topic.comingSoon ? 'text-gray-500' : 'text-cyan-400'}`}>
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-100">{topic.title}</span>
        <span className="flex items-center gap-1 text-[11px] text-gray-500">
          <span>Path</span>
        </span>
      </span>
      <StateIcon size={16} className={stateColor} aria-hidden="true" />
    </div>
  );

  if (locked || topic.comingSoon) {
    return (
      <button type="button" disabled className="w-full max-w-sm cursor-not-allowed" aria-label={`${topic.title} — ${locked ? 'locked' : 'coming soon'}`}>
        {inner}
      </button>
    );
  }

  return (
    <Link to={`/student/learning/${topic.primaryCourseId}`} className="w-full max-w-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
      {inner}
    </Link>
  );
};

/* A branch/column topic node (Security Analyst / Pentester / Engineer / AI) */
const BranchNode = ({ topic, theme }) => {
  const Icon = DOMAIN_ICON[topic.domain] || Cpu;
  const locked = topic.state === 'locked';
  const completed = topic.state === 'completed';

  const StateIcon = completed ? CheckCircle2 : locked ? Lock : ArrowRight;

  const inner = (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors ${
        locked
          ? 'border-gray-800 bg-gray-800/40 opacity-60'
          : `border-gray-700 bg-gray-800 hover:border-white/20`
      }`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${theme.bg} ${theme.text}`}>
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-gray-100">{topic.title}</span>
        <span className="text-[10px] text-gray-500">Path</span>
      </span>
      <StateIcon size={13} className={completed ? 'text-emerald-400' : locked ? 'text-gray-500' : theme.text} aria-hidden="true" />
    </div>
  );

  if (locked || topic.comingSoon) {
    return (
      <button type="button" disabled className="w-full cursor-not-allowed" aria-label={`${topic.title} — ${locked ? 'locked' : 'coming soon'}`}>
        {inner}
      </button>
    );
  }

  return (
    <Link to={`/student/learning/${topic.primaryCourseId}`} className={`w-full rounded-lg focus:outline-none focus-visible:ring-2 ${theme.ring}`}>
      {inner}
    </Link>
  );
};

/* A column of branch nodes with its own header + connector line */
const CareerColumn = ({ id, title, description, topics, theme }) => (
  <div className="flex flex-col">
    <div className="text-center mb-3">
      <h4 className={`text-sm font-semibold ${theme.text}`}>{title}</h4>
      <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">{description}</p>
    </div>
    <div className="relative flex flex-col gap-2 pt-2 pl-3">
      <div className={`absolute left-0 top-0 bottom-2 w-px ${theme.bar}/30`} aria-hidden="true" />
      {topics.map((topic) => (
        <BranchNode key={topic.id} topic={topic} theme={theme} />
      ))}
    </div>
  </div>
);

/* --- page ----------------------------------------------------------- */

const Roadmap = () => {
  const { user } = useAuth();
  const { filteredCourses, filteredLessons, isLoading } = useData();
  const { isDarkMode } = useTheme();

  const ctx = useMemo(
    () => ({ courses: filteredCourses || [], lessons: filteredLessons || [], user }),
    [filteredCourses, filteredLessons, user]
  );

  const foundationTopics = useMemo(() => getTopicListStatus(ROADMAP.foundation.topics, ctx), [ctx]);
  const coreTopics = useMemo(() => getTopicListStatus(ROADMAP.core.topics, ctx), [ctx]);
  const advancedTopics = useMemo(() => getTopicListStatus(ROADMAP.advanced.topics, ctx), [ctx]);

  const careerColumns = useMemo(
    () => ROADMAP.careers.map((career) => ({
      career,
      topics: getTopicListStatus(career.topics, ctx),
    })),
    [ctx]
  );

  const overallProgress = useMemo(() => {
    const all = [...foundationTopics, ...coreTopics, ...advancedTopics];
    careerColumns.forEach(({ topics }) => all.push(...topics));
    return getOverallProgress(all);
  }, [foundationTopics, coreTopics, advancedTopics, careerColumns]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-6 md:p-10 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-slate-900 border-slate-800'}`}>
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium tracking-wide text-cyan-300 uppercase">
          <Compass size={12} /> Cyber Atlas
        </span>
        <h1 className="mt-3 text-2xl md:text-3xl font-bold text-white">Cyber Security Learning Roadmap</h1>
        <p className="mt-2 text-sm text-slate-400">
          From fundamental principles to advanced techniques — clear steps and a focused
          skill path from your first login to a chosen specialization.
        </p>
        <div className="mt-4 max-w-xs mx-auto">
          <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-gray-500">{overallProgress}% overall progress</p>
        </div>
      </div>

      {/* Trunk: Foundation */}
      <div className="mt-10 flex flex-col items-center">
        <SectionHeaderNode
          title="Foundation"
          description="Acquire the basic computer science skills required to get started in cybersecurity."
        />
        <Connector active={overallProgress > 0} />
        <div className="flex flex-col items-center gap-2 w-full">
          {foundationTopics.map((topic, i) => (
            <React.Fragment key={topic.id}>
              {i > 0 && <Connector active={topic.state !== 'locked'} />}
              <TrunkNode topic={topic} />
            </React.Fragment>
          ))}
        </div>

        <Connector />

        {/* Trunk: Core */}
        <SectionHeaderNode
          title="Cybersecurity Core"
          description="Develop the fundamental skills needed to enter any career in the industry."
        />
        <Connector />
        <div className="flex flex-col items-center gap-2 w-full">
          {coreTopics.map((topic, i) => (
            <React.Fragment key={topic.id}>
              {i > 0 && <Connector active={topic.state !== 'locked'} />}
              <TrunkNode topic={topic} />
            </React.Fragment>
          ))}
        </div>

        <Connector />

        <SectionHeaderNode
          title="Cyber Security Career Skills"
          description="Master the specific skills necessary for your career of interest."
        />
      </div>

      {/* Branches */}
      <div className="mt-8">
        <div className="hidden md:block h-px bg-gray-800" aria-hidden="true" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <CareerColumn
            id="security-analyst"
            title="Security Analyst"
            description="Get on the fast track to becoming a successful Security Analyst."
            topics={careerColumns.find((c) => c.career.id === 'security-analyst')?.topics || []}
            theme={BRANCH_THEME['security-analyst']}
          />
          <CareerColumn
            id="penetration-tester"
            title="Penetration Tester"
            description="Level up and forge your path to victory as a Penetration Tester."
            topics={careerColumns.find((c) => c.career.id === 'penetration-tester')?.topics || []}
            theme={BRANCH_THEME['penetration-tester']}
          />
          <CareerColumn
            id="security-engineer"
            title="Security Engineer"
            description="Navigate your journey to becoming a world-class Security Engineer."
            topics={careerColumns.find((c) => c.career.id === 'security-engineer')?.topics || []}
            theme={BRANCH_THEME['security-engineer']}
          />
          <CareerColumn
            id="ai-security"
            title="AI"
            description="Evolve your skillset and explore the world of AI security."
            topics={advancedTopics}
            theme={BRANCH_THEME['ai-security']}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-14 text-center">
        <h3 className="text-sm font-semibold text-white">What's next?</h3>
        <p className="mt-1 text-xs text-gray-500">
          Explore practice labs and assessments to put each path into action.
        </p>
        <Link
          to="/student/practice"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
        >
          Explore practice labs
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default Roadmap;