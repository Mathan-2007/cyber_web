import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldAlert, Lock, EyeOff, CopyX, MonitorSmartphone, TimerReset, FolderLock, CheckCircle, Users, SlidersHorizontal } from 'lucide-react';

const defaultSecuritySettings = {
  blockFileDownload: true,
  blockCopyPaste: true,
  strictEnvironment: true,
  webcamRequired: false,
  strikeLimit: 3,
  fallbackTimer: 15,
  allowAccessWithoutBrowser: false,
  examLock: true,
};

const Restrictions = () => {
  const { courses, isLoading } = useData();
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [policy, setPolicy] = useState(defaultSecuritySettings);

  const courseOptions = useMemo(() => {
    const list = courses?.length ? courses : [];
    return [{ id: 'all', name: 'All Courses' }, ...list];
  }, [courses]);

  const selectedCourse = courseOptions.find((course) => course.id === selectedCourseId) || courseOptions[0];

  const updatePolicy = (key, value) => {
    setPolicy((current) => ({ ...current, [key]: value }));
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Control evaluation security, anti-cheat barriers, and exam access conditions by course.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <ShieldAlert size={24} className="mx-auto mb-2 text-red-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{courseOptions.length - 1}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Courses</div>
        </Card>
        <Card className="text-center">
          <Lock size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{policy.blockCopyPaste ? 'On' : 'Off'}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Copy/Paste Lock</div>
        </Card>
        <Card className="text-center">
          <TimerReset size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{policy.fallbackTimer}s</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Fallback Timer</div>
        </Card>
        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-emerald-600" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{policy.strikeLimit}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Strike Limit</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="select select-primary w-full"
            >
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-auto">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Current policy: {selectedCourse?.name || 'All Courses'}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assessment Protection</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <EyeOff size={16} /> Block file download during assessment
              </span>
              <input type="checkbox" checked={policy.blockFileDownload} onChange={(event) => updatePolicy('blockFileDownload', event.target.checked)} className="toggle toggle-primary" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <CopyX size={16} /> Block copy/paste and clipboard access
              </span>
              <input type="checkbox" checked={policy.blockCopyPaste} onChange={(event) => updatePolicy('blockCopyPaste', event.target.checked)} className="toggle toggle-primary" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <MonitorSmartphone size={16} /> Strict environment isolation
              </span>
              <input type="checkbox" checked={policy.strictEnvironment} onChange={(event) => updatePolicy('strictEnvironment', event.target.checked)} className="toggle toggle-primary" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <FolderLock size={16} /> Lock exam when policy is violated
              </span>
              <input type="checkbox" checked={policy.examLock} onChange={(event) => updatePolicy('examLock', event.target.checked)} className="toggle toggle-primary" />
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle className="text-emerald-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Limits</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Strike limit before lock</label>
              <input
                type="number"
                min="1"
                max="10"
                value={policy.strikeLimit}
                onChange={(event) => updatePolicy('strikeLimit', Number(event.target.value) || 1)}
                className="input input-primary w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fallback timer (seconds)</label>
              <input
                type="number"
                min="5"
                max="180"
                value={policy.fallbackTimer}
                onChange={(event) => updatePolicy('fallbackTimer', Number(event.target.value) || 15)}
                className="input input-primary w-full"
              />
            </div>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Require webcam verification</span>
              <input type="checkbox" checked={policy.webcamRequired} onChange={(event) => updatePolicy('webcamRequired', event.target.checked)} className="toggle toggle-primary" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Allow access without browser controls</span>
              <input type="checkbox" checked={policy.allowAccessWithoutBrowser} onChange={(event) => updatePolicy('allowAccessWithoutBrowser', event.target.checked)} className="toggle toggle-primary" />
            </label>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" onClick={() => setPolicy(defaultSecuritySettings)}>Reset Policy</Button>
          <Button variant="primary">Save Security Policy</Button>
        </div>
      </Card>
    </div>
  );
};

export default Restrictions;
