import React from 'react';
import {
  Play,
  FileText,
  HelpCircle,
  Code2,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Edit3,
  Trash2,
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
  onEditTopic?: (topic: Topic) => void;
  onDeleteTopic?: (topicId: string) => void;
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
  onEditTopic,
  onDeleteTopic,
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
    stepNumber: number;
    title: string;
    icon: React.ReactNode;
    isCompleted: boolean;
    isUnlocked: boolean;
  }[] = [
    {
      id: 'video',
      stepNumber: 1,
      title: 'Video',
      icon: <Play className="w-3.5 h-3.5 fill-current" />,
      isCompleted: topicProgress.videoWatched,
      isUnlocked: true,
    },
    {
      id: 'theory',
      stepNumber: 2,
      title: 'Theory',
      icon: <FileText className="w-3.5 h-3.5" />,
      isCompleted: topicProgress.theoryRead,
      isUnlocked: isStepUnlocked(topic.id, 'theory', progress),
    },
    {
      id: 'quiz',
      stepNumber: 3,
      title: 'Quiz',
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      isCompleted: topicProgress.quizPassed,
      isUnlocked: isStepUnlocked(topic.id, 'quiz', progress),
    },
    {
      id: 'coding',
      stepNumber: 4,
      title: 'SQL Playground',
      icon: <Code2 className="w-3.5 h-3.5" />,
      isCompleted: topicProgress.codingCompleted,
      isUnlocked: isStepUnlocked(topic.id, 'coding', progress),
    },
  ];

  const currentStepIndex = stepsConfig.findIndex((s) => s.id === currentStep);

  // Function to highlight SQL keywords like SELECT in cyan inside title
  const formatTitle = (titleStr: string) => {
    const keywords = ['SELECT', 'WHERE', 'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'CTE', 'WINDOW', 'CASE'];
    let formatted = titleStr;
    const parts = formatted.split(new RegExp(`(${keywords.join('|')})`, 'g'));
    return parts.map((part, idx) =>
      keywords.includes(part) ? (
        <span key={idx} className="text-cyan-400 font-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleDelete = () => {
    if (onDeleteTopic && window.confirm(`Are you sure you want to delete "${topic.title}"?`)) {
      onDeleteTopic(topic.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subheader: Breadcrumb Pill + Highlighted Title + Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1.5">
          {/* Breadcrumb badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-[#0b1220] border border-slate-800/80 text-slate-400">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" /> Modules
            </span>
            <span className="text-slate-600">&gt;</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-cyan-400" /> {topic.level}
            </span>
            <span className="text-slate-600">&gt;</span>
            <span className="text-slate-400">{topic.estimatedMinutes || 20} mins</span>
          </div>

          {/* Large Title with SELECT highlighted in cyan */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {topic.order}. {formatTitle(topic.title)}
          </h1>

          {/* Sub-modules Pills Bar if present */}
          {topic.subModules && topic.subModules.length > 0 && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400">Submodules:</span>
              {topic.subModules.map((sub, sIdx) => (
                <div
                  key={sub.id || sIdx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  title={sub.summary || sub.title}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{sub.title}</span>
                  {sub.duration && <span className="text-[10px] text-slate-400 font-mono">({sub.duration})</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Prev/Next Topic Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Navigation Buttons: ← Prev & Next → */}
          <div className="flex items-center gap-1.5 bg-[#0b1220] p-1 rounded-xl border border-slate-800">
            <button
              onClick={onPreviousTopic}
              disabled={!hasPreviousTopic}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                hasPreviousTopic
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>← Prev</span>
            </button>

            <button
              onClick={onProceedToNextTopic}
              disabled={!hasNextTopic || !topicProgress.codingCompleted}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                hasNextTopic && topicProgress.codingCompleted
                  ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                  : hasNextTopic
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Next →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Stepped Progression Bar with Connected Glowing Beam */}
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-[640px] flex items-center justify-between relative px-2">
          {stepsConfig.map((s, idx) => {
            const isActive = currentStep === s.id;
            const isPassed = s.isCompleted;
            const hasNext = idx < stepsConfig.length - 1;
            const isConnectorGlowing = idx < currentStepIndex || (isActive && idx === 0);

            return (
              <React.Fragment key={s.id}>
                {/* Step Pill */}
                <button
                  disabled={!s.isUnlocked}
                  onClick={() => setCurrentStep(s.id)}
                  className={`relative z-10 transition-all flex items-center gap-2 cursor-pointer select-none ${
                    isActive
                      ? 'px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_22px_rgba(34,211,238,0.45)]'
                      : isPassed
                      ? 'px-5 py-2 rounded-full bg-[#0b1322] border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-medium hover:bg-slate-800'
                      : s.isUnlocked
                      ? 'px-5 py-2 rounded-full bg-[#0b1322] border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium hover:border-slate-700'
                      : 'px-5 py-2 rounded-full bg-[#090f1d] border border-slate-800/70 text-slate-500 text-xs sm:text-sm font-medium cursor-not-allowed'
                  }`}
                >
                  <span className="font-semibold">
                    {s.stepNumber}. {s.title}
                  </span>
                  {isActive ? (
                    s.icon
                  ) : isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : !s.isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    s.icon
                  )}
                </button>

                {/* Connecting Line / Beam between steps */}
                {hasNext && (
                  <div className="flex-1 mx-2 relative flex items-center">
                    <div
                      className={`w-full h-1 rounded-full transition-all duration-500 ${
                        isConnectorGlowing
                          ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.9)]'
                          : 'bg-slate-800/80 h-0.5'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="mt-4">
        {currentStep === 'video' && (
          <VideoPlayer
            video={topic.video}
            alternativeVideos={topic.alternativeVideos}
            addonVideos={topic.addonVideos}
            isWatched={topicProgress.videoWatched}
            onMarkWatched={() => onMarkVideoWatched(topic.id)}
            onProceedToTheory={() => setCurrentStep('theory')}
            topicTitle={topic.title}
            topicOverview={topic.overview}
            theorySyntax={topic.theory?.syntax}
          />
        )}

        {currentStep === 'theory' && (
          <TheoryViewer
            theory={topic.theory}
            subModules={topic.subModules}
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
