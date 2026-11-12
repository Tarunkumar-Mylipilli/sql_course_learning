import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, BookOpen, Code2, AlertCircle, Brain, Cpu, Trophy, ArrowRight } from 'lucide-react';
import { Topic } from '../types';
import { askAITutor, ExplanationStyle, STYLE_DEFINITIONS } from '../services/aiTutor';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: Topic;
  context?: {
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  };
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  currentTopic,
  context,
}) => {
  const [requestType, setRequestType] = useState<'hint' | 'concept_breakdown' | 'solution_explanation'>('concept_breakdown');
  const [selectedStyle, setSelectedStyle] = useState<ExplanationStyle>('analogy');
  const [responseContent, setResponseContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<'ai-direct' | 'fallback' | 'proxy' | null>(null);

  if (!isOpen) return null;

  const handleAskTutor = async (
    type: 'hint' | 'concept_breakdown' | 'solution_explanation',
    styleToUse: ExplanationStyle = selectedStyle
  ) => {
    setRequestType(type);
    setSelectedStyle(styleToUse);
    setIsLoading(true);
    setResponseContent('');

    const res = await askAITutor({
      topicTitle: currentTopic.title,
      topicLevel: currentTopic.level,
      challengeInstructions: currentTopic.challenge.instructions,
      schemaSql: currentTopic.challenge.schemaSql,
      userSql: context?.userSql || '',
      errorMessage: context?.errorMessage,
      mismatchDetails: context?.mismatchDetails,
      requestType: type,
      style: styleToUse,
    });

    setResponseContent(res.content);
    setSourceType(res.source);
    setIsLoading(false);
  };

  const stylesList: { key: ExplanationStyle; label: string; sublabel: string; icon: React.ReactNode; color: string }[] = [
    {
      key: 'analogy',
      label: 'Real-World Analogy',
      sublabel: 'Mental model & story intuition',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-200 hover:border-purple-500',
    },
    {
      key: 'breakdown',
      label: 'Execution Engine Order',
      sublabel: 'Logical pipeline (FROM → WHERE → ...)',
      icon: <Cpu className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-200 hover:border-sky-500',
    },
    {
      key: 'interview',
      label: 'Senior Dev / Interview Mnemonic',
      sublabel: 'Cheat-sheet, edge cases & traps',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-200 hover:border-amber-500',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tutor-title"
    >
      <div className="bg-surface border border-border-default rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-accent-600/30" aria-hidden="true">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-tutor-title" className="text-base font-bold text-content-primary">
                  100% Free Multi-Style AI Tutor
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                  100% Anonymous • No Account Needed
                </span>
              </div>
              <p className="text-xs text-content-secondary">
                Designed around human memory retention: analogies, database execution logic, and interview checklists.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface/50 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            aria-label="Close AI Tutor"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Current Topic Context Indicator */}
        <div className="flex items-center justify-between text-xs px-3 py-2 bg-canvas rounded-xl border border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-content-muted">Topic:</span>
            <span className="font-semibold text-content-primary">{currentTopic.title}</span>
            {currentTopic.level && (
              <span className="text-[10px] px-2 py-0.5 bg-surface text-accent-500 rounded border border-border-subtle capitalize">
                {currentTopic.level}
              </span>
            )}
          </div>
          {sourceType && (
            <span className="text-[11px] text-content-muted">
              Source: <span className="font-mono text-content-secondary">{sourceType === 'ai-direct' ? 'Neural AI Tutor (Open Tier)' : sourceType === 'proxy' ? 'Custom AI Proxy' : 'Pedagogical Cognitive Engine'}</span>
            </span>
          )}
        </div>

        {/* User Context Banner if error */}
        {context?.errorMessage && (
          <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-200">Current Execution Error:</span>
              <p className="font-mono mt-0.5">{context.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Learning Style Selector: 3 Cognitive Retention Styles */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-content-muted flex items-center justify-between">
            <span>Select Learning & Memory Style:</span>
            <span className="text-[11px] font-normal text-content-subtle lowercase">choose how your brain remembers best</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {stylesList.map((item) => {
              const isSelected = selectedStyle === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleAskTutor(requestType, item.key)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-accent-500 bg-accent-500/10 ring-1 ring-accent-500 shadow-md'
                      : 'border-border-default bg-surface/50 hover:bg-surface text-content-secondary hover:text-content-primary'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {item.icon}
                    <span className="text-xs font-bold text-content-primary">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-content-muted leading-tight">{item.sublabel}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Depth / Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-content-muted mr-1">Tutor Action:</span>
          <button
            onClick={() => handleAskTutor('hint', selectedStyle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'hint'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'bg-surface text-content-secondary hover:text-content-primary border border-border-default'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Guiding Hint (No Spoilers)</span>
          </button>
          <button
            onClick={() => handleAskTutor('concept_breakdown', selectedStyle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'concept_breakdown'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'bg-surface text-content-secondary hover:text-content-primary border border-border-default'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain the Concept</span>
          </button>
          <button
            onClick={() => handleAskTutor('solution_explanation', selectedStyle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'solution_explanation'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'bg-surface text-content-secondary hover:text-content-primary border border-border-default'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Step-by-Step Approach</span>
          </button>
        </div>

        {/* Response Area */}
        <div className="p-5 bg-canvas rounded-2xl border border-border-default min-h-[160px] text-xs text-content-primary leading-relaxed font-sans shadow-inner">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-accent-500">
              <Sparkles className="w-6 h-6 animate-spin" />
              <div className="text-center space-y-1">
                <p className="font-semibold text-content-primary">Formulating {STYLE_DEFINITIONS[selectedStyle].name}...</p>
                <p className="text-[11px] text-content-muted">Using free zero-cost AI model tailored to cognitive memory retention</p>
              </div>
            </div>
          ) : responseContent ? (
            <div className="whitespace-pre-wrap space-y-3 text-content-primary text-sm leading-relaxed">
              {responseContent}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-accent-500/50 mb-1" />
              <p className="text-sm font-semibold text-content-primary">Pick your memory style and ask a question</p>
              <p className="text-xs text-content-muted max-w-md">
                Click any of the 3 style cards above to generate an intuitive real-world analogy, query execution pipeline, or interview cheat-sheet for <span className="font-semibold text-content-primary">{currentTopic.title}</span>.
              </p>
              <button
                type="button"
                onClick={() => handleAskTutor('concept_breakdown', 'analogy')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
              >
                <span>Explain With Real-World Analogy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border-default">
          <p className="text-[11px] text-content-muted">
            Tip: Switch styles anytime to understand the same query from 3 different neural angles!
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface hover:bg-surface/80 border border-border-default text-content-primary text-xs font-semibold transition cursor-pointer"
          >
            Close Tutor
          </button>
        </div>
      </div>
    </div>
  );
};
