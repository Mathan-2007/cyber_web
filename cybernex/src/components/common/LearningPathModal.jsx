import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, Cpu, Lock, ShieldCheck, X } from 'lucide-react';
import Button from './Button';

const getTopicStatusMeta = (status) => {
  const normalized = String(status || 'open').toLowerCase();

  if (normalized === 'completed' || normalized === 'done') {
    return {
      label: 'Completed',
      className: 'text-emerald-600 dark:text-emerald-300',
      icon: CheckCircle2,
      muted: false
    };
  }

  if (normalized === 'locked') {
    return {
      label: 'Locked',
      className: 'text-slate-400 dark:text-slate-500',
      icon: Lock,
      muted: true
    };
  }

  return {
    label: 'Open',
    className: 'text-cyan-600 dark:text-cyan-300',
    icon: BookOpen,
    muted: false
  };
};

const LearningPathModal = ({ path, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (!isOpen || !path) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, path]);

  useEffect(() => {
    if (!path?.sections?.length) {
      setExpandedSections({});
      return;
    }

    const firstSectionId = path.sections[0]?.id;
    if (firstSectionId) {
      setExpandedSections((previous) => ({
        ...previous,
        [firstSectionId]: true
      }));
    }
  }, [path]);

  const totalTopics = useMemo(
    () => path?.sections.reduce((sum, section) => sum + (section.topics?.length || 0), 0) || 0,
    [path]
  );

  if (!isOpen || !path) {
    return null;
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId]
    }));
  };

  const summary = path.summary || 'Career-focused learning roadmap.';

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${path.id}-learning-path-title`}
        className="relative z-10 w-full max-w-6xl max-h-[88vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/80">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Learning path overview
            </p>
            <h2 id={`${path.id}-learning-path-title`} className="mt-1 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              {path.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${path.title} learning path overview`}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(88vh-120px)] overflow-y-auto">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="grid gap-6 xl:grid-cols-[290px_1fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 p-4 shadow-sm dark:border-slate-700">
                  <div className="flex h-52 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/20 text-white">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-2xl bg-white/10 p-4 shadow-inner ring-1 ring-white/15">
                        <ShieldCheck size={42} />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/80">Path</div>
                        <div className="mt-1 text-lg font-bold">{path.title}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Overview
                  </p>
                  <p className="mt-2 leading-6">{summary}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                      <BookOpen size={12} /> Layer {path.layer}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                      <Cpu size={12} /> {totalTopics} topics
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {path.sections?.length || 0} sections
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Introduction</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {summary}
                  </p>
                </div>

                <div className="space-y-3">
                  {path.sections?.map((section, index) => {
                    const isSectionExpanded = expandedSections[section.id] ?? index === 0;
                    const sectionTopicCount = section.topics?.length || 0;

                    return (
                      <div
                        key={section.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={isSectionExpanded}
                          className="flex w-full items-center justify-between gap-3 p-4 text-left"
                        >
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                              Section {index + 1}
                            </p>
                            <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                              {section.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <span>{sectionTopicCount} topics</span>
                            {isSectionExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>
                        </button>

                        {isSectionExpanded && (
                          <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                            <div className="space-y-2">
                              {(section.topics || []).map((topic) => {
                                const statusMeta = getTopicStatusMeta(topic.status);
                                const StatusIcon = statusMeta.icon;

                                return (
                                  <div
                                    key={topic.id}
                                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                                      statusMeta.muted
                                        ? 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500'
                                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
                                    }`}
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border border-current/10 bg-white dark:bg-slate-900 ${statusMeta.className}`}>
                                        <StatusIcon size={14} />
                                      </span>
                                      <span className="truncate text-sm font-medium">{topic.title}</span>
                                    </div>

                                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusMeta.className}`}>
                                      {statusMeta.label}
                                      {statusMeta.label === 'Completed' && <CheckCircle2 size={12} />}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>,
    document.body
  );
};

export default LearningPathModal;
