import { TopicVideo, TopicTheory, QuizQuestion, CodingChallenge } from '../../types';

export const MODULE_1_VIDEOS: {
  video: TopicVideo;
  alternativeVideos: TopicVideo[];
  addonVideos: TopicVideo[];
} = {
  video: {
    title: 'Select Statement in MySQL | Beginner MySQL Series',
    embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
    duration: '9:15',
    channel: 'Alex The Analyst',
    language: 'English',
    summaryPoints: [
      'How tables, rows, and columns are structured in relational databases',
      'Basic SELECT column_1, column_2 FROM table_name syntax',
      'Why SELECT * should be avoided in production application queries',
      'Using the AS keyword to assign clean, professional column aliases',
      'Executing inline math calculations and expressions directly in projections',
    ],
  },
  alternativeVideos: [
    {
      title: 'SQL Basics Tutorial For Beginners - SELECT, WHERE & Aggregates',
      embedUrl: 'https://www.youtube.com/embed/7S_tz1z_5bA',
      duration: '28:10',
      channel: 'Programming with Mosh',
      language: 'English',
      summaryPoints: [
        'Visual relational database breakdown and column indexing',
        'Mathematical operations and distinct deduplication in SELECT',
        'End-to-end query execution architecture in database engines',
      ],
    },
    {
      title: 'SQL Practice Problems Walkthrough: SELECT & Basic Filtering',
      embedUrl: 'https://www.youtube.com/embed/nopIGY1zJE0',
      duration: '14:40',
      channel: 'CodeBasics',
      language: 'English',
      summaryPoints: [
        'Live SQL query practice solving business reporting asks',
        'Common beginner syntax traps with commas and quotes',
        'Real-world column renaming and output validation',
      ],
    },
  ],
  addonVideos: [
    {
      title: 'SQL Tutorial for Beginners in Telugu - Complete Database & SELECT Guide',
      embedUrl: 'https://www.youtube.com/embed/8F6fv4_MDbM',
      duration: '35:20',
      channel: 'Telugu Tech Academy',
      language: 'Telugu',
      summaryPoints: [
        'Step-by-step foundational explanation of relational tables in Telugu',
        'Writing your very first SELECT queries with clear Telugu commentary',
        'Hands-on column calculations and aliases',
      ],
    },
    {
      title: 'SQL Full Course for Beginners (Zero to Hero Masterclass)',
      embedUrl: 'https://www.youtube.com/embed/SSKVgrwhzus',
      duration: '45:10',
      channel: 'Data with Baraa',
      language: 'English',
      summaryPoints: [
        'End-to-end relational database models and schema relationships',
        'Deep dive into query structure, projections, filtering, and groupings',
      ],
    },
  ],
};

export const MODULE_1_THEORY: TopicTheory = {
  title: 'Retrieving Data with SELECT, Aliases & Column Expressions',
  summary: 'The SELECT statement is the fundamental command of SQL. It instructs the database engine which fields and expressions you want to project from a table.',
  syntax: `SELECT column1, column2, (unit_price * 1.18) AS price_with_tax
FROM products;`,
  explanation: [
    'A relational database organizes records into structured tables where columns represent attributes and rows represent records.',
    'The FROM clause tells the database engine which table contains the source data.',
    'The SELECT clause specifies exactly which attributes to project into the final result table.',
    'Using SELECT * retrieves all columns, which is convenient for quick ad-hoc inspection but harms production performance by increasing I/O bandwidth and breaking covering index scans.',
    'The AS keyword creates clean column aliases. Double quotes are required if the alias contains spaces, such as AS "Annual Salary".',
    'Arithmetic operators (+, -, *, /, %) can be evaluated directly within SELECT expressions without modifying the underlying database table.',
    'The DISTINCT keyword removes duplicate rows across the selected combination of columns.',
  ],
  keyRules: [
    'SQL keywords (SELECT, FROM) are case-insensitive, but writing them in UPPERCASE is the industry convention.',
    'Separate projected column expressions with a comma; never place a trailing comma before the FROM keyword.',
    'Aliases defined in the SELECT clause cannot be referenced in the WHERE clause of the same query level because WHERE executes before SELECT.',
    'Single quotes are reserved for string literals (\'Sales\'), while double quotes are used for identifier aliases ("Annual Pay").',
  ],
  commonMistakes: [
    'Missing commas between columns: `SELECT first_name last_name FROM emp;` treats last_name as an alias for first_name!',
    'Placing a comma after the final column before FROM: `SELECT id, name, FROM emp;` triggers a syntax error.',
    'Attempting to filter on an alias in WHERE: `WHERE annual_salary > 50000` fails because WHERE executes before SELECT.',
    'Assuming SELECT evaluates first: While written first, SELECT evaluates after FROM, WHERE, GROUP BY, and HAVING.',
  ],
  exampleQuery: `SELECT product_name, unit_price, unit_price * 0.90 AS discounted_price, 'IN_STOCK' AS inventory_status
FROM products;`,
  exampleExplanation: 'This query retrieves the product name and base price, computes a 10% discount in a new column aliased as discounted_price, and appends a constant status column.',
  mermaidMindmap: `mindmap
  root((SQL Basics & SELECT))
    Projections
      SELECT Star vs Specific Columns
      Performance implications of SELECT *
      DISTINCT deduplication
    Column Aliasing
      AS keyword
      Double quotes for spaced aliases
      Scope limitations in WHERE
    Expressions
      Arithmetic: +, -, *, /, %
      Constant scalar injection
      Column calculations
    Engine Pipeline
      1. FROM evaluates first
      2. SELECT evaluates fifth
      3. ORDER BY evaluates late
    Syntax Rules
      Comma separation
      No trailing comma before FROM
      Uppercase convention`,
};

