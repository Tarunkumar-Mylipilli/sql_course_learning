// Unified FAANG + W3Resource Interview & Practice Questions
export interface PracticeProblem {
  id: string;
  company: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  schemaSql?: string;
  tables?: Array<{
    name: string;
    columns: Array<{ name: string; type: string; isPk?: boolean }>;
    sampleData?: Record<string, any>[];
  }>;
  starterSql: string;
  solutionSql: string;
  tags: string[];
  hints: string[];
}

export const UNIFIED_PRACTICE_QUESTIONS: PracticeProblem[] = [
  {
    "id": "dl-twitter-1",
    "company": "Twitter",
    "title": "Histogram of Tweets",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Assume you're given a table Twitter tweet data, write a query to obtain a histogram of tweets posted per user in 2022. Output the tweet count per user as the bucket and the number of Twitter users who fall into that bucket.\n\nIn other words, group the users by the number of tweets they posted in 2022 and count the number of users in each group.",
    "schemaSql": "DROP TABLE IF EXISTS tweets;\nCREATE TABLE tweets (\n  tweet_id INT PRIMARY KEY,\n  user_id INT NOT NULL,\n  msg TEXT NOT NULL,\n  tweet_date TIMESTAMP NOT NULL\n);\nINSERT INTO tweets VALUES\n(214252, 111, 'Am considering taking Tesla private at $420. Funding secured.', '2021-12-30 00:00:00'),\n(739252, 111, 'Despite the constant negative press covfefe', '2022-01-01 00:00:00'),\n(846402, 111, 'Following accounts that promote wellness', '2022-03-23 00:00:00'),\n(241425, 254, 'Hello world', '2022-04-06 00:00:00'),\n(137439, 148, 'Database systems are awesome', '2022-03-23 00:00:00');",
    "tables": [
      {
        "name": "tweets",
        "columns": [
          {
            "name": "tweet_id",
            "type": "integer",
            "isPk": true
          },
          {
            "name": "user_id",
            "type": "integer"
          },
          {
            "name": "msg",
            "type": "string"
          },
          {
            "name": "tweet_date",
            "type": "timestamp"
          }
        ],
        "sampleData": [
          {
            "tweet_id": 214252,
            "user_id": 111,
            "msg": "Am considering taking Tesla private...",
            "tweet_date": "2021-12-30"
          },
          {
            "tweet_id": 739252,
            "user_id": 111,
            "msg": "Despite the constant negative press...",
            "tweet_date": "2022-01-01"
          },
          {
            "tweet_id": 846402,
            "user_id": 111,
            "msg": "Following accounts that promote...",
            "tweet_date": "2022-03-23"
          },
          {
            "tweet_id": 241425,
            "user_id": 254,
            "msg": "Hello world",
            "tweet_date": "2022-04-06"
          },
          {
            "tweet_id": 137439,
            "user_id": 148,
            "msg": "Database systems are awesome",
            "tweet_date": "2022-03-23"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "WITH user_tweets AS (\n  SELECT user_id, COUNT(tweet_id) AS tweet_count\n  FROM tweets\n  WHERE tweet_date >= '2022-01-01' AND tweet_date <= '2022-12-31'\n  GROUP BY user_id\n)\nSELECT tweet_count AS tweet_bucket, COUNT(user_id) AS users_num\nFROM user_tweets\nGROUP BY tweet_count;",
    "tags": [
      "Aggregate Functions",
      "User Behavior Analysis",
      "GROUP BY"
    ],
    "hints": [
      "First aggregate tweet counts per user in a CTE filtering for 2022, then GROUP BY tweet_bucket."
    ]
  },
  {
    "id": "dl-linkedin-1",
    "company": "LinkedIn",
    "title": "Data Science Skills",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Given a table of candidates and their skills, you're tasked with finding the candidates best suited for an open Data Science job. Find candidates who possess all three required skills: Python, Tableau, and PostgreSQL. Sort by candidate_id ASC.",
    "schemaSql": "DROP TABLE IF EXISTS candidates;\nCREATE TABLE candidates (\n  candidate_id INT,\n  skill TEXT\n);\nINSERT INTO candidates VALUES\n(123, 'Python'),\n(123, 'Tableau'),\n(123, 'PostgreSQL'),\n(234, 'R'),\n(234, 'PowerBI'),\n(345, 'Python'),\n(345, 'Tableau'),\n(345, 'PostgreSQL');",
    "tables": [
      {
        "name": "candidates",
        "columns": [
          {
            "name": "candidate_id",
            "type": "integer"
          },
          {
            "name": "skill",
            "type": "string"
          }
        ],
        "sampleData": [
          {
            "candidate_id": 123,
            "skill": "Python"
          },
          {
            "candidate_id": 123,
            "skill": "Tableau"
          },
          {
            "candidate_id": 123,
            "skill": "PostgreSQL"
          },
          {
            "candidate_id": 234,
            "skill": "R"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT candidate_id\nFROM candidates\nWHERE skill IN ('Python', 'Tableau', 'PostgreSQL')\nGROUP BY candidate_id\nHAVING COUNT(DISTINCT skill) = 3\nORDER BY candidate_id ASC;",
    "tags": [
      "HAVING",
      "IN",
      "Grouping"
    ],
    "hints": [
      "Use WHERE skill IN ('Python', 'Tableau', 'PostgreSQL') and HAVING COUNT(DISTINCT skill) = 3."
    ]
  },
  {
    "id": "dl-facebook-1",
    "company": "Facebook",
    "title": "Page With No Likes",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Write a query to return the IDs of the Facebook pages that have zero likes. The output should be sorted in ascending order of the page IDs.",
    "schemaSql": "DROP TABLE IF EXISTS page_likes;\nDROP TABLE IF EXISTS pages;\nCREATE TABLE pages (\n  page_id INT PRIMARY KEY,\n  page_name TEXT\n);\nCREATE TABLE page_likes (\n  user_id INT,\n  page_id INT,\n  liked_date TIMESTAMP\n);\nINSERT INTO pages VALUES (20701, 'Shop & Save'), (32721, 'Target'), (33147, 'Best Buy');\nINSERT INTO page_likes VALUES (111, 20701, '2022-04-08 00:00:00'), (121, 20701, '2022-04-09 00:00:00');",
    "tables": [
      {
        "name": "pages",
        "columns": [
          {
            "name": "page_id",
            "type": "integer",
            "isPk": true
          },
          {
            "name": "page_name",
            "type": "string"
          }
        ],
        "sampleData": [
          {
            "page_id": 20701,
            "page_name": "Shop & Save"
          },
          {
            "page_id": 32721,
            "page_name": "Target"
          },
          {
            "page_id": 33147,
            "page_name": "Best Buy"
          }
        ]
      },
      {
        "name": "page_likes",
        "columns": [
          {
            "name": "user_id",
            "type": "integer"
          },
          {
            "name": "page_id",
            "type": "integer"
          },
          {
            "name": "liked_date",
            "type": "timestamp"
          }
        ],
        "sampleData": [
          {
            "user_id": 111,
            "page_id": 20701,
            "liked_date": "2022-04-08"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT p.page_id\nFROM pages p\nLEFT JOIN page_likes pl ON p.page_id = pl.page_id\nWHERE pl.page_id IS NULL\nORDER BY p.page_id ASC;",
    "tags": [
      "LEFT JOIN",
      "Null Handling",
      "Set Operations"
    ],
    "hints": [
      "Perform a LEFT JOIN between pages and page_likes and filter WHERE pl.page_id IS NULL."
    ]
  },
  {
    "id": "dl-tesla-1",
    "company": "Tesla",
    "title": "Unfinished Parts",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Tesla is investigating bottlenecks in production and needs your help to extract the list of parts that are currently in production and haven't finished the assembly process (finish_date is NULL).",
    "schemaSql": "DROP TABLE IF EXISTS parts_assembly;\nCREATE TABLE parts_assembly (\n  part INT,\n  finish_date TIMESTAMP,\n  assembly_step INT\n);\nINSERT INTO parts_assembly VALUES\n(101, '2022-01-22 00:00:00', 1),\n(101, '2022-01-23 00:00:00', 2),\n(102, '2022-01-22 00:00:00', 1),\n(102, NULL, 2);",
    "tables": [
      {
        "name": "parts_assembly",
        "columns": [
          {
            "name": "part",
            "type": "integer"
          },
          {
            "name": "finish_date",
            "type": "timestamp"
          },
          {
            "name": "assembly_step",
            "type": "integer"
          }
        ],
        "sampleData": [
          {
            "part": 101,
            "finish_date": "2022-01-22",
            "assembly_step": 1
          },
          {
            "part": 102,
            "finish_date": null,
            "assembly_step": 2
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT part, assembly_step\nFROM parts_assembly\nWHERE finish_date IS NULL;",
    "tags": [
      "Null Handling",
      "Filtering"
    ],
    "hints": [
      "Check for finish_date IS NULL in the WHERE clause."
    ]
  },
  {
    "id": "dl-nytimes-1",
    "company": "NY Times",
    "title": "Laptop vs. Mobile Viewership",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Assume you're given the table on user viewership categorised by device type. Write a query to calculate the total viewership for laptops (device_type = 'laptop') and mobile devices ('tablet' or 'phone'). Return laptop_views and mobile_views.",
    "schemaSql": "DROP TABLE IF EXISTS viewership;\nCREATE TABLE viewership (\n  user_id INT,\n  device_type TEXT,\n  view_time TIMESTAMP\n);\nINSERT INTO viewership VALUES\n(123, 'laptop', '2022-06-12 12:00:00'),\n(125, 'tablet', '2022-06-12 12:00:00'),\n(128, 'phone', '2022-06-12 12:00:00'),\n(130, 'laptop', '2022-06-12 12:00:00');",
    "tables": [
      {
        "name": "viewership",
        "columns": [
          {
            "name": "user_id",
            "type": "integer"
          },
          {
            "name": "device_type",
            "type": "string"
          },
          {
            "name": "view_time",
            "type": "timestamp"
          }
        ],
        "sampleData": [
          {
            "user_id": 123,
            "device_type": "laptop",
            "view_time": "2022-06-12 12:00:00"
          },
          {
            "user_id": 125,
            "device_type": "tablet",
            "view_time": "2022-06-12 12:00:00"
          },
          {
            "user_id": 128,
            "device_type": "phone",
            "view_time": "2022-06-12 12:00:00"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT\n  SUM(CASE WHEN device_type = 'laptop' THEN 1 ELSE 0 END) AS laptop_views,\n  SUM(CASE WHEN device_type IN ('tablet', 'phone') THEN 1 ELSE 0 END) AS mobile_views\nFROM viewership;",
    "tags": [
      "Conditional Aggregation",
      "CASE WHEN",
      "Aggregate Functions"
    ],
    "hints": [
      "Use conditional aggregation with SUM(CASE WHEN ...)."
    ]
  },
  {
    "id": "dl-microsoft-1",
    "company": "Microsoft",
    "title": "Teams Power Users",
    "category": "SQL",
    "difficulty": "Easy",
    "description": "Write a query to identify the top 2 power users who sent the most messages on Microsoft Teams in August 2022. Display sender_id and number of messages (message_count) ordered by message_count DESC.",
    "schemaSql": "DROP TABLE IF EXISTS messages;\nCREATE TABLE messages (\n  message_id INT PRIMARY KEY,\n  sender_id INT,\n  receiver_id INT,\n  content TEXT,\n  sent_date TIMESTAMP\n);\nINSERT INTO messages VALUES\n(901, 3601, 4500, 'You up?', '2022-08-03 00:00:00'),\n(902, 3601, 4500, 'Hey', '2022-08-04 00:00:00'),\n(903, 2520, 1200, 'Reports ready', '2022-08-05 00:00:00'),\n(904, 2520, 1200, 'Sent', '2022-08-06 00:00:00'),\n(905, 2520, 1200, 'Confirmed', '2022-08-07 00:00:00');",
    "tables": [
      {
        "name": "messages",
        "columns": [
          {
            "name": "message_id",
            "type": "integer",
            "isPk": true
          },
          {
            "name": "sender_id",
            "type": "integer"
          },
          {
            "name": "receiver_id",
            "type": "integer"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "sent_date",
            "type": "timestamp"
          }
        ],
        "sampleData": [
          {
            "message_id": 901,
            "sender_id": 3601,
            "content": "You up?",
            "sent_date": "2022-08-03"
          },
          {
            "message_id": 903,
            "sender_id": 2520,
            "content": "Reports ready",
            "sent_date": "2022-08-05"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT sender_id, COUNT(message_id) AS message_count\nFROM messages\nWHERE sent_date LIKE '2022-08%'\nGROUP BY sender_id\nORDER BY message_count DESC\nLIMIT 2;",
    "tags": [
      "Aggregate Functions",
      "LIMIT",
      "Date Filtering"
    ],
    "hints": [
      "Filter for August 2022 with sent_date LIKE \"2022-08%\", group by sender_id, and LIMIT 2."
    ]
  },
  {
    "id": "dl-amazon-1",
    "company": "Amazon",
    "title": "Highest Grossing Items",
    "category": "SQL",
    "difficulty": "Medium",
    "description": "Write a query to identify the top 2 highest-grossing products within each category in the year 2022. Output category, product, and total_spend.",
    "schemaSql": "DROP TABLE IF EXISTS product_spend;\nCREATE TABLE product_spend (\n  category TEXT,\n  product TEXT,\n  user_id INT,\n  spend DECIMAL(10,2),\n  transaction_date TIMESTAMP\n);\nINSERT INTO product_spend VALUES\n('appliance', 'refrigerator', 165, 246.00, '2022-12-26 12:00:00'),\n('appliance', 'refrigerator', 123, 299.99, '2022-03-02 12:00:00'),\n('appliance', 'washing machine', 123, 500.00, '2022-02-06 12:00:00'),\n('electronics', 'vacuum', 178, 152.00, '2022-04-05 12:00:00'),\n('electronics', 'wireless headset', 156, 249.90, '2022-07-08 12:00:00');",
    "tables": [
      {
        "name": "product_spend",
        "columns": [
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "product",
            "type": "string"
          },
          {
            "name": "user_id",
            "type": "integer"
          },
          {
            "name": "spend",
            "type": "decimal"
          },
          {
            "name": "transaction_date",
            "type": "timestamp"
          }
        ],
        "sampleData": [
          {
            "category": "appliance",
            "product": "refrigerator",
            "spend": 246,
            "transaction_date": "2022-12-26"
          },
          {
            "category": "electronics",
            "product": "vacuum",
            "spend": 152,
            "transaction_date": "2022-04-05"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "WITH ranked_spend AS (\n  SELECT\n    category,\n    product,\n    SUM(spend) AS total_spend,\n    DENSE_RANK() OVER (\n      PARTITION BY category\n      ORDER BY SUM(spend) DESC\n    ) AS ranking\n  FROM product_spend\n  WHERE transaction_date >= '2022-01-01' AND transaction_date <= '2022-12-31'\n  GROUP BY category, product\n)\nSELECT category, product, total_spend\nFROM ranked_spend\nWHERE ranking <= 2;",
    "tags": [
      "Window Functions",
      "DENSE_RANK",
      "PARTITION BY"
    ],
    "hints": [
      "Compute SUM(spend) per category and product, rank with DENSE_RANK() OVER (PARTITION BY category ORDER BY SUM(spend) DESC)."
    ]
  },
  {
    "id": "w3-ret-01",
    "company": "W3Resource",
    "title": "Display All Salespeople",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query that displays all columns and rows from the salesman table.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM salesman;",
    "tags": [
      "SELECT",
      "salesman",
      "Retrieve Data"
    ],
    "hints": [
      "Use SELECT * FROM salesman;"
    ]
  },
  {
    "id": "w3-ret-02",
    "company": "W3Resource",
    "title": "Display Specific Columns: Name and Commission",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to display only the name and commission columns for all salesmen.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT name, commission FROM salesman;",
    "tags": [
      "SELECT",
      "salesman",
      "Projections"
    ],
    "hints": [
      "Project name, commission FROM salesman;"
    ]
  },
  {
    "id": "w3-ret-03",
    "company": "W3Resource",
    "title": "Distinct Salespeople in Orders",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to identify unique salesman_id values in the orders table without duplicates.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT salesman_id FROM orders;",
    "tags": [
      "DISTINCT",
      "orders",
      "Retrieve Data"
    ],
    "hints": [
      "Use SELECT DISTINCT salesman_id FROM orders;"
    ]
  },
  {
    "id": "w3-ret-04",
    "company": "W3Resource",
    "title": "Salespeople Located in Paris",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to find all salesmen who reside in 'Paris'. Return name and city.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT name, city FROM salesman WHERE city = 'Paris';",
    "tags": [
      "WHERE",
      "salesman",
      "Filtering"
    ],
    "hints": [
      "Use WHERE city = 'Paris';"
    ]
  },
  {
    "id": "w3-ret-05",
    "company": "W3Resource",
    "title": "Customers with Grade 200",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to find all customers who have a grade of 200. Return customer_id, cust_name, and grade.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT customer_id, cust_name, grade FROM customer WHERE grade = 200;",
    "tags": [
      "WHERE",
      "customer",
      "Grade"
    ],
    "hints": [
      "Use WHERE grade = 200 on the customer table."
    ]
  },
  {
    "id": "w3-ret-06",
    "company": "W3Resource",
    "title": "Orders Placed on Specific Date",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to display ord_no, ord_date, and purch_amt for all orders placed on '2012-10-05'.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT ord_no, ord_date, purch_amt FROM orders WHERE ord_date = '2012-10-05';",
    "tags": [
      "WHERE",
      "orders",
      "Dates"
    ],
    "hints": [
      "Filter orders table WHERE ord_date = '2012-10-05';"
    ]
  },
  {
    "id": "w3-ret-07",
    "company": "W3Resource",
    "title": "Orders Handled by Salesman 5001",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to display ord_no, purch_amt, and ord_date for all orders processed by salesman_id 5001.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT ord_no, purch_amt, ord_date FROM orders WHERE salesman_id = 5001;",
    "tags": [
      "WHERE",
      "orders",
      "Salesman"
    ],
    "hints": [
      "Use WHERE salesman_id = 5001 on the orders table."
    ]
  },
  {
    "id": "w3-ret-08",
    "company": "W3Resource",
    "title": "Customers Without a Grade",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to find customers whose grade is NULL. Return customer_id and cust_name.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT customer_id, cust_name FROM customer WHERE grade IS NULL;",
    "tags": [
      "IS NULL",
      "customer",
      "Nulls"
    ],
    "hints": [
      "Use WHERE grade IS NULL on the customer table."
    ]
  },
  {
    "id": "w3-ret-09",
    "company": "W3Resource",
    "title": "Orders Ordered by Purchase Amount Descending",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to display all orders ordered by purch_amt in descending order.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders ORDER BY purch_amt DESC;",
    "tags": [
      "ORDER BY",
      "orders",
      "Sorting"
    ],
    "hints": [
      "ORDER BY purch_amt DESC;"
    ]
  },
  {
    "id": "w3-ret-10",
    "company": "W3Resource",
    "title": "Customer Names and Cities in New York",
    "category": "Retrieve Data",
    "difficulty": "Easy",
    "description": "Write a SQL query to list all customers located in 'New York'. Return cust_name and city.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE city = 'New York';",
    "tags": [
      "WHERE",
      "customer",
      "New York"
    ],
    "hints": [
      "Use WHERE city = 'New York';"
    ]
  },
  {
    "id": "w3-bool-01",
    "company": "W3Resource",
    "title": "Customers in New York with Grade > 100",
    "category": "Boolean Operators",
    "difficulty": "Easy",
    "description": "Write a SQL query to display all customer information for customers in 'New York' with a grade strictly greater than 100.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM customer WHERE city = 'New York' AND grade > 100;",
    "tags": [
      "AND",
      "customer",
      "Boolean Logic"
    ],
    "hints": [
      "Use WHERE city = 'New York' AND grade > 100;"
    ]
  },
  {
    "id": "w3-bool-02",
    "company": "W3Resource",
    "title": "Customers in New York OR Grade > 100",
    "category": "Boolean Operators",
    "difficulty": "Easy",
    "description": "Write a SQL query to find customers who reside in 'New York' OR have a grade strictly greater than 100.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM customer WHERE city = 'New York' OR grade > 100;",
    "tags": [
      "OR",
      "customer",
      "Boolean Logic"
    ],
    "hints": [
      "Use WHERE city = 'New York' OR grade > 100;"
    ]
  },
  {
    "id": "w3-bool-03",
    "company": "W3Resource",
    "title": "Salesmen with Commission Between 0.12 and 0.14",
    "category": "Boolean Operators",
    "difficulty": "Medium",
    "description": "Write a SQL query to find all salesmen whose commission is between 0.12 and 0.14 inclusive. Return name, city, and commission.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT name, city, commission FROM salesman WHERE commission BETWEEN 0.12 AND 0.14;",
    "tags": [
      "BETWEEN",
      "salesman",
      "Commission"
    ],
    "hints": [
      "Use WHERE commission BETWEEN 0.12 AND 0.14;"
    ]
  },
  {
    "id": "w3-bool-04",
    "company": "W3Resource",
    "title": "Customers Not in New York and Grade <= 100",
    "category": "Boolean Operators",
    "difficulty": "Easy",
    "description": "Write a SQL query to find customers who are NOT located in 'New York' AND do NOT have a grade greater than 100.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM customer WHERE city != 'New York' AND grade <= 100;",
    "tags": [
      "NOT",
      "customer",
      "Filtering"
    ],
    "hints": [
      "Use WHERE city != 'New York' AND (grade <= 100 OR grade IS NULL);"
    ]
  },
  {
    "id": "w3-bool-05",
    "company": "W3Resource",
    "title": "Orders Excluding Specific Dates and High Amounts",
    "category": "Boolean Operators",
    "difficulty": "Medium",
    "description": "Write a SQL query to find all orders excluding those with ord_date = '2012-09-10' and purch_amt > 1000.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders WHERE NOT (ord_date = '2012-09-10' AND purch_amt > 1000);",
    "tags": [
      "NOT",
      "orders",
      "Compound Filter"
    ],
    "hints": [
      "Use WHERE NOT (ord_date = '2012-09-10' AND purch_amt > 1000);"
    ]
  },
  {
    "id": "w3-wild-01",
    "company": "W3Resource",
    "title": "Salespeople Whose Name Begins with 'N' or 'P'",
    "category": "Wildcards",
    "difficulty": "Easy",
    "description": "Write a SQL query to find salesmen whose names start with the letter 'N' or 'P'. Return all columns.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM salesman WHERE name LIKE 'N%' OR name LIKE 'P%';",
    "tags": [
      "LIKE",
      "salesman",
      "Wildcards"
    ],
    "hints": [
      "Use WHERE name LIKE 'N%' OR name LIKE 'P%';"
    ]
  },
  {
    "id": "w3-wild-02",
    "company": "W3Resource",
    "title": "Customers Whose Name Ends with 'n'",
    "category": "Wildcards",
    "difficulty": "Easy",
    "description": "Write a SQL query to find customers whose cust_name ends with 'n'. Return cust_name and city.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE cust_name LIKE '%n';",
    "tags": [
      "LIKE",
      "customer",
      "Pattern Matching"
    ],
    "hints": [
      "Use WHERE cust_name LIKE '%n';"
    ]
  },
  {
    "id": "w3-wild-03",
    "company": "W3Resource",
    "title": "Salesperson with 4th Character 'l'",
    "category": "Wildcards",
    "difficulty": "Medium",
    "description": "Write a SQL query to find salesmen whose name starts with 'N' and has 'l' as the fourth character.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM salesman WHERE name LIKE 'N__l%';",
    "tags": [
      "LIKE",
      "salesman",
      "Underscore"
    ],
    "hints": [
      "Use underscore wildcards: name LIKE 'N__l%';"
    ]
  },
  {
    "id": "w3-wild-04",
    "company": "W3Resource",
    "title": "Customers in Paris or London",
    "category": "Wildcards",
    "difficulty": "Easy",
    "description": "Write a SQL query to find customers whose city is in ('Paris', 'London'). Return cust_name and city.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT cust_name, city FROM customer WHERE city IN ('Paris', 'London');",
    "tags": [
      "IN",
      "customer",
      "City"
    ],
    "hints": [
      "Use WHERE city IN ('Paris', 'London');"
    ]
  },
  {
    "id": "w3-wild-05",
    "company": "W3Resource",
    "title": "Orders Between 500 and 4000 Excluding Specific Values",
    "category": "Wildcards",
    "difficulty": "Medium",
    "description": "Write a SQL query to find orders with purch_amt between 500 and 4000, excluding purch_amt values 948.50 and 1983.43.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders WHERE purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);",
    "tags": [
      "BETWEEN",
      "NOT IN",
      "orders"
    ],
    "hints": [
      "Use purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);"
    ]
  },
  {
    "id": "w3-agg-01",
    "company": "W3Resource",
    "title": "Total Purchase Amount of All Orders",
    "category": "Aggregates",
    "difficulty": "Easy",
    "description": "Write a SQL query to calculate the total sum of all order purchase amounts. Return total_purchase_amount.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;",
    "tags": [
      "SUM",
      "orders",
      "Aggregates"
    ],
    "hints": [
      "SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;"
    ]
  },
  {
    "id": "w3-agg-02",
    "company": "W3Resource",
    "title": "Average Purchase Amount Across Orders",
    "category": "Aggregates",
    "difficulty": "Easy",
    "description": "Write a SQL query to calculate the average purchase amount for all orders. Return avg_purchase_amount.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;",
    "tags": [
      "AVG",
      "orders",
      "Aggregates"
    ],
    "hints": [
      "SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;"
    ]
  },
  {
    "id": "w3-agg-03",
    "company": "W3Resource",
    "title": "Count Unique Salespeople Who Have Orders",
    "category": "Aggregates",
    "difficulty": "Easy",
    "description": "Write a SQL query to count the number of unique salesmen who have generated at least one order. Return count_salesmen.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT COUNT(DISTINCT salesman_id) AS count_salesmen FROM orders;",
    "tags": [
      "COUNT",
      "DISTINCT",
      "orders"
    ],
    "hints": [
      "SELECT COUNT(DISTINCT salesman_id) AS count_salesmen FROM orders;"
    ]
  },
  {
    "id": "w3-agg-04",
    "company": "W3Resource",
    "title": "Highest Purchase Amount Grouped by Customer",
    "category": "Aggregates",
    "difficulty": "Medium",
    "description": "Write a SQL query to find the maximum purchase amount ordered by each customer. Return customer_id and max_purchase_amount.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;",
    "tags": [
      "GROUP BY",
      "MAX",
      "orders"
    ],
    "hints": [
      "SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;"
    ]
  },
  {
    "id": "w3-agg-05",
    "company": "W3Resource",
    "title": "Highest Purchase Amount Per Date with Threshold",
    "category": "Aggregates",
    "difficulty": "Medium",
    "description": "Write a SQL query to find the highest purchase amount on each order date where the highest purchase is strictly greater than 2000. Return ord_date and max_purch.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT ord_date, MAX(purch_amt) AS max_purch FROM orders GROUP BY ord_date HAVING MAX(purch_amt) > 2000;",
    "tags": [
      "HAVING",
      "GROUP BY",
      "MAX",
      "orders"
    ],
    "hints": [
      "GROUP BY ord_date HAVING MAX(purch_amt) > 2000;"
    ]
  },
  {
    "id": "w3-agg-06",
    "company": "W3Resource",
    "title": "Number of Customers in Each City",
    "category": "Aggregates",
    "difficulty": "Medium",
    "description": "Write a SQL query to count how many customers are located in each city. Return city and customer_count, ordered by customer_count descending.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT city, COUNT(customer_id) AS customer_count FROM customer GROUP BY city ORDER BY customer_count DESC;",
    "tags": [
      "GROUP BY",
      "COUNT",
      "customer"
    ],
    "hints": [
      "GROUP BY city ORDER BY customer_count DESC;"
    ]
  },
  {
    "id": "w3-fmt-01",
    "company": "W3Resource",
    "title": "Calculate Commission Amount for Each Order",
    "category": "Formatting",
    "difficulty": "Easy",
    "description": "Write a SQL query to display ord_no, purch_amt, and the estimated salesman commission earned (calculated as purch_amt * 0.12) as commission_earned for all orders.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT ord_no, purch_amt, purch_amt * 0.12 AS commission_earned FROM orders;",
    "tags": [
      "Calculated Columns",
      "Arithmetic",
      "orders"
    ],
    "hints": [
      "SELECT ord_no, purch_amt, purch_amt * 0.12 AS commission_earned FROM orders;"
    ]
  },
  {
    "id": "w3-fmt-02",
    "company": "W3Resource",
    "title": "Display Full Customer Description Sentence",
    "category": "Formatting",
    "difficulty": "Easy",
    "description": "Write a SQL query to display a sentence formatted as: 'Customer [cust_name] is located in [city]' with alias customer_summary.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT 'Customer ' || cust_name || ' is located in ' || city AS customer_summary FROM customer;",
    "tags": [
      "Concatenation",
      "Strings",
      "customer"
    ],
    "hints": [
      "Use concatenation: 'Customer ' || cust_name || ' is located in ' || city AS customer_summary FROM customer;"
    ]
  },
  {
    "id": "w3-join-01",
    "company": "W3Resource",
    "title": "Salesperson and Customer in Same City",
    "category": "Joins",
    "difficulty": "Medium",
    "description": "Write a SQL query to find the salesperson name and customer name who reside in the exact same city. Return salesman_name (s.name), cust_name, and city.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT s.name AS salesman_name, c.cust_name, c.city FROM salesman s JOIN customer c ON s.city = c.city;",
    "tags": [
      "JOIN",
      "salesman",
      "customer",
      "City Matching"
    ],
    "hints": [
      "JOIN customer c ON s.city = c.city;"
    ]
  },
  {
    "id": "w3-join-02",
    "company": "W3Resource",
    "title": "Orders Between 500 and 2000 with Customer Details",
    "category": "Joins",
    "difficulty": "Medium",
    "description": "Write a SQL query to display ord_no, purch_amt, cust_name, and customer city for all orders where purch_amt is between 500 and 2000.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT o.ord_no, o.purch_amt, c.cust_name, c.city FROM orders o JOIN customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;",
    "tags": [
      "JOIN",
      "orders",
      "customer",
      "BETWEEN"
    ],
    "hints": [
      "JOIN orders o WITH customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;"
    ]
  },
  {
    "id": "w3-join-03",
    "company": "W3Resource",
    "title": "Customers Appointed to Salesman with Commission > 12%",
    "category": "Joins",
    "difficulty": "Medium",
    "description": "Write a SQL query to find customers whose assigned salesman receives a commission strictly greater than 0.12. Return cust_name, customer city (c.city), salesman name (s.name), and commission.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT c.cust_name, c.city, s.name AS salesman_name, s.commission FROM customer c JOIN salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;",
    "tags": [
      "JOIN",
      "salesman",
      "customer",
      "Commission"
    ],
    "hints": [
      "JOIN customer c WITH salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;"
    ]
  },
  {
    "id": "w3-join-04",
    "company": "W3Resource",
    "title": "Orders with Customer Name and Salesman Name (3-Way Join)",
    "category": "Joins",
    "difficulty": "Hard",
    "description": "Write a SQL query to display ord_no, cust_name, s.name AS salesman_name, and commission for all orders. Joining orders, customer, and salesman.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT o.ord_no, c.cust_name, s.name AS salesman_name, s.commission FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id;",
    "tags": [
      "3-way JOIN",
      "orders",
      "customer",
      "salesman"
    ],
    "hints": [
      "JOIN orders o ON o.customer_id = c.customer_id AND o.salesman_id = s.salesman_id;"
    ]
  },
  {
    "id": "w3-join-05",
    "company": "W3Resource",
    "title": "Customer and Salesman Living in Different Cities",
    "category": "Joins",
    "difficulty": "Medium",
    "description": "Write a SQL query to display ord_no, cust_name, c.city AS customer_city, s.name AS salesman_name, and s.city AS salesman_city for all orders where the customer and their assigned salesman reside in different cities.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT o.ord_no, c.cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id WHERE c.city != s.city;",
    "tags": [
      "JOIN",
      "Inequality",
      "orders"
    ],
    "hints": [
      "WHERE c.city != s.city after joining orders, customer, and salesman."
    ]
  },
  {
    "id": "w3-sub-01",
    "company": "W3Resource",
    "title": "Orders Handled by Salesman 'Paul Adam'",
    "category": "Subqueries",
    "difficulty": "Hard",
    "description": "Write a SQL query using a subquery to find all orders generated by salesman 'Paul Adam'. Return all columns of orders.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');",
    "tags": [
      "Subquery",
      "Scalar Subquery",
      "orders"
    ],
    "hints": [
      "WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');"
    ]
  },
  {
    "id": "w3-sub-02",
    "company": "W3Resource",
    "title": "Orders Handled by London-Based Salespeople",
    "category": "Subqueries",
    "difficulty": "Hard",
    "description": "Write a SQL query using a subquery with IN to find all orders processed by any salesman located in 'London'. Return all columns of orders.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');",
    "tags": [
      "Subquery",
      "IN",
      "orders"
    ],
    "hints": [
      "WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');"
    ]
  },
  {
    "id": "w3-sub-03",
    "company": "W3Resource",
    "title": "Orders Above Daily Average of 2012-10-10",
    "category": "Subqueries",
    "difficulty": "Hard",
    "description": "Write a SQL query using a subquery to find all orders whose purch_amt is greater than the average purchase amount for orders on '2012-10-10'. Return all columns of orders.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM orders WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');",
    "tags": [
      "Subquery",
      "AVG",
      "Comparison"
    ],
    "hints": [
      "WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');"
    ]
  },
  {
    "id": "w3-sub-04",
    "company": "W3Resource",
    "title": "Customers with Grade Higher Than Every New York Customer",
    "category": "Subqueries",
    "difficulty": "Hard",
    "description": "Write a SQL query using a subquery to find all customers whose grade is strictly greater than the maximum grade among customers in 'New York'. Return all columns.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM customer WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');",
    "tags": [
      "Subquery",
      "MAX",
      "customer"
    ],
    "hints": [
      "WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');"
    ]
  },
  {
    "id": "w3-sub-05",
    "company": "W3Resource",
    "title": "Salesmen with Customers in Their Home City (EXISTS)",
    "category": "Subqueries",
    "difficulty": "Hard",
    "description": "Write a SQL query using EXISTS to find salesmen who have at least one customer located in the same city as them. Return all columns of salesman.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT * FROM salesman s WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);",
    "tags": [
      "Subquery",
      "EXISTS",
      "Correlated"
    ],
    "hints": [
      "WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);"
    ]
  },
  {
    "id": "w3-nobel-01",
    "company": "W3Resource",
    "title": "Nobel Prize Winners in 1970",
    "category": "Nobel Win",
    "difficulty": "Easy",
    "description": "Write a SQL query to display the year, subject, and winner name for all Nobel prizes awarded in 1970 from the nobel_win table.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT year, subject, winner FROM nobel_win WHERE year = 1970;",
    "tags": [
      "nobel_win",
      "WHERE",
      "Nobel"
    ],
    "hints": [
      "SELECT year, subject, winner FROM nobel_win WHERE year = 1970;"
    ]
  },
  {
    "id": "w3-nobel-02",
    "company": "W3Resource",
    "title": "Literature Winner for 1971",
    "category": "Nobel Win",
    "difficulty": "Easy",
    "description": "Write a SQL query to find the Nobel Prize winner in 'Literature' for the year 1971. Return winner.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT winner FROM nobel_win WHERE year = 1971 AND subject = 'Literature';",
    "tags": [
      "nobel_win",
      "AND",
      "Literature"
    ],
    "hints": [
      "WHERE year = 1971 AND subject = 'Literature';"
    ]
  },
  {
    "id": "w3-nobel-03",
    "company": "W3Resource",
    "title": "Award Details for Dennis Gabor",
    "category": "Nobel Win",
    "difficulty": "Easy",
    "description": "Write a SQL query to find the year and subject in which 'Dennis Gabor' won the Nobel Prize. Return year and subject.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT year, subject FROM nobel_win WHERE winner = 'Dennis Gabor';",
    "tags": [
      "nobel_win",
      "WHERE",
      "Exact Match"
    ],
    "hints": [
      "WHERE winner = 'Dennis Gabor';"
    ]
  },
  {
    "id": "w3-nobel-04",
    "company": "W3Resource",
    "title": "Physics Winners Between 1970 and 1987",
    "category": "Nobel Win",
    "difficulty": "Medium",
    "description": "Write a SQL query to find all Nobel Prize winners in 'Physics' between the years 1970 and 1987 inclusive. Return year, subject, and winner.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT year, subject, winner FROM nobel_win WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;",
    "tags": [
      "nobel_win",
      "BETWEEN",
      "Physics"
    ],
    "hints": [
      "WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;"
    ]
  },
  {
    "id": "w3-nobel-05",
    "company": "W3Resource",
    "title": "Count Nobel Winners by Subject",
    "category": "Nobel Win",
    "difficulty": "Medium",
    "description": "Write a SQL query to count how many Nobel prizes have been awarded in each subject. Return subject and count_winners, ordered by count_winners DESC.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT subject, COUNT(*) AS count_winners FROM nobel_win GROUP BY subject ORDER BY count_winners DESC;",
    "tags": [
      "nobel_win",
      "GROUP BY",
      "COUNT"
    ],
    "hints": [
      "GROUP BY subject ORDER BY count_winners DESC;"
    ]
  },
  {
    "id": "w3-inv-01",
    "company": "W3Resource",
    "title": "Average Item Price Per Company Code",
    "category": "Inventory & Mast",
    "difficulty": "Easy",
    "description": "Write a SQL query to calculate the average item price for each company code (pro_com) from item_mast. Return pro_com and avg_price rounded to 2 decimals.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;",
    "tags": [
      "item_mast",
      "GROUP BY",
      "AVG"
    ],
    "hints": [
      "SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;"
    ]
  },
  {
    "id": "w3-inv-02",
    "company": "W3Resource",
    "title": "Products with Company Names (JOIN)",
    "category": "Inventory & Mast",
    "difficulty": "Medium",
    "description": "Write a SQL query to display the item name (pro_name), price (pro_price), and company name (com_name) for all products by joining item_mast and company_mast.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT i.pro_name, i.pro_price, c.com_name FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id;",
    "tags": [
      "item_mast",
      "company_mast",
      "JOIN"
    ],
    "hints": [
      "JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id;"
    ]
  },
  {
    "id": "w3-inv-03",
    "company": "W3Resource",
    "title": "Most Expensive Item in Each Company",
    "category": "Inventory & Mast",
    "difficulty": "Hard",
    "description": "Write a SQL query to find the maximum price of an item for each company name. Return com_name and max_price.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT c.com_name, MAX(i.pro_price) AS max_price FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;",
    "tags": [
      "JOIN",
      "GROUP BY",
      "MAX",
      "item_mast"
    ],
    "hints": [
      "JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;"
    ]
  },
  {
    "id": "w3-emp-01",
    "company": "W3Resource",
    "title": "Employees in IT or HR Department",
    "category": "Employee Directory",
    "difficulty": "Easy",
    "description": "Write a SQL query to find employees whose department code (emp_dept) is 57 (IT) or 47 (HR) from emp_details. Return emp_idno, emp_fname, emp_lname, and emp_dept.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT emp_idno, emp_fname, emp_lname, emp_dept FROM emp_details WHERE emp_dept IN (57, 47);",
    "tags": [
      "emp_details",
      "IN",
      "Departments"
    ],
    "hints": [
      "WHERE emp_dept IN (57, 47);"
    ]
  },
  {
    "id": "w3-emp-02",
    "company": "W3Resource",
    "title": "Employees with Department Name and Budget Allotment",
    "category": "Employee Directory",
    "difficulty": "Medium",
    "description": "Write a SQL query to display employee full name (emp_fname, emp_lname), department name (dpt_name), and department allotment (dpt_allotment) by joining emp_details and emp_department.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT e.emp_fname, e.emp_lname, d.dpt_name, d.dpt_allotment FROM emp_details e JOIN emp_department d ON e.emp_dept = d.dpt_code;",
    "tags": [
      "emp_details",
      "emp_department",
      "JOIN"
    ],
    "hints": [
      "JOIN emp_details e WITH emp_department d ON e.emp_dept = d.dpt_code;"
    ]
  },
  {
    "id": "w3-emp-03",
    "company": "W3Resource",
    "title": "Count Employees in Each Department",
    "category": "Employee Directory",
    "difficulty": "Medium",
    "description": "Write a SQL query to count the number of employees in each department. Return dpt_name and total_employees, ordered by total_employees descending.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT d.dpt_name, COUNT(e.emp_idno) AS total_employees FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept GROUP BY d.dpt_name ORDER BY total_employees DESC;",
    "tags": [
      "emp_department",
      "GROUP BY",
      "COUNT"
    ],
    "hints": [
      "GROUP BY d.dpt_name ORDER BY total_employees DESC;"
    ]
  },
  {
    "id": "w3-emp-04",
    "company": "W3Resource",
    "title": "Departments with Allotment Exceeding 60000",
    "category": "Employee Directory",
    "difficulty": "Hard",
    "description": "Write a SQL query to find distinct department names (dpt_name) with a budget allotment exceeding 60000 that have active employees assigned.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;",
    "tags": [
      "emp_department",
      "DISTINCT",
      "JOIN",
      "Budget"
    ],
    "hints": [
      "SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;"
    ]
  },
  {
    "id": "w3-mov-01",
    "company": "W3Resource",
    "title": "Movies Released in 1999",
    "category": "Movie Database",
    "difficulty": "Easy",
    "description": "Write a SQL query to find the title (mov_title) and duration (mov_time) of all films released in 1999 from the movie table.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999;",
    "tags": [
      "movie",
      "WHERE",
      "Movie Database"
    ],
    "hints": [
      "SELECT mov_title, mov_time FROM movie WHERE mov_year = 1999;"
    ]
  },
  {
    "id": "w3-mov-02",
    "company": "W3Resource",
    "title": "Movies Running Longer than 150 Minutes",
    "category": "Movie Database",
    "difficulty": "Easy",
    "description": "Write a SQL query to find all films with a running time strictly greater than 150 minutes. Return mov_title, mov_year, and mov_time, ordered by mov_time descending.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT mov_title, mov_year, mov_time FROM movie WHERE mov_time > 150 ORDER BY mov_time DESC;",
    "tags": [
      "movie",
      "ORDER BY",
      "Duration"
    ],
    "hints": [
      "WHERE mov_time > 150 ORDER BY mov_time DESC;"
    ]
  },
  {
    "id": "w3-mov-03",
    "company": "W3Resource",
    "title": "Movies with Their Respective Directors (JOIN)",
    "category": "Movie Database",
    "difficulty": "Medium",
    "description": "Write a SQL query to display each movie title (mov_title) along with the director's full name (dir_fname || ' ' || dir_lname AS director_name) by joining movie, movie_direction, and director.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT m.mov_title, (d.dir_fname || ' ' || d.dir_lname) AS director_name FROM movie m JOIN movie_direction md ON m.mov_id = md.mov_id JOIN director d ON md.dir_id = d.dir_id;",
    "tags": [
      "movie",
      "director",
      "JOIN"
    ],
    "hints": [
      "JOIN movie m ON md.mov_id = m.mov_id JOIN director d ON md.dir_id = d.dir_id;"
    ]
  },
  {
    "id": "w3-mov-04",
    "company": "W3Resource",
    "title": "Movies with Ratings and Reviewer Names",
    "category": "Movie Database",
    "difficulty": "Medium",
    "description": "Write a SQL query to display mov_title, rev_name, and rev_stars for all rated movies by joining movie, rating, and reviewer.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT m.mov_title, rev.rev_name, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id JOIN reviewer rev ON r.rev_id = rev.rev_id;",
    "tags": [
      "movie",
      "rating",
      "reviewer",
      "JOIN"
    ],
    "hints": [
      "JOIN movie m ON r.mov_id = m.mov_id JOIN reviewer rev ON r.rev_id = rev.rev_id;"
    ]
  },
  {
    "id": "w3-mov-05",
    "company": "W3Resource",
    "title": "Movies with Rating Above 8.0 Stars",
    "category": "Movie Database",
    "difficulty": "Hard",
    "description": "Write a SQL query to find the titles of all movies that have received a review rating strictly greater than 8.0 stars. Return mov_title and rev_stars, ordered by rev_stars descending.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT m.mov_title, r.rev_stars FROM movie m JOIN rating r ON m.mov_id = r.mov_id WHERE r.rev_stars > 8.0 ORDER BY r.rev_stars DESC;",
    "tags": [
      "movie",
      "rating",
      "High Ratings"
    ],
    "hints": [
      "JOIN movie m WITH rating r ON m.mov_id = r.mov_id WHERE r.rev_stars > 8.0 ORDER BY r.rev_stars DESC;"
    ]
  },
  {
    "id": "w3-mov-06",
    "company": "W3Resource",
    "title": "Movies Directed by Alfred Hitchcock (Subquery)",
    "category": "Movie Database",
    "difficulty": "Hard",
    "description": "Write a SQL query using a subquery to find all movies directed by 'Alfred Hitchcock'. Return mov_title and mov_year.",
    "schemaSql": "",
    "tables": [],
    "starterSql": "",
    "solutionSql": "SELECT mov_title, mov_year FROM movie WHERE mov_id IN (SELECT md.mov_id FROM movie_direction md JOIN director d ON md.dir_id = d.dir_id WHERE d.dir_fname = 'Alfred' AND d.dir_lname = 'Hitchcock');",
    "tags": [
      "movie",
      "Subquery",
      "Hitchcock"
    ],
    "hints": [
      "WHERE mov_id IN (SELECT mov_id FROM movie_direction md JOIN director d ON md.dir_id = d.dir_id WHERE d.dir_fname = 'Alfred' AND d.dir_lname = 'Hitchcock');"
    ]
  }
];
