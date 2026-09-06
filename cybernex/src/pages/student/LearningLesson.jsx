import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BookOpen, ArrowLeft, ArrowRight, Clock, FileText, ListCheck, CheckCircle } from 'lucide-react';

const LearningLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateSessionUser, modifyUser } = useAuth();
  const { filteredCourses, filteredLessons, isLoading } = useData();

  const course = filteredCourses.find(item => item.id === courseId);
  const courseLessons = filteredLessons.filter(item => item.courseId === courseId);
  const lesson = courseLessons.find(item => item.id === lessonId);

  useEffect(() => {
    if (!course) {
      navigate('/student/learning');
      return;
    }

    if (!lesson && courseLessons.length > 0) {
      navigate(`/student/learning/${courseId}/${courseLessons[0].id}`);
    }
  }, [course, courseLessons, lesson, courseId, navigate]);

  if (isLoading || !course || !lesson) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentIndex = courseLessons.findIndex(item => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  const markLessonComplete = async () => {
    const current = user?.progress?.courses || {};
    const completedLessons = current.lessons?.completed || [];
    const updatedLessons = [...new Set([...completedLessons, lesson.id])];
    const nextProgress = {
      ...current,
      lessons: {
        ...current.lessons,
        completed: updatedLessons
      }
    };

    const progress = {
      ...(user?.progress || {}),
      courses: nextProgress
    };

    const updated = await modifyUser(user.id, { progress });
    updateSessionUser({ progress: updated.progress });
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'video': return 'Video';
      case 'interactive': return 'Lab guidance';
      case 'coding': return 'Practice';
      default: return 'Reading';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/student/learning" className="hover:text-primary transition-colors">My Learning</Link>
        <ArrowRight size={14} />
        <Link to={`/student/learning/${courseId}`} className="hover:text-primary transition-colors">{course.title}</Link>
        <ArrowRight size={14} />
        <span className="text-gray-900 dark:text-white font-medium">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <Card>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">Course topics</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
          </div>

          <div className="space-y-3">
            {courseLessons.map((item, index) => {
              const isActive = item.id === lesson.id;
              return (
                <Link
                  key={item.id}
                  to={`/student/learning/${courseId}/${item.id}`}
                  className={`block rounded-lg border p-3 transition-colors ${
                    isActive
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-100'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Topic {index + 1}</div>
                      <div className="mt-1 font-medium">{item.title}</div>
                    </div>
                    {item.type === 'interactive' && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{getLessonTypeLabel(lesson.type)}</p>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">{lesson.duration || 15} min</Badge>
            </div>
          </div>

          <div className="mt-6 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Lesson content goes here.</p>' }} />
          </div>

          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <div className="space-y-2">
                {lesson.resources.map((resource, idx) => (
                  <a
                    key={`${resource.title}-${idx}`}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>{resource.title}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">{resource.provider || resource.type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex gap-3">
              <Button as={Link} to={`/student/learning/${courseId}`} variant="outline" startIcon={<ArrowLeft size={16} />}>
                Back to course
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={markLessonComplete} variant="primary" endIcon={<CheckCircle size={16} />}>
                Mark complete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningLesson;
