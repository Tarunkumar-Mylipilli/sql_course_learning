import React, { useState, useEffect } from 'react';
import {
  Database,
  LayoutDashboard,
  BookOpen,
  Film,
  FileText,
  HelpCircle,
  Code2,
  Users,
  Search,
  Eye,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Link as LinkIcon,
  MoreVertical,
  Bold,
  Italic,
  List,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Save,
  ArrowLeft,
  Table as TableIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Topic, TopicVideo, QuizQuestion, CodingChallenge } from '../types';

interface AdminStudioProps {
  topics: Topic[];
  onSaveTopics: (updatedTopics: Topic[]) => void;
  onClose: () => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  topics,
  onSaveTopics,
  onClose,
}) => {
  // Active selected topic for editing
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [activeNavMenu, setActiveNavMenu] = useState<string>('curriculum');
  const [activeTab, setActiveTab] = useState<'videos' | 'theory' | 'quiz' | 'sql'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Local working copy of topics to allow draft edits before publishing
  const [localTopics, setLocalTopics] = useState<Topic[]>(topics);

  useEffect(() => {
    setLocalTopics(topics);
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics]);

  const currentTopic =
    localTopics.find((t) => t.id === selectedTopicId) || localTopics[0] || topics[0];

  // Helper to update current topic fields
  const updateCurrentTopic = (updater: (prev: Topic) => Topic) => {
    setLocalTopics((prev) =>
      prev.map((t) => (t.id === currentTopic.id ? updater({ ...t }) : t))
    );
  };

  // Publish / Save all changes
  const handlePublishChanges = () => {
    onSaveTopics(localTopics);
    setSaveToast(true);
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.2 } });
    } catch (_) {}
    setTimeout(() => setSaveToast(false), 3000);
  };

  // JSON Export
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localTopics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sqlmastery_course_curriculum_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalTopics(parsed);
          onSaveTopics(parsed);
          alert(`Successfully imported ${parsed.length} course modules!`);
        } else {
          alert('Invalid curriculum JSON file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // --- Multi-Instructor Video Management ---
  const allCurrentVideos: TopicVideo[] = [
    currentTopic.video,
    ...(currentTopic.alternativeVideos || []),
    ...(currentTopic.addonVideos || []),
  ].filter(Boolean);

  const handleUpdateInstructorVideo = (index: number, updatedFields: Partial<TopicVideo>) => {
    updateCurrentTopic((topic) => {
      if (index === 0) {
        return {
          ...topic,
          video: { ...topic.video, ...updatedFields },
        };
      }
      const altLen = topic.alternativeVideos?.length || 0;
      if (index <= altLen) {
        const newAlt = [...(topic.alternativeVideos || [])];
        newAlt[index - 1] = { ...newAlt[index - 1], ...updatedFields };
        return { ...topic, alternativeVideos: newAlt };
      }
      const addonIdx = index - 1 - altLen;
      const newAddon = [...(topic.addonVideos || [])];
      newAddon[addonIdx] = { ...newAddon[addonIdx], ...updatedFields };
      return { ...topic, addonVideos: newAddon };
    });
  };

  const handleAddInstructorVideo = () => {
    const newVid: TopicVideo = {
      title: `${currentTopic.title} Alternative Guide`,
      embedUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4',
      duration: '15:00',
      channel: 'Guest Instructor',
      language: 'English',
      summaryPoints: ['Query foundations', 'Syntax walkthrough', 'Practice exercises'],
    };
    updateCurrentTopic((topic) => ({
      ...topic,
      alternativeVideos: [...(topic.alternativeVideos || []), newVid],
    }));
  };

  // --- Quiz Management ---
  const quizList: QuizQuestion[] = currentTopic.quiz?.questions || [];

  const handleAddQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}-${quizList.length + 1}`,
      question: 'New Question: What is the primary purpose of this query?',
      options: ['Option A: Filter data', 'Option B: Sort data', 'Option C: Join tables', 'Option D: Aggregate values'],
      correctIndex: 0,
      explanation: 'Option A is the correct answer according to standard SQL specifications.',
    };
    updateCurrentTopic((topic) => ({
      ...topic,
      quiz: {
        ...topic.quiz,
        questions: [...(topic.quiz?.questions || []), newQ],
      },
    }));
  };

  const handleUpdateQuizQuestion = (qIdx: number, fields: Partial<QuizQuestion>) => {
    updateCurrentTopic((topic) => {
      const questions = [...(topic.quiz?.questions || [])];
      questions[qIdx] = { ...questions[qIdx], ...fields };
      return {
        ...topic,
        quiz: { ...topic.quiz, questions },
      };
    });
  };

  const handleUpdateQuizOption = (qIdx: number, optIdx: number, val: string) => {
    updateCurrentTopic((topic) => {
      const questions = [...(topic.quiz?.questions || [])];
      const opts = [...questions[qIdx].options];
      opts[optIdx] = val;
      questions[qIdx] = { ...questions[qIdx], options: opts };
      return {
        ...topic,
        quiz: { ...topic.quiz, questions },
      };
    });
  };

  // --- SQL Challenge Management ---
  const currentChallenge: CodingChallenge = currentTopic.challenge || {
    id: `ch-${Date.now()}`,
    title: 'SQL Challenge',
    difficulty: 'Easy',
    instructions: 'Write a SQL query to retrieve data.',
    schemaSql: 'CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50));\nINSERT INTO students VALUES (1, "Alice");',
    tables: [],
    starterSql: '',
    solutionSql: 'SELECT * FROM students;',
    hints: ['Use SELECT * FROM students;'],
  };

  const handleUpdateChallenge = (fields: Partial<CodingChallenge>) => {
    updateCurrentTopic((topic) => {
      const updatedChallenge = {
        ...(topic.challenge || currentChallenge),
        ...fields,
        starterSql: '', // Always keep starterSql empty
      };
      return {
        ...topic,
        challenge: updatedChallenge,
        challenges: [updatedChallenge],
      };
    });
  };

  // Instructor photos lookup
  const getInstructorAvatar = (channel: string, idx: number) => {
    const ch = channel.toLowerCase();
    if (ch.includes('alex')) {
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
    }
    if (ch.includes('mosh')) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';
    }
    if (ch.includes('codebasics') || ch.includes('dhaval')) {
      return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80';
    }
    if (ch.includes('telugu') || ch.includes('vamsi')) {
      return 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80';
    }
    return [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    ][idx % 4];
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080B11] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Save Success Toast */}
      {saveToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-bounce text-xs">
          <CheckCircle className="w-4 h-4" />
          <span>Curriculum Changes Successfully Published!</span>
        </div>
      )}

      {/* Main Container: Left Sidebar + Center Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Supabase / Linear dark style) */}
        <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            {/* Sidebar Brand Header */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.3)]">
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">SQLMastery</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-950/90 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveNavMenu('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'dashboard'
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveNavMenu('curriculum')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'curriculum'
                    ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Curriculum & Modules</span>
              </button>

              <button
                onClick={() => {
                  setActiveNavMenu('videos');
                  setActiveTab('videos');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'videos'
                    ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Film className="w-4 h-4 text-slate-400" />
                <span>Video Lectures</span>
              </button>

              <button
                onClick={() => {
                  setActiveNavMenu('notes');
                  setActiveTab('theory');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'notes'
                    ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Notes & Theory</span>
              </button>

              <button
                onClick={() => {
                  setActiveNavMenu('quiz');
                  setActiveTab('quiz');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'quiz'
                    ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Quiz Builder</span>
              </button>

              <button
                onClick={() => {
                  setActiveNavMenu('sql');
                  setActiveTab('sql');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'sql'
                    ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Code2 className="w-4 h-4 text-slate-400" />
                <span>SQL Coding Challenges</span>
              </button>

              <button
                onClick={() => setActiveNavMenu('students')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeNavMenu === 'students'
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Students & Analytics</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Bottom: JSON Actions & Back to Student View */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1 cursor-pointer transition"
                title="Export entire curriculum to course_data.json"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Export</span>
              </button>

              <label className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1 cursor-pointer transition">
                <Upload className="w-3 h-3 text-amber-400" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Course App</span>
            </button>
          </div>
        </aside>

        {/* RIGHT AREA: Top Bar + Studio Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Command Bar */}
          <header className="h-16 bg-[#070b14] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 shrink-0">
            {/* Breadcrumbs & Module Selector */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="text-slate-400">Curriculum</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-slate-300 font-semibold">Module {currentTopic.order}: {currentTopic.level}</span>
              <span className="text-slate-600">&gt;</span>
              {/* Dropdown to switch active editing topic */}
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="bg-[#0b1220] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold outline-none cursor-pointer"
              >
                {localTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.order}. {t.title.replace(/^\d+\.\s*/, '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Tools: Live Search, Preview as Student, Publish Changes */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-44">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full bg-[#0b1220] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Preview as Student */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview as Student</span>
              </button>

              {/* Publish Changes Button */}
              <button
                onClick={handlePublishChanges}
                className="px-5 py-1.5 rounded-xl bg-[#00D2FF] hover:bg-[#38bdf8] text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(0,210,255,0.45)] transition cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Publish Changes</span>
              </button>
            </div>
          </header>

          {/* 4-Tab Content Builder Header */}
          <div className="px-6 pt-3 pb-1 border-b border-slate-800/80 bg-[#060a12] flex items-center gap-2">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer relative ${
                activeTab === 'videos'
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>1. Video Lessons</span>
            </button>

            <button
              onClick={() => setActiveTab('theory')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer relative ${
                activeTab === 'theory'
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2. Theory & Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer relative ${
                activeTab === 'quiz'
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>3. Quiz Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer relative ${
                activeTab === 'sql'
                  ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>4. SQL Challenge Sandbox</span>
            </button>
          </div>

          {/* Studio Canvas (2-Column Split matching the mockup) */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#080B11]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
              {/* LEFT COLUMN: Video Lesson Links & Multi-Instructor Setup (6 cols) */}
              <div className="lg:col-span-6 bg-[#0D111E] border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    Video Lesson Links & Multi-Instructor Setup
                  </h2>
                  <button className="text-slate-400 hover:text-white p-1 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* List of Instructor Cards */}
                <div className="space-y-3">
                  {allCurrentVideos.map((vid, idx) => {
                    const avatarUrl = getInstructorAvatar(vid.channel, idx);

                    return (
                      <div
                        key={idx}
                        className="bg-[#070b14] border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5 hover:border-slate-700 transition"
                      >
                        {/* Instructor Photo / Thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img
                            src={avatarUrl}
                            alt={vid.channel}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-slate-950/80 text-white px-1 rounded">
                            {vid.duration || '9:15'}
                          </span>
                        </div>

                        {/* Middle: Name & URL Input */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 truncate">
                              {vid.channel || `Instructor ${idx + 1}`}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                              <span>Status</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                            </div>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={vid.embedUrl}
                              onChange={(e) =>
                                handleUpdateInstructorVideo(idx, { embedUrl: e.target.value })
                              }
                              placeholder="Video URL/Link"
                              className="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-sky-200 font-mono pr-7 focus:outline-none focus:border-cyan-500/50"
                            />
                            <LinkIcon className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* Card Options */}
                        <button className="text-slate-500 hover:text-white p-1 rounded">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* + Add Video URL Button */}
                <button
                  type="button"
                  onClick={handleAddInstructorVideo}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#070b14]/50 hover:bg-[#070b14] text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Video URL</span>
                </button>
              </div>

              {/* RIGHT COLUMN: SQL Challenge & Quiz Creator (6 cols) */}
              <div className="lg:col-span-6 bg-[#0D111E] border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    SQL Challenge & Quiz Creator
                  </h2>
                  <button className="text-slate-400 hover:text-white p-1 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Section A: Challenge Sandbox Editor */}
                <div className="bg-[#070b14] border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Challenge Sandbox Editor</span>
                    <button className="text-slate-500 hover:text-white">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Markdown Toolbar */}
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-slate-400 text-xs">
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 hover:text-white hover:bg-slate-800 rounded">
                      <TableIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task Instructions Markdown Input */}
                  <textarea
                    rows={4}
                    value={currentChallenge.instructions}
                    onChange={(e) => handleUpdateChallenge({ instructions: e.target.value })}
                    placeholder="# Challenge Instructions\nWrite a SQL query that retrieves..."
                    className="w-full bg-[#040810] border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-sky-200 focus:outline-none focus:border-cyan-500/50"
                  />

                  {/* Split Row: Code Schema Input + Expected Query Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Code Schema Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Code Schema Input</label>
                      <textarea
                        rows={3}
                        value={currentChallenge.schemaSql}
                        onChange={(e) => handleUpdateChallenge({ schemaSql: e.target.value })}
                        placeholder="CREATE TABLE students (id INT, name VARCHAR(50));"
                        className="w-full bg-[#040810] border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-cyan-300"
                      />
                    </div>

                    {/* Expected Query Box */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-amber-400">Expected Query Box</label>
                      <textarea
                        rows={3}
                        value={currentChallenge.solutionSql}
                        onChange={(e) => handleUpdateChallenge({ solutionSql: e.target.value })}
                        placeholder="SELECT * FROM students;"
                        className="w-full bg-[#040810] border border-cyan-500/30 rounded-lg p-2 font-mono text-[11px] text-emerald-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Question Creator */}
                <div className="bg-[#070b14] border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Question Creator</span>
                    <button
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {quizList.length > 0 && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Quiz Question</label>
                        <input
                          type="text"
                          value={quizList[0].question}
                          onChange={(e) => handleUpdateQuizQuestion(0, { question: e.target.value })}
                          className="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-semibold text-slate-400">Select Options</label>
                        {quizList[0].options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs ${
                              quizList[0].correctIndex === optIdx
                                ? 'bg-cyan-950/30 border-cyan-500/40'
                                : 'bg-[#040810] border-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="studio-correct-opt"
                              checked={quizList[0].correctIndex === optIdx}
                              onChange={() => handleUpdateQuizQuestion(0, { correctIndex: optIdx })}
                              className="text-cyan-400 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateQuizOption(0, optIdx, e.target.value)}
                              className="w-full bg-transparent text-xs text-slate-200 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview as Student Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#090f1d] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#070c18]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">
                  Student View Preview: {currentTopic.title}
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-sky-300">Curated Video Lectures</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {allCurrentVideos.map((v, i) => (
                    <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="font-bold text-white">{v.channel}</div>
                      <div className="text-[11px] text-slate-400 truncate">{v.embedUrl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-sky-300">Quiz Preview</h3>
                {quizList.map((q, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <span className="font-semibold text-white">Q{i + 1}: {q.question}</span>
                    <div className="pl-4 text-slate-400">Correct: Option {String.fromCharCode(65 + q.correctIndex)}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-sky-300">SQL Challenge</h3>
                <div className="text-xs text-slate-300">{currentChallenge.instructions}</div>
                <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded">
                  {currentChallenge.solutionSql}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
