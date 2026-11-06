import React, { useState, useEffect } from 'react';
import { SQL_TOPICS } from './data/courseData';
import { Topic, TopicStep, CourseProgress } from './types';
import {
  loadProgress,
  saveProgress,
  getInitialProgress,
  loadCustomTopics,
  saveCustomTopics,
  isTopicUnlocked,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { TopicWorkflow } from './components/TopicWorkflow';
import { CourseRoadmap } from './components/CourseRoadmap';
import { NotesHub } from './components/NotesHub';
import { Interview50Hub } from './components/Interview50Hub';
import { AITutorModal } from './components/AITutorModal';
import { AddTopicModal } from './components/AddTopicModal';

export default function App() {
  // Combine core SQL curriculum with custom user-created topics
  const [topics, setTopics] = useState<Topic[]>(() => {
    const custom = loadCustomTopics();
    return [...SQL_TOPICS, ...custom];
  });

  const [progress, setProgress] = useState<CourseProgress>(() => loadProgress(topics));
  const [activeView, setActiveView] = useState<'course' | 'roadmap' | 'notes' | 'interview50'>('course');
  const [currentTopicId, setCurrentTopicId] = useState<string>(
    progress.currentTopicId || topics[0]?.id || 'topic-1-select'
  );
  const [currentStep, setCurrentStep] = useState<TopicStep>('video');

  // Modals state
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [aiTutorContext, setAiTutorContext] = useState<{
    userSql: string;
    errorMessage?: string;
    mismatchDetails?: string;
  } | undefined>(undefined);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState<boolean>(false);

  // Sync progress to localStorage on change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const currentTopic = (topics && topics.length > 0)
    ? (topics.find((t) => t.id === currentTopicId) || topics[0])
    : (SQL_TOPICS[0]);
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
      setCurrentStep('video'); // Reset to video for the new topic
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
    }
  };

  // Select topic directly from Roadmap
  const handleSelectTopic = (topic: Topic) => {
    setCurrentTopicId(topic.id);
    setActiveView('course');
    // Determine appropriate initial step based on progress
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

  // Add custom topic
  const handleAddTopic = (newTopic: Topic) => {
    const updatedTopics = [...topics, newTopic];
    setTopics(updatedTopics);
    saveCustomTopics(updatedTopics.filter((t) => t.badge === 'Custom'));

    // Register in progress
    setProgress((prev) => ({
      ...prev,
      topics: {
        ...prev.topics,
        [newTopic.id]: {
          videoWatched: false,
          theoryRead: false,
          quizPassed: false,
          quizScore: 0,
          codingCompleted: false,
          userSql: newTopic.challenge.starterSql,
        },
      },
    }));
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation */}
      <Navbar
        topics={topics}
        progress={progress}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddTopic={() => setIsAddTopicOpen(true)}
        onResetProgress={handleResetProgress}
        onOpenAITutor={() => {
          setAiTutorContext(undefined);
          setIsAITutorOpen(true);
        }}
      />

      {/* Main Learning Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            topics={topics}
            progress={progress}
            onSelectTopic={handleSelectTopic}
            onOpenAddTopic={() => setIsAddTopicOpen(true)}
          />
        )}

        {activeView === 'interview50' && <Interview50Hub />}

        {activeView === 'notes' && <NotesHub />}
      </main>

      {/* AI Tutor Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        currentTopic={currentTopic}
        context={aiTutorContext}
      />

      {/* Add Custom Topic Modal */}
      <AddTopicModal
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
        onAddTopic={handleAddTopic}
        nextOrder={topics.length + 1}
      />
    </div>
  );
}
