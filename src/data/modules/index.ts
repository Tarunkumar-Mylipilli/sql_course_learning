import { Topic } from '../../types';
import { FOUNDATIONS_MODULES } from './module1_foundations';
import { OPERATORS_NULL_MODULES } from './module2_operators_null';
import { FUNCTIONS_MODULES } from './module3_functions';
import { AGGREGATION_MODULES } from './module2_aggregation';
import { JOINS_DEEP_MODULES } from './module6_joins_deep';
import { ADVANCED_MODULES } from './module3_advanced';
import { VIEWS_INDEXES_MODULES } from './module9_views_indexes';
import { INTERVIEW_50_QUESTIONS } from './interview50';

// Combine all chunk files in pedagogical order matching the user's syllabus:
// 1. SELECT
// 2. WHERE & Operators
// 3. NULL Handling
// 4. ORDER BY & LIMIT / OFFSET
// 5. String Functions
// 6. Date Functions
// 7. Aggregate Functions & GROUP BY & HAVING
// 8. INNER JOIN & Outer Joins (LEFT / RIGHT)
// 9. SELF JOIN
// 10. Subqueries
// 11. CTEs
// 12. Window Functions
// 13. CASE WHEN
// 14. Views & Indexes Basics

export const ALL_SQL_MODULES: Topic[] = [
  // 1. SELECT
  { ...FOUNDATIONS_MODULES[0], order: 1 },
  // 2. WHERE & Operators
  { ...OPERATORS_NULL_MODULES[0], order: 2 },
  // 3. NULL Handling
  { ...OPERATORS_NULL_MODULES[1], order: 3 },
  // 4. ORDER BY & LIMIT / OFFSET
  { ...FOUNDATIONS_MODULES[2], order: 4 },
  // 5. String Functions
  { ...FUNCTIONS_MODULES[0], order: 5 },
  // 6. Date Functions
  { ...FUNCTIONS_MODULES[1], order: 6 },
  // 7. Aggregate Functions & GROUP BY & HAVING
  { ...AGGREGATION_MODULES[0], order: 7 },
  // 8. INNER JOIN & LEFT / RIGHT JOIN
  { ...AGGREGATION_MODULES[1], order: 8 },
  // 9. SELF JOIN
  { ...JOINS_DEEP_MODULES[0], order: 9 },
  // 10. Subqueries & CTEs
  { ...ADVANCED_MODULES[0], order: 10 },
  // 11. Window Functions (Ranking, LAG, Running Sums)
  { ...ADVANCED_MODULES[1], order: 11 },
  // 12. CASE WHEN & Conditional Logic
  { ...ADVANCED_MODULES[2], order: 12 },
  // 13. Views & Indexes Basics
  { ...VIEWS_INDEXES_MODULES[0], order: 13 },
];

export {
  FOUNDATIONS_MODULES,
  OPERATORS_NULL_MODULES,
  FUNCTIONS_MODULES,
  AGGREGATION_MODULES,
  JOINS_DEEP_MODULES,
  ADVANCED_MODULES,
  VIEWS_INDEXES_MODULES,
  INTERVIEW_50_QUESTIONS,
};
