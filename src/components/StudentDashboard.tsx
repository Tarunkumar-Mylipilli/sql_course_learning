import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  Play,
  Flame,
  Award,
  BookOpen,
  Code2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  Bookmark,
  ChevronRight,
  Database,
  Calendar,
} from 'lucide-react';
import { Topic, CourseProgress } from '../types';

interface StudentDashboardProps {
  topics: Topic[];
  progress: CourseProgress;
  onSelectTopic: (topic: Topic) => void;
  onStartDailyPractice: () => void;
  onOpenRoadmap: () => void;
  onOpenInterview50: () => void;
  onOpenNotes: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  topics,
  progress,
  onSelectTopic,
  onStartDailyPractice,
  onOpenRoadmap,
  onOpenInterview50,
  onOpenNotes,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Compute metrics
  const totalTopics = topics.length;
  const completedTopicsCount = topics.filter(
    (t) => progress.topics[t.id]?.codingCompleted
  ).length;
  const inProgressTopicsCount = topics.filter((t) => {
    const p = progress.topics[t.id];
    return p && (p.videoWatched || p.theoryRead || p.quizPassed) && !p.codingCompleted;
  }).length;
  const percentComplete = Math.round((completedTopicsCount / Math.max(1, totalTopics)) * 100);

  // Active topic
  const currentTopic = topics.find((t) => t.id === progress.currentTopicId) || topics[0];
  const currentTopicProg = progress.topics[currentTopic?.id] || {
    videoWatched: false,
    theoryRead: false,
    quizPassed: false,
    quizScore: 0,
    codingCompleted: false,
  };

  // Group by level
  const beginnerTopics = topics.filter((t) => t.level === 'Beginner');
  const intermediateTopics = topics.filter((t) => t.level === 'Intermediate');
  const advancedTopics = topics.filter((t) => t.level === 'Advanced');

  const filteredTopics =
    selectedLevelFilter === 'All'
      ? topics
      : topics.filter((t) => t.level === selectedLevelFilter);

  // Bookmarked topics
  const bookmarkedTopics = topics.filter((t) => progress.topics[t.id]?.bookmarked);

  // Daily SQL Challenge sample (based on day of year)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const dailyTopic = topics[dayOfYear % Math.max(1, topics.length)] || topics[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. HERO & WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#09101d] to-[#040810] border border-cyan-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive SQL Mastery Curriculum</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">Learner</span>!
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Master SQL from foundational queries to high-throughput enterprise optimization. Watch curated lectures, read structured notes, pass quizzes, and execute live queries in your browser.
            </p>

            {/* Quick Stats Pill Row */}
            <div className="flex items-center gap-4 pt-2 flex-wrap text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-[#060a12]/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span><strong className="text-white">{progress.streakDays || 1} Days</strong> Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-[#060a12]/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><strong className="text-white">{completedTopicsCount}/{totalTopics}</strong> Modules Completed</span>
              </div>
              <div className="flex items-center gap-2 bg-[#060a12]/80 px-3.5 py-2 rounded-xl border border-slate-800">
                <Target className="w-4 h-4 text-cyan-400" />
                <span><strong className="text-white">{percentComplete}%</strong> Total Progress</span>
              </div>
            </div>
          </div>

          {/* Continue Learning Card */}
          <div className="lg:col-span-4 bg-[#050912]/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Continue Learning</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-semibold border border-cyan-800">
                {currentTopic?.level || 'Beginner'}
              </span>
            </div>

