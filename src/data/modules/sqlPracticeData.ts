// SQL Practice Arena & Knowledge Banks
// Datasets:
// 1. Hospital Database (sql-practice.com complete 20-exercise set)
// 2. Northwind Database (sql-practice.com complete set)
// 3. W3Resource Sales & Inventory Database (w3resource classic collection: Retrieve, Joins, Aggregates, Subqueries)

export type PracticeDatabaseType = 'hospital' | 'northwind' | 'w3resource';

export interface PracticeTableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
  nullable?: boolean;
}

export interface PracticeTableSchema {
  tableName: string;
  description: string;
  columns: PracticeTableColumn[];
}

export interface PracticeQuestion {
  id: string;
  database: PracticeDatabaseType;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  title: string;
  description: string;
  hint: string;
  starterSql: string;
  solutionSql: string;
  tags: string[];
}

// -------------------------------------------------------------
// 1. HOSPITAL DATABASE (sql-practice.com)
// -------------------------------------------------------------

export const HOSPITAL_SCHEMAS: PracticeTableSchema[] = [
  {
    tableName: 'patients',
    description: 'Demographics and physical metrics of registered hospital patients',
    columns: [
      { name: 'patient_id', type: 'INT', isPk: true },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'gender', type: 'CHAR(1)' },
      { name: 'birth_date', type: 'DATE' },
      { name: 'city', type: 'TEXT' },
      { name: 'province_id', type: 'CHAR(2)', isFk: true, fkRef: 'province_names.province_id' },
      { name: 'allergies', type: 'TEXT', nullable: true },
      { name: 'height', type: 'INT' },
      { name: 'weight', type: 'INT' },
    ],
  },
  {
    tableName: 'admissions',
    description: 'Records of inpatient visits, admissions, diagnoses, and attending doctors',
    columns: [
      { name: 'patient_id', type: 'INT', isFk: true, fkRef: 'patients.patient_id' },
      { name: 'admission_date', type: 'DATE' },
      { name: 'discharge_date', type: 'DATE', nullable: true },
      { name: 'diagnosis', type: 'TEXT' },
      { name: 'attending_doctor_id', type: 'INT', isFk: true, fkRef: 'doctors.doctor_id' },
    ],
  },
  {
    tableName: 'doctors',
    description: 'List of licensed medical physicians and their specialties',
    columns: [
      { name: 'doctor_id', type: 'INT', isPk: true },
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'specialty', type: 'TEXT' },
    ],
  },
  {
    tableName: 'province_names',
    description: 'Lookup table of state/provincial codes and regional names',
    columns: [
      { name: 'province_id', type: 'CHAR(2)', isPk: true },
      { name: 'province_name', type: 'TEXT' },
    ],
  },
];

export const HOSPITAL_SEED_SQL = `
DROP TABLE IF EXISTS admissions;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS province_names;

CREATE TABLE province_names (
  province_id CHAR(2) PRIMARY KEY,
  province_name TEXT NOT NULL
);

INSERT INTO province_names (province_id, province_name) VALUES
('ON', 'Ontario'),
('BC', 'British Columbia'),
('AB', 'Alberta'),
('QC', 'Quebec'),
('NS', 'Nova Scotia');

CREATE TABLE doctors (
  doctor_id INT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL
);

INSERT INTO doctors (doctor_id, first_name, last_name, specialty) VALUES
(1, 'Sophia', 'Miller', 'Cardiology'),
(2, 'James', 'Wilson', 'Pediatrics'),
(3, 'Emma', 'Brown', 'Neurology'),
(4, 'Liam', 'Davis', 'Oncology'),
(5, 'Olivia', 'Garcia', 'General Surgery');

CREATE TABLE patients (
  patient_id INT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender CHAR(1) NOT NULL,
  birth_date DATE NOT NULL,
  city TEXT NOT NULL,
  province_id CHAR(2) NOT NULL,
  allergies TEXT,
  height INT NOT NULL,
  weight INT NOT NULL,
  FOREIGN KEY (province_id) REFERENCES province_names(province_id)
);

INSERT INTO patients (patient_id, first_name, last_name, gender, birth_date, city, province_id, allergies, height, weight) VALUES
(1, 'John', 'Doe', 'M', '1985-04-12', 'Toronto', 'ON', 'Penicillin', 178, 82),
(2, 'Jane', 'Smith', 'F', '1992-09-24', 'Vancouver', 'BC', NULL, 165, 61),
(3, 'Michael', 'Johnson', 'M', '1978-11-03', 'Calgary', 'AB', 'Peanuts', 185, 94),
(4, 'Emily', 'Williams', 'F', '2001-02-17', 'Montreal', 'QC', NULL, 170, 58),
(5, 'David', 'Brown', 'M', '1965-06-30', 'Toronto', 'ON', 'Sulfa', 172, 88),
(6, 'Sarah', 'Miller', 'F', '1990-12-15', 'Halifax', 'NS', 'Pollen', 162, 54),
(7, 'Robert', 'Taylor', 'M', '1982-08-08', 'Hamilton', 'ON', NULL, 180, 79),
(8, 'Jessica', 'Anderson', 'F', '1995-03-21', 'Victoria', 'BC', 'Aspirin', 168, 65),
(9, 'William', 'Thomas', 'M', '1959-10-10', 'Toronto', 'ON', 'Codeine', 175, 85),
(10, 'Ashley', 'Jackson', 'F', '1988-07-04', 'Calgary', 'AB', NULL, 160, 52),
(11, 'Christopher', 'Lee', 'M', '1994-01-22', 'Vancouver', 'BC', 'Penicillin', 181, 78),
(12, 'Amanda', 'White', 'F', '2010-05-18', 'Toronto', 'ON', NULL, 155, 48),
(13, 'Matthew', 'Harris', 'M', '2010-09-09', 'Hamilton', 'ON', 'Sulfa', 158, 50),
(14, 'Olivia', 'Martin', 'F', '1999-11-20', 'Calgary', 'AB', 'Morphine', 167, 63);

CREATE TABLE admissions (
  patient_id INT NOT NULL,
  admission_date DATE NOT NULL,
  discharge_date DATE,
  diagnosis TEXT NOT NULL,
  attending_doctor_id INT NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (attending_doctor_id) REFERENCES doctors(doctor_id)
);

INSERT INTO admissions (patient_id, admission_date, discharge_date, diagnosis, attending_doctor_id) VALUES
(1, '2023-01-10', '2023-01-14', 'Acute Appendicitis', 5),
(2, '2023-01-15', '2023-01-18', 'Arrhythmia', 1),
(3, '2023-02-01', '2023-02-10', 'Concussion', 3),
(1, '2023-03-05', '2023-03-09', 'Hypertension Evaluation', 1),
(4, '2023-03-12', '2023-03-14', 'Bronchitis', 2),
(5, '2023-04-02', '2023-04-12', 'Lymphoma Checkup', 4),
(6, '2023-04-18', '2023-04-20', 'Severe Asthma', 2),
(7, '2023-05-01', '2023-05-05', 'Hernia Repair', 5),
(8, '2023-05-15', '2023-05-19', 'Migraine with Aura', 3),
(9, '2023-06-01', '2023-06-07', 'Coronary Artery Disease', 1),
(10, '2023-06-14', '2023-06-16', 'Pneumonia', 2),
(1, '2023-07-01', '2023-07-03', 'Food Poisoning', 5),
(3, '2023-08-11', '2023-08-15', 'Fractured Fibula', 5);
`;

