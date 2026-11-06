import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Search,
  ExternalLink,
  Code2,
  Table,
  Layers,
  Key,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const NotesHub: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'commands' | 'types' | 'operators' | 'scenarios'>('all');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const realScenarios = [
    {
      ask: 'How many students scored above 80?',
      clause: 'COUNT() with WHERE',
      query: 'SELECT COUNT(*) FROM students WHERE marks > 80;',
    },
    {
      ask: 'Total sales per region',
      clause: 'SUM() with GROUP BY',
      query: 'SELECT region, SUM(sales) FROM orders GROUP BY region;',
    },
    {
      ask: 'Departments with more than 5 employees',
      clause: 'GROUP BY with HAVING',
      query: 'SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5;',
    },
    {
      ask: 'Top 5 highest-paid employees',
      clause: 'ORDER BY + LIMIT',
      query: 'SELECT * FROM emp ORDER BY salary DESC LIMIT 5;',
    },
    {
      ask: 'Combine employee data with department names',
      clause: 'INNER JOIN',
      query: 'SELECT e.name, d.dept_name FROM emp e JOIN dept d ON e.dept_id = d.id;',
    },
    {
      ask: 'Customers who never placed an order',
      clause: 'LEFT JOIN + IS NULL',
      query: 'SELECT c.* FROM customers c LEFT JOIN orders o ON c.id = o.cust_id WHERE o.id IS NULL;',
    },
    {
      ask: 'Names starting with letter "A"',
      clause: 'LIKE with % wildcard',
      query: 'SELECT * FROM students WHERE name LIKE \'A%\';',
    },
    {
      ask: 'Remove duplicate cities from result',
      clause: 'DISTINCT',
      query: 'SELECT DISTINCT city FROM customers;',
    },
    {
      ask: 'Employees earning between 30k and 60k',
      clause: 'BETWEEN',
      query: 'SELECT * FROM emp WHERE salary BETWEEN 30000 AND 60000;',
    },
    {
      ask: 'Find rows with missing email address',
      clause: 'IS NULL',
      query: 'SELECT * FROM customers WHERE email IS NULL;',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" /> Complete SQL Study Notes & Cheat Sheet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive SQL Reference Manual
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Curated from LearnSQL, NewtonSchool, W3Schools, and GeeksforGeeks: covers SQL Commands (DDL/DML/DQL/TCL), Data Types, Constraints, Operators, and Real Scenario Lookups.
          </p>

          {/* External curated resources */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <a
              href="https://www.w3schools.com/sql/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 transition"
            >
              <span>W3Schools SQL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.geeksforgeeks.org/sql/sql-tutorial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition"
            >
              <span>GeeksforGeeks SQL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://datalemur.com/questions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition"
            >
              <span>DataLemur FAANG</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Notes' },
              { id: 'commands', label: 'Commands (DDL/DML/TCL)' },
              { id: 'types', label: 'Types & Constraints' },
              { id: 'operators', label: 'Symbols & Operators' },
              { id: 'scenarios', label: 'Real Problem → SQL' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords or clauses..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Section 1: The 5 SQL Command Families */}
      {(selectedCategory === 'all' || selectedCategory === 'commands') && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">1. The 5 SQL Command Families</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                DDL (Data Definition)
              </span>
              <h3 className="text-xs font-bold text-white">Defines & Alters Schema Structure</h3>
              <p className="text-xs text-slate-400">
                Commands that change table structures. Automatically committed:
              </p>
              <ul className="text-xs font-mono text-sky-300 space-y-1">
                <li>• CREATE — Creates tables/views/database</li>
                <li>• ALTER — Adds, drops, or alters columns</li>
                <li>• DROP — Deletes entire table and structure</li>
                <li>• TRUNCATE — Empties all rows (faster than delete)</li>
                <li>• RENAME — Changes table name</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                DML (Data Manipulation)
              </span>
              <h3 className="text-xs font-bold text-white">Modifies Records Inside Tables</h3>
              <p className="text-xs text-slate-400">Commands to manage row-level data:</p>
              <ul className="text-xs font-mono text-emerald-300 space-y-1">
                <li>• INSERT INTO table VALUES (...)</li>
                <li>• UPDATE table SET col = val WHERE ...</li>
                <li>• DELETE FROM table WHERE ...</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                TCL (Transaction Control)
              </span>
              <h3 className="text-xs font-bold text-white">Atomic Transaction Management</h3>
              <p className="text-xs text-slate-400">Guarantees ACID transactions across operations:</p>
              <ul className="text-xs font-mono text-amber-300 space-y-1">
                <li>• COMMIT — Saves temporary changes permanently</li>
                <li>• ROLLBACK — Reverts uncommitted operations</li>
                <li>• SAVEPOINT sp1 — Marks save point in transaction</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Data Types & Constraints */}
      {(selectedCategory === 'all' || selectedCategory === 'types') && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">2. SQL Data Types & Constraints</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Data Type</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono text-slate-300">
                  <tr><td className="p-3 text-sky-300">INT</td><td className="p-3 font-sans">Whole numbers</td><td className="p-3">1, 100, -5</td></tr>
                  <tr><td className="p-3 text-sky-300">VARCHAR(n)</td><td className="p-3 font-sans">Variable-length text</td><td className="p-3">'Rohith', 'Paris'</td></tr>
                  <tr><td className="p-3 text-sky-300">FLOAT / DECIMAL</td><td className="p-3 font-sans">Exact/floating decimals</td><td className="p-3">95.5, 109.99</td></tr>
                  <tr><td className="p-3 text-sky-300">DATE</td><td className="p-3 font-sans">Calendar date (YYYY-MM-DD)</td><td className="p-3">'2026-02-17'</td></tr>
                  <tr><td className="p-3 text-sky-300">BOOLEAN</td><td className="p-3 font-sans">True or False flag</td><td className="p-3">TRUE / FALSE (1 / 0)</td></tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Constraint</th>
                    <th className="p-3">Rule Enforced</th>
                    <th className="p-3">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60 font-mono text-slate-300">
                  <tr><td className="p-3 text-emerald-300">PRIMARY KEY</td><td className="p-3 font-sans">Unique identifier (NOT NULL & UNIQUE)</td><td className="p-3">id INT PRIMARY KEY</td></tr>
                  <tr><td className="p-3 text-emerald-300">NOT NULL</td><td className="p-3 font-sans">Value cannot be missing</td><td className="p-3">name VARCHAR(50) NOT NULL</td></tr>
                  <tr><td className="p-3 text-emerald-300">UNIQUE</td><td className="p-3 font-sans">No duplicate values allowed</td><td className="p-3">email UNIQUE</td></tr>
                  <tr><td className="p-3 text-emerald-300">CHECK</td><td className="p-3 font-sans">Validates column condition</td><td className="p-3">CHECK (age &gt;= 18)</td></tr>
                  <tr><td className="p-3 text-emerald-300">DEFAULT</td><td className="p-3 font-sans">Fallback when omitted</td><td className="p-3">course DEFAULT 'SQL'</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Real Problem -> SQL Query Quick Lookup */}
      {(selectedCategory === 'all' || selectedCategory === 'scenarios') && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">3. Real Problem → SQL Solution Matrix</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">If You Need To...</th>
                  <th className="p-3">SQL Construct</th>
                  <th className="p-3">Working Query</th>
                  <th className="p-3 text-right">Copy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-300">
                {realScenarios
                  .filter(
                    (s) =>
                      !searchQuery ||
                      s.ask.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.query.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60">
                      <td className="p-3 font-medium text-white">{item.ask}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
                          {item.clause}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-emerald-300 text-[11px] max-w-md truncate">
                        {item.query}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleCopy(`scen-${idx}`, item.query)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          {copiedIndex === `scen-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
