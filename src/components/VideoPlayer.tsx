import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Clock,
  Video,
  ListChecks,
  ExternalLink,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { TopicVideo } from '../types';

interface VideoPlayerProps {
  video: TopicVideo;
  alternativeVideos?: TopicVideo[];
  isWatched: boolean;
  onMarkWatched: () => void;
  onProceedToTheory: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  alternativeVideos = [],
  isWatched,
  onMarkWatched,
  onProceedToTheory,
}) => {
  const allVideos = [video, ...(alternativeVideos || [])];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [useNoCookie, setUseNoCookie] = useState(false);

  // Reset selected video index when topic changes
  useEffect(() => {
    setSelectedVideoIndex(0);
  }, [video?.embedUrl]);

  const activeVideo = allVideos[selectedVideoIndex] || video || {
    title: 'SQL Tutorial Video',
    embedUrl: 'https://www.youtube.com/embed/SSKVgrwhzus',
    duration: '45:00',
    channel: 'SQL Mastery',
    summaryPoints: ['Learn database fundamentals', 'Execute SQL queries'],
  };

  // Derive direct watch link on YouTube
  const videoId = activeVideo.embedUrl?.split('/embed/')[1]?.split('?')[0] || '';
  const watchUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : activeVideo.embedUrl;

  const currentEmbedUrl = useNoCookie
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    : `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Video Source & Language Switcher */}
      {allVideos.length > 1 && (
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 px-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Select Video Tutorial Source / Language:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {allVideos.map((v, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVideoIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedVideoIndex === idx
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{v.language === 'Telugu' ? '🇮🇳 Telugu (తెలుగు)' : idx === 0 ? '🇬🇧 Recommended' : v.channel}</span>
                <span className="text-[10px] opacity-75">({v.duration})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
              <Video className="w-3 h-3" /> Step 1: Video Lecture
            </span>
            {activeVideo.language && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {activeVideo.language}
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activeVideo.duration}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{activeVideo.title}</h2>
          <p className="text-xs text-slate-400">
            Instructor: <span className="text-sky-400 font-medium">{activeVideo.channel}</span>
          </p>
        </div>

        {/* Watch Status & Direct YouTube Links */}
        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold border border-red-500/30 transition shadow-sm"
            title="Open directly on YouTube in new tab"
          >
            <svg className="w-4 h-4 fill-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Open on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {isWatched ? (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Video Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-medium">
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Watch to unlock Theory</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Responsive Embed */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
        <iframe
          key={currentEmbedUrl}
          src={currentEmbedUrl}
          title={activeVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Player Utility Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span>If YouTube shows "Video unavailable" due to browser privacy shield:</span>
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setUseNoCookie(!useNoCookie)}
            className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Switch Domain ({useNoCookie ? 'standard' : 'nocookie'})</span>
          </button>
          <span>•</span>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Watch in new tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Key Takeaways & Summary Box */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
          <ListChecks className="w-4 h-4" />
          <span>Core Concepts Covered in This Video</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
          {(activeVideo.summaryPoints || []).map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40"
            >
              <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-400">
          Finished watching the video? Click below to confirm and move to reading the website theory.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isWatched ? (
            <button
              onClick={() => {
                onMarkWatched();
                onProceedToTheory();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Watched & Next: Theory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onProceedToTheory}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md transition cursor-pointer"
            >
              <span>Proceed to Step 2: Theory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