export const HOSPITAL_QUESTIONS: PracticeQuestion[] = [
  // --- EASY ---
  {
    id: 'hosp-easy-1',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Filtering',
    title: 'Show first and last name of female patients',
    description: "Show first name and last name of all patients whose gender is 'F'.",
    hint: "Use WHERE gender = 'F' and project first_name, last_name.",
    starterSql: 'SELECT first_name, last_name FROM patients WHERE ...;',
    solutionSql: "SELECT first_name, last_name FROM patients WHERE gender = 'F';",
    tags: ['SELECT', 'WHERE', 'Filtering'],
  },
  {
    id: 'hosp-easy-2',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Filtering',
    title: 'Patients with no listed allergies',
    description: 'Show first and last name of patients that do NOT have any allergies listed (allergies is NULL).',
    hint: "Use the 'IS NULL' operator rather than '= NULL'.",
    starterSql: 'SELECT first_name, last_name FROM patients WHERE ...;',
    solutionSql: 'SELECT first_name, last_name FROM patients WHERE allergies IS NULL;',
    tags: ['IS NULL', 'Filtering'],
  },
  {
    id: 'hosp-easy-3',
    database: 'hospital',
    difficulty: 'easy',
    category: 'String Matching',
    title: 'Patients with first name starting with C',
    description: "Show first name of all patients whose first_name starts with the letter 'C'.",
    hint: "Use the LIKE operator with 'C%'.",
    starterSql: 'SELECT first_name FROM patients WHERE ...;',
    solutionSql: "SELECT first_name FROM patients WHERE first_name LIKE 'C%';",
    tags: ['LIKE', 'Wildcards'],
  },
  {
    id: 'hosp-easy-4',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Ranges',
    title: 'Patients with weight between 50 and 70',
    description: 'Show first_name, last_name, and weight of all patients whose weight is within 50 and 70 inclusive.',
    hint: 'Use the BETWEEN operator on weight.',
    starterSql: 'SELECT first_name, last_name, weight FROM patients WHERE ...;',
    solutionSql: 'SELECT first_name, last_name, weight FROM patients WHERE weight BETWEEN 50 AND 70;',
    tags: ['BETWEEN', 'Numbers'],
  },
  {
    id: 'hosp-easy-5',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Ordering',
    title: 'Youngest patient birth date',
    description: 'Show the first_name, last_name, and birth_date of the patient who has the most recent birth_date (the youngest patient).',
    hint: 'ORDER BY birth_date DESC LIMIT 1.',
    starterSql: 'SELECT first_name, last_name, birth_date FROM patients ORDER BY ... LIMIT 1;',
    solutionSql: 'SELECT first_name, last_name, birth_date FROM patients ORDER BY birth_date DESC LIMIT 1;',
    tags: ['ORDER BY', 'LIMIT'],
  },
  {
    id: 'hosp-easy-6',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Aggregation',
    title: 'Count patients born in 2010',
    description: 'Show the total count of patients who were born in the year 2010.',
    hint: "Use LIKE '2010%' on birth_date or SUBSTR(birth_date, 1, 4) = '2010'.",
    starterSql: 'SELECT COUNT(*) FROM patients WHERE ...;',
    solutionSql: "SELECT COUNT(*) FROM patients WHERE birth_date LIKE '2010%';",
    tags: ['COUNT', 'Dates'],
  },
  {
    id: 'hosp-easy-7',
    database: 'hospital',
    difficulty: 'easy',
    category: 'Null Handling',
    title: 'Replace null allergies with NKA',
    description: "Show first_name, last_name, and allergies. If allergies is NULL, display 'NKA' (No Known Allergies) using COALESCE.",
    hint: "COALESCE(allergies, 'NKA') AS allergies.",
    starterSql: 'SELECT first_name, last_name, COALESCE(...) AS allergies FROM patients;',
    solutionSql: "SELECT first_name, last_name, COALESCE(allergies, 'NKA') AS allergies FROM patients;",
    tags: ['COALESCE', 'Functions'],
  },

  // --- MEDIUM ---
  {
    id: 'hosp-med-1',
    database: 'hospital',
    difficulty: 'medium',
    category: 'Grouping',
    title: 'Count patients per province',
    description: 'Show the province_name alongside the total count of patients in each province. Order by patient count descending.',
    hint: 'JOIN patients with province_names on province_id, GROUP BY province_name, and use COUNT(*).',
    starterSql: 'SELECT pn.province_name, COUNT(*) as patient_count FROM patients p JOIN ... GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT pn.province_name, COUNT(p.patient_id) as patient_count FROM patients p JOIN province_names pn ON p.province_id = pn.province_id GROUP BY pn.province_name ORDER BY patient_count DESC;',
    tags: ['JOIN', 'GROUP BY', 'Aggregates'],
  },
  {
    id: 'hosp-med-2',
    database: 'hospital',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Admissions with attending doctor name and specialty',
    description: "Show patient_id, diagnosis, doctor's full name (concatenated as first_name || ' ' || last_name as doctor_name), and their specialty for all admissions.",
    hint: 'Join admissions with doctors using attending_doctor_id = doctor_id.',
    starterSql: 'SELECT a.patient_id, a.diagnosis, (d.first_name || \' \' || d.last_name) AS doctor_name, d.specialty FROM admissions a JOIN ...',
    solutionSql: "SELECT a.patient_id, a.diagnosis, (d.first_name || ' ' || d.last_name) AS doctor_name, d.specialty FROM admissions a JOIN doctors d ON a.attending_doctor_id = d.doctor_id;",
    tags: ['JOIN', 'String Concatenation'],
  },
  {
    id: 'hosp-med-3',
    database: 'hospital',
    difficulty: 'medium',
    category: 'Filtering & IN',
    title: 'Patients with Penicillin or Morphine allergy',
    description: "Show first_name, last_name, and allergies for patients allergic to either 'Penicillin' or 'Morphine'. Order by allergies ASC, then first_name ASC.",
    hint: "Use WHERE allergies IN ('Penicillin', 'Morphine') ORDER BY allergies ASC, first_name ASC.",
    starterSql: 'SELECT first_name, last_name, allergies FROM patients WHERE ... ORDER BY ...;',
    solutionSql: "SELECT first_name, last_name, allergies FROM patients WHERE allergies IN ('Penicillin', 'Morphine') ORDER BY allergies ASC, first_name ASC;",
    tags: ['IN', 'ORDER BY'],
  },
  {
    id: 'hosp-med-4',
    database: 'hospital',
    difficulty: 'medium',
    category: 'Case Expressions',
    title: 'BMI and Obese Classification',
    description: 'Show patient_id, weight, height, and is_obese (1 if weight / (height/100.0)^2 >= 30, else 0).',
    hint: 'Use CASE WHEN (weight / ((height/100.0) * (height/100.0))) >= 30 THEN 1 ELSE 0 END.',
    starterSql: 'SELECT patient_id, weight, height, CASE WHEN ... END as is_obese FROM patients;',
    solutionSql: 'SELECT patient_id, weight, height, CASE WHEN (weight / ((height / 100.0) * (height / 100.0))) >= 30 THEN 1 ELSE 0 END as is_obese FROM patients;',
    tags: ['CASE', 'Math', 'Classification'],
  },

  // --- HARD ---
  {
    id: 'hosp-hard-1',
    database: 'hospital',
    difficulty: 'hard',
    category: 'Having & Aggregation',
    title: 'Patients with multiple admissions',
    description: 'Find the first_name, last_name, and total count of admissions for patients who have been admitted more than 1 time. Order by admission count descending.',
    hint: 'JOIN patients with admissions, GROUP BY p.patient_id, p.first_name, p.last_name, and filter using HAVING count > 1.',
    starterSql: 'SELECT p.first_name, p.last_name, COUNT(a.admission_date) as admission_count FROM patients p ... GROUP BY ... HAVING ...',
    solutionSql: 'SELECT p.first_name, p.last_name, COUNT(a.admission_date) as admission_count FROM patients p JOIN admissions a ON p.patient_id = a.patient_id GROUP BY p.patient_id, p.first_name, p.last_name HAVING COUNT(a.admission_date) > 1 ORDER BY admission_count DESC;',
    tags: ['HAVING', 'GROUP BY', 'Aggregates', 'JOIN'],
  },
  {
    id: 'hosp-hard-2',
    database: 'hospital',
    difficulty: 'hard',
    category: 'Bucketing',
    title: 'Patients grouped into 10-unit weight buckets',
    description: 'Show patients grouped into weight groups ((weight / 10) * 10 as weight_group) and the count of patients in each group. Order by weight_group DESC.',
    hint: 'Use (weight / 10) * 10 as weight_group and GROUP BY weight_group ORDER BY weight_group DESC.',
    starterSql: 'SELECT (weight / 10) * 10 as weight_group, COUNT(*) as patient_count FROM patients GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT (weight / 10) * 10 as weight_group, COUNT(*) as patient_count FROM patients GROUP BY weight_group ORDER BY weight_group DESC;',
    tags: ['Bucketing', 'GROUP BY', 'Math'],
  },
  {
    id: 'hosp-hard-3',
    database: 'hospital',
    difficulty: 'hard',
    category: 'Conditional Aggregation',
    title: 'Insurance Cost Calculation by Even/Odd ID',
    description: "Even patient_ids have insurance ($10 cost), odd have no insurance ($50 cost). Group by has_insurance ('Yes'/'No') and show total cost.",
    hint: "Use CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END as has_insurance, and SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) as total_cost.",
    starterSql: 'SELECT CASE WHEN patient_id % 2 = 0 THEN \'Yes\' ELSE \'No\' END as has_insurance, SUM(...) FROM admissions GROUP BY ...;',
    solutionSql: "SELECT CASE WHEN patient_id % 2 = 0 THEN 'Yes' ELSE 'No' END as has_insurance, SUM(CASE WHEN patient_id % 2 = 0 THEN 10 ELSE 50 END) as total_cost FROM admissions GROUP BY has_insurance;",
    tags: ['CASE', 'SUM', 'Conditional Aggregation'],
  },
];

// -------------------------------------------------------------
// 2. NORTHWIND DATABASE (sql-practice.com)
// -------------------------------------------------------------

