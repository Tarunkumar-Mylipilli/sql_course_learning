import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TopicVideo } from '../types';

interface VideoPlayerProps {
  video: TopicVideo;
  alternativeVideos?: TopicVideo[];
  addonVideos?: TopicVideo[];
  isWatched: boolean;
  onMarkWatched: () => void;
  onProceedToTheory: () => void;
  topicTitle?: string;
  topicOverview?: string;
  theorySyntax?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  alternativeVideos = [],
  addonVideos = [],
  isWatched,
  onMarkWatched,
  onProceedToTheory,
  topicTitle = 'SQL Basics & The SELECT Statement',
  theorySyntax,
}) => {
  const allVideos = [video, ...(alternativeVideos || []), ...(addonVideos || [])].filter(Boolean);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    setSelectedVideoIndex(0);
    setIsPlaying(false);
  }, [video?.embedUrl]);

  const activeVideo = allVideos[selectedVideoIndex] || video || {
    title: 'Select Statement in MySQL',
    embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
    duration: '20:00',
    channel: 'Alex The Analyst',
    summaryPoints: [
      'Master SELECT and FROM clauses',
      'Understand query syntax',
      'Retrieve data from single tables',
    ],
  };

  // Robust YouTube video ID extractor supporting all YouTube link variants
  const extractYoutubeId = (url: string) => {
    if (!url) return 'A9TOuDZTPDU';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    if (url.includes('/embed/')) {
      const parts = url.split('/embed/')[1]?.split('?')[0];
      if (parts && parts.length === 11) return parts;
    }
    return 'A9TOuDZTPDU';
  };

  const videoId = extractYoutubeId(activeVideo.embedUrl);
  // Standard embed URL with proper parameters for third-party embeds
  const currentEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1&origin=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : 'https://tarunkumar-mylipilli.github.io'
  )}`;
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Dynamically derive creator tabs from available allVideos
  const getTabInfo = (v: TopicVideo, idx: number) => {
    const ch = (v.channel || '').toLowerCase();
    const lang = (v.language || '').toLowerCase();
    if (lang === 'telugu' || ch.includes('telugu')) {
      return { label: 'Telugu', icon: <Globe className="w-3 h-3" /> };
    }
    if (ch.includes('mosh')) {
      return { label: 'Mosh', icon: <Layers className="w-3 h-3" /> };
    }
    if (ch.includes('codebasics') || ch.includes('basics') || ch.includes('campusx')) {
      return { label: 'CodeBasics', icon: <Code2 className="w-3 h-3" /> };
    }
    if (ch.includes('alex') || idx === 0) {
      return { label: 'Alex', icon: <Play className="w-3 h-3 fill-current" /> };
    }
    return { label: v.channel.split(' ')[0] || `Video ${idx + 1}`, icon: <Play className="w-3 h-3" /> };
  };

  const handleUnlockTheory = () => {
    onMarkWatched();
    try {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (_) {}
    onProceedToTheory();
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText('SELECT column_name\nFROM table_name;');
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Derive bullet points for Lesson Overview
  const overviewBullets =
    activeVideo.summaryPoints && activeVideo.summaryPoints.length >= 3
      ? activeVideo.summaryPoints.slice(0, 3)
      : [
          'Master SELECT and FROM clauses',
          'Understand query syntax',
          'Retrieve data from single tables',
        ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Main Video Player & Creator Tabs (8 cols on lg) */}
      <div className="lg:col-span-8 bg-[#0a101f] border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Video Canvas Container (16:9 ratio) */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#050811] border border-slate-800/80 shadow-inner group">
          {isPlaying ? (
            <div className="w-full h-full relative">
              <iframe
                src={`${currentEmbedUrl}&autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {/* Floating Quick Action: Open on YouTube directly in case of embed restrictions */}
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/80 hover:bg-black text-[11px] font-semibold text-slate-200 hover:text-cyan-300 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 shadow-lg transition opacity-80 hover:opacity-100 cursor-pointer"
                title="If YouTube blocks playback inside your browser, click to watch directly on YouTube"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          ) : (
            /* Interactive SQL Architecture Diagram Preview State */
            <div className="w-full h-full relative flex items-center justify-center select-none bg-gradient-to-b from-[#070e1c] via-[#050914] to-[#04060d]">
              {/* Background glowing connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                <path
                  d="M 210 100 C 260 100, 270 170, 320 170"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2"
                />
                <path
                  d="M 210 240 C 260 240, 270 170, 320 170"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2"
                />
                <path
                  d="M 430 100 C 380 100, 370 170, 320 170"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2"
                />
                <path
                  d="M 430 240 C 380 240, 370 170, 320 170"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="2"
                />
              </svg>

              {/* Top-Left Card: Database */}
              <div className="absolute top-5 left-5 sm:left-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Database
                </div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5">
                  <div>• Tables</div>
                  <div>• Records</div>
                  <div>• Queries</div>
                </div>
              </div>

              {/* Bottom-Left Card: </> SELECT */}
              <div className="absolute bottom-14 left-5 sm:left-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" /> SELECT
                </div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5">
                  <div>• Data</div>
                  <div>• Filtering</div>
                  <div>• Sorting</div>
                </div>
              </div>

              {/* Center Glowing Database Cylinder & Circular Play Button */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/10 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.35)] animate-pulse" />
                  
                  <svg className="w-20 h-20 text-cyan-400 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                  </svg>

                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition cursor-pointer group"
                    title="Play Video Lecture"
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-0.5 group-hover:text-cyan-300 group-hover:fill-cyan-300 transition" />
                  </button>
                </div>
              </div>

              {/* Top-Right Card: Table */}
              <div className="absolute top-5 right-5 sm:right-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5 text-cyan-400" /> Table
                </div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5">
                  <div>• Rows</div>
                  <div>• Columns</div>
                  <div>• Constraints</div>
                </div>
              </div>

              {/* Bottom-Right Card: Conditions */}
              <div className="absolute bottom-14 right-5 sm:right-10 bg-[#0c1626]/90 border border-cyan-500/30 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[11px] font-bold text-sky-200 pb-1 border-b border-slate-700/60 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" /> Conditions
                </div>
                <div className="text-[10px] text-slate-300 mt-1.5 space-y-0.5">
                  <div>• AND</div>
                  <div>• OR</div>
                  <div>• WHERE</div>
                </div>
              </div>

              {/* Bottom Media Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-between gap-3 text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="hover:text-cyan-400 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeVideo.duration || '20:00'}
                  </span>
                </div>

                <div className="flex-1 mx-3 flex items-center">
                  <div className="relative w-full h-1 bg-slate-800 rounded-full cursor-pointer overflow-hidden">
                    <div className="w-1/4 h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={directWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                    title="Watch on YouTube"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden sm:inline">YouTube</span>
                  </a>
                  <Volume2 className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                  <Maximize2
                    onClick={() => setIsPlaying(true)}
                    className="w-3.5 h-3.5 hover:text-white transition cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Creator Switcher Tabs (Alex | Mosh | CodeBasics | Telugu) */}
        <div className="w-full flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1">
          {allVideos.map((v, idx) => {
            const isTabActive = selectedVideoIndex === idx;
            const tab = getTabInfo(v, idx);

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedVideoIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  isTabActive
                    ? 'bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Lesson Overview + Live Cheat Sheet + Quick Reference (4 cols on lg) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Card 1: Lesson Overview */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-3">
          <div className="absolute top-4 right-4 opacity-75 pointer-events-none">
            <svg className="w-16 h-16 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
              <path opacity="0.3" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path opacity="0.5" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold text-base tracking-tight">Lesson Overview</h2>
          </div>
          <p className="text-slate-400 text-xs">Key Takeaways in this lesson guide you:</p>

          <ul className="space-y-2 text-xs text-slate-200 pt-1">
            {overviewBullets.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>

          {/* Large Amber Gradient CTA Button */}
          <button
            onClick={handleUnlockTheory}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-[0_0_22px_rgba(245,158,11,0.3)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>Verify & Unlock Step 2: Theory</span>
          </button>
        </div>

        {/* Bottom Row: Live Cheat Sheet + SQL Syntax Quick Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 2A: Live Cheat Sheet */}
          <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <h3 className="text-white font-bold text-xs tracking-tight">Live Cheat Sheet</h3>
              </div>
              <button
                onClick={handleCopySnippet}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-slate-400 text-[10px]">Snippets & useful syntax</p>

            <div className="bg-[#050811] border border-slate-800/80 rounded-xl p-2.5 font-mono text-[11px] leading-relaxed space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 select-none text-[10px]">1</span>
                <div>
                  <span className="text-purple-400 font-semibold">SELECT </span>
                  <span className="text-slate-200">column_name</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 select-none text-[10px]">2</span>
                <div>
                  <span className="text-purple-400 font-semibold">FROM </span>
                  <span className="text-slate-200">table_name;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2B: SQL Syntax Quick Reference */}
          <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-white font-bold text-xs tracking-tight">SQL Syntax Quick Reference</h3>
            </div>

            <div className="space-y-1 pt-1 font-mono text-[10px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">&gt;</span>
                <span className="text-cyan-300 font-semibold">SELECT</span>
                <span className="text-slate-400">- Retrieve data</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">&gt;</span>
                <span className="text-cyan-300 font-semibold">FROM</span>
                <span className="text-slate-400">- Specify table</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">&gt;</span>
                <span className="text-cyan-300 font-semibold">WHERE</span>
                <span className="text-slate-400">- Filter data</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">&gt;</span>
                <span className="text-cyan-300 font-semibold">ORDER BY</span>
                <span className="text-slate-400">- Sort results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
