import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  Maximize2,
  Tv,
  Lock,
  CheckCircle,
  Database,
  Table as TableIcon,
  Sparkles,
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
  const allVideos = [video, ...(alternativeVideos || []), ...(addonVideos || [])];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useNoCookie] = useState(false);

  useEffect(() => {
    setSelectedVideoIndex(0);
    setIsPlaying(false);
  }, [video?.embedUrl]);

  const activeVideo = allVideos[selectedVideoIndex] || video || {
    title: 'Select Statement in MySQL',
    embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
    duration: '9:15',
    channel: 'Alex The Analyst',
    summaryPoints: [
      'Master SELECT and FROM clauses',
      'Understand query syntax',
      'Retrieve data from single tables',
    ],
  };

  const videoId = activeVideo.embedUrl?.split('/embed/')[1]?.split('?')[0] || '';
  const currentEmbedUrl = useNoCookie
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    : `https://www.youtube.com/embed/${videoId}?rel=0`;

  // Get clean tab label for each video
  const getTabLabel = (v: TopicVideo, idx: number) => {
    if (v.language?.toLowerCase() === 'telugu' || v.title?.toLowerCase().includes('telugu')) {
      return 'Telugu';
    }
    const ch = v.channel.toLowerCase();
    if (ch.includes('alex')) return 'Alex';
    if (ch.includes('mosh')) return 'Mosh';
    if (ch.includes('codebasics') || ch.includes('basics')) return 'CodeBasics';
    if (idx === 0) return 'Alex';
    if (idx === 1) return 'Mosh';
    if (idx === 2) return 'CodeBasics';
    return v.channel.split(' ')[0] || `Video ${idx + 1}`;
  };

  const handleUnlockTheory = () => {
    onMarkWatched();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
    onProceedToTheory();
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
      <div className="lg:col-span-8 bg-[#090f1d] border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Video Canvas Container (16:9 ratio) */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#050811] border border-slate-800/80 shadow-inner group">
          {isPlaying ? (
            <iframe
              src={`${currentEmbedUrl}&autoplay=1`}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* Interactive SQL Architecture Diagram Preview State */
            <div className="w-full h-full relative flex items-center justify-center select-none bg-gradient-to-b from-[#070e1c] via-[#050914] to-[#04060d]">
              {/* Background relational connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path
                  d="M 180 80 Q 250 140 320 140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 180 200 Q 250 140 320 140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <path
                  d="M 460 80 Q 390 140 320 140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <path
                  d="M 460 200 Q 390 140 320 140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Top-Left Table: Database */}
              <div className="absolute top-6 left-6 sm:left-12 bg-[#0c1626]/90 border border-slate-700/80 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[10px] sm:text-xs font-bold text-sky-300 pb-1 border-b border-slate-700/60 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" /> Database
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
                  <div className="text-amber-300">🔑 id</div>
                  <div>column_name</div>
                  <div>username</div>
                </div>
              </div>

              {/* Bottom-Left Table: Tables */}
              <div className="absolute bottom-14 left-6 sm:left-12 bg-[#0c1626]/90 border border-slate-700/80 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[10px] sm:text-xs font-bold text-sky-300 pb-1 border-b border-slate-700/60 flex items-center gap-1">
                  <TableIcon className="w-3 h-3 text-cyan-400" /> Tables
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
                  <div className="text-amber-300">🔑 id</div>
                  <div>name</div>
                  <div>username</div>
                  <div>description</div>
                </div>
              </div>

              {/* Center Database Cylinder & Play Button */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Central Database Icon Glow */}
                <div className="relative flex items-center justify-center mb-1">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse" />
                  
                  {/* Glassmorphism Play Button */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:scale-110 active:scale-95 transition cursor-pointer group"
                    title="Play Video"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300 fill-cyan-300 ml-1 group-hover:text-white group-hover:fill-white transition" />
                  </button>
                </div>
              </div>

              {/* Top-Right Table: Tables */}
              <div className="absolute top-6 right-6 sm:right-12 bg-[#0c1626]/90 border border-slate-700/80 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[10px] sm:text-xs font-bold text-sky-300 pb-1 border-b border-slate-700/60 flex items-center gap-1">
                  <TableIcon className="w-3 h-3 text-cyan-400" /> Tables
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
                  <div className="text-amber-300">🔑 id</div>
                  <div>category</div>
                  <div>price</div>
                  <div>coordination</div>
                </div>
              </div>

              {/* Bottom-Right Table: CodeBasics */}
              <div className="absolute bottom-14 right-6 sm:right-12 bg-[#0c1626]/90 border border-slate-700/80 rounded-xl p-2.5 w-32 sm:w-36 shadow-lg backdrop-blur-sm pointer-events-none">
                <div className="text-[10px] sm:text-xs font-bold text-sky-300 pb-1 border-b border-slate-700/60 flex items-center gap-1">
                  <TableIcon className="w-3 h-3 text-cyan-400" /> CodeBasics
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
                  <div className="text-amber-300">🔑 id</div>
                  <div>name</div>
                  <div>username</div>
                  <div>table</div>
                </div>
              </div>

              {/* Bottom-Left Overlay Tag: Channel & Duration */}
              <div className="absolute bottom-12 left-4 sm:left-6 z-20">
                <div className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-semibold text-white shadow-md flex items-center gap-1.5">
                  <span>{activeVideo.channel}</span>
                  <span className="text-slate-400">({activeVideo.duration})</span>
                </div>
              </div>

              {/* Bottom Video Controls Scrubber Bar */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-between gap-3 text-slate-400">
                {/* Play / Skip Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="hover:text-white transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <SkipBack className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                  <SkipForward className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                </div>

                {/* Progress Bar / Scrubber */}
                <div className="flex-1 mx-2 flex items-center">
                  <div className="relative w-full h-1 bg-slate-800 rounded-full cursor-pointer overflow-hidden">
                    <div className="w-1/3 h-full bg-cyan-400 rounded-full" />
                  </div>
                </div>

                {/* Right controls: volume, settings, tv, fullscreen */}
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                  <Settings className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                  <Tv className="w-3.5 h-3.5 hover:text-white transition cursor-pointer" />
                  <Maximize2
                    onClick={() => setIsPlaying(true)}
                    className="w-3.5 h-3.5 hover:text-white transition cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Creator Switcher Tabs (Alex | Mosh | CodeBasics | Telugu) */}
        <div className="w-full flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1">
          {allVideos.map((v, idx) => {
            const isTabActive = selectedVideoIndex === idx;
            const tabName = getTabLabel(v, idx);

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedVideoIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-6 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  isTabActive
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tabName}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Lesson Overview + Live Cheat Sheet + Quick Reference (4 cols on lg) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Card 1: Lesson Overview */}
        <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="text-white font-bold text-base tracking-tight">Lesson Overview</h2>
          <p className="text-slate-400 text-xs">Key Takeaway in nutritious guide for:</p>

          <ul className="space-y-2 text-xs text-slate-300 pt-1">
            {overviewBullets.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>

          {/* Large Amber Gradient CTA Button */}
          <button
            onClick={handleUnlockTheory}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-[0_0_22px_rgba(245,158,11,0.3)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verify & Unlock Step 2: Theory</span>
            <Lock className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        {/* Bottom Row: Live Cheat Sheet + SQL Syntax Quick Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 2A: Live Cheat Sheet */}
          <div className="bg-[#090f1d] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
            <h3 className="text-white font-bold text-xs tracking-tight">Live Cheat Sheet</h3>
            <p className="text-slate-400 text-[11px]">Select all query snippets:</p>

            <div className="bg-[#050811] border border-slate-800/80 rounded-xl p-3 font-mono text-[11px] leading-relaxed">
              <div>
                <span className="text-cyan-400 font-semibold">SELECT </span>
                <span className="text-slate-300">column_name</span>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">FROM </span>
                <span className="text-slate-300">table_name;</span>
              </div>
            </div>
          </div>

          {/* Card 2B: SQL Syntax Quick Reference (Highlighted with amber glowing border) */}
          <div className="bg-[#090f1d] border border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.15)] rounded-2xl p-4 space-y-2">
            <h3 className="text-white font-bold text-xs tracking-tight">SQL Syntax Quick Reference</h3>

            <div className="space-y-1.5 pt-0.5">
              <div className="bg-[#050811] border border-slate-800/80 rounded-xl p-2.5 font-mono text-[10px] leading-relaxed">
                <div>
                  <span className="text-cyan-400 font-semibold">SELECT </span>
                  <span className="text-slate-300">column_name</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">FROM </span>
                  <span className="text-slate-300">table_name;</span>
                </div>
              </div>

              <div className="bg-[#050811] border border-slate-800/80 rounded-xl p-2.5 font-mono text-[10px] leading-relaxed">
                <div>
                  <span className="text-cyan-400 font-semibold">SELECT </span>
                  <span className="text-slate-300">column_name</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">FROM </span>
                  <span className="text-slate-300">table_name;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
