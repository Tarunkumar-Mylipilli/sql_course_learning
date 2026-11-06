import React, { useState } from 'react';
import { X, Sparkles, Send, Lightbulb, BookOpen, CheckCircle, Code2, AlertCircle } from 'lucide-react';
import { Topic } from '../types';

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

    try {
      const res = await fetch('/api/tutor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: currentTopic.title,
          topicLevel: currentTopic.level,
          challengeDescription: currentTopic.challenge.instructions,
          schemaSql: currentTopic.challenge.schemaSql,
          userSql: context?.userSql || currentTopic.challenge.starterSql,
          errorMessage: context?.errorMessage,
          mismatchDetails: context?.mismatchDetails,
          requestType: type,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setResponseContent(data.content || 'Keep trying! Check your syntax and table schema.');
    } catch (err: any) {
      // Offline fallback tutor
      if (type === 'hint') {
        setResponseContent(
          `💡 **Pedagogical Hint for ${currentTopic.title}**:\n\n` +
          `• First, look at the Schema Inspector in the Tables tab to verify exact column names.\n` +
          `• Remember SQL keyword ordering: \`SELECT\` -> \`FROM\` -> \`WHERE\` -> \`GROUP BY\` -> \`HAVING\` -> \`ORDER BY\` -> \`LIMIT\`.\n` +
          `• Check for trailing commas in your column list before the FROM keyword.`
        );
      } else if (type === 'concept_breakdown') {
        setResponseContent(
          `📚 **Core Concept Breakdown for ${currentTopic.title}**:\n\n` +
          `${currentTopic.theory.summary}\n\n` +
          `**Standard Syntax Pattern:**\n\`\`\`sql\n${currentTopic.theory.syntax}\n\`\`\`\n\n` +
          `**Key Rules to Remember:**\n` +
          currentTopic.theory.keyRules.map((r) => `• ${r}`).join('\n')
        );
      } else {
        setResponseContent(
          `🎯 **Approach Guide**:\n\n` +
          `To solve this challenge, break it into 3 steps:\n` +
          `1. Choose the right table in FROM.\n` +
          `2. Apply filtering or aggregations as specified.\n` +
          `3. Sort or limit if requested by the challenge.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI SQL Tutor</h3>
              <p className="text-xs text-slate-400">Contextual guidance for {currentTopic.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context Banner if error or mismatch */}
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
            <span>Give Me a Hint</span>
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
            <span>Walk Through Steps</span>
          </button>
        </div>

        {/* Response Area */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 min-h-[160px] text-xs text-slate-200 leading-relaxed font-sans">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Analyzing query logic and preparing explanation...</span>
            </div>
          ) : responseContent ? (
            <div className="whitespace-pre-wrap space-y-2">{responseContent}</div>
          ) : (
            <div className="text-slate-500 text-center py-8">
              Click one of the options above to get targeted hints, concept breakdowns, or step-by-step guidance.
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
