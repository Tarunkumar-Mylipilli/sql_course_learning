import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, BookOpen, Code2, AlertCircle } from 'lucide-react';
import { Topic } from '../types';
import { askAITutor } from '../services/aiTutor';

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
  const [requestType, setRequestType] = useState<'hint' | 'concept_breakdown' | 'solution_explanation'>('hint');
  const [responseContent, setResponseContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAskTutor = async (type: 'hint' | 'concept_breakdown' | 'solution_explanation') => {
    setRequestType(type);
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
    });

    setResponseContent(res.content);
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tutor-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center shadow-md" aria-hidden="true">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="ai-tutor-title" className="text-base font-bold text-white">Socratic AI SQL Tutor</h3>
              <p className="text-xs text-slate-400">Guiding you to the solution without giving away direct answers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Close AI Tutor"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
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

        {/* Prompt Modes */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleAskTutor('hint')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'hint'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Give Me a Socratic Hint</span>
          </button>
          <button
            onClick={() => handleAskTutor('concept_breakdown')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'concept_breakdown'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain the Concept</span>
          </button>
          <button
            onClick={() => handleAskTutor('solution_explanation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              requestType === 'solution_explanation'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Problem-Solving Approach</span>
          </button>
        </div>

        {/* Response Area */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 min-h-[140px] text-xs text-slate-200 leading-relaxed font-sans">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Analyzing code context and formulating guiding questions...</span>
            </div>
          ) : responseContent ? (
            <div className="whitespace-pre-wrap space-y-2 text-slate-100 text-sm">{responseContent}</div>
          ) : (
            <div className="text-slate-500 text-center py-8">
              Click one of the buttons above to ask your tutor for a guiding question or concept explanation.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close Tutor
          </button>
        </div>
      </div>
    </div>
  );
};
