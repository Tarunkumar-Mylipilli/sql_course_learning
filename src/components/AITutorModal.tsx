import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, BookOpen, Code2, AlertCircle } from 'lucide-react';
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

const SOCRATIC_SYSTEM_PROMPT =
  'You are a strict, Socratic SQL Tutor. Your absolute primary rule is: DO NOT WRITE SQL CODE FOR THE STUDENT. You are forbidden from generating SELECT, FROM, JOIN, or any other SQL syntax in your responses. If the student asks for the answer, you must refuse. Your job is to guide them using ONLY the following methods: 1. Ask a leading question. 2. Point out a syntax error in their current code. 3. Explain a concept. Keep your responses under 3 sentences. Never output a code block.';

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

    // Context passed to AI strictly includes ONLY challenge_description and user_code.
    // We intentionally OMIT expected_output_data, expected_output_columns, and solutionSql.
    const challengeDescription = currentTopic.challenge.instructions;
    const userCode = context?.userSql || '';

    const userPrompt = `Challenge Goal:\n${challengeDescription}\n\nStudent's Current Code:\n${userCode ? userCode : '(No code written yet)'}`;

    // 1. Client-Side Puter.js AI Call
    try {
      const puter = (window as any).puter;
      if (puter && puter.ai && typeof puter.ai.chat === 'function') {
        const response = await puter.ai.chat(
          `${SOCRATIC_SYSTEM_PROMPT}\n\n${userPrompt}`,
          { model: 'claude-3-5-sonnet' }
        );

        let textOutput =
          typeof response === 'string'
            ? response
            : response?.message?.content || response?.text || '';

        // Strip any code blocks just in case model attempted to generate one
        textOutput = textOutput.replace(/```[\s\S]*?```/g, '').trim();

        if (textOutput) {
          setResponseContent(textOutput);
          setIsLoading(false);
          return;
        }
      }
    } catch (puterErr) {
      console.warn('Puter.js AI tutor unavailable, using deterministic Socratic fallback:', puterErr);
    }

    // 2. Offline / Fallback Socratic Guidance (strictly adheres to rule: NO direct SQL syntax)
    if (type === 'hint') {
      if (!userCode.trim()) {
        setResponseContent(
          'What table holds the data described in the challenge goal? Start by writing down which table you need to query in the FROM clause.'
        );
      } else if (context?.errorMessage) {
        setResponseContent(
          'Take a close look at how your column names are separated. Did you include all required commas, and ensure there is no extra comma before the table name?'
        );
      } else {
        setResponseContent(
          'Which specific attributes does the challenge ask you to display? Verify whether your current projection includes every requested field.'
        );
      }
    } else if (type === 'concept_breakdown') {
      setResponseContent(
        `${currentTopic.theory.summary} Remember that the database engine locates the target table first before filtering or selecting columns.`
      );
    } else {
      setResponseContent(
        'Start by writing the table identifier in the FROM clause, then list only the necessary attributes and column aliases in the projection.'
      );
    }

    setIsLoading(false);
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
              <h3 className="text-base font-bold text-white">Socratic AI SQL Tutor</h3>
              <p className="text-xs text-slate-400">Guiding you to the solution without giving away direct answers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
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
