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
  Film,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { TopicVideo } from '../types';

interface VideoPlayerProps {
  video: TopicVideo;
  alternativeVideos?: TopicVideo[];
  addonVideos?: TopicVideo[];
  isWatched: boolean;
  onMarkWatched: () => void;
  onProceedToTheory: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  alternativeVideos = [],
  addonVideos = [],
  isWatched,
  onMarkWatched,
  onProceedToTheory,
}) => {
  // Combine all available videos for selection
  const allVideos = [video, ...(alternativeVideos || []), ...(addonVideos || [])];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [useNoCookie, setUseNoCookie] = useState(false);

  // Video verification checkpoint state
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(isWatched);

  // Reset state when topic changes
  useEffect(() => {
    setSelectedVideoIndex(0);
    setShowCheckpoint(false);
    setSelectedAnswer(null);
    setVerificationError(null);
    setVerificationSuccess(isWatched);
  }, [video?.embedUrl, isWatched]);

  const activeVideo = allVideos[selectedVideoIndex] || video || {
    title: 'SQL SELECT Statement in MySQL',
    embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
    duration: '9:15',
    channel: 'Alex The Analyst',
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

  // Quick 1-question verification checkpoint to confirm video completion
  const handleVerifyVideo = () => {
    if (selectedAnswer === null) {
      setVerificationError('Please select an answer to verify video completion.');
      return;
    }

    // Correct answer is always option 1 (AS keyword / key rule highlighted in the lesson)
    if (selectedAnswer === 1) {
      setVerificationSuccess(true);
      setVerificationError(null);
      onMarkWatched();
    } else {
      setVerificationError('Incorrect. Please review the video clip: the second option is the correct standard SQL rule.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Video Source Switcher: Short Topic Lesson vs Add-on Masterclasses */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 px-1">
          <Film className="w-4 h-4 text-sky-400" />
          <span>Curriculum Video Selection:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary Short Lesson */}
          <button
            onClick={() => setSelectedVideoIndex(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              selectedVideoIndex === 0
                ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🎯 Short Lesson ({video.channel})</span>
            <span className="text-[10px] opacity-80">({video.duration})</span>
          </button>

          {/* Alternative Short Options */}
          {alternativeVideos.map((v, altIdx) => {
            const actualIdx = 1 + altIdx;
            return (
              <button
                key={`alt-${altIdx}`}
                onClick={() => setSelectedVideoIndex(actualIdx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedVideoIndex === actualIdx
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{v.channel}</span>
                <span className="text-[10px] opacity-80">({v.duration})</span>
              </button>
            );
          })}

          {/* Add-on Masterclasses & Telugu */}
          {addonVideos.map((v, addIdx) => {
            const actualIdx = 1 + alternativeVideos.length + addIdx;
            return (
              <button
                key={`add-${addIdx}`}
                onClick={() => setSelectedVideoIndex(actualIdx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedVideoIndex === actualIdx
                    ? 'bg-indigo-500 text-white shadow-md font-bold'
                    : 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/60'
                }`}
              >
                <span>{v.language === 'Telugu' ? '🇮🇳 Telugu Full' : `📚 Add-on: ${v.channel}`}</span>
                <span className="text-[10px] opacity-80">({v.duration})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
              <Video className="w-3 h-3" /> Step 1: Video Lecture
            </span>
            {selectedVideoIndex === 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ⚡ Short Concept & Practice
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                📚 Full Reference Masterclass
              </span>
            )}
            {activeVideo.language && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeVideo.language}
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activeVideo.duration}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{activeVideo.title}</h2>
          <p className="text-xs text-slate-400">
            Instructor / Channel: <span className="text-sky-400 font-semibold">{activeVideo.channel}</span>
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

          {verificationSuccess ? (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Video Verified & Completed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-medium">
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Must Watch & Verify to Unlock Theory</span>
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

      {/* Interactive Verification Checkpoint Modal / Box */}
      {!verificationSuccess && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 border border-sky-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-sky-300">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Mandatory Video Completion Checkpoint</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              🔒 Step 2 Locked until verified
            </span>
          </div>
          <p className="text-xs text-slate-300">
            To ensure genuine learning, confirm you followed the video lecture by answering this 1-click concept check:
          </p>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-white">
              Q: Based on the tutorial video, which keyword is standardly used to assign a friendly alias to an output column?
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                { id: 0, text: 'RENAME column_name' },
                { id: 1, text: 'AS alias_name (e.g. salary * 12 AS annual_salary)' },
                { id: 2, text: 'TO alias_name' },
                { id: 3, text: 'SET header_name' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedAnswer(opt.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center gap-2.5 ${
                    selectedAnswer === opt.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedAnswer === opt.id
                        ? 'border-sky-400 bg-sky-500 text-slate-950'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedAnswer === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            {verificationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{verificationError}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleVerifyVideo}
            className="w-full sm:w-auto px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify Video Completion & Unlock Theory</span>
          </button>
        </div>
      )}

      {/* Add-on Masterclasses Section */}
      {addonVideos && addonVideos.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/20 to-slate-900/80 border border-indigo-900/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Add-on Extended Masterclasses & Full Course Lectures</h3>
            </div>
            <span className="text-[11px] text-slate-400">Optional deep-dive understanding</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {addonVideos.map((add, idx) => {
              const actualIdx = 1 + alternativeVideos.length + idx;
              const isSelected = selectedVideoIndex === actualIdx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedVideoIndex(actualIdx)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {add.language || 'English'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {add.duration}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-2 mt-1">{add.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{add.channel}</p>
                  </div>
                  <button
                    className={`mt-2.5 text-[11px] font-semibold py-1 px-2.5 rounded-lg w-full text-center transition ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Currently Loaded' : 'Load Video'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-400">
          {verificationSuccess
            ? '✅ Video verified! You are ready to study the point-by-point theory notes.'
            : '🔒 Complete the Video Checkpoint above to unlock Step 2.'}
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onProceedToTheory}
            disabled={!verificationSuccess}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
              verificationSuccess
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Proceed to Step 2: Theory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
