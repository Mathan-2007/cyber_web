import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Compass, PlayCircle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

/**
 * Hero banner for the /student/roadmap ("Cyber Atlas") page.
 *
 * @param {number} props.level - Student's current level (real user.level)
 * @param {number} props.maxLevel - Ceiling used only for the "Level X / Y" label
 * @param {number} props.overallProgress - 0-100, computed from real course progress
 * @param {object|null} props.continueTarget - { primaryCourseId, title } or null
 */
const RoadmapHero = ({ level = 1, maxLevel = 12, overallProgress = 0, continueTarget }) => {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border p-8 md:p-10 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 border-gray-800'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-slate-800'
      }`}
    >
      {/* Ambient accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-300 uppercase">
          Cyber Atlas
        </span>

        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white tracking-tight">
          Your cybersecurity journey
        </h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Build your foundation, develop practical skills, choose a specialization and
          progress toward advanced security engineering.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={continueTarget ? `/student/learning/${continueTarget.primaryCourseId}` : '#foundation'}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            <PlayCircle size={16} />
            Continue Learning
          </Link>
          <a
            href="#careers"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/5 transition-colors"
          >
            <Compass size={16} />
            Explore Paths
          </a>
        </div>

        <div className="mt-8 max-w-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Overall Journey
            </span>
            <span className="text-xs font-medium text-slate-300">
              Level {level} / {maxLevel}
            </span>
          </div>
          <ProgressBar value={overallProgress} showLabel size="md" variant="primary" />
        </div>
      </div>
    </section>
  );
};

export default RoadmapHero;
