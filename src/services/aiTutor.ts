// Dedicated AI Tutor Service with 3 Cognitive Memory-Retention Learning Styles
// 100% Free & Anonymous: No sign-in or account registration required!
// Primary: Free open CORS AI text generation (Pollinations AI)
// Fallback: Rich deterministic pedagogical cognitive engines

export type ExplanationStyle = 
  | 'analogy'       // Real-world analogy / Mental Model (Story & intuition for visual/associative memory)
  | 'breakdown'     // Step-by-step Execution Engine breakdown (How the database engine executes step-by-step)
  | 'interview';    // Senior Developer & Interview Cheat-Sheet (Mnemonic rules, pitfalls, interview tricks)

export interface AITutorRequest {
  topicTitle: string;
  topicLevel?: string;
  challengeInstructions: string;
  schemaSql: string;
  userSql: string;
  errorMessage?: string;
  mismatchDetails?: string;
  requestType: 'hint' | 'concept_breakdown' | 'solution_explanation';
  style?: ExplanationStyle;
}

export interface AITutorResponse {
  content: string;
  source: 'ai-direct' | 'fallback' | 'proxy';
  remainingRequestsToday?: number;
}

const MAX_USER_SQL_LENGTH = 4000;
const MAX_ERROR_MSG_LENGTH = 1000;
const MAX_MISMATCH_LENGTH = 1000;
const DAILY_REQUEST_LIMIT = 50;
const RATE_LIMIT_STORAGE_KEY = 'sqlmastery_ai_tutor_rate_limit_v3';

export const STYLE_DEFINITIONS: Record<ExplanationStyle, {
  name: string;
  tagline: string;
  icon: string;
  description: string;
  systemInstruction: string;
}> = {
  analogy: {
    name: 'Real-World Analogy (Intuition & Memory)',
    tagline: 'Connect to real life for long-term memory',
    icon: 'Brain',
    description: 'Explains SQL clauses using physical everyday metaphors (spreadsheets, libraries, filing cabinets) so concepts stick instantly.',
    systemInstruction: `Explain this SQL concept using a vivid REAL-WORLD PHYSICAL ANALOGY (e.g. library books, restaurant orders, airport luggage sorting, or grocery store shelves).
Anchor the explanation into student's memory with:
1. 💡 The Physical Metaphor (1-2 sentences)
2. 🔄 How It Maps to SQL Clauses (e.g., Table = Filing cabinet, WHERE = Security guard filter, GROUP BY = Sorting into color bins)
3. 🧠 Memory Anchor Trigger (A one-sentence takeaway rule that guarantees they never forget it).
Keep it conversational, encouraging, and under 150 words. Do NOT reveal the full SQL solution code.`
  },
  breakdown: {
    name: 'Engine Execution Flow (Step-by-Step)',
    tagline: 'See what the database engine does under the hood',
    icon: 'Layers',
    description: 'Breaks down the exact logical order the SQL engine executes (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY).',
    systemInstruction: `Explain this SQL topic from the perspective of the Database Query Execution Engine (Logical Query Processing Order).
Walk the student through:
1. ⚙️ Execution Flow: Step 1 (FROM/JOIN) -> Step 2 (WHERE) -> Step 3 (GROUP BY) -> Step 4 (HAVING) -> Step 5 (SELECT) -> Step 6 (ORDER BY / LIMIT).
2. 🎯 What happens to the data rows at each step for this problem.
3. ⚠️ Common Engine Trap to Avoid (e.g., trying to use SELECT aliases in WHERE before SELECT has executed).
Format cleanly with numbered steps. Keep it under 150 words. Do NOT provide the full completed query.`
  },
  interview: {
    name: 'Senior Dev & Interview Mnemonic',
    tagline: 'FAANG interview patterns & mental hacks',
    icon: 'Flame',
    description: 'High-yield mental models, interview flash-rules, common edge cases (NULLs, duplicates), and pattern-matching tricks.',
    systemInstruction: `Explain this SQL topic like a Senior FAANG Staff Engineer prepping a student for a tech interview.
Provide:
1. 🏆 High-Yield Pattern: The classic problem archetype this belongs to (e.g., "Top-N per group", "Unmatched records", "Cumulative metric").
2. ⚡ The 3-Second Mental Checklist (Quick checklist before writing the query).
3. 💣 Trap Alert: The exact edge case interviewers test (e.g. NULL handling in NOT IN, Cartesian product on multi-table joins, duplicates in COUNT).
Keep it punchy, high-impact, formatted with clean bullets. Under 150 words.`
  }
};

