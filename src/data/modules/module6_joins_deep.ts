import { Topic } from '../../types';
import { USER_RECOMMENDED_MASTERCLASSES } from './masterclasses';

export const JOINS_DEEP_MODULES: Topic[] = [
  {
    id: 'topic-9-self-join',
    order: 9,
    slug: 'self-join-hierarchies',
    title: '9. SELF JOIN & Hierarchical Data (Managers, Friendships & Comparisons)',
    level: 'Intermediate',
    estimatedMinutes: 25,
    badge: 'Core SQL',
    overview: 'Learn how to join a table with itself to evaluate manager-employee relationships, symmetric friendships, and compare successive events.',
    video: {
      title: 'SQL Self Join Explained with Real Interview Examples',
      embedUrl: 'https://www.youtube.com/embed/ccm6_kiYo2M',
      duration: '12:30',
      channel: 'Alex The Analyst',
      language: 'English',
      summaryPoints: [
        'What is a Self Join: joining a table to itself',
        'Assigning distinct table aliases (e.g. emp and mgr)',
        'Connecting foreign keys to primary keys within the same table',
        'Finding employees who earn more than their managers',
      ],
    },
    alternativeVideos: [
      {
        title: 'SQL Self Join in 8 Minutes',
        embedUrl: 'https://www.youtube.com/embed/ccm6_kiYo2M',
        duration: '8:15',
        channel: 'Programming with Mosh',
        language: 'English',
        summaryPoints: ['Explanation of self-joins and employee-manager queries'],
      },
    ],
    addonVideos: USER_RECOMMENDED_MASTERCLASSES,
    theory: {
      title: 'Demystifying the SELF JOIN',
      summary: 'A SELF JOIN is a regular join in which a table is joined with itself. It is indispensable for hierarchical structures (e.g., employee-to-manager) and pairwise comparisons.',
      syntax: `SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;`,
      explanation: [
        'A self-join treats the single physical table as if it were two separate tables with distinct aliases.',
        'Alias 1 (`e`): represents the employee row.',
        'Alias 2 (`m`): represents the manager row.',
        'Common Interview Scenario: Finding managers with N direct reports: `JOIN employees m ON e.manager_id = m.id GROUP BY m.id HAVING COUNT(*) >= N`.',
      ],
      keyRules: [
        'You MUST provide distinct table aliases for both instances of the table.',
        'Use LEFT JOIN if you wish to retain the top boss who has `manager_id IS NULL`.',
      ],
      commonMistakes: [
        'Using the table name without aliases (raises duplicate table name in FROM error).',
      ],
      exampleQuery: `SELECT e.name AS employee_name, m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`,
      exampleExplanation: 'Returns all employees and their managers, including the CEO whose manager is NULL.',
    },
    quiz: {
      passingScorePercent: 75,
      questions: [
        {
          id: 'q-self-1',
          question: 'Why are table aliases strictly mandatory when performing a SELF JOIN?',
          options: [
            'To resolve ambiguous table references and allow the engine to distinguish between the two roles of the table',
            'To make the query run faster',
            'Because SQL does not allow table names with more than 5 letters',
            'Only for styling reasons',
          ],
          correctIndex: 0,
          explanation: 'Without distinct aliases, SQL cannot differentiate which instance of the table a column belongs to.',
        },
      ],
    },
    challenge: {
      id: 'c-self-1',
      title: 'Practice: Employees Earning More Than Their Managers (LeetCode 181)',
      difficulty: 'Easy',
      source: 'LeetCode',
      sourceId: 'LeetCode 181',
      instructions: 'Find the employees who earn more than their managers. Return the employee column aliased as `Employee`.',
      schemaSql: `
CREATE TABLE employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, managerId INT);
INSERT INTO employee VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);`,
      tables: [{ name: 'employee', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }, { name: 'managerId', type: 'INT' }], sampleData: [{ name: 'Joe', salary: 70000, managerId: 3 }] }],
      starterSql: '-- Write your SQL query here\n',
      solutionSql: `SELECT e.name AS Employee FROM employee e JOIN employee m ON e.managerId = m.id WHERE e.salary > m.salary;`,
      expectedColumns: ['Employee'],
      hints: ['JOIN employee m ON e.managerId = m.id WHERE e.salary > m.salary'],
    },
    challenges: [
      {
        id: 'c-self-1',
        title: 'Practice 1: Employees Earning More Than Their Managers (LeetCode 181)',
        difficulty: 'Easy',
        source: 'LeetCode',
        sourceId: 'LeetCode 181',
        instructions: 'Find employees who earn strictly more than their managers. Return `Employee`.',
        schemaSql: `CREATE TABLE employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, managerId INT); INSERT INTO employee VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);`,
        tables: [{ name: 'employee', columns: [{ name: 'name', type: 'VARCHAR(50)' }, { name: 'salary', type: 'INT' }], sampleData: [{ name: 'Joe', salary: 70000 }] }],
        starterSql: '-- Write your SQL query here\n',
        solutionSql: `SELECT e.name AS Employee FROM employee e JOIN employee m ON e.managerId = m.id WHERE e.salary > m.salary;`,
        expectedColumns: ['Employee'],
        hints: ['JOIN employee m ON e.managerId = m.id WHERE e.salary > m.salary'],
      },
    ],
  },
];
