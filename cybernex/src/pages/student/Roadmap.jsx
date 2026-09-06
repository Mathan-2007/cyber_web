import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROADMAP } from '../../data/roadmapConfig';
import { getTopicListStatus, getOverallProgress } from '../../utils/roadmapProgress';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  Globe,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';

const DOMAIN_ICON = {
  Foundational: Cpu,
  'Network Security': Network,
  Linux: Terminal,
  Windows: Terminal,
  'Web Security': Globe,
  SOC: Search,
  'Digital Forensics': ShieldCheck,
  Pentesting: Search,
  'Active Directory': ShieldCheck,
  'Cloud Security': Globe,
  DevSecOps: Sparkles,
  'AI Security': Sparkles,
  'AI Engineering': Sparkles,
};

const PATH_STYLES = {
  foundation: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  core: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'security-analyst': 'border-sky-200 bg-sky-50 text-sky-700',
  'penetration-tester': 'border-rose-200 bg-rose-50 text-rose-700',
  'security-engineer': 'border-amber-200 bg-amber-50 text-amber-700',
  'ai-security': 'border-violet-200 bg-violet-50 text-violet-700',
};

const Roadmap = () => {
  const { user } = useAuth();
  const { filteredCourses, filteredLessons, isLoading } = useData();
  const [selectedPath, setSelectedPath] = useState('foundation');

  const ctx = useMemo(
    () => ({ courses: filteredCourses || [], lessons: filteredLessons || [], user }),
    [filteredCourses, filteredLessons, user]
  );

  const foundationTopics = useMemo(() => getTopicListStatus(ROADMAP.foundation.topics, ctx), [ctx]);
  const coreTopics = useMemo(() => getTopicListStatus(ROADMAP.core.topics, ctx), [ctx]);
  const advancedTopics = useMemo(() => getTopicListStatus(ROADMAP.advanced.topics, ctx), [ctx]);

  const careerCollections = useMemo(
    () => ROADMAP.careers.map((career) => ({
      ...career,
      topics: getTopicListStatus(career.topics, ctx),
    })),
    [ctx]
  );

  const paths = useMemo(
    () => [
      { id: 'foundation', title: 'Foundation', description: ROADMAP.foundation.tagline, topics: foundationTopics },
      { id: 'core', title: 'Cybersecurity Core', description: ROADMAP.core.tagline, topics: coreTopics },
      ...careerCollections.map((career) => ({
        id: career.id,
        title: career.title,
        description: career.summary,
        topics: career.topics,
      })),
      { id: 'ai-security', title: 'AI Security', description: ROADMAP.advanced.tagline, topics: advancedTopics },
    ],
    [foundationTopics, coreTopics, careerCollections, advancedTopics]
  );

  const selectedPathConfig = paths.find((path) => path.id === selectedPath) || paths[0];
  const overallProgress = useMemo(() => {
    const allTopics = paths.flatMap((path) => path.topics);
    return getOverallProgress(allTopics);
  }, [paths]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
          <Compass size={12} /> Cyber Atlas
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">Cyber Security Learning Roadmap</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your learning path is open and guided — choose a track, then move from fundamentals to specialization.
        </p>
        <div className="mx-auto mt-4 max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="mt-2 text-[11px] font-medium text-slate-500">{overallProgress}% overall progress</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {paths.map((path) => {
          const active = path.id === selectedPathConfig.id;
          const Icon = path.id === 'foundation' ? BookOpen : path.id === 'core' ? ShieldCheck : DOMAIN_ICON[path.topics[0]?.domain] || Cpu;
          return (
            <button
              key={path.id}
              type="button"
              onClick={() => setSelectedPath(path.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${active ? PATH_STYLES[path.id] || 'border-slate-300 bg-slate-50 text-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
                  <Icon size={18} />
                </span>
                <span className="rounded-full border border-current/20 bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                  {path.topics.filter((t) => t.state === 'completed').length}/{path.topics.length}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{path.title}</h2>
              <p className="mt-1 text-sm opacity-80">{path.description}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Selected track</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedPathConfig.title}</h2>
          </div>
          <Link
            to={`/student/learning`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
          >
            Explore learning
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {selectedPathConfig.topics.map((topic) => {
            const Icon = DOMAIN_ICON[topic.domain] || Cpu;
            const stateTone =
              topic.state === 'completed'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : topic.state === 'in-progress'
                  ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                  : 'border-slate-200 bg-white text-slate-700';

            return (
              <Link
                key={topic.id}
                to={topic.primaryCourseId ? `/student/learning/${topic.primaryCourseId}` : '/student/learning'}
                className={`rounded-xl border p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 ${stateTone}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80">
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{topic.title}</p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{topic.domain}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-current/20 bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {topic.state === 'completed' ? <CheckCircle2 size={12} /> : null}
                    {topic.state === 'completed' ? 'Done' : topic.state === 'in-progress' ? 'In progress' : 'Open'}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${topic.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{topic.progress}% complete</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