function checkAndIncrementRateLimit(): { allowed: boolean; remaining: number } {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    let state = { date: today, count: 0 };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) {
        state = parsed;
      }
    }

    if (state.count >= DAILY_REQUEST_LIMIT) {
      return { allowed: false, remaining: 0 };
    }

    state.count += 1;
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
    return { allowed: true, remaining: DAILY_REQUEST_LIMIT - state.count };
  } catch {
    return { allowed: true, remaining: 50 };
  }
}

/**
 * Keyless & Account-less AI Query via free browser CORS endpoint
 */
async function queryFreeAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const combinedPrompt = `${systemPrompt}\n\nTask:\n${userPrompt}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(combinedPrompt)}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim() && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
        return text.trim();
      }
    }
  } catch (err) {
    // network or abort
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
}

export async function askAITutor(req: AITutorRequest): Promise<AITutorResponse> {
  const selectedStyle: ExplanationStyle = req.style || 'analogy';
  const styleConfig = STYLE_DEFINITIONS[selectedStyle];

  // 1. Check rate limits
  const { allowed, remaining } = checkAndIncrementRateLimit();
  if (!allowed) {
    return {
      content: `⚠️ Daily AI assistance limit reached (${DAILY_REQUEST_LIMIT} requests). You can still review the Theory notes, syntax reference, or test output.`,
      source: 'fallback',
      remainingRequestsToday: 0,
    };
  }

  // 2. Sanitize and cap input parameters
  const userSql = (req.userSql || '').slice(0, MAX_USER_SQL_LENGTH);
  const errMsg = (req.errorMessage || '').slice(0, MAX_ERROR_MSG_LENGTH);
  const mismatch = (req.mismatchDetails || '').slice(0, MAX_MISMATCH_LENGTH);

  // 3. Optional backend proxy via VITE_AI_PROXY_URL
  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL;
  if (proxyUrl) {
    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          style: selectedStyle,
          userSql,
          errorMessage: errMsg,
          mismatchDetails: mismatch,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          content: data.explanation || data.reply || 'Analysis complete.',
          source: 'proxy',
          remainingRequestsToday: remaining,
        };
      }
    } catch {
      // ignore and continue
    }
  }

  // 4. Zero-Account, Keyless In-Browser AI Engine
  const systemPrompt = `You are SQLMastery AI Pedagogical Tutor, specializing in high-retention cognitive learning techniques.
Style: ${styleConfig.name}.
${styleConfig.systemInstruction}

Rules:
1. Explain simply and clearly, reinforcing student's memory.
2. NEVER give the complete finished solution query directly; guide them so they learn by doing.
3. Keep the total response concise (under 160 words). Format with clear emojis and bold terms.`;

  const userPrompt = `
Topic: ${req.topicTitle} (${req.topicLevel || 'Standard'})
Question Goal: ${req.challengeInstructions}
Student's Current Query Attempt:
\`\`\`sql
${userSql || '(not written yet)'}
\`\`\`
${errMsg ? `Current SQL Error: ${errMsg}` : ''}
${mismatch ? `Output Mismatch: ${mismatch}` : ''}

Action: Explain this topic and approach using the "${styleConfig.name}" style so it cements into long-term memory.
`;

  const aiText = await queryFreeAI(systemPrompt, userPrompt);
  if (aiText) {
    return {
      content: aiText,
      source: 'ai-direct',
      remainingRequestsToday: remaining,
    };
  }

  // 5. High-quality deterministic fallback tailored to chosen style & topic
  // Guaranteed instantaneous response without requiring any account, login, or network!
  return {
    content: generateDeterministicMultiStyleHint(req, selectedStyle),
    source: 'fallback',
    remainingRequestsToday: remaining,
  };
}

