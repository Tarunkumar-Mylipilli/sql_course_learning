import { Topic } from '../../types';
import { USER_RECOMMENDED_MASTERCLASSES } from './masterclasses';

export const VIEWS_INDEXES_MODULES: Topic[] = [
  {
    id: 'topic-16-views-indexes',
    order: 16,
    slug: 'views-indexes-basics',
    title: '16. Views & Indexes Basics (Virtual Tables, Performance & DDL Commands)',
    level: 'Advanced',
    estimatedMinutes: 20,
    badge: 'Advanced SQL',
    overview: 'Learn how to create reusable virtual tables with Views (CREATE VIEW) and accelerate query lookups with Indexes (CREATE INDEX). Understand DDL vs DML commands and indexing trade-offs.',
    video: {
      title: 'SQL Views and Indexes Tutorial for Beginners',
      embedUrl: 'https://www.youtube.com/embed/SSKVgrwhzus',
      duration: '14:00',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'What is a View: a saved virtual table from a query',
        'Why use views: security, abstraction, query reusability',
        'What is an Index: B-Tree structure speeding up WHERE and JOIN lookups',
        'Cost of indexes: extra disk space and slower INSERT/UPDATE/DELETE operations',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL Views and Indexes Explained in 8 Minutes',
        embedUrl: 'https://www.youtube.com/embed/SSKVgrwhzus',
        duration: '8:40',
        channel: 'Programming with Mosh',
        language: 'English',
        summaryPoints: [
          'Guide on how indexes make database queries 100x faster',
          'Creating views to simplify complex joins',
        ],
      },
    ],
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Performance & Abstraction: Views & Indexes',
      summary: 'Views provide simplified, secure virtual access to queries. Indexes provide fast pointer lookups (B-Tree) to avoid full-table scans.',
      syntax: `-- Creating a View
CREATE VIEW high_earners_view AS
SELECT id, name, department, salary
FROM employees
WHERE salary > 8000;

-- Creating an Index
CREATE INDEX idx_emp_dept ON employees(department);`,
      explanation: [
        'View: A saved SELECT statement that behaves like a table. A view does NOT store data itself (unless it is an indexed/materialized view); it executes the underlying query whenever called.',
        'Why use Views: Encapsulates complex joins into a clean interface, restricts sensitive columns (e.g. hiding SSN/passwords), and standardizes calculations.',
        'Index: An auxiliary data structure (typically a balanced B-Tree) that maps column values to row locations on disk, allowing logarithmic O(log N) lookups instead of O(N) full table scans.',
        'Index Trade-offs: Reads (`SELECT WHERE col = val`) become dramatically faster, but Writes (`INSERT`, `UPDATE`, `DELETE`) become slightly slower because the index tree must be rebalanced.',
        'SQL Command Families: DDL (Data Definition: CREATE, ALTER, DROP, TRUNCATE), DML (Data Manipulation: INSERT, UPDATE, DELETE), DQL (Data Query: SELECT), TCL (Transaction: COMMIT, ROLLBACK).',
      ],
      keyRules: [
        'Do not over-index every column. Index columns that are frequently filtered in WHERE or joined in ON.',
        'Primary keys are automatically indexed by relational databases.',
      ],
      commonMistakes: [
        'Assuming a standard VIEW duplicates and stores the underlying data (it is only a virtual query definition!).',
      ],
      exampleQuery: `CREATE VIEW tech_leads AS
SELECT name, salary FROM employees WHERE department = 'Engineering';

SELECT * FROM tech_leads WHERE salary > 9000;`,
      exampleExplanation: 'Creates a virtual view tech_leads and then queries it like a normal table.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q-view-1',
          question: 'Does a standard SQL VIEW store duplicate copies of table data on the hard drive?',
          options: [
            'No, a view is a virtual table that executes its underlying query dynamically when accessed',
            'Yes, it creates a physical copy of all rows',
            'Only on Tuesdays',
            'It stores data in RAM only',
          ],
          correctIndex: 0,
          explanation: 'Standard views do not store physical rows; they store the query definition.',
        },
        {
          id: 'q-view-2',
          question: 'What is the main performance cost of adding an INDEX to a database table column?',
          options: [
            'Reads become slower',
            'Writes (INSERT/UPDATE/DELETE) become slightly slower because the index structure must be maintained',
            'It deletes old rows',
            'No cost at all',
          ],
          correctIndex: 1,
          explanation: 'Every write requires updating both the base table and the index tree structure.',
        },
      ],
    },
    challenge: {
      id: 'c-view-1',
      title: 'Practice: Creating a Virtual View & Index',
      difficulty: 'Medium',
      source: 'Standard',
      instructions: 'Create a view named `active_students` that selects `id`, `name`, and `marks` from the `students` table where `is_active = 1`. Then write a query selecting all rows from `active_students` sorted by `marks` descending.',
      schemaSql: `
CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50), marks FLOAT, is_active INT);
INSERT INTO students VALUES 
(1, 'Rohith', 95.5, 1),
(2, 'Surya', 88.0, 1),
(3, 'Siva', 72.5, 0),
(4, 'Sai', 91.0, 1);`,
      tables: [{ name: 'students', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'marks', type: 'FLOAT' }, { name: 'is_active', type: 'INT' }], sampleData: [{ name: 'Rohith', marks: 95.5, is_active: 1 }] }],
      starterSql: '-- Write your SQL query here\n',
      solutionSql: `CREATE VIEW active_students AS SELECT id, name, marks FROM students WHERE is_active = 1; SELECT id, name, marks FROM active_students ORDER BY marks DESC;`,
      expectedColumns: ['id', 'name', 'marks'],
      hints: ['CREATE VIEW active_students AS SELECT id, name, marks FROM students WHERE is_active = 1; followed by SELECT * FROM active_students ORDER BY marks DESC;'],
    },
    challenges: [
      {
        id: 'c-view-1',
        title: 'Practice: Creating a Virtual View & Index',
        difficulty: 'Medium',
        source: 'Standard',
        instructions: 'Create a view `active_students` where `is_active = 1`, and query it ordered by `marks` descending.',
        schemaSql: `CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50), marks FLOAT, is_active INT); INSERT INTO students VALUES (1, 'Rohith', 95.5, 1), (2, 'Surya', 88.0, 1), (3, 'Siva', 72.5, 0), (4, 'Sai', 91.0, 1);`,
        tables: [{ name: 'students', columns: [{ name: 'id', type: 'INT' }, { name: 'name', type: 'VARCHAR(50)' }, { name: 'marks', type: 'FLOAT' }], sampleData: [{ name: 'Rohith', marks: 95.5 }] }],
        starterSql: '-- Write your SQL query here\n',
        solutionSql: `CREATE VIEW active_students AS SELECT id, name, marks FROM students WHERE is_active = 1; SELECT id, name, marks FROM active_students ORDER BY marks DESC;`,
        expectedColumns: ['id', 'name', 'marks'],
        hints: ['CREATE VIEW active_students AS SELECT id, name, marks FROM students WHERE is_active = 1;'],
      },
    ],
  },
];
