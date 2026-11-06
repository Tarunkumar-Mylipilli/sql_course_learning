import { Topic } from '../../types';
import { USER_RECOMMENDED_MASTERCLASSES } from './masterclasses';

export const FUNCTIONS_MODULES: Topic[] = [
  {
    id: 'topic-4-string-functions',
    order: 4,
    slug: 'string-functions',
    title: '4. Built-in String Functions (UPPER, LOWER, CONCAT, SUBSTRING, TRIM, LENGTH, REPLACE)',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Core SQL',
    overview: 'Manipulate textual data: convert case with UPPER/LOWER, concatenate columns, extract pieces with SUBSTRING, clean whitespace with TRIM, and substitute characters with REPLACE.',
    video: {
      title: 'SQL String Functions Tutorial (LENGTH, CONCAT, SUBSTRING, TRIM, REPLACE)',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '10:30',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Formatting strings for clean reporting',
        'Concatenation across columns',
        'Extracting substrings with 1-based indexing',
        'Trimming whitespaces and sanitizing input text',
      ],
    },
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Text Transformation with SQL String Functions',
      summary: 'Databases contain messy real-world text. SQL provides built-in scalar string functions to transform and clean strings directly inside queries.',
      syntax: `SELECT 
  UPPER(name) AS uppercase_name,
  TRIM(name) AS clean_name,
  SUBSTRING(name, 1, 3) AS initials,
  LENGTH(name) AS char_count,
  REPLACE(name, 'a', '@') AS obfuscated
FROM students;`,
      explanation: [
        'UPPER(str) / LOWER(str): Converts characters to uppercase or lowercase.',
        'CONCAT(str1, str2, ...): Merges multiple strings into one.',
        'SUBSTRING(str, start, length): Extracts a portion of text. Note: SQL uses 1-based indexing (start at 1, not 0!).',
        'TRIM(str): Cleans leading and trailing whitespaces.',
        'LENGTH(str): Returns the number of characters in a string.',
        'REPLACE(str, from, to): Substitutes target patterns within a string.',
      ],
      keyRules: [
        'SQL substring indices start at index 1, NOT 0.',
        'String functions return NULL if any required input string is NULL.',
      ],
      commonMistakes: [
        'Using 0 as the starting index for SUBSTRING (returns empty or first char depending on engine).',
      ],
      exampleQuery: `SELECT first_name || ' ' || last_name AS full_name, UPPER(department) AS dept
FROM employees;`,
      exampleExplanation: 'Concatenates first and last name with a space and displays department in uppercase.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q-str-1',
          question: 'What is the starting index in SQL for the SUBSTRING("Database", 1, 4) function?',
          options: ['0', '1', '-1', 'Any index'],
          correctIndex: 1,
          explanation: 'Standard SQL strings are 1-indexed. Position 1 is the first character ("Data").',
        },
        {
          id: 'q-str-2',
          question: 'What is the output of TRIM("  SQL  ")?',
          options: ['"SQL"', '"  SQL"', '"SQL  "', 'NULL'],
          correctIndex: 0,
          explanation: 'TRIM strips both leading and trailing spaces.',
        },
      ],
    },
    challenge: {
      id: 'c-str-1',
      title: 'Practice: Fix Names in a Table (LeetCode 1667)',
      difficulty: 'Easy',
      source: 'LeetCode',
      sourceId: 'LeetCode 1667',
      instructions: 'Fix the names so that only the first character is uppercase and the rest are lowercase. Return `user_id` and formatted `name`, ordered by `user_id`.',
      schemaSql: `
CREATE TABLE users (user_id INT PRIMARY KEY, name VARCHAR(40));
INSERT INTO users VALUES (1, 'aLice'), (2, 'bOB');`,
      tables: [{ name: 'users', columns: [{ name: 'user_id', type: 'INT' }, { name: 'name', type: 'VARCHAR(40)' }], sampleData: [{ user_id: 1, name: 'aLice' }] }],
      starterSql: `SELECT user_id, 
  UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2)) AS name
FROM users
ORDER BY user_id;`,
      solutionSql: `SELECT user_id, UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2)) AS name FROM users ORDER BY user_id;`,
      expectedColumns: ['user_id', 'name'],
      hints: ['Use UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2)) AS name'],
    },
    challenges: [
      {
        id: 'c-str-1',
        title: 'Practice 1: Fix Names in a Table (LeetCode 1667)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 1667',
        instructions: 'Format names with only the 1st letter uppercase: `UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2))` AS name.',
        schemaSql: `CREATE TABLE users (user_id INT PRIMARY KEY, name VARCHAR(40)); INSERT INTO users VALUES (1, 'aLice'), (2, 'bOB');`,
        tables: [{ name: 'users', columns: [{ name: 'user_id', type: 'INT' }, { name: 'name', type: 'VARCHAR(40)' }], sampleData: [{ user_id: 1, name: 'aLice' }] }],
        starterSql: `SELECT user_id, UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2)) AS name FROM users ORDER BY user_id;`,
        solutionSql: `SELECT user_id, UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2)) AS name FROM users ORDER BY user_id;`,
        expectedColumns: ['user_id', 'name'],
        hints: ['UPPER(SUBSTRING(name, 1, 1)) || LOWER(SUBSTRING(name, 2))'],
      },
    ],
  },
  {
    id: 'topic-5-date-functions',
    order: 5,
    slug: 'date-functions',
    title: '5. Date and Time Functions (strftime, DATEDIFF, Date Formatting & Intervals)',
    level: 'Intermediate',
    estimatedMinutes: 20,
    badge: 'Core SQL',
    overview: 'Work with timestamps, calculate day differences, extract Year/Month/Day components, and format dates for monthly analytics and retention tracking.',
    video: {
      title: 'SQL Date & Time Functions Explained',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '11:00',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Date data types: DATE, DATETIME, TIMESTAMP',
        'Extracting Year, Month, Day',
        'Calculating intervals between dates',
        'Formatting dates into YYYY-MM for financial grouping',
      ],
    },
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Temporal Analytics with Date Functions',
      summary: 'Dates and timestamps are critical for cohorts, retention, daily active users (DAU), and financial reporting.',
      syntax: `SELECT 
  trans_date,
  strftime('%Y-%m', trans_date) AS year_month,
  strftime('%Y', trans_date) AS year,
  julianday('2023-10-10') - julianday('2023-10-01') AS days_between
FROM transactions;`,
      explanation: [
        'strftime(\'%Y-%m\', date): Standard format pattern to group by calendar month.',
        'Date Arithmetic: Calculating difference in days between two events (e.g. signup vs first order).',
        'In SQLite and standard SQL: `strftime("%Y-%m", col)` formats Year and Month.',
      ],
      keyRules: [
        'Dates in SQL must always be stored in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`.',
        'Always wrap date strings in single quotes: `WHERE order_date >= \'2023-01-01\'`.',
      ],
      commonMistakes: [
        'Comparing dates in non-standard formats like DD-MM-YYYY as strings (leads to incorrect lexical order!).',
      ],
      exampleQuery: `SELECT strftime('%Y-%m', event_date) AS month, COUNT(*) AS total_logins
FROM logins
GROUP BY month;`,
      exampleExplanation: 'Groups login events by year and month.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q-date-1',
          question: 'What is the standard ISO format for dates in SQL databases?',
          options: ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY', 'Month DD, YYYY'],
          correctIndex: 0,
          explanation: 'Standard SQL ISO 8601 format is YYYY-MM-DD.',
        },
      ],
    },
    challenge: {
      id: 'c-date-1',
      title: 'Practice: Monthly Transactions Grouping (50 SQL #9)',
      difficulty: 'Medium',
      source: 'FAANG',
      sourceId: 'Interview #9 / LeetCode 1193',
      instructions: 'For each month (`strftime("%Y-%m", trans_date) AS month`) and country, report `trans_count` and `trans_total_amount`.',
      schemaSql: `
CREATE TABLE transactions (id INT PRIMARY KEY, country VARCHAR(10), amount INT, trans_date DATE);
INSERT INTO transactions VALUES (121, 'US', 1000, '2018-12-18'), (122, 'US', 2000, '2018-12-19'), (123, 'US', 2000, '2019-01-01');`,
      tables: [{ name: 'transactions', columns: [{ name: 'country', type: 'VARCHAR(10)' }, { name: 'amount', type: 'INT' }], sampleData: [{ country: 'US', amount: 1000 }] }],
      starterSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(amount) AS trans_total_amount FROM transactions GROUP BY month, country;`,
      solutionSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(amount) AS trans_total_amount FROM transactions GROUP BY month, country;`,
      expectedColumns: ['month', 'country', 'trans_count', 'trans_total_amount'],
      hints: ['Use strftime(\'%Y-%m\', trans_date) AS month, GROUP BY month, country'],
    },
    challenges: [
      {
        id: 'c-date-1',
        title: 'Practice: Monthly Transactions Grouping',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'Interview #9 / LeetCode 1193',
        instructions: 'Report month (`strftime("%Y-%m", trans_date) AS month`), country, `COUNT(*) AS trans_count`, and `SUM(amount) AS trans_total_amount`.',
        schemaSql: `CREATE TABLE transactions (id INT PRIMARY KEY, country VARCHAR(10), amount INT, trans_date DATE); INSERT INTO transactions VALUES (121, 'US', 1000, '2018-12-18'), (122, 'US', 2000, '2018-12-19');`,
        tables: [{ name: 'transactions', columns: [{ name: 'country', type: 'VARCHAR(10)' }, { name: 'amount', type: 'INT' }], sampleData: [{ country: 'US', amount: 1000 }] }],
        starterSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(amount) AS trans_total_amount FROM transactions GROUP BY month, country;`,
        solutionSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(amount) AS trans_total_amount FROM transactions GROUP BY month, country;`,
        expectedColumns: ['month', 'country', 'trans_count', 'trans_total_amount'],
        hints: ['strftime(\'%Y-%m\', trans_date)'],
      },
    ],
  },
];
