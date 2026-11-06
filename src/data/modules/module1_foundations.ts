import { Topic } from '../../types';
import { USER_RECOMMENDED_MASTERCLASSES } from './masterclasses';

export const FOUNDATIONS_MODULES: Topic[] = [
  {
    id: 'topic-1-select',
    order: 1,
    slug: 'select-basics',
    title: '1. SQL Basics & The SELECT Statement',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Foundations',
    overview: 'Learn how relational databases store data in tables and how to retrieve specific columns using SELECT, FROM, and Column Aliases.',
    video: {
      title: 'SQL SELECT Statement & Column Projections (Concept + Exercises)',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '9:15',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'How tables, rows, and columns are structured in a database',
        'Syntax of SELECT column_name FROM table_name',
        'Using SELECT * vs choosing specific columns for production queries',
        'Renaming output columns cleanly using the AS keyword (column alias)',
        'Performing inline arithmetic calculations and solving exercises',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL Basics Tutorial - SELECT & FROM Statements',
        embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
        duration: '7:45',
        channel: 'Programming with Mosh',
        language: 'English',
        summaryPoints: [
          'Selecting columns, calculated values, and using DISTINCT',
          'Formatting queries cleanly for production databases',
        ],
      },
    ],
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Retrieving Data with SELECT & FROM',
      summary: 'The SELECT statement is the foundational command of SQL. It instructs the database engine which fields you want to view from a table.',
      syntax: `SELECT column1, column2, (salary * 1.10) AS new_salary
FROM employees;`,
      explanation: [
        'A relational database stores structured records inside tables. Each row represents a record, and each column represents an attribute.',
        'The FROM clause tells SQL where the data lives (the target table).',
        'The SELECT clause tells SQL which attributes to project/return.',
        'Using SELECT * returns all columns, which is great for quick inspection but bad for production performance.',
        'Use "AS alias_name" to give friendly, readable headers to your output columns.',
      ],
      keyRules: [
        'SQL keywords (SELECT, FROM) are case-insensitive, but writing them in UPPERCASE is standard industry convention.',
        'Separate multiple column names with a comma; no trailing comma before FROM.',
        'Column aliases containing spaces or special characters should be enclosed in double quotes: AS "Annual Salary".',
      ],
      commonMistakes: [
        'Forgetting commas between column names: SELECT first_name last_name FROM employees (will alias last_name!)',
        'Placing a comma after the final column before the FROM keyword',
        'Misspelling table names or querying columns that do not exist in the table',
      ],
      exampleQuery: `SELECT first_name, last_name, department, salary * 12 AS annual_salary
FROM employees;`,
      exampleExplanation: 'This query extracts each employee\'s names and department, and multiplies monthly salary by 12 with a clean alias "annual_salary".',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q1-1',
          question: 'What is the primary function of the SELECT clause in SQL?',
          options: [
            'To create a brand new table in the database',
            'To specify which columns should be retrieved and shown in the result',
            'To filter out specific rows based on a condition',
            'To sort the output in ascending or descending order',
          ],
          correctIndex: 1,
          explanation: 'SELECT specifies which column expressions to project and return from the table specified in the FROM clause.',
        },
        {
          id: 'q1-2',
          question: 'Why should software engineers avoid using "SELECT *" in production applications?',
          options: [
            'It will throw a syntax error in modern databases',
            'It only returns numerical columns',
            'It fetches unnecessary columns, wastes memory/network bandwidth, and breaks if schema changes',
            'It locks the entire table preventing reads by other users',
          ],
          correctIndex: 2,
          explanation: 'SELECT * fetches all data including large unneeded columns, impacting network payload and database index scanning performance.',
        },
        {
          id: 'q1-3',
          question: 'Which SQL keyword is used to give a temporary readable name to a column in the output result?',
          options: ['RENAME', 'AS', 'SET', 'NAME'],
          correctIndex: 1,
          explanation: 'The AS keyword creates an alias for a column or expression, e.g., SELECT salary * 1.1 AS bonus.',
        },
        {
          id: 'q1-4',
          question: 'In what logical order does the database engine parse a simple SELECT query?',
          options: [
            'SELECT first, then FROM',
            'FROM first (locate the table), then SELECT (project the columns)',
            'Both are executed simultaneously in parallel',
            'Alphabetical order',
          ],
          correctIndex: 1,
          explanation: 'Logically, the database must first locate the table via FROM before it can pick the columns requested in SELECT.',
        },
      ],
    },
    challenge: {
      id: 'c1-select-1',
      title: 'Challenge 1: Directory of Active Employees',
      difficulty: 'Easy',
      source: 'Standard',
      instructions: 'Write a SQL query that retrieves each employee\'s `first_name`, `last_name`, `department`, and their annual compensation calculated as `salary * 12` with the alias `annual_pay`.',
      schemaSql: `
CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);

INSERT INTO employees VALUES
(1, 'Sarah', 'Connor', 'Engineering', 8500),
(2, 'John', 'Doe', 'Marketing', 6200),
(3, 'Elena', 'Rostova', 'Engineering', 9400),
(4, 'Marcus', 'Wright', 'Sales', 5800),
(5, 'Aisha', 'Patel', 'Product', 7900);
      `,
      tables: [
        {
          name: 'employees',
          description: 'Employee payroll and team assignments',
          columns: [
            { name: 'id', type: 'INT', isPk: true },
            { name: 'first_name', type: 'VARCHAR(50)' },
            { name: 'last_name', type: 'VARCHAR(50)' },
            { name: 'department', type: 'VARCHAR(50)' },
            { name: 'salary', type: 'INT' },
          ],
          sampleData: [
            { id: 1, first_name: 'Sarah', last_name: 'Connor', department: 'Engineering', salary: 8500 },
            { id: 2, first_name: 'John', last_name: 'Doe', department: 'Marketing', salary: 6200 },
            { id: 3, first_name: 'Elena', last_name: 'Rostova', department: 'Engineering', salary: 9400 },
            { id: 4, first_name: 'Marcus', last_name: 'Wright', department: 'Sales', salary: 5800 },
            { id: 5, first_name: 'Aisha', last_name: 'Patel', department: 'Product', salary: 7900 },
          ],
        },
      ],
      starterSql: `-- Write your SQL query below
SELECT 
  first_name,
  -- add remaining columns here
FROM employees;`,
      solutionSql: `SELECT first_name, last_name, department, salary * 12 AS annual_pay FROM employees;`,
      expectedColumns: ['first_name', 'last_name', 'department', 'annual_pay'],
      hints: [
        'Select first_name, last_name, department, and compute annual pay using (salary * 12).',
        'Remember to provide the alias `annual_pay` using: salary * 12 AS annual_pay',
        'Verify there are no trailing commas right before the FROM keyword.',
      ],
    },
    challenges: [
      {
        id: 'c1-select-1',
        title: 'Practice 1: Directory of Active Employees',
        difficulty: 'Easy',
        source: 'Standard',
        instructions: 'Write a SQL query that retrieves each employee\'s `first_name`, `last_name`, `department`, and their annual compensation calculated as `salary * 12` with the alias `annual_pay`.',
        schemaSql: `
CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO employees VALUES
(1, 'Sarah', 'Connor', 'Engineering', 8500),
(2, 'John', 'Doe', 'Marketing', 6200),
(3, 'Elena', 'Rostova', 'Engineering', 9400),
(4, 'Marcus', 'Wright', 'Sales', 5800),
(5, 'Aisha', 'Patel', 'Product', 7900);`,
        tables: [
          {
            name: 'employees',
            description: 'Employee payroll and team assignments',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'first_name', type: 'VARCHAR(50)' },
              { name: 'last_name', type: 'VARCHAR(50)' },
              { name: 'department', type: 'VARCHAR(50)' },
              { name: 'salary', type: 'INT' },
            ],
            sampleData: [
              { id: 1, first_name: 'Sarah', last_name: 'Connor', department: 'Engineering', salary: 8500 },
              { id: 2, first_name: 'John', last_name: 'Doe', department: 'Marketing', salary: 6200 },
              { id: 3, first_name: 'Elena', last_name: 'Rostova', department: 'Engineering', salary: 9400 },
            ],
          },
        ],
        starterSql: `SELECT first_name, last_name, department, salary * 12 AS annual_pay FROM employees;`,
        solutionSql: `SELECT first_name, last_name, department, salary * 12 AS annual_pay FROM employees;`,
        expectedColumns: ['first_name', 'last_name', 'department', 'annual_pay'],
        hints: ['Use: salary * 12 AS annual_pay'],
      },
      {
        id: 'c1-select-2',
        title: 'Practice 2: Recyclable & Low Fat Products (LeetCode 1757)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 1757',
        instructions: 'Find the IDs of products that are BOTH low fat (`low_fats = \'Y\'`) and recyclable (`recyclable = \'Y\'`). Return `product_id`.',
        schemaSql: `
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  low_fats CHAR(1),
  recyclable CHAR(1)
);
INSERT INTO products VALUES
(0, 'Y', 'N'),
(1, 'Y', 'Y'),
(2, 'N', 'Y'),
(3, 'Y', 'Y'),
(4, 'N', 'N');`,
        tables: [
          {
            name: 'products',
            description: 'Inventory items with health & recycling attributes',
            columns: [
              { name: 'product_id', type: 'INT', isPk: true },
              { name: 'low_fats', type: 'CHAR(1)' },
              { name: 'recyclable', type: 'CHAR(1)' },
            ],
            sampleData: [
              { product_id: 0, low_fats: 'Y', recyclable: 'N' },
              { product_id: 1, low_fats: 'Y', recyclable: 'Y' },
              { product_id: 2, low_fats: 'N', recyclable: 'Y' },
              { product_id: 3, low_fats: 'Y', recyclable: 'Y' },
              { product_id: 4, low_fats: 'N', recyclable: 'N' },
            ],
          },
        ],
        starterSql: `-- LeetCode 1757: Fetch product_id where low_fats = 'Y' AND recyclable = 'Y'
SELECT product_id
FROM products
WHERE ;`,
        solutionSql: `SELECT product_id FROM products WHERE low_fats = 'Y' AND recyclable = 'Y';`,
        expectedColumns: ['product_id'],
        hints: ['Use WHERE low_fats = \'Y\' AND recyclable = \'Y\''],
      },
      {
        id: 'c1-select-3',
        title: 'Practice 3: Distinct Department Codes (w3resource SQL)',
        difficulty: 'Easy',
        source: 'W3Resource',
        sourceId: 'w3resource #4',
        instructions: 'Write a query to retrieve all unique/distinct department names from the employees table. Return the column `department` ordered alphabetically.',
        schemaSql: `
CREATE TABLE employees (
  emp_id INT PRIMARY KEY,
  first_name VARCHAR(30),
  department VARCHAR(30)
);
INSERT INTO employees VALUES
(101, 'Alex', 'Finance'),
(102, 'David', 'IT'),
(103, 'Peter', 'Finance'),
(104, 'Maria', 'IT'),
(105, 'Samantha', 'HR'),
(106, 'Oliver', 'HR');`,
        tables: [
          {
            name: 'employees',
            columns: [
              { name: 'emp_id', type: 'INT', isPk: true },
              { name: 'first_name', type: 'VARCHAR(30)' },
              { name: 'department', type: 'VARCHAR(30)' },
            ],
            sampleData: [
              { emp_id: 101, first_name: 'Alex', department: 'Finance' },
              { emp_id: 102, first_name: 'David', department: 'IT' },
              { emp_id: 103, first_name: 'Peter', department: 'Finance' },
            ],
          },
        ],
        starterSql: `-- Use SELECT DISTINCT to eliminate duplicates
SELECT DISTINCT department
FROM employees
ORDER BY department ASC;`,
        solutionSql: `SELECT DISTINCT department FROM employees ORDER BY department ASC;`,
        expectedColumns: ['department'],
        hints: ['Use SELECT DISTINCT department FROM employees ORDER BY department ASC;'],
      },
    ],
  },
  {
    id: 'topic-2-where',
    order: 2,
    slug: 'where-filtering',
    title: '2. Filtering Data with WHERE & Operators',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Foundations',
    overview: 'Learn how to narrow down records using comparison operators (=, !=, >, <), logical operators (AND, OR, NOT), and special keywords (IN, BETWEEN, LIKE, IS NULL).',
    video: {
      title: 'SQL WHERE Statement & Comparison Operators Tutorial',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '11:15',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Filtering rows conditionally with the WHERE clause',
        'Using comparison operators: =, !=, <>, >, <, >=, <=',
        'Combining multiple conditions with AND, OR, and NOT',
        'Wildcard matching with LIKE (e.g., % and _)',
        'Checking ranges with BETWEEN and sets with IN',
        'Handling missing values correctly using IS NULL and IS NOT NULL',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL WHERE Clause & Operators in Telugu (తెలుగు)',
        embedUrl: 'https://www.youtube.com/embed/8F6fv4_MDbM',
        duration: '1:45:00',
        channel: 'Telugu Tech Academy',
        language: 'Telugu',
        summaryPoints: [
          'Detailed explanation of filtering with WHERE in Telugu',
          'NULL traps and logical operations',
        ],
      },
      {
        title: 'SQL WHERE Clause, AND / OR, LIKE, IN & BETWEEN',
        embedUrl: 'https://www.youtube.com/embed/S86phsLFW1E',
        duration: '18:30',
        channel: 'Tech With Tim',
        language: 'English',
        summaryPoints: [
          'Filter strings, dates, and numbers',
          'Avoiding boolean precedence bugs with parentheses',
        ],
      },
    ],
    theory: {
      title: 'Precision Filtering with WHERE',
      summary: 'The WHERE clause filters rows BEFORE they are grouped or selected. Only records that evaluate the condition to TRUE are returned.',
      syntax: `SELECT column1, column2
FROM table_name
WHERE condition1 AND (condition2 OR condition3);`,
      explanation: [
        'The WHERE clause filters individual records at the row level directly from the disk/memory scan.',
        'String literals in SQL must be wrapped in single quotes, e.g., WHERE status = \'ACTIVE\'.',
        'Wildcards: "%" matches zero or more characters; "_" matches exactly one single character.',
        'BETWEEN is inclusive on both ends: WHERE score BETWEEN 80 AND 100 includes 80 and 100.',
        'NULL values represent missing or unknown data. You cannot test them with = NULL; you must use "IS NULL" or "IS NOT NULL".',
      ],
      keyRules: [
        'AND has higher operator precedence than OR. Always wrap OR conditions in parentheses when mixed with AND!',
        'Single quotes (\'...\') for string values; double quotes are reserved for column or table identifiers.',
        'Case sensitivity depends on the collation, but sticking to matching case is best practice.',
      ],
      commonMistakes: [
        'Writing `WHERE bonus = NULL` instead of `WHERE bonus IS NULL` (will return zero rows!).',
        'Forgetting parentheses in: WHERE dept = \'Sales\' AND role = \'Lead\' OR role = \'Manager\' (unexpected logic!).',
        'Using double quotes for string literals: WHERE name = "John" (can cause errors in standard SQL).',
      ],
      exampleQuery: `SELECT first_name, last_name, salary, department
FROM employees
WHERE department = 'Engineering' AND salary >= 8000;`,
      exampleExplanation: 'Returns only employees who belong to the Engineering department AND earn at least $8,000 monthly.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q2-1',
          question: 'Which query correctly tests if an employee has NO assigned manager (i.e. manager_id is missing)?',
          options: [
            'WHERE manager_id = NULL',
            'WHERE manager_id IS NULL',
            'WHERE manager_id == NULL',
            'WHERE manager_id = \'\'',
          ],
          correctIndex: 1,
          explanation: 'In SQL, NULL signifies an unknown state. Any equality comparison (= NULL) evaluates to UNKNOWN (falsy). Always use IS NULL.',
        },
        {
          id: 'q2-2',
          question: 'What rows does the condition "WHERE name LIKE \'J%n\'" match?',
          options: [
            'Only names that are exactly 3 letters starting with J and ending with n',
            'Any name starting with J, having any number of characters in between, and ending with n (e.g. "John", "Jason")',
            'Names containing the letter J followed immediately by n',
            'Names ending with %n',
          ],
          correctIndex: 1,
          explanation: 'The % wildcard matches zero or more characters. Thus J%n matches "John", "Jason", "Jan", etc.',
        },
        {
          id: 'q2-3',
          question: 'What is the danger of writing: WHERE status = \'Active\' AND dept = \'Tech\' OR dept = \'Design\'?',
          options: [
            'It causes a syntax error',
            'Because AND takes precedence over OR, it evaluates as (status = \'Active\' AND dept = \'Tech\') OR (dept = \'Design\'), fetching all Design employees regardless of status',
            'OR takes precedence over AND so it fails',
            'It only searches the first 10 rows',
          ],
          correctIndex: 1,
          explanation: 'AND binds tighter than OR. You must use parentheses: WHERE status = \'Active\' AND (dept = \'Tech\' OR dept = \'Design\').',
        },
        {
          id: 'q2-4',
          question: 'Is the BETWEEN operator inclusive of its boundary values in SQL?',
          options: [
            'No, it excludes both the start and end values',
            'Yes, it includes both boundary values (equivalent to >= low AND <= high)',
            'Only the start value is included',
            'Only the end value is included',
          ],
          correctIndex: 1,
          explanation: 'BETWEEN x AND y is shorthand for >= x AND <= y (inclusive of both).',
        },
      ],
    },
    challenge: {
      id: 'c2-where-1',
      title: 'Challenge 2: High-Earner Engineers',
      difficulty: 'Easy',
      source: 'Standard',
      instructions: 'Find all employees from the `Engineering` department whose `salary` is strictly greater than `8000`. Return their `first_name`, `last_name`, `department`, and `salary`.',
      schemaSql: `
CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);

INSERT INTO employees VALUES
(101, 'Alex', 'Chen', 'Engineering', 8900),
(102, 'Maya', 'Lin', 'Engineering', 7500),
(103, 'Liam', 'O\'Connor', 'Sales', 9200),
(104, 'Kenji', 'Sato', 'Engineering', 9600),
(105, 'Chloe', 'Dupont', 'Marketing', 8100),
(106, 'Sofia', 'Rodriguez', 'Engineering', 8000);`,
      tables: [
        {
          name: 'employees',
          description: 'Employee roster with team and compensation',
          columns: [
            { name: 'id', type: 'INT', isPk: true },
            { name: 'first_name', type: 'VARCHAR(50)' },
            { name: 'last_name', type: 'VARCHAR(50)' },
            { name: 'department', type: 'VARCHAR(50)' },
            { name: 'salary', type: 'INT' },
          ],
          sampleData: [
            { id: 101, first_name: 'Alex', last_name: 'Chen', department: 'Engineering', salary: 8900 },
            { id: 102, first_name: 'Maya', last_name: 'Lin', department: 'Engineering', salary: 7500 },
            { id: 103, first_name: 'Liam', last_name: 'O\'Connor', department: 'Sales', salary: 9200 },
          ],
        },
      ],
      starterSql: `SELECT first_name, last_name, department, salary FROM employees WHERE ;`,
      solutionSql: `SELECT first_name, last_name, department, salary FROM employees WHERE department = 'Engineering' AND salary > 8000;`,
      expectedColumns: ['first_name', 'last_name', 'department', 'salary'],
      hints: [
        'Use WHERE department = \'Engineering\' AND salary > 8000',
      ],
    },
    challenges: [
      {
        id: 'c2-where-1',
        title: 'Practice 1: High-Earner Engineers',
        difficulty: 'Easy',
        source: 'Standard',
        instructions: 'Find all employees from the `Engineering` department whose `salary` is strictly greater than `8000`. Return their `first_name`, `last_name`, `department`, and `salary`.',
        schemaSql: `
CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO employees VALUES
(101, 'Alex', 'Chen', 'Engineering', 8900),
(102, 'Maya', 'Lin', 'Engineering', 7500),
(103, 'Liam', 'O\'Connor', 'Sales', 9200),
(104, 'Kenji', 'Sato', 'Engineering', 9600);`,
        tables: [
          {
            name: 'employees',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'first_name', type: 'VARCHAR(50)' },
              { name: 'last_name', type: 'VARCHAR(50)' },
              { name: 'department', type: 'VARCHAR(50)' },
              { name: 'salary', type: 'INT' },
            ],
            sampleData: [
              { id: 101, first_name: 'Alex', last_name: 'Chen', department: 'Engineering', salary: 8900 },
            ],
          },
        ],
        starterSql: `SELECT first_name, last_name, department, salary FROM employees WHERE department = 'Engineering' AND salary > 8000;`,
        solutionSql: `SELECT first_name, last_name, department, salary FROM employees WHERE department = 'Engineering' AND salary > 8000;`,
        expectedColumns: ['first_name', 'last_name', 'department', 'salary'],
        hints: ['Use WHERE department = \'Engineering\' AND salary > 8000'],
      },
      {
        id: 'c2-where-2',
        title: 'Practice 2: Find Customer Referee (LeetCode 584)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 584',
        instructions: 'Find the names of the customer that are NOT referred by the customer with id = 2. Remember: customers with NULL referee_id must be included!',
        schemaSql: `
CREATE TABLE customer (
  id INT PRIMARY KEY,
  name VARCHAR(25),
  referee_id INT
);
INSERT INTO customer VALUES
(1, 'Will', NULL),
(2, 'Jane', NULL),
(3, 'Alex', 2),
(4, 'Bill', NULL),
(5, 'Zack', 1),
(6, 'Mark', 2);`,
        tables: [
          {
            name: 'customer',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'name', type: 'VARCHAR(25)' },
              { name: 'referee_id', type: 'INT' },
            ],
            sampleData: [
              { id: 1, name: 'Will', referee_id: null },
              { id: 2, name: 'Jane', referee_id: null },
              { id: 3, name: 'Alex', referee_id: 2 },
            ],
          },
        ],
        starterSql: `-- Remember to handle NULL values explicitly using IS NULL
SELECT name
FROM customer
WHERE referee_id != 2 OR referee_id IS NULL;`,
        solutionSql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
        expectedColumns: ['name'],
        hints: ['In SQL, NULL != 2 evaluates to UNKNOWN! You must write: referee_id != 2 OR referee_id IS NULL'],
      },
      {
        id: 'c2-where-3',
        title: 'Practice 3: Big Countries (LeetCode 595)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 595',
        instructions: 'A country is big if it has an area of at least 3,000,000 sq km OR a population of at least 25,000,000. Report the name, population, and area of the big countries.',
        schemaSql: `
CREATE TABLE world (
  name VARCHAR(50) PRIMARY KEY,
  continent VARCHAR(50),
  area INT,
  population INT,
  gdp BIGINT
);
INSERT INTO world VALUES
('Afghanistan', 'Asia', 652230, 25500100, 20343000),
('Albania', 'Europe', 28748, 2831741, 12960000),
('Algeria', 'Africa', 2381741, 37100000, 188681000),
('Andorra', 'Europe', 468, 78115, 3712000);`,
        tables: [
          {
            name: 'world',
            columns: [
              { name: 'name', type: 'VARCHAR(50)', isPk: true },
              { name: 'continent', type: 'VARCHAR(50)' },
              { name: 'area', type: 'INT' },
              { name: 'population', type: 'INT' },
              { name: 'gdp', type: 'BIGINT' },
            ],
            sampleData: [
              { name: 'Afghanistan', continent: 'Asia', area: 652230, population: 25500100, gdp: 20343000 },
              { name: 'Algeria', continent: 'Africa', area: 2381741, population: 37100000, gdp: 188681000 },
            ],
          },
        ],
        starterSql: `SELECT name, population, area
FROM world
WHERE area >= 3000000 OR population >= 25000000;`,
        solutionSql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
        expectedColumns: ['name', 'population', 'area'],
        hints: ['Use: WHERE area >= 3000000 OR population >= 25000000'],
      },
    ],
  },
  {
    id: 'topic-3-order-limit',
    order: 3,
    slug: 'order-by-limit',
    title: '3. Sorting & Pagination (ORDER BY & LIMIT)',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Foundations',
    overview: 'Learn how to order your data ascending (ASC) or descending (DESC), sort by multiple columns, and paginate results using LIMIT and OFFSET.',
    video: {
      title: 'SQL ORDER BY & Group By Statements Tutorial',
      embedUrl: 'https://www.youtube.com/embed/LXwfzIRD-Ds',
      duration: '7:30',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Why unordered SQL queries have non-deterministic output order',
        'Sorting numerical, text, and date columns with ORDER BY',
        'ASC (default) vs DESC directions',
        'Multi-column sorting (e.g., department ASC, salary DESC)',
        'Using LIMIT to grab Top N records (e.g., Top 5 earners)',
        'Implementing pagination with OFFSET',
      ],
    },
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Ordering & Limiting Results',
      summary: 'In SQL, relational tables are sets of rows with NO inherent order. Unless you explicitly supply ORDER BY, the order of returned rows is undefined.',
      syntax: `SELECT column1, column2
FROM table_name
ORDER BY column1 ASC, column2 DESC
LIMIT 5 OFFSET 0;`,
      explanation: [
        'ORDER BY sorts the finalized rows right before returning them to the client.',
        'ASC sorts lowest to highest (A-Z, 1-100, earliest to latest date). It is the default.',
        'DESC sorts highest to lowest (Z-A, 100-1, latest to earliest date).',
        'You can order by multiple criteria: if the first column has ties, SQL uses the second column to break the tie.',
        'LIMIT N restricts the result set to at most N rows.',
        'OFFSET M skips the first M rows, making pagination simple: Page 2 with 10 items is "LIMIT 10 OFFSET 10".',
      ],
      keyRules: [
        'ORDER BY comes near the very end of your SQL query, right before LIMIT.',
        'You can order by column names, column aliases defined in SELECT, or even expressions.',
        'Never rely on the default order of a database table without an ORDER BY clause.',
      ],
      commonMistakes: [
        'Placing LIMIT before ORDER BY (syntax error: ORDER BY must precede LIMIT).',
        'Assuming ORDER BY col1, col2 DESC makes col1 descending as well (col1 defaults to ASC!).',
        'Using OFFSET without an explicit ORDER BY, which can cause inconsistent page results across requests.',
      ],
      exampleQuery: `SELECT product_name, price, stock_quantity
FROM products
ORDER BY price DESC
LIMIT 3;`,
      exampleExplanation: 'Returns the top 3 most expensive products in stock.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q3-1',
          question: 'What is the default sort direction when ORDER BY is specified without ASC or DESC?',
          options: ['DESC (highest first)', 'Random', 'ASC (lowest first)', 'The order rows were inserted'],
          correctIndex: 2,
          explanation: 'ASC (ascending) is always the default order in SQL.',
        },
        {
          id: 'q3-2',
          question: 'In the clause "ORDER BY department ASC, salary DESC", what happens when two employees have different departments?',
          options: [
            'They are sorted by salary first',
            'They are sorted strictly by department name alphabetically',
            'An error is raised',
            'They are sorted randomly',
          ],
          correctIndex: 1,
          explanation: 'The primary sort is department. The secondary sort (salary DESC) only kicks in to break ties when employees share the exact same department.',
        },
        {
          id: 'q3-3',
          question: 'Which query retrieves the 2nd page of results with 10 records per page?',
          options: [
            'LIMIT 10 OFFSET 2',
            'LIMIT 10 OFFSET 10',
            'PAGE 2 LIMIT 10',
            'LIMIT 20',
          ],
          correctIndex: 1,
          explanation: 'Page 1 is rows 1-10 (OFFSET 0). Page 2 skips the first 10 rows (OFFSET 10) and takes 10 (LIMIT 10).',
        },
        {
          id: 'q3-4',
          question: 'Where must ORDER BY be placed in the sequence of SQL clauses?',
          options: [
            'Immediately after SELECT',
            'Before WHERE',
            'After WHERE (and GROUP BY/HAVING), before LIMIT',
            'Anywhere in the query',
          ],
          correctIndex: 2,
          explanation: 'The clause structure is: SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT.',
        },
      ],
    },
    challenge: {
      id: 'c3-order-1',
      title: 'Challenge 3: Top 3 Highest Paid Employees',
      difficulty: 'Easy',
      source: 'Standard',
      instructions: 'Write a query to retrieve the top 3 highest-earning employees. Return their `first_name`, `last_name`, and `salary`, sorted from highest salary to lowest.',
      schemaSql: `
CREATE TABLE staff (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  salary INT
);

INSERT INTO staff VALUES
(1, 'Rachel', 'Green', 5200),
(2, 'Monica', 'Geller', 7800),
(3, 'Phoebe', 'Buffay', 4500),
(4, 'Joey', 'Tribbiani', 6100),
(5, 'Chandler', 'Bing', 9500),
(6, 'Ross', 'Geller', 8900);`,
      tables: [
        {
          name: 'staff',
          description: 'Company staff members and their salaries',
          columns: [
            { name: 'id', type: 'INT', isPk: true },
            { name: 'first_name', type: 'VARCHAR(50)' },
            { name: 'last_name', type: 'VARCHAR(50)' },
            { name: 'salary', type: 'INT' },
          ],
          sampleData: [
            { id: 1, first_name: 'Rachel', last_name: 'Green', salary: 5200 },
            { id: 2, first_name: 'Monica', last_name: 'Geller', salary: 7800 },
            { id: 5, first_name: 'Chandler', last_name: 'Bing', salary: 9500 },
          ],
        },
      ],
      starterSql: `SELECT first_name, last_name, salary FROM staff ORDER BY salary DESC LIMIT 3;`,
      solutionSql: `SELECT first_name, last_name, salary FROM staff ORDER BY salary DESC LIMIT 3;`,
      expectedColumns: ['first_name', 'last_name', 'salary'],
      hints: [
        'Order by salary from highest to lowest: ORDER BY salary DESC',
        'Use LIMIT 3 to only return the top 3 rows.',
      ],
    },
    challenges: [
      {
        id: 'c3-order-1',
        title: 'Practice 1: Top 3 Highest Paid Employees',
        difficulty: 'Easy',
        source: 'Standard',
        instructions: 'Write a query to retrieve the top 3 highest-earning employees. Return their `first_name`, `last_name`, and `salary`, sorted from highest salary to lowest.',
        schemaSql: `
CREATE TABLE staff (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  salary INT
);
INSERT INTO staff VALUES
(1, 'Rachel', 'Green', 5200),
(2, 'Monica', 'Geller', 7800),
(3, 'Phoebe', 'Buffay', 4500),
(4, 'Joey', 'Tribbiani', 6100),
(5, 'Chandler', 'Bing', 9500),
(6, 'Ross', 'Geller', 8900);`,
        tables: [
          {
            name: 'staff',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'first_name', type: 'VARCHAR(50)' },
              { name: 'last_name', type: 'VARCHAR(50)' },
              { name: 'salary', type: 'INT' },
            ],
            sampleData: [{ id: 5, first_name: 'Chandler', last_name: 'Bing', salary: 9500 }],
          },
        ],
        starterSql: `SELECT first_name, last_name, salary FROM staff ORDER BY salary DESC LIMIT 3;`,
        solutionSql: `SELECT first_name, last_name, salary FROM staff ORDER BY salary DESC LIMIT 3;`,
        expectedColumns: ['first_name', 'last_name', 'salary'],
        hints: ['ORDER BY salary DESC LIMIT 3'],
      },
      {
        id: 'c3-order-2',
        title: 'Practice 2: Second Highest Distinct Salary (LeetCode 176)',
        difficulty: 'Medium',
        source: 'LeetCode',
        sourceId: 'LeetCode 176',
        instructions: 'Find the second highest distinct salary from the Employee table. If there is no second highest salary, return NULL with the column alias `second_highest_salary`.',
        schemaSql: `
CREATE TABLE employee (
  id INT PRIMARY KEY,
  salary INT
);
INSERT INTO employee VALUES
(1, 100),
(2, 200),
(3, 300);`,
        tables: [
          {
            name: 'employee',
            columns: [
              { name: 'id', type: 'INT', isPk: true },
              { name: 'salary', type: 'INT' },
            ],
            sampleData: [
              { id: 1, salary: 100 },
              { id: 2, salary: 200 },
              { id: 3, salary: 300 },
            ],
          },
        ],
        starterSql: `-- LeetCode 176: Return 2nd highest distinct salary or NULL
SELECT (
  SELECT DISTINCT salary 
  FROM employee 
  ORDER BY salary DESC 
  LIMIT 1 OFFSET 1
) AS second_highest_salary;`,
        solutionSql: `SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest_salary;`,
        expectedColumns: ['second_highest_salary'],
        hints: ['Wrapping a LIMIT 1 OFFSET 1 query inside a scalar SELECT (subquery) automatically converts empty results to NULL!'],
      },
    ],
  },
];
