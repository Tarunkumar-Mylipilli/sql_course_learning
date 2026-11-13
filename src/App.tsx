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
import { AppShell } from './components/AppShell';
import { TopicWorkflow } from './components/TopicWorkflow';
import { CourseRoadmap } from './components/CourseRoadmap';
import { NotesHub } from './components/NotesHub';
import { Interview50Hub } from './components/Interview50Hub';
import { SqlPracticeArena } from './components/SqlPracticeArena';
import { AITutorModal } from './components/AITutorModal';
import { AddTopicModal } from './components/AddTopicModal';
import { StudentDashboard } from './components/StudentDashboard';
import { LoginModal } from './components/LoginModal';
import { getStoredUser, logoutUser, AuthUser } from './lib/auth';

const PreviewApp = React.lazy(() => import('./preview/PreviewApp'));

export default function App() {
  // Preview mode detection (public demo route outside auth gate)
  const [isPreview, setIsPreview] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hash === '#/preview' ||
        window.location.hash.startsWith('#/preview') ||
        window.location.pathname.endsWith('/preview') ||
        window.location.pathname.includes('/preview'))
    );
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsPreview(
        window.location.hash === '#/preview' ||
        window.location.hash.startsWith('#/preview') ||
        window.location.pathname.endsWith('/preview') ||
        window.location.pathname.includes('/preview')
      );
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());
  // Load topics from storage (with core curriculum and user customizations)
  const [topics, setTopics] = useState<Topic[]>(() => {
    return loadAllTopics(SQL_TOPICS);
  });

  const [progress, setProgress] = useState<CourseProgress>(() => loadProgress(topics));
  const [activeView, setActiveView] = useState<'dashboard' | 'course' | 'roadmap' | 'notes' | 'interview50' | 'practice'>('dashboard');
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

  // Step 1: Mark Video as Watched (with per-video tracking & module completion)
  const handleMarkVideoWatched = (topicId: string, videoId?: string) => {
    setProgress((prev) => {
      const topicObj = topics.find((t) => t.id === topicId);
      const totalVideos = topicObj?.subModules && topicObj.subModules.length > 0
        ? topicObj.subModules.length
        : [topicObj?.video, ...(topicObj?.alternativeVideos || []), ...(topicObj?.addonVideos || [])].filter(Boolean).length || 1;

      const existing = prev.topics[topicId] || {
        videoWatched: false,
        theoryRead: false,
        quizPassed: false,
        quizScore: 0,
        codingCompleted: false,
        userSql: '',
      };

      const currentWatched = existing.watchedVideos || [];
      const updatedWatched = videoId && !currentWatched.includes(videoId)
        ? [...currentWatched, videoId]
        : currentWatched;

      const isAllVideosWatched = updatedWatched.length >= totalVideos || !videoId;

      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            watchedVideos: updatedWatched,
            videoWatched: isAllVideosWatched || existing.videoWatched,
            codingCompleted: isAllVideosWatched ? true : existing.codingCompleted,
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

  // Toggle bookmark on a topic
  const handleToggleBookmark = (topicId: string) => {
    setProgress((prev) => {
      const existing = prev.topics[topicId] || {
        videoWatched: false,
        theoryRead: false,
        quizPassed: false,
        quizScore: 0,
        codingCompleted: false,
        userSql: '',
      };
      const isBookmarked = !existing.bookmarked;
      return {
        ...prev,
        topics: {
          ...prev.topics,
          [topicId]: {
            ...existing,
            bookmarked: isBookmarked,
          },
        },
      };
    });
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

  // If preview route requested, render standalone PreviewApp without auth gate
  if (isPreview) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <PreviewApp />
      </React.Suspense>
    );
  }

  // If not logged in, render the secure LoginModal gate
  if (!currentUser) {
    return <LoginModal onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <AppShell
      activeView={activeView}
      setActiveView={setActiveView}
      onOpenAITutor={() => {
        setAiTutorContext(undefined);
        setIsAITutorOpen(true);
      }}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentUser={currentUser}
      onLogout={() => {
        logoutUser();
        setCurrentUser(null);
      }}
      streakDays={progress.streakDays || 1}
    >
      {activeView === 'dashboard' && (
        <StudentDashboard
          topics={filteredTopics}
          progress={progress}
          onSelectTopic={handleSelectTopic}
          onStartDailyPractice={() => {
            const dayIdx = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
            const target = topics[dayIdx % Math.max(1, topics.length)] || topics[0];
            handleSelectTopic(target);
          }}
          onOpenRoadmap={() => setActiveView('roadmap')}
          onOpenInterview50={() => setActiveView('interview50')}
          onOpenNotes={() => setActiveView('notes')}
          onOpenPracticeArena={() => setActiveView('practice')}
        />
      )}

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
          onToggleBookmark={handleToggleBookmark}
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

      {activeView === 'practice' && (
        <SqlPracticeArena
          onOpenAITutorWithContext={(ctx) => {
            // Adapt to the currentTopic schema for the modal
            setAiTutorContext({
              userSql: ctx.userSql,
              errorMessage: ctx.errorMessage,
            });
            setIsAITutorOpen(true);
          }}
        />
      )}

      {activeView === 'notes' && <NotesHub />}

      {/* AI Tutor Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        currentTopic={currentTopic}
        context={aiTutorContext}
      />
    </AppShell>
  );
}
