import { CodingChallenge, QuizQuestion } from '../types';

export type ScenarioTheme =
  | 'E-Commerce'
  | 'Fintech'
  | 'Healthcare'
  | 'Streaming'
  | 'Food Delivery'
  | 'Airlines';

export const SCENARIO_THEMES: { id: ScenarioTheme; label: string; icon: string }[] = [
  { id: 'E-Commerce', label: 'E-Commerce Store', icon: '🛒' },
  { id: 'Fintech', label: 'Fintech & Banking', icon: '💰' },
  { id: 'Healthcare', label: 'Hospital & Healthcare', icon: '🏥' },
  { id: 'Streaming', label: 'Video Streaming (Netflix-style)', icon: '🎬' },
  { id: 'Food Delivery', label: 'Food Delivery (UberEats-style)', icon: '🚚' },
  { id: 'Airlines', label: 'Airlines & Flights', icon: '✈️' },
];

// Rich scenario templates across SQL topics
export function generateLocalExercise(topicId: string, theme: ScenarioTheme): CodingChallenge {
  const ts = Date.now().toString().slice(-4);

  switch (theme) {
    case 'E-Commerce':
      return {
        id: `ai-ecom-${topicId}-${ts}`,
        title: `🛒 E-Commerce Scenario: Customer Orders & Revenue Analysis`,
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'Amazon E-Commerce Case',
        instructions:
          'In an online retail store, write a query to analyze product orders. Retrieve the `product_name`, `category`, and the total revenue formatted as `total_revenue = unit_price * quantity`. Filter only products in the "Electronics" or "Appliances" category with total revenue exceeding 500, ordered by total revenue descending.',
        schemaSql: `
CREATE TABLE retail_orders (
  order_id INT PRIMARY KEY,
  customer_name VARCHAR(50),
  product_name VARCHAR(50),
  category VARCHAR(30),
  unit_price DECIMAL(10,2),
  quantity INT
);
INSERT INTO retail_orders VALUES
(101, 'Alex Miller', 'Wireless Headphones', 'Electronics', 150.00, 4),
(102, 'Sara Connor', 'Espresso Machine', 'Appliances', 300.00, 2),
(103, 'David Kim', 'Yoga Mat', 'Fitness', 35.00, 3),
(104, 'Elena Rostova', '4K Smart TV', 'Electronics', 600.00, 2),
(105, 'John Smith', 'Blender 500W', 'Appliances', 90.00, 3),
(106, 'Priya Patel', 'Mechanical Keyboard', 'Electronics', 120.00, 5);`,
        tables: [
          {
            name: 'retail_orders',
            columns: [
              { name: 'order_id', type: 'INT', isPk: true },
              { name: 'customer_name', type: 'VARCHAR(50)' },
              { name: 'product_name', type: 'VARCHAR(50)' },
              { name: 'category', type: 'VARCHAR(30)' },
              { name: 'unit_price', type: 'DECIMAL(10,2)' },
              { name: 'quantity', type: 'INT' },
            ],
            sampleData: [
              { order_id: 101, product_name: 'Wireless Headphones', category: 'Electronics', unit_price: 150, quantity: 4 },
              { order_id: 102, product_name: 'Espresso Machine', category: 'Appliances', unit_price: 300, quantity: 2 },
            ],
          },
        ],
        starterSql: `-- E-Commerce Scenario:
-- Calculate total_revenue = unit_price * quantity
-- Filter for Electronics or Appliances with revenue > 500
SELECT product_name, category, (unit_price * quantity) AS total_revenue
FROM retail_orders;`,
        solutionSql: `SELECT product_name, category, (unit_price * quantity) AS total_revenue FROM retail_orders WHERE category IN ('Electronics', 'Appliances') AND (unit_price * quantity) > 500 ORDER BY total_revenue DESC;`,
        expectedColumns: ['product_name', 'category', 'total_revenue'],
        hints: [
          'Calculate revenue using (unit_price * quantity) AS total_revenue.',
          'Use category IN (\'Electronics\', \'Appliances\') and AND condition for revenue.',
          'Remember to sort using ORDER BY total_revenue DESC.',
        ],
      };

    case 'Fintech':
      return {
        id: `ai-fintech-${topicId}-${ts}`,
        title: `💰 Fintech Scenario: High-Volume Fraud & Risk Detection`,
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'Stripe Risk Model',
        instructions:
          'A digital payment gateway flags transactions for compliance audits. Write a query to find all transactions where the `amount` is greater than 1000 AND the transaction status is NOT "cancelled", OR where the `risk_score` is 85 or higher. Display `transaction_id`, `account_holder`, `amount`, and `risk_score`, ordered by risk_score descending.',
        schemaSql: `
CREATE TABLE transactions (
  transaction_id VARCHAR(20) PRIMARY KEY,
  account_holder VARCHAR(50),
  amount DECIMAL(12,2),
  status VARCHAR(20),
  risk_score INT
);
INSERT INTO transactions VALUES
('TX-901', 'Alice Green', 2500.00, 'completed', 45),
('TX-902', 'Marcus Vance', 800.00, 'flagged', 92),
('TX-903', 'Chloe Dubois', 1500.00, 'cancelled', 88),
('TX-904', 'Kenji Sato', 3200.00, 'completed', 30),
('TX-905', 'Liam O\\\'Connor', 450.00, 'completed', 89),
('TX-906', 'Sofia Rossi', 5000.00, 'completed', 95);`,
        tables: [
          {
            name: 'transactions',
            columns: [
              { name: 'transaction_id', type: 'VARCHAR(20)', isPk: true },
              { name: 'account_holder', type: 'VARCHAR(50)' },
              { name: 'amount', type: 'DECIMAL(12,2)' },
              { name: 'status', type: 'VARCHAR(20)' },
              { name: 'risk_score', type: 'INT' },
            ],
            sampleData: [
              { transaction_id: 'TX-901', account_holder: 'Alice Green', amount: 2500, status: 'completed', risk_score: 45 },
              { transaction_id: 'TX-902', account_holder: 'Marcus Vance', amount: 800, status: 'flagged', risk_score: 92 },
            ],
          },
        ],
        starterSql: `-- Fintech Risk Scenario:
-- Retrieve transaction_id, account_holder, amount, risk_score
SELECT transaction_id, account_holder, amount, risk_score
FROM transactions;`,
        solutionSql: `SELECT transaction_id, account_holder, amount, risk_score FROM transactions WHERE (amount > 1000 AND status != 'cancelled') OR risk_score >= 85 ORDER BY risk_score DESC;`,
        expectedColumns: ['transaction_id', 'account_holder', 'amount', 'risk_score'],
        hints: [
          'Group the amount and status condition in parentheses: (amount > 1000 AND status != \'cancelled\').',
          'Use OR risk_score >= 85 for the high-risk condition.',
          'Sort by risk_score DESC.',
        ],
      };

    case 'Healthcare':
      return {
        id: `ai-health-${topicId}-${ts}`,
        title: `🏥 Healthcare Scenario: Hospital Inpatient & Triage Analytics`,
        difficulty: 'Easy',
        source: 'Standard',
        sourceId: 'Mayo Clinic Health Records',
        instructions:
          'A hospital administrative database needs to review patients currently admitted. Write a query to find all patients aged 50 or older who were admitted to the "Cardiology" or "Neurology" wards, or whose `insurance_provider` is NULL (uninsured assistance program). Output `patient_id`, `patient_name`, `age`, and `ward`, sorted by age descending.',
        schemaSql: `
CREATE TABLE patients (
  patient_id INT PRIMARY KEY,
  patient_name VARCHAR(50),
  age INT,
  ward VARCHAR(40),
  insurance_provider VARCHAR(50)
);
INSERT INTO patients VALUES
(501, 'Walter White', 52, 'Oncology', 'BlueCross'),
(502, 'Martha Stewart', 71, 'Cardiology', 'Medicare'),
(503, 'James Wilson', 45, 'Neurology', NULL),
(504, 'Betty Davis', 80, 'Neurology', 'Aetna'),
(505, 'Henry Ford', 64, 'Orthopedics', NULL),
(506, 'Claire Temple', 34, 'Cardiology', 'UnitedHealth');`,
        tables: [
          {
            name: 'patients',
            columns: [
              { name: 'patient_id', type: 'INT', isPk: true },
              { name: 'patient_name', type: 'VARCHAR(50)' },
              { name: 'age', type: 'INT' },
              { name: 'ward', type: 'VARCHAR(40)' },
              { name: 'insurance_provider', type: 'VARCHAR(50)' },
            ],
            sampleData: [
              { patient_id: 501, patient_name: 'Walter White', age: 52, ward: 'Oncology', insurance_provider: 'BlueCross' },
              { patient_id: 503, patient_name: 'James Wilson', age: 45, ward: 'Neurology', insurance_provider: null },
            ],
          },
        ],
        starterSql: `-- Healthcare Analytics Scenario:
SELECT patient_id, patient_name, age, ward
FROM patients;`,
        solutionSql: `SELECT patient_id, patient_name, age, ward FROM patients WHERE (age >= 50 AND ward IN ('Cardiology', 'Neurology')) OR insurance_provider IS NULL ORDER BY age DESC;`,
        expectedColumns: ['patient_id', 'patient_name', 'age', 'ward'],
        hints: [
          'Remember to check missing insurance with IS NULL.',
          'Combine age and ward: (age >= 50 AND ward IN (\'Cardiology\', \'Neurology\')).',
        ],
      };

    case 'Streaming':
      return {
        id: `ai-stream-${topicId}-${ts}`,
        title: `🎬 Streaming Scenario: Viewer Engagement & Binge Hours`,
        difficulty: 'Medium',
        source: 'FAANG',
        sourceId: 'Netflix Viewer Intelligence',
        instructions:
          'Netflix streaming logs record title metrics. Write a query to calculate the average watch time per viewer (`total_watch_hours / total_viewers`) formatted as `avg_hours_per_viewer`. Filter for titles released in 2022 or later with rating >= 8.0, and return `title`, `genre`, and `avg_hours_per_viewer` sorted highest to lowest.',
        schemaSql: `
CREATE TABLE stream_titles (
  title_id INT PRIMARY KEY,
  title VARCHAR(60),
  genre VARCHAR(30),
  release_year INT,
  rating DECIMAL(3,1),
  total_watch_hours INT,
  total_viewers INT
);
INSERT INTO stream_titles VALUES
(1, 'Stranger Visions', 'Sci-Fi', 2022, 8.7, 450000, 50000),
(2, 'The Queen Gambit', 'Drama', 2020, 8.6, 620000, 70000),
(3, 'Cyber Heist', 'Action', 2023, 7.8, 200000, 30000),
(4, 'Dark Horizon', 'Sci-Fi', 2024, 8.4, 360000, 40000),
(5, 'Chef Odyssey', 'Documentary', 2023, 8.1, 150000, 25000);`,
        tables: [
          {
            name: 'stream_titles',
            columns: [
              { name: 'title_id', type: 'INT', isPk: true },
              { name: 'title', type: 'VARCHAR(60)' },
              { name: 'genre', type: 'VARCHAR(30)' },
              { name: 'release_year', type: 'INT' },
              { name: 'rating', type: 'DECIMAL(3,1)' },
              { name: 'total_watch_hours', type: 'INT' },
              { name: 'total_viewers', type: 'INT' },
            ],
            sampleData: [
              { title_id: 1, title: 'Stranger Visions', genre: 'Sci-Fi', release_year: 2022, rating: 8.7 },
            ],
          },
        ],
        starterSql: `-- Streaming Scenario:
SELECT title, genre, (total_watch_hours / total_viewers) AS avg_hours_per_viewer
FROM stream_titles;`,
        solutionSql: `SELECT title, genre, (total_watch_hours / total_viewers) AS avg_hours_per_viewer FROM stream_titles WHERE release_year >= 2022 AND rating >= 8.0 ORDER BY avg_hours_per_viewer DESC;`,
        expectedColumns: ['title', 'genre', 'avg_hours_per_viewer'],
        hints: [
          'Calculate: (total_watch_hours / total_viewers) AS avg_hours_per_viewer',
          'Filter: WHERE release_year >= 2022 AND rating >= 8.0',
        ],
      };

    default: // Food Delivery
      return {
        id: `ai-food-${topicId}-${ts}`,
        title: `🚚 Food Delivery Scenario: Driver Tips & On-Time Performance`,
        difficulty: 'Easy',
        source: 'FAANG',
        sourceId: 'DoorDash Logistics Challenge',
        instructions:
          'A food delivery service monitors driver efficiency. Write a query to find all deliveries where the `delivery_time_mins` was under 30 minutes AND the `customer_tip` was greater than 5.00, OR where the delivery was marked `priority = 1`. Output `delivery_id`, `driver_name`, `delivery_time_mins`, and `customer_tip`, sorted by delivery_time_mins ascending.',
        schemaSql: `
CREATE TABLE food_deliveries (
  delivery_id INT PRIMARY KEY,
  driver_name VARCHAR(50),
  restaurant VARCHAR(50),
  delivery_time_mins INT,
  customer_tip DECIMAL(5,2),
  priority INT
);
INSERT INTO food_deliveries VALUES
(701, 'Carlos Mendez', 'Burger Barn', 22, 6.50, 0),
(702, 'Tanya Vance', 'Tokyo Ramen', 35, 8.00, 1),
(703, 'Aamir Khan', 'Spice Palace', 18, 2.00, 0),
(704, 'Jessica Alba', 'Pasta Mia', 28, 7.00, 0),
(705, 'David Ortiz', 'Taco Fiesta', 42, 10.00, 0);`,
        tables: [
          {
            name: 'food_deliveries',
            columns: [
              { name: 'delivery_id', type: 'INT', isPk: true },
              { name: 'driver_name', type: 'VARCHAR(50)' },
              { name: 'restaurant', type: 'VARCHAR(50)' },
              { name: 'delivery_time_mins', type: 'INT' },
              { name: 'customer_tip', type: 'DECIMAL(5,2)' },
              { name: 'priority', type: 'INT' },
            ],
            sampleData: [
              { delivery_id: 701, driver_name: 'Carlos Mendez', delivery_time_mins: 22, customer_tip: 6.5, priority: 0 },
            ],
          },
        ],
        starterSql: `-- Food Delivery Scenario:
SELECT delivery_id, driver_name, delivery_time_mins, customer_tip
FROM food_deliveries;`,
        solutionSql: `SELECT delivery_id, driver_name, delivery_time_mins, customer_tip FROM food_deliveries WHERE (delivery_time_mins < 30 AND customer_tip > 5.00) OR priority = 1 ORDER BY delivery_time_mins ASC;`,
        expectedColumns: ['delivery_id', 'driver_name', 'delivery_time_mins', 'customer_tip'],
        hints: [
          'Group (delivery_time_mins < 30 AND customer_tip > 5.00)',
          'Add OR priority = 1 and ORDER BY delivery_time_mins ASC.',
        ],
      };
  }
}

