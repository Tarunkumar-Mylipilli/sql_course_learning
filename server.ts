import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client safely
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'sqlmastery-course',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI:', err);
  }
}

// AI Tutor endpoint: explains error, analyzes logic mismatch, and provides progressive beginner hints
app.post('/api/tutor/explain', async (req, res) => {
  try {
    const {
      topicTitle,
      topicLevel,
      challengeDescription,
      schemaSql,
      userSql,
      errorMessage,
      mismatchDetails,
      requestType, // 'hint' | 'concept_breakdown' | 'solution_explanation'
    } = req.body;

    if (!ai || !apiKey) {
      return res.status(200).json({
        fallback: true,
        content:
          "💡 **Built-in Offline Hint**:\n\n1. Check your clause order: `SELECT` -> `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `ORDER BY`.\n2. Verify table and column names against the Schema Inspector.\n3. Remember that string filters in SQL are case-sensitive and enclosed in single quotes like `'Engineering'`.\n4. If comparing NULLs, use `IS NULL` or `IS NOT NULL`, never `= NULL`.",
      });
    }

    let prompt = '';
    if (requestType === 'hint') {
      prompt = `You are a friendly, expert SQL instructor for beginners.
Topic: ${topicTitle} (Level: ${topicLevel || 'Beginner'})
Task: ${challengeDescription}

Database Schema:
\`\`\`sql
${schemaSql}
\`\`\`

User's current query:
\`\`\`sql
${userSql || '(No query entered yet)'}
\`\`\`

${errorMessage ? `SQL Error encountered: ${errorMessage}` : ''}
${mismatchDetails ? `Output mismatch: ${mismatchDetails}` : ''}

Please provide a guided pedagogical hint without revealing the entire answer directly:
1. Explain in 1-2 friendly sentences what might be slightly off.
2. Give a mini code clue showing the syntax pattern.
3. Suggest the immediate next step.`;
    } else {
      prompt = `You are an expert SQL teacher.
Provide a clear breakdown for the challenge: "${topicTitle}".
Task: ${challengeDescription}

Schema:
\`\`\`sql
${schemaSql}
\`\`\`

Student Query:
\`\`\`sql
${userSql}
\`\`\`

Break down the concept:
1. **Core Concept**: Why we use this specific SQL technique.
2. **Step-by-step logic**: How to construct the query clause by clause.
3. **Common Pitfalls**: What beginners often get wrong here.
4. **Clean Solution Example**: The optimal standard SQL query.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are SQLMastery AI, an encouraging and clear interactive SQL tutor. Format explanations with clean Markdown, bold headers, and code fences.',
      },
    });

    return res.json({
      content: response.text || 'Keep going! Try checking your column names and SQL clauses.',
    });
  } catch (error: any) {
    console.error('Tutor explain error:', error);
    return res.status(200).json({
      fallback: true,
      content:
        "💡 Check your SQL syntax: Ensure you have selected the right columns and filtered according to the requirements.",
    });
  }
});

// Check API key status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
  });
});

// Mount Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SQLMastery platform running on http://localhost:${port}`);
  });
}

startServer();