export const NORTHWIND_SCHEMAS: PracticeTableSchema[] = [
  {
    tableName: 'customers',
    description: 'Northwind global business clients, companies, and contact titles',
    columns: [
      { name: 'customer_id', type: 'TEXT', isPk: true },
      { name: 'company_name', type: 'TEXT' },
      { name: 'contact_name', type: 'TEXT' },
      { name: 'contact_title', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
    ],
  },
  {
    tableName: 'categories',
    description: 'Product categorization departments (Beverages, Confections, etc.)',
    columns: [
      { name: 'category_id', type: 'INT', isPk: true },
      { name: 'category_name', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
    ],
  },
  {
    tableName: 'products',
    description: 'Inventory items, unit prices, supplier references, and discontinued flags',
    columns: [
      { name: 'product_id', type: 'INT', isPk: true },
      { name: 'product_name', type: 'TEXT' },
      { name: 'category_id', type: 'INT', isFk: true, fkRef: 'categories.category_id' },
      { name: 'unit_price', type: 'NUMERIC' },
      { name: 'units_in_stock', type: 'INT' },
      { name: 'discontinued', type: 'INT' },
    ],
  },
  {
    tableName: 'orders',
    description: 'Sales order transaction headers, customer links, and order dates',
    columns: [
      { name: 'order_id', type: 'INT', isPk: true },
      { name: 'customer_id', type: 'TEXT', isFk: true, fkRef: 'customers.customer_id' },
      { name: 'order_date', type: 'DATE' },
      { name: 'freight', type: 'NUMERIC' },
      { name: 'ship_country', type: 'TEXT' },
    ],
  },
  {
    tableName: 'order_details',
    description: 'Line items within an order with quantity and discount',
    columns: [
      { name: 'order_id', type: 'INT', isPk: true, isFk: true, fkRef: 'orders.order_id' },
      { name: 'product_id', type: 'INT', isPk: true, isFk: true, fkRef: 'products.product_id' },
      { name: 'unit_price', type: 'NUMERIC' },
      { name: 'quantity', type: 'INT' },
      { name: 'discount', type: 'NUMERIC' },
    ],
  },
];

export const NORTHWIND_SEED_SQL = `
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  customer_id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL
);

INSERT INTO customers (customer_id, company_name, contact_name, contact_title, city, country) VALUES
('ALFKI', 'Alfreds Futterkiste', 'Maria Anders', 'Sales Representative', 'Berlin', 'Germany'),
('ANATR', 'Ana Trujillo Emparedados', 'Ana Trujillo', 'Owner', 'México D.F.', 'Mexico'),
('ANTON', 'Antonio Moreno Taquería', 'Antonio Moreno', 'Owner', 'México D.F.', 'Mexico'),
('BERGS', 'Berglunds snabbköp', 'Christina Berglund', 'Order Administrator', 'Luleå', 'Sweden'),
('BLAUS', 'Blauer See Delikatessen', 'Hanna Moos', 'Sales Representative', 'Mannheim', 'Germany'),
('BONAP', 'Bon app''', 'Laurence Lebihan', 'Owner', 'Marseille', 'France'),
('BOTTM', 'Bottom-Dollar Markets', 'Elizabeth Lincoln', 'Accounting Manager', 'Tsawwassen', 'Canada');

CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  category_name TEXT NOT NULL,
  description TEXT
);

INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Beverages', 'Soft drinks, coffees, teas, beers, and ales'),
(2, 'Condiments', 'Sweet and savory sauces, relishes, spreads, and seasonings'),
(3, 'Confections', 'Desserts, candies, and sweet breads'),
(4, 'Dairy Products', 'Cheeses and dairy essentials'),
(5, 'Seafood', 'Seaweed and fish');

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name TEXT NOT NULL,
  category_id INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  units_in_stock INT NOT NULL,
  discontinued INT NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

INSERT INTO products (product_id, product_name, category_id, unit_price, units_in_stock, discontinued) VALUES
(1, 'Chai', 1, 18.00, 39, 0),
(2, 'Chang', 1, 19.00, 17, 0),
(3, 'Aniseed Syrup', 2, 10.00, 13, 0),
(4, 'Chef Anton''s Cajun Seasoning', 2, 22.00, 53, 0),
(5, 'Chef Anton''s Gumbo Mix', 2, 21.35, 0, 1),
(6, 'Grandma''s Boysenberry Spread', 2, 25.00, 120, 0),
(7, 'Uncle Bob''s Organic Dried Pears', 3, 30.00, 15, 0),
(8, 'Northwoods Cranberry Sauce', 2, 40.00, 6, 0),
(9, 'Mishi Kobe Niku', 4, 97.00, 29, 1),
(10, 'Ikura', 5, 31.00, 31, 0);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_date DATE NOT NULL,
  freight NUMERIC NOT NULL,
  ship_country TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO orders (order_id, customer_id, order_date, freight, ship_country) VALUES
(10248, 'BONAP', '2023-07-04', 32.38, 'France'),
(10249, 'ANATR', '2023-07-05', 11.61, 'Mexico'),
(10250, 'BERGS', '2023-07-08', 65.83, 'Sweden'),
(10251, 'ALFKI', '2023-07-08', 41.34, 'Germany'),
(10252, 'ALFKI', '2023-07-09', 51.30, 'Germany'),
(10253, 'BOTTM', '2023-07-10', 58.17, 'Canada'),
(10254, 'BLAUS', '2023-07-11', 22.98, 'Germany');

CREATE TABLE order_details (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  discount NUMERIC NOT NULL DEFAULT 0.0,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO order_details (order_id, product_id, unit_price, quantity, discount) VALUES
(10248, 1, 14.00, 12, 0),
(10248, 3, 9.80, 10, 0),
(10249, 1, 18.60, 9, 0),
(10249, 2, 19.00, 40, 0),
(10250, 4, 22.00, 15, 0.15),
(10250, 6, 25.00, 35, 0.15),
(10251, 1, 18.00, 6, 0.05),
(10251, 2, 19.00, 15, 0.05),
(10252, 7, 30.00, 40, 0.05),
(10253, 10, 31.00, 20, 0),
(10254, 8, 40.00, 21, 0.1);
`;

export const NORTHWIND_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'nw-easy-1',
    database: 'northwind',
    difficulty: 'easy',
    category: 'Filtering',
    title: 'German customers',
    description: "Show company_name, contact_name, and city for all customers located in 'Germany'.",
    hint: "Filter customers by country = 'Germany'.",
    starterSql: 'SELECT company_name, contact_name, city FROM customers WHERE ...;',
    solutionSql: "SELECT company_name, contact_name, city FROM customers WHERE country = 'Germany';",
    tags: ['SELECT', 'WHERE'],
  },
  {
    id: 'nw-easy-2',
    database: 'northwind',
    difficulty: 'easy',
    category: 'Boolean Logic',
    title: 'In-stock discontinued products',
    description: 'Show product_name, unit_price, and units_in_stock for products that are discontinued (discontinued = 1).',
    hint: 'Filter products by discontinued = 1.',
    starterSql: 'SELECT product_name, unit_price, units_in_stock FROM products WHERE ...;',
    solutionSql: 'SELECT product_name, unit_price, units_in_stock FROM products WHERE discontinued = 1;',
    tags: ['WHERE', 'Boolean logic'],
  },
  {
    id: 'nw-easy-3',
    database: 'northwind',
    difficulty: 'easy',
    category: 'Aggregates',
    title: 'Average product price',
    description: 'Find the average unit_price of all products in inventory rounded to 2 decimal places as avg_price.',
    hint: 'Use ROUND(AVG(unit_price), 2) AS avg_price FROM products.',
    starterSql: 'SELECT ROUND(...) AS avg_price FROM products;',
    solutionSql: 'SELECT ROUND(AVG(unit_price), 2) AS avg_price FROM products;',
    tags: ['AVG', 'ROUND'],
  },
  {
    id: 'nw-med-1',
    database: 'northwind',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Products with category names',
    description: 'List product_name, unit_price, and category_name. Order by category_name ascending, then unit_price descending.',
    hint: 'JOIN products p WITH categories c ON p.category_id = c.category_id.',
    starterSql: 'SELECT p.product_name, p.unit_price, c.category_name FROM products p JOIN ... ORDER BY ...;',
    solutionSql: 'SELECT p.product_name, p.unit_price, c.category_name FROM products p JOIN categories c ON p.category_id = c.category_id ORDER BY c.category_name ASC, p.unit_price DESC;',
    tags: ['JOIN', 'ORDER BY'],
  },
  {
    id: 'nw-med-2',
    database: 'northwind',
    difficulty: 'medium',
    category: 'Grouping',
    title: 'Customer total orders count',
    description: 'Show company_name and total count of orders placed by each customer. Include only customers with at least 1 order, ordered by orders count descending.',
    hint: 'JOIN customers with orders, GROUP BY company_name, and ORDER BY COUNT(o.order_id) DESC.',
    starterSql: 'SELECT c.company_name, COUNT(o.order_id) as total_orders FROM customers c JOIN orders o ... GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT c.company_name, COUNT(o.order_id) as total_orders FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.company_name ORDER BY total_orders DESC;',
    tags: ['GROUP BY', 'JOIN', 'COUNT'],
  },
  {
    id: 'nw-hard-1',
    database: 'northwind',
    difficulty: 'hard',
    category: 'Multi-table Joins & Math',
    title: 'Total sales revenue per product category',
    description: 'Calculate the total gross revenue (ROUND(SUM(od.unit_price * od.quantity), 2)) per category_name. Order by gross_revenue descending.',
    hint: 'Join categories -> products -> order_details. Calculate SUM(unit_price * quantity) and GROUP BY category_name.',
    starterSql: 'SELECT c.category_name, ROUND(SUM(od.unit_price * od.quantity), 2) as gross_revenue FROM categories c JOIN products p ... JOIN order_details od ... GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT c.category_name, ROUND(SUM(od.unit_price * od.quantity), 2) as gross_revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_details od ON p.product_id = od.product_id GROUP BY c.category_name ORDER BY gross_revenue DESC;',
    tags: ['Multi-table JOIN', 'Aggregates', 'Financial Math'],
  },
];

