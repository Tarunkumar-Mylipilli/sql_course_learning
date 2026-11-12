// SQL Practice Arena: Datasets & Real-World Interview Questions
// Sourced from sql-practice.com (Hospital DB & Northwind DB)
// Fully compatible with SQLite wasm in-browser worker

export type PracticeDatabaseType = 'hospital' | 'northwind';

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
  title: string;
  description: string;
  hint: string;
  starterSql: string;
  solutionSql: string;
  tags: string[];
}

// -------------------------------------------------------------
// 1. HOSPITAL DATABASE
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
(10, 'Ashley', 'Jackson', 'F', '1988-07-04', 'Calgary', 'AB', NULL, 160, 52);

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
(10, '2023-06-14', '2023-06-16', 'Pneumonia', 2);
`;

export const HOSPITAL_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'hosp-easy-1',
    database: 'hospital',
    difficulty: 'easy',
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
    title: 'Patients born in the 1980s',
    description: 'Show first name, last name, and birth date of patients born between 1980-01-01 and 1989-12-31, ordered by birth_date ascending.',
    hint: 'You can use the BETWEEN keyword or >= and <= with ISO date strings.',
    starterSql: 'SELECT first_name, last_name, birth_date FROM patients WHERE ... ORDER BY birth_date ASC;',
    solutionSql: "SELECT first_name, last_name, birth_date FROM patients WHERE birth_date BETWEEN '1980-01-01' AND '1989-12-31' ORDER BY birth_date ASC;",
    tags: ['BETWEEN', 'Dates', 'ORDER BY'],
  },
  {
    id: 'hosp-med-1',
    database: 'hospital',
    difficulty: 'medium',
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
    title: 'Admissions with attending doctor name and specialty',
    description: "Show patient_id, diagnosis, doctor's full name (concatenated as first_name || ' ' || last_name as doctor_name), and their specialty for all admissions.",
    hint: 'Join admissions with doctors using attending_doctor_id = doctor_id.',
    starterSql: 'SELECT a.patient_id, a.diagnosis, (d.first_name || \' \' || d.last_name) AS doctor_name, d.specialty FROM admissions a JOIN ...',
    solutionSql: "SELECT a.patient_id, a.diagnosis, (d.first_name || ' ' || d.last_name) AS doctor_name, d.specialty FROM admissions a JOIN doctors d ON a.attending_doctor_id = d.doctor_id;",
    tags: ['JOIN', 'String Concatenation'],
  },
  {
    id: 'hosp-hard-1',
    database: 'hospital',
    difficulty: 'hard',
    title: 'Patients with multiple admissions',
    description: 'Find the first_name, last_name, and total count of admissions for patients who have been admitted more than 1 time. Order by admission count descending.',
    hint: 'JOIN patients with admissions, GROUP BY p.patient_id, p.first_name, p.last_name, and filter using HAVING count > 1.',
    starterSql: 'SELECT p.first_name, p.last_name, COUNT(a.admission_date) as admission_count FROM patients p ... GROUP BY ... HAVING ...',
    solutionSql: 'SELECT p.first_name, p.last_name, COUNT(a.admission_date) as admission_count FROM patients p JOIN admissions a ON p.patient_id = a.patient_id GROUP BY p.patient_id, p.first_name, p.last_name HAVING COUNT(a.admission_date) > 1 ORDER BY admission_count DESC;',
    tags: ['HAVING', 'GROUP BY', 'Aggregates', 'JOIN'],
  },
];

// -------------------------------------------------------------
// 2. NORTHWIND DATABASE
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
    title: 'In-stock discontinued products',
    description: 'Show product_name, unit_price, and units_in_stock for products that are discontinued (discontinued = 1).',
    hint: 'Filter products by discontinued = 1.',
    starterSql: 'SELECT product_name, unit_price, units_in_stock FROM products WHERE ...;',
    solutionSql: 'SELECT product_name, unit_price, units_in_stock FROM products WHERE discontinued = 1;',
    tags: ['WHERE', 'Boolean logic'],
  },
  {
    id: 'nw-med-1',
    database: 'northwind',
    difficulty: 'medium',
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
    title: 'Total sales revenue per product category',
    description: 'Calculate the total gross revenue (ROUND(SUM(od.unit_price * od.quantity), 2)) per category_name. Order by gross_revenue descending.',
    hint: 'Join categories -> products -> order_details. Calculate SUM(unit_price * quantity) and GROUP BY category_name.',
    starterSql: 'SELECT c.category_name, ROUND(SUM(od.unit_price * od.quantity), 2) as gross_revenue FROM categories c JOIN products p ... JOIN order_details od ... GROUP BY ... ORDER BY ...;',
    solutionSql: 'SELECT c.category_name, ROUND(SUM(od.unit_price * od.quantity), 2) as gross_revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_details od ON p.product_id = od.product_id GROUP BY c.category_name ORDER BY gross_revenue DESC;',
    tags: ['Multi-table JOIN', 'Aggregates', 'Financial Math'],
  },
];