export const MODULE_1_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1-1',
    question: 'What is the primary function of the SELECT clause in a SQL query?',
    options: [
      'To create and initialize a new table in the database',
      'To specify which columns or expressions should be retrieved in the output',
      'To filter out individual rows matching a condition',
      'To arrange rows in ascending or descending sequence',
    ],
    correctIndex: 1,
    explanation: 'SELECT determines the column projection of the result set. Filtering is done by WHERE, sorting by ORDER BY, and table creation by CREATE TABLE.',
  },
  {
    id: 'q1-2',
    question: 'Why is using "SELECT *" considered bad practice in production application code?',
    options: [
      'It permanently deletes indexes on the queried table',
      'It converts all numerical column values into plain text strings',
      'It increases network I/O bandwidth, breaks index-only scans, and causes bugs if columns change',
      'SQL-99 standards have completely deprecated the asterisk syntax',
    ],
    correctIndex: 2,
    explanation: 'SELECT * transfers unnecessary data across the network, degrades database buffer cache efficiency, prevents covering index usage, and risks schema mismatch errors.',
  },
  {
    id: 'q1-3',
    question: 'Given the query: SELECT first_name last_name FROM employees; what will the result contain?',
    options: [
      'Two columns: first_name and last_name',
      'One column displaying first_name, aliased with the header "last_name"',
      'A syntax error due to a missing comma',
      'A concatenated single column merging both names',
    ],
    correctIndex: 1,
    explanation: 'Omitting a comma between two column identifiers causes SQL to treat the second identifier as an alias for the first column.',
  },
  {
    id: 'q1-4',
    question: 'Which of the following queries correctly calculates an annual salary from a monthly salary column and assigns a readable alias?',
    options: [
      'SELECT salary * 12 = annual_salary FROM employees;',
      'SELECT salary * 12 AS annual_salary FROM employees;',
      'SELECT (salary * 12) TO annual_salary FROM employees;',
      'SELECT RENAME(salary * 12, annual_salary) FROM employees;',
    ],
    correctIndex: 1,
    explanation: 'The "AS" keyword is the standard SQL syntax used to specify an alias for a projected column or computed expression.',
  },
  {
    id: 'q1-5',
    question: 'How must an alias be written if it contains spaces (e.g., Annual Salary)?',
    options: [
      'AS [Annual Salary] in all ANSI SQL engines',
      'AS \'Annual Salary\' using single quotes only',
      'AS "Annual Salary" using double quotes',
      'AS (Annual Salary) inside round brackets',
    ],
    correctIndex: 2,
    explanation: 'ANSI SQL standard uses double quotes for identifier names with spaces or special characters. Single quotes are reserved strictly for string literals.',
  },
  {
    id: 'q1-6',
    question: 'In the logical query processing order of an RDBMS, when does the SELECT clause execute?',
    options: [
      'First, before any other clause',
      'Immediately after the WHERE clause but before GROUP BY',
      'After FROM, WHERE, GROUP BY, and HAVING, but before ORDER BY and LIMIT',
      'Last, after ORDER BY and LIMIT',
    ],
    correctIndex: 2,
    explanation: 'The database engine identifies the tables (FROM), filters rows (WHERE), groups them (GROUP BY/HAVING), and then projects requested columns (SELECT), followed by sorting (ORDER BY) and pagination (LIMIT).',
  },
  {
    id: 'q1-7',
    question: 'Why does the query: SELECT salary * 0.10 AS bonus FROM staff WHERE bonus > 500; fail in standard SQL?',
    options: [
      'Multiplication is not permitted inside the SELECT clause',
      'The WHERE clause executes before the SELECT clause, so the alias "bonus" does not exist yet',
      'Bonus is a reserved keyword in all relational database management systems',
      'Decimal values must be enclosed in quotes',
    ],
    correctIndex: 1,
    explanation: 'Because WHERE is evaluated before SELECT, aliases created in SELECT are not yet available to the WHERE filter.',
  },
  {
    id: 'q1-8',
    question: 'What does the DISTINCT keyword accomplish when placed immediately after SELECT?',
    options: [
      'Sorts all returned rows in ascending order automatically',
      'Eliminates duplicate rows across all columns listed in the SELECT statement',
      'Selects only the first row matching the query criteria',
      'Enforces a unique constraint on the database table',
    ],
    correctIndex: 1,
    explanation: 'DISTINCT filters out duplicate tuples so that every row returned in the result set contains a unique combination of the selected columns.',
  },
  {
    id: 'q1-9',
    question: 'What will be the output of: SELECT 10 + 5 * 2 AS result;',
    options: [
      '30',
      '20',
      '25',
      'NULL',
    ],
    correctIndex: 1,
    explanation: 'Standard operator precedence applies: multiplication (5 * 2 = 10) executes before addition (10 + 10 = 20).',
  },
  {
    id: 'q1-10',
    question: 'Which statement correctly retrieves distinct departments and job titles from the employees table?',
    options: [
      'SELECT DISTINCT department, DISTINCT job_title FROM employees;',
      'SELECT DISTINCT department, job_title FROM employees;',
      'SELECT (department, job_title) DISTINCT FROM employees;',
      'SELECT UNIQUE department, job_title FROM employees;',
    ],
    correctIndex: 1,
    explanation: 'DISTINCT is written once after SELECT and applies to the entire combination of columns specified in the list.',
  },
  {
    id: 'q1-11',
    question: 'Which of the following is an invalid SQL SELECT statement?',
    options: [
      'SELECT id, name FROM users;',
      'SELECT id, name, FROM users;',
      'SELECT id FROM users;',
      'SELECT 1, 2, \'active\';',
    ],
    correctIndex: 1,
    explanation: 'A trailing comma after "name" right before the "FROM" clause violates SQL grammar rules and triggers a syntax error.',
  },
  {
    id: 'q1-12',
    question: 'What happens if you execute: SELECT \'Hello World\' AS greeting; without a FROM clause in SQLite or PostgreSQL?',
    options: [
      'The query will crash because FROM is universally mandatory',
      'It returns a single-row result table with one column named "greeting" containing "Hello World"',
      'It creates a temporary table named greeting',
      'It returns NULL',
    ],
    correctIndex: 1,
    explanation: 'Modern engines like SQLite, PostgreSQL, and MySQL support selecting scalar constants and expressions without a FROM clause.',
  },
  {
    id: 'q1-13',
    question: 'If a table contains 10 rows and all 10 rows have the country "USA", what is the row count of: SELECT DISTINCT country FROM users;?',
    options: [
      '10',
      '0',
      '1',
      'Error: Multiple duplicate values found',
    ],
    correctIndex: 2,
    explanation: 'DISTINCT consolidates identical values across the projection into a single unique instance: "USA".',
  },
  {
    id: 'q1-14',
    question: 'How do you select the product name and calculate an inventory value as (stock_qty * unit_cost)?',
    options: [
      'SELECT product_name, stock_qty * unit_cost AS inventory_value FROM products;',
      'SELECT product_name, MULTIPLY(stock_qty, unit_cost) FROM products;',
      'SELECT product_name AND stock_qty * unit_cost FROM products;',
      'SELECT product_name, (stock_qty * unit_cost) INTO inventory_value FROM products;',
    ],
    correctIndex: 0,
    explanation: 'Standard arithmetic multiplication operator is "*", combined with AS for the column alias.',
  },
  {
    id: 'q1-15',
    question: 'Can you use the AS keyword to rename a table in the FROM clause?',
    options: [
      'No, AS is strictly reserved for columns in SELECT',
      'Yes, you can alias tables (e.g., FROM employees AS e) to shorten table references',
      'Only if the table has fewer than 100 rows',
      'Only when executing DDL queries',
    ],
    correctIndex: 1,
    explanation: 'Table aliases are standard in SQL (e.g., `FROM employees AS e` or simply `FROM employees e`) to clarify and shorten column references.',
  },
  {
    id: 'q1-16',
    question: 'What is the result of selecting a NULL value with arithmetic, such as: SELECT 100 + NULL AS test_col;?',
    options: [
      '100',
      '0',
      'NULL',
      'Throws a NullPointerException',
    ],
    correctIndex: 2,
    explanation: 'In SQL arithmetic, any operation involving NULL produces NULL because NULL represents an unknown value.',
  },
  {
    id: 'q1-17',
    question: 'Which query returns the employee ID plus an additional constant column called "status" with the value "Active" for every row?',
    options: [
      'SELECT emp_id, \'Active\' AS status FROM employees;',
      'SELECT emp_id, CONSTANT(\'Active\') FROM employees;',
      'SELECT emp_id WITH status = \'Active\' FROM employees;',
      'SELECT emp_id, ADD COLUMN status = \'Active\' FROM employees;',
    ],
    correctIndex: 0,
    explanation: 'Literal values (numbers or quoted strings) can be directly projected as literal constant columns in SELECT.',
  },
  {
    id: 'q1-18',
    question: 'Are SQL keywords case-sensitive?',
    options: [
      'Yes, writing "select" in lowercase causes a syntax error',
      'No, "SELECT", "select", and "Select" are syntactically identical to the engine',
      'They are case-sensitive only in PostgreSQL',
      'They are case-sensitive only on Linux servers',
    ],
    correctIndex: 1,
    explanation: 'SQL keywords are case-insensitive. However, convention mandates writing them in UPPERCASE for readability.',
  },
  {
    id: 'q1-19',
    question: 'What is the difference between single quotes (\'\') and double quotes ("") in standard SQL?',
    options: [
      'They are completely interchangeable',
      'Single quotes enclose text/string literals; double quotes enclose database identifiers (column/table names)',
      'Double quotes enclose strings; single quotes enclose comments',
      'Single quotes are for numbers; double quotes are for characters',
    ],
    correctIndex: 1,
    explanation: 'ANSI SQL standard: Single quotes (\'data\') denote string literal values. Double quotes ("column name") denote database identifier names.',
  },
  {
    id: 'q1-20',
    question: 'Consider a query combining expressions: SELECT id, price, price * 0.9 AS discounted_price, \'PROMO\' AS code FROM items; How many columns are in the output?',
    options: [
      '2 columns',
      '3 columns',
      '4 columns',
      '5 columns',
    ],
    correctIndex: 2,
    explanation: 'There are 4 comma-separated items: 1) id, 2) price, 3) price * 0.9 AS discounted_price, and 4) \'PROMO\' AS code.',
  },
];

