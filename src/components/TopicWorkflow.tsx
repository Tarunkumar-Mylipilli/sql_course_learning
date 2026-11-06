import React from 'react';
import {
  Video,
  BookOpen,
  HelpCircle,
  Code2,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Topic, TopicStep, CourseProgress } from '../types';
import { isStepUnlocked } from '../lib/storage';
import { VideoPlayer } from './VideoPlayer';
import { TheoryViewer } from './TheoryViewer';
import { QuizStep } from './QuizStep';
import { CodingWorkspace } from './CodingWorkspace';

interface TopicWorkflowProps {
  topic: Topic;
  currentStep: TopicStep;
  setCurrentStep: (step: TopicStep) => void;
  progress: CourseProgress;
  onMarkVideoWatched: (topicId: string) => void;
  onMarkTheoryRead: (topicId: string) => void;
  onQuizSubmit: (topicId: string, score: number, passed: boolean) => void;
  onCodingComplete: (topicId: string, sql: string) => void;
  onProceedToNextTopic: () => void;
  onPreviousTopic: () => void;
  hasPreviousTopic: boolean;
  hasNextTopic: boolean;
  onOpenAITutorWithContext: (context: {
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  }) => void;
}

export const TopicWorkflow: React.FC<TopicWorkflowProps> = ({
  topic,
  currentStep,
  setCurrentStep,
  progress,
  onMarkVideoWatched,
  onMarkTheoryRead,
  onQuizSubmit,
  onCodingComplete,
  onProceedToNextTopic,
  onPreviousTopic,
  hasPreviousTopic,
  hasNextTopic,
  onOpenAITutorWithContext,
}) => {
  const topicProgress = (progress?.topics && topic?.id && progress.topics[topic.id]) || {
    videoWatched: false,
    theoryRead: false,
    quizPassed: false,
    quizScore: 0,
    codingCompleted: false,
  };

  const stepsConfig: {
    id: TopicStep;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    isCompleted: boolean;
    isUnlocked: boolean;
  }[] = [
    {
      id: 'video',
      label: 'Step 1: Video',
      sublabel: 'Watch Lecture',
      icon: <Video className="w-4 h-4" />,
      isCompleted: topicProgress.videoWatched,
      isUnlocked: true,
    },
    {
      id: 'theory',
      label: 'Step 2: Theory',
      sublabel: 'Learn Syntax & Rules',
      icon: <BookOpen className="w-4 h-4" />,
      isCompleted: topicProgress.theoryRead,
      isUnlocked: isStepUnlocked(topic.id, 'theory', progress),
    },
    {
      id: 'quiz',
      label: 'Step 3: Quiz',
      sublabel: 'Pass Mastery Check',
      icon: <HelpCircle className="w-4 h-4" />,
      isCompleted: topicProgress.quizPassed,
      isUnlocked: isStepUnlocked(topic.id, 'quiz', progress),
    },
    {
      id: 'coding',
      label: 'Step 4: SQL Coding',
      sublabel: 'Real Query Challenge',
      icon: <Code2 className="w-4 h-4" />,
      isCompleted: topicProgress.codingCompleted,
      isUnlocked: isStepUnlocked(topic.id, 'coding', progress), // Strictly locked unless Quiz is passed!
    },
  ];

  return (
    <div className="space-y-6">
      {/* Topic Title & Navigation Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Module {topic.order}
            </span>
            <span className="text-xs text-slate-400 font-medium">{topic.level}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">~{topic.estimatedMinutes} mins</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{topic.title}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{topic.overview}</p>
        </div>

        {/* Prev / Next Topic Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPreviousTopic}
            disabled={!hasPreviousTopic}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
              hasPreviousTopic
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Previous Topic"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Topic</span>
          </button>
          <button
            onClick={onProceedToNextTopic}
            disabled={!hasNextTopic || !topicProgress.codingCompleted}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
              hasNextTopic && topicProgress.codingCompleted
                ? 'bg-sky-600 border-sky-500 text-white hover:bg-sky-500 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title={
              !topicProgress.codingCompleted
                ? 'Complete coding challenge to unlock next topic'
                : 'Next Topic'
            }
          >
            <span className="hidden sm:inline">Next Topic</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Step Stepper Navigation Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stepsConfig.map((s) => {
          const isActive = currentStep === s.id;
          return (
            <button
              key={s.id}
              disabled={!s.isUnlocked}
              onClick={() => setCurrentStep(s.id)}
              className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 relative overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500/80 shadow-lg shadow-sky-500/10'
                  : s.isUnlocked
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  s.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isActive
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : s.isUnlocked
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                {s.isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.isUnlocked ? s.icon : <Lock className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Step Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-sky-300' : 'text-slate-200'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{s.sublabel}</p>
                {!s.isUnlocked && (
                  <span className="text-[10px] text-rose-400/80 block mt-0.5">
                    🔒 Locked
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content Active Area */}
      <div className="mt-6">
        {currentStep === 'video' && (
          <VideoPlayer
            video={topic.video}
            alternativeVideos={topic.alternativeVideos}
            addonVideos={topic.addonVideos}
            isWatched={topicProgress.videoWatched}
            onMarkWatched={() => onMarkVideoWatched(topic.id)}
            onProceedToTheory={() => setCurrentStep('theory')}
          />
        )}

        {currentStep === 'theory' && (
          <TheoryViewer
            theory={topic.theory}
            isRead={topicProgress.theoryRead}
            onMarkRead={() => onMarkTheoryRead(topic.id)}
            onProceedToQuiz={() => setCurrentStep('quiz')}
          />
        )}

        {currentStep === 'quiz' && (
          <QuizStep
            questions={topic.quiz.questions}
            passingScorePercent={topic.quiz.passingScorePercent}
            isPassed={topicProgress.quizPassed}
            savedScore={topicProgress.quizScore}
            onQuizSubmit={(score, passed) => onQuizSubmit(topic.id, score, passed)}
            onProceedToCoding={() => setCurrentStep('coding')}
          />
        )}

        {currentStep === 'coding' && (
          <CodingWorkspace
            challenge={topic.challenge}
            challenges={topic.challenges || [topic.challenge]}
            topicTitle={topic.title}
            isCompleted={topicProgress.codingCompleted}
            savedSql={topicProgress.userSql}
            onCodingComplete={(sql) => onCodingComplete(topic.id, sql)}
            onProceedToNextTopic={onProceedToNextTopic}
            hasNextTopic={hasNextTopic}
            onOpenAITutorWithContext={onOpenAITutorWithContext}
          />
        )}
      </div>
    </div>
  );
};
