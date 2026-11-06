import { CodingChallenge } from '../../types';

export const INTERVIEW_50_QUESTIONS: CodingChallenge[] = [
  {
    id: 'int-1',
    title: '1. Managers with at least 5 direct reports',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 570',
    instructions: 'Return the names of managers who have at least five direct reports. Two managers can share the same name.',
    schemaSql: `
CREATE TABLE employee (id INT PRIMARY KEY, name VARCHAR(50), department VARCHAR(50), manager_id INT);
INSERT INTO employee VALUES (101, 'John', 'A', NULL), (102, 'Dan', 'A', 101), (103, 'James', 'A', 101), (104, 'Amy', 'A', 101), (105, 'Anne', 'A', 101), (106, 'Ron', 'B', 101);`,
    tables: [
      {
        name: 'employee',
        columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'name', type: 'VARCHAR(50)' }, { name: 'manager_id', type: 'INT' }],
        sampleData: [{ id: 101, name: 'John', manager_id: null }, { id: 102, name: 'Dan', manager_id: 101 }],
      },
    ],
    starterSql: `SELECT m.name FROM employee e JOIN employee m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(*) >= 5;`,
    solutionSql: `SELECT m.name FROM employee e JOIN employee m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(*) >= 5;`,
    expectedColumns: ['name'],
    hints: ['Self-join: e.manager_id = m.id, GROUP BY m.id, m.name HAVING COUNT(*) >= 5'],
  },
  {
    id: 'int-2',
    title: '2. Customers who bought every product',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 1045',
    instructions: 'Return the customer_id of all customers who bought every product in the product table.',
    schemaSql: `
CREATE TABLE customer (customer_id INT, product_key INT);
CREATE TABLE product (product_key INT PRIMARY KEY);
INSERT INTO product VALUES (5), (6);
INSERT INTO customer VALUES (1, 5), (2, 6), (3, 5), (3, 6), (1, 6);`,
    tables: [
      {
        name: 'customer',
        columns: [{ name: 'customer_id', type: 'INT' }, { name: 'product_key', type: 'INT' }],
        sampleData: [{ customer_id: 1, product_key: 5 }, { customer_id: 1, product_key: 6 }],
      },
    ],
    starterSql: `SELECT customer_id FROM customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM product);`,
    solutionSql: `SELECT customer_id FROM customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM product);`,
    expectedColumns: ['customer_id'],
    hints: ['Relational Division: HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM product)'],
  },
  {
    id: 'int-4',
    title: '4. Label tree nodes (Root / Inner / Leaf)',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 608',
    instructions: 'Label every node: "Root" if it has no parent, "Inner" if it has a parent and at least one child, "Leaf" otherwise. Sort by id.',
    schemaSql: `
CREATE TABLE tree (id INT PRIMARY KEY, p_id INT);
INSERT INTO tree VALUES (1, NULL), (2, 1), (3, 1), (4, 2), (5, 2);`,
    tables: [
      {
        name: 'tree',
        columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'p_id', type: 'INT' }],
        sampleData: [{ id: 1, p_id: null }, { id: 2, p_id: 1 }],
      },
    ],
    starterSql: `SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM tree ORDER BY id;`,
    solutionSql: `SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM tree ORDER BY id;`,
    expectedColumns: ['id', 'type'],
    hints: ['CASE WHEN p_id IS NULL THEN \'Root\' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN \'Inner\' ELSE \'Leaf\' END'],
  },
  {
    id: 'int-9',
    title: '9. Monthly approved transactions by country',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 1193',
    instructions: 'For each month and country, report total transaction count, approved count, total amount, and approved amount.',
    schemaSql: `
CREATE TABLE transactions (id INT PRIMARY KEY, country VARCHAR(10), state VARCHAR(10), amount INT, trans_date DATE);
INSERT INTO transactions VALUES (121, 'US', 'approved', 1000, '2018-12-18'), (122, 'US', 'declined', 2000, '2018-12-19'), (123, 'US', 'approved', 2000, '2019-01-01');`,
    tables: [
      {
        name: 'transactions',
        columns: [{ name: 'id', type: 'INT' }, { name: 'country', type: 'VARCHAR(10)' }, { name: 'amount', type: 'INT' }],
        sampleData: [{ id: 121, country: 'US', amount: 1000 }],
      },
    ],
    starterSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount FROM transactions GROUP BY month, country;`,
    solutionSql: `SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount FROM transactions GROUP BY month, country;`,
    expectedColumns: ['month', 'country', 'trans_count', 'approved_count', 'trans_total_amount', 'approved_total_amount'],
    hints: ['Conditional aggregation with SUM(CASE WHEN state = \'approved\' ...)'],
  },
  {
    id: 'int-17',
    title: '17. Second highest distinct salary',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 176',
    instructions: 'Return the second highest distinct salary. If there is none, return NULL.',
    schemaSql: `
CREATE TABLE employee (id INT PRIMARY KEY, salary INT);
INSERT INTO employee VALUES (1, 100), (2, 200), (3, 300);`,
    tables: [
      {
        name: 'employee',
        columns: [{ name: 'id', type: 'INT' }, { name: 'salary', type: 'INT' }],
        sampleData: [{ id: 1, salary: 100 }, { id: 2, salary: 200 }],
      },
    ],
    starterSql: `SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest_salary;`,
    solutionSql: `SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest_salary;`,
    expectedColumns: ['second_highest_salary'],
    hints: ['Wrap LIMIT 1 OFFSET 1 in scalar subquery'],
  },
  {
    id: 'int-20',
    title: '20. Exchange seats (1↔2, 3↔4)',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 626',
    instructions: 'Swap the seat id of every two neighbours. If the number of students is odd, the last keeps their seat. Sort by id.',
    schemaSql: `
CREATE TABLE seat (id INT PRIMARY KEY, student VARCHAR(50));
INSERT INTO seat VALUES (1, 'Abbot'), (2, 'Doris'), (3, 'Emerson'), (4, 'Green'), (5, 'Jeames');`,
    tables: [
      {
        name: 'seat',
        columns: [{ name: 'id', type: 'INT' }, { name: 'student', type: 'VARCHAR(50)' }],
        sampleData: [{ id: 1, student: 'Abbot' }, { id: 2, student: 'Doris' }],
      },
    ],
    starterSql: `SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM seat ORDER BY id ASC;`,
    solutionSql: `SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM seat ORDER BY id ASC;`,
    expectedColumns: ['id', 'student'],
    hints: ['Check modulo: odd numbers increment (id + 1), even decrement (id - 1)'],
  },
  {
    id: 'int-26',
    title: '26. Rank scores without gaps (DENSE_RANK)',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 178',
    instructions: 'Rank scores from highest to lowest with no gaps (1, 1, 2, 3...). Output score and rank.',
    schemaSql: `
CREATE TABLE scores (id INT PRIMARY KEY, score DECIMAL(3,2));
INSERT INTO scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65);`,
    tables: [
      {
        name: 'scores',
        columns: [{ name: 'id', type: 'INT' }, { name: 'score', type: 'DECIMAL(3,2)' }],
        sampleData: [{ id: 3, score: 4.00 }, { id: 2, score: 3.65 }],
      },
    ],
    starterSql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank" FROM scores ORDER BY score DESC;`,
    solutionSql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS "rank" FROM scores ORDER BY score DESC;`,
    expectedColumns: ['score', 'rank'],
    hints: ['DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"'],
  },
  {
    id: 'int-29',
    title: '29. Last person to fit in the bus (Running SUM)',
    difficulty: 'Medium',
    source: 'LeetCode',
    sourceId: 'LeetCode 1204',
    instructions: 'The bus holds at most 1000 kg. Return the name of the last person who fits without exceeding 1000 kg.',
    schemaSql: `
