import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  BookOpen,
  Video,
  HelpCircle,
  Code2,
  Trash2,
  CheckCircle,
  Save,
  Sparkles,
} from 'lucide-react';
import { Topic, QuizQuestion, CodingChallenge } from '../types';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTopic: (topic: Topic) => void;
  initialTopic?: Topic | null;
  nextOrder: number;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onSaveTopic,
  initialTopic,
  nextOrder,
}) => {
  // Mode: Editing existing topic vs Creating a new one
  const isEditing = Boolean(initialTopic);

  // Basic Details
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [estimatedMinutes, setEstimatedMinutes] = useState(20);
  const [overview, setOverview] = useState('');

  // Video Details
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=HXV3zeRR3h4');
  const [videoChannel, setVideoChannel] = useState('Alex The Analyst');
  const [videoDuration, setVideoDuration] = useState('15:00');
  const [videoSummary, setVideoSummary] = useState(
    'Master key syntax\nUnderstand query execution\nRetrieve data from tables'
  );

  // Theory Details
  const [theorySummary, setTheorySummary] = useState('');
  const [theorySyntax, setTheorySyntax] = useState('SELECT column_name FROM table_name;');

  // Active Tab inside modal: 'details' | 'quiz' | 'coding'
  const [activeTab, setActiveTab] = useState<'details' | 'quiz' | 'coding'>('details');

  // Dynamic Quiz Questions Bank
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-1`,
      question: 'Which SQL keyword is used to retrieve columns from a database table?',
      options: ['SELECT', 'FETCH', 'GET', 'EXTRACT'],
      correctIndex: 0,
      explanation: 'SELECT is the standard ANSI SQL keyword used to project columns from a table.',
    },
  ]);

  // Dynamic Coding Challenges Bank
  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>([
    {
      id: `ch-1`,
      title: 'Practice Challenge: Query Data',
      difficulty: 'Easy',
      instructions: 'Write a SQL query to retrieve all rows from the dataset.',
      schemaSql: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), active INT);\nINSERT INTO users VALUES (1, 'Alice', 1), (2, 'Bob', 0);`,
      tables: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INT', isPk: true },
            { name: 'name', type: 'VARCHAR(50)' },
            { name: 'active', type: 'INT' },
          ],
          sampleData: [
            { id: 1, name: 'Alice', active: 1 },
            { id: 2, name: 'Bob', active: 0 },
          ],
        },
      ],
      starterSql: '', // ALWAYS empty by default so answers are never revealed!
      solutionSql: 'SELECT * FROM users;',
      expectedColumns: ['id', 'name', 'active'],
      hints: ['Select all columns using asterisk (*) or specify the column names.'],
    },
  ]);

  // Populate state when opening or switching to edit mode
  useEffect(() => {
    if (initialTopic) {
      setTitle(initialTopic.title.replace(/^\d+\.\s*/, ''));
      setLevel(initialTopic.level);
      setEstimatedMinutes(initialTopic.estimatedMinutes || 20);
      setOverview(initialTopic.overview || '');

      setVideoTitle(initialTopic.video?.title || '');
      setVideoUrl(initialTopic.video?.embedUrl || '');
      setVideoChannel(initialTopic.video?.channel || 'Instructor');
      setVideoDuration(initialTopic.video?.duration || '15:00');
      setVideoSummary(initialTopic.video?.summaryPoints?.join('\n') || '');

      setTheorySummary(initialTopic.theory?.summary || '');
      setTheorySyntax(initialTopic.theory?.syntax || 'SELECT column_name FROM table_name;');

      if (initialTopic.quiz?.questions && initialTopic.quiz.questions.length > 0) {
        setQuizQuestions(initialTopic.quiz.questions);
      }

      const challenges = initialTopic.challenges || [initialTopic.challenge];
      if (challenges && challenges.length > 0) {
        // Enforce empty starterSql so no leaked answers
        setCodingChallenges(challenges.map((c) => ({ ...c, starterSql: '' })));
      }
    } else {
      // Reset to defaults for a new topic
      setTitle('');
      setLevel('Beginner');
      setEstimatedMinutes(20);
      setOverview('');
      setVideoTitle('');
      setVideoUrl('https://www.youtube.com/watch?v=HXV3zeRR3h4');
      setVideoChannel('Alex The Analyst');
      setVideoDuration('15:00');
      setVideoSummary('Master key syntax\nUnderstand query execution\nRetrieve data from tables');
      setTheorySummary('Core query concepts and practical applications.');
      setTheorySyntax('SELECT column_name FROM table_name;');
      setQuizQuestions([
        {
          id: `q-${Date.now()}-1`,
          question: 'Which SQL keyword is used to retrieve columns from a database table?',
          options: ['SELECT', 'FETCH', 'GET', 'EXTRACT'],
          correctIndex: 0,
          explanation: 'SELECT is the standard ANSI SQL keyword.',
        },
      ]);
      setCodingChallenges([
        {
          id: `ch-${Date.now()}-1`,
          title: 'Module Coding Challenge',
          difficulty: 'Easy',
          instructions: 'Write a SQL query to retrieve all rows from the dataset.',
          schemaSql: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(50), active INT);\nINSERT INTO users VALUES (1, 'Alice', 1), (2, 'Bob', 0);`,
          tables: [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'INT', isPk: true },
                { name: 'name', type: 'VARCHAR(50)' },
                { name: 'active', type: 'INT' },
              ],
              sampleData: [
                { id: 1, name: 'Alice', active: 1 },
                { id: 2, name: 'Bob', active: 0 },
              ],
            },
          ],
          starterSql: '', // Always empty!
          solutionSql: 'SELECT * FROM users;',
          expectedColumns: ['id', 'name', 'active'],
          hints: ['Use the SELECT statement to retrieve records.'],
        },
      ]);
    }
  }, [initialTopic, isOpen]);

  if (!isOpen) return null;

  // Handler to add a new Quiz Question
  const handleAddQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q-${Date.now()}-${quizQuestions.length + 1}`,
        question: 'New SQL Question: What will this query return?',
        options: ['Result A', 'Result B', 'Result C', 'Result D'],
        correctIndex: 0,
        explanation: 'Option A is correct according to SQL execution rules.',
      },
    ]);
  };

  // Handler to remove a Quiz Question
  const handleRemoveQuizQuestion = (idx: number) => {
    if (quizQuestions.length <= 1) {
      alert('A topic must have at least one quiz question.');
      return;
    }
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  // Handler to update a Quiz Question field
  const handleUpdateQuizQuestion = (idx: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...quizQuestions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuizQuestions(updated);
  };

  // Handler to update an option inside a Quiz Question
  const handleUpdateQuizOption = (qIdx: number, optIdx: number, text: string) => {
    const updated = [...quizQuestions];
    const newOptions = [...updated[qIdx].options];
    newOptions[optIdx] = text;
    updated[qIdx] = { ...updated[qIdx], options: newOptions };
    setQuizQuestions(updated);
  };

  // Handler to add a new Coding Challenge
  const handleAddCodingChallenge = () => {
    setCodingChallenges([
      ...codingChallenges,
      {
        id: `ch-${Date.now()}-${codingChallenges.length + 1}`,
        title: `Challenge ${codingChallenges.length + 1}: Query Data`,
        difficulty: 'Medium',
        instructions: 'Write a SQL query that retrieves the matching rows.',
        schemaSql: `CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(50), price INT);\nINSERT INTO products VALUES (1, 'Laptop', 1000), (2, 'Mouse', 25);`,
        tables: [
          {
            name: 'products',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'name', type: 'VARCHAR(50)' },
              { name: 'price', type: 'INT' },
            ],
            sampleData: [{ id: 1, name: 'Laptop', price: 1000 }],
          },
        ],
        starterSql: '', // ALWAYS empty!
        solutionSql: 'SELECT * FROM products;',
        expectedColumns: ['id', 'name', 'price'],
        hints: ['Specify the columns or apply filtering conditions.'],
      },
    ]);
  };

  // Handler to remove a Coding Challenge
  const handleRemoveCodingChallenge = (idx: number) => {
    if (codingChallenges.length <= 1) {
      alert('A topic must have at least one coding challenge.');
      return;
    }
    setCodingChallenges(codingChallenges.filter((_, i) => i !== idx));
  };

  // Handler to update a Coding Challenge field
  const handleUpdateCodingChallenge = (idx: number, field: keyof CodingChallenge, value: any) => {
    const updated = [...codingChallenges];
    updated[idx] = { ...updated[idx], [field]: value };
    // Safety check: ensure starterSql is always kept empty so it never leaks
    updated[idx].starterSql = '';
    setCodingChallenges(updated);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a Topic Title.');
      return;
    }

    // Convert youtube watch URL to embed URL if needed
    let sanitizedEmbed = videoUrl;
    if (sanitizedEmbed.includes('watch?v=')) {
      const vid = sanitizedEmbed.split('watch?v=')[1]?.split('&')[0];
      if (vid) sanitizedEmbed = `https://www.youtube-nocookie.com/embed/${vid}`;
    }

    const orderNum = initialTopic ? initialTopic.order : nextOrder;
    const topicId = initialTopic ? initialTopic.id : `custom-topic-${Date.now()}`;

    // Ensure ALL coding challenges have empty starterSql!
    const sanitizedChallenges = codingChallenges.map((ch) => ({
      ...ch,
      starterSql: '', // Crucial: Always empty workspace so students solve it themselves
    }));

    const savedTopic: Topic = {
      id: topicId,
      order: orderNum,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: `${orderNum}. ${title.replace(/^\d+\.\s*/, '')}`,
      level,
      estimatedMinutes,
      badge: initialTopic?.badge || 'Custom',
      overview: overview || 'Interactive SQL Module with Video, Theory, Quiz, and Coding Playground.',
      video: {
        title: videoTitle || `${title} Video Tutorial`,
        embedUrl: sanitizedEmbed,
        duration: videoDuration || '15:00',
        channel: videoChannel || 'Community',
        summaryPoints: videoSummary.split('\n').filter((s) => s.trim().length > 0),
      },
      theory: {
        title: `${title} Reference Guide`,
        summary: theorySummary || 'Core principles and standard query patterns.',
        syntax: theorySyntax,
        explanation: [
          'Master this SQL syntax and ensure clause ordering conforms to standard engine execution order.',
        ],
        keyRules: ['Verify schema columns before executing in production.'],
        commonMistakes: ['Typo in column name or missing delimiter.'],
        exampleQuery: theorySyntax,
        exampleExplanation: 'Standard SQL query execution.',
      },
      quiz: {
        passingScorePercent: 75,
        questions: quizQuestions,
      },
      challenge: sanitizedChallenges[0],
      challenges: sanitizedChallenges,
    };

    onSaveTopic(savedTopic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-canvas border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-canvas">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {isEditing ? `Edit Topic: ${initialTopic?.title}` : 'Create New Course Topic'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure module lectures, theory notes, randomized quiz bank, and coding challenges.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-canvas px-6">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Topic & Video Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'quiz'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>2. Quiz Bank ({quizQuestions.length} Questions)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coding')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'coding'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. Coding Sandbox ({codingChallenges.length} Challenges)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC DETAILS & VIDEO */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Window Functions: ROW_NUMBER & RANK"
                    className="w-full bg-canvas border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-canvas border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Overview Summary</label>
                <textarea
                  rows={2}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Short description of what the student will learn..."
                  className="w-full bg-canvas border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Video Configuration */}
              <div className="bg-canvas border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Video className="w-4 h-4" />
                  <span>Curated Lecture Video</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">YouTube URL (Watch or Embed)</label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Channel / Instructor Name</label>
                    <input
                      type="text"
                      value={videoChannel}
                      onChange={(e) => setVideoChannel(e.target.value)}
                      placeholder="e.g. Alex The Analyst"
                      className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Key Takeaway Bullet Points (One per line)</label>
                  <textarea
                    rows={3}
                    value={videoSummary}
                    onChange={(e) => setVideoSummary(e.target.value)}
                    placeholder="Master syntax\nUnderstand query execution\nRetrieve data"
                    className="w-full bg-canvas border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Theory Reference */}
              <div className="bg-canvas border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <BookOpen className="w-4 h-4" />
                  <span>Theory & Syntax Quick Reference</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Core SQL Syntax Template</label>
                  <input
                    type="text"
                    value={theorySyntax}
                    onChange={(e) => setTheorySyntax(e.target.value)}
                    placeholder="SELECT column_name FROM table_name;"
                    className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DYNAMIC QUIZ BANK */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Quiz Questions Bank</h3>
                  <p className="text-xs text-slate-400">
                    Add as many questions as you like. Students must score &ge; 75% to unlock the coding playground.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuizQuestion}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="bg-canvas border border-slate-800 rounded-2xl p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">
                        Question #{qIdx + 1}
                      </span>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuizQuestion(qIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Question Text</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuizQuestion(qIdx, 'question', e.target.value)}
                        className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* 4 Multiple Choice Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl border ${
                            q.correctIndex === optIdx
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-canvas border-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-opt-${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => handleUpdateQuizQuestion(qIdx, 'correctIndex', optIdx)}
                            className="text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-slate-400">
                            {String.fromCharCode(65 + optIdx)}:
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-200 outline-none"
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Explanation for Correct Answer</label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuizQuestion(qIdx, 'explanation', e.target.value)}
                        className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC CODING CHALLENGES */}
          {activeTab === 'coding' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Coding Playground Challenges</h3>
                  <p className="text-xs text-slate-400">
                    SQL workspace starts empty by default. The solution query is verified silently behind the scenes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCodingChallenge}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Challenge</span>
                </button>
              </div>

              <div className="space-y-4">
                {codingChallenges.map((ch, chIdx) => (
                  <div
                    key={ch.id || chIdx}
                    className="bg-canvas border border-slate-800 rounded-2xl p-4 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">
                        Challenge #{chIdx + 1}
                      </span>
                      {codingChallenges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCodingChallenge(chIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition cursor-pointer"
                          title="Delete Challenge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] text-slate-400">Challenge Title</label>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => handleUpdateCodingChallenge(chIdx, 'title', e.target.value)}
                          className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400">Difficulty</label>
                        <select
                          value={ch.difficulty}
                          onChange={(e) => handleUpdateCodingChallenge(chIdx, 'difficulty', e.target.value)}
                          className="w-full bg-canvas border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Challenge Instructions / Task Description</label>
                      <textarea
                        rows={2}
                        value={ch.instructions}
                        onChange={(e) => handleUpdateCodingChallenge(chIdx, 'instructions', e.target.value)}
                        className="w-full bg-canvas border border-slate-800 rounded-xl p-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Schema SQL (CREATE TABLE & INSERT Data)</label>
                      <textarea
                        rows={3}
                        value={ch.schemaSql}
                        onChange={(e) => handleUpdateCodingChallenge(chIdx, 'schemaSql', e.target.value)}
                        className="w-full bg-canvas border border-slate-800 rounded-xl p-2 text-xs text-sky-200 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-amber-400 font-bold">
                          Solution SQL (Checked in background only - Never shown to student)
                        </label>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ✓ Workspace starts empty
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={ch.solutionSql}
                        onChange={(e) => handleUpdateCodingChallenge(chIdx, 'solutionSql', e.target.value)}
                        className="w-full bg-canvas border border-amber-500/30 rounded-xl p-2 text-xs text-amber-300 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Course Module'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
