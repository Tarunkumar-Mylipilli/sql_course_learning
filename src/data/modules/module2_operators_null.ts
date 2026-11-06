import { Topic } from '../../types';
import { USER_RECOMMENDED_MASTERCLASSES } from './masterclasses';

export const OPERATORS_NULL_MODULES: Topic[] = [
  {
    id: 'topic-2-where-operators',
    order: 2,
    slug: 'where-operators',
    title: '2. Filtering with WHERE & Operators (=, >, <, AND, OR, NOT, LIKE, IN, BETWEEN)',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Foundations',
    overview: 'Learn precise row filtering using arithmetic comparisons, boolean logic, wildcards (%, _), value sets with IN, and inclusive intervals with BETWEEN.',
    video: {
      title: 'SQL WHERE Statement & Comparison Operators Tutorial',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '11:15',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'Row-level filtering with the WHERE clause',
        'Comparison operators: =, !=, <>, >, <, >=, <=',
        'Combining conditions with AND, OR, NOT',
        'Wildcards: % (any characters) and _ (single character)',
        'Checking ranges with BETWEEN and sets with IN',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL WHERE Clause & Logical Conditions Explained',
        embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
        duration: '8:40',
        channel: 'Programming with Mosh',
        language: 'English',
        summaryPoints: [
          'Detailed explanation of filtering with WHERE and operators',
          'Combining comparison operators and Boolean logic',
        ],
      },
    ],
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Precision Filtering with WHERE & Operators',
      summary: 'The WHERE clause extracts only rows that satisfy a specified criterion. Operators allow comparisons, range checks, pattern matches, and boolean combinations.',
      syntax: `SELECT name, population, rating
FROM city
WHERE rating > 3 AND (country_id IN (1, 4, 7) OR name LIKE 'P%');`,
      explanation: [
        'Comparison Operators: = (equal), != or <> (not equal), > (greater), < (less), >= (greater or equal), <= (less or equal).',
        'Logical Operators: AND (both must be true), OR (either can be true), NOT (inverts truth value).',
        'Text Operators: LIKE \'P%\' matches anything starting with P; LIKE \'_ublin\' matches Dublin, Lublin (exactly one character prefix).',
        'Range & Set Operators: BETWEEN x AND y is inclusive of boundaries (marks BETWEEN 40 AND 90). IN (v1, v2, v3) matches any listed value.',
        'AND binds tighter than OR. Always wrap OR conditions in parentheses when mixed with AND!',
      ],
      keyRules: [
        'Single quotes (\'...\') are mandatory for text and date values; never use quotes for numeric values.',
        'Wildcard % matches zero or more characters; wildcard _ matches exactly one character.',
        'WHERE marks BETWEEN 40 AND 90 is equivalent to marks >= 40 AND marks <= 90.',
      ],
      commonMistakes: [
        'Writing WHERE dept = \'Tech\' OR dept = \'Design\' AND status = \'Active\' without parentheses (AND will bind with Design only!).',
        'Using double quotes for string values instead of single quotes.',
      ],
      exampleQuery: `SELECT name, population
FROM city
WHERE population BETWEEN 500000 AND 5000000 AND name LIKE 'B%';`,
      exampleExplanation: 'Returns cities with population between 500K and 5M whose name starts with B.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q2-1',
          question: 'What does the wildcard expression "LIKE \'_ublin\'" match?',
          options: [
            'Any word ending with ublin of any length',
            'Words starting with exactly one character followed by "ublin" (e.g. Dublin, Lublin)',
            'Only words that contain an underscore',
            'All cities in Ireland',
          ],
          correctIndex: 1,
          explanation: 'The underscore (_) matches exactly one single character.',
        },
        {
          id: 'q2-2',
          question: 'What is the boolean result of: TRUE OR FALSE AND FALSE?',
          options: [
            'FALSE (because FALSE AND FALSE is evaluated first, then TRUE OR FALSE = TRUE? Wait!)',
            'TRUE (AND has higher precedence: (FALSE AND FALSE) = FALSE, then TRUE OR FALSE = TRUE)',
            'Syntax Error',
            'NULL',
          ],
          correctIndex: 1,
          explanation: 'AND takes precedence over OR. So TRUE OR (FALSE AND FALSE) evaluates to TRUE OR FALSE = TRUE.',
        },
        {
          id: 'q2-3',
          question: 'Is BETWEEN 10 AND 20 inclusive of the number 10 and 20?',
          options: [
            'Yes, both 10 and 20 are included',
            'No, only numbers from 11 to 19',
            'Only 10 is included',
            'Only 20 is included',
          ],
          correctIndex: 0,
          explanation: 'BETWEEN is always inclusive on both sides in SQL (>= 10 AND <= 20).',
        },
      ],
    },
    challenge: {
      id: 'c2-where-op-1',
      title: 'Practice: Big Countries Filter (LeetCode 595)',
      difficulty: 'Easy',
      source: 'LeetCode',
      sourceId: 'LeetCode 595',
      instructions: 'A country is big if it has an area of at least 3,000,000 sq km OR a population of at least 25,000,000. Report the `name`, `population`, and `area` of the big countries.',
      schemaSql: `
CREATE TABLE world (name VARCHAR(50) PRIMARY KEY, continent VARCHAR(50), area INT, population INT, gdp BIGINT);
INSERT INTO world VALUES 
('Afghanistan', 'Asia', 652230, 25500100, 20343000),
('Albania', 'Europe', 28748, 2831741, 12960000),
('Algeria', 'Africa', 2381741, 37100000, 188681000),
('Andorra', 'Europe', 468, 78115, 3712000);`,
      tables: [
        {
          name: 'world',
          columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'area', type: 'INT' }, { name: 'population', type: 'INT' }],
          sampleData: [{ name: 'Afghanistan', area: 652230, population: 25500100 }, { name: 'Algeria', area: 2381741, population: 37100000 }],
        },
      ],
      starterSql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
      solutionSql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
      expectedColumns: ['name', 'population', 'area'],
      hints: ['Use WHERE area >= 3000000 OR population >= 25000000'],
    },
    challenges: [
      {
        id: 'c2-where-op-1',
        title: 'Practice 1: Big Countries Filter (LeetCode 595)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 595',
        instructions: 'Report `name`, `population`, and `area` of countries where `area >= 3000000` OR `population >= 25000000`.',
        schemaSql: `
CREATE TABLE world (name VARCHAR(50) PRIMARY KEY, area INT, population INT);
INSERT INTO world VALUES ('Afghanistan', 652230, 25500100), ('Albania', 28748, 2831741), ('Algeria', 2381741, 37100000);`,
        tables: [{ name: 'world', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'area', type: 'INT' }, { name: 'population', type: 'INT' }], sampleData: [{ name: 'Algeria', area: 2381741, population: 37100000 }] }],
        starterSql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
        solutionSql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
        expectedColumns: ['name', 'population', 'area'],
        hints: ['WHERE area >= 3000000 OR population >= 25000000'],
      },
      {
        id: 'c2-where-op-2',
        title: 'Practice 2: City Population & Range (LearnSQL CheatSheet)',
        difficulty: 'Easy',
        source: 'Standard',
        instructions: 'From the `city` table, fetch `name` and `population` of cities that have a `rating > 3` AND whose `country_id IN (1, 2)`.',
        schemaSql: `
CREATE TABLE city (id INT PRIMARY KEY, name VARCHAR(50), country_id INT, population INT, rating INT);
INSERT INTO city VALUES 
(1, 'Paris', 1, 2243000, 5),
(2, 'Berlin', 2, 3460000, 3),
(3, 'Marseille', 1, 850000, 4),
(4, 'Hamburg', 2, 1780000, 4);`,
        tables: [{ name: 'city', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'population', type: 'INT' }], sampleData: [{ name: 'Paris', population: 2243000 }] }],
        starterSql: `SELECT name, population FROM city WHERE rating > 3 AND country_id IN (1, 2);`,
        solutionSql: `SELECT name, population FROM city WHERE rating > 3 AND country_id IN (1, 2);`,
        expectedColumns: ['name', 'population'],
        hints: ['WHERE rating > 3 AND country_id IN (1, 2)'],
      },
    ],
  },
  {
    id: 'topic-3-null-handling',
    order: 3,
    slug: 'null-handling',
    title: '3. NULL Handling & The Three-Valued Logic (IS NULL, COALESCE & The NOT IN Trap)',
    level: 'Beginner',
    estimatedMinutes: 20,
    badge: 'Foundations',
    overview: 'Master how SQL handles missing data with Three-Valued Logic (TRUE, FALSE, UNKNOWN), IS NULL vs = NULL, COALESCE default fallbacks, and the notorious NOT IN NULL trap.',
    video: {
      title: 'SQL NULL Values, IS NULL & COALESCE Explained',
      embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
      duration: '10:00',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'What NULL represents: missing, unknown, or not applicable',
        'Why = NULL always returns UNKNOWN / False',
        'Testing with IS NULL and IS NOT NULL',
        'Replacing missing values with COALESCE(col, fallback)',
        'The NOT IN with NULL subquery danger',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL NULL Values & Three-Valued Logic in 7 Minutes',
        embedUrl: 'https://www.youtube.com/embed/A9TOuDZTPDU',
        duration: '7:20',
        channel: 'Database Star',
        language: 'English',
        summaryPoints: ['Clear explanation of NULL values and why they are tricky in interviews'],
      },
    ],
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Mastering NULL: Three-Valued Logic',
      summary: 'In SQL, NULL is not a value; it is a marker for missing or unknown data. Standard arithmetic or equality tests against NULL yield UNKNOWN.',
      syntax: `SELECT name, COALESCE(bonus, 0) AS safe_bonus
FROM employees
WHERE manager_id IS NULL OR bonus IS NOT NULL;`,
      explanation: [
        'Three-Valued Logic: SQL booleans can be TRUE, FALSE, or UNKNOWN. If a WHERE condition evaluates to UNKNOWN, that row is NOT returned.',
        'Equality check: `col = NULL` evaluates to UNKNOWN, never TRUE! Always use `col IS NULL` or `col IS NOT NULL`.',
        '`COALESCE(val1, val2, ...)` returns the very first non-NULL argument. Perfect for defaults like `COALESCE(phone, \'N/A\')`.',
        'The NOT IN (NULL) Trap: If any row in a subquery contains NULL, `WHERE id NOT IN (SELECT ...)` will return ZERO rows for the entire query! Always filter `WHERE id IS NOT NULL` inside the subquery.',
      ],
      keyRules: [
        'NULL is never equal to anything — not even another NULL.',
        'Aggregate functions (except COUNT(*)) completely ignore NULL rows.',
        'In LeetCode problems (e.g. Find Customer Referee), always write: `referee_id != 2 OR referee_id IS NULL`.',
      ],
      commonMistakes: [
        'Writing `WHERE email = NULL` (will silently return 0 rows).',
        'Assuming `referee_id != 2` includes people who have no referee (NULL is filtered out!).',
        'Using NOT IN with a subquery that might return a NULL value.',
      ],
      exampleQuery: `SELECT customer_name, COALESCE(discount, 0) AS applied_discount
FROM customers
WHERE referral_id IS NULL;`,
      exampleExplanation: 'Returns customers with no referral_id and replaces NULL discounts with 0.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q3-null-1',
          question: 'What is the evaluation result of the expression: "NULL = NULL" in SQL?',
          options: ['TRUE', 'UNKNOWN', 'FALSE', 'Syntax Error'],
          correctIndex: 1,
          explanation: 'In SQL, two unknown states cannot be proven equal. Hence NULL = NULL yields UNKNOWN.',
        },
        {
          id: 'q3-null-2',
          question: 'What does COALESCE(NULL, NULL, 50, 100) return?',
          options: ['NULL', '0', '50', '100'],
          correctIndex: 2,
          explanation: 'COALESCE returns the first non-NULL expression from left to right (50).',
        },
        {
          id: 'q3-null-3',
          question: 'Why does "WHERE id NOT IN (1, 2, NULL)" return zero rows for any row?',
          options: [
            'Because NOT IN checks "id != 1 AND id != 2 AND id != NULL", and anything != NULL is UNKNOWN, turning the whole AND expression UNKNOWN',
            'Because NULL causes a fatal database crash',
            'Because IN only accepts numbers',
            'It is not zero rows, it returns all rows',
          ],
          correctIndex: 0,
          explanation: 'NOT IN expands to AND conditions. id != NULL is UNKNOWN, which kills the entire condition and returns no rows.',
        },
      ],
    },
    challenge: {
      id: 'c3-null-1',
      title: 'Practice: Find Customer Referee (LeetCode 584)',
      difficulty: 'Easy',
      source: 'LeetCode',
      sourceId: 'LeetCode 584',
      instructions: 'Find the names of customers that are NOT referred by customer with `id = 2`. Note: Customers with NULL `referee_id` MUST be returned!',
      schemaSql: `
CREATE TABLE customer (id INT PRIMARY KEY, name VARCHAR(25), referee_id INT);
INSERT INTO customer VALUES 
(1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2),
(4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);`,
      tables: [
        {
          name: 'customer',
          columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'name', type: 'VARCHAR(25)' }, { name: 'referee_id', type: 'INT' }],
          sampleData: [{ id: 1, name: 'Will', referee_id: null }, { id: 3, name: 'Alex', referee_id: 2 }],
        },
      ],
      starterSql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
      solutionSql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
      expectedColumns: ['name'],
      hints: ['Remember: referee_id != 2 drops NULLs! Write: referee_id != 2 OR referee_id IS NULL'],
    },
    challenges: [
      {
        id: 'c3-null-1',
        title: 'Practice 1: Find Customer Referee (LeetCode 584)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 584',
        instructions: 'Find the names of customers who are NOT referred by customer `2`. Include NULLs.',
        schemaSql: `
CREATE TABLE customer (id INT PRIMARY KEY, name VARCHAR(25), referee_id INT);
INSERT INTO customer VALUES (1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2), (4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);`,
        tables: [{ name: 'customer', columns: [{ name: 'name', type: 'VARCHAR(25)' }, { name: 'referee_id', type: 'INT' }], sampleData: [{ name: 'Will', referee_id: null }] }],
        starterSql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
        solutionSql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
        expectedColumns: ['name'],
        hints: ['WHERE referee_id != 2 OR referee_id IS NULL'],
      },
      {
        id: 'c3-null-2',
        title: 'Practice 2: Missing Email Inspection (NewtonSchool Guide)',
        difficulty: 'Easy',
        source: 'Standard',
        instructions: 'Find the `name` and display `COALESCE(email, "No Email Provided") AS contact_email` for all clients where `email IS NULL`.',
        schemaSql: `
CREATE TABLE clients (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(50));
INSERT INTO clients VALUES (1, 'Rohith', 'rohith@gmail.com'), (2, 'Surya', NULL), (3, 'Siva', NULL);`,
        tables: [{ name: 'clients', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'email', type: 'VARCHAR(50)' }], sampleData: [{ name: 'Surya', email: null }] }],
        starterSql: `SELECT name, COALESCE(email, 'No Email Provided') AS contact_email FROM clients WHERE email IS NULL;`,
        solutionSql: `SELECT name, COALESCE(email, 'No Email Provided') AS contact_email FROM clients WHERE email IS NULL;`,
        expectedColumns: ['name', 'contact_email'],
        hints: ['SELECT name, COALESCE(email, \'No Email Provided\') AS contact_email FROM clients WHERE email IS NULL;'],
      },
    ],
  },
];
