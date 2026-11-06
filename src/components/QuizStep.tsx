import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Lock,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { generateLocalQuizQuestions } from '../lib/aiExerciseGenerator';

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
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(isPassed);
  const [scorePercent, setScorePercent] = useState<number>(savedScore || 0);

  // Sync questions when prop changes
  useEffect(() => {
    setActiveQuestions(questions);
    setSelectedAnswers({});
    setSubmitted(isPassed);
    setScorePercent(savedScore || 0);
  }, [questions, isPassed, savedScore]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted && isPassed) return; // Locked if already passed
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const allAnswered = activeQuestions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmit = () => {
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedPercent = Math.round((correctCount / activeQuestions.length) * 100);
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

  const handleGenerateFreshQuiz = () => {
    const fresh = generateLocalQuizQuestions('topic');
    setActiveQuestions(fresh);
    setSelectedAnswers({});
    setSubmitted(false);
    setScorePercent(0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleGenerateFreshQuiz}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Generate a brand new set of AI quiz questions"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>✨ Generate Fresh AI Quiz</span>
          </button>

          {submitted && (
            <div
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 ${
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
              <div>
                <h3 className="text-base font-bold text-emerald-300">
                  🎉 Congratulations! Mastery Verified!
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1">
                  You scored {scorePercent}%. You have unlocked Step 4: Real SQL Coding Sandbox!
                </p>
              </div>
              <button
                onClick={onProceedToCoding}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Step 4: SQL Coding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-rose-300">
                  Mastery Check Failed ({scorePercent}%)
                </h3>
                <p className="text-xs text-rose-200/80 mt-1">
                  You need at least {passingScorePercent}% to pass and unlock the SQL Coding Sandbox. Review the explanations below and try again.
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {activeQuestions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/10 border-emerald-500/30'
                    : 'bg-rose-950/10 border-rose-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-sky-400">
                  Question {qIndex + 1} of {activeQuestions.length}
                </span>
                {submitted && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-sm font-semibold text-white mb-2 leading-relaxed">
                {q.question}
              </h3>

              {/* Optional Code Snippet */}
              {q.codeSnippet && (
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 mb-3 overflow-x-auto">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-2 mt-3">
                {q.options.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isTheCorrectOption = optIndex === q.correctIndex;

                  let optionStyle =
                    'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60';

                  if (submitted) {
                    if (isTheCorrectOption) {
                      optionStyle =
                        'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold';
                    } else if (isSelected && !isTheCorrectOption) {
                      optionStyle =
                        'bg-rose-500/20 border-rose-400 text-rose-200 line-through';
                    } else {
                      optionStyle = 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-sky-500/20 border-sky-400 text-sky-200 font-medium shadow-sm';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={submitted && isPassed}
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected
                              ? 'border-sky-400 bg-sky-500 text-slate-950'
                              : 'border-slate-700 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {submitted && isTheCorrectOption && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !isTheCorrectOption && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation when submitted */}
              {submitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-sky-400 block mb-0.5">Explanation:</span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!submitted && (
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {allAnswered
              ? 'All questions answered. Click to evaluate score.'
              : `Please answer all ${activeQuestions.length} questions before submitting.`}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
              allAnswered
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>Submit Quiz for Verification</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
