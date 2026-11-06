import { Topic } from '../../types';

export const ADVANCED_MODULES: Topic[] = [
  {
    id: 'topic-6-subqueries-cte',
    order: 6,
    slug: 'subqueries-ctes',
    title: '6. Subqueries & Common Table Expressions (CTEs)',
    level: 'Advanced',
    estimatedMinutes: 25,
    badge: 'Advanced SQL',
    overview: 'Break down complex analytical questions into clean, readable modular steps using CTEs (WITH clause) and nested scalar or table subqueries.',
    video: {
      title: 'SQL Subqueries vs CTEs (Common Table Expressions) Explained',
      embedUrl: 'https://www.youtube.com/embed/2H8jf10UeJc',
      duration: '13:40',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'What is a Subquery (inner query evaluated to feed outer query)',
        'Scalar subqueries vs Table subqueries vs Correlated subqueries',
        'The WITH clause (CTE - Common Table Expression) syntax',
        'Why CTEs dramatically improve readability over nested subqueries',
        'Chaining multiple CTEs together for multi-stage pipelines',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL CTEs & Subqueries in Telugu (తెలుగు)',
        embedUrl: 'https://www.youtube.com/embed/8F6fv4_MDbM',
        duration: '1:45:00',
        channel: 'Telugu Tech Academy',
        language: 'Telugu',
        summaryPoints: [
          'CTEs explained in Telugu with real-life analogies',
          'Breaking large queries into manageable steps',
        ],
      },
    ],
    theory: {
      title: 'Modular Logic with CTEs & Subqueries',
      summary: 'A Common Table Expression (CTE) is a temporary named result set defined before the main query using the WITH keyword.',
      syntax: `WITH dept_averages AS (
  SELECT department, AVG(salary) AS avg_dept_salary
  FROM employees
  GROUP BY department
)
SELECT e.first_name, e.salary, d.avg_dept_salary
FROM employees e
JOIN dept_averages d ON e.department = d.department
WHERE e.salary > d.avg_dept_salary;`,
      explanation: [
        'Subqueries can exist in WHERE, SELECT, or FROM clauses.',
        'Nested subqueries quickly become unreadable. CTEs solve this with readable, top-to-bottom steps.',
        'A CTE is introduced with `WITH cte_name AS ( ... )` followed by the query that uses it.',
        'You can chain multiple CTEs by separating them with a comma: `WITH cte1 AS (...), cte2 AS (...) SELECT ...`.',
      ],
      keyRules: [
        'The WITH keyword is written only ONCE at the start.',
        'CTEs exist only for the scope of the single statement they precede.',
      ],
      commonMistakes: [
        'Writing `WITH` multiple times instead of separating with commas.',
        'Putting a semicolon after the CTE definition before the main SELECT.',
      ],
      exampleQuery: `WITH top_products AS (
  SELECT product_id, SUM(quantity) as total_sold
  FROM order_items
  GROUP BY product_id
  HAVING SUM(quantity) > 100
)
SELECT p.name, t.total_sold
FROM top_products t
JOIN products p ON t.product_id = p.id;`,
      exampleExplanation: 'Pre-aggregates total units sold into a CTE named top_products, then joins with product details.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q6-1',
          question: 'What is the primary readability advantage of CTEs over nested subqueries?',
          options: [
            'CTEs are read top-to-bottom like regular variables instead of inverted inside-out',
            'CTEs bypass the SQL query parser entirely',
            'CTEs permanently save tables to the hard drive',
            'CTEs allow writing JavaScript inside SQL',
          ],
          correctIndex: 0,
          explanation: 'CTEs declare intermediate tables at the top of the query, making the logical pipeline clear and straightforward.',
        },
        {
          id: 'q6-2',
          question: 'How do you define multiple CTEs in a single query?',
          options: [
            'Write WITH cte1 AS (...), WITH cte2 AS (...)',
            'Write WITH cte1 AS (...), cte2 AS (...) separated by commas with only one initial WITH keyword',
            'Use the SUBQUERY keyword',
            'Only one CTE is ever allowed per query',
          ],
          correctIndex: 1,
          explanation: 'You write WITH once, followed by comma-separated definitions: WITH a AS (...), b AS (...) SELECT ...',
        },
      ],
    },
    challenge: {
      id: 'c6-sub-1',
      title: 'Challenge 6: Above-Average Earners',
      difficulty: 'Medium',
      source: 'Standard',
      instructions: 'Find all employees whose `salary` is strictly greater than the company-wide average salary. Return their `first_name`, `last_name`, `salary`, and order by `salary` descending.',
      schemaSql: `
CREATE TABLE staff_salaries (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  salary INT
);
INSERT INTO staff_salaries VALUES
(1, 'Emma', 'Watson', 7200),
(2, 'Daniel', 'Radcliffe', 6000),
(3, 'Rupert', 'Grint', 5800),
(4, 'Tom', 'Felton', 8500),
(5, 'Alan', 'Rickman', 9800),
(6, 'Maggie', 'Smith', 9200);`,
      tables: [
        {
          name: 'staff_salaries',
          columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'first_name', type: 'VARCHAR(50)' }, { name: 'last_name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }],
          sampleData: [{ id: 1, first_name: 'Emma', salary: 7200 }, { id: 5, first_name: 'Alan', salary: 9800 }],
        },
      ],
      starterSql: `SELECT first_name, last_name, salary FROM staff_salaries WHERE salary > (SELECT AVG(salary) FROM staff_salaries) ORDER BY salary DESC;`,
      solutionSql: `SELECT first_name, last_name, salary FROM staff_salaries WHERE salary > (SELECT AVG(salary) FROM staff_salaries) ORDER BY salary DESC;`,
      expectedColumns: ['first_name', 'last_name', 'salary'],
      hints: ['Use scalar subquery in WHERE: WHERE salary > (SELECT AVG(salary) FROM staff_salaries)'],
    },
    challenges: [
      {
        id: 'c6-sub-1',
        title: 'Practice 1: Above-Average Earners',
        difficulty: 'Medium',
        source: 'Standard',
        instructions: 'Find all employees whose `salary` is strictly greater than the company-wide average salary. Return their `first_name`, `last_name`, `salary`, and order by `salary` descending.',
        schemaSql: `
CREATE TABLE staff_salaries (id INT PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), salary INT);
INSERT INTO staff_salaries VALUES (1, 'Emma', 'Watson', 7200), (2, 'Daniel', 'Radcliffe', 6000), (4, 'Tom', 'Felton', 8500), (5, 'Alan', 'Rickman', 9800);`,
        tables: [{ name: 'staff_salaries', columns: [{ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }], sampleData: [{ first_name: 'Alan', salary: 9800 }] }],
        starterSql: `SELECT first_name, last_name, salary FROM staff_salaries WHERE salary > (SELECT AVG(salary) FROM staff_salaries) ORDER BY salary DESC;`,
        solutionSql: `SELECT first_name, last_name, salary FROM staff_salaries WHERE salary > (SELECT AVG(salary) FROM staff_salaries) ORDER BY salary DESC;`,
        expectedColumns: ['first_name', 'last_name', 'salary'],
        hints: ['WHERE salary > (SELECT AVG(salary) FROM staff_salaries)'],
      },
      {
        id: 'c6-sub-2',
        title: 'Practice 2: Tree Node Type (50 SQL #4 / LeetCode 608)',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'LeetCode 608 / Interview #4',
        instructions: 'Label every tree node: "Root" if it has no parent (p_id IS NULL), "Inner" if it has a parent and at least one child, and "Leaf" otherwise. Return `id` and `type`, sorted by `id`.',
        schemaSql: `
CREATE TABLE tree (
  id INT PRIMARY KEY,
  p_id INT
);
INSERT INTO tree VALUES
(1, NULL),
(2, 1),
(3, 1),
(4, 2),
(5, 2);`,
        tables: [
          {
            name: 'tree',
            columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'p_id', type: 'INT' }],
            sampleData: [{ id: 1, p_id: null }, { id: 2, p_id: 1 }, { id: 4, p_id: 2 }],
          },
        ],
        starterSql: `SELECT id,
  CASE 
    WHEN p_id IS NULL THEN 'Root'
    WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner'
    ELSE 'Leaf'
  END AS type
FROM tree
ORDER BY id;`,
        solutionSql: `SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM tree ORDER BY id;`,
        expectedColumns: ['id', 'type'],
        hints: ['Remember to filter out NULLs when checking: WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL)'],
      },
      {
        id: 'c6-sub-3',
        title: 'Practice 3: Department Highest Salary (LeetCode 184)',
        difficulty: 'Medium',
        source: 'LeetCode',
        sourceId: 'LeetCode 184',
        instructions: 'Find employees who have the highest salary in each of the departments. Return Department, Employee, and Salary.',
        schemaSql: `
CREATE TABLE department (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);
INSERT INTO department VALUES (1, 'IT'), (2, 'Sales');
INSERT INTO employee VALUES (1, 'Joe', 70000, 1), (2, 'Jim', 90000, 1), (3, 'Henry', 80000, 2), (4, 'Sam', 60000, 2), (5, 'Max', 90000, 1);`,
        tables: [
          {
            name: 'employee',
            columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }],
            sampleData: [{ name: 'Jim', salary: 90000 }, { name: 'Max', salary: 90000 }],
          },
        ],
        starterSql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM employee e
