import { Chapter } from "./types";

export const chapter4: Chapter = {
  id: 4,
  slug: "connecting-the-tables",
  title: "Connecting the Tables",
  subtitle: "Mastering relational relationships with INNER JOIN, LEFT JOIN, and multi-table joins",
  capabilityStatement: "Traverse normalized schemas, connect primary and foreign keys, uncover unplaced orders, and join multi-tier entities.",
  estimatedHours: 2.0,
  totalXp: 500,
  badgeId: "join_apprentice",
  lessons: [
    {
      id: "ch4-l1",
      chapterId: 4,
      slug: "relational-foundations-inner-join",
      order: 1,
      title: "Relational Foundations: INNER JOIN",
      difficulty: "Beginner",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "Relational databases separate concepts into different tables linked by keys: a Primary Key (PK) uniquely identifies a row in its table, while a Foreign Key (FK) in another table points to that PK. An INNER JOIN merges rows from two tables when their joining keys match.",
      syntaxExamples: "SELECT orders.id, customers.email\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.id;",
      whyItMatters:
        "Without joins, databases would duplicate customer names and addresses inside every single order row, causing massive data anomalies.",
      commonMistakes:
        "Omitting the ON condition (which causes a full Cartesian cross product of every row with every other row!).",
      rememberThis:
        "INNER JOIN keeps only rows where a match exists in BOTH tables.",
      analystContext:
        "We need to display delivered orders alongside the customer's full name and email for shipping confirmation reconciliation.",
      taskPrompt:
        "Join orders with customers. Select orders.id AS order_id, customers.first_name, customers.last_name, and orders.total_amount from orders JOIN customers ON orders.customer_id = customers.id where orders.status = 'delivered'.",
      starterSql: "-- Join orders and customers\nSELECT orders.id AS order_id, customers.first_name, customers.last_name, orders.total_amount\nFROM orders\nJOIN customers ON ",
      referenceSql: "SELECT orders.id AS order_id, customers.first_name, customers.last_name, orders.total_amount FROM orders JOIN customers ON orders.customer_id = customers.id WHERE orders.status = 'delivered';",
      hints: [
        { costXp: 5, text: "Match the keys: ON orders.customer_id = customers.id" },
        { costXp: 5, text: "Filter by: WHERE orders.status = 'delivered'" },
      ],
      solutionExplanation:
        "The ON clause joins each order to its corresponding customer record using the shared customer_id key.",
      xpReward: 50,
      tags: ["join", "inner-join", "keys"],
      prerequisites: ["ch3-l4"],
    },
    {
      id: "ch4-l2",
      chapterId: 4,
      slug: "table-aliases-for-clean-joins",
      order: 2,
      title: "Table Aliasing in Joins",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "Typing full table names repeatedly (e.g. `order_items.product_id = products.id`) clutters queries. Assign short aliases in the FROM and JOIN clauses (e.g. `FROM order_items oi JOIN products p ON oi.product_id = p.id`).",
      syntaxExamples: "SELECT o.id, c.email\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;",
      whyItMatters:
        "Short, descriptive table aliases are the industry standard for production SQL readability.",
      commonMistakes:
        "Defining an alias in the FROM clause (e.g. `FROM customers c`) and then trying to reference `customers.email` in the SELECT clause in databases that enforce alias exclusivity.",
      rememberThis:
        "Once a table alias is declared, use it consistently throughout the query.",
      analystContext:
        "Merchandising needs to see each product name alongside its category name.",
      taskPrompt:
        "Join products (alias p) with categories (alias c) on p.category_id = c.id. Select p.name AS product_name, c.name AS category_name, and p.price.",
      starterSql: "-- Product and category join\nSELECT p.name AS product_name, c.name AS category_name, p.price\nFROM products p\nJOIN categories c ON ",
      referenceSql: "SELECT p.name AS product_name, c.name AS category_name, p.price FROM products p JOIN categories c ON p.category_id = c.id;",
      hints: [
        { costXp: 5, text: "Write: ON p.category_id = c.id" },
      ],
      solutionExplanation:
        "Using aliases 'p' and 'c' clarifies which table's 'name' column is being projected.",
      xpReward: 45,
      tags: ["join", "table-alias", "categories"],
      prerequisites: ["ch4-l1"],
    },
    {
      id: "ch4-l3",
      chapterId: 4,
      slug: "left-join-preserving-entities",
      order: 3,
      title: "Preserving Records: LEFT JOIN",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "An INNER JOIN discards rows that have no match on the opposite table. A LEFT JOIN preserves ALL rows from the left table; if no matching row exists on the right table, columns from the right table are filled with NULL.",
      syntaxExamples: "SELECT c.id, c.first_name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;",
      whyItMatters:
        "If you use INNER JOIN to calculate average spend across all customers, you silently drop all registered customers who haven't ordered yet, artificially skewing your conversion rate!",
      commonMistakes:
        "Using an INNER JOIN when evaluating inactive or non-converted users.",
      rememberThis:
        "LEFT JOIN keeps everything on the left table, inserting NULLs if no right-side match exists.",
      analystContext:
        "The CRM growth team wants a roster of every customer in the database and their orders if any exist. Notice that customer 12 has never ordered.",
      taskPrompt:
        "Query customers (alias c) LEFT JOIN orders (alias o) on c.id = o.customer_id. Select c.id AS customer_id, c.first_name, c.last_name, and o.id AS order_id.",
      starterSql: "-- Left join customers and orders\nSELECT c.id AS customer_id, c.first_name, c.last_name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON ",
      referenceSql: "SELECT c.id AS customer_id, c.first_name, c.last_name, o.id AS order_id FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;",
      hints: [
        { costXp: 5, text: "Write: ON c.id = o.customer_id" },
      ],
      solutionExplanation:
        "LEFT JOIN guarantees that registered customers with 0 orders remain present in the output, showing NULL for order_id.",
      xpReward: 55,
      tags: ["left-join", "null-padding", "crm"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch4-l4",
      chapterId: 4,
      slug: "finding-unmatched-records-anti-join",
      order: 4,
      title: "The Anti-Join: Finding Unmatched Rows",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "Combining a LEFT JOIN with a `WHERE right_table.id IS NULL` filter isolates rows in the left table that have ZERO matches in the right table. This pattern is commonly called an anti-join.",
      syntaxExamples: "SELECT c.id, c.email\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;",
      whyItMatters:
        "Finding customers with zero purchases, products with zero sales, or employees with zero logged hours is a critical discovery workflow.",
      commonMistakes:
        "Filtering by `o.id = NULL` instead of `o.id IS NULL`.",
      rememberThis:
        "LEFT JOIN + WHERE right_table.key IS NULL isolates orphans and non-converting entities.",
      analystContext:
        "Product inventory wants to find all products in our catalog that have NEVER been ordered by any customer.",
      taskPrompt:
        "Join products (alias p) LEFT JOIN order_items (alias oi) on p.id = oi.product_id. Filter where oi.id IS NULL to find unpurchased items. Select p.id, p.name, and p.price.",
      starterSql: "-- Find unpurchased products\nSELECT p.id, p.name, p.price\nFROM products p\nLEFT JOIN order_items oi ON p.id = oi.product_id\nWHERE ",
      referenceSql: "SELECT p.id, p.name, p.price FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id WHERE oi.id IS NULL;",
      hints: [
        { costXp: 5, text: "Filter using: WHERE oi.id IS NULL" },
      ],
      solutionExplanation:
        "The LEFT JOIN checks for matches in order_items, and WHERE oi.id IS NULL isolates products with zero sales.",
      xpReward: 60,
      tags: ["anti-join", "left-join", "is-null"],
      prerequisites: ["ch4-l3"],
    },
    {
      id: "ch4-l5",
      chapterId: 4,
      slug: "why-no-right-join-in-sqlite",
      order: 5,
      title: "Flipping Tables: RIGHT JOIN Equivalents",
      difficulty: "Intermediate",
      estimatedMinutes: 6,
      type: "choose-join",
      conceptExplanation:
        "Many database engines support RIGHT JOIN (preserving all rows from the right table). However, standard SQLite does not natively implement RIGHT JOIN or FULL OUTER JOIN. In SQLite and analytical best practices, you simply swap the order of the tables and use LEFT JOIN instead!",
      syntaxExamples: "-- Instead of: A RIGHT JOIN B ON ...\n-- Write: B LEFT JOIN A ON ...",
      whyItMatters:
        "Query engines optimize LEFT JOIN thoroughly. Expressing your core entity first in the FROM clause improves cognitive readability.",
      commonMistakes:
        "Attempting to write 'RIGHT JOIN' in SQLite, which triggers a syntax error.",
      rememberThis:
        "'TableA RIGHT JOIN TableB' is functionally identical to 'TableB LEFT JOIN TableA'.",
      analystContext:
        "A junior analyst wrote a query trying to RIGHT JOIN customers onto orders. Rephrase it cleanly as a LEFT JOIN starting from customers.",
      taskPrompt:
        "Select c.id AS customer_id, c.first_name, COUNT(o.id) AS total_orders from customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name ORDER BY total_orders DESC.",
      starterSql: "-- Reversible LEFT JOIN pattern\nSELECT c.id AS customer_id, c.first_name, COUNT(o.id) AS total_orders\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.first_name\nORDER BY total_orders DESC;",
      referenceSql: "SELECT c.id AS customer_id, c.first_name, COUNT(o.id) AS total_orders FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name ORDER BY total_orders DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Count o.id so that customers with 0 orders get a count of 0." },
      ],
      solutionExplanation:
        "Starting with customers and LEFT JOINing orders ensures that even customers with zero orders appear with total_orders = 0.",
      xpReward: 50,
      tags: ["left-join", "right-join", "sqlite"],
      prerequisites: ["ch4-l3"],
    },
    {
      id: "ch4-l6",
      chapterId: 4,
      slug: "joining-three-or-more-tables",
      order: 6,
      title: "Chaining Multi-Table Joins",
      difficulty: "Intermediate",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Real transactions span chains of tables. For example: `customers` -> `orders` -> `order_items` -> `products`. You can chain multiple JOIN clauses one after another.",
      syntaxExamples: "SELECT c.first_name, p.name, oi.quantity\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id;",
      whyItMatters:
        "Connecting who purchased what specific product requires traversing through the junction order_items table.",
      commonMistakes:
        "Attempting to join order_items directly to customers without passing through the intermediate orders table.",
      rememberThis:
        "Follow the foreign key chain: customers -> orders -> order_items -> products.",
      analystContext:
        "We need an itemized purchase report showing customer last_name, order id, product name, and quantity for all items purchased.",
      taskPrompt:
        "Join customers (c), orders (o), order_items (oi), and products (p). Select c.last_name, o.id AS order_id, p.name AS product_name, oi.quantity. Order by o.id ASC, p.name ASC.",
      starterSql: "-- 4-table join query\nSELECT c.last_name, o.id AS order_id, p.name AS product_name, oi.quantity\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nORDER BY o.id ASC, p.name ASC;",
      referenceSql: "SELECT c.last_name, o.id AS order_id, p.name AS product_name, oi.quantity FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id ORDER BY o.id ASC, p.name ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Follow the joins: c.id = o.customer_id, then o.id = oi.order_id, then oi.product_id = p.id." },
      ],
      solutionExplanation:
        "This query bridges four distinct relational tables along their foreign key pathways.",
      xpReward: 60,
      tags: ["multi-table", "joins", "normalization"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch4-l7",
      chapterId: 4,
      slug: "self-joins-for-hierarchies",
      order: 7,
      title: "Self-Joins for Hierarchies",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "A self-join joins a table to itself. This is used when rows within the same table reference other rows in the same table, such as category parent-child hierarchies or employee manager structures.",
      syntaxExamples: "SELECT child.name AS subcategory, parent.name AS main_category\nFROM categories child\nJOIN categories parent ON child.parent_id = parent.id;",
      whyItMatters:
        "Taxonomies, organizational trees, and bill-of-materials are stored as self-referencing rows.",
      commonMistakes:
        "Forgetting to use distinct table aliases (e.g. `c1` and `c2`) for each instance of the table.",
      rememberThis:
        "Treat the two instances of the table as if they were completely different tables by giving them distinct aliases.",
      analystContext:
        "The site navigation team needs to map every subcategory to its respective parent category name.",
      taskPrompt:
        "Join categories (alias child) to categories (alias parent) on child.parent_id = parent.id. Select child.name AS subcategory, parent.name AS parent_category. Order by subcategory ASC.",
      starterSql: "-- Category hierarchy self join\nSELECT child.name AS subcategory, parent.name AS parent_category\nFROM categories child\nJOIN categories parent ON ",
      referenceSql: "SELECT child.name AS subcategory, parent.name AS parent_category FROM categories child JOIN categories parent ON child.parent_id = parent.id ORDER BY subcategory ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Write: ON child.parent_id = parent.id ORDER BY subcategory ASC;" },
      ],
      solutionExplanation:
        "The self-join pairs each child category row with the row representing its parent.",
      xpReward: 60,
      tags: ["self-join", "hierarchy", "taxonomies"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch4-l8",
      chapterId: 4,
      slug: "chapter-4-mastery",
      order: 8,
      title: "Mastery Challenge: Customer Lifetime Spend Audit",
      difficulty: "Advanced",
      estimatedMinutes: 12,
      type: "mastery-challenge",
      conceptExplanation:
        "Unify LEFT JOIN, GROUP BY, aggregations, NULL coalescing, and sorting in an enterprise customer audit.",
      syntaxExamples: "SELECT c.id, c.first_name, COUNT(o.id) AS orders_placed, COALESCE(SUM(o.total_amount), 0) AS lifetime_value\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.first_name\nORDER BY lifetime_value DESC;",
      whyItMatters:
        "Every consumer tech business computes Customer Lifetime Value (LTV). Calculating it correctly while keeping non-purchasing users with zero spend is paramount.",
      commonMistakes:
        "Using INNER JOIN (which drops users with 0 spend) or writing SUM(o.total_amount) without handling NULLs for non-purchasers.",
      rememberThis:
        "LEFT JOIN + COUNT(o.id) counts 0 orders when no match exists, because COUNT(NULL) evaluates to 0.",
      analystContext:
        "The VP of Growth requests an exhaustive customer spending breakdown: For every customer in the database (including those with 0 purchases), display their customer_id (c.id), full name combined as 'full_name' (c.first_name || ' ' || c.last_name), count of orders placed ('order_count'), and total spend rounded to 2 decimals ('total_spent'). If a customer has no orders, total_spent must show 0.0. Sort by total_spent descending, then customer_id ascending.",
      taskPrompt:
        "From customers c LEFT JOIN orders o ON c.id = o.customer_id, select c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, COUNT(o.id) AS order_count, ROUND(COALESCE(SUM(o.total_amount), 0.0), 2) AS total_spent. Group by c.id, c.first_name, c.last_name. Order by total_spent DESC, customer_id ASC.",
      starterSql: "-- Customer Lifetime Spend Audit\n",
      referenceSql: "SELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, COUNT(o.id) AS order_count, ROUND(COALESCE(SUM(o.total_amount), 0.0), 2) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name, c.last_name ORDER BY total_spent DESC, customer_id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Combine names with (c.first_name || ' ' || c.last_name) AS full_name" },
        { costXp: 10, text: "Use ROUND(COALESCE(SUM(o.total_amount), 0.0), 2) AS total_spent" },
      ],
      solutionExplanation:
        "This joins all customers, preserves non-purchasers using LEFT JOIN, aggregates order totals, safeguards against NULLs, and sorts systematically.",
      xpReward: 90,
      tags: ["mastery", "chapter4", "ltv", "left-join"],
      prerequisites: ["ch4-l6", "ch4-l7"],
    },
  ],
};
