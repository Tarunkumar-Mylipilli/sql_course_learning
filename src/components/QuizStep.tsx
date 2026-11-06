import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Lock, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface QuizStepProps {
  questions: QuizQuestion[];
  passingScorePercent: number;
  isPassed: boolean;
  savedScore: number;
  onQuizSubmit: (scorePercent: number, passed: boolean) => void;
  onProceedToCoding: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({
  questions,
  passingScorePercent,
  isPassed,
  savedScore,
  onQuizSubmit,
  onProceedToCoding,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(isPassed);
  const [scorePercent, setScorePercent] = useState<number>(savedScore || 0);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted && isPassed) return; // Locked if already passed
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedPercent = Math.round((correctCount / questions.length) * 100);
    const passed = calculatedPercent >= passingScorePercent;

    setScorePercent(calculatedPercent);
    setSubmitted(true);
    onQuizSubmit(calculatedPercent, passed);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Step 3: Knowledge Verification Quiz
            </span>
            <span className="text-xs text-slate-400">
              Pass mark: {passingScorePercent}%
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Concept Mastery Check</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            You must pass this quiz with at least {passingScorePercent}% to unlock the hands-on SQL Coding Playground.
          </p>
        </div>

        {submitted && (
          <div
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 ${
              scorePercent >= passingScorePercent
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {scorePercent >= passingScorePercent ? (
              <>
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Passed: {scorePercent}% Score</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Score: {scorePercent}% (Need {passingScorePercent}%)</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quiz Outcome Banner */}
      {submitted && (
        <div
          className={`p-5 rounded-2xl border ${
            scorePercent >= passingScorePercent
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/20 border-rose-500/30'
          }`}
        >
          {scorePercent >= passingScorePercent ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-300">Congratulations! Quiz Passed!</h3>
                  <p className="text-xs text-slate-300">
                    You have unlocked Step 4: Hands-on SQL Coding Challenge.
                  </p>
                </div>
              </div>
              <button
                onClick={onProceedToCoding}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                <span>Enter Step 4: SQL Coding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-300">Passing score not reached</h3>
                  <p className="text-xs text-slate-300">
                    Review the explanations below and give it another try to unlock coding.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition ${
                submitted
                  ? isCorrect
                    ? 'bg-slate-900/60 border-emerald-500/30'
                    : 'bg-slate-900/60 border-rose-500/30'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-white flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{q.question}</span>
                </h3>
                {submitted && (
                  <span className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </span>
                )}
              </div>

              {q.codeSnippet && (
                <pre className="mb-3 p-3 bg-slate-950 rounded-xl text-xs font-mono text-sky-300 border border-slate-800/80 overflow-x-auto">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let optionStyles = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyles = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                    } else {
                      optionStyles = 'bg-slate-950/40 border-slate-800/40 text-slate-500';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-sky-500/10 border-sky-500/50 text-sky-200 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted && isPassed}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-3 transition cursor-pointer ${optionStyles}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                          isSelected
                            ? 'border-sky-400 bg-sky-500 text-slate-950 font-bold'
                            : 'border-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when submitted */}
              {submitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-sky-400">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Retry Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-400">
          {!submitted
            ? 'Answer all questions to submit your quiz attempt.'
            : scorePercent >= passingScorePercent
            ? 'Great job! Coding challenge is unlocked.'
            : 'You need at least 75% to unlock the coding challenge.'}
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md transition cursor-pointer ${
                allAnswered
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Quiz Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : scorePercent >= passingScorePercent ? (
            <button
              onClick={onProceedToCoding}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <span>Unlock Step 4: SQL Coding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
