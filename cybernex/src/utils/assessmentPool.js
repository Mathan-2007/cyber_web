import { getQuestionSelectionFor, setQuestionSelectionFor, getGlobalAssessmentPolicy, getAssessmentSession, getAssessmentAccessForStudent } from '../services/storageService';

const normalizeQuestion = (question, index = 0) => {
  if (!question) return null;
  const normalized = {
    ...question,
    id: question.id || `Q-${index + 1}`,
    questionNumber: question.questionNumber || index + 1,
    text: question.text || question.prompt || `Question ${index + 1}`,
    options: Array.isArray(question.options) ? question.options : [],
    type: question.type || 'multiple-choice',
  };

  if (normalized.correctAnswer !== undefined && normalized.answer !== undefined && normalized.correctAnswer === undefined) {
    normalized.correctAnswer = normalized.answer;
  }

  return normalized;
};

export const getQuestionPool = (assessment) => {
  if (!assessment) return [];
  const source = Array.isArray(assessment.questions) ? assessment.questions : [];
  if (source.length) {
    return source.map((question, index) => normalizeQuestion(question, index)).filter(Boolean);
  }
  const fallback = Array.isArray(assessment.pool) ? assessment.pool : [];
  return fallback.map((question, index) => normalizeQuestion(question, index)).filter(Boolean);
};

export const getEffectivePolicy = (assessment = {}, studentId = null) => {
  const globalPolicy = getGlobalAssessmentPolicy();
  const assessmentSettings = assessment.settings || {};
  const session = assessment?.id ? getAssessmentSession(assessment.id) : null;
  const accessGrant = studentId && assessment?.id ? getAssessmentAccessForStudent(assessment.id, studentId) : null;

  const merged = {
    timeLimit: Number(globalPolicy.timeLimit ?? 60),
    questionsPerAttempt: Number(globalPolicy.questionsPerAttempt ?? 5),
    maxViolations: Number(globalPolicy.maxViolations ?? 3),
    fullScreenRequired: globalPolicy.fullScreenRequired !== false,
    ...assessmentSettings,
    ...(session?.timeLimitOverride ? { timeLimit: session.timeLimitOverride } : {}),
    ...(session?.questionsPerAttempt ? { questionsPerAttempt: session.questionsPerAttempt } : {}),
    ...(session?.maxViolations ? { maxViolations: session.maxViolations } : {}),
    ...(session?.fullScreenRequired !== null && session?.fullScreenRequired !== undefined
      ? { fullScreenRequired: session.fullScreenRequired }
      : {}),
    ...(accessGrant?.durationOverride ? { timeLimit: Number(accessGrant.durationOverride) } : {}),
    ...(accessGrant?.questionsPerAttempt ? { questionsPerAttempt: Number(accessGrant.questionsPerAttempt) } : {}),
    ...(accessGrant?.maxViolations ? { maxViolations: Number(accessGrant.maxViolations) } : {}),
    ...(accessGrant?.fullScreenRequired !== undefined && accessGrant?.fullScreenRequired !== null
      ? { fullScreenRequired: Boolean(accessGrant.fullScreenRequired) }
      : {}),
    ...(assessment?.duration ? { timeLimit: Number(assessment.duration) } : {}),
    ...(assessment?.maxViolations ? { maxViolations: Number(assessment.maxViolations) } : {}),
    ...(assessment?.fullScreenRequired !== undefined ? { fullScreenRequired: Boolean(assessment.fullScreenRequired) } : {}),
  };

  return {
    timeLimit: Number(merged.timeLimit || 60),
    questionsPerAttempt: Number(merged.questionsPerAttempt || 5),
    maxViolations: Number(merged.maxViolations || 3),
    fullScreenRequired: merged.fullScreenRequired !== false,
  };
};

export const selectQuestionsForStudent = (assessment, studentId, options = {}) => {
  const { forceReshuffle = false } = options;
  if (!assessment || !studentId) {
    return getQuestionPool(assessment);
  }

  const pool = getQuestionPool(assessment);
  if (!pool.length) return [];

  const selectionKey = `${assessment.id}:${studentId}`;
  const existing = getQuestionSelectionFor(assessment.id, studentId);

  if (existing && existing.length && !forceReshuffle) {
    return pool.filter((question) => existing.includes(question.id));
  }

  const count = getEffectivePolicy(assessment, studentId).questionsPerAttempt;
  const selected = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count || pool.length, pool.length));

  setQuestionSelectionFor(assessment.id, studentId, selected.map((question) => question.id));
  return selected;
};
