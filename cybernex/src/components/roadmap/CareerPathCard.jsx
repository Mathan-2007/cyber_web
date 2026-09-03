import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';

/**
 * Large branch card for a career path on the main roadmap page.
 * @param {object} props.career - { id, title, summary, flow }
 * @param {number} props.progress - 0-100 overall progress for this path
 */
const CareerPathCard = ({ career, progress = 0 }) => {
  const { isDarkMode } = useTheme();

  return (
    <Link
      to={`/student/roadmap/${career.id}`}
      className={`group flex flex-col rounded-2xl border p-6 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-xl ${
        isDarkMode
          ? 'bg-gray-800/80 border-gray-700 hover:border-cyan-400/50'
          : 'bg-white border-gray-200 hover:border-cyan-400/60'
      }`}
    >
      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {career.title}
      </h3>
      <p className={`mt-2 text-sm flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {career.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
        {career.flow.map((step, idx) => (
          <React.Fragment key={step}>
            <span
              className={`px-2 py-0.5 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {step}
            </span>
            {idx < career.flow.length - 1 && (
              <ArrowRight size={10} className="text-slate-500" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>

      {progress > 0 && (
        <p className="mt-3 text-xs font-medium text-cyan-500 dark:text-cyan-400">
          {progress}% complete
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 group-hover:gap-2.5 transition-all">
        Explore Path
        <ArrowRight size={14} />
      </span>
    </Link>
  );
};

export default CareerPathCard;