CREATE TABLE queue (person_id INT PRIMARY KEY, person_name VARCHAR(50), weight INT, turn INT);
INSERT INTO queue VALUES (5, 'Alice', 250, 1), (4, 'Bob', 175, 2), (3, 'Alex', 350, 3), (6, 'John Cena', 400, 4), (1, 'Winston', 500, 5);`,
    tables: [
      {
        name: 'queue',
        columns: [{ name: 'person_name', type: 'VARCHAR(50)' }, { name: 'weight', type: 'INT' }, { name: 'turn', type: 'INT' }],
        sampleData: [{ person_name: 'Alice', weight: 250, turn: 1 }, { person_name: 'Bob', weight: 175, turn: 2 }],
      },
    ],
    starterSql: `WITH running AS (SELECT person_name, SUM(weight) OVER (ORDER BY turn) AS total_weight FROM queue) SELECT person_name FROM running WHERE total_weight <= 1000 ORDER BY total_weight DESC LIMIT 1;`,
    solutionSql: `WITH running AS (SELECT person_name, SUM(weight) OVER (ORDER BY turn) AS total_weight FROM queue) SELECT person_name FROM running WHERE total_weight <= 1000 ORDER BY total_weight DESC LIMIT 1;`,
    expectedColumns: ['person_name'],
    hints: ['Calculate SUM(weight) OVER (ORDER BY turn), then filter <= 1000 and LIMIT 1'],
  },
  {
    id: 'int-32',
    title: '32. User\'s third transaction (DataLemur / Uber)',
    difficulty: 'Medium',
    source: 'DataLemur',
    sourceId: 'DataLemur (Uber)',
    instructions: 'Return the third transaction of every user who has at least three transactions. Return user_id, spend, and transaction_date.',
    schemaSql: `
