// Dedicated AI Tutor Service Abstraction
// Enforces input length caps, session rate limits, and immutable system prompt
// Provides a swap point for future backend proxy via VITE_AI_PROXY_URL

export interface AITutorRequest {
  topicTitle: string;
  topicLevel?: string;
  challengeInstructions: string;
  schemaSql: string;
  userSql: string;
  errorMessage?: string;
  mismatchDetails?: string;
  requestType: 'hint' | 'concept_breakdown' | 'solution_explanation';
}

export interface AITutorResponse {
  content: string;
  source: 'puter' | 'fallback' | 'proxy';
  remainingRequestsToday?: number;
}

const MAX_USER_SQL_LENGTH = 4000;
const MAX_ERROR_MSG_LENGTH = 1000;
const MAX_MISMATCH_LENGTH = 1000;
const DAILY_REQUEST_LIMIT = 25;
const RATE_LIMIT_STORAGE_KEY = 'sqlmastery_ai_tutor_rate_limit_v1';

// Immutable Socratic System Prompt that cannot be bypassed by prompt injection
const IMMUTABLE_SYSTEM_PROMPT = `You are SQLMastery Socratic Tutor.
Your objective is to guide students to write correct SQL on their own without ever giving them the complete answer or solution query upfront.
Rules:
1. Explain the relational concepts simply and clearly.
2. Point out syntax or logical flaws gently.
3. Suggest the clause, operator, or function to look at (e.g. "Look into GROUP BY ... HAVING" or "Consider using LEFT JOIN with IS NULL").
4. NEVER provide the complete SELECT query that solves the challenge.
5. Keep your answer under 120 words. Format cleanly with markdown bullets.`;

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
    return { allowed: true, remaining: 10 };
  }
}

async function loadPuterSdk(): Promise<any> {
  if (typeof (window as any).puter !== 'undefined') {
    return (window as any).puter;
  }

  return new Promise((resolve) => {
    if (document.querySelector('script[src*="puter.com"]')) {
      const checkInterval = setInterval(() => {
        if ((window as any).puter) {
          clearInterval(checkInterval);
          resolve((window as any).puter);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(null);
      }, 4000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => resolve((window as any).puter || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

export async function askAITutor(req: AITutorRequest): Promise<AITutorResponse> {
  // 1. Check rate limits
  const { allowed, remaining } = checkAndIncrementRateLimit();
  if (!allowed) {
    return {
      content: `⚠️ Daily AI assistance limit reached (${DAILY_REQUEST_LIMIT} requests). Please review the Theory notes, syntax reference, or test output.`,
      source: 'fallback',
      remainingRequestsToday: 0,
    };
  }

  // 2. Sanitize and cap input parameters
  const userSql = (req.userSql || '').slice(0, MAX_USER_SQL_LENGTH);
  const errMsg = (req.errorMessage || '').slice(0, MAX_ERROR_MSG_LENGTH);
  const mismatch = (req.mismatchDetails || '').slice(0, MAX_MISMATCH_LENGTH);

  // 3. Check for configured backend proxy (e.g. VITE_AI_PROXY_URL)
  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL;
  if (proxyUrl) {
    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
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
    } catch (err) {
      console.warn('Backend AI proxy failed, falling back to direct provider:', err);
    }
  }

  // 4. In-Browser Provider: Puter.js
  try {
    const puter = await loadPuterSdk();
    if (puter && puter.ai && typeof puter.ai.chat === 'function') {
      const userPrompt = `
Topic: ${req.topicTitle} (${req.topicLevel || 'Standard'})
Challenge Goal: ${req.challengeInstructions}
Student's Current SQL:
\`\`\`sql
${userSql || '(empty)'}
\`\`\`
${errMsg ? `Observed Database Error: ${errMsg}` : ''}
${mismatch ? `Output Mismatch Details: ${mismatch}` : ''}

Task: ${
        req.requestType === 'hint'
          ? 'Provide a gentle hint toward the right SQL clause.'
          : req.requestType === 'concept_breakdown'
          ? 'Explain the SQL concept behind this problem in simple terms.'
          : 'Explain why the error or mismatch occurred and how to reason through it.'
      }
`;

      const response = await puter.ai.chat(
        [
          { role: 'system', content: IMMUTABLE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        { model: 'claude-3-5-sonnet' }
      );

      const content =
        typeof response === 'string'
          ? response
          : response?.message?.content || response?.text || '';

      if (content && content.trim()) {
        return {
          content: content.trim(),
          source: 'puter',
          remainingRequestsToday: remaining,
        };
      }
    }
  } catch (err) {
    console.warn('Puter AI tutor unavailable:', err);
  }

  // 5. Deterministic Socratic fallback if network fails
  return {
    content: generateDeterministicHint(req),
    source: 'fallback',
    remainingRequestsToday: remaining,
  };
}

function generateDeterministicHint(req: AITutorRequest): string {
  const err = req.errorMessage || '';
  const mismatch = req.mismatchDetails || '';

  if (err.includes('no such table')) {
    return 'Check your table names in the `FROM` or `JOIN` clause against the Table Schema tab.';
  }
  if (err.includes('no such column')) {
    return 'One of the column names is misspelled or belongs to a different table. Inspect the Schema column list.';
  }
  if (err.includes('syntax error')) {
    return 'There is a comma, keyword spelling, or parenthesis error in your query. Ensure clauses are in order: `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `ORDER BY`.';
  }
  if (mismatch.includes('Row Count')) {
    return 'Your filtering logic returned a different number of rows. Check your `WHERE` predicates and whether you need `INNER` vs `LEFT JOIN`.';
  }
  if (mismatch.includes('Column Count')) {
    return 'Ensure your `SELECT` clause lists the exact requested columns and column aliases.';
  }

  return `Consider reviewing the module Theory notes for "${req.topicTitle}". Break your query down: first test \`SELECT * FROM table\`, then add filters one clause at a time.`;
}
