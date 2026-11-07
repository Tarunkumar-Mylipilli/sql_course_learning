import React, { useState, useEffect } from 'react';
import { SQL_TOPICS } from './data/courseData';
import { Topic, TopicStep, CourseProgress } from './types';
import {
  loadProgress,
  saveProgress,
  getInitialProgress,
  loadAllTopics,
  saveAllTopics,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopicWorkflow } from './components/TopicWorkflow';
import { CourseRoadmap } from './components/CourseRoadmap';
import { NotesHub } from './components/NotesHub';
import { Interview50Hub } from './components/Interview50Hub';
import { AITutorModal } from './components/AITutorModal';
import { AddTopicModal } from './components/AddTopicModal';

export default function App() {
  // Load topics from storage (with core curriculum and user customizations)
  const [topics, setTopics] = useState<Topic[]>(() => {
    return loadAllTopics(SQL_TOPICS);
  });

  const [progress, setProgress] = useState<CourseProgress>(() => loadProgress(topics));
  const [activeView, setActiveView] = useState<'course' | 'roadmap' | 'notes' | 'interview50'>('course');
  const [currentTopicId, setCurrentTopicId] = useState<string>(
    progress.currentTopicId || topics[0]?.id || 'topic-1-select'
  );
  const [currentStep, setCurrentStep] = useState<TopicStep>('video');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [aiTutorContext, setAiTutorContext] = useState<{
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  } | undefined>(undefined);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Sync progress to localStorage on change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Filter topics if search query is active
  const filteredTopics = searchQuery.trim()
    ? topics.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  const currentTopic =
    (topics && topics.length > 0
      ? topics.find((t) => t.id === currentTopicId) || topics[0]
      : SQL_TOPICS[0]);

  const currentIndex = topics.findIndex((t) => t.id === currentTopic.id);
  const hasPreviousTopic = currentIndex > 0;
  const hasNextTopic = currentIndex < topics.length - 1;

  // Step 1: Mark Video as Watched
  const handleMarkVideoWatched = (topicId: string) => {
    setProgress((prev) => {
      const existing = prev.topics[topicId] || {
        videoWatched: false,
        theoryRead: false,
        quizPassed: false,
        quizScore: 0,
        codingCompleted: false,
        userSql: '',
      };

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            videoWatched: true,
          },
        },
      };
    });
  };

  // Step 2: Mark Theory as Read
  const handleMarkTheoryRead = (topicId: string) => {
    setProgress((prev) => {
      const existing = prev.topics[topicId];
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            theoryRead: true,
          },
        },
      };
    });
  };

  // Step 3: Record Quiz Result (Pass/Fail)
  const handleQuizSubmit = (topicId: string, score: number, passed: boolean) => {
    setProgress((prev) => {
      const existing = prev.topics[topicId];
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            quizScore: score,
            quizPassed: passed,
          },
        },
      };
    });
  };

  // Step 4: Record Coding Challenge Completion
  const handleCodingComplete = (topicId: string, sql: string) => {
    setProgress((prev) => {
      const existing = prev.topics[topicId];
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            codingCompleted: true,
            userSql: sql,
          },
        },
      };
    });
  };

  // Move to next topic in curriculum
  const handleProceedToNextTopic = () => {
    if (hasNextTopic) {
      const nextTopic = topics[currentIndex + 1];
      setCurrentTopicId(nextTopic.id);
      setCurrentStep('video');
      setProgress((prev) => ({
        ...prev,
        currentTopicId: nextTopic.id,
      }));
    } else {
      setActiveView('roadmap');
    }
  };

  // Move to previous topic
  const handlePreviousTopic = () => {
    if (hasPreviousTopic) {
      const prevTopic = topics[currentIndex - 1];
      setCurrentTopicId(prevTopic.id);
      setCurrentStep('video');
      setProgress((prev) => ({
        ...prev,
        currentTopicId: prevTopic.id,
      }));
    }
  };

  // Direct selection of topic
  const handleSelectTopic = (topic: Topic) => {
    setCurrentTopicId(topic.id);
    setActiveView('course');
    const tProg = progress.topics[topic.id];
    if (!tProg?.videoWatched) {
      setCurrentStep('video');
    } else if (!tProg?.theoryRead) {
      setCurrentStep('theory');
    } else if (!tProg?.quizPassed) {
      setCurrentStep('quiz');
    } else {
      setCurrentStep('coding');
    }
  };

  // Create or Update Topic (Full CRUD)
  const handleSaveTopic = (savedTopic: Topic) => {
    const existingIndex = topics.findIndex((t) => t.id === savedTopic.id);
    let updated: Topic[];

    if (existingIndex >= 0) {
      // Update existing topic
      updated = [...topics];
      updated[existingIndex] = savedTopic;
    } else {
      // Add new topic
      updated = [...topics, savedTopic];
    }

    setTopics(updated);
    saveAllTopics(updated);

    // Register in progress if not already present
    setProgress((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [savedTopic.id]: prev.topics[savedTopic.id] || {
          videoWatched: false,
          theoryRead: false,
          quizPassed: false,
          quizScore: 0,
          codingCompleted: false,
          userSql: '',
        },
      },
    }));

    setCurrentTopicId(savedTopic.id);
    setCurrentStep('video');
  };

  // Delete Topic (Full CRUD)
  const handleDeleteTopic = (topicId: string) => {
    const remaining = topics.filter((t) => t.id !== topicId);
    if (remaining.length === 0) {
      alert('You cannot delete all course topics.');
      return;
    }

    // Re-index orders
    const reindexed = remaining.map((t, idx) => ({
      ...t,
      order: idx + 1,
      title: `${idx + 1}. ${t.title.replace(/^\d+\.\s*/, '')}`,
    }));

    setTopics(reindexed);
    saveAllTopics(reindexed);

    if (currentTopicId === topicId) {
      setCurrentTopicId(reindexed[0].id);
      setCurrentStep('video');
    }
  };

  // Reset progress
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all course progress?')) {
      const fresh = getInitialProgress(topics);
      setProgress(fresh);
      saveProgress(fresh);
      setCurrentTopicId(topics[0].id);
      setCurrentStep('video');
    }
  };

  const handleOpenAITutorWithContext = (ctx: {
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  }) => {
    setAiTutorContext(ctx);
    setIsAITutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Navbar */}
      <Navbar
        topics={topics}
        progress={progress}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddTopic={() => {
          window.location.href = './admin.html';
        }}
        onResetProgress={handleResetProgress}
        onOpenAITutor={() => {
          setAiTutorContext(undefined);
          setIsAITutorOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Layout: Left Sidebar + Central Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Left Sidebar Rail */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenUpgradeModal={() =>
            alert('Pro status is active! You have full access to all 50 LeetCode interview challenges and custom module generation.')
          }
        />

        {/* Central Learning Canvas */}
        <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          {activeView === 'course' && currentTopic && (
            <TopicWorkflow
              topic={currentTopic}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              progress={progress}
              onMarkVideoWatched={handleMarkVideoWatched}
              onMarkTheoryRead={handleMarkTheoryRead}
              onQuizSubmit={handleQuizSubmit}
              onCodingComplete={handleCodingComplete}
              onProceedToNextTopic={handleProceedToNextTopic}
              onPreviousTopic={handlePreviousTopic}
              hasPreviousTopic={hasPreviousTopic}
              hasNextTopic={hasNextTopic}
              onOpenAITutorWithContext={handleOpenAITutorWithContext}
            />
          )}

          {activeView === 'roadmap' && (
            <CourseRoadmap
              topics={filteredTopics}
              progress={progress}
              onSelectTopic={handleSelectTopic}
              onOpenAddTopic={() => {
                window.location.href = './admin.html';
              }}
            />
          )}

          {activeView === 'interview50' && <Interview50Hub />}

          {activeView === 'notes' && <NotesHub />}
        </main>
      </div>

      {/* AI Tutor Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        currentTopic={currentTopic}
        context={aiTutorContext}
      />
    </div>
  );
}
