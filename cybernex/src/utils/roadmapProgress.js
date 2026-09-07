const ROADMAP_STATES = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

/**
 * Resolve a topic's linked course objects from the real course list.
 */
const resolveCourses = (topic, courses = []) => {
  if (!topic?.courseIds?.length) return [];
  return topic.courseIds
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);
};

/**
 * Compute progress (0-100) for a single course from the user's stored
 * progress, falling back safely to 0 when that data isn't available.
 */
export const getCourseProgress = (course, lessons = [], user) => {
  if (!course) return 0;
  const userCourses = user?.progress?.courses || {};
  const completed = userCourses.completed || [];
  const inProgress = userCourses.inProgress || [];

  if (completed.includes(course.id)) return 100;

  if (inProgress.includes(course.id)) {
    const courseLessons = lessons.filter((l) => l.courseId === course.id);
    const completedLessons = userCourses.lessons?.completed || [];
    if (courseLessons.length === 0) return 0;
    const done = completedLessons.filter((id) =>
      courseLessons.some((l) => l.id === id)
    ).length;
    return Math.round((done / courseLessons.length) * 100);
  }

  return 0;
};

/**
 * Compute a single topic node's { state, progress, comingSoon, primaryCourseId }.
 * All topics are intentionally open in the prototype so the roadmap behaves as a
 * guided overview rather than a locked progression wall.
 */
export const getTopicStatus = (topic, { courses = [], lessons = [], user, unlocked = true }) => {
  const linkedCourses = resolveCourses(topic, courses);

  if (linkedCourses.length === 0) {
    return {
      state: ROADMAP_STATES.AVAILABLE,
      progress: 0,
      comingSoon: true,
      primaryCourseId: null,
      cleared: true,
    };
  }

  const progresses = linkedCourses.map((c) => getCourseProgress(c, lessons, user));
  const avgProgress = Math.round(
    progresses.reduce((sum, p) => sum + p, 0) / progresses.length
  );
  const allCompleted = progresses.every((p) => p >= 100);
  const anyStarted = progresses.some((p) => p > 0);

  let state = ROADMAP_STATES.AVAILABLE;
  if (allCompleted) state = ROADMAP_STATES.COMPLETED;
  else if (anyStarted) state = ROADMAP_STATES.IN_PROGRESS;

  return {
    state,
    progress: avgProgress,
    comingSoon: false,
    primaryCourseId: linkedCourses[0].id,
    cleared: allCompleted,
  };
};

/**
 * Compute status for an ordered list of topics without applying any hard lock logic.
 */
export const getTopicListStatus = (topics = [], ctx) => {
  return topics.map((topic) => ({
    ...topic,
    ...getTopicStatus(topic, { ...ctx, unlocked: true }),
  }));
};

/**
 * Overall roadmap progress, computed only from topics that have a real
 * linked course (comingSoon topics are excluded so the number stays honest).
 */
export const getOverallProgress = (topicsWithStatus = []) => {
  const actionable = topicsWithStatus.filter((t) => !t.comingSoon);
  if (actionable.length === 0) return 0;
  const total = actionable.reduce((sum, t) => sum + (t.progress || 0), 0);
  return Math.round(total / actionable.length);
};

/**
 * Find the best "Continue learning" target across all topic lists.
 */
export const findContinueTarget = (allListsWithStatus = []) => {
  for (const { topics } of allListsWithStatus) {
    const inProgress = topics.find((t) => t.state === ROADMAP_STATES.IN_PROGRESS);
    if (inProgress) return inProgress;
  }
  for (const { topics } of allListsWithStatus) {
    const available = topics.find(
      (t) => t.state === ROADMAP_STATES.AVAILABLE && !t.comingSoon
    );
    if (available) return available;
  }
  return null;
};
