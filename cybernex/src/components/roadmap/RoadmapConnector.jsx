import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Decorative vertical connector between roadmap sections.
 * `active` highlights the connector (cyan) to mark the student's current
 * position in the journey; purely decorative, hidden from screen readers.
 */
const RoadmapConnector = ({ active = false, height = 'h-10' }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-center" aria-hidden="true">
      <div
        className={`w-px ${height} ${
          active
            ? 'bg-gradient-to-b from-cyan-400 to-cyan-400/20'
            : isDarkMode
              ? 'bg-gray-700'
              : 'bg-gray-300'
        }`}
      />
    </div>
  );
};

export default RoadmapConnector;