function generateDeterministicMultiStyleHint(req: AITutorRequest, style: ExplanationStyle): string {
  const err = req.errorMessage || '';
  const topic = req.topicTitle.toLowerCase();
  const instr = req.challengeInstructions.toLowerCase();

  if (style === 'analogy') {
    if (topic.includes('join') || instr.includes('join')) {
      return `💡 **Real-World Metaphor (Passport & Boarding Pass):**
Imagine you have a list of Travelers (Table A) and Flight Tickets (Table B).
- **INNER JOIN:** Only lets people board who have BOTH a traveler record AND a ticket.
- **LEFT JOIN:** Welcomes EVERY traveler, even if their ticket slot is blank (NULL).
🧠 **Memory Anchor:** *Left is Loyal* — everything from the LEFT table stays, unmatched right columns become NULL.`;
    }
    if (topic.includes('group') || topic.includes('aggregate') || instr.includes('group by') || instr.includes('count') || instr.includes('sum')) {
      return `💡 **Real-World Metaphor (Sorting Laundry into Baskets):**
- **GROUP BY** is like sorting clothes into baskets by color (e.g. whites, darks, colored).
- **Aggregates (COUNT, SUM, AVG)** weigh or count each basket as a single summary row.
- **HAVING** is inspecting the finished basket (e.g., "only wash baskets that have > 5 items").
🧠 **Memory Anchor:** *WHERE filters before the baskets are made; HAVING filters the baskets after sorting!*`;
    }
    if (topic.includes('where') || topic.includes('filter') || instr.includes('where')) {
      return `💡 **Real-World Metaphor (Club Bouncer at the Gate):**
Think of the **WHERE** clause as a security guard checking IDs at the club entrance.
- If a guest satisfies the condition (e.g. \`age >= 21\`), they enter the database room.
- If not, they are immediately turned away.
🧠 **Memory Anchor:** *WHERE filters individual rows from the source table before any grouping or sorting occurs!*`;
    }
    return `💡 **Real-World Metaphor (Filing Cabinet & Highlighters):**
- Think of your table as a physical drawer of student folders.
- **SELECT** is choosing which fields you write down on your notepad (e.g. just \`name\` and \`grade\`).
- **FROM** is picking which cabinet drawer you opened.
🧠 **Memory Anchor:** *Always open the drawer (FROM) before picking what to inspect (SELECT)!*`;
  }

  if (style === 'breakdown') {
    return `⚙️ **Database Engine Execution Order:**
1. **FROM & JOIN:** The engine locates the physical table(s) on disk and builds the working dataset.
2. **WHERE:** Rows that do not meet your filter criteria are dropped immediately to save memory.
3. **GROUP BY:** Surviving rows are gathered into grouped buckets by your chosen key(s).
4. **HAVING:** Filters the aggregated buckets (e.g., \`COUNT(*) > 1\`).
5. **SELECT:** Only now does the engine project the requested columns and aliases.
6. **ORDER BY & LIMIT:** Final sorting and slicing of the result set.
⚠️ **Key Trap:** You cannot use column aliases created in \`SELECT\` inside the \`WHERE\` clause, because \`WHERE\` runs *before* \`SELECT\`!`;
  }

  // Interview / Senior Dev style
  return `🏆 **Senior Dev & Interview Mental Checklist:**
• **Pattern Archetype:** ${topic.includes('join') || instr.includes('join') ? 'Relational Data Assembly' : topic.includes('group') || instr.includes('count') ? 'Summary & Aggregation Bucket' : 'Row-Level Filtering & Extraction'}.
• **3-Second Mental Checklist:**
  1. What is the grain of the output? (One row per patient? One row per doctor? Total count?)
  2. Are there NULL values? (Remember: \`NULL = NULL\` is FALSE; always use \`IS NULL\` or \`COALESCE\`).
  3. Could duplicates artificially inflate sums or counts? (Consider \`DISTINCT\`).
• **Interview Trap Alert:** ${err ? `Fix error: "${err}". Check column spelling and table aliases.` : 'Watch out for Cartesian products (missing JOIN conditions) and filtering aggregated fields in WHERE instead of HAVING.'}`;
}
