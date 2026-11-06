import React, { useState } from 'react';
import { X, Plus, BookOpen, Video, HelpCircle, Code2, Sparkles } from 'lucide-react';
import { Topic } from '../types';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (topic: Topic) => void;
  nextOrder: number;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
  nextOrder,
}) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [overview, setOverview] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube-nocookie.com/embed/HXV3zeRR3h4');
  const [videoChannel, setVideoChannel] = useState('SQL Tutor');
  const [theorySummary, setTheorySummary] = useState('');
  const [theorySyntax, setTheorySyntax] = useState('SELECT * FROM table_name;');
  const [quizQuestion, setQuizQuestion] = useState('What does this query do?');
  const [quizOptions, setQuizOptions] = useState(['Option A', 'Option B', 'Option C', 'Option D']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [challengeTitle, setChallengeTitle] = useState('Custom Challenge');
  const [challengeInstructions, setChallengeInstructions] = useState('Write a query to fetch the requested records.');
  const [challengeSchema, setChallengeSchema] = useState(
    'CREATE TABLE custom_data (id INT PRIMARY KEY, name VARCHAR(50), value INT);\nINSERT INTO custom_data VALUES (1, "Sample", 100);'
  );
  const [challengeStarter, setChallengeStarter] = useState('SELECT * FROM custom_data;');
  const [challengeSolution, setChallengeSolution] = useState('SELECT * FROM custom_data;');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Convert youtube watch URL to embed URL if needed
    let sanitizedEmbed = videoUrl;
    if (sanitizedEmbed.includes('watch?v=')) {
      const vid = sanitizedEmbed.split('watch?v=')[1]?.split('&')[0];
      if (vid) sanitizedEmbed = `https://www.youtube-nocookie.com/embed/${vid}`;
    }

    const newTopic: Topic = {
      id: `custom-topic-${Date.now()}`,
      order: nextOrder,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: `${nextOrder}. ${title}`,
      level,
      estimatedMinutes: 20,
      badge: 'Custom',
      overview: overview || 'Custom module created by student or instructor.',
      video: {
        title: `${title} Video Tutorial`,
        embedUrl: sanitizedEmbed,
        duration: '10:00',
        channel: videoChannel || 'Community',
        summaryPoints: [
          'Foundational overview of the concept',
          'Live database query walkthrough',
          'Practical application and edge cases',
        ],
      },
      theory: {
        title: `${title} Reference Guide`,
        summary: theorySummary || 'Core principles and standard query patterns.',
        syntax: theorySyntax,
        explanation: [
          'This topic extends your SQL skill set with specialized query patterns.',
          'Review the syntax and ensure clause ordering follows relational database processing rules.',
        ],
        keyRules: [
          'Verify table and column references before running in production.',
          'Always test on sample data.',
        ],
        commonMistakes: [
          'Typo in column name or missing parentheses.',
          'Forgetting required clause terminator.',
        ],
        exampleQuery: theorySyntax,
        exampleExplanation: 'Standard usage in production environments.',
      },
      quiz: {
        passingScorePercent: 75,
        questions: [
          {
            id: `cq-${Date.now()}-1`,
            question: quizQuestion,
            options: quizOptions,
            correctIndex: correctOptionIdx,
            explanation: `Option ${String.fromCharCode(65 + correctOptionIdx)} is the correct answer according to standard SQL specifications.`,
          },
        ],
      },
      challenge: {
        id: `c-custom-${Date.now()}`,
        title: challengeTitle,
        difficulty: level === 'Advanced' ? 'Hard' : level === 'Intermediate' ? 'Medium' : 'Easy',
        instructions: challengeInstructions,
        schemaSql: challengeSchema,
        tables: [
          {
            name: 'custom_data',
            description: 'Custom learning dataset',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'name', type: 'VARCHAR(50)' },
              { name: 'value', type: 'INT' },
            ],
            sampleData: [{ id: 1, name: 'Sample', value: 100 }],
          },
        ],
        starterSql: challengeStarter,
        solutionSql: challengeSolution,
        hints: ['Review the target table in the Tables tab.', 'Check your SELECT and WHERE clauses.'],
      },
    };

    onAddTopic(newTopic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New SQL Topic Module</h3>
              <p className="text-xs text-slate-400">Configure Video, Theory, Quiz, and Coding Challenge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Topic Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Regular Expressions in SQL"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Overview Description</label>
            <input
              type="text"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Brief summary of what this topic teaches..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
            />
          </div>

          {/* Step 1: Video Config */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="font-bold text-sky-400 flex items-center gap-1.5 text-xs">
              <Video className="w-3.5 h-3.5" /> Step 1: Video Tutorial Configuration
            </span>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">YouTube URL or Embed URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Channel / Creator Name</label>
                <input
                  type="text"
                  value={videoChannel}
                  onChange={(e) => setVideoChannel(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Theory & Syntax */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="font-bold text-indigo-400 flex items-center gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" /> Step 2: Website Theory & Syntax Reference
            </span>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Theory Summary</label>
              <input
                type="text"
                value={theorySummary}
                onChange={(e) => setTheorySummary(e.target.value)}
                placeholder="Core definition and when to use this SQL clause..."
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Syntax Template</label>
              <textarea
                rows={2}
                value={theorySyntax}
                onChange={(e) => setTheorySyntax(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Step 3: Quiz */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-3.5 h-3.5" /> Step 3: Knowledge Quiz Question
            </span>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Question Prompt</label>
              <input
                type="text"
                value={quizQuestion}
                onChange={(e) => setQuizQuestion(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quizOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={correctOptionIdx === i}
                    onChange={() => setCorrectOptionIdx(i)}
                    className="accent-amber-500"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...quizOptions];
                      updated[i] = e.target.value;
                      setQuizOptions(updated);
                    }}
                    className="flex-1 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Coding Challenge */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
              <Code2 className="w-3.5 h-3.5" /> Step 4: SQL Coding Challenge & Solution
            </span>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Challenge Instructions</label>
              <input
                type="text"
                value={challengeInstructions}
                onChange={(e) => setChallengeInstructions(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Starter Query</label>
                <textarea
                  rows={2}
                  value={challengeStarter}
                  onChange={(e) => setChallengeStarter(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Solution Benchmark Query</label>
                <textarea
                  rows={2}
                  value={challengeSolution}
                  onChange={(e) => setChallengeSolution(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-md shadow-sky-500/20 cursor-pointer"
            >
              Add Topic to Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
