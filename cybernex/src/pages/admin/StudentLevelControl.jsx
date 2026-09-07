import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ROLES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, RotateCcw, ArrowRight, ShieldAlert } from 'lucide-react';

const StudentLevelControl = () => {
  const { users, isLoading, modifyUser } = useData();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [customLevel, setCustomLevel] = useState('0');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const students = useMemo(
    () => users.filter((user) => user.role === ROLES.STUDENT),
    [users]
  );

  const selectedUser = students.find((user) => user.id === selectedUserId) || students[0] || null;

  const handleUpdateLevel = async (nextLevel) => {
    if (!selectedUser) {
      setError('Please select a student.');
      return;
    }

    setIsUpdating(true);
    setError('');
    setMessage('');

    try {
      const safeLevel = Number(nextLevel) || 0;
      const progress = selectedUser.progress || {};

      await modifyUser(selectedUser.id, {
        level: safeLevel,
        progress: {
          ...progress,
          currentLevel: safeLevel,
          levels: safeLevel === 0 ? [] : Array.from(new Set([...(progress.levels || []), safeLevel]))
        }
      });

      setMessage(`Student level updated to ${safeLevel}.`);
    } catch (err) {
      console.error('Failed to update student level:', err);
      setError('Failed to update the student level.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Level Control</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Reset a student to level 0 or set a specific level for any learner.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Student</label>
            <select
              value={selectedUserId || selectedUser?.id || ''}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="select select-primary w-full"
            >
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Level</label>
            <input
              type="number"
              min="0"
              max="12"
              value={customLevel}
              onChange={(event) => setCustomLevel(event.target.value)}
              className="input input-primary w-full"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="danger" startIcon={<RotateCcw size={16} />} onClick={() => handleUpdateLevel(0)} isLoading={isUpdating}>
            Set to Level 0
          </Button>
          <Button variant="primary" startIcon={<ArrowRight size={16} />} onClick={() => handleUpdateLevel(customLevel)} isLoading={isUpdating}>
            Apply Selected Level
          </Button>
        </div>

        {selectedUser && (
          <div className="mt-6 rounded-lg bg-slate-50 dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={20} />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Current level: {selectedUser.level ?? 0}</div>
              </div>
            </div>
          </div>
        )}

        {message && <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}
        {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="text-amber-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Rules</h2>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li>Level 0 resets the student to the start of the learning path.</li>
          <li>Choose any level from 0 to 12 to move the user to that stage.</li>
          <li>Setting a new level will update the learner’s current progress metadata.</li>
        </ul>
      </Card>
    </div>
  );
};

export default StudentLevelControl;
