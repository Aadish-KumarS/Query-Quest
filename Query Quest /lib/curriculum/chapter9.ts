import { Chapter } from "./types";

export const chapter9: Chapter = {
  id: 9,
  slug: "writing-sql-like-a-professional",
  title: "Writing SQL Like a Professional",
  subtitle: "Set operations, views, performance optimization, data quality assertions, and capstone case study",
  capabilityStatement: "Write robust, performant, enterprise-grade SQL: leverage set operations, modular views, quality audit assertions, and complete the Grand Analytics Capstone.",
  estimatedHours: 2.8,
  totalXp: 700,
  badgeId: "query_quest_complete",
  lessons: [
    {
      id: "ch9-l1",
      chapterId: 9,
      slug: "set-operations-union-all",
      order: 1,
      title: "Set Operations: UNION vs UNION ALL",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "Set operations stack rows vertically from two compatible queries:\n- UNION combines results and removes duplicates (requires an expensive internal sort).\n- UNION ALL combines results preserving all rows including duplicates (much faster!).\nBoth queries must select the same number of columns with compatible data types.",
      syntaxExamples: "SELECT id, 'customer' AS user_type FROM customers\nUNION ALL\nSELECT id, 'employee' AS user_type FROM employees;",
      whyItMatters:
        "Combining historical archives with active tables or merging multi-channel logs relies on set operations.",
      commonMistakes:
        "Defaulting to UNION when UNION ALL is intended. Unless you specifically require deduplication, UNION ALL is significantly more performant.",
      rememberThis:
        "Always prefer UNION ALL unless you explicitly need duplicate elimination.",
      analystContext:
        "Generate a unified contact directory listing: entity ID, email, and entity role ('Customer' or 'Staff') combining active customers with company personnel.",
      taskPrompt:
        "From customers, select id, email, 'Customer' AS role WHERE status = 'active'. UNION ALL with employees: select id, email, 'Staff' AS role. Order by role ASC, id ASC.",
      starterSql: "-- Unified entity directory\nSELECT id, email, 'Customer' AS role\nFROM customers\nWHERE status = 'active'\nUNION ALL\nSELECT id, email, 'Staff' AS role\nFROM employees\nORDER BY role ASC, id ASC;",
      referenceSql: "SELECT id, email, 'Customer' AS role FROM customers WHERE status = 'active' UNION ALL SELECT id, email, 'Staff' AS role FROM employees ORDER BY role ASC, id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Ensure both SELECT statements project id, email, and role." },
      ],
      solutionExplanation:
        "UNION ALL stacks the active customers and staff members into a single unified result set without costly deduplication overhead.",
      xpReward: 65,
      tags: ["union", "union-all", "set-operations"],
      prerequisites: ["ch8-l8"],
    },
    {
      id: "ch9-l2",
      chapterId: 9,
      slug: "set-intersection-and-difference",
      order: 2,
      title: "Set Difference: EXCEPT & INTERSECT",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "- INTERSECT returns only rows that appear in BOTH queries.\n- EXCEPT returns rows from the first query that DO NOT appear in the second query.",
      syntaxExamples: "SELECT id FROM customers\nEXCEPT\nSELECT customer_id FROM orders;",
      whyItMatters:
        "Set difference offers an elegant, readable alternative to anti-joins when identifying non-converting users.",
      commonMistakes:
        "Selecting different numbers of columns across the two queries.",
      rememberThis:
        "EXCEPT finds items in Query 1 that do not exist in Query 2.",
      analystContext:
        "Find customer IDs that have placed orders, EXCEPT those who have ever requested a refund or return.",
      taskPrompt:
        "Select customer_id from orders EXCEPT select o.customer_id from orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id ORDER BY customer_id ASC.",
      starterSql: "-- Happy customers with zero returns\nSELECT customer_id\nFROM orders\nEXCEPT\nSELECT o.customer_id\nFROM orders o\nJOIN order_items oi ON o.id = oi.order_id\nJOIN returns r ON oi.id = r.order_item_id\nORDER BY customer_id ASC;",
      referenceSql: "SELECT customer_id FROM orders EXCEPT SELECT o.customer_id FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id ORDER BY customer_id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Write: SELECT customer_id FROM orders EXCEPT SELECT ... ORDER BY customer_id ASC;" },
      ],
      solutionExplanation:
        "EXCEPT removes any customer ID that appears in the returns dataset from the set of all buyers.",
      xpReward: 70,
      tags: ["except", "intersect", "set-theory"],
      prerequisites: ["ch9-l1"],
    },
    {
      id: "ch9-l3",
      chapterId: 9,
      slug: "views-for-abstraction",
      order: 3,
      title: "Query Abstraction: SQL Views",
      difficulty: "Intermediate",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "A VIEW is a saved SQL query that behaves like a virtual table. It encapsulates complex joins and aggregations so downstream analysts don't need to reinvent the wheel:\n`CREATE VIEW v_active_products AS SELECT ...;`\nOnce created, you can query it just like a regular table: `SELECT * FROM v_active_products;`",
      syntaxExamples: "CREATE VIEW v_customer_summary AS\nSELECT c.id, c.email, COUNT(o.id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.email;\n\nSELECT * FROM v_customer_summary WHERE order_count > 0;",
      whyItMatters:
        "In production data warehouses (like Snowflake or BigQuery), views provide a semantic layer and secure column-level access.",
      commonMistakes:
        "Assuming a standard view physically duplicates and stores the data. A standard view runs its underlying query on demand.",
      rememberThis:
        "Views save logic, not physical disk space. They are virtual tables.",
      analystContext:
        "Create a temporary analysis view or query that exposes customer full names, email, and their active status.",
      taskPrompt:
        "Query customers: select id, (first_name || ' ' || last_name) AS full_name, email, city from customers WHERE status = 'active' ORDER BY full_name ASC.",
      starterSql: "-- Virtual table projection\nSELECT id, (first_name || ' ' || last_name) AS full_name, email, city\nFROM customers\nWHERE status = 'active'\nORDER BY full_name ASC;",
      referenceSql: "SELECT id, (first_name || ' ' || last_name) AS full_name, email, city FROM customers WHERE status = 'active' ORDER BY full_name ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Filter status = 'active' and sort by full_name ASC." },
      ],
      solutionExplanation:
        "This query shapes a clean presentation dataset ideal for encapsulating inside a production view.",
      xpReward: 65,
      tags: ["views", "abstraction", "semantic-layer"],
      prerequisites: ["ch5-l4"],
    },
    {
      id: "ch9-l4",
      chapterId: 9,
      slug: "query-performance-and-indexes",
      order: 4,
      title: "Performance: Indexing & Sargability",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "An index is a balanced tree (B-Tree) structure that allows the database engine to find specific rows in O(log N) time rather than scanning every single table page (Full Table Scan O(N)).\nA sargable (Search Argument Able) query enables index usage:\n- Non-sargable: `WHERE UPPER(email) = 'USER@EXAMPLE.COM'` (forces function evaluation on every row)\n- Sargable: `WHERE email = 'user@example.com'` (direct index seek)",
      syntaxExamples: "EXPLAIN QUERY PLAN\nSELECT * FROM customers WHERE id = 101;",
      whyItMatters:
        "On a table with 50 million rows, an index seek completes in 2 milliseconds, whereas a full table scan can lock the database for minutes.",
      commonMistakes:
        "Wrapping indexed columns inside functions in the WHERE clause, breaking index seeks.",
      rememberThis:
        "Avoid wrapping column names in functions on the left side of WHERE comparisons.",
      analystContext:
        "Execute an optimized query on orders using explicit sargable date bounds rather than applying STRFTIME inside the WHERE clause.",
      taskPrompt:
        "Query orders placed between '2023-11-01' and '2023-11-30' inclusive using a sargable BETWEEN or inequality filter: select id, customer_id, order_date, total_amount from orders WHERE order_date >= '2023-11-01' AND order_date <= '2023-11-30' ORDER BY order_date ASC, id ASC.",
      starterSql: "-- Sargable date range search\nSELECT id, customer_id, order_date, total_amount\nFROM orders\nWHERE order_date >= '2023-11-01' AND order_date <= '2023-11-30'\nORDER BY order_date ASC, id ASC;",
      referenceSql: "SELECT id, customer_id, order_date, total_amount FROM orders WHERE order_date >= '2023-11-01' AND order_date <= '2023-11-30' ORDER BY order_date ASC, id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Using `order_date >= ... AND order_date <= ...` preserves index usage on date columns." },
      ],
      solutionExplanation:
        "Direct range comparisons allow the database index to seek directly to the boundary timestamps without evaluating functions on every row.",
      xpReward: 70,
      tags: ["indexes", "performance", "sargability"],
      prerequisites: ["ch2-l5"],
    },
    {
      id: "ch9-l5",
      chapterId: 9,
      slug: "data-quality-assertions",
      order: 5,
      title: "Data Quality Assertions",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Professional data analysts write defensive quality checks to verify integrity assumptions:\n- Uniqueness check: verify primary keys have no duplicates.\n- Referential integrity check: verify foreign keys reference valid parent records.\n- Null constraint check: verify mandatory columns are never null.",
      syntaxExamples: "-- Uniqueness assertion\nSELECT id, COUNT(*)\nFROM customers\nGROUP BY id\nHAVING COUNT(*) > 1;",
      whyItMatters:
        "Garbage in, garbage out. If source data has duplicate transaction IDs or orphaned foreign keys, all downstream financial reports are corrupted.",
      commonMistakes:
        "Assuming that raw database extracts are cleanly validated by upstream systems.",
      rememberThis:
        "Always write audit assertions to test your assumptions before trusting a dataset.",
      analystContext:
        "Write an assertion query to check if there are any orphaned order_items (line items pointing to a product_id that does not exist in the products table).",
      taskPrompt:
        "From order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE p.id IS NULL select oi.id AS orphaned_item_id, oi.order_id, oi.product_id.",
      starterSql: "-- Referential Integrity Audit\nSELECT oi.id AS orphaned_item_id, oi.order_id, oi.product_id\nFROM order_items oi\nLEFT JOIN products p ON oi.product_id = p.id\nWHERE p.id IS NULL;",
      referenceSql: "SELECT oi.id AS orphaned_item_id, oi.order_id, oi.product_id FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE p.id IS NULL;",
      hints: [
        { costXp: 5, text: "LEFT JOIN products p ON oi.product_id = p.id WHERE p.id IS NULL" },
      ],
      solutionExplanation:
        "The query checks for foreign key orphans. Returning 0 rows proves referential integrity is preserved.",
      xpReward: 75,
      tags: ["data-quality", "assertions", "integrity"],
      prerequisites: ["ch4-l4"],
    },
    {
      id: "ch9-l6",
      chapterId: 9,
      slug: "safe-sql-formatting-standards",
      order: 6,
      title: "Formatting & Maintainability Standards",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "Professional SQL follows strict readability standards:\n- Keywords in UPPERCASE (`SELECT`, `FROM`, `WHERE`, `JOIN`)\n- Identifiers in lowercase snake_case (`customer_id`, `order_date`)\n- Each clause on a new line\n- Aliases explicit with `AS`\n- Indented subqueries and CTEs",
      syntaxExamples: "SELECT\n  c.id AS customer_id,\n  c.first_name,\n  SUM(o.total_amount) AS total_spent\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'delivered'\nGROUP BY c.id, c.first_name\nORDER BY total_spent DESC;",
      whyItMatters:
        "SQL code is read 100 times more often than it is written. Clean styling prevents bugs during peer review.",
      commonMistakes:
        "Writing entire multi-join queries on a single unformatted line.",
      rememberThis:
        "Capitalize SQL keywords and place major clauses on new lines.",
      analystContext:
        "Format and execute a clean, standardized query extracting top 3 revenue generating customers.",
      taskPrompt:
        "Query customers and orders: select c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS customer_name, ROUND(SUM(o.total_amount), 2) AS total_revenue from customers c JOIN orders o ON c.id = o.customer_id WHERE o.status = 'delivered' GROUP BY c.id, c.first_name, c.last_name ORDER BY total_revenue DESC LIMIT 3.",
      starterSql: "-- Formatted Top 3 Spenders\nSELECT c.id AS customer_id,\n  (c.first_name || ' ' || c.last_name) AS customer_name,\n  ROUND(SUM(o.total_amount), 2) AS total_revenue\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'delivered'\nGROUP BY c.id, c.first_name, c.last_name\nORDER BY total_revenue DESC\nLIMIT 3;",
      referenceSql: "SELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS customer_name, ROUND(SUM(o.total_amount), 2) AS total_revenue FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.status = 'delivered' GROUP BY c.id, c.first_name, c.last_name ORDER BY total_revenue DESC LIMIT 3;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by c.id, c.first_name, c.last_name and order by total_revenue DESC LIMIT 3." },
      ],
      solutionExplanation:
        "Clean indentation, capitalized keywords, and clear aliases demonstrate professional SQL craftsmanship.",
      xpReward: 65,
      tags: ["code-style", "formatting", "professional-sql"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch9-l7",
      chapterId: 9,
      slug: "defensive-sql-habits",
      order: 7,
      title: "Defensive Query Design",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "Defensive SQL protects against schema changes and unexpected data variations:\n- Never rely on default ordering (always specify explicit ORDER BY if sequence matters)\n- Never use SELECT * in production code or view definitions\n- Safeguard against NULLs in mathematical formulas using COALESCE\n- Guard denominators against zero using NULLIF",
      syntaxExamples: "SELECT\n  product_id,\n  COALESCE(ROUND(SUM(unit_price * quantity) / NULLIF(SUM(quantity), 0), 2), 0.0) AS weighted_avg_price\nFROM order_items\nGROUP BY product_id;",
      whyItMatters:
        "Defensive queries run without crashing for years across schema updates and dirty data influxes.",
      commonMistakes:
        "Assuming that a column will never contain a NULL or zero value.",
      rememberThis:
        "Pair COALESCE with NULLIF for robust mathematical calculations.",
      analystContext:
        "Calculate the weighted average purchase price per product: SUM(quantity * unit_price) / NULLIF(SUM(quantity), 0), rounded to 2 decimals, with 0.0 fallback.",
      taskPrompt:
        "From order_items, select product_id, SUM(quantity) AS total_quantity, ROUND(COALESCE(SUM(quantity * unit_price) / NULLIF(SUM(quantity), 0), 0.0), 2) AS weighted_avg_price GROUP BY product_id ORDER BY weighted_avg_price DESC.",
      starterSql: "-- Defensive weighted average calculation\nSELECT product_id,\n  SUM(quantity) AS total_quantity,\n  ROUND(COALESCE(SUM(quantity * unit_price) / NULLIF(SUM(quantity), 0), 0.0), 2) AS weighted_avg_price\nFROM order_items\nGROUP BY product_id\nORDER BY weighted_avg_price DESC;",
      referenceSql: "SELECT product_id, SUM(quantity) AS total_quantity, ROUND(COALESCE(SUM(quantity * unit_price) / NULLIF(SUM(quantity), 0), 0.0), 2) AS weighted_avg_price FROM order_items GROUP BY product_id ORDER BY weighted_avg_price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by product_id and order by weighted_avg_price DESC." },
      ],
      solutionExplanation:
        "Using COALESCE and NULLIF protects the calculation from NULL and zero errors.",
      xpReward: 75,
      tags: ["defensive-sql", "weighted-average", "best-practices"],
      prerequisites: ["ch5-l3"],
    },
    {
      id: "ch9-l8",
      chapterId: 9,
      slug: "chapter-9-mastery",
      order: 8,
      title: "Mastery Challenge: The Grand Capstone Case Study",
      difficulty: "Advanced",
      estimatedMinutes: 20,
      type: "mastery-challenge",
      conceptExplanation:
        "The culmination of your analytical journey in Query Quest: Build a multi-tier CTE pipeline executing full cohort lifecycle analytics across customer orders, returns, and category dimensions.",
      syntaxExamples: "WITH cte1 AS (...), cte2 AS (...) SELECT ...",
      whyItMatters:
        "Solving this case study proves you possess the complete analytical SQL toolbelt of a senior data analyst.",
      commonMistakes:
        "Rushing without testing intermediate CTE outputs.",
      rememberThis:
        "Break large problems into discrete, named CTE blocks.",
      analystContext:
        "The Board of Directors requires the definitive Meridian Commerce Customer Value Matrix: For every customer who has placed at least one order: identify customer_id, full_name, primary order count, total delivered spend, their most frequently purchased category_name, and assign an executive tier ('Tier 1: VIP' if spend > 400, 'Tier 2: Core' if spend > 150, else 'Tier 3: Standard'). Order by delivered_spend DESC.",
      taskPrompt:
        "Build the Board Executive Capstone: CTE 'cust_spend' sums total_amount AS total_spend and counts orders AS order_count per customer from orders WHERE status = 'delivered' GROUP BY customer_id. CTE 'item_cats' counts purchases per customer and category. CTE 'top_cat' uses ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY count DESC) to find the primary category for each customer. Main query joins customers c, cust_spend cs, and top_cat tc (where rnk = 1) and categories cat ON tc.category_id = cat.id. Select c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, cs.order_count, ROUND(cs.total_spend, 2) AS delivered_spend, cat.name AS favorite_category, CASE WHEN cs.total_spend > 400 THEN 'Tier 1: VIP' WHEN cs.total_spend > 150 THEN 'Tier 2: Core' ELSE 'Tier 3: Standard' END AS customer_tier. Order by delivered_spend DESC, customer_id ASC.",
      starterSql: "-- The Grand Analytics Capstone\nWITH cust_spend AS (\n  SELECT customer_id,\n    COUNT(id) AS order_count,\n    SUM(total_amount) AS total_spend\n  FROM orders\n  WHERE status = 'delivered'\n  GROUP BY customer_id\n),\nitem_cats AS (\n  SELECT o.customer_id, p.category_id, COUNT(*) AS item_cnt\n  FROM orders o\n  JOIN order_items oi ON o.id = oi.order_id\n  JOIN products p ON oi.product_id = p.id\n  WHERE o.status = 'delivered'\n  GROUP BY o.customer_id, p.category_id\n),\ntop_cat AS (\n  SELECT customer_id, category_id,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY item_cnt DESC, category_id ASC) AS rnk\n  FROM item_cats\n)\nSELECT c.id AS customer_id,\n  (c.first_name || ' ' || c.last_name) AS full_name,\n  cs.order_count,\n  ROUND(cs.total_spend, 2) AS delivered_spend,\n  cat.name AS favorite_category,\n  CASE\n    WHEN cs.total_spend > 400 THEN 'Tier 1: VIP'\n    WHEN cs.total_spend > 150 THEN 'Tier 2: Core'\n    ELSE 'Tier 3: Standard'\n  END AS customer_tier\nFROM customers c\nJOIN cust_spend cs ON c.id = cs.customer_id\nJOIN top_cat tc ON c.id = tc.customer_id AND tc.rnk = 1\nJOIN categories cat ON tc.category_id = cat.id\nORDER BY delivered_spend DESC, customer_id ASC;",
      referenceSql: "WITH cust_spend AS (SELECT customer_id, COUNT(id) AS order_count, SUM(total_amount) AS total_spend FROM orders WHERE status = 'delivered' GROUP BY customer_id), item_cats AS (SELECT o.customer_id, p.category_id, COUNT(*) AS item_cnt FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id WHERE o.status = 'delivered' GROUP BY o.customer_id, p.category_id), top_cat AS (SELECT customer_id, category_id, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY item_cnt DESC, category_id ASC) AS rnk FROM item_cats) SELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, cs.order_count, ROUND(cs.total_spend, 2) AS delivered_spend, cat.name AS favorite_category, CASE WHEN cs.total_spend > 400 THEN 'Tier 1: VIP' WHEN cs.total_spend > 150 THEN 'Tier 2: Core' ELSE 'Tier 3: Standard' END AS customer_tier FROM customers c JOIN cust_spend cs ON c.id = cs.customer_id JOIN top_cat tc ON c.id = tc.customer_id AND tc.rnk = 1 JOIN categories cat ON tc.category_id = cat.id ORDER BY delivered_spend DESC, customer_id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Notice how top_cat uses ROW_NUMBER() to identify the most purchased category for each customer." },
        { costXp: 10, text: "Order by delivered_spend DESC, customer_id ASC" },
      ],
      solutionExplanation:
        "This master capstone combines multi-table joins, conditional aggregations, window row numbering, preference ranking, and CASE classification in a production-grade analytics pipeline. Congratulations on mastering analytical SQL!",
      xpReward: 150,
      tags: ["mastery", "capstone", "chapter9", "grandmaster"],
      prerequisites: ["ch9-l1", "ch7-l5"],
    },
  ],
};