JOIN department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
  SELECT departmentId, MAX(salary)
  FROM employee
  GROUP BY departmentId
);`,
        solutionSql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM employee e JOIN department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM employee GROUP BY departmentId);`,
        expectedColumns: ['Department', 'Employee', 'Salary'],
        hints: ['Use tuple subquery: WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM employee GROUP BY departmentId)'],
      },
    ],
  },
  {
    id: 'topic-7-window-functions',
    order: 7,
    slug: 'window-functions',
    title: '7. Window Functions (Ranking, Running Sums & LAG)',
    level: 'Advanced',
    estimatedMinutes: 30,
    badge: 'Advanced SQL',
    overview: 'Perform calculations across related rows without collapsing groups. Master ROW_NUMBER, RANK, DENSE_RANK, LAG, and running totals.',
    video: {
      title: 'SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK) Complete Guide',
      embedUrl: 'https://www.youtube.com/embed/0h3jO3_H3uc',
      duration: '16:00',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Difference between GROUP BY and Window Functions',
        'OVER clause syntax and PARTITION BY',
        'Ranking: ROW_NUMBER vs RANK vs DENSE_RANK',
        'Running sums and moving frames',
        'LAG & LEAD functions for time-series comparisons',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL Window Functions in Telugu (తెలుగు)',
        embedUrl: 'https://www.youtube.com/embed/8F6fv4_MDbM',
        duration: '1:45:00',
        channel: 'Telugu Tech Academy',
        language: 'Telugu',
        summaryPoints: [
          'Telugu walkthrough of window ranking functions',
          'PARTITION BY vs ORDER BY inside OVER()',
        ],
      },
    ],
    theory: {
      title: 'Advanced Analytics with Window Functions',
      summary: 'A window function performs a calculation across a set of table rows that are related to the current row, without collapsing rows like GROUP BY does.',
      syntax: `SELECT 
  employee_id,
  department,
  salary,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank
FROM employees;`,
      explanation: [
        'Unlike GROUP BY, window functions retain each original row while attaching the calculated analytic value.',
        'PARTITION BY divides rows into groups/windows.',
        'ROW_NUMBER(): Assigns 1, 2, 3... unconditionally.',
        'DENSE_RANK(): Assigns same rank to ties with NO gaps (1, 2, 2, 3).',
        'LAG(col, 1) OVER (ORDER BY date): Grabs the previous row\'s value.',
      ],
      keyRules: [
        'Window functions run after WHERE, GROUP BY, and HAVING.',
        'To filter on a window function result, wrap it inside a CTE or subquery.',
      ],
      commonMistakes: [
        'Attempting to write `WHERE ROW_NUMBER() = 1` directly (must use CTE!).',
      ],
      exampleQuery: `WITH ranked AS (
  SELECT name, department, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT name, department, salary FROM ranked WHERE rnk = 1;`,
      exampleExplanation: 'Finds the highest-paid employee(s) in each department, handling ties cleanly.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q7-1',
          question: 'If salaries are [100, 90, 90, 80], what ranks will DENSE_RANK() generate when ordered descending?',
          options: ['[1, 2, 3, 4]', '[1, 2, 2, 4]', '[1, 2, 2, 3]', '[1, 1, 1, 1]'],
          correctIndex: 2,
          explanation: 'DENSE_RANK gives identical values the same rank and does NOT skip numbers: 1, 2, 2, 3.',
        },
      ],
    },
    challenge: {
      id: 'c7-win-1',
      title: 'Challenge 7: Department Salary Ranking',
      difficulty: 'Hard',
      source: 'Standard',
      instructions: 'For all employees, assign a `salary_rank` within their `department` based on `salary` descending using `DENSE_RANK()`. Return `first_name`, `department`, `salary`, and `salary_rank`. Order by `department` ASC, `salary_rank` ASC.',
      schemaSql: `
CREATE TABLE corp_employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  department VARCHAR(50),
  salary INT
);
INSERT INTO corp_employees VALUES
(1, 'Tony', 'Engineering', 12000),
(2, 'Bruce', 'Engineering', 12000),
(3, 'Peter', 'Engineering', 7000),
(4, 'Natasha', 'Finance', 9500),
(5, 'Clint', 'Finance', 8000),
(6, 'Steve', 'Finance', 9500);`,
      tables: [
        {
          name: 'corp_employees',
          columns: [{ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'department', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }],
          sampleData: [{ first_name: 'Tony', department: 'Engineering', salary: 12000 }],
        },
      ],
      starterSql: `SELECT first_name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM corp_employees ORDER BY department ASC, salary_rank ASC;`,
      solutionSql: `SELECT first_name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM corp_employees ORDER BY department ASC, salary_rank ASC;`,
      expectedColumns: ['first_name', 'department', 'salary', 'salary_rank'],
      hints: ['DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank'],
    },
    challenges: [
      {
        id: 'c7-win-1',
        title: 'Practice 1: Department Salary Ranking',
        difficulty: 'Medium',
        source: 'Standard',
        instructions: 'Assign a `salary_rank` within each department using `DENSE_RANK()`. Order by `department` ASC, `salary_rank` ASC.',
        schemaSql: `
CREATE TABLE corp_employees (id INT PRIMARY KEY, first_name VARCHAR(50), department VARCHAR(50), salary INT);
INSERT INTO corp_employees VALUES (1, 'Tony', 'Engineering', 12000), (2, 'Bruce', 'Engineering', 12000), (3, 'Peter', 'Engineering', 7000);`,
        tables: [{ name: 'corp_employees', columns: [{ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }], sampleData: [{ first_name: 'Tony', salary: 12000 }] }],
        starterSql: `SELECT first_name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM corp_employees ORDER BY department ASC, salary_rank ASC;`,
        solutionSql: `SELECT first_name, department, salary, DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank FROM corp_employees ORDER BY department ASC, salary_rank ASC;`,
        expectedColumns: ['first_name', 'department', 'salary', 'salary_rank'],
        hints: ['DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)'],
      },
      {
        id: 'c7-win-2',
        title: 'Practice 2: Rank Scores (50 SQL #26 / LeetCode 178)',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'LeetCode 178 / Interview #26',
        instructions: 'Rank the scores from highest to lowest. Equal scores share a rank with no gaps. Return `score` and `rank` (aliased as "rank"), ordered by `score` descending.',
        schemaSql: `
CREATE TABLE scores (
  id INT PRIMARY KEY,
  score DECIMAL(3,2)
);
INSERT INTO scores VALUES
(1, 3.50),
(2, 3.65),
(3, 4.00),
(4, 3.85),
(5, 4.00),
(6, 3.65);`,
        tables: [
          {
            name: 'scores',
            columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'score', type: 'DECIMAL(3,2)' }],
            sampleData: [{ id: 3, score: 4.00 }, { id: 5, score: 4.00 }, { id: 4, score: 3.85 }],
          },
        ],
        starterSql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM scores
