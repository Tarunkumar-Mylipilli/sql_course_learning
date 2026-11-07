import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Volume2,
  Maximize2,
  Lock,
  Database,
  Table as TableIcon,
  Code2,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  Zap,
  BarChart2,
  Globe,
  Layers,
  ExternalLink,
  Clock,
  AlertCircle,
  Unlock,
  Sparkles,
  Info,
  Save,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TopicVideo } from '../types';

interface VideoPlayerProps {
  video: TopicVideo;
  alternativeVideos?: TopicVideo[];
  addonVideos?: TopicVideo[];
  subModules?: import('../types').SubModule[];
  isWatched: boolean;
  onMarkWatched: () => void;
  onProceedToTheory: () => void;
  topicTitle?: string;
  topicOverview?: string;
  theorySyntax?: string;
}

// --- Cheat sheet data with per-snippet copy support ---
const CHEAT_SNIPPETS = [
  {
    id: 'select',
    label: 'Basic SELECT',
    code: 'SELECT column_name\nFROM table_name;',
    description: 'Retrieve specific columns from a table',
    tokens: [
      { text: 'SELECT ', color: 'text-purple-400 font-semibold' },
      { text: 'column_name', color: 'text-slate-200' },
    ],
    tokens2: [
      { text: 'FROM ', color: 'text-purple-400 font-semibold' },
      { text: 'table_name;', color: 'text-slate-200' },
    ],
  },
  {
    id: 'where',
    label: 'WHERE Filter',
    code: 'SELECT *\nFROM table_name\nWHERE condition;',
    description: 'Filter rows with a condition',
    tokens: [
      { text: 'SELECT ', color: 'text-purple-400 font-semibold' },
      { text: '*', color: 'text-cyan-300' },
    ],
    tokens2: [
      { text: 'WHERE ', color: 'text-blue-400 font-semibold' },
      { text: 'condition;', color: 'text-amber-300' },
    ],
  },
];

