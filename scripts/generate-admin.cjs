const fs = require('fs');
const path = require('path');

const seed = fs.readFileSync(path.join(__dirname, '..', 'admin_seed.js'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SQLMastery ADMIN | Studio & Course CMS</title>
  <meta name="description" content="Production-grade Admin Dashboard and CMS for SQLMastery interactive learning platform." />
  
  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            obsidian: '#080B11',
            cardbg: '#0D111E',
            sidebarbg: '#0A0F1D',
            cyanGlow: '#00D2FF',
            amberGlow: '#F59E0B',
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['Fira Code', 'Consolas', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <style>
    body {
      background-color: #080B11;
      color: #f1f5f9;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .cyan-glow-button {
      background-color: #00D2FF;
      color: #040810;
      box-shadow: 0 0 24px rgba(0, 210, 255, 0.45);
      transition: all 0.2s ease;
    }
    .cyan-glow-button:hover {
      background-color: #38bdf8;
      box-shadow: 0 0 32px rgba(0, 210, 255, 0.65);
      transform: translateY(-1px);
    }
    .glass-card {
      background-color: #0D111E;
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
    }
    .inner-card {
      background-color: #090E1A;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    /* Custom scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #080B11;
    }
    ::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #334155;
    }
  </style>
</head>
<body class="h-screen w-screen overflow-hidden flex bg-[#080B11] text-slate-100 antialiased select-text">

  <!-- ========================================================================= -->
  <!-- 1. LEFT SIDEBAR NAVIGATION RAIL                                           -->
  <!-- ========================================================================= -->
  <aside class="w-64 bg-[#0A0F1D] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 z-20">
    <div class="space-y-5">
      <!-- Brand & Admin Badge -->
      <div class="flex items-center justify-between px-2 pt-1">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.3)]">
            <i data-lucide="database" class="w-4 h-4 text-[#00D2FF]"></i>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-base tracking-tight text-white">SQLMastery</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-950/90 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons: Add Module & Add Submodule -->
      <div class="space-y-2 px-1">
        <button onclick="promptAddNewModule()" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.15)] transition cursor-pointer">
          <i data-lucide="folder-plus" class="w-4 h-4 text-[#00D2FF]"></i>
          <span>+ Add New Module</span>
        </button>

        <button onclick="promptAddNewSubModule()" class="w-full py-2 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
          <i data-lucide="git-branch" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span>+ Add Submodule</span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="space-y-1">
        <a href="#" onclick="switchMainTab('videos')" id="nav-videos" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-950/40 border border-cyan-500/50 text-[#00D2FF] shadow-[0_0_15px_rgba(0,210,255,0.2)] transition">
          <i data-lucide="film" class="w-4 h-4"></i>
          <span>1. Video Lessons & Verification</span>
        </a>

        <a href="#" onclick="switchMainTab('submodules')" id="nav-submodules" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="git-branch" class="w-4 h-4"></i>
          <span>2. Submodules (<span id="nav-submodules-count">0</span>)</span>
        </a>

        <a href="#" onclick="switchMainTab('theory')" id="nav-theory" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="file-text" class="w-4 h-4"></i>
          <span>3. Notes & Theory</span>
        </a>

        <a href="#" onclick="switchMainTab('mindmap')" id="nav-mindmap" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="network" class="w-4 h-4"></i>
          <span>4. Mind Map Tree</span>
        </a>

        <a href="#" onclick="switchMainTab('quiz')" id="nav-quiz" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="help-circle" class="w-4 h-4"></i>
          <span>5. Quiz Builder (<span id="nav-quiz-count">1</span>)</span>
        </a>

        <a href="#" onclick="switchMainTab('sql')" id="nav-sql" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="code-2" class="w-4 h-4"></i>
          <span>6. Coding Sandbox (<span id="nav-coding-count">1</span>)</span>
        </a>

        <a href="#" onclick="switchMainTab('manage')" id="nav-manage" class="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition">
          <i data-lucide="layers" class="w-4 h-4"></i>
          <span>All Modules List</span>
        </a>
      </nav>
    </div>

    <!-- Sidebar Bottom: Export/Import & Student App Link -->
    <div class="space-y-3 pt-4 border-t border-slate-800/80">
      <div class="grid grid-cols-2 gap-2">
        <button onclick="exportCurriculumJSON()" class="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1 cursor-pointer transition">
          <i data-lucide="download" class="w-3 h-3 text-[#00D2FF]"></i>
          <span>Export</span>
        </button>

        <label class="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1 cursor-pointer transition">
          <i data-lucide="upload" class="w-3 h-3 text-[#F59E0B]"></i>
          <span>Import</span>
          <input type="file" accept=".json" onchange="importCurriculumJSON(event)" class="hidden" />
        </label>
      </div>

      <button onclick="resetToOfficialCurriculum()" class="w-full py-1.5 px-2 rounded-lg bg-slate-900/60 hover:bg-red-950/40 text-[10px] text-slate-400 hover:text-red-300 border border-slate-800/80 flex items-center justify-center gap-1 transition cursor-pointer">
        <i data-lucide="refresh-cw" class="w-3 h-3"></i>
        <span>Reset Official Curriculum</span>
      </button>

      <!-- Link back to live student course -->
      <a href="./index.html" class="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition">
        <i data-lucide="external-link" class="w-3.5 h-3.5 text-[#00D2FF]"></i>
        <span>Live Student App</span>
      </a>

      <!-- Admin Profile Card -->
      <div class="flex items-center gap-2.5 pt-2 px-1">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Admin" class="w-8 h-8 rounded-full border border-slate-700 object-cover" />
        <div class="min-w-0">
          <p class="text-xs font-bold text-white truncate">Tarun Kumar</p>
          <p class="text-[10px] text-slate-500 truncate">Course Lead / Admin</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- ========================================================================= -->
  <!-- 2. MAIN ADMIN WORKSPACE                                                   -->
  <!-- ========================================================================= -->
  <div class="flex-1 flex flex-col overflow-hidden">

    <!-- Top Command Bar -->
    <header class="h-16 bg-[#070B14] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 shrink-0">
      <!-- Breadcrumb & Module Selector Controls -->
      <div class="flex items-center gap-2 text-xs font-medium text-slate-300">
        <span class="text-slate-500">Curriculum</span>
        <span class="text-slate-600">&gt;</span>
        <span id="breadcrumb-module" class="text-slate-300 font-semibold">Module 1</span>
        <span class="text-slate-600">&gt;</span>
        
        <!-- Module Dropdown (All Modules) -->
        <select id="topic-select" onchange="handleTopicSelectChange(this.value)" class="bg-[#0b1220] border border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-[#00D2FF] font-bold outline-none cursor-pointer max-w-xs truncate">
          <!-- Populated by JavaScript -->
        </select>

        <!-- Edit Module Title / Delete Module Actions -->
        <button onclick="promptEditCurrentModuleTitle()" title="Edit Module Name & Level" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="deleteCurrentModule()" title="Delete Current Module" class="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition cursor-pointer">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <!-- Search & Command Actions -->
      <div class="flex items-center gap-3">
        <!-- Add Module Button In Header -->
        <button onclick="promptAddNewModule()" class="px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-950/60 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition cursor-pointer">
          <i data-lucide="plus" class="w-3.5 h-3.5 text-[#00D2FF]"></i>
          <span>+ Add Module</span>
        </button>

        <!-- Live Search -->
        <div class="relative w-48 hidden sm:block">
          <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="admin-search-input" onkeyup="handleLiveSearch(this.value)" placeholder="Search modules..." class="w-full bg-[#0b1220] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50" />
        </div>

        <!-- Preview as Student -->
        <button onclick="openStudentPreviewModal()" class="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer">
          <i data-lucide="eye" class="w-3.5 h-3.5 text-slate-400"></i>
          <span>Preview as Student</span>
        </button>

        <!-- Publish Changes Button -->
        <div class="flex items-center gap-3">
          <span id="save-status-bar" class="text-xs font-semibold text-emerald-400" aria-live="polite" aria-atomic="true"></span>
          <button onclick="publishCurriculumChanges()" class="cyan-glow-button px-5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer" aria-label="Publish all curriculum changes">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 fill-current" aria-hidden="true"></i>
            <span>Publish Changes</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Multi-Tab Content Builder Header -->
    <div class="px-6 pt-3 pb-1 border-b border-slate-800/80 bg-[#060A12] flex items-center gap-2 select-none overflow-x-auto">
      <button onclick="switchMainTab('videos')" id="tab-btn-videos" class="py-2 px-4 rounded-xl text-xs font-bold text-[#00D2FF] bg-cyan-950/40 border border-cyan-500/40 transition cursor-pointer whitespace-nowrap">
        1. Video Lessons
      </button>
      <button onclick="switchMainTab('submodules')" id="tab-btn-submodules" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        2. Submodules (<span id="badge-submodules-count">0</span>)
      </button>
      <button onclick="switchMainTab('theory')" id="tab-btn-theory" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        3. Theory & Notes
      </button>
      <button onclick="switchMainTab('mindmap')" id="tab-btn-mindmap" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        4. Mind Map Tree
      </button>
      <button onclick="switchMainTab('quiz')" id="tab-btn-quiz" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        5. Quiz Manager (<span id="badge-quiz-count">1</span>)
      </button>
      <button onclick="switchMainTab('sql')" id="tab-btn-sql" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        6. Coding Challenges (<span id="badge-coding-count">1</span>)
      </button>
      <button onclick="switchMainTab('manage')" id="tab-btn-manage" class="py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap">
        All Modules
      </button>
    </div>

    <!-- ======================================================================= -->
    <!-- 3. MAIN STUDIO WORKSPACE (TAB CONTENTS)                                -->
    <!-- ======================================================================= -->
    <main class="flex-1 overflow-y-auto p-6 bg-[#080B11]">

      <!-- TAB 1: DUAL STUDIO VIEW (MATCHING MOCKUP: Multi-Instructor Cards + Quick Challenges/Quiz) -->
      <div id="view-combined-studio" class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        <!-- LEFT COLUMN: Video Lesson Links & Multi-Instructor Setup (6 cols) -->
        <div class="lg:col-span-6 glass-card rounded-2xl p-5 shadow-2xl space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-white tracking-tight">
                Video Lesson Links & Multi-Instructor Setup
              </h2>
              <p class="text-[11px] text-slate-400">Manage multiple YouTube instructors (Alex, Mosh, CodeBasics, Telugu, etc.)</p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">Watch Tracking Active</span>
          </div>

          <!-- Video Cards Container -->
          <div id="instructor-cards-list" class="space-y-3">
            <!-- Dynamically populated -->
          </div>

          <!-- Add Video URL Button -->
          <button onclick="addNewInstructorCard()" class="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-900/40 hover:bg-cyan-950/20 text-slate-300 hover:text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">
            <i data-lucide="plus" class="w-4 h-4 text-[#00D2FF]"></i>
            <span>+ Add Video URL</span>
          </button>
        </div>

        <!-- RIGHT COLUMN: Quick Challenge & Quiz Overview (6 cols) -->
        <div class="lg:col-span-6 glass-card rounded-2xl p-5 shadow-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-white tracking-tight">
              Curriculum Summary & Quick Editor
            </h2>
            <button onclick="switchMainTab('sql')" class="text-xs text-cyan-400 hover:underline">
              Open Full Sandbox &rarr;
            </button>
          </div>

          <!-- Active Challenge Summary -->
          <div class="inner-card rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <i data-lucide="code-2" class="w-3.5 h-3.5 text-[#00D2FF]"></i>
                Primary SQL Challenge
              </span>
              <span class="text-[10px] text-emerald-400 font-mono">Silent Verification</span>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400">Problem Statement</label>
              <textarea id="challenge-instructions-input" onchange="syncQuickChallengeChanges()" rows="2" class="w-full bg-[#040810] border border-slate-800 rounded-lg p-2.5 text-xs text-sky-200 font-mono focus:border-cyan-500/50"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-slate-400">Schema SQL</label>
                <textarea id="challenge-schema-input" onchange="syncQuickChallengeChanges()" rows="3" class="w-full bg-[#040810] border border-slate-800 rounded-lg p-2 text-[11px] text-cyan-300 font-mono"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[11px] font-semibold text-amber-400">Expected Query</label>
                <textarea id="challenge-solution-input" onchange="syncQuickChallengeChanges()" rows="3" class="w-full bg-[#040810] border border-amber-500/30 rounded-lg p-2 text-[11px] text-emerald-300 font-mono"></textarea>
              </div>
            </div>
          </div>

          <!-- Quick Quiz Question Preview -->
          <div class="inner-card rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <i data-lucide="help-circle" class="w-3.5 h-3.5 text-[#00D2FF]"></i>
                First Quiz Question
              </span>
              <button onclick="switchMainTab('quiz')" class="text-[10px] text-cyan-400 hover:underline">
                Manage All Questions (<span id="quick-quiz-count">1</span>)
              </button>
            </div>

            <div class="space-y-1">
              <input type="text" id="quick-quiz-question-input" onchange="syncQuickQuizChanges()" placeholder="Quiz Question" class="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200" />
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <input type="radio" name="quick-opt" id="quick-opt-0" checked onchange="syncQuickQuizChanges()" />
                <input type="text" id="quick-quiz-opt-0" onchange="syncQuickQuizChanges()" class="flex-1 bg-[#040810] border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300" />
              </div>
              <div class="flex items-center gap-2">
                <input type="radio" name="quick-opt" id="quick-opt-1" onchange="syncQuickQuizChanges()" />
                <input type="text" id="quick-quiz-opt-1" onchange="syncQuickQuizChanges()" class="flex-1 bg-[#040810] border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: SUBMODULES MANAGER (CREATE & MANAGE SUBMODULES PER TOPIC) -->
      <div id="view-submodules-tab" class="hidden max-w-5xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <i data-lucide="git-branch" class="w-5 h-5 text-cyan-400"></i>
                Module Submodules & Topic Breakdown
              </h2>
              <p class="text-xs text-slate-400">Create granular submodules under this module (e.g. "1.1 Basic SELECT", "1.2 Column Aliases", "1.3 DISTINCT Projections").</p>
            </div>
            <button onclick="promptAddNewSubModule()" class="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-[#00D2FF] hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ Add Submodule</span>
            </button>
          </div>

          <!-- Dynamic Submodules List -->
          <div id="submodules-list-container" class="space-y-3">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>

      <!-- TAB 3: THEORY & NOTES EDITOR WITH REAL-TIME PREVIEW -->
      <div id="view-theory-tab" class="hidden max-w-7xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white">Lesson Notes & Markdown Theory Editor</h2>
              <p class="text-xs text-slate-400">Compose syntax rules, explanation notes, and cheat sheets with real-time markdown preview.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-cyan-400">✓ Auto-Sync Active</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Markdown Input -->
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300">Markdown Editor</label>
              <textarea id="theory-markdown-input" rows="18" oninput="handleTheoryMarkdownChange(this.value)" class="w-full bg-[#040810] border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-200 focus:outline-none focus:border-cyan-500/50 leading-relaxed"></textarea>
            </div>

            <!-- Live Markdown Preview -->
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300">Student View Preview</label>
              <div id="theory-markdown-preview" class="w-full h-[400px] overflow-y-auto bg-[#070B14] border border-slate-800 rounded-xl p-5 text-xs space-y-3 leading-relaxed">
                <!-- Rendered dynamically -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: MIND MAP TREE EDITOR & VISUALIZER -->
      <div id="view-mindmap-tab" class="hidden max-w-7xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white">Interactive Mind Map Generator & Editor</h2>
              <p class="text-xs text-slate-400">Define the visual knowledge tree branches for this topic. Generated seamlessly in the student portal.</p>
            </div>
            <button onclick="generateDefaultMindmap()" class="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/80 transition cursor-pointer">
              Auto-Generate Branches
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300">Mindmap Hierarchy Code (Mermaid Format)</label>
              <textarea id="mindmap-code-input" rows="16" oninput="handleMindmapCodeChange(this.value)" class="w-full bg-[#040810] border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500/50 leading-relaxed"></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300">Visual Tree Branches Preview</label>
              <div id="mindmap-tree-preview" class="w-full h-[360px] overflow-y-auto bg-[#070B14] border border-slate-800 rounded-xl p-5 space-y-4">
                <!-- Visual branches rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: QUIZ MANAGER (ADD AS MANY MCQS AS YOU WANT) -->
      <div id="view-quiz-tab" class="hidden max-w-5xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white">Interactive Quiz Question Builder</h2>
              <p class="text-xs text-slate-400">Add, edit, or remove multiple choice questions for this module. Students must pass to unlock next step.</p>
            </div>
            <button onclick="addFullQuizQuestion()" class="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-[#00D2FF] hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ Add Quiz Question</span>
            </button>
          </div>

          <!-- Dynamic Quiz Questions List -->
          <div id="full-quiz-questions-list" class="space-y-4">
            <!-- Rendered dynamically by renderFullQuizList() -->
          </div>
        </div>
      </div>

      <!-- TAB 6: SQL CHALLENGE SANDBOX (MULTI-CODING CHALLENGES) -->
      <div id="view-sql-tab" class="hidden max-w-5xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white">SQL Playground Coding Challenges Bank</h2>
              <p class="text-xs text-slate-400">Add multiple practice challenges per module. The playground validates against your benchmark solution silently in the background.</p>
            </div>
            <button onclick="addNewCodingChallenge()" class="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ Add Coding Challenge</span>
            </button>
          </div>

          <!-- Coding Challenges List -->
          <div id="full-coding-challenges-list" class="space-y-6">
            <!-- Rendered dynamically by renderCodingChallengesList() -->
          </div>
        </div>
      </div>

      <!-- TAB 7: MANAGE ALL MODULES VIEW (ADD / REORDER / DELETE MODULES) -->
      <div id="view-manage-tab" class="hidden max-w-5xl mx-auto space-y-4">
        <div class="glass-card rounded-2xl p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 class="text-base font-bold text-white">All Course Modules & Curriculum Overview</h2>
              <p class="text-xs text-slate-400">View, switch between, add, rename, or delete any module in the course.</p>
            </div>
            <button onclick="promptAddNewModule()" class="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-[#00D2FF] hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ Add New Module</span>
            </button>
          </div>

          <div id="all-modules-management-list" class="space-y-3">
            <!-- Dynamically rendered list of all modules -->
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- ========================================================================= -->
  <!-- 4. PREVIEW AS STUDENT MODAL                                               -->
  <!-- ========================================================================= -->
  <div id="student-preview-modal" class="fixed inset-0 z-50 hidden bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-[#090F1D] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-[#070B14]">
        <div class="flex items-center gap-2">
          <i data-lucide="eye" class="w-4 h-4 text-[#00D2FF]"></i>
          <span id="preview-modal-title" class="text-sm font-bold text-white">Student View Preview</span>
        </div>
        <button onclick="closeStudentPreviewModal()" class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer">
          Close Preview
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6">
        <!-- Video Preview -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 class="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="film" class="w-3.5 h-3.5"></i> Video Player Preview (Watch Tracking Verified)
          </h3>
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
            <iframe id="preview-iframe" class="w-full h-full border-0" allowfullscreen></iframe>
          </div>
        </div>

        <!-- Submodules Preview -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 class="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="git-branch" class="w-3.5 h-3.5"></i> Module Submodules
          </h3>
          <div id="preview-submodules-content" class="flex flex-wrap gap-2 text-xs"></div>
        </div>

        <!-- Theory Preview -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 class="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i> Theory & Syntax
          </h3>
          <div id="preview-theory-content" class="text-xs text-slate-300 space-y-2"></div>
        </div>

        <!-- Quiz Preview -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 class="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> Quiz Questions
          </h3>
          <div id="preview-quiz-content" class="space-y-2 text-xs"></div>
        </div>

        <!-- Coding Challenge Preview -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 class="text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <i data-lucide="code-2" class="w-3.5 h-3.5"></i> Coding Workspace
          </h3>
          <p id="preview-coding-task" class="text-xs text-slate-300"></p>
          <div class="bg-black/60 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-500">
            -- SQL Workspace starts clean and empty for the student (silent validation)
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 5. DEFAULT SEED CURRICULUM DATA                                           -->
  <!-- ========================================================================= -->
  <script>
    ${seed}
  </script>

  <!-- ========================================================================= -->
  <!-- 6. COMPLETE CMS LOGIC ENGINE                                              -->
  <!-- ========================================================================= -->
  <script>
    const STORAGE_KEY = 'sqlmastery_all_topics_v2';
    let topics = [];
    let currentTopicIndex = 0;

    // Initialize application on page load
    window.addEventListener('DOMContentLoaded', () => {
      loadTopicsFromStorage();
      populateTopicDropdown();
      renderCurrentTopic();
      renderAllModulesManagementList();
      lucide.createIcons();
    });

    // Load from localStorage or initialize with full 13 seed topics
    function loadTopicsFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (parsed.length === 1 && DEFAULT_SEED_TOPICS.length > 1) {
              topics = DEFAULT_SEED_TOPICS;
              saveTopicsToStorage();
              return;
            }
            topics = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse localStorage topics:', e);
      }
      topics = DEFAULT_SEED_TOPICS;
      saveTopicsToStorage();
    }

    function saveTopicsToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
        showSaveStatus('saved');
      } catch (e) {
        console.error('Storage write error:', e);
        showSaveStatus('error');
      }
    }

    // Save-state indicator
    let _saveStatusTimer = null;
    function showSaveStatus(state) {
      const el = document.getElementById('save-status-bar');
      if (!el) return;
      if (_saveStatusTimer) clearTimeout(_saveStatusTimer);
      if (state === 'saved') {
        el.textContent = '✓ All changes saved';
        el.className = 'text-emerald-400 text-xs font-semibold transition-opacity';
      } else if (state === 'unsaved') {
        el.textContent = '● Unsaved changes';
        el.className = 'text-amber-400 text-xs font-semibold';
        return; // Keep visible until saved
      } else {
        el.textContent = '⚠ Save failed — check storage';
        el.className = 'text-rose-400 text-xs font-semibold';
      }
      _saveStatusTimer = setTimeout(() => { el.textContent = ''; }, 4000);
    }

    function markUnsaved() { showSaveStatus('unsaved'); }
    function resetToOfficialCurriculum() {
      if (confirm('Reset course curriculum to the official 13 structured SQL modules? Any unsaved edits will be refreshed.')) {
        topics = JSON.parse(JSON.stringify(DEFAULT_SEED_TOPICS));
        currentTopicIndex = 0;
        saveTopicsToStorage();
        populateTopicDropdown();
        renderCurrentTopic();
        renderAllModulesManagementList();
        alert('Curriculum reset to official 13 modules!');
      }
    }

    function populateTopicDropdown() {
      const select = document.getElementById('topic-select');
      select.innerHTML = '';
      topics.forEach((t, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = \`Module \${t.order || (i + 1)}: \${(t.title || 'Untitled').replace(/^\\d+\\.\\s*/, '')}\`;
        if (i === currentTopicIndex) opt.selected = true;
        select.appendChild(opt);
      });
    }

    function handleTopicSelectChange(indexVal) {
      currentTopicIndex = parseInt(indexVal, 10);
      renderCurrentTopic();
    }

    // Add New Module to course
    function promptAddNewModule() {
      const title = prompt('Enter New Module Title (e.g. "Recursive Queries & Graph Traversal"):');
      if (!title || !title.trim()) return;

      const newOrder = topics.length + 1;
      const newModule = {
        id: \`topic-\${newOrder}-\${Date.now()}\`,
        order: newOrder,
        title: \`\${newOrder}. \${title.trim()}\`,
        level: 'Intermediate',
        estimatedMinutes: 25,
        overview: \`Master \${title.trim()} concepts with hands-on practice, video tutorials, and interactive verification.\`,
        subModules: [
          {
            id: \`sub-\${Date.now()}-1\`,
            order: 1,
            title: \`\${title.trim()} Overview\`,
            duration: '8 mins',
            summary: 'Core introduction and basic clause setup'
          },
          {
            id: \`sub-\${Date.now()}-2\`,
            order: 2,
            title: \`\${title.trim()} Deep Dive\`,
            duration: '15 mins',
            summary: 'Practical queries and real-world patterns'
          }
        ],
        video: {
          title: \`\${title.trim()} Tutorial\`,
          embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
          duration: '20:00',
          channel: 'Alex The Analyst',
          language: 'English',
          summaryPoints: ['Understand core concepts', 'Learn syntactical rules', 'Apply to realistic data problems']
        },
        alternativeVideos: [
          {
            title: \`\${title.trim()} Deep Dive\`,
            embedUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA',
            duration: '22:30',
            channel: 'Programming with Mosh',
            language: 'English'
          },
          {
            title: \`\${title.trim()} Practice\`,
            embedUrl: 'https://www.youtube.com/embed/nopIGY1zJE0',
            duration: '12:00',
            channel: 'CodeBasics',
            language: 'English'
          }
        ],
        addonVideos: [
          {
            title: 'Telugu Full SQL Course',
            embedUrl: 'https://www.youtube.com/embed/8F6fv4_MDbM',
            duration: '28:10',
            channel: 'Telugu Full SQL Course',
            language: 'Telugu'
          }
        ],
        theory: {
          title: \`\${title.trim()} Notes & Syntax\`,
          summary: \`Comprehensive reference and explanation for \${title.trim()}.\`,
          syntax: \`SELECT column_name FROM table_name;\`,
          explanation: ['Core clause specifications', 'Data processing pipeline'],
          mermaidMindmap: \`mindmap\\n  root((\${title.trim()}))\\n    Core Syntax\\n      Primary Clause\\n      Filter Conditions\\n    Best Practices\\n      Clean Aliases\\n      Performance Optimizations\\n    Pitfalls\\n      Null Values\\n      Type Mismatches\`
        },
        quiz: {
          passingScorePercent: 75,
          questions: [
            {
              id: \`q-\${Date.now()}-1\`,
              question: \`What is the primary objective of \${title.trim()} in SQL?\`,
              options: ['To query and transform data', 'To restart database engine', 'To format network cables', 'To change server timezone'],
              correctIndex: 0,
              explanation: 'SQL statements query, manipulate, and structure data in relational systems.'
            }
          ]
        },
        challenge: {
          id: \`ch-\${Date.now()}-1\`,
          title: \`Practice: \${title.trim()}\`,
          difficulty: 'Easy',
          instructions: \`Write a SQL query that retrieves all records from the sample table for \${title.trim()}.\`,
          schemaSql: "CREATE TABLE records (id INT PRIMARY KEY, title VARCHAR(50), status VARCHAR(20));\\nINSERT INTO records VALUES (1, 'Sample 1', 'Active'), (2, 'Sample 2', 'Completed');",
          tables: [],
          starterSql: '',
          solutionSql: 'SELECT * FROM records;',
          hints: ['Use SELECT * to project all records.']
        },
        challenges: [
          {
            id: \`ch-\${Date.now()}-1\`,
            title: \`Practice: \${title.trim()}\`,
            difficulty: 'Easy',
            instructions: \`Write a SQL query that retrieves all records from the sample table for \${title.trim()}.\`,
            schemaSql: "CREATE TABLE records (id INT PRIMARY KEY, title VARCHAR(50), status VARCHAR(20));\\nINSERT INTO records VALUES (1, 'Sample 1', 'Active'), (2, 'Sample 2', 'Completed');",
            tables: [],
            starterSql: '',
            solutionSql: 'SELECT * FROM records;',
            hints: ['Use SELECT * to project all records.']
          }
        ]
      };

      topics.push(newModule);
      currentTopicIndex = topics.length - 1;
      saveTopicsToStorage();
      populateTopicDropdown();
      renderCurrentTopic();
      renderAllModulesManagementList();
      alert(\`✓ Module "\${newModule.title}" successfully added!\`);
    }

    // Add New Submodule to current module
    function promptAddNewSubModule() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      const subTitle = prompt(\`Enter Submodule Title for Module \${topic.order} (e.g. "Sub-topic: Column Aliases & Arithmetic"):\`);
      if (!subTitle || !subTitle.trim()) return;

      if (!topic.subModules) topic.subModules = [];
      const newSub = {
        id: \`sub-\${Date.now()}-\${topic.subModules.length + 1}\`,
        order: topic.subModules.length + 1,
        title: subTitle.trim(),
        duration: '10 mins',
        videoUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
        summary: \`Focused sub-topic practice on \${subTitle.trim()}\`,
        notes: \`### \${subTitle.trim()} Notes & Syntax Rules\\n- Master core definitions and query logic.\\n- Common interview mistakes to avoid.\\n- Real-world production query pattern.\`
      };

      topic.subModules.push(newSub);
      saveTopicsToStorage();
      renderSubmodulesList(topic);
      alert(\`✓ Submodule "\${newSub.title}" added to Module \${topic.order}!\`);
    }

    // Rename current module title
    function promptEditCurrentModuleTitle() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      const currentTitle = topic.title.replace(/^\\d+\\.\\s*/, '');
      const newTitle = prompt('Update Module Title:', currentTitle);
      if (newTitle && newTitle.trim()) {
        topic.title = \`\${topic.order || (currentTopicIndex + 1)}. \${newTitle.trim()}\`;
        saveTopicsToStorage();
        populateTopicDropdown();
        renderCurrentTopic();
        renderAllModulesManagementList();
      }
    }

    // Delete current module
    function deleteCurrentModule() {
      if (topics.length <= 1) {
        alert('Course must have at least 1 module.');
        return;
      }
      const topic = topics[currentTopicIndex];
      if (confirm(\`Are you sure you want to delete "\${topic.title}"?\`)) {
        topics.splice(currentTopicIndex, 1);
        topics.forEach((t, i) => {
          t.order = i + 1;
          t.title = t.title.replace(/^\\d+\\.\\s*/, \`\${i + 1}. \`);
        });
        currentTopicIndex = Math.max(0, currentTopicIndex - 1);
        saveTopicsToStorage();
        populateTopicDropdown();
        renderCurrentTopic();
        renderAllModulesManagementList();
      }
    }

    // Render active topic in the Studio Workspace
    function renderCurrentTopic() {
      const topic = topics[currentTopicIndex] || topics[0];
      if (!topic) return;

      document.getElementById('breadcrumb-module').textContent = \`Module \${topic.order || (currentTopicIndex + 1)}: \${topic.level || 'Beginner'}\`;
      document.getElementById('topic-select').value = currentTopicIndex;

      // Badges
      const subCount = topic.subModules?.length || 0;
      const qCount = topic.quiz?.questions?.length || 0;
      const cCount = (topic.challenges && topic.challenges.length > 0) ? topic.challenges.length : 1;

      document.getElementById('badge-submodules-count').textContent = subCount;
      document.getElementById('nav-submodules-count').textContent = subCount;
      document.getElementById('badge-quiz-count').textContent = qCount;
      document.getElementById('nav-quiz-count').textContent = qCount;
      document.getElementById('badge-coding-count').textContent = cCount;
      document.getElementById('nav-coding-count').textContent = cCount;
      document.getElementById('quick-quiz-count').textContent = qCount;

      // 1. Render Videos Column
      renderInstructorCards(topic);

      // 2. Render Submodules Tab
      renderSubmodulesList(topic);

      // 3. Render Quick Challenge & Quiz
      const ch = topic.challenge || (topic.challenges && topic.challenges[0]) || {
        instructions: 'Write a SQL query that retrieves all records.',
        schemaSql: 'CREATE TABLE students (id INT, name VARCHAR(50));',
        solutionSql: 'SELECT * FROM students;'
      };
      document.getElementById('challenge-instructions-input').value = ch.instructions || '';
      document.getElementById('challenge-schema-input').value = ch.schemaSql || '';
      document.getElementById('challenge-solution-input').value = ch.solutionSql || '';

      const qList = topic.quiz?.questions || [];
      if (qList.length > 0) {
        document.getElementById('quick-quiz-question-input').value = qList[0].question || '';
        document.getElementById('quick-quiz-opt-0').value = qList[0].options?.[0] || '';
        document.getElementById('quick-quiz-opt-1').value = qList[0].options?.[1] || '';
        document.getElementById('quick-opt-0').checked = qList[0].correctIndex === 0;
        document.getElementById('quick-opt-1').checked = qList[0].correctIndex === 1;
      }

      // 4. Render Theory Markdown Tab
      const theoryMd = topic.theory?.summary || '# Lesson Notes\\nMaster SQL queries and data manipulation.';
      document.getElementById('theory-markdown-input').value = theoryMd;
      renderMarkdownPreview(theoryMd);

      // 5. Render Mindmap Tab
      const mindmapCode = topic.theory?.mermaidMindmap || \`mindmap\\n  root((\${topic.title}))\\n    Concepts\\n      Core Clauses\\n      Execution Pipeline\\n    Syntax\\n      Keywords\\n      Expressions\`;
      document.getElementById('mindmap-code-input').value = mindmapCode;
      renderMindmapPreview(mindmapCode);

      // 6. Render Tab 5 Quiz Manager
      renderFullQuizList(topic);

      // 7. Render Tab 6 Coding Challenges Bank
      renderCodingChallengesList(topic);

      lucide.createIcons();
    }

    // Render Submodules List
    function renderSubmodulesList(topic) {
      const container = document.getElementById('submodules-list-container');
      if (!container) return;
      container.innerHTML = '';

      const subList = topic.subModules || [];
      if (subList.length === 0) {
        container.innerHTML = \`
          <div class="inner-card rounded-xl p-6 text-center border border-dashed border-slate-800 space-y-2">
            <p class="text-xs text-slate-400">No submodules added yet for Module \${topic.order}.</p>
            <button onclick="promptAddNewSubModule()" class="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition cursor-pointer">
              + Create First Submodule
            </button>
          </div>
        \`;
        return;
      }

      subList.forEach((sub, sIdx) => {
        const item = document.createElement('div');
        item.className = 'inner-card rounded-xl p-4.5 space-y-3 border border-slate-800/80 hover:border-slate-700 transition';
        item.innerHTML = \`
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              <span class="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                \${topic.order}.\${sIdx + 1}
              </span>
              <input type="text" value="\${sub.title || ''}" onchange="updateSubmoduleField(\${sIdx}, 'title', this.value)" placeholder="Submodule Title" class="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 outline-none w-full" />
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <input type="text" value="\${sub.duration || '10 mins'}" onchange="updateSubmoduleField(\${sIdx}, 'duration', this.value)" title="Duration" class="w-20 bg-[#040810] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 font-mono text-center" />
              <button onclick="deleteSubmodule(\${sIdx})" title="Delete Submodule" class="text-slate-500 hover:text-red-400 p-1.5 rounded transition cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <input type="text" value="\${sub.summary || ''}" onchange="updateSubmoduleField(\${sIdx}, 'summary', this.value)" placeholder="Short summary / syllabus bullet" class="text-[11px] text-slate-400 bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1.5 w-full focus:outline-none focus:border-cyan-500/50" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-semibold text-sky-400 flex items-center gap-1">
                <i data-lucide="video" class="w-3 h-3"></i> Submodule Video Link (YouTube Embed or Watch URL)
              </label>
              <span class="text-[10px] text-slate-500">Appears in video player creator switcher</span>
            </div>
            <div class="relative">
              <input type="text" value="\${sub.videoUrl || ''}" onchange="updateSubmoduleField(\${sIdx}, 'videoUrl', this.value)" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." class="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-sky-200 font-mono pr-7 focus:outline-none focus:border-cyan-500/50" />
              <i data-lucide="link" class="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
                <i data-lucide="file-text" class="w-3 h-3"></i> Submodule Specific Notes & Markdown Syntax
              </label>
              <span class="text-[10px] text-slate-500">Rendered in student theory portal</span>
            </div>
            <textarea rows="3" onchange="updateSubmoduleField(\${sIdx}, 'notes', this.value)" placeholder="Add comprehensive notes, syntax rules, formulas, or markdown specifically for this submodule..." class="w-full bg-[#040810] border border-slate-800 rounded-lg p-2.5 text-xs text-sky-200 font-mono focus:outline-none focus:border-cyan-500/50 leading-relaxed">\${sub.notes || ''}</textarea>
          </div>
        \`;
        container.appendChild(item);
      });
      lucide.createIcons();
    }

    function updateSubmoduleField(sIdx, field, val) {
      const topic = topics[currentTopicIndex];
      if (!topic?.subModules?.[sIdx]) return;
      topic.subModules[sIdx][field] = val;
      saveTopicsToStorage();
    }

    function deleteSubmodule(sIdx) {
      const topic = topics[currentTopicIndex];
      if (!topic?.subModules) return;
      if (confirm('Delete this submodule?')) {
        topic.subModules.splice(sIdx, 1);
        saveTopicsToStorage();
        renderSubmodulesList(topic);
        const subCount = topic.subModules.length;
        document.getElementById('badge-submodules-count').textContent = subCount;
        document.getElementById('nav-submodules-count').textContent = subCount;
      }
    }

    // Render Instructor Video Cards
    function renderInstructorCards(topic) {
      const container = document.getElementById('instructor-cards-list');
      container.innerHTML = '';

      const allVideos = [
        topic.video,
        ...(topic.alternativeVideos || []),
        ...(topic.addonVideos || [])
      ].filter(Boolean);

      const avatarUrls = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
      ];

      allVideos.forEach((v, idx) => {
        const card = document.createElement('div');
        card.className = 'inner-card rounded-xl p-3.5 flex items-center gap-3.5 hover:border-slate-700 transition';
        card.innerHTML = \`
          <div class="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
            <img src="\${avatarUrls[idx % avatarUrls.length]}" alt="\${v.channel}" class="w-full h-full object-cover" />
            <input type="text" value="\${v.duration || '20:00'}" onchange="updateVideoDuration(\${idx}, this.value)" title="Required Watch Duration (e.g. 20:00)" class="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-slate-950/90 text-white px-1 py-0.5 rounded border border-slate-700/80 w-12 text-center outline-none" />
          </div>

          <div class="flex-1 min-w-0 space-y-1.5">
            <div class="flex items-center justify-between">
              <input type="text" value="\${v.channel || 'Instructor ' + (idx + 1)}" onchange="updateVideoChannel(\${idx}, this.value)" class="text-xs font-bold text-slate-200 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 outline-none truncate w-40" />
              <div class="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span>Verified Watch Check</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
              </div>
            </div>

            <div class="relative">
              <input type="text" value="\${v.embedUrl || ''}" onchange="updateVideoUrl(\${idx}, this.value)" placeholder="Video YouTube URL / Embed Link" class="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-sky-200 font-mono pr-7 focus:outline-none focus:border-cyan-500/50" />
              <i data-lucide="link" class="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>

          <button onclick="deleteInstructorVideo(\${idx})" title="Delete Video" class="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        \`;
        container.appendChild(card);
      });
    }

    function updateVideoDuration(videoIdx, newDuration) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (videoIdx === 0 && topic.video) {
        topic.video.duration = newDuration;
      } else {
        const altLen = topic.alternativeVideos?.length || 0;
        if (videoIdx <= altLen && topic.alternativeVideos) {
          topic.alternativeVideos[videoIdx - 1].duration = newDuration;
        } else if (topic.addonVideos) {
          topic.addonVideos[videoIdx - 1 - altLen].duration = newDuration;
        }
      }
      saveTopicsToStorage();
    }

    function updateVideoChannel(videoIdx, newChannel) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (videoIdx === 0 && topic.video) {
        topic.video.channel = newChannel;
      } else {
        const altLen = topic.alternativeVideos?.length || 0;
        if (videoIdx <= altLen && topic.alternativeVideos) {
          topic.alternativeVideos[videoIdx - 1].channel = newChannel;
        } else if (topic.addonVideos) {
          topic.addonVideos[videoIdx - 1 - altLen].channel = newChannel;
        }
      }
      saveTopicsToStorage();
    }

    function updateVideoUrl(videoIdx, newUrl) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (videoIdx === 0 && topic.video) {
        topic.video.embedUrl = newUrl;
      } else {
        const altLen = topic.alternativeVideos?.length || 0;
        if (videoIdx <= altLen && topic.alternativeVideos) {
          topic.alternativeVideos[videoIdx - 1].embedUrl = newUrl;
        } else if (topic.addonVideos) {
          topic.addonVideos[videoIdx - 1 - altLen].embedUrl = newUrl;
        }
      }
      saveTopicsToStorage();
    }

    function addNewInstructorCard() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.alternativeVideos) topic.alternativeVideos = [];
      topic.alternativeVideos.push({
        title: \`\${topic.title} Additional Tutorial\`,
        embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
        duration: '20:00',
        channel: 'New Instructor',
        language: 'English',
        summaryPoints: ['Clear explanation', 'Live demonstration']
      });
      saveTopicsToStorage();
      renderInstructorCards(topic);
      lucide.createIcons();
    }

    function deleteInstructorVideo(videoIdx) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (videoIdx === 0) {
        alert('Cannot remove the primary instructor video.');
        return;
      }
      const altLen = topic.alternativeVideos?.length || 0;
      if (videoIdx <= altLen && topic.alternativeVideos) {
        topic.alternativeVideos.splice(videoIdx - 1, 1);
      } else if (topic.addonVideos) {
        topic.addonVideos.splice(videoIdx - 1 - altLen, 1);
      }
      saveTopicsToStorage();
      renderInstructorCards(topic);
      lucide.createIcons();
    }

    // Quick Challenge sync
    function syncQuickChallengeChanges() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      const inst = document.getElementById('challenge-instructions-input').value;
      const sch = document.getElementById('challenge-schema-input').value;
      const sol = document.getElementById('challenge-solution-input').value;

      if (!topic.challenge) topic.challenge = {};
      topic.challenge.instructions = inst;
      topic.challenge.schemaSql = sch;
      topic.challenge.solutionSql = sol;
      if (topic.challenges && topic.challenges.length > 0) {
        topic.challenges[0].instructions = inst;
        topic.challenges[0].schemaSql = sch;
        topic.challenges[0].solutionSql = sol;
      }
      saveTopicsToStorage();
    }

    // Quick Quiz sync
    function syncQuickQuizChanges() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.quiz) topic.quiz = { questions: [] };
      if (!topic.quiz.questions || topic.quiz.questions.length === 0) {
        topic.quiz.questions.push({
          id: \`q-\${Date.now()}\`,
          question: '',
          options: ['', ''],
          correctIndex: 0,
          explanation: ''
        });
      }
      const q = topic.quiz.questions[0];
      q.question = document.getElementById('quick-quiz-question-input').value;
      q.options[0] = document.getElementById('quick-quiz-opt-0').value;
      q.options[1] = document.getElementById('quick-quiz-opt-1').value;
      q.correctIndex = document.getElementById('quick-opt-1').checked ? 1 : 0;
      saveTopicsToStorage();
    }

    // Theory & Notes Markdown handlers
    function handleTheoryMarkdownChange(val) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.theory) topic.theory = {};
      topic.theory.summary = val;
      saveTopicsToStorage();
      renderMarkdownPreview(val);
    }

    function renderMarkdownPreview(markdownText) {
      const preview = document.getElementById('theory-markdown-preview');
      const lines = (markdownText || '').split('\\n');
      let html = '';
      lines.forEach(l => {
        const line = l.trim();
        if (line.startsWith('# ')) {
          html += \`<h1 class="text-base font-bold text-white mt-2 border-b border-slate-800 pb-1">\${line.replace('# ', '')}</h1>\`;
        } else if (line.startsWith('## ')) {
          html += \`<h2 class="text-sm font-bold text-cyan-400 mt-2">\${line.replace('## ', '')}</h2>\`;
        } else if (line.startsWith('- ')) {
          html += \`<li class="text-slate-300 ml-4 list-disc text-xs">\${line.replace('- ', '')}</li>\`;
        } else if (line.startsWith('\`\`\`')) {
          // ignore fence
        } else if (line) {
          html += \`<p class="text-slate-300 text-xs my-1">\${line}</p>\`;
        }
      });
      preview.innerHTML = html || '<p class="text-slate-500">Preview will display here...</p>';
    }

    // Mind Map handlers
    function handleMindmapCodeChange(val) {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.theory) topic.theory = {};
      topic.theory.mermaidMindmap = val;
      saveTopicsToStorage();
      renderMindmapPreview(val);
    }

    function renderMindmapPreview(code) {
      const container = document.getElementById('mindmap-tree-preview');
      if (!container) return;
      const lines = (code || '').split('\\n');
      let root = 'SQL Module';
      const branches = [];
      let currentBranch = null;

      lines.forEach(rawLine => {
        const line = rawLine.trim();
        if (!line || line.startsWith('mindmap')) return;
        if (line.includes('root((')) {
          const match = line.match(/root\\(\\((.*?)\\)\\)/);
          if (match && match[1]) root = match[1];
          return;
        }
        const indent = rawLine.search(/\\S/);
        if (indent === 4) {
          currentBranch = { title: line, items: [] };
          branches.push(currentBranch);
        } else if (indent >= 6 && currentBranch) {
          currentBranch.items.push(line);
        }
      });

      if (branches.length === 0) {
        branches.push({ title: 'Core Syntax', items: ['SELECT Statement', 'FROM Clause', 'WHERE Filtering'] });
        branches.push({ title: 'Best Practices', items: ['Specific Projections', 'Clean Aliases'] });
      }

      container.innerHTML = \`
        <div class="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex items-center justify-between">
          <span class="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
            <i data-lucide="network" class="w-4 h-4 text-[#00D2FF]"></i>
            Root: \${root}
          </span>
          <span class="text-[10px] text-slate-400 font-mono">\${branches.length} Branches</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          \${branches.map((b, idx) => \`
            <div class="inner-card p-3 rounded-xl border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-amber-400">🌿 \${b.title}</span>
              <ul class="space-y-1">
                \${b.items.map(item => \`<li class="text-[11px] text-slate-300 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> \${item}</li>\`).join('')}
              </ul>
            </div>
          \`).join('')}
        </div>
      \`;
      lucide.createIcons();
    }

    function generateDefaultMindmap() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      const cleanTitle = topic.title.replace(/^\\d+\\.\\s*/, '');
      const code = \`mindmap\\n  root((\${cleanTitle}))\\n    Foundations\\n      Core Clauses\\n      Execution Order\\n      Data Types\\n    Practical Patterns\\n      Filtering Conditions\\n      Calculated Columns\\n      Data Summaries\\n    Enterprise Standards\\n      Performance Optimizations\\n      Indexed Lookups\\n      Safe Querying\`;
      document.getElementById('mindmap-code-input').value = code;
      handleMindmapCodeChange(code);
    }

    // Tab 5 Quiz Manager (Multiple MCQs)
    function renderFullQuizList(topic) {
      const list = document.getElementById('full-quiz-questions-list');
      list.innerHTML = '';
      const questions = topic.quiz?.questions || [];

      if (questions.length === 0) {
        list.innerHTML = '<p class="text-xs text-slate-500 p-4">No quiz questions yet. Click "+ Add Quiz Question" to create one.</p>';
        return;
      }

      questions.forEach((q, qIdx) => {
        const item = document.createElement('div');
        item.className = 'inner-card rounded-xl p-4 space-y-3 border border-slate-800/80';
        item.innerHTML = \`
          <div class="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold">
                \${qIdx + 1}
              </span>
              Question \${qIdx + 1}
            </span>
            <button onclick="removeQuizQuestion(\${qIdx})" class="text-slate-500 hover:text-red-400 p-1 rounded cursor-pointer transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-400">Question Text</label>
            <input type="text" value="\${q.question || ''}" onchange="updateFullQuizQuestion(\${qIdx}, 'question', this.value)" class="w-full bg-[#040810] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50" />
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400">Options (Select radio for correct answer)</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              \${(q.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4']).map((opt, optIdx) => \`
                <div class="flex items-center gap-2 bg-[#040810] border border-slate-800/80 rounded-lg px-2.5 py-1">
                  <input type="radio" name="full-q-\${qIdx}" \${q.correctIndex === optIdx ? 'checked' : ''} onchange="updateFullQuizQuestion(\${qIdx}, 'correctIndex', \${optIdx})" />
                  <input type="text" value="\${opt}" onchange="updateFullQuizOption(\${qIdx}, \${optIdx}, this.value)" class="flex-1 bg-transparent text-xs text-slate-200 outline-none" />
                </div>
              \`).join('')}
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-400">Explanation for Student</label>
            <input type="text" value="\${q.explanation || ''}" onchange="updateFullQuizQuestion(\${qIdx}, 'explanation', this.value)" placeholder="Why is this correct?" class="w-full bg-[#040810] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-emerald-300 font-mono" />
          </div>
        \`;
        list.appendChild(item);
      });
      lucide.createIcons();
    }

    function addFullQuizQuestion() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.quiz) topic.quiz = { questions: [] };
      topic.quiz.questions.push({
        id: \`q-\${Date.now()}\`,
        question: 'New Question: What is returned by this query?',
        options: ['Result A', 'Result B', 'Result C', 'Result D'],
        correctIndex: 0,
        explanation: 'Option A is the correct answer according to standard SQL rules.'
      });
      saveTopicsToStorage();
      renderFullQuizList(topic);
      document.getElementById('badge-quiz-count').textContent = topic.quiz.questions.length;
      document.getElementById('nav-quiz-count').textContent = topic.quiz.questions.length;
    }

    function removeQuizQuestion(qIdx) {
      const topic = topics[currentTopicIndex];
      if (!topic || !topic.quiz?.questions) return;
      if (topic.quiz.questions.length <= 1) {
        alert('Each module must have at least one question.');
        return;
      }
      topic.quiz.questions.splice(qIdx, 1);
      saveTopicsToStorage();
      renderFullQuizList(topic);
      document.getElementById('badge-quiz-count').textContent = topic.quiz.questions.length;
      document.getElementById('nav-quiz-count').textContent = topic.quiz.questions.length;
    }

    function updateFullQuizQuestion(qIdx, field, val) {
      const topic = topics[currentTopicIndex];
      if (!topic?.quiz?.questions?.[qIdx]) return;
      topic.quiz.questions[qIdx][field] = val;
      saveTopicsToStorage();
    }

    function updateFullQuizOption(qIdx, optIdx, val) {
      const topic = topics[currentTopicIndex];
      if (!topic?.quiz?.questions?.[qIdx]?.options) return;
      topic.quiz.questions[qIdx].options[optIdx] = val;
      saveTopicsToStorage();
    }

    // Tab 6: Coding Challenges Bank (Multiple Challenges per Module)
    function renderCodingChallengesList(topic) {
      const container = document.getElementById('full-coding-challenges-list');
      container.innerHTML = '';

      if (!topic.challenges || topic.challenges.length === 0) {
        topic.challenges = topic.challenge ? [topic.challenge] : [{
          id: \`ch-\${Date.now()}\`,
          title: topic.title,
          difficulty: 'Easy',
          instructions: 'Write a SQL query that retrieves all records.',
          schemaSql: 'CREATE TABLE records (id INT PRIMARY KEY, name VARCHAR(50));\\nINSERT INTO records VALUES (1, "Alice"), (2, "Bob");',
          starterSql: '',
          solutionSql: 'SELECT * FROM records;',
          hints: ['Use SELECT * to project all records.']
        }];
        topic.challenge = topic.challenges[0];
      }

      topic.challenges.forEach((ch, chIdx) => {
        const item = document.createElement('div');
        item.className = 'inner-card rounded-xl p-5 space-y-4 border border-slate-800 shadow-xl';
        item.innerHTML = \`
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-xs font-bold">
                #\${chIdx + 1}
              </span>
              <input type="text" value="\${ch.title || 'Challenge ' + (chIdx + 1)}" onchange="updateChallengeField(\${chIdx}, 'title', this.value)" class="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 outline-none w-72" />
            </div>

            <div class="flex items-center gap-2">
              <select onchange="updateChallengeField(\${chIdx}, 'difficulty', this.value)" class="bg-[#040810] border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-1">
                <option value="Easy" \${ch.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                <option value="Medium" \${ch.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Hard" \${ch.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
              </select>

              <button onclick="removeCodingChallenge(\${chIdx})" title="Delete Challenge" class="text-slate-500 hover:text-red-400 p-1.5 rounded cursor-pointer transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Problem Statement / Instructions</label>
            <textarea rows="3" onchange="updateChallengeField(\${chIdx}, 'instructions', this.value)" class="w-full bg-[#040810] border border-slate-800 rounded-xl p-3 text-xs text-sky-200 font-mono focus:border-cyan-500/50">\${ch.instructions || ''}</textarea>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Database Schema SQL (CREATE TABLE & INSERT Data)</label>
            <textarea rows="4" onchange="updateChallengeField(\${chIdx}, 'schemaSql', this.value)" class="w-full bg-[#040810] border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:border-cyan-500/50">\${ch.schemaSql || ''}</textarea>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-[#F59E0B]">Benchmark Solution SQL (Silent Verification Only)</label>
              <span class="text-[11px] text-emerald-400 font-medium">✓ Editor starts 100% empty for student</span>
            </div>
            <textarea rows="3" onchange="updateChallengeField(\${chIdx}, 'solutionSql', this.value)" class="w-full bg-[#040810] border border-amber-500/40 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:border-amber-500">\${ch.solutionSql || ''}</textarea>
          </div>
        \`;
        container.appendChild(item);
      });
      lucide.createIcons();
    }

    function addNewCodingChallenge() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;
      if (!topic.challenges) topic.challenges = [];
      const newIdx = topic.challenges.length + 1;
      topic.challenges.push({
        id: \`ch-\${Date.now()}-\${newIdx}\`,
        title: \`\${topic.title.replace(/^\\d+\\.\\s*/, '')} Practice \${newIdx}\`,
        difficulty: 'Medium',
        instructions: 'Write a SQL query to solve the challenge requirement.',
        schemaSql: 'CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, amount DECIMAL(10,2));\\nINSERT INTO orders VALUES (1, 101, 250.00), (2, 102, 450.50);',
        starterSql: '',
        solutionSql: 'SELECT * FROM orders WHERE amount > 300;',
        hints: ['Apply appropriate filtering conditions.']
      });
      topic.challenge = topic.challenges[0];
      saveTopicsToStorage();
      renderCodingChallengesList(topic);
      document.getElementById('badge-coding-count').textContent = topic.challenges.length;
      document.getElementById('nav-coding-count').textContent = topic.challenges.length;
    }

    function removeCodingChallenge(chIdx) {
      const topic = topics[currentTopicIndex];
      if (!topic || !topic.challenges) return;
      if (topic.challenges.length <= 1) {
        alert('Module must have at least one coding challenge.');
        return;
      }
      topic.challenges.splice(chIdx, 1);
      topic.challenge = topic.challenges[0];
      saveTopicsToStorage();
      renderCodingChallengesList(topic);
      document.getElementById('badge-coding-count').textContent = topic.challenges.length;
      document.getElementById('nav-coding-count').textContent = topic.challenges.length;
    }

    function updateChallengeField(chIdx, field, val) {
      const topic = topics[currentTopicIndex];
      if (!topic?.challenges?.[chIdx]) return;
      topic.challenges[chIdx][field] = val;
      if (chIdx === 0) topic.challenge = topic.challenges[0];
      saveTopicsToStorage();
    }

    // Tab 7: Manage All Modules List
    function renderAllModulesManagementList() {
      const container = document.getElementById('all-modules-management-list');
      if (!container) return;
      container.innerHTML = '';

      topics.forEach((t, i) => {
        const item = document.createElement('div');
        item.className = \`p-4 rounded-xl border flex items-center justify-between gap-4 transition cursor-pointer \${i === currentTopicIndex ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(0,210,255,0.15)]' : 'inner-card border-slate-800 hover:border-slate-700'}\`;
        item.onclick = () => {
          currentTopicIndex = i;
          renderCurrentTopic();
          switchMainTab('videos');
        };

        const subCount = t.subModules?.length || 0;
        const qCount = t.quiz?.questions?.length || 0;
        const cCount = t.challenges?.length || 1;

        item.innerHTML = \`
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center">
              \${t.order || (i + 1)}
            </span>
            <div>
              <p class="text-xs font-bold text-white">\${t.title}</p>
              <p class="text-[11px] text-slate-400">\${t.level || 'Beginner'} &bull; \${subCount} Submodules &bull; \${qCount} Quizzes &bull; \${cCount} Challenges</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-cyan-400 font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-800">
              Edit Module &rarr;
            </span>
          </div>
        \`;
        container.appendChild(item);
      });
      lucide.createIcons();
    }

    // Switch Main Tabs
    function switchMainTab(tab) {
      const tabs = ['videos', 'submodules', 'theory', 'mindmap', 'quiz', 'sql', 'manage'];
      tabs.forEach(t => {
        const btn = document.getElementById(\`tab-btn-\${t}\`);
        const nav = document.getElementById(\`nav-\${t}\`);
        const activeClass = 'py-2 px-4 rounded-xl text-xs font-bold text-[#00D2FF] bg-cyan-950/40 border border-cyan-500/40 transition cursor-pointer whitespace-nowrap';
        const inactiveClass = 'py-2 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer whitespace-nowrap';
        if (btn) btn.className = (t === tab) ? activeClass : inactiveClass;

        if (nav) {
          nav.className = (t === tab)
            ? 'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-950/40 border border-cyan-500/50 text-[#00D2FF] shadow-[0_0_15px_rgba(0,210,255,0.2)] transition'
            : 'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition';
        }
      });

      document.getElementById('view-combined-studio').style.display = tab === 'videos' ? 'grid' : 'none';
      document.getElementById('view-submodules-tab').style.display = tab === 'submodules' ? 'block' : 'none';
      document.getElementById('view-theory-tab').style.display = tab === 'theory' ? 'block' : 'none';
      document.getElementById('view-mindmap-tab').style.display = tab === 'mindmap' ? 'block' : 'none';
      document.getElementById('view-quiz-tab').style.display = tab === 'quiz' ? 'block' : 'none';
      document.getElementById('view-sql-tab').style.display = tab === 'sql' ? 'block' : 'none';
      document.getElementById('view-manage-tab').style.display = tab === 'manage' ? 'block' : 'none';
      lucide.createIcons();
    }

    // Publish Changes Button Handler
    function publishCurriculumChanges() {
      saveTopicsToStorage();
      try {
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.15 } });
      } catch (e) {}
      alert('✓ All curriculum changes (including submodules and verified video durations) are live!');
    }

    // Export JSON
    function exportCurriculumJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(topics, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', 'course_data.json');
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    // Import JSON
    function importCurriculumJSON(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            topics = parsed;
            saveTopicsToStorage();
            populateTopicDropdown();
            renderCurrentTopic();
            renderAllModulesManagementList();
            alert(\`Curriculum successfully loaded (\${parsed.length} modules)!\`);
          } else {
            alert('Invalid course_data.json file.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }

    // Preview as Student Modal
    function openStudentPreviewModal() {
      const topic = topics[currentTopicIndex];
      if (!topic) return;

      document.getElementById('preview-modal-title').textContent = \`Preview: \${topic.title}\`;
      document.getElementById('preview-iframe').src = topic.video?.embedUrl || 'https://www.youtube.com/embed/A9TOuDZTPDU';

      const subHtml = (topic.subModules || []).map(s => \`
        <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300">
          ↳ \${s.title} (\${s.duration || '10 mins'})
        </span>
      \`).join('');
      document.getElementById('preview-submodules-content').innerHTML = subHtml || '<span class="text-slate-500">No submodules configured.</span>';

      document.getElementById('preview-theory-content').innerHTML = \`
        <div class="font-bold text-white">\${topic.theory?.title || topic.title}</div>
        <p>\${topic.theory?.summary || ''}</p>
        <pre class="bg-black/50 p-2 rounded text-cyan-300 font-mono">\${topic.theory?.syntax || 'SELECT * FROM table;'}</pre>
      \`;

      const qHtml = (topic.quiz?.questions || []).map((q, idx) => \`
        <div class="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <div class="font-semibold text-slate-200">Q\${idx + 1}: \${q.question}</div>
          <div class="text-emerald-400 text-[11px] mt-1">✓ Correct Option: \${q.options?.[q.correctIndex] || 'Option A'}</div>
        </div>
      \`).join('');
      document.getElementById('preview-quiz-content').innerHTML = qHtml || '<p class="text-slate-500">No questions.</p>';

      const ch = topic.challenge || (topic.challenges && topic.challenges[0]);
      document.getElementById('preview-coding-task').textContent = ch?.instructions || 'Solve the query.';

      document.getElementById('student-preview-modal').classList.remove('hidden');
    }

    function closeStudentPreviewModal() {
      document.getElementById('student-preview-modal').classList.add('hidden');
      document.getElementById('preview-iframe').src = '';
    }

    // Live search filter in command bar
    function handleLiveSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) return;
      const matchedIdx = topics.findIndex(t => t.title.toLowerCase().includes(q) || t.overview?.toLowerCase().includes(q));
      if (matchedIdx >= 0) {
        currentTopicIndex = matchedIdx;
        document.getElementById('topic-select').value = matchedIdx;
        renderCurrentTopic();
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '..', 'admin.html'), html);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'admin.html'), html);
console.log('Successfully regenerated admin.html and public/admin.html with Submodules & Watch Duration Verification. Size:', html.length);
