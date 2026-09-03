import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle2, Lock, PlayCircle, ArrowRight, Clock } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { ROADMAP_STATES } from '../../data/roadmapConfig';

const countModulesLessons = (course) => {
  if (!course) return null;
  const modules = course.modules?.length || 0;
  const lessons = (course.modules || []).reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0
  );
  return { modules, lessons };
};

/**
 * @param {object} props.topic - Topic augmented with { state, progress, comingSoon, primaryCourseId }
 * @param {object} [props.course] - Resolved course object for module/lesson counts
 * @param {'grid'|'flow'} [props.layout] - Visual context; flow renders full-width
 */
const PathNode = ({ topic, course, layout = 'grid' }) => {
  const { isDarkMode } = useTheme();
  const meta = countModulesLessons(course);
  const { state, progress = 0, comingSoon } = topic;

  const surface = isDarkMode
    ? 'bg-gray-800/80 border-gray-700'
    : 'bg-white border-gray-200';

  const baseClasses = `group relative w-full text-left rounded-xl border p-5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${
    layout === 'flow' ? 'max-w-md mx-auto' : ''
  }`;

  let stateIcon = null;
  let ctaLabel = 'Start';
  let ctaIcon = <ArrowRight size={14} />;
  let interactiveClasses = `${surface} hover:border-cyan-400/60 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`;
  let disabled = false;

  if (comingSoon) {
    stateIcon = <Clock size={14} className="text-slate-400" />;
    ctaLabel = 'Coming soon';
    ctaIcon = null;
    interactiveClasses = `${surface} opacity-70 cursor-default`;
    disabled = true;
  } else if (state === ROADMAP_STATES.LOCKED) {
    stateIcon = <Lock size={14} className="text-slate-400" />;
    ctaLabel = 'Complete previous topic';
    ctaIcon = null;
    interactiveClasses = `${surface} opacity-60 cursor-not-allowed`;
    disabled = true;
  } else if (state === ROADMAP_STATES.COMPLETED) {
    stateIcon = <CheckCircle2 size={14} className="text-emerald-400" />;
    ctaLabel = 'Completed';
    ctaIcon = <CheckCircle2 size={14} />;
  } else if (state === ROADMAP_STATES.IN_PROGRESS) {
    stateIcon = <PlayCircle size={14} className="text-cyan-400" />;
    ctaLabel = 'Continue';
    ctaIcon = <ArrowRight size={14} />;
  }

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-cyan-500 dark:text-cyan-400">
            Path
          </span>
          <h3
            className={`mt-1 text-base font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            {topic.title}
          </h3>
        </div>
        <span aria-hidden="true">{stateIcon}</span>
      </div>

      {meta && (
        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {meta.modules} module{meta.modules !== 1 ? 's' : ''} · {meta.lessons} lesson
          {meta.lessons !== 1 ? 's' : ''}
        </p>
      )}

      {!comingSoon && (state === ROADMAP_STATES.IN_PROGRESS || state === ROADMAP_STATES.COMPLETED) && (
        <div className="mt-3">
          <ProgressBar value={progress} size="sm" variant={state === ROADMAP_STATES.COMPLETED ? 'success' : 'primary'} />
        </div>
      )}

      <div
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${
          disabled
            ? 'text-slate-400'
            : 'text-cyan-600 dark:text-cyan-400 group-hover:gap-2.5 transition-all'
        }`}
      >
        {ctaLabel}
        {ctaIcon}
      </div>
    </>
  );

  if (disabled) {
    return (
      <button type="button" disabled className={`${baseClasses} ${interactiveClasses}`}>
        {body}
      </button>
    );
  }

  const href = topic.primaryCourseId
    ? `/student/learning/${topic.primaryCourseId}`
    : `/student/roadmap/${topic.id}`;

  return (
    <Link to={href} className={`${baseClasses} ${interactiveClasses}`}>
      {body}
    </Link>
  );
};

export default PathNode;
