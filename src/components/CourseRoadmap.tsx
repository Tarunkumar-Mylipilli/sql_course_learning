import React from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  BookOpen,
  HelpCircle,
  Code2,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Topic, CourseProgress } from '../types';
import { isTopicUnlocked } from '../lib/storage';

interface CourseRoadmapProps {
  topics: Topic[];
  progress: CourseProgress;
  onSelectTopic: (topic: Topic) => void;
  onOpenAddTopic: () => void;
}

export const CourseRoadmap: React.FC<CourseRoadmapProps> = ({
  topics,
  progress,
  onSelectTopic,
  onOpenAddTopic,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Roadmap Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Complete Curriculum Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SQL From Start to Mastery
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Follow our proven 4-stage pedagogy for each topic: Watch the curated lecture video,
            study the core website syntax and pitfalls, pass the mastery quiz, and solidify your skills with real browser-based SQL challenges.
          </p>
        </div>
      </div>

      {/* Topics Timeline / Card List */}
      <div className="space-y-4">
        {topics.map((t, index) => {
          const unlocked = isTopicUnlocked(index, topics, progress);
          const tProg = progress?.topics?.[t.id];
          const isDone = Boolean(tProg?.codingCompleted);

          return (
            <div
              key={t.id}
              onClick={() => {
                if (unlocked) onSelectTopic(t);
              }}
              className={`p-5 rounded-2xl border transition relative group ${
                unlocked
                  ? isDone
                    ? 'bg-slate-900/70 border-emerald-500/40 hover:border-emerald-500/60 cursor-pointer shadow-sm'
                    : 'bg-slate-900/70 border-slate-800 hover:border-sky-500/60 hover:bg-slate-900/90 cursor-pointer shadow-md'
                  : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Status Circle */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm shadow-md mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : unlocked
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : unlocked ? t.order : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {t.level}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ~{t.estimatedMinutes} mins
                      </span>
                      {isDone && (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Trophy className="w-3 h-3" /> Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{t.overview}</p>
                  </div>
                </div>

                {/* 4 Steps Indicator Pills */}
                <div className="flex items-center gap-1.5 sm:self-center shrink-0">
                  <div
                    title="Video Watched"
                    className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                      tProg?.videoWatched
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                  </div>
                  <div
                    title="Theory Read"
                    className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                      tProg?.theoryRead
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div
                    title="Quiz Passed"
                    className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                      tProg?.quizPassed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div
                    title="Coding Challenge Solved"
                    className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                      tProg?.codingCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </div>

                  {unlocked ? (
                    <div className="ml-2 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="ml-2 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-600">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Topic Footer CTA */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white">Want to expand the curriculum?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          You can create and add custom SQL modules with your own YouTube video, custom notes, interactive quiz questions, and hands-on SQLite challenges.
        </p>
        <button
          onClick={onOpenAddTopic}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
        >
          + Add New SQL Topic
        </button>
      </div>
    </div>
  );
};
