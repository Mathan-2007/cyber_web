import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Compass, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import LearningPathModal from '../../components/common/LearningPathModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { apiRequest } from '../../services/api';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 64;
const LAYER_GAP = 110;
const SIBLING_GAP = 40;

const normalizeRoadmapData = (payload = {}) => {
  const list = Array.isArray(payload?.paths) ? payload.paths : [];
  const pathMap = new Map();

  list.forEach((path) => {
    pathMap.set(Number(path.id), {
      id: Number(path.id),
      title: path.title || 'Untitled path',
      layer: Number(path.layer ?? 1),
      path_order: Number(path.path_order ?? 1),
      parent_path_id: path.parent_path_id != null ? Number(path.parent_path_id) : null,
      summary: path.summary || 'Career-focused learning roadmap.',
      sections: Array.isArray(path.sections)
        ? path.sections.map((section, sectionIndex) => ({
            id: section.id || `${path.id}-section-${sectionIndex}`,
            title: section.title || `Section ${sectionIndex + 1}`,
            order: Number(section.order ?? sectionIndex + 1),
            topics: Array.isArray(section.topics)
              ? section.topics.map((topic, topicIndex) => ({
                  id: topic.id || `${section.id || sectionIndex}-topic-${topicIndex}`,
                  title: topic.title || 'Untitled topic',
                  order: Number(topic.order ?? topicIndex + 1),
                  status: topic.status || 'open'
                }))
              : []
          }))
        : [],
      children: Array.isArray(path.children) ? path.children.map((child) => Number(child)) : []
    });
  });

  return [...pathMap.values()].sort((a, b) => a.layer - b.layer || a.path_order - b.path_order);
};

const computeTreeLayout = (paths) => {
  const byId = new Map(paths.map((path) => [path.id, path]));
  const childrenOf = new Map();

  paths.forEach((path) => childrenOf.set(path.id, []));
  paths.forEach((path) => {
    if (path.parent_path_id != null && childrenOf.has(path.parent_path_id)) {
      childrenOf.get(path.parent_path_id).push(path.id);
    }
  });

  childrenOf.forEach((kids) => {
    kids.sort((a, b) => byId.get(a).path_order - byId.get(b).path_order);
  });

  const roots = paths
    .filter((path) => path.parent_path_id == null || !byId.has(path.parent_path_id))
    .sort((a, b) => a.path_order - b.path_order)
    .map((path) => path.id);

  let nextSlot = 0;
  const slotOf = new Map();

  const assignSlots = (id) => {
    const kids = childrenOf.get(id) || [];
    if (kids.length === 0) {
      slotOf.set(id, nextSlot++);
      return slotOf.get(id);
    }

    const childSlots = kids.map(assignSlots);
    const avg = childSlots.reduce((a, b) => a + b, 0) / childSlots.length;
    slotOf.set(id, avg);
    return avg;
  };

  roots.forEach(assignSlots);

  const layers = [...new Set(paths.map((path) => path.layer))].sort((a, b) => a - b);
  const layerIndex = new Map(layers.map((layer, index) => [layer, index]));

  const positions = new Map();
  paths.forEach((path) => {
    positions.set(path.id, {
      x: slotOf.get(path.id) * (NODE_WIDTH + SIBLING_GAP),
      y: layerIndex.get(path.layer) * (NODE_HEIGHT + LAYER_GAP)
    });
  });

  const width = (nextSlot > 0 ? nextSlot : 1) * (NODE_WIDTH + SIBLING_GAP);
  const height = layers.length * (NODE_HEIGHT + LAYER_GAP);

  return { positions, width, height, childrenOf };
};

const getLayerTone = (layer) => {
  const palette = {
    1: 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200',
    2: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    3: 'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-200',
    4: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
    5: 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-200',
    6: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-200'
  };

  return palette[layer] || 'border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200';
};

const Roadmap = () => {
  const { user } = useAuth();
  const [paths, setPaths] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await apiRequest('/roadmap');
        const normalized = normalizeRoadmapData(response);
        setPaths(normalized);
      } catch (loadError) {
        setPaths([]);
        setSelectedPathId(null);
        setError(loadError.message || 'Unable to load roadmap data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const byId = useMemo(() => new Map(paths.map((path) => [path.id, path])), [paths]);

  useEffect(() => {
    if (!paths.length) {
      setSelectedPathId(null);
      return;
    }

    setSelectedPathId((current) => {
      if (current != null && byId.has(current)) {
        return current;
      }
      return paths[0].id;
    });
  }, [paths, byId]);

  const totalTopics = useMemo(
    () => paths.reduce((sum, path) => sum + path.sections.reduce((sectionSum, section) => sectionSum + section.topics.length, 0), 0),
    [paths]
  );

  const selectedPath = selectedPathId != null ? byId.get(selectedPathId) || null : null;
  const { positions, width, height } = useMemo(() => computeTreeLayout(paths), [paths]);

  const handleSelect = (pathId) => {
    setSelectedPathId(pathId);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading cybersecurity roadmap…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="elevated" className="p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
          <ShieldCheck size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Roadmap unavailable</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-8 dark:border-slate-700 dark:bg-slate-900">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
          <Compass size={12} /> Cyber Atlas
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">Cybersecurity Learning Roadmap</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Welcome back, {user?.name || 'Learner'} — {paths.length} paths and {totalTopics} topics loaded live from the roadmap table.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Learning paths</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{paths.length}</p>
            </div>
            <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
              <BookOpen size={18} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Topics</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{totalTopics}</p>
            </div>
            <div className="rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <Sparkles size={18} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Selected</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{selectedPath ? '1' : '0'}</p>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Cpu size={18} />
            </div>
          </div>
        </Card>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
        <div className="relative mx-auto" style={{ width: Math.max(width, 320), height: height + NODE_HEIGHT }}>
          <svg className="pointer-events-none absolute inset-0" width={Math.max(width, 320)} height={height + NODE_HEIGHT}>
            {paths.map((path) => {
              if (path.parent_path_id == null || !positions.has(path.parent_path_id)) {
                return null;
              }

              const parentPos = positions.get(path.parent_path_id);
              const childPos = positions.get(path.id);
              const x1 = parentPos.x + NODE_WIDTH / 2;
              const y1 = parentPos.y + NODE_HEIGHT;
              const x2 = childPos.x + NODE_WIDTH / 2;
              const y2 = childPos.y;
              const midY = (y1 + y2) / 2;

              return (
                <path
                  key={`edge-${path.id}`}
                  d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-slate-300 dark:text-slate-600"
                />
              );
            })}
          </svg>

          {paths.map((path) => {
            const pos = positions.get(path.id);
            const isSelected = selectedPathId === path.id;
            const topicCount = path.sections.reduce((sum, section) => sum + section.topics.length, 0);

            return (
              <button
                key={path.id}
                type="button"
                onClick={() => handleSelect(path.id)}
                style={{ left: pos.x, top: pos.y, width: NODE_WIDTH, height: NODE_HEIGHT }}
                className={`absolute flex flex-col justify-center rounded-xl border-2 px-3 text-left shadow-sm transition-all ${
                  isSelected
                    ? `${getLayerTone(path.layer)} ring-2 ring-offset-2 ring-cyan-400 dark:ring-offset-slate-900`
                    : `${getLayerTone(path.layer)} hover:shadow-md`
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{path.title}</span>
                    <span className="block text-[11px] opacity-75">Layer {path.layer} · {topicCount} topics</span>
                  </div>
                  <span className="rounded-full border border-current/20 bg-white/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] dark:bg-slate-900/50">
                    {isSelected ? 'Open' : 'View'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <LearningPathModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Roadmap;
