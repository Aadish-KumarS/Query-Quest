import { DatasetMeta } from "./types";

export const ecommerceDataset: DatasetMeta = {
  id: "ecommerce",
  name: "Meridian Commerce",
  badge: "Primary Curriculum",
  description: "A complete online marketplace with orders, customers, inventory, discounts, and return disputes. Features realistic edge cases like unpurchased goods and unfulfilled carts.",
  tableCount: 8,
  tables: [
    {
      name: "customers",
      description: "Registered shoppers with geographic and account metadata",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Unique customer identifier" },
        { name: "first_name", type: "TEXT", nullable: false, description: "Customer first name" },
        { name: "last_name", type: "TEXT", nullable: false, description: "Customer last name" },
        { name: "email", type: "TEXT", nullable: false, description: "Contact email" },
        { name: "city", type: "TEXT", nullable: false, description: "Primary billing city" },
        { name: "country", type: "TEXT", nullable: false, description: "Country ISO name" },
        { name: "created_at", type: "TEXT", nullable: false, description: "Account creation date (YYYY-MM-DD)" },
        { name: "status", type: "TEXT", nullable: false, description: "Account status: active, churned, new" },
      ],
    },
    {
      name: "categories",
      description: "Product taxonomy and organizational hierarchy",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Category identifier" },
        { name: "name", type: "TEXT", nullable: false, description: "Category display name" },
        { name: "description", type: "TEXT", nullable: true, description: "Scope and category notes" },
        { name: "parent_id", type: "INTEGER", isForeign: true, references: "categories.id", nullable: true, description: "Parent category for hierarchy" },
      ],
    },
    {
      name: "products",
      description: "Catalog of merchandise with pricing, costs, and current warehouse stock",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Product SKU number" },
        { name: "name", type: "TEXT", nullable: false, description: "Product title" },
        { name: "category_id", type: "INTEGER", isForeign: true, references: "categories.id", nullable: false, description: "Primary category" },
        { name: "price", type: "REAL", nullable: false, description: "Current selling price (USD)" },
        { name: "cost", type: "REAL", nullable: false, description: "Unit acquisition cost (USD)" },
        { name: "stock_quantity", type: "INTEGER", nullable: false, description: "Units in warehouse inventory" },
        { name: "status", type: "TEXT", nullable: false, description: "Listing status: active, discontinued" },
      ],
    },
    {
      name: "orders",
      description: "Customer checkout transactions with status and monetary totals",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Order reference number" },
        { name: "customer_id", type: "INTEGER", isForeign: true, references: "customers.id", nullable: false, description: "Purchasing customer" },
        { name: "order_date", type: "TEXT", nullable: false, description: "Date placed (YYYY-MM-DD)" },
        { name: "status", type: "TEXT", nullable: false, description: "State: delivered, shipped, processing, cancelled" },
        { name: "total_amount", type: "REAL", nullable: false, description: "Grand total charged" },
        { name: "shipping_fee", type: "REAL", nullable: false, description: "Shipping cost charged" },
      ],
    },
    {
      name: "order_items",
      description: "Line-item breakdown of individual products within orders",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Unique item line ID" },
        { name: "order_id", type: "INTEGER", isForeign: true, references: "orders.id", nullable: false, description: "Associated order" },
        { name: "product_id", type: "INTEGER", isForeign: true, references: "products.id", nullable: false, description: "Associated product" },
        { name: "quantity", type: "INTEGER", nullable: false, description: "Units purchased" },
        { name: "unit_price", type: "REAL", nullable: false, description: "Price at time of purchase" },
        { name: "discount_amount", type: "REAL", nullable: false, description: "Per-item discount deducted" },
      ],
    },
    {
      name: "payments",
      description: "Financial transactions processed for customer orders",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Payment ledger ID" },
        { name: "order_id", type: "INTEGER", isForeign: true, references: "orders.id", nullable: false, description: "Associated order" },
        { name: "payment_method", type: "TEXT", nullable: false, description: "Gateway: credit_card, paypal, bank_transfer" },
        { name: "amount", type: "REAL", nullable: false, description: "Amount tendered" },
        { name: "payment_date", type: "TEXT", nullable: false, description: "Date settled" },
        { name: "status", type: "TEXT", nullable: false, description: "Payment state: completed, failed, refunded" },
      ],
    },
    {
      name: "returns",
      description: "Item returns filed by buyers with resolution and reasons",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Return authorization ID" },
        { name: "order_item_id", type: "INTEGER", isForeign: true, references: "order_items.id", nullable: false, description: "Returned item line" },
        { name: "return_date", type: "TEXT", nullable: false, description: "Return submission date" },
        { name: "reason", type: "TEXT", nullable: false, description: "Reason: defective, wrong_item, changed_mind, late_delivery" },
        { name: "refund_amount", type: "REAL", nullable: false, description: "Refund issued to customer" },
      ],
    },
    {
      name: "discounts",
      description: "Promotional voucher codes and validity thresholds",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Voucher ID" },
        { name: "code", type: "TEXT", nullable: false, description: "Promotional coupon code" },
        { name: "discount_percent", type: "INTEGER", nullable: false, description: "Discount percentage rate" },
        { name: "valid_from", type: "TEXT", nullable: false, description: "Start date" },
        { name: "valid_to", type: "TEXT", nullable: false, description: "Expiration date" },
        { name: "min_purchase", type: "REAL", nullable: true, description: "Minimum order value required" },
      ],
    },
  ],
  sampleQueries: [
    {
      title: "Preview Customer Profiles",
      description: "Examine basic customer records and account origins",
      sql: "SELECT id, first_name, last_name, city, country, status FROM customers LIMIT 10;",
    },
    {
      title: "High Revenue Products",
      description: "Calculate gross product sales across orders",
      sql: `SELECT p.name, c.name AS category, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, c.name
ORDER BY total_revenue DESC
LIMIT 5;`,
    },
    {
      title: "Return Rates by Reason",
      description: "Count refund claims categorized by dispute reason",
      sql: `SELECT reason, COUNT(*) AS total_returns, ROUND(SUM(refund_amount), 2) AS total_refunded
FROM returns
GROUP BY reason
ORDER BY total_returns DESC;`,
    },
  ],
  sql: `
-- ==========================================
-- MERIDIAN COMMERCE SEEDED SQLITE DATABASE
-- ==========================================

DROP TABLE IF EXISTS returns;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS discounts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'churned', 'new'))
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id INTEGER,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  price REAL NOT NULL,
  cost REAL NOT NULL,
  stock_quantity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'discontinued')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('delivered', 'shipped', 'processing', 'cancelled')),
  total_amount REAL NOT NULL,
  shipping_fee REAL NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  discount_amount REAL NOT NULL DEFAULT 0.0,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK(payment_method IN ('credit_card', 'paypal', 'bank_transfer')),
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('completed', 'failed', 'refunded')),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE returns (
  id INTEGER PRIMARY KEY,
  order_item_id INTEGER NOT NULL,
  return_date TEXT NOT NULL,
  reason TEXT NOT NULL CHECK(reason IN ('defective', 'wrong_item', 'changed_mind', 'late_delivery')),
  refund_amount REAL NOT NULL,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);

CREATE TABLE discounts (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL,
  valid_from TEXT NOT NULL,
  valid_to TEXT NOT NULL,
  min_purchase REAL
);

-- Seed Categories
INSERT INTO categories (id, name, description, parent_id) VALUES
  (1, 'Electronics', 'Personal tech, computer peripherals, and smart accessories', NULL),
  (2, 'Audio', 'Headphones, desktop speakers, and recording gear', 1),
  (3, 'Computing', 'Keyboards, displays, monitors, and laptops', 1),
  (4, 'Apparel', 'Garments, functional wear, and organic textiles', NULL),
  (5, 'Footwear', 'Running shoes, leather boots, and house slippers', 4),
  (6, 'Home & Office', 'Ergonomic furnishings, planters, and desk lighting', NULL),
  (7, 'Stationery', 'Fountain pens, dot notebooks, and drafting rulers', 6);

-- Seed Products (Including unpurchased SKU 12, and discontinued SKU 11)
INSERT INTO products (id, name, category_id, price, cost, stock_quantity, status) VALUES
  (1, 'Aura ANC Wireless Headphones', 2, 199.99, 85.00, 45, 'active'),
  (2, 'Vortex Mechanical Keyboard', 3, 149.50, 62.00, 28, 'active'),
  (3, 'UltraClear 4K 27" Monitor', 3, 389.00, 210.00, 15, 'active'),
  (4, 'Studio Dynamic Microphone', 2, 129.00, 54.00, 32, 'active'),
  (5, 'Merino Wool Pullover', 4, 110.00, 42.00, 60, 'active'),
  (6, 'TrailMaster Hiking Boots', 5, 175.00, 78.00, 22, 'active'),
  (7, 'Walnut Monitor Stand', 6, 79.99, 28.50, 40, 'active'),
  (8, 'Brass Fountain Pen', 7, 55.00, 18.00, 85, 'active'),
  (9, 'Linen Hardcover Notebook', 7, 24.50, 6.20, 150, 'active'),
  (10, 'Ergonomic Task Chair', 6, 420.00, 210.00, 12, 'active'),
  (11, 'Retro USB Cassette Player', 2, 45.00, 16.00, 0, 'discontinued'),
  (12, 'Memory Foam Ergonomic Footrest', 6, 49.99, 17.50, 50, 'active'),
  (13, 'Titanium EDC Pen', 7, 85.00, 32.00, 40, 'active'),
  (14, 'Organic Canvas Tote', 4, 28.00, 8.50, 120, 'active'),
  (15, 'Smart LED Desk Lamp', 6, 68.00, 29.00, 35, 'active');

-- Seed Customers (Including Customer 12 who has placed 0 orders)
INSERT INTO customers (id, first_name, last_name, email, city, country, created_at, status) VALUES
  (1, 'Maya', 'Lin', 'maya.lin@example.com', 'San Francisco', 'USA', '2023-01-15', 'active'),
  (2, 'Julian', 'Vance', 'j.vance@example.co.uk', 'London', 'UK', '2023-02-10', 'active'),
  (3, 'Amara', 'Okafor', 'amara.o@example.ng', 'Lagos', 'Nigeria', '2023-03-01', 'active'),
  (4, 'Soren', 'Nielsen', 'snielsen@example.dk', 'Copenhagen', 'Denmark', '2023-03-18', 'churned'),
  (5, 'Chloe', 'Dubois', 'c.dubois@example.fr', 'Paris', 'France', '2023-04-05', 'active'),
  (6, 'Kenji', 'Sato', 'kenji.sato@example.jp', 'Tokyo', 'Japan', '2023-05-12', 'active'),
  (7, 'Elena', 'Rostova', 'elena.rostova@example.de', 'Berlin', 'Germany', '2023-06-22', 'active'),
  (8, 'Mateo', 'Silva', 'mateo.silva@example.br', 'Sao Paulo', 'Brazil', '2023-07-09', 'active'),
  (9, 'Priya', 'Sharma', 'priya.sharma@example.in', 'Bengaluru', 'India', '2023-08-14', 'active'),
  (10, 'Liam', 'OConnor', 'liam.oc@example.ie', 'Dublin', 'Ireland', '2023-09-03', 'churned'),
  (11, 'Zara', 'Al-Mansoor', 'zara.m@example.ae', 'Dubai', 'UAE', '2023-10-19', 'new'),
  (12, 'Elijah', 'Sterling', 'elijah.s@example.ca', 'Toronto', 'Canada', '2023-11-25', 'new');

-- Seed Orders
INSERT INTO orders (id, customer_id, order_date, status, total_amount, shipping_fee) VALUES
  (101, 1, '2023-11-01', 'delivered', 279.98, 9.99),
  (102, 2, '2023-11-03', 'delivered', 420.00, 0.00),
  (103, 3, '2023-11-05', 'delivered', 174.00, 15.00),
  (104, 5, '2023-11-08', 'delivered', 199.99, 0.00),
  (105, 6, '2023-11-12', 'delivered', 637.50, 12.00),
  (106, 1, '2023-11-15', 'delivered', 104.49, 5.00),
  (107, 7, '2023-11-18', 'delivered', 175.00, 8.50),
  (108, 8, '2023-11-20', 'cancelled', 389.00, 15.00),
  (109, 9, '2023-11-22', 'delivered', 159.00, 0.00),
  (110, 4, '2023-11-25', 'delivered', 149.50, 7.50),
  (111, 2, '2023-12-01', 'delivered', 514.00, 0.00),
  (112, 10, '2023-12-04', 'delivered', 110.00, 10.00),
  (113, 11, '2023-12-08', 'shipped', 227.99, 8.00),
  (114, 3, '2023-12-11', 'processing', 389.00, 0.00),
  (115, 6, '2023-12-15', 'delivered', 79.50, 5.00);

-- Seed Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, discount_amount) VALUES
  (1, 101, 1, 1, 199.99, 0.00),
  (2, 101, 7, 1, 79.99, 0.00),
  (3, 102, 10, 1, 420.00, 0.00),
  (4, 103, 8, 2, 55.00, 10.00),
  (5, 103, 9, 3, 24.50, 0.00),
  (6, 104, 1, 1, 199.99, 0.00),
  (7, 105, 3, 1, 389.00, 0.00),
  (8, 105, 2, 1, 149.50, 0.00),
  (9, 105, 15, 1, 68.00, 0.00),
  (10, 105, 9, 1, 24.50, 0.00),
  (11, 106, 8, 1, 55.00, 0.00),
  (12, 106, 9, 2, 24.50, 0.00),
  (13, 107, 6, 1, 175.00, 0.00),
  (14, 108, 3, 1, 389.00, 0.00),
  (15, 109, 4, 1, 129.00, 0.00),
  (16, 109, 14, 1, 28.00, 0.00),
  (17, 110, 2, 1, 149.50, 0.00),
  (18, 111, 10, 1, 420.00, 0.00),
  (19, 111, 13, 1, 85.00, 0.00),
  (20, 112, 5, 1, 110.00, 0.00),
  (21, 113, 2, 1, 149.50, 0.00),
  (22, 113, 7, 1, 79.99, 0.00),
  (23, 114, 3, 1, 389.00, 0.00),
  (24, 115, 8, 1, 55.00, 0.00),
  (25, 115, 9, 1, 24.50, 0.00);

-- Seed Payments
INSERT INTO payments (id, order_id, payment_method, amount, payment_date, status) VALUES
  (1, 101, 'credit_card', 279.98, '2023-11-01', 'completed'),
  (2, 102, 'paypal', 420.00, '2023-11-03', 'completed'),
  (3, 103, 'credit_card', 174.00, '2023-11-05', 'completed'),
  (4, 104, 'credit_card', 199.99, '2023-11-08', 'completed'),
  (5, 105, 'bank_transfer', 637.50, '2023-11-12', 'completed'),
  (6, 106, 'paypal', 104.49, '2023-11-15', 'completed'),
  (7, 107, 'credit_card', 175.00, '2023-11-18', 'completed'),
  (8, 108, 'credit_card', 389.00, '2023-11-20', 'failed'),
  (9, 109, 'credit_card', 159.00, '2023-11-22', 'completed'),
  (10, 110, 'paypal', 149.50, '2023-11-25', 'completed'),
  (11, 111, 'credit_card', 514.00, '2023-12-01', 'completed'),
  (12, 112, 'credit_card', 110.00, '2023-12-04', 'refunded'),
  (13, 113, 'paypal', 227.99, '2023-12-08', 'completed'),
  (14, 114, 'credit_card', 389.00, '2023-12-11', 'completed'),
  (15, 115, 'credit_card', 79.50, '2023-12-15', 'completed');

-- Seed Returns
INSERT INTO returns (id, order_item_id, return_date, reason, refund_amount) VALUES
  (1, 4, '2023-11-14', 'defective', 55.00),
  (2, 13, '2023-11-28', 'wrong_item', 175.00),
  (3, 20, '2023-12-09', 'changed_mind', 110.00),
  (4, 11, '2023-11-29', 'late_delivery', 55.00);

-- Seed Discounts
INSERT INTO discounts (id, code, discount_percent, valid_from, valid_to, min_purchase) VALUES
  (1, 'WELCOME10', 10, '2023-01-01', '2024-12-31', 50.00),
  (2, 'BLACKFRIDAY20', 20, '2023-11-20', '2023-11-30', 100.00),
  (3, 'VIP25', 25, '2023-01-01', '2024-12-31', 250.00),
  (4, 'FREESHIP', 0, '2023-06-01', '2024-06-01', 75.00),
  (5, 'HOLIDAY15', 15, '2023-12-01', '2023-12-31', NULL);
`,
};