const QUICK_REF = [
  { keyword: 'SELECT', desc: 'Retrieve data from columns' },
  { keyword: 'FROM', desc: 'Specify the source table' },
  { keyword: 'WHERE', desc: 'Filter rows by condition' },
  { keyword: 'ORDER BY', desc: 'Sort query results' },
  { keyword: 'GROUP BY', desc: 'Aggregate rows by field' },
  { keyword: 'JOIN', desc: 'Combine rows from tables' },
];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  alternativeVideos = [],
  addonVideos = [],
  subModules = [],
  isWatched,
  onMarkWatched,
  onProceedToTheory,
  topicTitle = 'SQL Basics & The SELECT Statement',
  theorySyntax,
}) => {
  // Top tier: Recommended alternative creator masterclasses
  const creatorVideos: TopicVideo[] = [video, ...(alternativeVideos || []), ...(addonVideos || [])].filter(Boolean);

  // Bottom tier: Granular submodules added on admin page
  const submoduleList: {
    title: string;
    videoUrl: string;
    duration: string;
    summary: string;
    notes?: string;
  }[] = (subModules || []).map((sm, smIdx) => ({
    title: sm.title || `Submodule ${smIdx + 1}`,
    videoUrl: sm.videoUrl || video?.embedUrl || 'https://www.youtube.com/embed/A9TOuDZTPDU',
    duration: sm.duration || '10:00',
    summary: sm.summary || 'Submodule concepts and exercises',
    notes: sm.notes,
  }));

  const [activeTier, setActiveTier] = useState<'creator' | 'submodule'>(
    submoduleList.length > 0 ? 'submodule' : 'creator'
  );
  const [selectedCreatorIdx, setSelectedCreatorIdx] = useState(0);
  const [selectedSubmoduleIdx, setSelectedSubmoduleIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWatchInfo, setShowWatchInfo] = useState(false);

  const [watchedSubmoduleIndices, setWatchedSubmoduleIndices] = useState<number[]>([]);
  const [watchedCreatorIndices, setWatchedCreatorIndices] = useState<number[]>(() => isWatched ? [0] : []);

  const parseDurationToSeconds = (durStr?: string): number => {
    if (!durStr) return 120;
    const parts = durStr.trim().split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return (parts[0] * 60) + parts[1];
    } else if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }
    return 120;
  };

  const activeVideo: TopicVideo =
    activeTier === 'submodule' && submoduleList[selectedSubmoduleIdx]
      ? {
          title: submoduleList[selectedSubmoduleIdx].title,
          embedUrl: submoduleList[selectedSubmoduleIdx].videoUrl,
          duration: submoduleList[selectedSubmoduleIdx].duration,
          channel: submoduleList[selectedSubmoduleIdx].title,
          language: 'English',
          summaryPoints: [
            submoduleList[selectedSubmoduleIdx].title,
            submoduleList[selectedSubmoduleIdx].summary,
            'Compulsory submodule walkthrough',
          ],
        }
      : creatorVideos[selectedCreatorIdx] || video || {
          title: 'SQL Tutorial',
          embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
          duration: '20:00',
          channel: 'Alex The Analyst',
          summaryPoints: ['Understand core concepts', 'Master query syntax'],
        };

  const fullVideoSeconds = parseDurationToSeconds(activeVideo.duration);
  const requiredSeconds = Math.min(fullVideoSeconds, 120);
  const [watchProgressSeconds, setWatchProgressSeconds] = useState<number>(0);
  const [watchWarning, setWatchWarning] = useState<string>('');

  useEffect(() => {
    if (submoduleList.length > 0) {
      setActiveTier('submodule');
      setSelectedSubmoduleIdx(0);
    } else {
      setActiveTier('creator');
      setSelectedCreatorIdx(0);
    }
    setIsPlaying(false);
    setWatchProgressSeconds(0);
  }, [video?.embedUrl]);

  const handleSelectCreatorVideo = (idx: number) => {
    setActiveTier('creator');
    setSelectedCreatorIdx(idx);
    setIsPlaying(false);
    setWatchProgressSeconds(watchedCreatorIndices.includes(idx) ? requiredSeconds : 0);
    setWatchWarning('');
  };

  const handleSelectSubmoduleVideo = (idx: number) => {
    setActiveTier('submodule');
    setSelectedSubmoduleIdx(idx);
    setIsPlaying(false);
    setWatchProgressSeconds(watchedSubmoduleIndices.includes(idx) ? requiredSeconds : 0);
    setWatchWarning('');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const isCurrentVerified =
      activeTier === 'submodule'
        ? watchedSubmoduleIndices.includes(selectedSubmoduleIdx)
        : watchedCreatorIndices.includes(selectedCreatorIdx);

    if (isPlaying && !isCurrentVerified) {
      interval = setInterval(() => {
        setWatchProgressSeconds((prev) => {
          const next = prev + 1;
          if (next >= requiredSeconds) {
            if (activeTier === 'submodule') {
              setWatchedSubmoduleIndices((prevList) => {
                const updated = prevList.includes(selectedSubmoduleIdx)
                  ? prevList
                  : [...prevList, selectedSubmoduleIdx];
                if (updated.length >= submoduleList.length) {
                  onMarkWatched();
                }
                return updated;
              });
            } else {
              setWatchedCreatorIndices((prevList) => {
                const updated = prevList.includes(selectedCreatorIdx)
                  ? prevList
                  : [...prevList, selectedCreatorIdx];
                if (submoduleList.length === 0) {
                  onMarkWatched();
                }
                return updated;
              });
            }
            try { confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } }); } catch (_) {}
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [
    isPlaying, activeTier, selectedSubmoduleIdx, selectedCreatorIdx,
    watchedSubmoduleIndices, watchedCreatorIndices, requiredSeconds,
    submoduleList.length, onMarkWatched,
  ]);

  const hasCurrentVideoWatched =
    activeTier === 'submodule'
      ? watchedSubmoduleIndices.includes(selectedSubmoduleIdx)
      : watchedCreatorIndices.includes(selectedCreatorIdx);

  const hasVerifiedWatched = hasCurrentVideoWatched;
  const totalSubmodulesCount = submoduleList.length;
  const completedSubmodulesCount = watchedSubmoduleIndices.length;
  const allSubmodulesCompleted =
    totalSubmodulesCount === 0 || completedSubmodulesCount >= totalSubmodulesCount;

  const extractYoutubeId = (url: string) => {
    if (!url) return 'A9TOuDZTPDU';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    if (url.includes('/embed/')) {
      const parts = url.split('/embed/')[1]?.split('?')[0];
      if (parts && parts.length === 11) return parts;
    }
    return 'A9TOuDZTPDU';
  };

  const videoId = extractYoutubeId(activeVideo.embedUrl);
  const currentEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&origin=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : 'https://tarunkumar-mylipilli.github.io'
  )}`;
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const getCreatorTabInfo = (v: TopicVideo, idx: number) => {
    const ch = (v.channel || '').toLowerCase();
    const lang = (v.language || '').toLowerCase();
    if (lang === 'telugu' || ch.includes('telugu')) {
      return { label: 'Telugu Full Course', description: 'Full SQL course in Telugu for native speakers', icon: <Globe className="w-3.5 h-3.5" /> };
    }
    if (ch.includes('mosh')) {
      return { label: 'Programming with Mosh', description: 'Clean structured beginner-friendly tutorial', icon: <Layers className="w-3.5 h-3.5" /> };
    }
    if (ch.includes('codebasics') || ch.includes('basics')) {
      return { label: 'CodeBasics', description: 'Practical project-based SQL from CodeBasics', icon: <Code2 className="w-3.5 h-3.5" /> };
    }
    if (ch.includes('alex') || idx === 0) {
      return { label: 'Alex The Analyst', description: 'Industry-focused SQL for data analysts', icon: <Play className="w-3.5 h-3.5 fill-current" /> };
    }
    return { label: v.channel || `Recommended ${idx + 1}`, description: 'Recommended SQL lecture', icon: <Play className="w-3.5 h-3.5" /> };
  };

  const handleUnlockTheory = () => {
    if (totalSubmodulesCount > 0 && !allSubmodulesCompleted) {
      setWatchWarning(
        `⚠️ Please complete all submodules (${completedSubmodulesCount}/${totalSubmodulesCount} done) before unlocking Theory.`
      );
      return;
    }
    if (!hasCurrentVideoWatched && totalSubmodulesCount === 0) {
      const remaining = Math.max(0, requiredSeconds - watchProgressSeconds);
      const remainingMin = Math.ceil(remaining / 60);
      setWatchWarning(
        `⚠️ Watch at least ${remainingMin > 1 ? remainingMin + ' more minutes' : remaining + ' more seconds'} to verify completion.`
      );
      return;
    }
    setWatchWarning('');
    onMarkWatched();
    try { confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } }); } catch (_) {}
    onProceedToTheory();
  };

  const handleCopySnippet = useCallback((id: string, code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => fallbackCopy(code));
    } else {
      fallbackCopy(code);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(el);
  };

  const overviewBullets =
    activeVideo.summaryPoints && activeVideo.summaryPoints.length >= 3
      ? activeVideo.summaryPoints.slice(0, 3)
      : ['Master SELECT and FROM clauses', 'Understand query syntax', 'Retrieve data from single tables'];

  const watchPercent = Math.min(100, (watchProgressSeconds / requiredSeconds) * 100);
  const watchTimeDisplay = `${Math.floor(watchProgressSeconds / 60)}:${(watchProgressSeconds % 60).toString().padStart(2, '0')} / ${Math.floor(requiredSeconds / 60)}:${(requiredSeconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* LEFT COLUMN */}
      <div className="lg:col-span-8 bg-[#0a101f] border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-4">

        {/* TOP NAV: Recommended Lectures */}
        {creatorVideos.length > 0 && (
          <div className="space-y-1.5 pb-1 border-b border-slate-800/80">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                Recommended Lectures
              </span>
              <span className="text-[10px] text-slate-500">Choose your preferred instructor</span>
            </div>
            <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-1" role="tablist" aria-label="Recommended lecture instructors">
              {creatorVideos.map((v, idx) => {
                const isTabActive = activeTier === 'creator' && selectedCreatorIdx === idx;
                const isVideoVerified = watchedCreatorIndices.includes(idx);
                const tab = getCreatorTabInfo(v, idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectCreatorVideo(idx)}
                    role="tab"
                    aria-selected={isTabActive}
                    aria-label={`${tab.label} — ${tab.description}${isVideoVerified ? ' (completed)' : ''}`}
                    title={tab.description}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a101f] ${
                      isTabActive
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    {isVideoVerified
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      : <span aria-hidden="true">{tab.icon}</span>
                    }
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* VIDEO PLAYER */}
        <div
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#050811] border border-slate-800/80 shadow-inner"
          aria-label={`Video: ${activeVideo.title}`}
        >
          {isPlaying ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${currentEmbedUrl}&autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/80 hover:bg-black text-[11px] font-semibold text-slate-200 hover:text-cyan-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 shadow-lg transition opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Open in YouTube (new tab)"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <div className="w-full h-full relative flex items-center justify-center select-none bg-gradient-to-b from-[#070e1c] via-[#050914] to-[#04060d]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" aria-hidden="true">
                <path d="M 210 100 C 260 100, 270 170, 320 170" fill="none" stroke="#00d2ff" strokeWidth="2" />
                <path d="M 210 240 C 260 240, 270 170, 320 170" fill="none" stroke="#00d2ff" strokeWidth="2" />
                <path d="M 430 100 C 380 100, 370 170, 320 170" fill="none" stroke="#00d2ff" strokeWidth="2" />
                <path d="M 430 240 C 380 240, 370 170, 320 170" fill="none" stroke="#00d2ff" strokeWidth="2" />
              </svg>
              <div className="absolute top-5 left-5 sm:left-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none" aria-hidden="true">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-cyan-400" /> Database</div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5"><div>• Tables</div><div>• Records</div><div>• Queries</div></div>
              </div>
              <div className="absolute bottom-14 left-5 sm:left-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none" aria-hidden="true">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-cyan-400" /> SELECT</div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5"><div>• Data</div><div>• Filtering</div><div>• Sorting</div></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/10 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] animate-pulse" aria-hidden="true" />
                  <svg className="w-20 h-20 text-cyan-400 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070e1c]"
                    aria-label={`Play lecture: ${activeVideo.title}`}
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5 hover:text-cyan-300 transition" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="absolute top-5 right-5 sm:right-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none" aria-hidden="true">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5"><TableIcon className="w-3.5 h-3.5 text-cyan-400" /> Table</div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5"><div>• Rows</div><div>• Columns</div><div>• Constraints</div></div>
              </div>
              <div className="absolute bottom-14 right-5 sm:right-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none" aria-hidden="true">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-cyan-400" /> Conditions</div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5"><div>• AND</div><div>• OR</div><div>• WHERE</div></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-between gap-3 text-slate-400">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(true)} className="hover:text-cyan-400 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded" aria-label="Play video">
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">{activeVideo.duration || '20:00'}</span>
                </div>
                <div className="flex-1 mx-3">
                  <div className="relative w-full h-1 bg-slate-800 rounded-full overflow-hidden" aria-hidden="true">
                    <div className="w-1/4 h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={directWatchUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded" aria-label="Watch on YouTube">
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    <span className="hidden sm:inline">YouTube</span>
                  </a>
                  <Volume2 className="w-3.5 h-3.5 hover:text-white transition" aria-hidden="true" />
                  <button onClick={() => setIsPlaying(true)} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded" aria-label="Enter fullscreen mode">
                    <Maximize2 className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBMODULES BAR */}
        {totalSubmodulesCount > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                Required Submodules
              </span>
              <span className="text-[10px] font-mono text-slate-400" aria-live="polite">
                {completedSubmodulesCount}/{totalSubmodulesCount} completed
              </span>
            </div>
            <div className="w-full flex items-center justify-start gap-2 overflow-x-auto py-1" role="tablist" aria-label="Required submodule videos">
              {submoduleList.map((sm, idx) => {
                const isTabActive = activeTier === 'submodule' && selectedSubmoduleIdx === idx;
                const isSubVerified = watchedSubmoduleIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectSubmoduleVideo(idx)}
                    role="tab"
                    aria-selected={isTabActive}
                    aria-label={`Submodule ${idx + 1}: ${sm.title}${isSubVerified ? ' — completed' : ' — required'}`}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a101f] ${
                      isTabActive
                        ? 'bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-500/60 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900 text-slate-300 hover:text-slate-100 border border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    {isSubVerified
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      : <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold" aria-hidden="true">{idx + 1}</span>
                    }
                    <span>{sm.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono" aria-hidden="true">({sm.duration})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-4 space-y-4">

        {/* Card 1: Lesson Overview + Watch Verification */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-3">
          <div className="absolute top-4 right-4 opacity-75 pointer-events-none" aria-hidden="true">
            <svg className="w-16 h-16 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
              <path opacity="0.3" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path opacity="0.5" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <h2 className="text-white font-bold text-base tracking-tight">Lesson Overview</h2>
          </div>
          <p className="text-slate-400 text-xs">Key takeaways this lesson covers:</p>

          <ul className="space-y-2 text-xs text-slate-200 pt-1" aria-label="Lesson key takeaways">
            {overviewBullets.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>

          {/* Submodule completion */}
          {totalSubmodulesCount > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-300">Submodules Completed:</span>
              <span
                className={`font-mono font-bold ${completedSubmodulesCount === totalSubmodulesCount ? 'text-emerald-400' : 'text-cyan-400'}`}
                aria-live="polite"
              >
                {completedSubmodulesCount} / {totalSubmodulesCount} Watched
              </span>
            </div>
          )}

          {/* Progress persistence note */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60">
            <Save className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Progress auto-saves to your browser. No login required.
            </p>
          </div>

          {/* Watch Verification */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Watch Verification
                <button
                  onClick={() => setShowWatchInfo(!showWatchInfo)}
                  className="ml-0.5 text-slate-500 hover:text-slate-200 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                  aria-label={showWatchInfo ? 'Hide watch verification info' : 'How does watch verification work?'}
                  aria-expanded={showWatchInfo}
                  aria-controls="watch-info-panel"
                >
                  <Info className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
              <span
                className={`font-mono font-bold ${hasVerifiedWatched ? 'text-emerald-400' : 'text-amber-400'}`}
                aria-live="polite"
                aria-label={hasVerifiedWatched ? 'Watch verification complete' : `Watch time: ${watchTimeDisplay}`}
              >
                {hasVerifiedWatched ? '✓ Verified' : watchTimeDisplay}
              </span>
            </div>

            {showWatchInfo && (
              <div
                id="watch-info-panel"
                role="note"
                className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-[10px] text-slate-300 leading-relaxed space-y-1"
              >
                <p className="font-semibold text-slate-200">📺 How Watch Verification Works:</p>
                <p>• The timer runs <strong className="text-cyan-300">only while the video plays</strong>.</p>
                <p>• Watch at least <strong className="text-cyan-300">2 minutes</strong> of the selected video.</p>
                <p>• Once the bar fills, the lock icon turns green and Theory unlocks.</p>
                {totalSubmodulesCount > 0 && (
                  <p>• All <strong className="text-cyan-300">{totalSubmodulesCount} submodule(s)</strong> must also be completed.</p>
                )}
              </div>
            )}

            <div
              className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"
              role="progressbar"
              aria-valuenow={Math.round(watchPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Watch progress: ${Math.round(watchPercent)}%`}
            >
              <div
                className={`h-full transition-all duration-300 ${hasVerifiedWatched ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`}
                style={{ width: `${watchPercent}%` }}
              />
            </div>
          </div>

          {/* Warning */}
          {watchWarning && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2 text-amber-300 text-[11px] leading-relaxed" role="alert" aria-live="assertive">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{watchWarning}</span>
            </div>
          )}

          {/* Unlock CTA */}
          <button
            onClick={handleUnlockTheory}
            aria-label={hasVerifiedWatched ? 'Proceed to Step 2: Theory' : 'Verify watch time then unlock Theory'}
            className={`w-full mt-4 py-3.5 px-4 rounded-xl font-extrabold text-sm transition transform flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a101f] ${
              hasVerifiedWatched
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_22px_rgba(16,185,129,0.35)] hover:from-emerald-300 hover:to-cyan-400 hover:-translate-y-0.5 focus-visible:ring-emerald-400'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-[0_0_22px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 focus-visible:ring-amber-400'
            }`}
          >
            {hasVerifiedWatched ? (
              <><Unlock className="w-4 h-4 text-slate-950" aria-hidden="true" /><span>Verified! Proceed to Step 2: Theory</span></>
            ) : (
              <><Lock className="w-4 h-4 text-slate-950" aria-hidden="true" /><span>Verify &amp; Unlock Step 2: Theory</span></>
            )}
          </button>
        </div>

        {/* Cards: Cheat Sheet + Quick Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Card 2A: Interactive Live Cheat Sheet */}
          <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <h3 className="text-white font-bold text-xs tracking-tight">Live Cheat Sheet</h3>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">click to copy</span>
            </div>
            <p className="text-slate-400 text-[10px]">Snippets &amp; useful syntax</p>

            <div className="space-y-2">
              {CHEAT_SNIPPETS.map((snippet) => {
                const isCopied = copiedId === snippet.id;
                return (
                  <div key={snippet.id} className="relative group">
                    <button
                      onClick={() => handleCopySnippet(snippet.id, snippet.code)}
                      className="w-full text-left bg-[#050811] border border-slate-800/80 hover:border-slate-600 rounded-xl p-2.5 font-mono text-[11px] leading-relaxed space-y-0.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-label={`Copy snippet: ${snippet.label}`}
                      title={snippet.description}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 select-none text-[10px]">1</span>
                        <div>{snippet.tokens.map((t, ti) => <span key={ti} className={t.color}>{t.text}</span>)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 select-none text-[10px]">2</span>
                        <div>{snippet.tokens2.map((t, ti) => <span key={ti} className={t.color}>{t.text}</span>)}</div>
                      </div>
                    </button>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition pointer-events-none" aria-hidden="true">
                      {isCopied
                        ? <Check className="w-3 h-3 text-emerald-400" />
                        : <Copy className="w-3 h-3 text-slate-500" />
                      }
                    </div>
                    {isCopied && (
                      <div className="absolute -top-6 right-0 bg-emerald-900/90 text-emerald-300 text-[10px] px-2 py-0.5 rounded-lg border border-emerald-500/30" role="status" aria-live="polite">
                        Copied!
                      </div>
                    )}
                    <p className="text-[9px] text-slate-600 mt-0.5 pl-1">{snippet.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2B: Interactive SQL Quick Reference */}
          <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <h3 className="text-white font-bold text-xs tracking-tight">SQL Quick Reference</h3>
            </div>

            <ul className="space-y-0.5 pt-1 text-[10px]" aria-label="SQL keyword quick reference — click any keyword to copy">
              {QUICK_REF.map((ref) => {
                const isCopied = copiedId === ref.keyword;
                return (
                  <li key={ref.keyword}>
                    <button
                      onClick={() => handleCopySnippet(ref.keyword, ref.keyword)}
                      className="w-full flex items-center gap-1 group hover:bg-slate-800/40 rounded-lg px-1 py-0.5 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                      aria-label={`${ref.keyword}: ${ref.desc}. Click to copy.`}
                    >
                      <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" aria-hidden="true" />
                      <span className="text-cyan-300 font-semibold font-mono">{ref.keyword}</span>
                      <span className="text-slate-400 ml-1 truncate">— {ref.desc}</span>
                      {isCopied && <Check className="w-3 h-3 text-emerald-400 ml-auto shrink-0" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