// Generate Fresh Quiz Questions
export function generateLocalQuizQuestions(topicId: string): QuizQuestion[] {
  const ts = Date.now().toString().slice(-3);
  return [
    {
      id: `ai-q1-${topicId}-${ts}`,
      question: 'In production SQL systems, why should you avoid using "SELECT *" in application queries?',
      options: [
        'Because SELECT * causes database crashes',
        'Because selecting unnecessary columns increases I/O bandwidth, breaks indexes, and harms performance',
        'Because SELECT * is deprecated in modern SQL-99 standards',
        'Because SELECT * automatically encrypts output columns',
      ],
      correctIndex: 1,
      explanation:
        'Selecting only explicit columns reduces network transmission, enables covering index lookups, and prevents schema changes from breaking downstream application code.',
    },
    {
      id: `ai-q2-${topicId}-${ts}`,
      question: 'Consider the expression: WHERE salary > 50000 OR department = \'Sales\' AND bonus > 2000. How does SQL evaluate this?',
      options: [
        'Strictly from left to right: (salary > 50000 OR department = \'Sales\') AND bonus > 2000',
        'AND has higher precedence than OR: salary > 50000 OR (department = \'Sales\' AND bonus > 2000)',
        'OR has higher precedence than AND: (salary > 50000 OR department = \'Sales\')',
        'It throws a syntax error because parentheses are mandatory in SQL',
      ],
      correctIndex: 1,
      explanation:
        'In SQL operator precedence, AND binds tighter than OR. Without parentheses, SQL groups the AND terms first.',
    },
    {
      id: `ai-q3-${topicId}-${ts}`,
      question: 'What happens when you evaluate: SELECT * FROM users WHERE referee_id != 2; if a row has referee_id = NULL?',
      options: [
        'The row is included because NULL is not equal to 2',
        'The row is excluded because NULL != 2 evaluates to UNKNOWN, which filters out the row',
        'The row causes a NULL-pointer exception in the database engine',
        'The database converts NULL to 0 and includes the row',
      ],
      correctIndex: 1,
      explanation:
        'Under SQL Three-Valued Logic, any equality or comparison against NULL evaluates to UNKNOWN. WHERE only accepts rows evaluating strictly to TRUE.',
    },
    {
      id: `ai-q4-${topicId}-${ts}`,
      question: 'Which of the following describes the correct execution order of SQL clauses inside the database engine?',
      options: [
        'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY',
        'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT',
        'WHERE -> FROM -> SELECT -> HAVING -> GROUP BY -> ORDER BY',
        'FROM -> SELECT -> WHERE -> ORDER BY -> GROUP BY',
      ],
      correctIndex: 1,
      explanation:
        'The database engine first identifies the source tables (FROM), filters rows (WHERE), groups them (GROUP BY), filters groups (HAVING), calculates projections (SELECT), sorts (ORDER BY), and finally limits (LIMIT).',
    },
    {
      id: `ai-q5-${topicId}-${ts}`,
      question: 'How do you check for a text pattern where the second character is "a" and the rest can be anything?',
      options: [
        'LIKE \'_a%\'',
        'LIKE \'%a_\'',
        'LIKE \'a*\'',
        'LIKE \'?a*\'',
      ],
      correctIndex: 0,
      explanation:
        'In SQL LIKE patterns, the underscore `_` represents exactly one single character, while `%` represents zero or more characters. Thus, `_a%` matches any string with \'a\' in the second position.',
    },
  ];
}