CREATE TABLE transactions (user_id INT, spend DECIMAL(10,2), transaction_date DATETIME);
INSERT INTO transactions VALUES 
(111, 100.50, '2022-01-08 12:00:00'),
(111, 55.00, '2022-01-10 12:00:00'),
(111, 89.60, '2022-01-15 12:00:00'),
(148, 8.50, '2022-02-06 12:00:00'),
(148, 10.00, '2022-02-08 12:00:00'),
(148, 30.00, '2022-02-12 12:00:00');`,
    tables: [
      {
        name: 'transactions',
        columns: [{ name: 'user_id', type: 'INT' }, { name: 'spend', type: 'DECIMAL(10,2)' }, { name: 'transaction_date', type: 'DATETIME' }],
        sampleData: [{ user_id: 111, spend: 89.60, transaction_date: '2022-01-15 12:00:00' }],
      },
    ],
    starterSql: `WITH ranked_tx AS (
  SELECT user_id, spend, transaction_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY transaction_date ASC) AS rn
  FROM transactions
)
SELECT user_id, spend, transaction_date
FROM ranked_tx
WHERE rn = 3;`,
    solutionSql: `WITH ranked_tx AS (SELECT user_id, spend, transaction_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY transaction_date ASC) AS rn FROM transactions) SELECT user_id, spend, transaction_date FROM ranked_tx WHERE rn = 3;`,
    expectedColumns: ['user_id', 'spend', 'transaction_date'],
    hints: ['ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY transaction_date ASC) AS rn, then filter WHERE rn = 3'],
  },
  {
    id: 'int-34',
    title: '34. AirPods bought right after an iPhone (DataLemur / Apple)',
    difficulty: 'Medium',
    source: 'DataLemur',
    sourceId: 'DataLemur (Apple)',
    instructions: 'Find users who bought an AirPods as the purchase immediately following an iPhone purchase. Return customer_id.',
    schemaSql: `
CREATE TABLE purchases (customer_id INT, product_name VARCHAR(50), transaction_id INT PRIMARY KEY);
INSERT INTO purchases VALUES 
(1, 'iPhone', 1), (1, 'AirPods', 2),
(2, 'iPhone', 3), (2, 'iPad', 4), (2, 'AirPods', 5),
(3, 'AirPods', 6);`,
    tables: [
      {
        name: 'purchases',
        columns: [{ name: 'customer_id', type: 'INT' }, { name: 'product_name', type: 'VARCHAR(50)' }, { name: 'transaction_id', type: 'INT' }],
        sampleData: [{ customer_id: 1, product_name: 'iPhone' }, { customer_id: 1, product_name: 'AirPods' }],
      },
    ],
    starterSql: `WITH lagged AS (
  SELECT customer_id, product_name,
         LAG(product_name) OVER (PARTITION BY customer_id ORDER BY transaction_id) AS prev_product
  FROM purchases
)
SELECT DISTINCT customer_id
FROM lagged
WHERE product_name = 'AirPods' AND prev_product = 'iPhone';`,
    solutionSql: `WITH lagged AS (SELECT customer_id, product_name, LAG(product_name) OVER (PARTITION BY customer_id ORDER BY transaction_id) AS prev_product FROM purchases) SELECT DISTINCT customer_id FROM lagged WHERE product_name = 'AirPods' AND prev_product = 'iPhone';`,
    expectedColumns: ['customer_id'],
    hints: ['Use LAG(product_name) OVER (PARTITION BY customer_id ORDER BY transaction_id) to inspect previous purchase.'],
  },
];
