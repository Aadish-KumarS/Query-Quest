import { DatasetMeta } from "./types";

export const companyDataset: DatasetMeta = {
  id: "company",
  name: "Apex Global Operations",
  badge: "Organizational Data",
  description: "Enterprise operations covering departments, staff hierarchies, project tracking, salary progressions, and performance evaluations.",
  tableCount: 5,
  tables: [
    {
      name: "departments",
      description: "Company organizational divisions and locations",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Department code" },
        { name: "name", type: "TEXT", nullable: false, description: "Department name" },
        { name: "budget", type: "REAL", nullable: false, description: "Annual operational budget (USD)" },
        { name: "location", type: "TEXT", nullable: false, description: "Headquarters or branch city" },
      ],
    },
    {
      name: "employees",
      description: "Personnel directory with reporting hierarchy",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Staff ID" },
        { name: "first_name", type: "TEXT", nullable: false, description: "First name" },
        { name: "last_name", type: "TEXT", nullable: false, description: "Last name" },
        { name: "email", type: "TEXT", nullable: false, description: "Corporate email" },
        { name: "department_id", type: "INTEGER", isForeign: true, references: "departments.id", nullable: true, description: "Assigned department" },
        { name: "job_title", type: "TEXT", nullable: false, description: "Role title" },
        { name: "hire_date", type: "TEXT", nullable: false, description: "Start date (YYYY-MM-DD)" },
        { name: "manager_id", type: "INTEGER", isForeign: true, references: "employees.id", nullable: true, description: "Direct manager ID" },
      ],
    },
    {
      name: "projects",
      description: "Active and completed strategic initiatives",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Project identifier" },
        { name: "name", type: "TEXT", nullable: false, description: "Initiative title" },
        { name: "department_id", type: "INTEGER", isForeign: true, references: "departments.id", nullable: false, description: "Sponsoring department" },
        { name: "start_date", type: "TEXT", nullable: false, description: "Kickoff date" },
        { name: "end_date", type: "TEXT", nullable: true, description: "Completion date or NULL" },
        { name: "budget", type: "REAL", nullable: false, description: "Allocated budget" },
        { name: "status", type: "TEXT", nullable: false, description: "Status: planned, active, completed, on_hold" },
      ],
    },
    {
      name: "salaries",
      description: "Historical and current base compensation records",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Salary record ID" },
        { name: "employee_id", type: "INTEGER", isForeign: true, references: "employees.id", nullable: false, description: "Employee reference" },
        { name: "amount", type: "REAL", nullable: false, description: "Annualized compensation (USD)" },
        { name: "effective_date", type: "TEXT", nullable: false, description: "Date adjusted" },
      ],
    },
    {
      name: "performance_reviews",
      description: "Annual employee reviews and evaluations",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Review record ID" },
        { name: "employee_id", type: "INTEGER", isForeign: true, references: "employees.id", nullable: false, description: "Employee reviewed" },
        { name: "review_year", type: "INTEGER", nullable: false, description: "Year of review (e.g. 2023)" },
        { name: "rating", type: "INTEGER", nullable: false, description: "Rating score 1 to 5" },
        { name: "feedback", type: "TEXT", nullable: true, description: "Manager review summary" },
      ],
    },
  ],
  sampleQueries: [
    {
      title: "Average Salary by Department",
      description: "Analyze median and mean salaries across teams",
      sql: `SELECT d.name AS department, COUNT(e.id) AS headcount, ROUND(AVG(s.amount), 0) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.department_id
JOIN salaries s ON e.id = s.employee_id
GROUP BY d.name
ORDER BY avg_salary DESC;`,
    },
    {
      title: "Manager Self-Join Hierarchy",
      description: "List employees alongside their reporting manager",
      sql: `SELECT e.first_name || ' ' || e.last_name AS employee,
       e.job_title,
       COALESCE(m.first_name || ' ' || m.last_name, 'None (Executive)') AS reports_to
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY reports_to;`,
    },
  ],
  sql: `
DROP TABLE IF EXISTS performance_reviews;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department_id INTEGER,
  job_title TEXT NOT NULL,
  hire_date TEXT NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  budget REAL NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('planned', 'active', 'completed', 'on_hold')),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE salaries (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  effective_date TEXT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE performance_reviews (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  review_year INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  feedback TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO departments (id, name, budget, location) VALUES
  (1, 'Engineering', 2400000.0, 'San Francisco'),
  (2, 'Product & Design', 1100000.0, 'San Francisco'),
  (3, 'Analytics & Data', 950000.0, 'New York'),
  (4, 'Marketing', 1400000.0, 'New York'),
  (5, 'Human Resources', 600000.0, 'Austin'),
  (6, 'Research & Development', 1800000.0, 'Boston');

INSERT INTO employees (id, first_name, last_name, email, department_id, job_title, hire_date, manager_id) VALUES
  (1, 'Sarah', 'Chen', 'schen@apex.com', 1, 'VP of Engineering', '2020-01-15', NULL),
  (2, 'Marcus', 'Brody', 'mbrody@apex.com', 1, 'Staff Software Engineer', '2020-04-10', 1),
  (3, 'Amina', 'Khoury', 'akhoury@apex.com', 3, 'Head of Analytics', '2021-02-01', NULL),
  (4, 'David', 'Kim', 'dkim@apex.com', 3, 'Senior Data Analyst', '2021-06-15', 3),
  (5, 'Jessica', 'Taylor', 'jtaylor@apex.com', 2, 'Principal Product Designer', '2021-08-20', NULL),
  (6, 'Vikram', 'Patel', 'vpatel@apex.com', 1, 'Backend Engineer', '2022-03-10', 2),
  (7, 'Hannah', 'Abbott', 'habbott@apex.com', 4, 'Growth Marketing Lead', '2022-05-18', NULL),
  (8, 'Carlos', 'Mendoza', 'cmendoza@apex.com', 4, 'Content Strategist', '2022-09-01', 7),
  (9, 'Devon', 'Miles', 'dmiles@apex.com', 5, 'People Operations Manager', '2023-01-10', NULL),
  (10, 'Leila', 'Najafi', 'lnajafi@apex.com', 3, 'Junior Data Scientist', '2023-04-01', 3),
  (11, 'Taro', 'Takahashi', 'ttakahashi@apex.com', 6, 'Research Fellow', '2023-07-15', NULL),
  (12, 'Claire', 'Delacroix', 'cdelacroix@apex.com', NULL, 'Executive Advisor', '2023-10-01', NULL);

INSERT INTO salaries (id, employee_id, amount, effective_date) VALUES
  (1, 1, 215000.0, '2023-01-01'),
  (2, 2, 175000.0, '2023-01-01'),
  (3, 3, 185000.0, '2023-01-01'),
  (4, 4, 135000.0, '2023-01-01'),
  (5, 5, 160000.0, '2023-01-01'),
  (6, 6, 125000.0, '2023-01-01'),
  (7, 7, 140000.0, '2023-01-01'),
  (8, 8, 95000.0, '2023-01-01'),
  (9, 9, 105000.0, '2023-01-01'),
  (10, 10, 92000.0, '2023-04-01'),
  (11, 11, 165000.0, '2023-07-15'),
  (12, 12, 190000.0, '2023-10-01');

INSERT INTO projects (id, name, department_id, start_date, end_date, budget, status) VALUES
  (1, 'Cloud Data Lake Migration', 3, '2023-01-10', '2023-08-15', 320000.0, 'completed'),
  (2, 'Next-Gen Mobile Architecture', 1, '2023-03-01', '2024-02-28', 580000.0, 'active'),
  (3, 'Global Rebrand & Design System', 2, '2023-05-15', '2023-11-30', 210000.0, 'completed'),
  (4, 'Automated Retention Pipeline', 3, '2023-09-01', NULL, 150000.0, 'active'),
  (5, 'Employee Wellness Platform', 5, '2023-10-15', NULL, 65000.0, 'active'),
  (6, 'Quantum Cryptography Prototype', 6, '2024-01-05', NULL, 450000.0, 'planned');

INSERT INTO performance_reviews (id, employee_id, review_year, rating, feedback) VALUES
  (1, 1, 2023, 5, 'Exceptional organizational leadership and architecture turnaround.'),
  (2, 2, 2023, 4, 'Reliable engineering delivery, mentored two mid-level engineers.'),
  (3, 3, 2023, 5, 'Built reliable analytics foundation enabling multi-million dollar savings.'),
  (4, 4, 2023, 4, 'Delivered automated dashboards ahead of schedule.'),
  (5, 5, 2023, 4, 'Unified user experience across desktop and mobile suites.'),
  (6, 6, 2023, 3, 'Solid code quality, continuing to build velocity.'),
  (7, 7, 2023, 4, 'Exceeded Q3 conversion targets by 18%.'),
  (8, 8, 2023, 4, 'High engagement articles and top-tier documentation.'),
  (9, 9, 2023, 3, 'Smooth onboarding overhaul, team feedback positive.'),
  (10, 10, 2023, 4, 'Quick learner, contributed early to churn modeling.');
`,
};