            <div>
              <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">
                {currentTopic?.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {currentTopic?.overview}
              </p>
            </div>

            {/* Step progress pills - strictly shows locked vs unlocked */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] text-center font-mono">
              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  currentTopicProg.videoWatched
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                }`}
              >
                {currentTopicProg.videoWatched ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Play className="w-2.5 h-2.5" />}
                <span>Video</span>
              </div>

              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  currentTopicProg.theoryRead
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : currentTopicProg.videoWatched
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/80 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                {currentTopicProg.theoryRead ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : !currentTopicProg.videoWatched ? (
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                ) : null}
                <span>Theory</span>
              </div>

              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  currentTopicProg.quizPassed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : currentTopicProg.theoryRead
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/80 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                {currentTopicProg.quizPassed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : !currentTopicProg.theoryRead ? (
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                ) : null}
                <span>Quiz</span>
              </div>

              <div
                className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                  currentTopicProg.codingCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : currentTopicProg.quizPassed
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-slate-950/80 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                {currentTopicProg.codingCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : !currentTopicProg.quizPassed ? (
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                ) : null}
                <span>Code</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTopic(currentTopic)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer"
            >
              <span>Resume Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Progress */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{percentComplete}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Modules Done */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed Modules</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {completedTopicsCount} <span className="text-xs text-slate-500 font-normal">/ {totalTopics}</span>
          </div>
          <div className="text-[11px] text-slate-400">{inProgressTopicsCount} currently in progress</div>
        </div>

        {/* Learning Streak */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {progress.streakDays || 1} <span className="text-xs text-slate-500 font-normal">Days</span>
          </div>
          <div className="text-[11px] text-slate-400">Keep practicing daily!</div>
        </div>

        {/* Practice Challenges */}
        <div className="bg-[#0a101f] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Interview Practice</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400">50+</div>
          <div className="text-[11px] text-slate-400">FAANG & LeetCode problems</div>
        </div>
      </div>

      {/* 3. DAILY PRACTICE CARD & LEVEL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily SQL Practice Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0e172a] to-[#070d18] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              Daily SQL Challenge
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              Today's Workout
            </span>
          </div>

          <div>
            <h4 className="text-white font-bold text-base">{dailyTopic.challenge?.title || dailyTopic.title}</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
              {dailyTopic.challenge?.instructions || dailyTopic.overview}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Difficulty: {dailyTopic.challenge?.difficulty || 'Medium'}</span>
            <button
              onClick={() => onSelectTopic(dailyTopic)}
              className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <span>Solve Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3-Tier Pedagogy Overview */}
        <div className="lg:col-span-7 bg-[#0a101f] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Structured Learning Levels
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">3-tier progression from foundational to high-scale optimization</p>
            </div>
            <button
              onClick={onOpenRoadmap}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Level 1 */}
            <div
              onClick={() => setSelectedLevelFilter('Beginner')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${selectedLevelFilter === 'Beginner' ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Level 1</div>
              <div className="text-white font-bold text-xs mt-1">Beginner</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{beginnerTopics.length} Modules</div>
              <p className="text-[10px] text-slate-500 mt-2">SELECT, WHERE, NULL, ORDER BY, Strings</p>
            </div>

            {/* Level 2 */}
            <div
              onClick={() => setSelectedLevelFilter('Intermediate')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${selectedLevelFilter === 'Intermediate' ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Level 2</div>
              <div className="text-white font-bold text-xs mt-1">Intermediate</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{intermediateTopics.length} Modules</div>
              <p className="text-[10px] text-slate-500 mt-2">Dates, Aggregates, GROUP BY, Joins, Self Join</p>
            </div>

            {/* Level 3 */}
            <div
              onClick={() => setSelectedLevelFilter('Advanced')}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${selectedLevelFilter === 'Advanced' ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'}`}
            >
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Level 3</div>
              <div className="text-white font-bold text-xs mt-1">Advanced</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{advancedTopics.length} Modules</div>
              <p className="text-[10px] text-slate-500 mt-2">CTEs, Window Functions, CASE WHEN, Views & Indexes</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. COURSE MODULES GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Course Modules
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any module to open lessons, video walkthroughs, notes, quizzes, and coding sandbox.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#060c18] p-1 rounded-xl border border-slate-800 self-start sm:self-center">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedLevelFilter === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic, idx) => {
            const prog = progress.topics[topic.id] || {
              videoWatched: false,
              theoryRead: false,
              quizPassed: false,
              quizScore: 0,
              codingCompleted: false,
            };
            const isCompleted = prog.codingCompleted;
            const isBookmarked = prog.bookmarked;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="group relative bg-[#0a101f] hover:bg-[#0c1426] border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between space-y-3"
              >
                {/* Top: Order & Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono flex items-center justify-center border border-cyan-500/20">
                      {topic.order || idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        topic.level === 'Beginner'
                          ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800'
                          : topic.level === 'Intermediate'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                          : 'bg-purple-950/40 text-purple-300 border-purple-800'
                      }`}
                    >
                      {topic.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">{topic.estimatedMinutes || 20}m</span>
                    )}
                  </div>
                </div>

                {/* Title & Overview */}
                <div className="space-y-1.5">
                  <h3 className="text-white font-bold text-sm group-hover:text-cyan-300 transition line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {topic.overview}
                  </p>
                </div>

                {/* Submodule count pill if present */}
                {topic.subModules && topic.subModules.length > 0 && (
                  <div className="text-[11px] text-cyan-400/90 font-mono flex items-center gap-1">
                    <span>↳ {topic.subModules.length} Submodules breakdown</span>
                  </div>
                )}

                {/* Bottom Step Progression Dots */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prog.videoWatched ? 'bg-emerald-400' : 'bg-slate-700'}`} title="Video" />
                    <span className={`w-2 h-2 rounded-full ${prog.theoryRead ? 'bg-emerald-400' : 'bg-slate-700'}`} title="Theory" />
                    <span className={`w-2 h-2 rounded-full ${prog.quizPassed ? 'bg-emerald-400' : 'bg-slate-700'}`} title="Quiz" />
                    <span className={`w-2 h-2 rounded-full ${prog.codingCompleted ? 'bg-emerald-400' : 'bg-slate-700'}`} title="Coding" />
                  </div>

                  <span className="text-xs text-slate-400 group-hover:text-cyan-300 flex items-center gap-1 font-semibold transition">
                    <span>Open Module</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
