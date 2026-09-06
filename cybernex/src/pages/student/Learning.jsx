import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CourseCard from '../../components/learning/CourseCard';
import {
  BookOpen,
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { COURSE_LEVELS } from '../../utils/constants';

const Learning = () => {
  const { user } = useAuth();
  const { filteredCourses, isLoading } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const userCourses = user?.progress?.courses || {};
  const completedCourses = userCourses.completed || [];
  const inProgressCourses = userCourses.inProgress || [];

  const getFilteredCourses = () => {
    let courses = [...filteredCourses];

    if (activeTab === 'in-progress') {
      courses = courses.filter((course) => inProgressCourses.includes(course.id));
    } else if (activeTab === 'completed') {
      courses = courses.filter((course) => completedCourses.includes(course.id));
    } else if (activeTab === 'recommended') {
      courses = courses.filter((course) => !completedCourses.includes(course.id) && !inProgressCourses.includes(course.id));
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      courses = courses.filter((course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description?.toLowerCase().includes(lowerQuery) ||
        course.domain?.toLowerCase().includes(lowerQuery) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedDomain !== 'all') {
      courses = courses.filter((course) => course.domain === selectedDomain);
    }

    if (selectedLevel !== 'all') {
      courses = courses.filter((course) => course.level === selectedLevel);
    }

    return courses;
  };

  const filteredCoursesList = useMemo(() => getFilteredCourses(), [filteredCourses, activeTab, searchQuery, selectedDomain, selectedLevel, user]);
  const totalPages = Math.ceil(filteredCoursesList.length / itemsPerPage);
  const currentCourses = filteredCoursesList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const domains = [...new Set(filteredCoursesList.map((course) => course.domain).filter(Boolean))];
  const levels = [...new Set(filteredCoursesList.map((course) => course.level).filter(Boolean))];

  const getCourseStatus = (courseId) => {
    if (completedCourses.includes(courseId)) return 'completed';
    if (inProgressCourses.includes(courseId)) return 'in-progress';
    return 'not-started';
  };

  const getProgressPercentage = (courseId) => {
    const status = getCourseStatus(courseId);
    if (status === 'completed') return 100;
    if (status === 'in-progress') return 50;
    return 0;
  };

  const getStatusBadge = (course) => {
    const status = getCourseStatus(course.id);
    const statusLabels = {
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
    };
    return statusLabels[status] || statusLabels['not-started'];
  };

  const getLevelColor = (level) => {
    const levelColors = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-blue-100 text-blue-800',
      Advanced: 'bg-purple-100 text-purple-800',
      Expert: 'bg-orange-100 text-orange-800',
    };
    return levelColors[level] || 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-500">Cyber Atlas</p>
          <h1 className="text-2xl font-bold text-slate-900">Your guided security roadmap</h1>
          <p className="mt-1 text-sm text-slate-500">
            Learn a topic, validate it in a practice room, then prove it in an assessment lab.
          </p>
        </div>

        <Link to="/student/roadmap">
          <button className="rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700">
            Road Map
          </button>
        </Link>
      </div>

      <Card className="overflow-hidden border-cyan-500/20 bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">12-level operator path</h2>
            <p className="text-sm text-slate-400">All paths are open in this prototype to keep the learning catalog accessible.</p>
          </div>
          <Badge className="bg-cyan-500/15 text-cyan-300">Level {user?.level || 1} active</Badge>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {COURSE_LEVELS.map((level) => (
            <div key={level.level} className="min-w-44 rounded-xl border border-cyan-500/30 bg-slate-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">0{level.level}</span>
                <span className="text-xs text-slate-300">OPEN</span>
              </div>
              <p className="font-medium text-white">{level.name}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{level.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="text-center">
          <BookOpen size={24} className="mx-auto mb-2 text-blue-600" />
          <div className="text-xl font-bold text-slate-900">{filteredCoursesList.length}</div>
          <div className="text-sm text-slate-600">Total Courses</div>
        </Card>
        <Card className="text-center">
          <Shield size={24} className="mx-auto mb-2 text-green-600" />
          <div className="text-xl font-bold text-slate-900">{completedCourses.length}</div>
          <div className="text-sm text-slate-600">Completed</div>
        </Card>
        <Card className="text-center">
          <Calendar size={24} className="mx-auto mb-2 text-orange-600" />
          <div className="text-xl font-bold text-slate-900">{inProgressCourses.length}</div>
          <div className="text-sm text-slate-600">In Progress</div>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-purple-600" />
          <div className="text-xl font-bold text-slate-900">
            {filteredCoursesList.length > 0 ? Math.round((completedCourses.length / filteredCoursesList.length) * 100) : 0}%
          </div>
          <div className="text-sm text-slate-600">Completion Rate</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All Courses
            </button>
            <button
              onClick={() => { setActiveTab('in-progress'); setCurrentPage(1); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'in-progress' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'completed' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Completed
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`} title="Grid view"><Grid3X3 size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`} title="List view"><List size={16} /></button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="input input-primary min-w-[180px]">
            <option value="all">All domains</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>

          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="input input-primary min-w-[180px]">
            <option value="all">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {currentCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            status={getCourseStatus(course.id)}
            progress={getProgressPercentage(course.id)}
            onClick={() => {}}
            variant={viewMode}
            badge={getStatusBadge(course)}
            levelColor={getLevelColor(course.level)}
          />
        ))}
      </div>

      {filteredCoursesList.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-slate-500">No courses match the current filters.</p>
        </Card>
      )}

      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-slate-500">Page {currentPage} of {Math.max(totalPages, 1)}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} startIcon={<ChevronLeft size={14} />}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} endIcon={<ChevronRight size={14} />}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learning;