ORDER BY score DESC;`,
        solutionSql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank" FROM scores ORDER BY score DESC;`,
        expectedColumns: ['score', 'rank'],
        hints: ['Use DENSE_RANK() OVER (ORDER BY score DESC) AS "rank" ORDER BY score DESC;'],
      },
      {
        id: 'c7-win-3',
        title: 'Practice 3: Last Person to Fit in the Bus (50 SQL #29 / LeetCode 1204)',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'LeetCode 1204 / Interview #29',
        instructions: 'The bus holds at most 1000 kg. People board in order of `turn`. Find the `person_name` of the last person who fits without exceeding 1000 kg.',
        schemaSql: `
CREATE TABLE queue (
  person_id INT PRIMARY KEY,
  person_name VARCHAR(50),
  weight INT,
  turn INT
);
INSERT INTO queue VALUES
(5, 'Alice', 250, 1),
(4, 'Bob', 175, 2),
(3, 'Alex', 350, 3),
(6, 'John Cena', 400, 4),
(1, 'Winston', 500, 5);`,
        tables: [
          {
            name: 'queue',
            columns: [{ name: 'person_name', type: 'VARCHAR(50)' }, { name: 'weight', type: 'INT' }, { name: 'turn', type: 'INT' }],
            sampleData: [{ person_name: 'Alice', weight: 250, turn: 1 }, { person_name: 'Bob', weight: 175, turn: 2 }],
          },
        ],
        starterSql: `WITH running_weight AS (
  SELECT 
    person_name,
    SUM(weight) OVER (ORDER BY turn) AS total_weight
  FROM queue
)
SELECT person_name
FROM running_weight
WHERE total_weight <= 1000
ORDER BY total_weight DESC
LIMIT 1;`,
        solutionSql: `WITH running_weight AS (SELECT person_name, SUM(weight) OVER (ORDER BY turn) AS total_weight FROM queue) SELECT person_name FROM running_weight WHERE total_weight <= 1000 ORDER BY total_weight DESC LIMIT 1;`,
        expectedColumns: ['person_name'],
        hints: ['Compute running sum: SUM(weight) OVER (ORDER BY turn) AS total_weight, then filter <= 1000 and take LIMIT 1 ordered by total_weight DESC'],
      },
    ],
  },
  {
    id: 'topic-8-case-when',
    order: 8,
    slug: 'conditional-case-when',
    title: '8. Conditional Logic (CASE WHEN, Pivots & Set Operations)',
    level: 'Advanced',
    estimatedMinutes: 25,
    badge: 'Interview Ready',
    overview: 'Learn how to implement branching logic using CASE WHEN, zero-count category reporting with UNION ALL, and seat swapping modulo patterns.',
    video: {
      title: 'SQL CASE WHEN Statement Tutorial with Real Examples',
      embedUrl: 'https://www.youtube.com/embed/H7o_Zry6a1o',
      duration: '9:50',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'How CASE WHEN works like if-then-else in programming',
        'Categorizing continuous variables into buckets',
        'Conditional aggregations with CASE',
        'Using COALESCE to handle NULL values',
      ],
    },
    theory: {
      title: 'Conditional Branching with CASE WHEN',
      summary: 'The CASE expression goes through conditions and returns a value when the first condition is met.',
      syntax: `SELECT name, salary,
  CASE 
    WHEN salary >= 10000 THEN 'Executive Tier'
    WHEN salary >= 7000  THEN 'Senior Tier'
    ELSE 'Standard Tier'
  END AS compensation_tier
FROM employees;`,
      explanation: [
        'The CASE statement evaluates sequentially top-to-bottom.',
        'Always end the expression with the END keyword.',
        'Combine CASE with UNION ALL to ensure empty categories are preserved with zero counts.',
      ],
      keyRules: ['Always provide an ELSE fallback to prevent unwanted NULLs.', 'Ensure data types in THEN clauses are compatible.'],
      commonMistakes: ['Forgetting the END terminator.', 'Overlapping condition ranges without realizing evaluation stops on the first match.'],
      exampleQuery: `SELECT name, CASE WHEN salary >= 7000 THEN 'High' ELSE 'Normal' END AS tier FROM employees;`,
      exampleExplanation: 'Categorizes employees into High or Normal tiers.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q8-1',
          question: 'What happens if no condition in a CASE WHEN is TRUE and there is NO ELSE clause?',
          options: ['It raises an error', 'It returns NULL', 'It returns empty string', 'It returns 0'],
          correctIndex: 1,
          explanation: 'Without an ELSE fallback, CASE evaluates to NULL if none of the WHEN predicates are met.',
        },
      ],
    },
    challenge: {
      id: 'c8-case-1',
      title: 'Challenge 8: Salary Tier Classification',
      difficulty: 'Medium',
      source: 'Standard',
      instructions: 'Categorize each employee into `salary_tier`: if `salary >= 9000` output `\'High\'`, if `salary >= 7000` output `\'Medium\'`, otherwise `\'Low\'`. Return `first_name`, `salary`, and `salary_tier`. Order by `salary` descending.',
      schemaSql: `
CREATE TABLE staff_tiers (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  salary INT
);
INSERT INTO staff_tiers VALUES
(1, 'Luke', 10500),
(2, 'Leia', 9200),
(3, 'Han', 8100),
(4, 'Chewbacca', 6800),
(5, 'Lando', 5400);`,
      tables: [
        {
          name: 'staff_tiers',
          columns: [{ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }],
          sampleData: [{ first_name: 'Luke', salary: 10500 }, { first_name: 'Chewbacca', salary: 6800 }],
        },
      ],
      starterSql: `SELECT first_name, salary, CASE WHEN salary >= 9000 THEN 'High' WHEN salary >= 7000 THEN 'Medium' ELSE 'Low' END AS salary_tier FROM staff_tiers ORDER BY salary DESC;`,
      solutionSql: `SELECT first_name, salary, CASE WHEN salary >= 9000 THEN 'High' WHEN salary >= 7000 THEN 'Medium' ELSE 'Low' END AS salary_tier FROM staff_tiers ORDER BY salary DESC;`,
      expectedColumns: ['first_name', 'salary', 'salary_tier'],
      hints: ['Use CASE WHEN salary >= 9000 THEN \'High\' WHEN salary >= 7000 THEN \'Medium\' ELSE \'Low\' END AS salary_tier'],
    },
    challenges: [
      {
        id: 'c8-case-1',
        title: 'Practice 1: Salary Tier Classification',
        difficulty: 'Medium',
        source: 'Standard',
        instructions: 'Categorize each employee into `salary_tier` (High, Medium, Low).',
        schemaSql: `
CREATE TABLE staff_tiers (id INT PRIMARY KEY, first_name VARCHAR(50), salary INT);
INSERT INTO staff_tiers VALUES (1, 'Luke', 10500), (2, 'Leia', 9200), (3, 'Han', 8100), (4, 'Chewbacca', 6800), (5, 'Lando', 5400);`,
        tables: [{ name: 'staff_tiers', columns: [{ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }], sampleData: [{ first_name: 'Luke', salary: 10500 }] }],
        starterSql: `SELECT first_name, salary, CASE WHEN salary >= 9000 THEN 'High' WHEN salary >= 7000 THEN 'Medium' ELSE 'Low' END AS salary_tier FROM staff_tiers ORDER BY salary DESC;`,
        solutionSql: `SELECT first_name, salary, CASE WHEN salary >= 9000 THEN 'High' WHEN salary >= 7000 THEN 'Medium' ELSE 'Low' END AS salary_tier FROM staff_tiers ORDER BY salary DESC;`,
        expectedColumns: ['first_name', 'salary', 'salary_tier'],
        hints: ['CASE WHEN salary >= 9000 THEN \'High\' ...'],
      },
      {
        id: 'c8-case-2',
        title: 'Practice 2: Exchange Seats (50 SQL #20 / LeetCode 626)',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'LeetCode 626 / Interview #20',
        instructions: 'Swap the seat id of every two consecutive students (1<->2, 3<->4). If the number of students is odd, the last student keeps their seat. Return `id` and `student`, ordered by `id` ASC.',
        schemaSql: `
CREATE TABLE seat (
  id INT PRIMARY KEY,
  student VARCHAR(50)
);
INSERT INTO seat VALUES
(1, 'Abbot'),
(2, 'Doris'),
(3, 'Emerson'),
(4, 'Green'),
(5, 'Jeames');`,
        tables: [
          {
            name: 'seat',
            columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'student', type: 'VARCHAR(50)' }],
            sampleData: [{ id: 1, student: 'Abbot' }, { id: 2, student: 'Doris' }, { id: 5, student: 'Jeames' }],
          },
        ],
        starterSql: `SELECT 
  CASE 
    WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM seat) THEN id
    WHEN id % 2 = 1 THEN id + 1
    ELSE id - 1
  END AS id,
  student
FROM seat
ORDER BY id ASC;`,
        solutionSql: `SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM seat ORDER BY id ASC;`,
        expectedColumns: ['id', 'student'],
        hints: ['Check modulo: odd numbers increment (id + 1) unless it\'s the last student, even numbers decrement (id - 1).'],
      },
      {
        id: 'c8-case-3',
        title: 'Practice 3: Count Salary Categories (50 SQL #22 / LeetCode 1907)',
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'LeetCode 1907 / Interview #22',
        instructions: 'Count bank accounts in three categories: "Low Salary" (< 20000), "Average Salary" (20000 to 50000 inclusive), and "High Salary" (> 50000). All three categories must appear, even if the count is 0. Return `category` and `accounts_count`.',
        schemaSql: `
CREATE TABLE accounts (
  account_id INT PRIMARY KEY,
  income INT
);
INSERT INTO accounts VALUES
(3, 108939),
(2, 12747),
(8, 87709),
(6, 91796);`,
        tables: [
          {
            name: 'accounts',
            columns: [{ name: 'account_id', type: 'INT', isPk: true }, { name: 'income', type: 'INT' }],
            sampleData: [{ account_id: 3, income: 108939 }, { account_id: 2, income: 12747 }],
          },
        ],
        starterSql: `SELECT 'Low Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income < 20000
UNION ALL
SELECT 'Average Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income BETWEEN 20000 AND 50000
UNION ALL
SELECT 'High Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income > 50000;`,
        solutionSql: `SELECT 'Low Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income < 20000 UNION ALL SELECT 'Average Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income BETWEEN 20000 AND 50000 UNION ALL SELECT 'High Salary' AS category, COUNT(*) AS accounts_count FROM accounts WHERE income > 50000;`,
        expectedColumns: ['category', 'accounts_count'],
        hints: ['Use three separate SELECT ... UNION ALL blocks so every category is guaranteed to be present with its count.'],
      },
    ],
  },
];
