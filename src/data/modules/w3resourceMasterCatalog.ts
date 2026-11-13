// Master W3Resource SQL Exercises Catalog & Curriculum Index
// Maps all 28 modules, 6 core categories, and 1,856 verified exercises shown in the w3resource curriculum

export interface W3Subtrack {
  id: string;
  name: string;
  count: number;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tags: string[];
  sampleQuestions: {
    title: string;
    description: string;
    sampleSql: string;
  }[];
}

export interface W3Track {
  id: string;
  name: string;
  description: string;
  iconName: string;
  totalExercises: number;
  subtracks: W3Subtrack[];
}

export const W3RESOURCE_MASTER_CATALOG: W3Track[] = [
  {
    id: 'sql-fundamentals',
    name: 'SQL Fundamentals',
    description: 'Data structure definitions, data alterations, relational comparisons, and pattern matching.',
    iconName: 'BookOpen',
    totalExercises: 538,
    subtracks: [
      {
        id: 'ddl',
        name: 'Data Definition Language (DDL)',
        count: 75,
        slug: 'sql-data-definition-language-ddl',
        difficulty: 'Beginner',
        description: 'Creating tables, defining constraints (PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE), modifying schemas with ALTER TABLE, and DROP/TRUNCATE.',
        tags: ['CREATE TABLE', 'ALTER TABLE', 'CONSTRAINTS', 'DROP TABLE'],
        sampleQuestions: [
          {
            title: 'Create Employees Table with Constraints',
            description: 'Write a SQL statement to create an employees table including employee_id, first_name, last_name, email, and salary with PRIMARY KEY and NOT NULL constraints.',
            sampleSql: 'CREATE TABLE employees (\n  employee_id INT PRIMARY KEY,\n  first_name TEXT NOT NULL,\n  last_name TEXT NOT NULL,\n  email TEXT UNIQUE NOT NULL,\n  salary DECIMAL(10,2) CHECK (salary > 0)\n);',
          },
          {
            title: 'Add Unique Foreign Key Reference',
            description: 'Add a foreign key constraint to link order details to products with cascading delete.',
            sampleSql: 'ALTER TABLE order_details\nADD CONSTRAINT fk_product\nFOREIGN KEY (product_id) REFERENCES products(product_id)\nON DELETE CASCADE;',
          },
        ],
      },
      {
        id: 'dml',
        name: 'Data Manipulation Language (DML)',
        count: 80,
        slug: 'sql-data-manipulation-language-dml',
        difficulty: 'Beginner',
        description: 'Inserting single and multiple records, updating values with WHERE conditions, and conditional row deletions.',
        tags: ['INSERT INTO', 'UPDATE', 'DELETE', 'DEFAULT VALUES'],
        sampleQuestions: [
          {
            title: 'Multi-Row Batch Insert',
            description: 'Insert 3 new departments into department master in a single INSERT statement.',
            sampleSql: 'INSERT INTO emp_department (dpt_code, dpt_name, dpt_allotment) VALUES\n(91, "Logistics", 45000),\n(92, "Analytics", 85000),\n(93, "Design", 60000);',
          },
          {
            title: 'Conditional Salary Increment',
            description: 'Increase salary by 10% for all employees in department 47 earning less than 50000.',
            sampleSql: 'UPDATE employees\nSET salary = salary * 1.10\nWHERE department_id = 47 AND salary < 50000;',
          },
        ],
      },
      {
        id: 'retrieve',
        name: 'Retrieve Data from Tables',
        count: 165,
        slug: 'sql-retrieve-data-from-tables',
        difficulty: 'Beginner',
        description: 'Master projection, row limiting, column aliasing, and SELECT statement foundations.',
        tags: ['SELECT', 'AS', 'DISTINCT', 'WHERE', 'LIMIT'],
        sampleQuestions: [
          {
            title: 'Distinct Customer Cities',
            description: 'Display all distinct cities from which customers have registered.',
            sampleSql: 'SELECT DISTINCT city FROM customer ORDER BY city ASC;',
          },
          {
            title: 'Formatted Salary Projections',
            description: 'Display employee first name, last name, and computed annual salary (salary * 12).',
            sampleSql: 'SELECT first_name, last_name, salary * 12 AS annual_salary FROM employees;',
          },
        ],
      },
      {
        id: 'multiple-tables',
        name: 'Querying on Multiple Tables',
        count: 48,
        slug: 'sql-quering-on-multiple-tables',
        difficulty: 'Intermediate',
        description: 'Query multiple tables simultaneously using comma cross-joins and WHERE join predicates.',
        tags: ['Multi-table', 'Cartesian Product', 'WHERE Join'],
        sampleQuestions: [
          {
            title: 'Cross Salesman & Customer in New York',
            description: 'Display all pairs of salesmen and customers where both reside in New York.',
            sampleSql: 'SELECT s.name AS salesman, c.cust_name AS customer\nFROM salesman s, customer c\nWHERE s.city = "New York" AND c.city = "New York";',
          },
        ],
      },
      {
        id: 'boolean-relational',
        name: 'Boolean and Relational Operators',
        count: 60,
        slug: 'sql-boolean-and-relational-operators',
        difficulty: 'Beginner',
        description: 'Complex filtering logic with AND, OR, NOT, comparisons (<, <=, >, >=, <>), and BETWEEN.',
        tags: ['AND', 'OR', 'NOT', 'BETWEEN', 'Operators'],
        sampleQuestions: [
          {
            title: 'Orders Filtering with AND/OR Hierarchy',
            description: 'Find orders with amount above 1000 placed either in September 2012 or by salesman 5001.',
            sampleSql: 'SELECT * FROM orders\nWHERE purch_amt > 1000\n  AND (ord_date >= "2012-09-01" AND ord_date <= "2012-09-30" OR salesman_id = 5001);',
          },
        ],
      },
      {
        id: 'wildcard-special',
        name: 'Wildcard and Special Operators',
        count: 110,
        slug: 'sql-wildcard-special-operators',
        difficulty: 'Intermediate',
        description: 'Pattern matching with LIKE, NOT LIKE, percent (%), underscore (_), IN, and ESCAPE characters.',
        tags: ['LIKE', 'Wildcards', 'IN', 'IS NULL'],
        sampleQuestions: [
          {
            title: 'Names Containing Pattern with Underscores',
            description: 'Find salespeople whose name contains an "a" as the second letter and ends with "n".',
            sampleSql: 'SELECT * FROM salesman WHERE name LIKE "_a%n";',
          },
        ],
      },
    ],
  },
  {
    id: 'data-aggregation',
    name: 'Data Aggregation & Formatting',
    description: 'Summarize large datasets, compute statistical metrics, and format query presentation.',
    iconName: 'Layers',
    totalExercises: 185,
    subtracks: [
      {
        id: 'aggregates',
        name: 'Aggregate Functions',
        count: 125,
        slug: 'sql-aggregate-functions',
        difficulty: 'Intermediate',
        description: 'GROUP BY aggregations, COUNT, SUM, AVG, MIN, MAX, and group filtering with HAVING.',
        tags: ['GROUP BY', 'HAVING', 'SUM', 'AVG', 'COUNT'],
        sampleQuestions: [
          {
            title: 'Customer Order Count & Max Spend',
            description: 'Group orders by customer, finding total orders placed and highest purchase amount for customers with > 1 order.',
            sampleSql: 'SELECT customer_id, COUNT(ord_no) AS total_orders, MAX(purch_amt) AS max_spend\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(ord_no) > 1\nORDER BY max_spend DESC;',
          },
        ],
      },
      {
        id: 'formatting',
        name: 'Formatting Query Output',
        count: 60,
        slug: 'sql-formatting-query-output',
        difficulty: 'Intermediate',
        description: 'Concatenating strings, formatting percentages, ordinal position sorting, and currency representation.',
        tags: ['Concatenation', 'ORDER BY Position', 'Formatting'],
        sampleQuestions: [
          {
            title: 'Custom Reporting Format String',
            description: 'Format salesperson summary into "Salesperson James Hoog earns 15% commission".',
            sampleSql: 'SELECT "Salesperson " || name || " earns " || CAST(commission * 100 AS INT) || "% commission" AS summary\nFROM salesman;',
          },
        ],
      },
    ],
  },
  {
    id: 'advanced-querying',
    name: 'Advanced Querying Techniques',
    description: 'Relational algebra, multi-table joins, correlated subqueries, and set union operations.',
    iconName: 'Cpu',
    totalExercises: 77,
    subtracks: [
      {
        id: 'joins',
        name: 'SQL JOINS',
        count: 29,
        slug: 'sql-joins',
        difficulty: 'Intermediate',
        description: 'INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN, SELF JOIN, and CROSS JOIN.',
        tags: ['INNER JOIN', 'LEFT JOIN', 'SELF JOIN', 'Cross Product'],
        sampleQuestions: [
          {
            title: 'Salesperson Self-Join in Common City',
            description: 'Find all pairs of salespeople who work in the same city using a self-join.',
            sampleSql: 'SELECT a.name AS salesman_1, b.name AS salesman_2, a.city\nFROM salesman a\nJOIN salesman b ON a.city = b.city AND a.salesman_id < b.salesman_id;',
          },
        ],
      },
      {
        id: 'subqueries',
        name: 'SQL SUBQUERIES',
        count: 39,
        slug: 'sql-subqueries',
        difficulty: 'Advanced',
        description: 'Scalar subqueries, multi-row IN / ANY / ALL subqueries, and correlated subqueries with EXISTS.',
        tags: ['Correlated Subquery', 'EXISTS', 'IN Subquery', 'Nested SELECT'],
        sampleQuestions: [
          {
            title: 'Employees Earning Above Department Average',
            description: 'Find employees whose salary exceeds the average salary of their specific department.',
            sampleSql: 'SELECT e.first_name, e.last_name, e.salary, e.department_id\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(salary)\n  FROM employees\n  WHERE department_id = e.department_id\n);',
          },
        ],
      },
      {
        id: 'union',
        name: 'SQL Union Operations',
        count: 9,
        slug: 'sql-union',
        difficulty: 'Intermediate',
        description: 'Combining disparate result sets using UNION and UNION ALL, respecting column type alignment.',
        tags: ['UNION', 'UNION ALL', 'Set Operations'],
        sampleQuestions: [
          {
            title: 'Unified City Directory from Salesmen & Customers',
            description: 'Combine unique cities across salesmen and customers into a single alphabetical directory.',
            sampleSql: 'SELECT city, "Salesman" AS entity_type FROM salesman\nUNION\nSELECT city, "Customer" AS entity_type FROM customer\nORDER BY city ASC;',
          },
        ],
      },
    ],
  },
  {
    id: 'hr-database',
    name: 'HR Database-Specific Exercises',
    description: 'Enterprise HR operations: 7 interrelated tables modeling employees, departments, job history, and geography.',
    iconName: 'Users',
    totalExercises: 120,
    subtracks: [
      {
        id: 'hr-filtering',
        name: 'Filtering and Sorting on HR Database',
        count: 38,
        slug: 'hr-database-exercises/filtering-and-sorting',
        difficulty: 'Intermediate',
        description: 'Advanced filtering on hire dates, manager hierarchies, salary ranges, and commission percentages.',
        tags: ['Employees', 'Hierarchies', 'Dates', 'ORDER BY'],
        sampleQuestions: [
          {
            title: 'Employees Hired in Specific Calendar Window',
            description: 'Find employees who joined the enterprise between 2002 and 2005 earning over 8000.',
            sampleSql: 'SELECT employee_id, first_name, last_name, hire_date, salary\nFROM employees\nWHERE hire_date BETWEEN "2002-01-01" AND "2005-12-31" AND salary > 8000;',
          },
        ],
      },
      {
        id: 'hr-joins',
        name: 'SQL JOINS on HR Database',
        count: 27,
        slug: 'hr-database-exercises/joins-hr-database',
        difficulty: 'Advanced',
        description: 'Multi-table queries linking employees, departments, jobs, locations, and countries.',
        tags: ['Enterprise Joins', 'Locations', 'Managers'],
        sampleQuestions: [
          {
            title: 'Employee Location & Country Mapping',
            description: 'List employee name, department name, city, and country for all employees in Europe.',
            sampleSql: 'SELECT e.first_name, e.last_name, d.department_name, l.city, c.country_name\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id\nJOIN locations l ON d.location_id = l.location_id\nJOIN countries c ON l.country_id = c.country_id\nJOIN regions r ON c.region_id = r.region_id\nWHERE r.region_name = "Europe";',
          },
        ],
      },
      {
        id: 'hr-subqueries',
        name: 'SQL SUBQUERIES on HR Database',
        count: 55,
        slug: 'hr-database-exercises/subqueries-hr-database',
        difficulty: 'Advanced',
        description: 'Manager hierarchy lookups, department max comparisons, and job history validation.',
        tags: ['HR Subqueries', 'Hierarchy', 'Correlated'],
        sampleQuestions: [
          {
            title: 'Identify All Managing Personnel',
            description: 'Find all employees who currently manage at least one other staff member.',
            sampleSql: 'SELECT employee_id, first_name, last_name, salary\nFROM employees\nWHERE employee_id IN (SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL);',
          },
        ],
      },
    ],
  },
  {
    id: 'movie-database',
    name: 'Movie Database Exercises',
    description: 'Relational cinematic dataset: movies, directors, actors, genres, reviewers, and ratings.',
    iconName: 'Film',
    totalExercises: 50,
    subtracks: [
      {
        id: 'movie-basic',
        name: 'BASIC Queries on Movie Database',
        count: 10,
        slug: 'movie-database/basic',
        difficulty: 'Beginner',
        description: 'Selecting film durations, release dates, actor genders, and reviewer details.',
        tags: ['Movies', 'Actors', 'SELECT'],
        sampleQuestions: [
          {
            title: 'Movies Released in 1999',
            description: 'Find title and duration in minutes of all films released in 1999.',
            sampleSql: 'SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999 ORDER BY mov_time DESC;',
          },
        ],
      },
      {
        id: 'movie-subqueries',
        name: 'SUBQUERIES on Movie Database',
        count: 16,
        slug: 'movie-database/subqueries',
        difficulty: 'Intermediate',
        description: 'Actors in specific films, directors of highest-rated movies, and unreviewed films.',
        tags: ['Subquery', 'Ratings', 'Casting'],
        sampleQuestions: [
          {
            title: 'Actors in Woody Allen Movies',
            description: 'Find the names of all actors who performed in movies directed by Woody Allen.',
            sampleSql: 'SELECT a.act_fname, a.act_lname\nFROM actor a\nWHERE a.act_id IN (\n  SELECT mc.act_id FROM movie_cast mc\n  JOIN movie_direction md ON mc.mov_id = md.mov_id\n  JOIN director d ON md.dir_id = d.dir_id\n  WHERE d.dir_fname = "Woody" AND d.dir_lname = "Allen"\n);',
          },
        ],
      },
      {
        id: 'movie-joins',
        name: 'JOINS on Movie Database',
        count: 24,
        slug: 'movie-database/joins',
        difficulty: 'Advanced',
        description: 'Casting credits, genre classifications, review star averages, and director portfolios.',
        tags: ['Multi-table Joins', 'Reviews', 'Averages'],
        sampleQuestions: [
          {
            title: 'Average Review Rating per Movie Genre',
            description: 'Find the average review stars given to movies classified under each genre.',
            sampleSql: 'SELECT g.gen_title, ROUND(AVG(r.rev_stars), 2) AS avg_rating\nFROM genres g\nJOIN movie_genres mg ON g.gen_id = mg.gen_id\nJOIN rating r ON mg.mov_id = r.mov_id\nGROUP BY g.gen_title\nORDER BY avg_rating DESC;',
          },
        ],
      },
    ],
  },
  {
    id: 'dba-and-performance',
    name: 'Database Administration, Security & Tuning',
    description: 'Enterprise DBA operations, indexing strategies, transactions, error handling, and recovery.',
    iconName: 'ShieldCheck',
    totalExercises: 886,
    subtracks: [
      {
        id: 'stored-procedures',
        name: 'Stored Procedures and Functions',
        count: 75,
        slug: 'stored-procedures-and-functions',
        difficulty: 'Advanced',
        description: 'Parameter modes (IN, OUT, INOUT), scalar functions, table-valued routines, and triggers.',
        tags: ['PROCEDURE', 'FUNCTION', 'TRIGGER'],
        sampleQuestions: [
          {
            title: 'Automated Commission Calculator Function',
            description: 'Create a stored routine calculating total bonus based on sales tiers.',
            sampleSql: 'CREATE FUNCTION calc_sales_bonus(p_amount DECIMAL, p_rate DECIMAL)\nRETURNS DECIMAL\nBEGIN\n  RETURN p_amount * p_rate * 1.05;\nEND;',
          },
        ],
      },
      {
        id: 'error-handling',
        name: 'Error Handling and Debugging',
        count: 100,
        slug: 'error-handling-and-debugging',
        difficulty: 'Advanced',
        description: 'TRY...CATCH blocks, SQLSTATE codes, exception handlers, and transaction rollback recovery.',
        tags: ['TRY CATCH', 'SQLSTATE', 'ROLLBACK'],
        sampleQuestions: [
          {
            title: 'Graceful Constraint Violation Recovery',
            description: 'Handle duplicate key errors using transaction rollback and custom logging.',
            sampleSql: 'BEGIN TRANSACTION;\n-- Handled operational block with SAVEPOINT\nSAVEPOINT sp1;\n-- Execution logic with rollback to sp1 on error\nCOMMIT;',
          },
        ],
      },
      {
        id: 'performance',
        name: 'Performance Tuning and Optimization',
        count: 100,
        slug: 'performance-tuning-and-optimization',
        difficulty: 'Advanced',
        description: 'EXPLAIN QUERY PLAN, B-Tree indexes, composite indexes, covering indexes, and query refactoring.',
        tags: ['EXPLAIN', 'INDEXING', 'Query Tuning'],
        sampleQuestions: [
          {
            title: 'Covering Composite Index Creation',
            description: 'Optimize high-traffic customer lookups by eliminating table scans with a composite index.',
            sampleSql: 'CREATE INDEX idx_orders_customer_date_amt\nON orders (customer_id, ord_date, purch_amt);',
          },
        ],
      },
      {
        id: 'transactions',
        name: 'SQL Transactions and Concurrency Control',
        count: 70,
        slug: 'transactions-concurrency-control',
        difficulty: 'Advanced',
        description: 'ACID principles, isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE), and deadlocks.',
        tags: ['ACID', 'COMMIT', 'ISOLATION LEVEL'],
        sampleQuestions: [
          {
            title: 'Atomic Fund Transfer Script',
            description: 'Execute an atomic debit-and-credit financial transfer with failure rollback.',
            sampleSql: 'BEGIN TRANSACTION;\nUPDATE account SET balance = balance - 500 WHERE acc_id = 101;\nUPDATE account SET balance = balance + 500 WHERE acc_id = 202;\nCOMMIT;',
          },
        ],
      },
      {
        id: 'security',
        name: 'Security and Access Control',
        count: 100,
        slug: 'security-and-access-control',
        difficulty: 'Advanced',
        description: 'Role-based access control (RBAC), GRANT / REVOKE privileges, column-level security, and audit logging.',
        tags: ['GRANT', 'REVOKE', 'RBAC', 'Audit'],
        sampleQuestions: [
          {
            title: 'Read-Only Role Granting',
            description: 'Grant SELECT privilege on orders and customers to junior analyst role.',
            sampleSql: 'GRANT SELECT ON customer, orders TO role_analyst;',
          },
        ],
      },
      {
        id: 'user-management',
        name: 'SQL User Account Management',
        count: 16,
        slug: 'user-account-management',
        difficulty: 'Intermediate',
        description: 'Creating database users, password expiration policies, and session resource quotas.',
        tags: ['CREATE USER', 'ALTER USER', 'Quotas'],
        sampleQuestions: [
          {
            title: 'Create Analyst Account with Password Policy',
            description: 'Create user with required TLS connection and password expiration.',
            sampleSql: 'CREATE USER "analyst_john" IDENTIFIED BY "Str0ng#P@ss" PASSWORD EXPIRE INTERVAL 90 DAY;',
          },
        ],
      },
      {
        id: 'backup-recovery',
        name: 'Database Backup and Recovery',
        count: 100,
        slug: 'database-backup-and-recovery',
        difficulty: 'Advanced',
        description: 'Full, differential, and transaction log backups, point-in-time recovery, and write-ahead logs.',
        tags: ['BACKUP', 'RESTORE', 'Point-in-Time Recovery'],
        sampleQuestions: [
          {
            title: 'Point-in-Time Database Recovery Command',
            description: 'Restore database state up to the moment preceding an accidental table truncation.',
            sampleSql: 'RESTORE DATABASE enterprise_db\nFROM DISK = "/backups/full_db.bak"\nWITH NORECOVERY, STOPAT = "2024-03-15 14:32:00";',
          },
        ],
      },
      {
        id: 'temporal',
        name: 'Temporal Tables and Versioning',
        count: 100,
        slug: 'temporal-tables-and-versioning',
        difficulty: 'Advanced',
        description: 'System-versioned temporal tables, AS OF queries, and audit tracking across historical timelines.',
        tags: ['SYSTEM_TIME', 'Temporal Tables', 'Audit Trails'],
        sampleQuestions: [
          {
            title: 'Historical Price As-Of Lookup',
            description: 'Retrieve product prices as they existed on January 1st, 2023 using FOR SYSTEM_TIME AS OF.',
            sampleSql: 'SELECT pro_id, pro_name, pro_price\nFROM item_mast FOR SYSTEM_TIME AS OF "2023-01-01 00:00:00";',
          },
        ],
      },
      {
        id: 'cross-platform',
        name: 'Cross-Platform SQL',
        count: 100,
        slug: 'cross-platform-sql',
        difficulty: 'Advanced',
        description: 'Dialect differences across SQLite, PostgreSQL, MySQL, SQL Server, and Oracle.',
        tags: ['Portability', 'PostgreSQL', 'MySQL', 'SQLite'],
        sampleQuestions: [
          {
            title: 'Portable String Concatenation & Date Parsing',
            description: 'Write portable SQL adapting standard string concatenation (|| vs CONCAT) and date formats.',
            sampleSql: 'SELECT COALESCE(cust_name, "Anonymous") || " (" || city || ")" AS formatted_client FROM customer;',
          },
        ],
      },
      {
        id: 'advanced-features',
        name: 'Advanced SQL Features',
        count: 125,
        slug: 'advanced-sql-features',
        difficulty: 'Advanced',
        description: 'Window functions (ROW_NUMBER, DENSE_RANK, NTILE), CTEs (WITH RECURSIVE), and JSON manipulation.',
        tags: ['WINDOW FUNCTIONS', 'RECURSIVE CTE', 'JSON'],
        sampleQuestions: [
          {
            title: 'Recursive Employee Organizational Hierarchy',
            description: 'Generate organizational chain of command using a recursive Common Table Expression (CTE).',
            sampleSql: 'WITH RECURSIVE org_hierarchy AS (\n  SELECT employee_id, first_name, manager_id, 1 AS level\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.employee_id, e.first_name, e.manager_id, h.level + 1\n  FROM employees e\n  JOIN org_hierarchy h ON e.manager_id = h.employee_id\n)\nSELECT * FROM org_hierarchy ORDER BY level, manager_id;',
          },
        ],
      },
    ],
  },
];