// -------------------------------------------------------------
// 3. W3RESOURCE SALES & INVENTORY DATABASE
// https://www.w3resource.com/sql-exercises/
// -------------------------------------------------------------

export const W3RESOURCE_SCHEMAS: PracticeTableSchema[] = [
  {
    tableName: 'salesman',
    description: 'Sales personnel, unique employee IDs, commission rates, and working cities',
    columns: [
      { name: 'salesman_id', type: 'INT', isPk: true },
      { name: 'name', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'commission', type: 'DECIMAL(7,2)' },
    ],
  },
  {
    tableName: 'customer',
    description: 'Client businesses, ratings/grades, assigned salesmen, and geographical cities',
    columns: [
      { name: 'customer_id', type: 'INT', isPk: true },
      { name: 'cust_name', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'grade', type: 'INT', nullable: true },
      { name: 'salesman_id', type: 'INT', isFk: true, fkRef: 'salesman.salesman_id' },
    ],
  },
  {
    tableName: 'orders',
    description: 'Purchase transaction records, amount values, purchase dates, and associations',
    columns: [
      { name: 'ord_no', type: 'INT', isPk: true },
      { name: 'purch_amt', type: 'DECIMAL(8,2)' },
      { name: 'ord_date', type: 'DATE' },
      { name: 'customer_id', type: 'INT', isFk: true, fkRef: 'customer.customer_id' },
      { name: 'salesman_id', type: 'INT', isFk: true, fkRef: 'salesman.salesman_id' },
    ],
  },
  {
    tableName: 'nobel_win',
    description: 'Historical records of Nobel Prize winners, categories, award years, and nationalities',
    columns: [
      { name: 'year', type: 'INT' },
      { name: 'subject', type: 'TEXT' },
      { name: 'winner', type: 'TEXT' },
      { name: 'country', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
    ],
  },
  {
    tableName: 'item_mast',
    description: 'Product inventory master with pricing and manufacturer company association',
    columns: [
      { name: 'pro_id', type: 'INT', isPk: true },
      { name: 'pro_name', type: 'TEXT' },
      { name: 'pro_price', type: 'DECIMAL(10,2)' },
      { name: 'pro_com', type: 'INT', isFk: true, fkRef: 'company_mast.com_id' },
    ],
  },
  {
    tableName: 'company_mast',
    description: 'Electronics & hardware manufacturing enterprises',
    columns: [
      { name: 'com_id', type: 'INT', isPk: true },
      { name: 'com_name', type: 'TEXT' },
    ],
  },
  {
    tableName: 'emp_department',
    description: 'Company departments with assigned budget allotments',
    columns: [
      { name: 'dpt_code', type: 'INT', isPk: true },
      { name: 'dpt_name', type: 'TEXT' },
      { name: 'dpt_allotment', type: 'INT' },
    ],
  },
  {
    tableName: 'emp_details',
    description: 'Employee directory with identifiers, full names, and department codes',
    columns: [
      { name: 'emp_idno', type: 'INT', isPk: true },
      { name: 'emp_fname', type: 'TEXT' },
      { name: 'emp_lname', type: 'TEXT' },
      { name: 'emp_dept', type: 'INT', isFk: true, fkRef: 'emp_department.dpt_code' },
    ],
  },
  {
    tableName: 'movie',
    description: 'Cinematic catalogue with release dates, running times, languages, and countries',
    columns: [
      { name: 'mov_id', type: 'INT', isPk: true },
      { name: 'mov_title', type: 'TEXT' },
      { name: 'mov_year', type: 'INT' },
      { name: 'mov_time', type: 'INT' },
      { name: 'mov_lang', type: 'TEXT' },
      { name: 'mov_dt_rel', type: 'DATE', nullable: true },
      { name: 'mov_rel_country', type: 'TEXT' },
    ],
  },
  {
    tableName: 'actor',
    description: 'Film actors directory with full names and gender records',
    columns: [
      { name: 'act_id', type: 'INT', isPk: true },
      { name: 'act_fname', type: 'TEXT' },
      { name: 'act_lname', type: 'TEXT' },
      { name: 'act_gender', type: 'CHAR(1)' },
    ],
  },
  {
    tableName: 'director',
    description: 'Film directors registry with identifiers and names',
    columns: [
      { name: 'dir_id', type: 'INT', isPk: true },
      { name: 'dir_fname', type: 'TEXT' },
      { name: 'dir_lname', type: 'TEXT' },
    ],
  },
  {
    tableName: 'movie_direction',
    description: 'Relational mapping connecting directors to films',
    columns: [
      { name: 'dir_id', type: 'INT', isFk: true, fkRef: 'director.dir_id' },
      { name: 'mov_id', type: 'INT', isFk: true, fkRef: 'movie.mov_id' },
    ],
  },
  {
    tableName: 'reviewer',
    description: 'Critics and review organizations',
    columns: [
      { name: 'rev_id', type: 'INT', isPk: true },
      { name: 'rev_name', type: 'TEXT' },
    ],
  },
  {
    tableName: 'rating',
    description: 'Film ratings, star evaluations, and review counts',
    columns: [
      { name: 'mov_id', type: 'INT', isFk: true, fkRef: 'movie.mov_id' },
      { name: 'rev_id', type: 'INT', isFk: true, fkRef: 'reviewer.rev_id' },
      { name: 'rev_stars', type: 'DECIMAL(4,2)' },
      { name: 'num_o_ratings', type: 'INT' },
    ],
  },
];

export const W3RESOURCE_SEED_SQL = `
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS reviewer;
DROP TABLE IF EXISTS movie_direction;
DROP TABLE IF EXISTS director;
DROP TABLE IF EXISTS actor;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS salesman;
DROP TABLE IF EXISTS nobel_win;
DROP TABLE IF EXISTS item_mast;
DROP TABLE IF EXISTS company_mast;
DROP TABLE IF EXISTS emp_details;
DROP TABLE IF EXISTS emp_department;

CREATE TABLE salesman (
  salesman_id INT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  commission DECIMAL(7,2) NOT NULL
);

INSERT INTO salesman (salesman_id, name, city, commission) VALUES
(5001, 'James Hoog', 'New York', 0.15),
(5002, 'Nail Knite', 'Paris', 0.13),
(5005, 'Pit Alex', 'London', 0.11),
(5006, 'Mc Lyon', 'Paris', 0.14),
(5003, 'Lauson Hen', 'San Jose', 0.12),
(5007, 'Paul Adam', 'Rome', 0.13);

CREATE TABLE customer (
  customer_id INT PRIMARY KEY,
  cust_name TEXT NOT NULL,
  city TEXT NOT NULL,
  grade INT,
  salesman_id INT NOT NULL,
  FOREIGN KEY (salesman_id) REFERENCES salesman(salesman_id)
);

INSERT INTO customer (customer_id, cust_name, city, grade, salesman_id) VALUES
(3002, 'Nick Rimando', 'New York', 100, 5001),
(3005, 'Graham Zusi', 'California', 200, 5002),
(3001, 'Brad Guzan', 'London', NULL, 5005),
(3004, 'Fabian Johns', 'Paris', 300, 5006),
(3007, 'Brad Davis', 'New York', 200, 5001),
(3009, 'Geoff Camero', 'Berlin', 100, 5003),
(3008, 'Julian Green', 'London', 300, 5002),
(3003, 'Jozy Altidor', 'Moscow', 200, 5007);

CREATE TABLE orders (
  ord_no INT PRIMARY KEY,
  purch_amt DECIMAL(8,2) NOT NULL,
  ord_date DATE NOT NULL,
  customer_id INT NOT NULL,
  salesman_id INT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (salesman_id) REFERENCES salesman(salesman_id)
);

INSERT INTO orders (ord_no, purch_amt, ord_date, customer_id, salesman_id) VALUES
(70001, 150.50, '2012-10-05', 3005, 5002),
(70009, 270.65, '2012-09-10', 3001, 5005),
(70002, 65.26, '2012-10-05', 3002, 5001),
(70004, 110.50, '2012-08-17', 3009, 5003),
(70007, 948.50, '2012-09-10', 3005, 5002),
(70005, 2400.60, '2012-07-27', 3007, 5001),
(70008, 5760.00, '2012-09-10', 3002, 5001),
(70010, 1983.43, '2012-10-10', 3004, 5006),
(70003, 2480.40, '2012-10-10', 3009, 5003),
(70012, 250.45, '2012-06-27', 3008, 5002),
(70011, 75.29, '2012-08-17', 3003, 5007),
(70013, 3045.60, '2012-04-25', 3002, 5001);

CREATE TABLE nobel_win (
  year INT NOT NULL,
  subject TEXT NOT NULL,
  winner TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL
);

INSERT INTO nobel_win (year, subject, winner, country, category) VALUES
(1970, 'Physics', 'Hannes Alfven', 'Sweden', 'Scientist'),
(1970, 'Physics', 'Louis Neel', 'France', 'Scientist'),
(1970, 'Chemistry', 'Luis Federico Leloir', 'France', 'Scientist'),
(1970, 'Physiology', 'Ulf von Euler', 'Sweden', 'Scientist'),
(1970, 'Physiology', 'Bernard Katz', 'Germany', 'Scientist'),
(1970, 'Literature', 'Aleksandr Solzhenitsyn', 'Russia', 'Linguist'),
(1970, 'Economics', 'Paul Samuelson', 'USA', 'Economist'),
(1970, 'Physiology', 'Julius Axelrod', 'USA', 'Scientist'),
(1971, 'Physics', 'Dennis Gabor', 'Hungary', 'Scientist'),
(1971, 'Chemistry', 'Gerhard Herzberg', 'Germany', 'Scientist'),
(1971, 'Peace', 'Willy Brandt', 'Germany', 'Chancellor'),
(1971, 'Literature', 'Pablo Neruda', 'Chile', 'Linguist'),
(1971, 'Economics', 'Simon Kuznets', 'Russia', 'Economist'),
(1978, 'Peace', 'Menachem Begin', 'Israel', 'Prime Minister'),
(1987, 'Physics', 'Johannes Georg Bednorz', 'Germany', 'Scientist'),
(1994, 'Peace', 'Yitzhak Rabin', 'Israel', 'Prime Minister'),
(1994, 'Literature', 'Kenzaburo Oe', 'Japan', 'Linguist');

CREATE TABLE company_mast (
  com_id INT PRIMARY KEY,
  com_name TEXT NOT NULL
);

INSERT INTO company_mast (com_id, com_name) VALUES
(11, 'Samsung'),
(12, 'iBall'),
(13, 'Epsion'),
(14, 'Zebronics'),
(15, 'Asus'),
(16, 'Frontech');

CREATE TABLE item_mast (
  pro_id INT PRIMARY KEY,
  pro_name TEXT NOT NULL,
  pro_price DECIMAL(10, 2) NOT NULL,
  pro_com INT NOT NULL,
  FOREIGN KEY (pro_com) REFERENCES company_mast(com_id)
);

INSERT INTO item_mast (pro_id, pro_name, pro_price, pro_com) VALUES
(101, 'Mother Board', 3200.00, 15),
(102, 'Key Board', 450.00, 16),
(103, 'ZIP drive', 250.00, 14),
(104, 'Speaker', 550.00, 16),
(105, 'Monitor', 5000.00, 11),
(106, 'DVD drive', 900.00, 12),
(107, 'CD drive', 800.00, 12),
(108, 'Printer', 2600.00, 13),
(109, 'Refill cartridge', 350.00, 13),
(110, 'Mouse', 250.00, 12);

CREATE TABLE emp_department (
  dpt_code INT PRIMARY KEY,
  dpt_name TEXT NOT NULL,
  dpt_allotment INT NOT NULL
);

INSERT INTO emp_department (dpt_code, dpt_name, dpt_allotment) VALUES
(57, 'IT', 65000),
(63, 'Finance', 15000),
(47, 'HR', 240000),
(27, 'RD', 55000),
(89, 'QC', 75000);

CREATE TABLE emp_details (
  emp_idno INT PRIMARY KEY,
  emp_fname TEXT NOT NULL,
  emp_lname TEXT NOT NULL,
  emp_dept INT NOT NULL,
  FOREIGN KEY (emp_dept) REFERENCES emp_department(dpt_code)
);

INSERT INTO emp_details (emp_idno, emp_fname, emp_lname, emp_dept) VALUES
(127323, 'Michale', 'Robbin', 57),
(526689, 'Carlos', 'Snares', 63),
(843795, 'Enric', 'Dosio', 57),
(328717, 'Jhon', 'Snares', 63),
(444527, 'Joseph', 'Dosni', 47),
(659831, 'Zanifer', 'Emily', 47),
(847674, 'Kuleswar', 'Sitaraman', 57),
(748681, 'Henrey', 'Gabriel', 47),
(555935, 'Alex', 'Manuel', 57),
(539569, 'George', 'Mardy', 27),
(733843, 'Mario', 'Saule', 63),
(631548, 'Alan', 'Snappy', 27),
(839139, 'Maria', 'Foster', 57);

CREATE TABLE movie (
  mov_id INT PRIMARY KEY,
  mov_title TEXT NOT NULL,
  mov_year INT NOT NULL,
  mov_time INT NOT NULL,
  mov_lang TEXT NOT NULL,
  mov_dt_rel DATE,
  mov_rel_country TEXT NOT NULL
);

INSERT INTO movie (mov_id, mov_title, mov_year, mov_time, mov_lang, mov_dt_rel, mov_rel_country) VALUES
(901, 'Vertigo', 1958, 128, 'English', '1958-08-24', 'UK'),
(902, 'The Innocents', 1961, 100, 'English', '1962-02-19', 'SW'),
(903, 'Lawrence of Arabia', 1962, 216, 'English', '1962-12-11', 'UK'),
(904, 'The Deer Hunter', 1978, 183, 'English', '1979-03-08', 'UK'),
(905, 'Amadeus', 1984, 160, 'English', '1985-01-07', 'UK'),
(906, 'Blade Runner', 1982, 117, 'English', '1982-09-09', 'UK'),
(907, 'Eyes Wide Shut', 1999, 159, 'English', NULL, 'UK'),
(908, 'The Usual Suspects', 1995, 106, 'English', '1995-08-25', 'UK'),
(909, 'Chinatown', 1974, 130, 'English', '1974-08-09', 'UK'),
(910, 'Boogie Nights', 1997, 155, 'English', '1998-02-16', 'UK'),
(911, 'Annie Hall', 1977, 93, 'English', '1977-04-20', 'USA'),
(912, 'Princess Mononoke', 1997, 134, 'Japanese', '2001-10-19', 'UK'),
(913, 'The Shawshank Redemption', 1994, 142, 'English', '1995-02-17', 'UK'),
(914, 'American Beauty', 1999, 122, 'English', NULL, 'UK'),
(915, 'Titanic', 1997, 194, 'English', '1998-01-23', 'UK'),
(916, 'Good Will Hunting', 1997, 126, 'English', '1998-06-03', 'UK'),
(917, 'Deliverance', 1972, 109, 'English', '1982-10-05', 'UK'),
(918, 'Trainspotting', 1996, 94, 'English', '1996-02-23', 'UK'),
(919, 'The Prestige', 2006, 130, 'English', '2006-11-10', 'UK'),
(920, 'Donnie Darko', 2001, 113, 'English', NULL, 'UK');

CREATE TABLE actor (
  act_id INT PRIMARY KEY,
  act_fname TEXT NOT NULL,
  act_lname TEXT NOT NULL,
  act_gender CHAR(1) NOT NULL
);

INSERT INTO actor (act_id, act_fname, act_lname, act_gender) VALUES
(101, 'James', 'Stewart', 'M'),
(102, 'Deborah', 'Kerr', 'F'),
(103, 'Peter', 'OToole', 'M'),
(104, 'Robert', 'De Niro', 'M'),
(105, 'F. Murray', 'Abraham', 'M'),
(106, 'Harrison', 'Ford', 'M'),
(107, 'Nicole', 'Kidman', 'F'),
(108, 'Stephen', 'Baldwin', 'M'),
(109, 'Jack', 'Nicholson', 'M'),
(110, 'Mark', 'Wahlberg', 'M'),
(111, 'Woody', 'Allen', 'M'),
(112, 'Claire', 'Danes', 'F'),
(113, 'Tim', 'Robbins', 'M'),
(114, 'Kevin', 'Spacey', 'M'),
(115, 'Kate', 'Winslet', 'F'),
(116, 'Robin', 'Williams', 'M'),
(117, 'Jon', 'Voight', 'M'),
(118, 'Ewan', 'McGregor', 'M'),
(119, 'Christian', 'Bale', 'M'),
(120, 'Maggie', 'Gyllenhaal', 'F');

CREATE TABLE director (
  dir_id INT PRIMARY KEY,
  dir_fname TEXT NOT NULL,
  dir_lname TEXT NOT NULL
);

INSERT INTO director (dir_id, dir_fname, dir_lname) VALUES
(201, 'Alfred', 'Hitchcock'),
(202, 'Jack', 'Clayton'),
(203, 'David', 'Lean'),
(204, 'Michael', 'Cimino'),
(205, 'Milos', 'Forman'),
(206, 'Ridley', 'Scott'),
(207, 'Stanley', 'Kubrick'),
(208, 'Bryan', 'Singer'),
(209, 'Roman', 'Polanski'),
(210, 'Paul', 'Thomas Anderson'),
(211, 'Woody', 'Allen'),
(212, 'Hayao', 'Miyazaki'),
(213, 'Frank', 'Darabont'),
(214, 'Sam', 'Mendes'),
(215, 'James', 'Cameron'),
(216, 'Gus', 'Van Sant'),
(217, 'John', 'Boorman'),
(218, 'Danny', 'Boyle'),
(219, 'Christopher', 'Nolan'),
(220, 'Richard', 'Kelly');

CREATE TABLE movie_direction (
  dir_id INT NOT NULL,
  mov_id INT NOT NULL,
  FOREIGN KEY (dir_id) REFERENCES director(dir_id),
  FOREIGN KEY (mov_id) REFERENCES movie(mov_id)
);

INSERT INTO movie_direction (dir_id, mov_id) VALUES
(201, 901),
(202, 902),
(203, 903),
(204, 904),
(205, 905),
(206, 906),
(207, 907),
(208, 908),
(209, 909),
(210, 910),
(211, 911),
(212, 912),
(213, 913),
(214, 914),
(215, 915),
(216, 916),
(217, 917),
(218, 918),
(219, 919),
(220, 920);

CREATE TABLE reviewer (
  rev_id INT PRIMARY KEY,
  rev_name TEXT NOT NULL
);

INSERT INTO reviewer (rev_id, rev_name) VALUES
(9001, 'Righty Sock'),
(9002, 'Jack Malvern'),
(9003, 'Flagrant Baronessa'),
(9004, 'Alec Mills'),
(9005, 'Francois Truffaut'),
(9006, 'Victor Fleming'),
(9007, 'Manuel Lepez'),
(9008, 'Brandt Sponseller'),
(9009, 'Richard Adams');

CREATE TABLE rating (
  mov_id INT NOT NULL,
  rev_id INT NOT NULL,
  rev_stars DECIMAL(4,2),
  num_o_ratings INT,
  FOREIGN KEY (mov_id) REFERENCES movie(mov_id),
  FOREIGN KEY (rev_id) REFERENCES reviewer(rev_id)
);

INSERT INTO rating (mov_id, rev_id, rev_stars, num_o_ratings) VALUES
(901, 9001, 8.40, 263575),
(902, 9002, 7.90, 20207),
(903, 9003, 8.30, 202778),
(906, 9005, 8.20, 484746),
(913, 9006, 9.30, 1690000),
(915, 9007, 7.70, 760000),
(918, 9008, 8.20, 580301),
(919, 9009, 8.50, 979100);

`;

export const W3RESOURCE_QUESTIONS: PracticeQuestion[] = [
  // --- RETRIEVE DATA EXERCISES ---
  {
    id: 'w3-ret-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Retrieve Data',
    title: 'Display All Salespeople',
    description: 'Write a SQL query that displays all the information of all salesmen from the salesman table.',
    hint: 'Use SELECT * FROM salesman.',
    starterSql: 'SELECT * FROM ...;',
    solutionSql: 'SELECT * FROM salesman;',
    tags: ['SELECT', 'Basic'],
  },
  {
    id: 'w3-ret-2',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Retrieve Data',
    title: 'Specific Columns: Name & Commission',
    description: 'Write a SQL query to display specific columns: name and commission for all salesmen.',
    hint: 'Project name, commission FROM salesman.',
    starterSql: 'SELECT ... FROM salesman;',
    solutionSql: 'SELECT name, commission FROM salesman;',
    tags: ['SELECT', 'Projections'],
  },
  {
    id: 'w3-ret-3',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Retrieve Data',
    title: 'Distinct Salespeople in Orders',
    description: 'Write a SQL query to identify unique salesman_id values from the orders table without duplicates.',
    hint: 'Use SELECT DISTINCT salesman_id FROM orders.',
    starterSql: 'SELECT DISTINCT ... FROM orders;',
    solutionSql: 'SELECT DISTINCT salesman_id FROM orders;',
    tags: ['DISTINCT', 'Filtering'],
  },
  {
    id: 'w3-ret-4',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Retrieve Data',
    title: 'Salesmen in New York',
    description: "Write a SQL query to find salesmen whose city is 'New York'. Return all columns.",
    hint: "Use WHERE city = 'New York'.",
    starterSql: 'SELECT * FROM salesman WHERE ...;',
    solutionSql: "SELECT * FROM salesman WHERE city = 'New York';",
    tags: ['WHERE', 'Filtering'],
  },
  {
    id: 'w3-ret-5',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Retrieve Data',
    title: 'Customers with Grade 200',
    description: 'Write a SQL query to find customers who have a grade of 200. Return all columns.',
    hint: 'Use WHERE grade = 200.',
    starterSql: 'SELECT * FROM customer WHERE ...;',
    solutionSql: 'SELECT * FROM customer WHERE grade = 200;',
    tags: ['WHERE', 'Numbers'],
  },

  // --- AGGREGATE EXERCISES ---
  {
    id: 'w3-agg-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Aggregates',
    title: 'Total Purchase Amount of All Orders',
    description: 'Write a SQL query to calculate the total purchase amount (SUM) of all orders. Return total_purchase_amount.',
    hint: 'SELECT SUM(purch_amt) AS total_purchase_amount FROM orders.',
    starterSql: 'SELECT SUM(...) AS total_purchase_amount FROM orders;',
    solutionSql: 'SELECT SUM(purch_amt) AS total_purchase_amount FROM orders;',
    tags: ['SUM', 'Aggregates'],
  },
  {
    id: 'w3-agg-2',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Aggregates',
    title: 'Average Purchase Amount',
    description: 'Write a SQL query to calculate the average purchase amount of all orders. Return avg_purchase_amount.',
    hint: 'SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders.',
    starterSql: 'SELECT AVG(...) AS avg_purchase_amount FROM orders;',
    solutionSql: 'SELECT AVG(purch_amt) AS avg_purchase_amount FROM orders;',
    tags: ['AVG', 'Aggregates'],
  },
  {
    id: 'w3-agg-3',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Aggregates & Grouping',
    title: 'Highest Purchase Amount by Customer',
    description: 'Write a SQL query to find the highest purchase amount ordered by each customer. Return customer_id and max_purchase_amount.',
    hint: 'GROUP BY customer_id and select MAX(purch_amt).',
    starterSql: 'SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY ...;',
    solutionSql: 'SELECT customer_id, MAX(purch_amt) AS max_purchase_amount FROM orders GROUP BY customer_id;',
    tags: ['MAX', 'GROUP BY'],
  },
  {
    id: 'w3-agg-4',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'HAVING',
    title: 'Max Purchase Over 2000 per Customer',
    description: 'Write a SQL query to find the maximum purchase amount grouped by customer_id where the max purchase is strictly greater than 2000.',
    hint: 'Use GROUP BY customer_id HAVING MAX(purch_amt) > 2000.',
    starterSql: 'SELECT customer_id, MAX(purch_amt) AS max_purch FROM orders GROUP BY ... HAVING ...;',
    solutionSql: 'SELECT customer_id, MAX(purch_amt) AS max_purch FROM orders GROUP BY customer_id HAVING MAX(purch_amt) > 2000;',
    tags: ['HAVING', 'GROUP BY', 'MAX'],
  },

  // --- JOINS EXERCISES ---
  {
    id: 'w3-join-1',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Salesperson and Customer in Same City',
    description: 'From salesman and customer tables, find the salesperson name and customer name who reside in the same city. Return salesman_name, cust_name, city.',
    hint: 'JOIN customer c ON s.city = c.city.',
    starterSql: 'SELECT s.name AS salesman_name, c.cust_name, c.city FROM salesman s JOIN customer c ON ...;',
    solutionSql: 'SELECT s.name AS salesman_name, c.cust_name, c.city FROM salesman s JOIN customer c ON s.city = c.city;',
    tags: ['JOIN', 'City Matching'],
  },
  {
    id: 'w3-join-2',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Orders Between 500 and 2000 with Customer Info',
    description: 'Find orders where purch_amt is between 500 and 2000. Return ord_no, purch_amt, cust_name, and customer city.',
    hint: 'JOIN orders o WITH customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000.',
    starterSql: 'SELECT o.ord_no, o.purch_amt, c.cust_name, c.city FROM orders o JOIN customer c ON ... WHERE ...;',
    solutionSql: 'SELECT o.ord_no, o.purch_amt, c.cust_name, c.city FROM orders o JOIN customer c ON o.customer_id = c.customer_id WHERE o.purch_amt BETWEEN 500 AND 2000;',
    tags: ['JOIN', 'BETWEEN', 'Filtering'],
  },
  {
    id: 'w3-join-3',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Customers with Salesman Commission > 12%',
    description: 'Find customers who appointed a salesman with commission > 0.12. Return cust_name, city, salesman_name (s.name), and commission.',
    hint: 'JOIN customer c WITH salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12.',
    starterSql: 'SELECT c.cust_name, c.city, s.name AS salesman_name, s.commission FROM customer c JOIN salesman s ON ... WHERE ...;',
    solutionSql: 'SELECT c.cust_name, c.city, s.name AS salesman_name, s.commission FROM customer c JOIN salesman s ON c.salesman_id = s.salesman_id WHERE s.commission > 0.12;',
    tags: ['JOIN', 'Filtering'],
  },

  // --- SUBQUERIES EXERCISES ---
  {
    id: 'w3-sub-1',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Subqueries',
    title: "Orders Issued by Salesman 'Paul Adam'",
    description: "Write a SQL query using a subquery to find all orders issued by salesman named 'Paul Adam'. Return all columns of orders.",
    hint: "WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam').",
    starterSql: 'SELECT * FROM orders WHERE salesman_id = (SELECT ...);',
    solutionSql: "SELECT * FROM orders WHERE salesman_id = (SELECT salesman_id FROM salesman WHERE name = 'Paul Adam');",
    tags: ['Subquery', 'Scalar Subquery'],
  },
  {
    id: 'w3-sub-2',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Subqueries',
    title: 'Orders Generated by London-Based Salespeople',
    description: "Find all orders generated by salespeople located in 'London' using a subquery. Return all columns of orders.",
    hint: "WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London').",
    starterSql: 'SELECT * FROM orders WHERE salesman_id IN (SELECT ...);',
    solutionSql: "SELECT * FROM orders WHERE salesman_id IN (SELECT salesman_id FROM salesman WHERE city = 'London');",
    tags: ['Subquery', 'IN'],
  },
  {
    id: 'w3-sub-3',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Subqueries',
    title: 'Orders Greater than Overall Average on 2012-10-10',
    description: 'Find orders with purch_amt greater than the average purchase amount of orders placed on 2012-10-10. Return all columns of orders.',
    hint: "WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10').",
    starterSql: 'SELECT * FROM orders WHERE purch_amt > (SELECT AVG(...) FROM orders WHERE ...);',
    solutionSql: "SELECT * FROM orders WHERE purch_amt > (SELECT AVG(purch_amt) FROM orders WHERE ord_date = '2012-10-10');",
    tags: ['Subquery', 'AVG', 'Comparison'],
  },

  // --- BOOLEAN & RELATIONAL OPERATORS (W3Resource) ---
  {
    id: 'w3-bool-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Boolean Operators',
    title: 'Customers with Grade > 100',
    description: 'Write a SQL query to locate the details of customers with grade values strictly above 100. Return all columns.',
    hint: 'Filter customer table WHERE grade > 100.',
    starterSql: 'SELECT * FROM customer WHERE ...;',
    solutionSql: 'SELECT * FROM customer WHERE grade > 100;',
    tags: ['WHERE', 'Relational Operators'],
  },
  {
    id: 'w3-bool-2',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Boolean Operators',
    title: "New York Customers with Grade > 100",
    description: "Write a SQL query to find all customers residing in 'New York' who have a grade value strictly above 100.",
    hint: "Combine conditions with AND: city = 'New York' AND grade > 100.",
    starterSql: 'SELECT * FROM customer WHERE city = ... AND ...;',
    solutionSql: "SELECT * FROM customer WHERE city = 'New York' AND grade > 100;",
    tags: ['AND', 'Compound Filtering'],
  },
  {
    id: 'w3-bool-3',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Boolean Operators',
    title: "New York City OR Grade > 100",
    description: "Write a SQL query to find customers who are either from the city of 'New York' OR have a grade strictly greater than 100.",
    hint: "Use OR operator between the two clauses.",
    starterSql: 'SELECT * FROM customer WHERE city = ... OR ...;',
    solutionSql: "SELECT * FROM customer WHERE city = 'New York' OR grade > 100;",
    tags: ['OR', 'Boolean Logic'],
  },
  {
    id: 'w3-bool-4',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Boolean Operators',
    title: 'Salespeople with Commission Between 0.12 and 0.14',
    description: 'Write a SQL query to find salespeople whose commission is between 0.12 and 0.14 inclusive. Return all columns.',
    hint: 'Use commission BETWEEN 0.12 AND 0.14 or >= and <=.',
    starterSql: 'SELECT * FROM salesman WHERE commission BETWEEN ... AND ...;',
    solutionSql: 'SELECT * FROM salesman WHERE commission BETWEEN 0.12 AND 0.14;',
    tags: ['BETWEEN', 'Numbers'],
  },
  {
    id: 'w3-bool-5',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Boolean Operators',
    title: 'Excluding High Amount or Specific Salesmen Orders',
    description: "Write a SQL query to find orders excluding those with ord_date = '2012-09-10' and salesman_id > 5005 or purch_amt > 1000.",
    hint: "Use NOT ((ord_date = '2012-09-10' AND salesman_id > 5005) OR purch_amt > 1000).",
    starterSql: 'SELECT * FROM orders WHERE NOT ((...) OR ...);',
    solutionSql: "SELECT * FROM orders WHERE NOT ((ord_date = '2012-09-10' AND salesman_id > 5005) OR purch_amt > 1000);",
    tags: ['NOT', 'Complex Conditions'],
  },

  // --- WILDCARD & PATTERN MATCHING (W3Resource) ---
  {
    id: 'w3-wild-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Wildcards',
    title: "Salespeople Whose Name Starts with 'N' or 'P'",
    description: "Write a SQL query to find salespeople whose name begins with either 'N' or 'P'. Return all columns.",
    hint: "Use LIKE 'N%' OR LIKE 'P%'.",
    starterSql: 'SELECT * FROM salesman WHERE name LIKE ... OR ...;',
    solutionSql: "SELECT * FROM salesman WHERE name LIKE 'N%' OR name LIKE 'P%';",
    tags: ['LIKE', 'Wildcards'],
  },
  {
    id: 'w3-wild-2',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Wildcards',
    title: "Customers Whose Name Ends with 'n'",
    description: "Write a SQL query to find all customers whose cust_name ends with the lowercase letter 'n'.",
    hint: "Use cust_name LIKE '%n'.",
    starterSql: 'SELECT * FROM customer WHERE cust_name LIKE ...;',
    solutionSql: "SELECT * FROM customer WHERE cust_name LIKE '%n';",
    tags: ['LIKE', 'Pattern Matching'],
  },
  {
    id: 'w3-wild-3',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Wildcards',
    title: "Salespeople Whose Name Has 4th Letter 'l'",
    description: "Write a SQL query to find salespeople whose name begins with 'N' and has 'l' as the 4th character.",
    hint: "Use underscore wildcards: name LIKE 'N__l%'.",
    starterSql: "SELECT * FROM salesman WHERE name LIKE 'N__l%';",
    solutionSql: "SELECT * FROM salesman WHERE name LIKE 'N__l%';",
    tags: ['LIKE', 'Underscore Wildcard'],
  },
  {
    id: 'w3-wild-4',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Wildcards',
    title: 'Orders Not In Specific Purchase Amounts',
    description: 'Write a SQL query to find orders where purch_amt is BETWEEN 500 and 4000, but NOT IN (948.50, 1983.43).',
    hint: 'Use purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43).',
    starterSql: 'SELECT * FROM orders WHERE purch_amt BETWEEN ... AND ... AND purch_amt NOT IN (...);',
    solutionSql: 'SELECT * FROM orders WHERE purch_amt BETWEEN 500 AND 4000 AND purch_amt NOT IN (948.50, 1983.43);',
    tags: ['BETWEEN', 'NOT IN'],
  },

  // --- NOBEL PRIZE EXERCISES (W3Resource) ---
  {
    id: 'w3-nobel-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Nobel Win',
    title: 'Nobel Prize Winners of 1970',
    description: 'Write a SQL query to find the Nobel Prize winners for the year 1970. Return year, subject, and winner.',
    hint: 'Filter nobel_win WHERE year = 1970 and project year, subject, winner.',
    starterSql: 'SELECT year, subject, winner FROM nobel_win WHERE ...;',
    solutionSql: 'SELECT year, subject, winner FROM nobel_win WHERE year = 1970;',
    tags: ['SELECT', 'WHERE', 'Nobel'],
  },
  {
    id: 'w3-nobel-2',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Nobel Win',
    title: 'Literature Winner of 1971',
    description: "Write a SQL query to find the Nobel Prize winner in 'Literature' for the year 1971. Return winner.",
    hint: "Filter year = 1971 AND subject = 'Literature'.",
    starterSql: 'SELECT winner FROM nobel_win WHERE ...;',
    solutionSql: "SELECT winner FROM nobel_win WHERE year = 1971 AND subject = 'Literature';",
    tags: ['AND', 'Filtering'],
  },
  {
    id: 'w3-nobel-3',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Nobel Win',
    title: "Locate Winner Dennis Gabor",
    description: "Write a SQL query to locate the Nobel Prize winner 'Dennis Gabor'. Return year and subject.",
    hint: "WHERE winner = 'Dennis Gabor'.",
    starterSql: 'SELECT year, subject FROM nobel_win WHERE ...;',
    solutionSql: "SELECT year, subject FROM nobel_win WHERE winner = 'Dennis Gabor';",
    tags: ['WHERE', 'Exact Match'],
  },
  {
    id: 'w3-nobel-4',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Nobel Win',
    title: 'Physics Winners from 1970 to 1987',
    description: "Write a SQL query to find Nobel Prize winners in 'Physics' between years 1970 and 1987 inclusive. Return all columns.",
    hint: "WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987.",
    starterSql: 'SELECT * FROM nobel_win WHERE subject = ... AND year BETWEEN ... AND ...;',
    solutionSql: "SELECT * FROM nobel_win WHERE subject = 'Physics' AND year BETWEEN 1970 AND 1987;",
    tags: ['BETWEEN', 'Compound Filter'],
  },
  {
    id: 'w3-nobel-5',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Nobel Win',
    title: 'Winners in Peace or Literature with Category Prime Minister or Chancellor',
    description: "Write a SQL query to find Nobel winners whose subject is 'Peace' or 'Literature', and category is 'Prime Minister' or 'Chancellor'.",
    hint: "Use IN operator: subject IN ('Peace', 'Literature') AND category IN ('Prime Minister', 'Chancellor').",
    starterSql: 'SELECT * FROM nobel_win WHERE subject IN (...) AND category IN (...);',
    solutionSql: "SELECT * FROM nobel_win WHERE subject IN ('Peace', 'Literature') AND category IN ('Prime Minister', 'Chancellor');",
    tags: ['IN', 'Boolean Logic'],
  },

  // --- ITEM & COMPANY MAST EXERCISES (W3Resource) ---
  {
    id: 'w3-item-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Inventory & Mast',
    title: 'Average Price of Items by Company',
    description: 'Write a SQL query to calculate the average price of items for each company code (pro_com). Return pro_com and avg_price rounded to 2 decimals.',
    hint: 'GROUP BY pro_com and SELECT ROUND(AVG(pro_price), 2) AS avg_price.',
    starterSql: 'SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY ...;',
    solutionSql: 'SELECT pro_com, ROUND(AVG(pro_price), 2) AS avg_price FROM item_mast GROUP BY pro_com;',
    tags: ['GROUP BY', 'AVG', 'Item Mast'],
  },
  {
    id: 'w3-item-2',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Inventory & Mast',
    title: 'Products with Company Names (JOIN)',
    description: 'Write a SQL query to display the item name (pro_name), price (pro_price), and company name (com_name) for all products.',
    hint: 'JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id.',
    starterSql: 'SELECT i.pro_name, i.pro_price, c.com_name FROM item_mast i JOIN company_mast c ON ...;',
    solutionSql: 'SELECT i.pro_name, i.pro_price, c.com_name FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id;',
    tags: ['JOIN', 'Foreign Keys'],
  },
  {
    id: 'w3-item-3',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Inventory & Mast',
    title: 'Most Expensive Item in Each Company',
    description: 'Write a SQL query to find the most expensive item price for each company name. Return com_name and max_price.',
    hint: 'JOIN item_mast i WITH company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name.',
    starterSql: 'SELECT c.com_name, MAX(i.pro_price) AS max_price FROM item_mast i JOIN company_mast c ON ... GROUP BY ...;',
    solutionSql: 'SELECT c.com_name, MAX(i.pro_price) AS max_price FROM item_mast i JOIN company_mast c ON i.pro_com = c.com_id GROUP BY c.com_name;',
    tags: ['JOIN', 'GROUP BY', 'MAX'],
  },

  // --- EMPLOYEE & DEPARTMENT EXERCISES (W3Resource) ---
  {
    id: 'w3-emp-1',
    database: 'w3resource',
    difficulty: 'easy',
    category: 'Employee Directory',
    title: 'Employees in IT or HR Department',
    description: "Write a SQL query to find employees whose department code (emp_dept) is 57 (IT) or 47 (HR). Return emp_idno, emp_fname, emp_lname, emp_dept.",
    hint: 'WHERE emp_dept IN (57, 47).',
    starterSql: 'SELECT emp_idno, emp_fname, emp_lname, emp_dept FROM emp_details WHERE emp_dept IN (...);',
    solutionSql: 'SELECT emp_idno, emp_fname, emp_lname, emp_dept FROM emp_details WHERE emp_dept IN (57, 47);',
    tags: ['IN', 'Employee'],
  },
  {
    id: 'w3-emp-2',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Employee Directory',
    title: 'Employees with Department Name and Budget Allotment',
    description: 'Write a SQL query to display the employee full name (emp_fname, emp_lname), department name (dpt_name), and department allotment (dpt_allotment).',
    hint: 'JOIN emp_details e WITH emp_department d ON e.emp_dept = d.dpt_code.',
    starterSql: 'SELECT e.emp_fname, e.emp_lname, d.dpt_name, d.dpt_allotment FROM emp_details e JOIN emp_department d ON ...;',
    solutionSql: 'SELECT e.emp_fname, e.emp_lname, d.dpt_name, d.dpt_allotment FROM emp_details e JOIN emp_department d ON e.emp_dept = d.dpt_code;',
    tags: ['JOIN', 'Departments'],
  },
  {
    id: 'w3-emp-3',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Employee Directory',
    title: 'Departments with Allotment Exceeding 60000 Having Employees',
    description: 'Write a SQL query to find distinct department names (dpt_name) that have an allotment greater than 60000 and at least one employee assigned.',
    hint: 'SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000.',
    starterSql: 'SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON ... WHERE ...;',
    solutionSql: 'SELECT DISTINCT d.dpt_name FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept WHERE d.dpt_allotment > 60000;',
    tags: ['DISTINCT', 'JOIN', 'Filtering'],
  },
  {
    id: 'w3-emp-4',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Employee Directory',
    title: 'Count Employees in Each Department',
    description: 'Write a SQL query to count the number of employees in each department. Return dpt_name and total_employees, ordered by total_employees descending.',
    hint: 'JOIN emp_department d WITH emp_details e ON d.dpt_code = e.emp_dept GROUP BY d.dpt_name ORDER BY total_employees DESC.',
    starterSql: 'SELECT d.dpt_name, COUNT(e.emp_idno) AS total_employees FROM emp_department d JOIN emp_details e ON ... GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT d.dpt_name, COUNT(e.emp_idno) AS total_employees FROM emp_department d JOIN emp_details e ON d.dpt_code = e.emp_dept GROUP BY d.dpt_name ORDER BY total_employees DESC;',
    tags: ['GROUP BY', 'COUNT', 'ORDER BY'],
  },

  // --- MORE ADVANCED JOINS & SUBQUERIES (W3Resource) ---
  {
    id: 'w3-join-4',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Customer and Salesman with Orders and Commission',
    description: 'Write a SQL query to display ord_no, cust_name, name AS salesman_name, and commission for all orders.',
    hint: 'JOIN orders o WITH customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id.',
    starterSql: 'SELECT o.ord_no, c.cust_name, s.name AS salesman_name, s.commission FROM orders o JOIN customer c ON ... JOIN salesman s ON ...;',
    solutionSql: 'SELECT o.ord_no, c.cust_name, s.name AS salesman_name, s.commission FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id;',
    tags: ['Three-table JOIN', 'Relationships'],
  },
  {
    id: 'w3-join-5',
    database: 'w3resource',
    difficulty: 'medium',
    category: 'Joins',
    title: 'Customers and Salespeople with Different Cities',
    description: 'Find all orders where the customer and their assigned salesman reside in different cities. Return ord_no, cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city.',
    hint: 'JOIN orders o WITH customer c and salesman s WHERE c.city != s.city.',
    starterSql: 'SELECT o.ord_no, c.cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id WHERE ...;',
    solutionSql: 'SELECT o.ord_no, c.cust_name, c.city AS customer_city, s.name AS salesman_name, s.city AS salesman_city FROM orders o JOIN customer c ON o.customer_id = c.customer_id JOIN salesman s ON o.salesman_id = s.salesman_id WHERE c.city != s.city;',
    tags: ['JOIN', 'Inequality Filter'],
  },
  {
    id: 'w3-sub-4',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Subqueries',
    title: 'Customers Whose Grade is Higher Than Every Customer in New York',
    description: 'Write a SQL query using a subquery to find all customers whose grade is strictly greater than the maximum grade of customers residing in New York.',
    hint: 'WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = \'New York\').',
    starterSql: 'SELECT * FROM customer WHERE grade > (SELECT MAX(...) FROM customer WHERE ...);',
    solutionSql: "SELECT * FROM customer WHERE grade > (SELECT MAX(grade) FROM customer WHERE city = 'New York');",
    tags: ['Subquery', 'MAX', 'Scalar Subquery'],
  },
  {
    id: 'w3-sub-5',
    database: 'w3resource',
    difficulty: 'hard',
    category: 'Subqueries',
    title: 'Salesmen with Customers Located in Their Home City',
    description: 'Write a SQL query using EXISTS to find salesmen who have at least one customer living in the same city as them.',
    hint: 'WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city).',
    starterSql: 'SELECT * FROM salesman s WHERE EXISTS (SELECT 1 FROM customer c WHERE ...);',
    solutionSql: 'SELECT * FROM salesman s WHERE EXISTS (SELECT 1 FROM customer c WHERE c.salesman_id = s.salesman_id AND c.city = s.city);',
    tags: ['Subquery', 'EXISTS', 'Correlated Subquery'],
  },
];
