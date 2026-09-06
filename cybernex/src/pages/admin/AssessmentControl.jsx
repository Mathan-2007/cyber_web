import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, CheckCircle2, Clock3, Monitor, Play, ShieldCheck, Square, TimerReset } from 'lucide-react';

const AssessmentControl = () => {
  const { assessments, globalAssessmentPolicy, assessmentSessions, updateGlobalAssessmentPolicy, startAssessmentForAll, stopAssessmentForAll, extendAssessmentForAll, isAssessmentSessionLive, isLoading } = useData();
  const { hasPermission } = usePermissions();

  const [policy, setPolicy] = useState({
    timeLimit: 60,
    questionsPerAttempt: 5,
    maxViolations: 3,
    fullScreenRequired: true,
  });
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (globalAssessmentPolicy) {
      setPolicy({
        timeLimit: Number(globalAssessmentPolicy.timeLimit || 60),
        questionsPerAttempt: Number(globalAssessmentPolicy.questionsPerAttempt || 5),
        maxViolations: Number(globalAssessmentPolicy.maxViolations || 3),
        fullScreenRequired: globalAssessmentPolicy.fullScreenRequired !== false,
      });
    }
  }, [globalAssessmentPolicy]);

  useEffect(() => {
    if (assessments.length && !selectedAssessmentId) {
      setSelectedAssessmentId(assessments[0].id);
    }
  }, [assessments, selectedAssessmentId]);

  const handleSavePolicy = async () => {
    await updateGlobalAssessmentPolicy(policy);
    setStatusMessage('Assessment policy updated successfully.');
  };

  const handleOpenSession = async () => {
    if (!selectedAssessmentId) return;
    await startAssessmentForAll(selectedAssessmentId, {
      durationMinutes: Number(durationMinutes) || 60,
      timeLimitOverride: Number(policy.timeLimit) || 60,
      maxViolations: Number(policy.maxViolations) || 3,
      questionsPerAttempt: Number(policy.questionsPerAttempt) || 5,
      fullScreenRequired: Boolean(policy.fullScreenRequired),
    });
    setStatusMessage('Live assessment session started.');
  };

  const handleStopSession = async () => {
    if (!selectedAssessmentId) return;
    await stopAssessmentForAll(selectedAssessmentId);
    setStatusMessage('Live assessment session stopped.');
  };

  const handleExtendSession = async () => {
    if (!selectedAssessmentId) return;
    await extendAssessmentForAll(selectedAssessmentId, 15);
    setStatusMessage('Assessment session extended by 15 minutes.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasPermission('assessment.manage')) {
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} />
          <span>You do not have permission to manage assessment control.</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">Master Control</p>
          <h1 className="text-2xl font-bold text-slate-900">Assessment Control</h1>
        </div>
        <Badge className="bg-cyan-100 text-cyan-700">Admin override</Badge>
      </div>

      {statusMessage && (
        <Card className="border-emerald-200 bg-emerald-50 text-emerald-700">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} />
            <span>{statusMessage}</span>
          </div>
        </Card>
      )}

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Default time limit (minutes)
            <input
              type="number"
              min="10"
              value={policy.timeLimit}
              onChange={(e) => setPolicy((prev) => ({ ...prev, timeLimit: Number(e.target.value) || 60 }))}
              className="input input-primary mt-2"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Questions per attempt
            <input
              type="number"
              min="1"
              value={policy.questionsPerAttempt}
              onChange={(e) => setPolicy((prev) => ({ ...prev, questionsPerAttempt: Number(e.target.value) || 5 }))}
              className="input input-primary mt-2"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Max violations before auto-submit
            <input
              type="number"
              min="1"
              value={policy.maxViolations}
              onChange={(e) => setPolicy((prev) => ({ ...prev, maxViolations: Number(e.target.value) || 3 }))}
              className="input input-primary mt-2"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
            Fullscreen required
            <input
              type="checkbox"
              checked={policy.fullScreenRequired}
              onChange={(e) => setPolicy((prev) => ({ ...prev, fullScreenRequired: e.target.checked }))}
              className="h-4 w-4"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSavePolicy} variant="primary">Save default policy</Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700">Assessment</label>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="input input-primary mt-2 w-full"
            >
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>{assessment.title}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:max-w-[180px]">
            <label className="text-sm font-medium text-slate-700">Live window</label>
            <input
              type="number"
              min="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
              className="input input-primary mt-2 w-full"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button startIcon={<Play size={16} />} onClick={handleOpenSession}>Start live session</Button>
          <Button variant="outline" startIcon={<TimerReset size={16} />} onClick={handleExtendSession}>Extend +15m</Button>
          <Button variant="danger" startIcon={<Square size={16} />} onClick={handleStopSession}>Stop session</Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Clock3 size={14} /> {policy.timeLimit} min default
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Monitor size={14} /> {policy.fullScreenRequired ? 'Fullscreen required' : 'Fullscreen optional'}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <ShieldCheck size={14} /> {policy.maxViolations} violation threshold
          </span>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentControl;