export const MODULE_1_CODING_BANK: CodingChallenge[] = [
  {
    id: 'ch_1',
    title: 'Challenge 1: Employee Directory & Monthly Salary',
    difficulty: 'Easy',
    source: 'Standard',
    sourceId: 'Corporate Directory',
    instructions: "Write a query to retrieve each employee's `name` and their monthly `salary` from the `Employees` table.",
    schemaSql: `
CREATE TABLE Employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO Employees VALUES
(1, 'Alice Johnson', 'Engineering', 92000),
(2, 'Bob Smith', 'Marketing', 78000),
(3, 'Charlie Brown', 'Engineering', 85000),
(4, 'Diana Prince', 'Product', 95000),
(5, 'Evan Wright', 'Sales', 64000);
`,
    tables: [
      {
        name: 'Employees',
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: 'name', type: 'VARCHAR(50)' },
          { name: 'department', type: 'VARCHAR(50)' },
          { name: 'salary', type: 'INT' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 92000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 78000 },
        ],
      },
    ],
    starterSql: '-- Write your SQL query here\n',
    solutionSql: `SELECT name, salary FROM Employees;`,
    expectedColumns: ['name', 'salary'],
    expectedOutputData: [
      { name: 'Alice Johnson', salary: 92000 },
      { name: 'Bob Smith', salary: 78000 },
      { name: 'Charlie Brown', salary: 85000 },
      { name: 'Diana Prince', salary: 95000 },
      { name: 'Evan Wright', salary: 64000 },
    ],
    hints: [
      'Specify only the columns name and salary separated by a comma.',
      'Check that there is no trailing comma before the FROM clause.',
    ],
  },
  {
    id: 'ch_2',
    title: 'Challenge 2: Annual Compensation Calculator',
    difficulty: 'Easy',
    source: 'Standard',
    sourceId: 'Finance Payroll',
    instructions: "The finance team needs annual salary figures. Write a query to return each employee's `name` and their annual earnings (`salary * 12`) with the alias `annual_compensation`.",
    schemaSql: `
CREATE TABLE Employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO Employees VALUES
(1, 'Alice Johnson', 'Engineering', 92000),
(2, 'Bob Smith', 'Marketing', 78000),
(3, 'Charlie Brown', 'Engineering', 85000),
(4, 'Diana Prince', 'Product', 95000),
(5, 'Evan Wright', 'Sales', 64000);
`,
    tables: [
      {
        name: 'Employees',
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: 'name', type: 'VARCHAR(50)' },
          { name: 'department', type: 'VARCHAR(50)' },
          { name: 'salary', type: 'INT' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 92000 },
          { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 78000 },
        ],
      },
    ],
    starterSql: '-- Write your SQL query here\n',
    solutionSql: `SELECT name, salary * 12 AS annual_compensation FROM Employees;`,
    expectedColumns: ['name', 'annual_compensation'],
    expectedOutputData: [
      { name: 'Alice Johnson', annual_compensation: 1104000 },
      { name: 'Bob Smith', annual_compensation: 936000 },
      { name: 'Charlie Brown', annual_compensation: 1020000 },
      { name: 'Diana Prince', annual_compensation: 1140000 },
      { name: 'Evan Wright', annual_compensation: 768000 },
    ],
    hints: [
      'Multiply the salary column by 12: salary * 12.',
      'Use the AS keyword to name the derived column: AS annual_compensation.',
    ],
  },
  {
    id: 'ch_3',
    title: 'Challenge 3: Total Retail Inventory Valuation',
    difficulty: 'Easy',
    source: 'FAANG',
    sourceId: 'Amazon Inventory',
    instructions: "Write a query to calculate the total retail inventory value for each item in the `Products` table. Return `product_name`, `price`, `stock`, and the computed total value (`price * stock`) aliased as `total_stock_value`.",
    schemaSql: `
CREATE TABLE Products (
  id INT PRIMARY KEY,
  product_name VARCHAR(50),
  price DECIMAL(10,2),
  stock INT
);
INSERT INTO Products VALUES
(101, 'Mechanical Keyboard', 120.00, 45),
(102, 'Wireless Mouse', 45.50, 110),
(103, 'UltraWide Monitor', 450.00, 18),
(104, 'USB-C Hub', 35.00, 80);
`,
    tables: [
      {
        name: 'Products',
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: 'product_name', type: 'VARCHAR(50)' },
          { name: 'price', type: 'DECIMAL(10,2)' },
          { name: 'stock', type: 'INT' },
        ],
        sampleData: [
          { id: 101, product_name: 'Mechanical Keyboard', price: 120.0, stock: 45 },
          { id: 102, product_name: 'Wireless Mouse', price: 45.5, stock: 110 },
        ],
      },
    ],
    starterSql: '-- Write your SQL query here\n',
    solutionSql: `SELECT product_name, price, stock, price * stock AS total_stock_value FROM Products;`,
    expectedColumns: ['product_name', 'price', 'stock', 'total_stock_value'],
    expectedOutputData: [
      { product_name: 'Mechanical Keyboard', price: 120.00, stock: 45, total_stock_value: 5400.00 },
      { product_name: 'Wireless Mouse', price: 45.50, stock: 110, total_stock_value: 5005.00 },
      { product_name: 'UltraWide Monitor', price: 450.00, stock: 18, total_stock_value: 8100.00 },
      { product_name: 'USB-C Hub', price: 35.00, stock: 80, total_stock_value: 2800.00 },
    ],
    hints: [
      'Perform inline multiplication of price and stock: price * stock AS total_stock_value.',
      'Check that product_name, price, stock, and the calculation are separated by commas.',
    ],
  },
  {
    id: 'ch_4',
    title: 'Challenge 4: Unique Operating Departments',
    difficulty: 'Easy',
    source: 'W3Resource',
    sourceId: 'SELECT DISTINCT #4',
    instructions: "HR needs a list of all active departments within the company without any duplicate entries. Write a query to return unique department names aliased as `department_name`.",
    schemaSql: `
CREATE TABLE Employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO Employees VALUES
(1, 'Alice Johnson', 'Engineering', 92000),
(2, 'Bob Smith', 'Marketing', 78000),
(3, 'Charlie Brown', 'Engineering', 85000),
(4, 'Diana Prince', 'Product', 95000),
(5, 'Evan Wright', 'Sales', 64000);
`,
    tables: [
      {
        name: 'Employees',
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: 'name', type: 'VARCHAR(50)' },
          { name: 'department', type: 'VARCHAR(50)' },
          { name: 'salary', type: 'INT' },
        ],
        sampleData: [
          { id: 1, name: 'Alice Johnson', department: 'Engineering' },
          { id: 2, name: 'Bob Smith', department: 'Marketing' },
        ],
      },
    ],
    starterSql: '-- Write your SQL query here\n',
    solutionSql: `SELECT DISTINCT department AS department_name FROM Employees;`,
    expectedColumns: ['department_name'],
    expectedOutputData: [
      { department_name: 'Engineering' },
      { department_name: 'Marketing' },
      { department_name: 'Product' },
      { department_name: 'Sales' },
    ],
    hints: [
      'Use the DISTINCT keyword immediately following SELECT.',
      'Rename the column using: department AS department_name.',
    ],
  },
  {
    id: 'ch_5',
    title: 'Challenge 5: Warehouse Inventory Audit Labels',
    difficulty: 'Easy',
    source: 'FAANG',
    sourceId: 'Inventory Audit',
    instructions: "Warehouse management requires an inventory audit list. Return `product_name`, `stock`, and a static status column with the text value `'IN_STOCK'` aliased as `inventory_status`.",
    schemaSql: `
CREATE TABLE Products (
  id INT PRIMARY KEY,
  product_name VARCHAR(50),
  price DECIMAL(10,2),
  stock INT
);
INSERT INTO Products VALUES
(101, 'Mechanical Keyboard', 120.00, 45),
(102, 'Wireless Mouse', 45.50, 110),
(103, 'UltraWide Monitor', 450.00, 18),
(104, 'USB-C Hub', 35.00, 80);
`,
    tables: [
      {
        name: 'Products',
        columns: [
          { name: 'id', type: 'INT', isPk: true },
          { name: 'product_name', type: 'VARCHAR(50)' },
          { name: 'price', type: 'DECIMAL(10,2)' },
          { name: 'stock', type: 'INT' },
        ],
        sampleData: [
          { id: 101, product_name: 'Mechanical Keyboard', stock: 45 },
          { id: 102, product_name: 'Wireless Mouse', stock: 110 },
        ],
      },
    ],
    starterSql: '-- Write your SQL query here\n',
    solutionSql: `SELECT product_name, stock, 'IN_STOCK' AS inventory_status FROM Products;`,
    expectedColumns: ['product_name', 'stock', 'inventory_status'],
    expectedOutputData: [
      { product_name: 'Mechanical Keyboard', stock: 45, inventory_status: 'IN_STOCK' },
      { product_name: 'Wireless Mouse', stock: 110, inventory_status: 'IN_STOCK' },
      { product_name: 'UltraWide Monitor', stock: 18, inventory_status: 'IN_STOCK' },
      { product_name: 'USB-C Hub', stock: 80, inventory_status: 'IN_STOCK' },
    ],
    hints: [
      'Project product_name and stock.',
      "Add a static literal string enclosed in single quotes: 'IN_STOCK' AS inventory_status.",
    ],
  },
];
