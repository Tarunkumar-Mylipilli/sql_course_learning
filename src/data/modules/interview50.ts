import { CodingChallenge } from '../../types';

export const INTERVIEW_50_QUESTIONS: CodingChallenge[] = [
  {
    "id": "lc_175",
    "title": "1. Combine Two Tables (Person & Address)",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 175",
    "instructions": "Report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.",
    "schemaSql": "\nCREATE TABLE Person (personId INT PRIMARY KEY, firstName VARCHAR(50), lastName VARCHAR(50));\nCREATE TABLE Address (addressId INT PRIMARY KEY, personId INT, city VARCHAR(50), state VARCHAR(50));\nINSERT INTO Person VALUES (1, 'Allen', 'Wang'), (2, 'Bob', 'Alice');\nINSERT INTO Address VALUES (1, 2, 'New York City', 'New York');",
    "tables": [
      {
        "name": "Person",
        "columns": [
          {
            "name": "personId",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "firstName",
            "type": "VARCHAR(50)"
          },
          {
            "name": "lastName",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "personId": 1,
            "firstName": "Allen",
            "lastName": "Wang"
          },
          {
            "personId": 2,
            "firstName": "Bob",
            "lastName": "Alice"
          }
        ]
      },
      {
        "name": "Address",
        "columns": [
          {
            "name": "addressId",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "personId",
            "type": "INT"
          },
          {
            "name": "city",
            "type": "VARCHAR(50)"
          },
          {
            "name": "state",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "addressId": 1,
            "personId": 2,
            "city": "New York City",
            "state": "New York"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;",
    "expectedColumns": [
      "firstName",
      "lastName",
      "city",
      "state"
    ],
    "hints": [
      "Use a LEFT JOIN to keep all records from Person even when they have no address."
    ]
  },
  {
    "id": "lc_176",
    "title": "2. Second Highest Salary",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 176",
    "instructions": "Find the second highest distinct salary from the Employee table. If there is no second highest salary, return null.",
    "schemaSql": "\nCREATE TABLE Employee (id INT PRIMARY KEY, salary INT);\nINSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);",
    "tables": [
      {
        "name": "Employee",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "salary",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "salary": 100
          },
          {
            "id": 2,
            "salary": 200
          },
          {
            "id": 3,
            "salary": 300
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS SecondHighestSalary;",
    "expectedColumns": [
      "SecondHighestSalary"
    ],
    "hints": [
      "Wrap LIMIT 1 OFFSET 1 inside a scalar subquery so it evaluates to NULL if only 1 salary exists."
    ]
  },
  {
    "id": "lc_178",
    "title": "3. Rank Scores Without Gaps",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 178",
    "instructions": "Report the scores and their ranks. Ties should share the same rank without skipping subsequent ranks.",
    "schemaSql": "\nCREATE TABLE Scores (id INT PRIMARY KEY, score DECIMAL(3,2));\nINSERT INTO Scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65);",
    "tables": [
      {
        "name": "Scores",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "score",
            "type": "DECIMAL(3,2)"
          }
        ],
        "sampleData": [
          {
            "id": 3,
            "score": 4
          },
          {
            "id": 2,
            "score": 3.65
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS \"rank\" FROM Scores ORDER BY score DESC;",
    "expectedColumns": [
      "score",
      "rank"
    ],
    "hints": [
      "Use the DENSE_RANK() window function ordered by score descending."
    ]
  },
  {
    "id": "lc_180",
    "title": "4. Consecutive Numbers",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 180",
    "instructions": "Find all numbers that appear at least three times consecutively in the Logs table.",
    "schemaSql": "\nCREATE TABLE Logs (id INT PRIMARY KEY, num INT);\nINSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);",
    "tables": [
      {
        "name": "Logs",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "num",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "num": 1
          },
          {
            "id": 2,
            "num": 1
          },
          {
            "id": 3,
            "num": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT l1.num AS ConsecutiveNums FROM Logs l1 JOIN Logs l2 ON l1.id = l2.id - 1 JOIN Logs l3 ON l2.id = l3.id - 1 WHERE l1.num = l2.num AND l2.num = l3.num;",
    "expectedColumns": [
      "ConsecutiveNums"
    ],
    "hints": [
      "Join the table to itself on consecutive IDs (id, id+1, id+2) and check that all 3 num values match."
    ]
  },
  {
    "id": "lc_181",
    "title": "5. Employees Earning More Than Their Managers",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 181",
    "instructions": "Find the employees who earn more than their direct managers.",
    "schemaSql": "\nCREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, managerId INT);\nINSERT INTO Employee VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);",
    "tables": [
      {
        "name": "Employee",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "managerId",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "name": "Joe",
            "salary": 70000,
            "managerId": 3
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT e.name AS Employee FROM Employee e JOIN Employee m ON e.managerId = m.id WHERE e.salary > m.salary;",
    "expectedColumns": [
      "Employee"
    ],
    "hints": [
      "Self-join: connect employee on managerId = manager.id, then compare salaries."
    ]
  },
  {
    "id": "lc_182",
    "title": "6. Duplicate Emails",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 182",
    "instructions": "Report all duplicate emails from the Person table.",
    "schemaSql": "\nCREATE TABLE Person (id INT PRIMARY KEY, email VARCHAR(50));\nINSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');",
    "tables": [
      {
        "name": "Person",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "email",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "email": "a@b.com"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT email AS Email FROM Person GROUP BY email HAVING COUNT(email) > 1;",
    "expectedColumns": [
      "Email"
    ],
    "hints": [
      "Group by email and filter using HAVING COUNT(email) > 1."
    ]
  },
  {
    "id": "lc_183",
    "title": "7. Customers Who Never Order",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 183",
    "instructions": "Find all customers who have never placed an order.",
    "schemaSql": "\nCREATE TABLE Customers (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Orders (id INT PRIMARY KEY, customerId INT);\nINSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');\nINSERT INTO Orders VALUES (1, 3), (2, 1);",
    "tables": [
      {
        "name": "Customers",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "name": "Joe"
          }
        ]
      },
      {
        "name": "Orders",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "customerId",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "customerId": 3
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.customerId IS NULL;",
    "expectedColumns": [
      "Customers"
    ],
    "hints": [
      "Use a LEFT JOIN on customerId and filter WHERE o.customerId IS NULL."
    ]
  },
  {
    "id": "lc_184",
    "title": "8. Department Highest Salary",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 184",
    "instructions": "Find the employees who have the highest salary in each department.",
    "schemaSql": "\nCREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);\nINSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');\nINSERT INTO Employee VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1);",
    "tables": [
      {
        "name": "Employee",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "departmentId",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 4,
            "name": "Max",
            "salary": 90000,
            "departmentId": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);",
    "expectedColumns": [
      "Department",
      "Employee",
      "Salary"
    ],
    "hints": [
      "Filter with IN against a subquery computing MAX(salary) grouped by departmentId."
    ]
  },
  {
    "id": "lc_185",
    "title": "9. Department Top Three Salaries",
    "difficulty": "Hard",
    "source": "LeetCode",
    "sourceId": "LeetCode 185",
    "instructions": "Find the employees who earn in the top three unique salaries for each department.",
    "schemaSql": "\nCREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);\nINSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');\nINSERT INTO Employee VALUES \n(1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1), \n(5, 'Janet', 69000, 1), (6, 'Randy', 85000, 1), (7, 'Will', 70000, 1);",
    "tables": [
      {
        "name": "Employee",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "departmentId",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 4,
            "name": "Max",
            "salary": 90000,
            "departmentId": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM (SELECT *, DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk FROM Employee) e JOIN Department d ON e.departmentId = d.id WHERE e.rnk <= 3;",
    "expectedColumns": [
      "Department",
      "Employee",
      "Salary"
    ],
    "hints": [
      "Use DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) in a subquery and filter rnk <= 3."
    ]
  },
  {
    "id": "lc_196",
    "title": "10. Delete Duplicate Emails",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 196",
    "instructions": "Delete duplicate emails keeping only one unique email with the smallest id.",
    "schemaSql": "\nCREATE TABLE Person (id INT PRIMARY KEY, email VARCHAR(50));\nINSERT INTO Person VALUES (1, 'john@example.com'), (2, 'bob@example.com'), (3, 'john@example.com');",
    "tables": [
      {
        "name": "Person",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "email",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "email": "john@example.com"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "DELETE FROM Person WHERE id NOT IN (SELECT MIN(id) FROM Person GROUP BY email); SELECT id, email FROM Person;",
    "expectedColumns": [
      "id",
      "email"
    ],
    "hints": [
      "Delete rows whose id is not in the set of MIN(id) grouped by email."
    ]
  },
  {
    "id": "lc_197",
    "title": "11. Rising Temperature",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 197",
    "instructions": "Find all dates ID with higher temperatures compared to its previous dates (yesterday).",
    "schemaSql": "\nCREATE TABLE Weather (id INT PRIMARY KEY, recordDate DATE, temperature INT);\nINSERT INTO Weather VALUES \n(1, '2015-01-01', 10), (2, '2015-01-02', 25), (3, '2015-01-03', 20), (4, '2015-01-04', 30);",
    "tables": [
      {
        "name": "Weather",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "recordDate",
            "type": "DATE"
          },
          {
            "name": "temperature",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "recordDate": "2015-01-01",
            "temperature": 10
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT w1.id FROM Weather w1 JOIN Weather w2 ON date(w1.recordDate, '-1 day') = w2.recordDate WHERE w1.temperature > w2.temperature;",
    "expectedColumns": [
      "id"
    ],
    "hints": [
      "In SQLite, use date(w1.recordDate, '-1 day') = w2.recordDate to match consecutive days."
    ]
  },
  {
    "id": "lc_262",
    "title": "12. Trips and Users (Cancellation Rate)",
    "difficulty": "Hard",
    "source": "LeetCode",
    "sourceId": "LeetCode 262",
    "instructions": "Find the cancellation rate of requests with unbanned users each day between 2013-10-01 and 2013-10-03, rounded to 2 decimals.",
    "schemaSql": "\nCREATE TABLE Users (users_id INT PRIMARY KEY, banned VARCHAR(10), role VARCHAR(10));\nCREATE TABLE Trips (id INT PRIMARY KEY, client_id INT, driver_id INT, status VARCHAR(30), request_at DATE);\nINSERT INTO Users VALUES (1, 'No', 'client'), (2, 'Yes', 'client'), (10, 'No', 'driver'), (11, 'No', 'driver');\nINSERT INTO Trips VALUES \n(1, 1, 10, 'completed', '2013-10-01'), \n(2, 2, 11, 'cancelled_by_driver', '2013-10-01'), \n(3, 1, 10, 'cancelled_by_client', '2013-10-01'),\n(4, 1, 10, 'completed', '2013-10-02');",
    "tables": [
      {
        "name": "Trips",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "client_id",
            "type": "INT"
          },
          {
            "name": "driver_id",
            "type": "INT"
          },
          {
            "name": "status",
            "type": "VARCHAR(30)"
          },
          {
            "name": "request_at",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "client_id": 1,
            "driver_id": 10,
            "status": "completed",
            "request_at": "2013-10-01"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT request_at AS Day, ROUND(SUM(CASE WHEN status != 'completed' THEN 1.0 ELSE 0.0 END) / COUNT(*), 2) AS \"Cancellation Rate\" FROM Trips WHERE client_id IN (SELECT users_id FROM Users WHERE banned = 'No') AND driver_id IN (SELECT users_id FROM Users WHERE banned = 'No') AND request_at BETWEEN '2013-10-01' AND '2013-10-03' GROUP BY request_at;",
    "expectedColumns": [
      "Day",
      "Cancellation Rate"
    ],
    "hints": [
      "Filter client_id and driver_id against non-banned users, then compute SUM(status != completed) / COUNT(*)."
    ]
  },
  {
    "id": "lc_511",
    "title": "13. Game Play Analysis I",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 511",
    "instructions": "Report the first login date for each player.",
    "schemaSql": "\nCREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);\nINSERT INTO Activity VALUES (1, 2, '2016-03-01', 5), (1, 2, '2016-05-02', 6), (2, 3, '2017-06-25', 1);",
    "tables": [
      {
        "name": "Activity",
        "columns": [
          {
            "name": "player_id",
            "type": "INT"
          },
          {
            "name": "device_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "DATE"
          },
          {
            "name": "games_played",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "player_id": 1,
            "event_date": "2016-03-01"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;",
    "expectedColumns": [
      "player_id",
      "first_login"
    ],
    "hints": [
      "Group by player_id and calculate MIN(event_date)."
    ]
  },
  {
    "id": "lc_534",
    "title": "14. Game Play Analysis III (Running Total)",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 534",
    "instructions": "Report the cumulative games played by each player up to each date.",
    "schemaSql": "\nCREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);\nINSERT INTO Activity VALUES (1, 2, '2016-03-01', 5), (1, 2, '2016-05-02', 6), (1, 3, '2017-06-25', 1);",
    "tables": [
      {
        "name": "Activity",
        "columns": [
          {
            "name": "player_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "DATE"
          },
          {
            "name": "games_played",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "player_id": 1,
            "event_date": "2016-03-01",
            "games_played": 5
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT player_id, event_date, SUM(games_played) OVER (PARTITION BY player_id ORDER BY event_date) AS games_played_so_far FROM Activity;",
    "expectedColumns": [
      "player_id",
      "event_date",
      "games_played_so_far"
    ],
    "hints": [
      "Use the window function SUM(games_played) OVER (PARTITION BY player_id ORDER BY event_date)."
    ]
  },
  {
    "id": "lc_550",
    "title": "15. Game Play Analysis IV (Day-1 Retention)",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 550",
    "instructions": "Report the fraction of players that logged in again on the day after their first login date, rounded to 2 decimals.",
    "schemaSql": "\nCREATE TABLE Activity (player_id INT, device_id INT, event_date DATE, games_played INT);\nINSERT INTO Activity VALUES \n(1, 2, '2016-03-01', 5), (1, 2, '2016-03-02', 6), (2, 3, '2017-06-25', 1), (3, 1, '2016-03-02', 0), (3, 4, '2018-07-03', 5);",
    "tables": [
      {
        "name": "Activity",
        "columns": [
          {
            "name": "player_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "player_id": 1,
            "event_date": "2016-03-01"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT ROUND(CAST(COUNT(DISTINCT a.player_id) AS FLOAT) / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction FROM Activity a JOIN (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id) f ON a.player_id = f.player_id AND a.event_date = date(f.first_login, '+1 day');",
    "expectedColumns": [
      "fraction"
    ],
    "hints": [
      "Find MIN(event_date) per player, then join with Activity on date(first_login, '+1 day')."
    ]
  },
  {
    "id": "lc_570",
    "title": "16. Managers with At Least 5 Direct Reports",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 570",
    "instructions": "Return the names of managers who have at least five direct reports.",
    "schemaSql": "\nCREATE TABLE employee (id INT PRIMARY KEY, name VARCHAR(50), department VARCHAR(50), manager_id INT);\nINSERT INTO employee VALUES (101, 'John', 'A', NULL), (102, 'Dan', 'A', 101), (103, 'James', 'A', 101), (104, 'Amy', 'A', 101), (105, 'Anne', 'A', 101), (106, 'Ron', 'B', 101);",
    "tables": [
      {
        "name": "employee",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "manager_id",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 101,
            "name": "John",
            "manager_id": null
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT m.name FROM employee e JOIN employee m ON e.manager_id = m.id GROUP BY m.id, m.name HAVING COUNT(*) >= 5;",
    "expectedColumns": [
      "name"
    ],
    "hints": [
      "Self-join: connect e.manager_id to m.id, then GROUP BY m.id HAVING COUNT(*) >= 5."
    ]
  },
  {
    "id": "lc_584",
    "title": "17. Find Customer Referee",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 584",
    "instructions": "Find the names of the customer that are not referred by the customer with id = 2.",
    "schemaSql": "\nCREATE TABLE Customer (id INT PRIMARY KEY, name VARCHAR(50), referee_id INT);\nINSERT INTO Customer VALUES (1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2), (4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);",
    "tables": [
      {
        "name": "Customer",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "referee_id",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "name": "Will",
            "referee_id": null
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;",
    "expectedColumns": [
      "name"
    ],
    "hints": [
      "Remember that NULL does not satisfy != 2. Always check OR referee_id IS NULL."
    ]
  },
  {
    "id": "lc_586",
    "title": "18. Customer Placing the Largest Number of Orders",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 586",
    "instructions": "Find the customer_number for the customer who has placed the largest number of orders.",
    "schemaSql": "\nCREATE TABLE Orders (order_number INT PRIMARY KEY, customer_number INT);\nINSERT INTO Orders VALUES (1, 1), (2, 2), (3, 3), (4, 3);",
    "tables": [
      {
        "name": "Orders",
        "columns": [
          {
            "name": "order_number",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "customer_number",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "order_number": 1,
            "customer_number": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(*) DESC LIMIT 1;",
    "expectedColumns": [
      "customer_number"
    ],
    "hints": [
      "Group by customer_number, order by COUNT(*) descending, and limit to 1 row."
    ]
  },
  {
    "id": "lc_595",
    "title": "19. Big Countries",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 595",
    "instructions": "A country is big if it has an area of at least 3,000,000 km² or a population of at least 25,000,000. Return name, population, and area.",
    "schemaSql": "\nCREATE TABLE World (name VARCHAR(50) PRIMARY KEY, continent VARCHAR(30), area INT, population INT, gdp BIGINT);\nINSERT INTO World VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20343000), ('Algeria', 'Africa', 2381741, 37100000, 188681000);",
    "tables": [
      {
        "name": "World",
        "columns": [
          {
            "name": "name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "area",
            "type": "INT"
          },
          {
            "name": "population",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "name": "Afghanistan",
            "area": 652230,
            "population": 25500100
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;",
    "expectedColumns": [
      "name",
      "population",
      "area"
    ],
    "hints": [
      "Use the WHERE clause with OR operator to test both thresholds."
    ]
  },
  {
    "id": "lc_596",
    "title": "20. Classes More Than 5 Students",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 596",
    "instructions": "Find all the classes that have at least five students.",
    "schemaSql": "\nCREATE TABLE Courses (student VARCHAR(50), class VARCHAR(50));\nINSERT INTO Courses VALUES \n('A', 'Math'), ('B', 'English'), ('C', 'Math'), ('D', 'Biology'), ('E', 'Math'), ('F', 'Computer'), ('G', 'Math'), ('H', 'Math');",
    "tables": [
      {
        "name": "Courses",
        "columns": [
          {
            "name": "student",
            "type": "VARCHAR(50)"
          },
          {
            "name": "class",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "student": "A",
            "class": "Math"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT class FROM Courses GROUP BY class HAVING COUNT(student) >= 5;",
    "expectedColumns": [
      "class"
    ],
    "hints": [
      "Group by class and filter using HAVING COUNT(student) >= 5."
    ]
  },
  {
    "id": "lc_601",
    "title": "21. Human Traffic of Stadium (3+ Consecutive >= 100)",
    "difficulty": "Hard",
    "source": "LeetCode",
    "sourceId": "LeetCode 601",
    "instructions": "Find records with three or more consecutive days where the number of people visited was greater than or equal to 100.",
    "schemaSql": "\nCREATE TABLE Stadium (id INT PRIMARY KEY, visit_date DATE, people INT);\nINSERT INTO Stadium VALUES \n(1, '2017-01-01', 10), (2, '2017-01-02', 109), (3, '2017-01-03', 150), (4, '2017-01-04', 99), \n(5, '2017-01-05', 145), (6, '2017-01-06', 145), (7, '2017-01-07', 199);",
    "tables": [
      {
        "name": "Stadium",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "visit_date",
            "type": "DATE"
          },
          {
            "name": "people",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 5,
            "visit_date": "2017-01-05",
            "people": 145
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "WITH qualified AS (SELECT *, id - ROW_NUMBER() OVER (ORDER BY id) AS grp FROM Stadium WHERE people >= 100), counts AS (SELECT grp, COUNT(*) AS cnt FROM qualified GROUP BY grp HAVING cnt >= 3) SELECT q.id, q.visit_date, q.people FROM qualified q JOIN counts c ON q.grp = c.grp ORDER BY q.id;",
    "expectedColumns": [
      "id",
      "visit_date",
      "people"
    ],
    "hints": [
      "Use id - ROW_NUMBER() OVER (ORDER BY id) to group consecutive sequences."
    ]
  },
  {
    "id": "lc_607",
    "title": "22. Sales Person (No Orders for RED)",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 607",
    "instructions": "Find the names of all salespersons who did not have any orders related to the company with the name RED.",
    "schemaSql": "\nCREATE TABLE SalesPerson (sales_id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Company (com_id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Orders (order_id INT PRIMARY KEY, com_id INT, sales_id INT);\nINSERT INTO SalesPerson VALUES (1, 'John'), (2, 'Amy'), (3, 'Mark');\nINSERT INTO Company VALUES (1, 'RED'), (2, 'BLUE');\nINSERT INTO Orders VALUES (1, 1, 1), (2, 2, 2);",
    "tables": [
      {
        "name": "SalesPerson",
        "columns": [
          {
            "name": "sales_id",
            "type": "INT"
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "sales_id": 1,
            "name": "John"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT name FROM SalesPerson WHERE sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = 'RED');",
    "expectedColumns": [
      "name"
    ],
    "hints": [
      "Find sales_ids involved in company RED using a subquery and filter with NOT IN."
    ]
  },
  {
    "id": "lc_608",
    "title": "23. Tree Node Classification",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 608",
    "instructions": "Each node in the tree can be: Root (no parent), Inner (has parent and children), or Leaf (no children). Sort by id.",
    "schemaSql": "\nCREATE TABLE tree (id INT PRIMARY KEY, p_id INT);\nINSERT INTO tree VALUES (1, NULL), (2, 1), (3, 1), (4, 2), (5, 2);",
    "tables": [
      {
        "name": "tree",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "p_id",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "p_id": null
          },
          {
            "id": 2,
            "p_id": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM tree ORDER BY id;",
    "expectedColumns": [
      "id",
      "type"
    ],
    "hints": [
      "Use CASE WHEN p_id IS NULL THEN 'Root' ..."
    ]
  },
  {
    "id": "lc_619",
    "title": "24. Biggest Single Number",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 619",
    "instructions": "Find the largest single number that appears only once in the MyNumbers table. If none, return null.",
    "schemaSql": "\nCREATE TABLE MyNumbers (num INT);\nINSERT INTO MyNumbers VALUES (8), (8), (3), (3), (1), (4), (5), (6);",
    "tables": [
      {
        "name": "MyNumbers",
        "columns": [
          {
            "name": "num",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "num": 8
          },
          {
            "num": 6
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT MAX(num) AS num FROM (SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1);",
    "expectedColumns": [
      "num"
    ],
    "hints": [
      "Subquery numbers with COUNT(num) = 1, then wrap in MAX(num)."
    ]
  },
  {
    "id": "lc_620",
    "title": "25. Not Boring Movies",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 620",
    "instructions": "Report the movies with an odd-numbered ID and a description that is not boring, sorted by rating descending.",
    "schemaSql": "\nCREATE TABLE Cinema (id INT PRIMARY KEY, movie VARCHAR(50), description VARCHAR(50), rating FLOAT);\nINSERT INTO Cinema VALUES (1, 'War', 'great 3D', 8.9), (2, 'Science', 'fiction', 8.5), (3, 'Irish', 'boring', 6.2), (4, 'Ice song', 'Fantacy', 8.6), (5, 'House card', 'Interesting', 9.1);",
    "tables": [
      {
        "name": "Cinema",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          },
          {
            "name": "movie",
            "type": "VARCHAR(50)"
          },
          {
            "name": "rating",
            "type": "FLOAT"
          }
        ],
        "sampleData": [
          {
            "id": 5,
            "movie": "House card",
            "rating": 9.1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT id, movie, description, rating FROM Cinema WHERE id % 2 = 1 AND description != 'boring' ORDER BY rating DESC;",
    "expectedColumns": [
      "id",
      "movie",
      "description",
      "rating"
    ],
    "hints": [
      "Use id % 2 = 1 AND description != 'boring' ORDER BY rating DESC."
    ]
  },
  {
    "id": "lc_626",
    "title": "26. Exchange Seats",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 626",
    "instructions": "Swap the seat id of every two consecutive students. If total count is odd, the last id is not swapped.",
    "schemaSql": "\nCREATE TABLE Seat (id INT PRIMARY KEY, student VARCHAR(50));\nINSERT INTO Seat VALUES (1, 'Abbot'), (2, 'Doris'), (3, 'Emerson'), (4, 'Green'), (5, 'Jeames');",
    "tables": [
      {
        "name": "Seat",
        "columns": [
          {
            "name": "id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "student",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "student": "Abbot"
          },
          {
            "id": 2,
            "student": "Doris"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id ASC;",
    "expectedColumns": [
      "id",
      "student"
    ],
    "hints": [
      "Use CASE WHEN id % 2 = 1 AND id = total THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END."
    ]
  },
  {
    "id": "lc_1045",
    "title": "27. Customers Who Bought All Products",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1045",
    "instructions": "Report the customer ids who bought all the products present in the Product table.",
    "schemaSql": "\nCREATE TABLE Customer (customer_id INT, product_key INT);\nCREATE TABLE Product (product_key INT PRIMARY KEY);\nINSERT INTO Product VALUES (5), (6);\nINSERT INTO Customer VALUES (1, 5), (2, 6), (3, 5), (3, 6), (1, 6);",
    "tables": [
      {
        "name": "Customer",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "product_key",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "customer_id": 1,
            "product_key": 5
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT customer_id FROM Customer GROUP BY customer_id HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);",
    "expectedColumns": [
      "customer_id"
    ],
    "hints": [
      "Count distinct product_key per customer and compare to total product count in Product."
    ]
  },
  {
    "id": "lc_1050",
    "title": "28. Actors and Directors Co-Operated At Least 3 Times",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1050",
    "instructions": "Find all pairs (actor_id, director_id) where the actor has cooperated with the director at least three times.",
    "schemaSql": "\nCREATE TABLE ActorDirector (actor_id INT, director_id INT, timestamp INT);\nINSERT INTO ActorDirector VALUES (1, 1, 0), (1, 1, 1), (1, 1, 2), (1, 2, 3), (2, 1, 4);",
    "tables": [
      {
        "name": "ActorDirector",
        "columns": [
          {
            "name": "actor_id",
            "type": "INT"
          },
          {
            "name": "director_id",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "actor_id": 1,
            "director_id": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT actor_id, director_id FROM ActorDirector GROUP BY actor_id, director_id HAVING COUNT(*) >= 3;",
    "expectedColumns": [
      "actor_id",
      "director_id"
    ],
    "hints": [
      "Group by both actor_id and director_id and check HAVING COUNT(*) >= 3."
    ]
  },
  {
    "id": "lc_1070",
    "title": "29. Product Sales Analysis III",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1070",
    "instructions": "Find the first year of each product sales, including the quantity and price in that year.",
    "schemaSql": "\nCREATE TABLE Sales (sale_id INT PRIMARY KEY, product_id INT, year INT, quantity INT, price INT);\nINSERT INTO Sales VALUES (1, 100, 2008, 10, 5000), (2, 100, 2009, 12, 5000), (7, 200, 2011, 15, 9000);",
    "tables": [
      {
        "name": "Sales",
        "columns": [
          {
            "name": "product_id",
            "type": "INT"
          },
          {
            "name": "year",
            "type": "INT"
          },
          {
            "name": "quantity",
            "type": "INT"
          },
          {
            "name": "price",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "product_id": 100,
            "year": 2008,
            "quantity": 10,
            "price": 5000
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT product_id, year AS first_year, quantity, price FROM Sales WHERE (product_id, year) IN (SELECT product_id, MIN(year) FROM Sales GROUP BY product_id);",
    "expectedColumns": [
      "product_id",
      "first_year",
      "quantity",
      "price"
    ],
    "hints": [
      "Filter (product_id, year) using IN with a subquery finding MIN(year) per product."
    ]
  },
  {
    "id": "lc_1084",
    "title": "30. Sales Analysis III (Only in Q1 2019)",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1084",
    "instructions": "Find all products that were only sold in the first quarter of 2019 (between 2019-01-01 and 2019-03-31).",
    "schemaSql": "\nCREATE TABLE Product (product_id INT PRIMARY KEY, product_name VARCHAR(50));\nCREATE TABLE Sales (seller_id INT, product_id INT, sale_date DATE);\nINSERT INTO Product VALUES (1, 'S8'), (2, 'G4'), (3, 'iPhone');\nINSERT INTO Sales VALUES (1, 1, '2019-01-21'), (2, 2, '2019-02-17'), (3, 2, '2019-05-01'), (4, 3, '2019-05-13');",
    "tables": [
      {
        "name": "Product",
        "columns": [
          {
            "name": "product_id",
            "type": "INT"
          },
          {
            "name": "product_name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "product_id": 1,
            "product_name": "S8"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT p.product_id, p.product_name FROM Product p JOIN Sales s ON p.product_id = s.product_id GROUP BY p.product_id, p.product_name HAVING MIN(s.sale_date) >= '2019-01-01' AND MAX(s.sale_date) <= '2019-03-31';",
    "expectedColumns": [
      "product_id",
      "product_name"
    ],
    "hints": [
      "Check that MIN(sale_date) >= 2019-01-01 AND MAX(sale_date) <= 2019-03-31 in HAVING clause."
    ]
  },
  {
    "id": "lc_1141",
    "title": "31. User Activity for the Past 30 Days I",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1141",
    "instructions": "Find the daily active user count for a period of 30 days ending 2019-07-27 inclusively.",
    "schemaSql": "\nCREATE TABLE Activity (user_id INT, session_id INT, activity_date DATE);\nINSERT INTO Activity VALUES \n(1, 1, '2019-07-20'), (1, 2, '2019-07-20'), (2, 3, '2019-07-20'), \n(3, 4, '2019-06-25'), (4, 5, '2019-07-25');",
    "tables": [
      {
        "name": "Activity",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "activity_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "user_id": 1,
            "activity_date": "2019-07-20"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users FROM Activity WHERE activity_date BETWEEN '2019-06-28' AND '2019-07-27' GROUP BY activity_date;",
    "expectedColumns": [
      "day",
      "active_users"
    ],
    "hints": [
      "Filter activity_date BETWEEN '2019-06-28' AND '2019-07-27' and COUNT(DISTINCT user_id)."
    ]
  },
  {
    "id": "lc_1148",
    "title": "32. Article Views I",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1148",
    "instructions": "Find all the authors that viewed at least one of their own articles, sorted by id ascending.",
    "schemaSql": "\nCREATE TABLE Views (article_id INT, author_id INT, viewer_id INT, view_date DATE);\nINSERT INTO Views VALUES (1, 3, 5, '2019-08-01'), (2, 7, 7, '2019-08-01'), (2, 7, 6, '2019-08-02'), (4, 7, 1, '2019-07-22'), (3, 4, 4, '2019-07-21');",
    "tables": [
      {
        "name": "Views",
        "columns": [
          {
            "name": "author_id",
            "type": "INT"
          },
          {
            "name": "viewer_id",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "author_id": 7,
            "viewer_id": 7
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;",
    "expectedColumns": [
      "id"
    ],
    "hints": [
      "Filter WHERE author_id = viewer_id and deduplicate with DISTINCT."
    ]
  },
  {
    "id": "lc_1158",
    "title": "33. Market Analysis I",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1158",
    "instructions": "Find for each user their join date and the number of orders they made in 2019 as a buyer.",
    "schemaSql": "\nCREATE TABLE Users (user_id INT PRIMARY KEY, join_date DATE);\nCREATE TABLE Orders (order_id INT PRIMARY KEY, order_date DATE, buyer_id INT);\nINSERT INTO Users VALUES (1, '2018-01-01'), (2, '2018-02-09'), (3, '2018-01-19');\nINSERT INTO Orders VALUES (1, '2019-08-01', 1), (2, '2018-08-02', 1), (3, '2019-05-17', 2);",
    "tables": [
      {
        "name": "Users",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "join_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "user_id": 1,
            "join_date": "2018-01-01"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT u.user_id AS buyer_id, u.join_date, COUNT(o.order_id) AS orders_in_2019 FROM Users u LEFT JOIN Orders o ON u.user_id = o.buyer_id AND strftime('%Y', o.order_date) = '2019' GROUP BY u.user_id, u.join_date;",
    "expectedColumns": [
      "buyer_id",
      "join_date",
      "orders_in_2019"
    ],
    "hints": [
      "LEFT JOIN with filter condition in the ON clause: strftime('%Y', o.order_date) = '2019'."
    ]
  },
  {
    "id": "lc_1164",
    "title": "34. Product Price at a Given Date",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1164",
    "instructions": "Find the prices of all products on 2019-08-16. Assume the price before any change is 10.",
    "schemaSql": "\nCREATE TABLE Products (product_id INT, new_price INT, change_date DATE);\nINSERT INTO Products VALUES (1, 20, '2019-08-14'), (2, 50, '2019-08-14'), (1, 30, '2019-08-15'), (1, 35, '2019-08-16'), (2, 65, '2019-08-17'), (3, 20, '2019-08-18');",
    "tables": [
      {
        "name": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT"
          },
          {
            "name": "new_price",
            "type": "INT"
          },
          {
            "name": "change_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "product_id": 1,
            "new_price": 35,
            "change_date": "2019-08-16"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT product_id, new_price AS price FROM Products WHERE (product_id, change_date) IN (SELECT product_id, MAX(change_date) FROM Products WHERE change_date <= '2019-08-16' GROUP BY product_id) UNION SELECT DISTINCT product_id, 10 AS price FROM Products WHERE product_id NOT IN (SELECT product_id FROM Products WHERE change_date <= '2019-08-16');",
    "expectedColumns": [
      "product_id",
      "price"
    ],
    "hints": [
      "UNION latest prices on/before 2019-08-16 with baseline price 10 for products with no prior change."
    ]
  },
  {
    "id": "lc_1173",
    "title": "35. Immediate Food Delivery I",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1173",
    "instructions": "Find the percentage of immediate orders in the table, rounded to 2 decimal places.",
    "schemaSql": "\nCREATE TABLE Delivery (delivery_id INT PRIMARY KEY, order_date DATE, customer_pref_delivery_date DATE);\nINSERT INTO Delivery VALUES \n(1, '2019-08-01', '2019-08-02'), (2, '2019-08-02', '2019-08-02'), (3, '2019-08-11', '2019-08-12'), (4, '2019-08-24', '2019-08-24');",
    "tables": [
      {
        "name": "Delivery",
        "columns": [
          {
            "name": "delivery_id",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "DATE"
          },
          {
            "name": "customer_pref_delivery_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "delivery_id": 1,
            "order_date": "2019-08-01",
            "customer_pref_delivery_date": "2019-08-02"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT ROUND(100.0 * SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) / COUNT(*), 2) AS immediate_percentage FROM Delivery;",
    "expectedColumns": [
      "immediate_percentage"
    ],
    "hints": [
      "An order is immediate if order_date = customer_pref_delivery_date."
    ]
  },
  {
    "id": "lc_1193",
    "title": "36. Monthly Transactions by Country",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1193",
    "instructions": "For each month and country, report total transactions, approved count, total amount, and approved amount.",
    "schemaSql": "\nCREATE TABLE Transactions (id INT PRIMARY KEY, country VARCHAR(10), state VARCHAR(10), amount INT, trans_date DATE);\nINSERT INTO Transactions VALUES \n(121, 'US', 'approved', 1000, '2018-12-18'), (122, 'US', 'declined', 2000, '2018-12-19'), (123, 'US', 'approved', 2000, '2019-01-01');",
    "tables": [
      {
        "name": "Transactions",
        "columns": [
          {
            "name": "country",
            "type": "VARCHAR(10)"
          },
          {
            "name": "state",
            "type": "VARCHAR(10)"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "trans_date",
            "type": "DATE"
          }
        ],
        "sampleData": [
          {
            "country": "US",
            "state": "approved",
            "amount": 1000,
            "trans_date": "2018-12-18"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT strftime('%Y-%m', trans_date) AS month, country, COUNT(*) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;",
    "expectedColumns": [
      "month",
      "country",
      "trans_count",
      "approved_count",
      "trans_total_amount",
      "approved_total_amount"
    ],
    "hints": [
      "Use strftime(%Y-%m, trans_date) and conditional aggregation with SUM(CASE WHEN state = approved)."
    ]
  },
  {
    "id": "lc_1204",
    "title": "37. Last Person to Fit in the Bus",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1204",
    "instructions": "The bus holds at most 1000 kg. Return the name of the last person who fits on the bus without exceeding 1000 kg.",
    "schemaSql": "\nCREATE TABLE Queue (person_id INT PRIMARY KEY, person_name VARCHAR(50), weight INT, turn INT);\nINSERT INTO Queue VALUES \n(5, 'Alice', 250, 1), (4, 'Bob', 175, 2), (3, 'Alex', 350, 3), (6, 'John Cena', 400, 4), (1, 'Winston', 500, 5);",
    "tables": [
      {
        "name": "Queue",
        "columns": [
          {
            "name": "person_name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "weight",
            "type": "INT"
          },
          {
            "name": "turn",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "person_name": "Alice",
            "weight": 250,
            "turn": 1
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "WITH running AS (SELECT person_name, SUM(weight) OVER (ORDER BY turn) AS total_weight FROM Queue) SELECT person_name FROM running WHERE total_weight <= 1000 ORDER BY total_weight DESC LIMIT 1;",
    "expectedColumns": [
      "person_name"
    ],
    "hints": [
      "Calculate SUM(weight) OVER (ORDER BY turn), filter <= 1000, and pick the last one."
    ]
  },
  {
    "id": "lc_1211",
    "title": "38. Queries Quality and Percentage",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1211",
    "instructions": "Find the quality (average of rating/position) and poor query percentage (rating < 3) for each query_name, rounded to 2 decimals.",
    "schemaSql": "\nCREATE TABLE Queries (query_name VARCHAR(50), result VARCHAR(50), position INT, rating INT);\nINSERT INTO Queries VALUES \n('Dog', 'Golden Retriever', 1, 5), ('Dog', 'German Shepherd', 2, 5), ('Dog', 'Mule', 200, 1), \n('Cat', 'Shirazi', 5, 2), ('Cat', 'Siamese', 3, 3);",
    "tables": [
      {
        "name": "Queries",
        "columns": [
          {
            "name": "query_name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "position",
            "type": "INT"
          },
          {
            "name": "rating",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "query_name": "Dog",
            "position": 1,
            "rating": 5
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT query_name, ROUND(AVG(CAST(rating AS FLOAT) / position), 2) AS quality, ROUND(100.0 * SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) / COUNT(*), 2) AS poor_query_percentage FROM Queries GROUP BY query_name;",
    "expectedColumns": [
      "query_name",
      "quality",
      "poor_query_percentage"
    ],
    "hints": [
      "Cast rating to float before dividing by position, and compute poor queries using CASE WHEN rating < 3."
    ]
  },
  {
    "id": "lc_1251",
    "title": "39. Average Selling Price",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1251",
    "instructions": "Find the average selling price for each product. Round to 2 decimals.",
    "schemaSql": "\nCREATE TABLE Prices (product_id INT, start_date DATE, end_date DATE, price INT);\nCREATE TABLE UnitsSold (product_id INT, purchase_date DATE, units INT);\nINSERT INTO Prices VALUES (1, '2019-02-17', '2019-02-28', 5), (1, '2019-03-01', '2019-03-22', 20);\nINSERT INTO UnitsSold VALUES (1, '2019-02-25', 100), (1, '2019-03-01', 15);",
    "tables": [
      {
        "name": "Prices",
        "columns": [
          {
            "name": "product_id",
            "type": "INT"
          },
          {
            "name": "price",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "product_id": 1,
            "price": 5
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT p.product_id, IFNULL(ROUND(CAST(SUM(p.price * u.units) AS FLOAT) / SUM(u.units), 2), 0) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;",
    "expectedColumns": [
      "product_id",
      "average_price"
    ],
    "hints": [
      "Join on product_id AND purchase_date BETWEEN start_date and end_date. Compute SUM(price*units)/SUM(units)."
    ]
  },
  {
    "id": "lc_1280",
    "title": "40. Students and Examinations",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1280",
    "instructions": "Find the number of times each student attended each exam. Order by student_id, subject_name.",
    "schemaSql": "\nCREATE TABLE Students (student_id INT PRIMARY KEY, student_name VARCHAR(50));\nCREATE TABLE Subjects (subject_name VARCHAR(50) PRIMARY KEY);\nCREATE TABLE Examinations (student_id INT, subject_name VARCHAR(50));\nINSERT INTO Students VALUES (1, 'Alice'), (2, 'Bob'), (13, 'John');\nINSERT INTO Subjects VALUES ('Math'), ('Physics'), ('Programming');\nINSERT INTO Examinations VALUES (1, 'Math'), (1, 'Physics'), (1, 'Programming'), (2, 'Programming');",
    "tables": [
      {
        "name": "Students",
        "columns": [
          {
            "name": "student_id",
            "type": "INT"
          },
          {
            "name": "student_name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "student_id": 1,
            "student_name": "Alice"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT s.student_id, s.student_name, sub.subject_name, COUNT(e.subject_name) AS attended_exams FROM Students s CROSS JOIN Subjects sub LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name GROUP BY s.student_id, s.student_name, sub.subject_name ORDER BY s.student_id, sub.subject_name;",
    "expectedColumns": [
      "student_id",
      "student_name",
      "subject_name",
      "attended_exams"
    ],
    "hints": [
      "CROSS JOIN Students with Subjects so every combination exists, then LEFT JOIN Examinations and COUNT."
    ]
  },
  {
    "id": "lc_1321",
    "title": "41. Restaurant Growth (7-Day Moving Total & Average)",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1321",
    "instructions": "Compute the moving average of how much customers paid in a 7-day window (current day + 6 previous days). Round to 2 decimals.",
    "schemaSql": "\nCREATE TABLE Customer (customer_id INT, name VARCHAR(50), visited_on DATE, amount INT);\nINSERT INTO Customer VALUES \n(1, 'J', '2019-01-01', 100), (2, 'D', '2019-01-02', 110), (3, 'A', '2019-01-03', 120),\n(4, 'C', '2019-01-04', 130), (5, 'W', '2019-01-05', 110), (6, 'K', '2019-01-06', 140),\n(7, 'M', '2019-01-07', 150), (8, 'R', '2019-01-08', 80);",
    "tables": [
      {
        "name": "Customer",
        "columns": [
          {
            "name": "visited_on",
            "type": "DATE"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "visited_on": "2019-01-01",
            "amount": 100
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "WITH daily AS (SELECT visited_on, SUM(amount) AS daily_amount FROM Customer GROUP BY visited_on), rolling AS (SELECT visited_on, SUM(daily_amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount, ROUND(AVG(daily_amount) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS average_amount, ROW_NUMBER() OVER (ORDER BY visited_on) AS rn FROM daily) SELECT visited_on, amount, average_amount FROM rolling WHERE rn >= 7;",
    "expectedColumns": [
      "visited_on",
      "amount",
      "average_amount"
    ],
    "hints": [
      "First aggregate amounts by visited_on, then apply ROWS BETWEEN 6 PRECEDING AND CURRENT ROW, and filter where row count >= 7."
    ]
  },
  {
    "id": "lc_1327",
    "title": "42. Products Ordered in a Period (>= 100 units)",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1327",
    "instructions": "Find the product names and total units ordered in February 2020 that have at least 100 units.",
    "schemaSql": "\nCREATE TABLE Products (product_id INT PRIMARY KEY, product_name VARCHAR(50));\nCREATE TABLE Orders (product_id INT, order_date DATE, unit INT);\nINSERT INTO Products VALUES (1, 'Leetcode Solutions'), (2, 'Jewelry'), (3, 'Book');\nINSERT INTO Orders VALUES (1, '2020-02-10', 60), (1, '2020-02-15', 70), (2, '2020-02-18', 30), (3, '2020-03-01', 120);",
    "tables": [
      {
        "name": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT"
          },
          {
            "name": "product_name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "product_id": 1,
            "product_name": "Leetcode Solutions"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT p.product_name, SUM(o.unit) AS unit FROM Products p JOIN Orders o ON p.product_id = o.product_id WHERE o.order_date BETWEEN '2020-02-01' AND '2020-02-29' GROUP BY p.product_name HAVING SUM(o.unit) >= 100;",
    "expectedColumns": [
      "product_name",
      "unit"
    ],
    "hints": [
      "Join on product_id, filter date in Feb 2020, and GROUP BY product_name HAVING SUM(unit) >= 100."
    ]
  },
  {
    "id": "lc_1341",
    "title": "43. Movie Rating Top Contributor & Best Film",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1341",
    "instructions": "Find the user who rated the greatest number of movies (lexicographically smallest on tie), and the movie with the highest average rating in Feb 2020.",
    "schemaSql": "\nCREATE TABLE Movies (movie_id INT PRIMARY KEY, title VARCHAR(50));\nCREATE TABLE Users (user_id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE MovieRating (movie_id INT, user_id INT, rating INT, created_at DATE);\nINSERT INTO Movies VALUES (1, 'Avengers'), (2, 'Frozen 2');\nINSERT INTO Users VALUES (1, 'Daniel'), (2, 'Monica');\nINSERT INTO MovieRating VALUES (1, 1, 4, '2020-02-25'), (1, 2, 5, '2020-02-25'), (2, 1, 5, '2020-02-15');",
    "tables": [
      {
        "name": "Movies",
        "columns": [
          {
            "name": "movie_id",
            "type": "INT"
          },
          {
            "name": "title",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "movie_id": 1,
            "title": "Avengers"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT name AS results FROM (SELECT u.name FROM Users u JOIN MovieRating mr ON u.user_id = mr.user_id GROUP BY u.user_id, u.name ORDER BY COUNT(*) DESC, u.name ASC LIMIT 1) UNION ALL SELECT title AS results FROM (SELECT m.title FROM Movies m JOIN MovieRating mr ON m.movie_id = mr.movie_id WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29' GROUP BY m.movie_id, m.title ORDER BY AVG(mr.rating) DESC, m.title ASC LIMIT 1);",
    "expectedColumns": [
      "results"
    ],
    "hints": [
      "Combine two queries with UNION ALL, ordering each subquery with LIMIT 1."
    ]
  },
  {
    "id": "lc_1378",
    "title": "44. Replace Employee ID with Unique Identifier",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1378",
    "instructions": "Show the unique ID of each user. If an employee does not have a unique ID, show null.",
    "schemaSql": "\nCREATE TABLE Employees (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE EmployeeUNI (id INT PRIMARY KEY, unique_id INT);\nINSERT INTO Employees VALUES (1, 'Alice'), (7, 'Bob'), (11, 'Meir');\nINSERT INTO EmployeeUNI VALUES (2, 3), (7, 1);",
    "tables": [
      {
        "name": "Employees",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "name": "Alice"
          },
          {
            "id": 7,
            "name": "Bob"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT eu.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI eu ON e.id = eu.id;",
    "expectedColumns": [
      "unique_id",
      "name"
    ],
    "hints": [
      "Use a LEFT JOIN from Employees to EmployeeUNI on id."
    ]
  },
  {
    "id": "lc_1393",
    "title": "45. Capital Gain / Loss",
    "difficulty": "Medium",
    "source": "LeetCode",
    "sourceId": "LeetCode 1393",
    "instructions": "Report the capital gain/loss for each stock (selling price minus buying price).",
    "schemaSql": "\nCREATE TABLE Stocks (stock_name VARCHAR(50), operation VARCHAR(10), operation_day INT, price INT);\nINSERT INTO Stocks VALUES \n('Leetcode', 'Buy', 1, 1000), ('Corona Masks', 'Buy', 2, 10), \n('Leetcode', 'Sell', 5, 9000), ('Corona Masks', 'Sell', 3, 1010);",
    "tables": [
      {
        "name": "Stocks",
        "columns": [
          {
            "name": "stock_name",
            "type": "VARCHAR(50)"
          },
          {
            "name": "operation",
            "type": "VARCHAR(10)"
          },
          {
            "name": "price",
            "type": "INT"
          }
        ],
        "sampleData": [
          {
            "stock_name": "Leetcode",
            "operation": "Buy",
            "price": 1000
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT stock_name, SUM(CASE WHEN operation = 'Sell' THEN price ELSE -price END) AS capital_gain_loss FROM Stocks GROUP BY stock_name;",
    "expectedColumns": [
      "stock_name",
      "capital_gain_loss"
    ],
    "hints": [
      "Use conditional SUM: SUM(CASE WHEN operation = 'Sell' THEN price ELSE -price END)."
    ]
  },
  {
    "id": "lc_1407",
    "title": "46. Top Travellers",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1407",
    "instructions": "Report the distance traveled by each user. Sort by distance descending, then by name ascending.",
    "schemaSql": "\nCREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE Rides (id INT PRIMARY KEY, user_id INT, distance INT);\nINSERT INTO Users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Alex');\nINSERT INTO Rides VALUES (1, 1, 120), (2, 2, 317), (3, 3, 222), (4, 1, 50);",
    "tables": [
      {
        "name": "Users",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "id": 1,
            "name": "Alice"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT u.name, IFNULL(SUM(r.distance), 0) AS travelled_distance FROM Users u LEFT JOIN Rides r ON u.id = r.user_id GROUP BY u.id, u.name ORDER BY travelled_distance DESC, u.name ASC;",
    "expectedColumns": [
      "name",
      "travelled_distance"
    ],
    "hints": [
      "LEFT JOIN Users with Rides, replace NULL distance with 0, and ORDER BY distance DESC, name ASC."
    ]
  },
  {
    "id": "lc_1633",
    "title": "47. Percentage of Users Attended a Contest",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1633",
    "instructions": "Find the percentage of users registered for each contest, rounded to 2 decimals. Order by percentage DESC, contest_id ASC.",
    "schemaSql": "\nCREATE TABLE Users (user_id INT PRIMARY KEY, user_name VARCHAR(50));\nCREATE TABLE Register (contest_id INT, user_id INT);\nINSERT INTO Users VALUES (6, 'Alice'), (2, 'Bob'), (7, 'Alex');\nINSERT INTO Register VALUES (215, 6), (209, 2), (208, 6), (208, 2), (208, 7);",
    "tables": [
      {
        "name": "Users",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "user_name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "user_id": 6,
            "user_name": "Alice"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT contest_id, ROUND(100.0 * COUNT(DISTINCT user_id) / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;",
    "expectedColumns": [
      "contest_id",
      "percentage"
    ],
    "hints": [
      "Divide COUNT(DISTINCT user_id) by a scalar subquery of total users in Users table."
    ]
  },
  {
    "id": "lc_1661",
    "title": "48. Average Time of Process per Machine",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1661",
    "instructions": "Calculate the average processing time for each machine rounded to 3 decimals.",
    "schemaSql": "\nCREATE TABLE Activity (machine_id INT, process_id INT, activity_type VARCHAR(10), timestamp FLOAT);\nINSERT INTO Activity VALUES \n(0, 0, 'start', 0.712), (0, 0, 'end', 1.520), (0, 1, 'start', 3.140), (0, 1, 'end', 4.120),\n(1, 0, 'start', 0.550), (1, 0, 'end', 1.550);",
    "tables": [
      {
        "name": "Activity",
        "columns": [
          {
            "name": "machine_id",
            "type": "INT"
          },
          {
            "name": "process_id",
            "type": "INT"
          },
          {
            "name": "activity_type",
            "type": "VARCHAR(10)"
          },
          {
            "name": "timestamp",
            "type": "FLOAT"
          }
        ],
        "sampleData": [
          {
            "machine_id": 0,
            "process_id": 0,
            "activity_type": "start",
            "timestamp": 0.712
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT a1.machine_id, ROUND(AVG(a2.timestamp - a1.timestamp), 3) AS processing_time FROM Activity a1 JOIN Activity a2 ON a1.machine_id = a2.machine_id AND a1.process_id = a2.process_id AND a1.activity_type = 'start' AND a2.activity_type = 'end' GROUP BY a1.machine_id;",
    "expectedColumns": [
      "machine_id",
      "processing_time"
    ],
    "hints": [
      "Self-join Activity where a1 is 'start' and a2 is 'end', then compute AVG(a2.timestamp - a1.timestamp)."
    ]
  },
  {
    "id": "lc_1667",
    "title": "49. Fix Names in a Table (Capitalize First Letter)",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1667",
    "instructions": "Fix names so that only the first character is uppercase and the rest are lowercase. Order by user_id.",
    "schemaSql": "\nCREATE TABLE Users (user_id INT PRIMARY KEY, name VARCHAR(50));\nINSERT INTO Users VALUES (1, 'aLice'), (2, 'bOB');",
    "tables": [
      {
        "name": "Users",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "name",
            "type": "VARCHAR(50)"
          }
        ],
        "sampleData": [
          {
            "user_id": 1,
            "name": "aLice"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT user_id, UPPER(SUBSTR(name, 1, 1)) || LOWER(SUBSTR(name, 2)) AS name FROM Users ORDER BY user_id ASC;",
    "expectedColumns": [
      "user_id",
      "name"
    ],
    "hints": [
      "In SQLite, concatenate with ||: UPPER(SUBSTR(name, 1, 1)) || LOWER(SUBSTR(name, 2))."
    ]
  },
  {
    "id": "lc_1757",
    "title": "50. Recyclable and Low Fat Products",
    "difficulty": "Easy",
    "source": "LeetCode",
    "sourceId": "LeetCode 1757",
    "instructions": "Find the IDs of products that are both low fat (low_fats = Y) and recyclable (recyclable = Y).",
    "schemaSql": "\nCREATE TABLE Products (product_id INT PRIMARY KEY, low_fats CHAR(1), recyclable CHAR(1));\nINSERT INTO Products VALUES (0, 'Y', 'N'), (1, 'Y', 'Y'), (2, 'N', 'Y'), (3, 'Y', 'Y'), (4, 'N', 'N');",
    "tables": [
      {
        "name": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT",
            "isPk": true
          },
          {
            "name": "low_fats",
            "type": "CHAR(1)"
          },
          {
            "name": "recyclable",
            "type": "CHAR(1)"
          }
        ],
        "sampleData": [
          {
            "product_id": 1,
            "low_fats": "Y",
            "recyclable": "Y"
          }
        ]
      }
    ],
    "starterSql": "",
    "solutionSql": "SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y';",
    "expectedColumns": [
      "product_id"
    ],
    "hints": [
      "Use WHERE low_fats = 'Y' AND recyclable = 'Y'."
    ]
  }
];
