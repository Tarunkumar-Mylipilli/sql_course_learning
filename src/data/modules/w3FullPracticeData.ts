// Authentic W3Resource SQL Exercises Suite
// Direct client-side SQLite practice covering all core tracks
import { PracticeQuestion } from './sqlPracticeData';

export const W3RESOURCE_ALL_QUESTIONS: PracticeQuestion[] = [
  {
    "id": "w3-ret-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Display All Salespeople",
    "description": "Write a SQL query that displays all columns and rows from the salesman table.",
    "hint": "Use SELECT * FROM salesman;",
    "starterSql": "SELECT * FROM salesman;",
    "solutionSql": "SELECT * FROM salesman;",
    "tags": [
      "SELECT",
      "salesman",
      "Retrieve Data"
    ]
  },
  {
    "id": "w3-ret-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Display Specific Columns: Name and Commission",
    "description": "Write a SQL query to display only the name and commission columns for all salesmen.",
    "hint": "Project name, commission FROM salesman;",
    "starterSql": "SELECT ... FROM salesman;",
    "solutionSql": "SELECT name, commission FROM salesman;",
    "tags": [
      "SELECT",
      "salesman",
      "Projections"
    ]
  },
  {
    "id": "w3-ret-03",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Distinct Salespeople in Orders",
    "description": "Write a SQL query to identify unique salesman_id values in the orders table without duplicates.",
    "hint": "Use SELECT DISTINCT salesman_id FROM orders;",
    "starterSql": "SELECT DISTINCT salesman_id FROM orders;",
    "solutionSql": "SELECT DISTINCT salesman_id FROM orders;",
    "tags": [
      "DISTINCT",
      "orders",
      "Retrieve Data"
    ]
  },
  {
    "id": "w3-ret-04",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Salespeople Located in Paris",
    "description": "Write a SQL query to find all salesmen who reside in 'Paris'. Return name and city.",
    "hint": "Use WHERE city = 'Paris';",
    "starterSql": "SELECT name, city FROM salesman WHERE city = 'Paris';",
    "solutionSql": "SELECT name, city FROM salesman WHERE city = 'Paris';",
    "tags": [
      "WHERE",
      "salesman",
      "Filtering"
    ]
  },
  {
    "id": "w3-ret-05",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Customers with Grade 200",
    "description": "Write a SQL query to find all customers who have a grade of 200. Return customer_id, cust_name, and grade.",
    "hint": "Use WHERE grade = 200 on the customer table.",
    "starterSql": "SELECT customer_id, cust_name, grade FROM customer WHERE grade = 200;",
    "solutionSql": "SELECT customer_id, cust_name, grade FROM customer WHERE grade = 200;",
    "tags": [
      "WHERE",
      "customer",
      "Grade"
    ]
  },
  {
    "id": "w3-ret-06",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Orders Placed on Specific Date",
    "description": "Write a SQL query to display ord_no, ord_date, and purch_amt for all orders placed on '2012-10-05'.",
    "hint": "Filter orders table WHERE ord_date = '2012-10-05';",
    "starterSql": "SELECT ord_no, ord_date, purch_amt FROM orders WHERE ord_date = '2012-10-05';",
    "solutionSql": "SELECT ord_no, ord_date, purch_amt FROM orders WHERE ord_date = '2012-10-05';",
    "tags": [
      "WHERE",
      "orders",
      "Dates"
    ]
  },
  {
    "id": "w3-ret-07",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Orders Handled by Salesman 5001",
    "description": "Write a SQL query to display ord_no, purch_amt, and ord_date for all orders processed by salesman_id 5001.",
    "hint": "Use WHERE salesman_id = 5001 on the orders table.",
    "starterSql": "SELECT ord_no, purch_amt, ord_date FROM orders WHERE salesman_id = 5001;",
    "solutionSql": "SELECT ord_no, purch_amt, ord_date FROM orders WHERE salesman_id = 5001;",
    "tags": [
      "WHERE",
      "orders",
      "Salesman"
    ]
  },
  {
    "id": "w3-ret-08",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Customers Without a Grade",
    "description": "Write a SQL query to find customers whose grade is NULL. Return customer_id and cust_name.",
    "hint": "Use WHERE grade IS NULL on the customer table.",
    "starterSql": "SELECT customer_id, cust_name FROM customer WHERE grade IS NULL;",
    "solutionSql": "SELECT customer_id, cust_name FROM customer WHERE grade IS NULL;",
    "tags": [
      "IS NULL",
      "customer",
      "Nulls"
    ]
  },
  {
    "id": "w3-ret-09",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Orders Ordered by Purchase Amount Descending",
    "description": "Write a SQL query to display all orders ordered by purch_amt in descending order.",
    "hint": "ORDER BY purch_amt DESC;",
    "starterSql": "SELECT * FROM orders ORDER BY purch_amt DESC;",
    "solutionSql": "SELECT * FROM orders ORDER BY purch_amt DESC;",
    "tags": [
      "ORDER BY",
      "orders",
      "Sorting"
    ]
  },
  {
    "id": "w3-ret-10",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Retrieve Data",
    "title": "Customer Names and Cities in New York",
    "description": "Write a SQL query to list all customers located in 'New York'. Return cust_name and city.",
    "hint": "Use WHERE city = 'New York';",
    "starterSql": "SELECT cust_name, city FROM customer WHERE city = 'New York';",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE city = 'New York';",
    "tags": [
      "WHERE",
      "customer",
      "New York"
    ]
  },
  {
    "id": "w3-bool-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Boolean Operators",
    "title": "Customers in New York with Grade > 100",
    "description": "Write a SQL query to display all customer information for customers in 'New York' with a grade strictly greater than 100.",
    "hint": "Use WHERE city = 'New York' AND grade > 100;",
    "starterSql": "SELECT * FROM customer WHERE city = 'New York' AND grade > 100;",
    "solutionSql": "SELECT * FROM customer WHERE city = 'New York' AND grade > 100;",
    "tags": [
      "AND",
      "customer",
      "Boolean Logic"
    ]
  },
  {
    "id": "w3-bool-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Boolean Operators",
    "title": "Customers in New York OR Grade > 100",
    "description": "Write a SQL query to find customers who reside in 'New York' OR have a grade strictly greater than 100.",
    "hint": "Use WHERE city = 'New York' OR grade > 100;",
    "starterSql": "SELECT * FROM customer WHERE city = 'New York' OR grade > 100;",
    "solutionSql": "SELECT * FROM customer WHERE city = 'New York' OR grade > 100;",
    "tags": [
      "OR",
      "customer",
      "Boolean Logic"
    ]
  },
  {
    "id": "w3-bool-03",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Boolean Operators",
    "title": "Salesmen with Commission Between 0.12 and 0.14",
    "description": "Write a SQL query to find all salesmen whose commission is between 0.12 and 0.14 inclusive. Return name, city, and commission.",
    "hint": "Use WHERE commission BETWEEN 0.12 AND 0.14;",
    "starterSql": "SELECT name, city, commission FROM salesman WHERE commission BETWEEN 0.12 AND 0.14;",
    "solutionSql": "SELECT name, city, commission FROM salesman WHERE commission BETWEEN 0.12 AND 0.14;",
    "tags": [
      "BETWEEN",
      "salesman",
      "Commission"
    ]
  },
  {
    "id": "w3-bool-04",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Boolean Operators",
    "title": "Customers Not in New York and Grade <= 100",
    "description": "Write a SQL query to find customers who are NOT located in 'New York' AND do NOT have a grade greater than 100.",
    "hint": "Use WHERE city != 'New York' AND (grade <= 100 OR grade IS NULL);",
    "starterSql": "SELECT * FROM customer WHERE city != 'New York' AND grade <= 100;",
    "solutionSql": "SELECT * FROM customer WHERE city != 'New York' AND grade <= 100;",
    "tags": [
      "NOT",
      "customer",
      "Filtering"
    ]
  },
  {
    "id": "w3-bool-05",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Boolean Operators",
    "title": "Orders Excluding Specific Dates and High Amounts",
    "description": "Write a SQL query to find all orders excluding those with ord_date = '2012-09-10' and purch_amt > 1000.",
    "hint": "Use WHERE NOT (ord_date = '2012-09-10' AND purch_amt > 1000);",
    "starterSql": "SELECT * FROM orders WHERE NOT (ord_date = '2012-09-10' AND purch_amt > 1000);",
    "solutionSql": "SELECT * FROM orders WHERE NOT (ord_date = '2012-09-10' AND purch_amt > 1000);",
    "tags": [
      "NOT",
      "orders",
      "Compound Filter"
    ]
  },
  {
    "id": "w3-wild-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Wildcards",
    "title": "Salespeople Whose Name Begins with 'N' or 'P'",
    "description": "Write a SQL query to find salesmen whose names start with the letter 'N' or 'P'. Return all columns.",
    "hint": "Use WHERE name LIKE 'N%' OR name LIKE 'P%';",
    "starterSql": "SELECT * FROM salesman WHERE name LIKE 'N%' OR name LIKE 'P%';",
    "solutionSql": "SELECT * FROM salesman WHERE name LIKE 'N%' OR name LIKE 'P%';",
    "tags": [
      "LIKE",
      "salesman",
      "Wildcards"
    ]
  },
  {
    "id": "w3-wild-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Wildcards",
    "title": "Customers Whose Name Ends with 'n'",
    "description": "Write a SQL query to find customers whose cust_name ends with 'n'. Return cust_name and city.",
    "hint": "Use WHERE cust_name LIKE '%n';",
    "starterSql": "SELECT cust_name, city FROM customer WHERE cust_name LIKE '%n';",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE cust_name LIKE '%n';",
    "tags": [
      "LIKE",
      "customer",
      "Pattern Matching"
    ]
  },
  {
    "id": "w3-wild-03",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Wildcards",
    "title": "Salesperson with 4th Character 'l'",
    "description": "Write a SQL query to find salesmen whose name starts with 'N' and has 'l' as the fourth character.",
    "hint": "Use underscore wildcards: name LIKE 'N__l%';",
    "starterSql": "SELECT * FROM salesman WHERE name LIKE 'N__l%';",
    "solutionSql": "SELECT * FROM salesman WHERE name LIKE 'N__l%';",
    "tags": [
      "LIKE",
      "salesman",
      "Underscore"
    ]
  },
  {
    "id": "w3-wild-04",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Wildcards",
    "title": "Customers in Paris or London",
    "description": "Write a SQL query to find customers whose city is in ('Paris', 'London'). Return cust_name and city.",
    "hint": "Use WHERE city IN ('Paris', 'London');",
    "starterSql": "SELECT cust_name, city FROM customer WHERE city IN ('Paris', 'London');",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE city IN ('Paris', 'London');",
    "tags": [
      "IN",
      "customer",
      "City"
    ]
  },
  {
    "id": "w3-wild-05",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Wildcards",
    "title": "Orders Between 500 and 4000 Excluding Specific Values",
    "description": "Write a SQL query to find orders with purch_amt between 500 and 4000, excluding purch_amt values 948.50 and 1983.43.",
    "hint": "Use purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);",
    "starterSql": "SELECT * FROM orders WHERE purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);",
    "solutionSql": "SELECT * FROM orders WHERE purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);",
    "tags": [
      "BETWEEN",
      "NOT IN",
      "orders"
    ]
  },
  {
    "id": "w3-agg-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Aggregates",
    "title": "Total Purchase Amount of All Orders",
    "description": "Write a SQL query to calculate the total sum of all order purchase amounts. Return total_purchase_amount.",
    "hint": "SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;",
    "starterSql": "SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;",
    "solutionSql": "SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;",
    "tags": [
      "SUM",
      "orders",
      "Aggregates"
    ]
  },
  {
    "id": "w3-agg-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Aggregates",
    "title": "Average Purchase Amount Across Orders",
    "description": "Write a SQL query to calculate the average purchase amount for all orders. Return avg_purchase_amount.",
    "hint": "SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;",
    "starterSql": "SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;",
    "solutionSql": "SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;",
    "tags": [
      "AVG",
      "orders",
      "Aggregates"
    ]
  },
  {
    "id": "w3-agg-03",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Aggregates",
    "title": "Count Unique Salespeople Who Have Orders",
    "description": "Write a SQL query to count the number of unique salesmen who have generated at least one order. Return count_salesmen.",
    "hint": "SELECT COUNT(DISTINCT salesman_id) AS count_salesmen FROM orders;",
    "starterSql": "SELECT COUNT(DISTINCT salesman_id) AS count_salesmen FROM orders;",
    "solutionSql": "SELECT COUNT(DISTINCT salesman_id) AS count_salesmen FROM orders;",
    "tags": [
      "COUNT",
      "DISTINCT",
      "orders"
    ]
  },
  {
    "id": "w3-agg-04",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Aggregates",
    "title": "Highest Purchase Amount Grouped by Customer",
    "description": "Write a SQL query to find the maximum purchase amount ordered by each customer. Return customer_id and max_purchase_amount.",
    "hint": "SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;",
    "starterSql": "SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;",
    "solutionSql": "SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;",
    "tags": [
      "GROUP BY",
      "MAX",
      "orders"
    ]
  },
  {
    "id": "w3-agg-05",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Aggregates",
    "title": "Highest Purchase Amount Per Date with Threshold",
    "description": "Write a SQL query to find the highest purchase amount on each order date where the highest purchase is strictly greater than 2000. Return ord_date and max_purch.",
    "hint": "GROUP BY ord_date HAVING MAX(purch_amt) > 2000;",
    "starterSql": "SELECT ord_date, MAX(purch_amt) AS max_purch FROM orders GROUP BY ord_date HAVING MAX(purch_amt) > 2000;",
    "solutionSql": "SELECT ord_date, MAX(purch_amt) AS max_purch FROM orders GROUP BY ord_date HAVING MAX(purch_amt) > 2000;",
    "tags": [
      "HAVING",
      "GROUP BY",
      "MAX",
      "orders"
    ]
  },
  {
    "id": "w3-agg-06",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Aggregates",
    "title": "Number of Customers in Each City",
    "description": "Write a SQL query to count how many customers are located in each city. Return city and customer_count, ordered by customer_count descending.",
    "hint": "GROUP BY city ORDER BY customer_count DESC;",
    "starterSql": "SELECT city, COUNT(customer_id) AS customer_count FROM customer GROUP BY city ORDER BY customer_count DESC;",
    "solutionSql": "SELECT city, COUNT(customer_id) AS customer_count FROM customer GROUP BY city ORDER BY customer_count DESC;",
    "tags": [
      "GROUP BY",
      "COUNT",
      "customer"
    ]
  },
  {
    "id": "w3-fmt-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Formatting",
    "title": "Calculate Commission Amount for Each Order",
    "description": "Write a SQL query to display ord_no, purch_amt, and the estimated salesman commission earned (calculated as purch_amt * 0.12) as commission_earned for all orders.",
    "hint": "SELECT ord_no, purch_amt, purch_amt * 0.12 AS commission_earned FROM orders;",
    "starterSql": "SELECT ord_no, purch_amt, purch_amt * 0.12 AS commission_earned FROM orders;",
    "solutionSql": "SELECT ord_no, purch_amt, purch_amt * 0.12 AS commission_earned FROM orders;",
    "tags": [
      "Calculated Columns",
      "Arithmetic",
      "orders"
    ]
  },
  {
    "id": "w3-fmt-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Formatting",
    "title": "Display Full Customer Description Sentence",
    "description": "Write a SQL query to display a sentence formatted as: 'Customer [cust_name] is located in [city]' with alias customer_summary.",
    "hint": "Use concatenation: 'Customer ' || cust_name || ' is located in ' || city AS customer_summary FROM customer;",
    "starterSql": "SELECT 'Customer ' || cust_name || ' is located in ' || city AS customer_summary FROM customer;",
    "solutionSql": "SELECT 'Customer ' || cust_name || ' is located in ' || city AS customer_summary FROM customer;",
    "tags": [
      "Concatenation",
      "Strings",
      "customer"
    ]
  },
  {
    "id": "w3-join-01",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Joins",
    "title": "Salesperson and Customer in Same City",
    "description": "Write a SQL query to find the salesperson name and customer name who reside in the exact same city. Return salesman_name (s.name), cust_name, and city.",
    "hint": "JOIN customer c ON s.city = c.city;",
    "starterSql": "SELECT s.name AS salesman_name, c.cust_name, c.city FROM salesman s JOIN customer c ON s.city = c.city;",
    "solutionSql": "SELECT s.name AS salesman_name, c.cust_name, c.city FROM salesman s JOIN customer c ON s.city = c.city;",
    "tags": [
      "JOIN",
      "salesman",
      "customer",
      "City Matching"
    ]
  },
  {
    "id": "w3-join-02",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Joins",
    "title": "Orders Between 500 and 2000 with Customer Details",
    "description": "Write a SQL query to display ord_no, purch_amt, cust_name, and customer city for all orders where purch_amt is between 500 and 2000.",
    "hint": "JOIN orders o WITH customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;",
    "starterSql": "SELECT o.ord_no, o.purch_amt, c.cust_name, c.city FROM orders o JOIN customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;",
    "solutionSql": "SELECT o.ord_no, o.purch_amt, c.cust_name, c.city FROM orders o JOIN customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;",
    "tags": [
      "JOIN",
      "orders",
      "customer",
      "BETWEEN"
    ]
  },
  {
    "id": "w3-join-03",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Joins",
    "title": "Customers Appointed to Salesman with Commission > 12%",
    "description": "Write a SQL query to find customers whose assigned salesman receives a commission strictly greater than 0.12. Return cust_name, customer city (c.city), salesman name (s.name), and commission.",
    "hint": "JOIN customer c WITH salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;",
    "starterSql": "SELECT c.cust_name, c.city, s.name AS salesman_name, s.commission FROM customer c JOIN salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;",
    "solutionSql": "SELECT c.cust_name, c.city, s.name AS salesman_name, s.commission FROM customer c JOIN salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;",
    "tags": [
      "JOIN",
      "salesman",
      "customer",
      "Commission"
    ]
  },
  {
    "id": "w3-join-04",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Joins",
    "title": "Orders with Customer Name and Salesman Name (3-Way Join)",
    "description": "Write a SQL query to display ord_no, cust_name, s.name AS salesman_name, and commission for all orders. Joining orders, customer, and salesman.",
    "hint": "JOIN orders o ON o.customer_id = c.customer_id AND o.salesman_id = s.salesman_id;",
    "starterSql": "SELECT o.ord_no, c.cust_name, s.name AS salesman_name, s.commission FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id;",
    "solutionSql": "SELECT o.ord_no, c.cust_name, s.name AS salesman_name, s.commission FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id;",
    "tags": [
      "3-way JOIN",
      "orders",
      "customer",
      "salesman"
    ]
  },
  {
    "id": "w3-join-05",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Joins",
    "title": "Customer and Salesman Living in Different Cities",
    "description": "Write a SQL query to display ord_no, cust_name, c.city AS customer_city, s.name AS salesman_name, and s.city AS salesman_city for all orders where the customer and their assigned salesman reside in different cities.",
    "hint": "WHERE c.city != s.city after joining orders, customer, and salesman.",
    "starterSql": "SELECT o.ord_no, c.cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id WHERE c.city != s.city;",
    "solutionSql": "SELECT o.ord_no, c.cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id WHERE c.city != s.city;",
    "tags": [
      "JOIN",
      "Inequality",
      "orders"
    ]
  },
  {
    "id": "w3-sub-01",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Subqueries",
    "title": "Orders Handled by Salesman 'Paul Adam'",
    "description": "Write a SQL query using a subquery to find all orders generated by salesman 'Paul Adam'. Return all columns of orders.",
    "hint": "WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');",
    "starterSql": "SELECT * FROM orders WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');",
    "solutionSql": "SELECT * FROM orders WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');",
    "tags": [
      "Subquery",
      "Scalar Subquery",
      "orders"
    ]
  },
  {
    "id": "w3-sub-02",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Subqueries",
    "title": "Orders Handled by London-Based Salespeople",
    "description": "Write a SQL query using a subquery with IN to find all orders processed by any salesman located in 'London'. Return all columns of orders.",
    "hint": "WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');",
    "starterSql": "SELECT * FROM orders WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');",
    "solutionSql": "SELECT * FROM orders WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');",
    "tags": [
      "Subquery",
      "IN",
      "orders"
    ]
  },
  {
    "id": "w3-sub-03",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Subqueries",
    "title": "Orders Above Daily Average of 2012-10-10",
    "description": "Write a SQL query using a subquery to find all orders whose purch_amt is greater than the average purchase amount for orders on '2012-10-10'. Return all columns of orders.",
    "hint": "WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');",
    "starterSql": "SELECT * FROM orders WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');",
    "solutionSql": "SELECT * FROM orders WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');",
    "tags": [
      "Subquery",
      "AVG",
      "Comparison"
    ]
  },
  {
    "id": "w3-sub-04",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Subqueries",
    "title": "Customers with Grade Higher Than Every New York Customer",
    "description": "Write a SQL query using a subquery to find all customers whose grade is strictly greater than the maximum grade among customers in 'New York'. Return all columns.",
    "hint": "WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');",
    "starterSql": "SELECT * FROM customer WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');",
    "solutionSql": "SELECT * FROM customer WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');",
    "tags": [
      "Subquery",
      "MAX",
      "customer"
    ]
  },
  {
    "id": "w3-sub-05",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Subqueries",
    "title": "Salesmen with Customers in Their Home City (EXISTS)",
    "description": "Write a SQL query using EXISTS to find salesmen who have at least one customer located in the same city as them. Return all columns of salesman.",
    "hint": "WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);",
    "starterSql": "SELECT * FROM salesman s WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);",
    "solutionSql": "SELECT * FROM salesman s WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);",
    "tags": [
      "Subquery",
      "EXISTS",
      "Correlated"
    ]
  },
  {
    "id": "w3-nobel-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Nobel Win",
    "title": "Nobel Prize Winners in 1970",
    "description": "Write a SQL query to display the year, subject, and winner name for all Nobel prizes awarded in 1970 from the nobel_win table.",
    "hint": "SELECT year, subject, winner FROM nobel_win WHERE year = 1970;",
    "starterSql": "SELECT year, subject, winner FROM nobel_win WHERE year = 1970;",
    "solutionSql": "SELECT year, subject, winner FROM nobel_win WHERE year = 1970;",
    "tags": [
      "nobel_win",
      "WHERE",
      "Nobel"
    ]
  },
  {
    "id": "w3-nobel-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Nobel Win",
    "title": "Literature Winner for 1971",
    "description": "Write a SQL query to find the Nobel Prize winner in 'Literature' for the year 1971. Return winner.",
    "hint": "WHERE year = 1971 AND subject = 'Literature';",
    "starterSql": "SELECT winner FROM nobel_win WHERE year = 1971 AND subject = 'Literature';",
    "solutionSql": "SELECT winner FROM nobel_win WHERE year = 1971 AND subject = 'Literature';",
    "tags": [
      "nobel_win",
      "AND",
      "Literature"
    ]
  },
  {
    "id": "w3-nobel-03",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Nobel Win",
    "title": "Award Details for Dennis Gabor",
    "description": "Write a SQL query to find the year and subject in which 'Dennis Gabor' won the Nobel Prize. Return year and subject.",
    "hint": "WHERE winner = 'Dennis Gabor';",
    "starterSql": "SELECT year, subject FROM nobel_win WHERE winner = 'Dennis Gabor';",
    "solutionSql": "SELECT year, subject FROM nobel_win WHERE winner = 'Dennis Gabor';",
    "tags": [
      "nobel_win",
      "WHERE",
      "Exact Match"
    ]
  },
  {
    "id": "w3-nobel-04",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Nobel Win",
    "title": "Physics Winners Between 1970 and 1987",
    "description": "Write a SQL query to find all Nobel Prize winners in 'Physics' between the years 1970 and 1987 inclusive. Return year, subject, and winner.",
    "hint": "WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;",
    "starterSql": "SELECT year, subject, winner FROM nobel_win WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;",
    "solutionSql": "SELECT year, subject, winner FROM nobel_win WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;",
    "tags": [
      "nobel_win",
      "BETWEEN",
      "Physics"
    ]
  },
  {
    "id": "w3-nobel-05",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Nobel Win",
    "title": "Count Nobel Winners by Subject",
    "description": "Write a SQL query to count how many Nobel prizes have been awarded in each subject. Return subject and count_winners, ordered by count_winners DESC.",
    "hint": "GROUP BY subject ORDER BY count_winners DESC;",
    "starterSql": "SELECT subject, COUNT(*) AS count_winners FROM nobel_win GROUP BY subject ORDER BY count_winners DESC;",
    "solutionSql": "SELECT subject, COUNT(*) AS count_winners FROM nobel_win GROUP BY subject ORDER BY count_winners DESC;",
    "tags": [
      "nobel_win",
      "GROUP BY",
      "COUNT"
    ]
  },
  {
    "id": "w3-inv-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Inventory & Mast",
    "title": "Average Item Price Per Company Code",
    "description": "Write a SQL query to calculate the average item price for each company code (pro_com) from item_mast. Return pro_com and avg_price rounded to 2 decimals.",
    "hint": "SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;",
    "starterSql": "SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;",
    "solutionSql": "SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;",
    "tags": [
      "item_mast",
      "GROUP BY",
      "AVG"
    ]
  },
  {
    "id": "w3-inv-02",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Inventory & Mast",
    "title": "Products with Company Names (JOIN)",
    "description": "Write a SQL query to display the item name (pro_name), price (pro_price), and company name (com_name) for all products by joining item_mast and company_mast.",
    "hint": "JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id;",
    "starterSql": "SELECT i.pro_name, i.pro_price, c.com_name FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id;",
    "solutionSql": "SELECT i.pro_name, i.pro_price, c.com_name FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id;",
    "tags": [
      "item_mast",
      "company_mast",
      "JOIN"
    ]
  },
  {
    "id": "w3-inv-03",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Inventory & Mast",
    "title": "Most Expensive Item in Each Company",
    "description": "Write a SQL query to find the maximum price of an item for each company name. Return com_name and max_price.",
    "hint": "JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;",
    "starterSql": "SELECT c.com_name, MAX(i.pro_price) AS max_price FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;",
    "solutionSql": "SELECT c.com_name, MAX(i.pro_price) AS max_price FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;",
    "tags": [
      "JOIN",
      "GROUP BY",
      "MAX",
      "item_mast"
    ]
  },
  {
    "id": "w3-emp-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Employee Directory",
    "title": "Employees in IT or HR Department",
    "description": "Write a SQL query to find employees whose department code (emp_dept) is 57 (IT) or 47 (HR) from emp_details. Return emp_idno, emp_fname, emp_lname, and emp_dept.",
    "hint": "WHERE emp_dept IN (57, 47);",
    "starterSql": "SELECT emp_idno, emp_fname, emp_lname, emp_dept FROM emp_details WHERE emp_dept IN (57, 47);",
    "solutionSql": "SELECT emp_idno, emp_fname, emp_lname, emp_dept FROM emp_details WHERE emp_dept IN (57, 47);",
    "tags": [
      "emp_details",
      "IN",
      "Departments"
    ]
  },
  {
    "id": "w3-emp-02",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Employee Directory",
    "title": "Employees with Department Name and Budget Allotment",
    "description": "Write a SQL query to display employee full name (emp_fname, emp_lname), department name (dpt_name), and department allotment (dpt_allotment) by joining emp_details and emp_department.",
    "hint": "JOIN emp_details e WITH emp_department d ON e.emp_dept = d.dpt_code;",
    "starterSql": "SELECT e.emp_fname, e.emp_lname, d.dpt_name, d.dpt_allotment FROM emp_details e JOIN emp_department d ON e.emp_dept = d.dpt_code;",
    "solutionSql": "SELECT e.emp_fname, e.emp_lname, d.dpt_name, d.dpt_allotment FROM emp_details e JOIN emp_department d ON e.emp_dept = d.dpt_code;",
    "tags": [
      "emp_details",
      "emp_department",
      "JOIN"
    ]
  },
  {
    "id": "w3-emp-03",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Employee Directory",
    "title": "Count Employees in Each Department",
    "description": "Write a SQL query to count the number of employees in each department. Return dpt_name and total_employees, ordered by total_employees descending.",
    "hint": "GROUP BY d.dpt_name ORDER BY total_employees DESC;",
    "starterSql": "SELECT d.dpt_name, COUNT(e.emp_idno) AS total_employees FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept GROUP BY d.dpt_name ORDER BY total_employees DESC;",
    "solutionSql": "SELECT d.dpt_name, COUNT(e.emp_idno) AS total_employees FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept GROUP BY d.dpt_name ORDER BY total_employees DESC;",
    "tags": [
      "emp_department",
      "GROUP BY",
      "COUNT"
    ]
  },
  {
    "id": "w3-emp-04",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Employee Directory",
    "title": "Departments with Allotment Exceeding 60000",
    "description": "Write a SQL query to find distinct department names (dpt_name) with a budget allotment exceeding 60000 that have active employees assigned.",
    "hint": "SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;",
    "starterSql": "SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;",
    "solutionSql": "SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;",
    "tags": [
      "emp_department",
      "DISTINCT",
      "JOIN",
      "Budget"
    ]
  },
  {
    "id": "w3-mov-01",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Movie Database",
    "title": "Movies Released in 1999",
    "description": "Write a SQL query to find the title (mov_title) and duration (mov_time) of all films released in 1999 from the movie table.",
    "hint": "SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999;",
    "starterSql": "SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999;",
    "solutionSql": "SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999;",
    "tags": [
      "movie",
      "WHERE",
      "Movie Database"
    ]
  },
  {
    "id": "w3-mov-02",
    "database": "w3resource",
    "difficulty": "easy",
    "category": "Movie Database",
    "title": "Movies Running Longer than 150 Minutes",
    "description": "Write a SQL query to find all films with a running time strictly greater than 150 minutes. Return mov_title, mov_year, and mov_time, ordered by mov_time descending.",
    "hint": "WHERE mov_time > 150 ORDER BY mov_time DESC;",
    "starterSql": "SELECT mov_title, mov_year, mov_time FROM movie WHERE mov_time > 150 ORDER BY mov_time DESC;",
    "solutionSql": "SELECT mov_title, mov_year, mov_time FROM movie WHERE mov_time > 150 ORDER BY mov_time DESC;",
    "tags": [
      "movie",
      "ORDER BY",
      "Duration"
    ]
  },
  {
    "id": "w3-mov-03",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Movie Database",
    "title": "Movies with Their Respective Directors (JOIN)",
    "description": "Write a SQL query to display each movie title (mov_title) along with the director's full name (dir_fname || ' ' || dir_lname AS director_name) by joining movie, movie_direction, and director.",
    "hint": "JOIN movie m ON md.mov_id = m.mov_id JOIN director d ON md.dir_id = d.dir_id;",
    "starterSql": "SELECT m.mov_title, (d.dir_fname || ' ' || d.dir_lname) AS director_name FROM movie m JOIN movie_direction md ON m.mov_id = md.mov_id JOIN director d ON md.dir_id = d.dir_id;",
    "solutionSql": "SELECT m.mov_title, (d.dir_fname || ' ' || d.dir_lname) AS director_name FROM movie m JOIN movie_direction md ON m.mov_id = md.mov_id JOIN director d ON md.dir_id = d.dir_id;",
    "tags": [
      "movie",
      "director",
      "JOIN"
    ]
  },
  {
    "id": "w3-mov-04",
    "database": "w3resource",
    "difficulty": "medium",
    "category": "Movie Database",
    "title": "Movies with Ratings and Reviewer Names",
    "description": "Write a SQL query to display mov_title, rev_name, and rev_stars for all rated movies by joining movie, rating, and reviewer.",
    "hint": "JOIN movie m ON r.mov_id = m.mov_id JOIN reviewer rev ON r.rev_id = rev.rev_id;",
    "starterSql": "SELECT m.mov_title, rev.rev_name, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id JOIN reviewer rev ON r.rev_id = rev.rev_id;",
    "solutionSql": "SELECT m.mov_title, rev.rev_name, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id JOIN reviewer rev ON r.rev_id = rev.rev_id;",
    "tags": [
      "movie",
      "rating",
      "reviewer",
      "JOIN"
    ]
  },
  {
    "id": "w3-mov-05",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Movie Database",
    "title": "Movies with Rating Above 8.0 Stars",
    "description": "Write a SQL query to find the titles of all movies that have received a review rating strictly greater than 8.0 stars. Return mov_title and rev_stars, ordered by rev_stars descending.",
    "hint": "JOIN movie m WITH rating r ON m.mov_id = r.mov_id WHERE r.rev_stars > 8.0 ORDER BY r.rev_stars DESC;",
    "starterSql": "SELECT m.mov_title, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id WHERE r.rev_stars > 8.0 ORDER BY r.rev_stars DESC;",
    "solutionSql": "SELECT m.mov_title, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id WHERE r.rev_stars > 8.0 ORDER BY r.rev_stars DESC;",
    "tags": [
      "movie",
      "rating",
      "High Ratings"
    ]
  },
  {
    "id": "w3-mov-06",
    "database": "w3resource",
    "difficulty": "hard",
    "category": "Movie Database",
    "title": "Movies Directed by Alfred Hitchcock (Subquery)",
    "description": "Write a SQL query using a subquery to find all movies directed by 'Alfred Hitchcock'. Return mov_title and mov_year.",
    "hint": "WHERE mov_id IN (SELECT mov_id FROM movie_direction md JOIN director d ON md.dir_id = d.dir_id WHERE d.dir_fname = 'Alfred' AND d.dir_lname = 'Hitchcock');",
    "starterSql": "SELECT mov_title, mov_year FROM movie WHERE mov_id IN (SELECT md.mov_id FROM movie_direction md JOIN director d ON md.dir_id = d.dir_id WHERE d.dir_fname = 'Alfred' AND d.dir_lname = 'Hitchcock');",
    "solutionSql": "SELECT mov_title, mov_year FROM movie WHERE mov_id IN (SELECT md.mov_id FROM movie_direction md JOIN director d ON md.dir_id = d.dir_id WHERE d.dir_fname = 'Alfred' AND d.dir_lname = 'Hitchcock');",
    "tags": [
      "movie",
      "Subquery",
      "Hitchcock"
    ]
  }
];
