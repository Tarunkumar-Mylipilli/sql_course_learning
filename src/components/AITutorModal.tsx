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

const PUTER_SYSTEM_PROMPT = `You are the AI SQL Tutor for a gamified "Zero to Pro" SQL learning platform.
Your objective is to mentor students through Step 4 coding challenges using the Socratic method.

CRITICAL RULES:
1. NEVER output the full or partial SQL solution query. Never write query clauses that the student can copy-paste to pass the challenge.
2. If the student asks for the answer (e.g., "Give me the query", "What is the code?"), politely decline and ask a guiding question to test their understanding.
3. Diagnose the student's syntax error or logical bug from their submitted query or question:
   - Missing commas: Remind them how multiple expressions in the SELECT clause must be separated.
   - Alias errors: Remind them how the AS keyword works, and when double quotes are necessary.
   - Column or Table mismatches: Prompt them to double-check column spelling against the schema context.
   - Trailing commas: Prompt them to inspect the word immediately before the FROM keyword.
4. Keep all responses brief (under 3 sentences). Be encouraging, clear, and focused on building their problem-solving muscle.`;

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

    // 1. Try Client-Side Free Puter.js AI first if available
    try {
      const puter = (window as any).puter;
      if (puter && puter.ai && typeof puter.ai.chat === 'function') {
        const userPrompt = `
Topic: ${currentTopic.title} (${currentTopic.level} level)
Challenge Goal: ${currentTopic.challenge.instructions}
Database Schema: ${currentTopic.challenge.schemaSql}
Student's Current SQL Query:
\`\`\`sql
${context?.userSql || currentTopic.challenge.starterSql}
\`\`\`
${context?.errorMessage ? `Execution Error: ${context.errorMessage}` : ''}
${context?.mismatchDetails ? `Mismatch Details: ${context.mismatchDetails}` : ''}

Student asks for: ${type === 'hint' ? 'A Socratic hint nudging them in the right direction without solving it' : type === 'concept_breakdown' ? 'A conceptual explanation of the SQL clause needed here' : 'Guidance on how to structure the query logic step-by-step'}
`;

        const response = await puter.ai.chat(
          `${PUTER_SYSTEM_PROMPT}\n\n${userPrompt}`,
          { model: 'claude-3-5-sonnet' }
        );

        const textOutput = typeof response === 'string' ? response : response?.message?.content || response?.text || '';
        if (textOutput) {
          setResponseContent(textOutput);
          setIsLoading(false);
          return;
        }
      }
    } catch (puterErr) {
      console.warn('Puter.js AI tutor unavailable, falling back to server/local tutor:', puterErr);
    }

    // 2. Server API fallback
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

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setResponseContent(data.content);
          setIsLoading(false);
          return;
        }
      }
    } catch (_) {}

    // 3. Built-in Deterministic Socratic Guidance Engine
    if (type === 'hint') {
      const sql = (context?.userSql || '').toUpperCase();
      let guidance = `💡 **AI Socratic Hint for ${currentTopic.title}**:\n\n`;

      if (context?.errorMessage) {
        guidance += `• **Error Diagnostic**: The database returned: \`${context.errorMessage}\`.\n`;
        if (context.errorMessage.toLowerCase().includes('syntax') && !sql.includes('FROM')) {
          guidance += `• Have you declared the source table using the \`FROM\` clause?\n`;
        } else if (sql.includes(', FROM') || sql.includes(',\nFROM')) {
          guidance += `• Watch out for a trailing comma right before the \`FROM\` keyword!\n`;
        } else {
          guidance += `• Double-check column spelling against the Schema Inspector tab.\n`;
        }
      } else if (context?.mismatchDetails) {
        guidance += `• **Output Check**: Your query executed, but the returned columns/rows do not match the expected specification.\n`;
        guidance += `• Verify you have aliased the column headers with the exact requested names using \`AS\`.\n`;
      } else {
        guidance += `• Inspect the table schema on the left. What columns does the challenge ask you to select?\n`;
        guidance += `• Remember that each projected expression in \`SELECT\` must be separated by a single comma.\n`;
      }
      setResponseContent(guidance);
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
        `🎯 **Step-by-Step Approach Guide**:\n\n` +
        `1. Start by identifying the source table: \`FROM <table_name>\`.\n` +
        `2. Write out only the specific columns needed in \`SELECT\`.\n` +
        `3. If an alias or calculation is requested, use arithmetic operators and \`AS <alias_name>\`.\n` +
        `4. Run the query with [Ctrl + Enter] to inspect your output preview.`
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
