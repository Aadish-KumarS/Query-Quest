import { Chapter } from "./types";

export const chapter6: Chapter = {
  id: 6,
  slug: "thinking-in-steps",
  title: "Thinking in Steps",
  subtitle: "Modular query architecture with Subqueries and Common Table Expressions (CTEs)",
  capabilityStatement: "Deconstruct multi-stage analytical questions using scalar subqueries, set subqueries, and readable Common Table Expressions.",
  estimatedHours: 2.0,
  totalXp: 520,
  badgeId: "cte_cartographer",
  lessons: [
    {
      id: "ch6-l1",
      chapterId: 6,
      slug: "scalar-subqueries",
      order: 1,
      title: "Scalar Subqueries in Comparisons",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "A scalar subquery is a nested query that returns exactly ONE single value (one row, one column). You can drop a scalar subquery anywhere a single value is expected, such as in a WHERE comparison.\nExample: finding items priced higher than the overall average price.",
      syntaxExamples: "SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);",
      whyItMatters:
        "Answering questions like 'Which products are above our average price?' in a single query eliminates manual two-step calculations.",
      commonMistakes:
        "Writing a subquery in a comparison operator that returns multiple rows. Comparison operators like '>' require a scalar value.",
      rememberThis:
        "Wrap your subquery in parentheses: WHERE col > (SELECT ...).",
      analystContext:
        "Merchandising needs to identify all products whose selling price is strictly greater than the catalog average price.",
      taskPrompt:
        "Select name and price from products where price > (SELECT AVG(price) FROM products) ORDER BY price DESC.",
      starterSql: "-- Products above catalog average price\nSELECT name, price\nFROM products\nWHERE price > (\n  \n)\nORDER BY price DESC;",
      referenceSql: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Inside the parentheses, write: SELECT AVG(price) FROM products" },
      ],
      solutionExplanation:
        "The inner subquery calculates the catalog mean, and the outer query filters for items exceeding that dynamic baseline.",
      xpReward: 55,
      tags: ["subqueries", "scalar", "comparisons"],
      prerequisites: ["ch3-l2"],
    },
    {
      id: "ch6-l2",
      chapterId: 6,
      slug: "set-subqueries-in",
      order: 2,
      title: "Subqueries with IN",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "When a subquery returns a column of multiple values (a list), you can use the IN operator to check whether an outer row's attribute is in that list: WHERE col IN (SELECT key FROM ...).",
      syntaxExamples: "SELECT id, first_name, email\nFROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE total_amount > 400);",
      whyItMatters:
        "Isolating users who performed a specific high-value action without duplicating rows via joins.",
      commonMistakes:
        "Selecting multiple columns in the IN subquery (e.g. `IN (SELECT id, name FROM ...)`). IN expects a single column list.",
      rememberThis:
        "The subquery inside IN (...) must select only one single column.",
      analystContext:
        "Identify all customers who have filed at least one item return.",
      taskPrompt:
        "From customers, select id, first_name, last_name, email where id IN (SELECT o.customer_id FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id) ORDER BY id ASC.",
      starterSql: "-- Customers with returns\nSELECT id, first_name, last_name, email\nFROM customers\nWHERE id IN (\n  SELECT o.customer_id\n  FROM orders o\n  JOIN order_items oi ON o.id = oi.order_id\n  JOIN returns r ON oi.id = r.order_item_id\n)\nORDER BY id ASC;",
      referenceSql: "SELECT id, first_name, last_name, email FROM customers WHERE id IN (SELECT o.customer_id FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id) ORDER BY id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Ensure the subquery returns o.customer_id joined across order_items and returns." },
      ],
      solutionExplanation:
        "The inner query collects customer IDs associated with returns, and the outer query fetches their profile records.",
      xpReward: 60,
      tags: ["subqueries", "in", "returns"],
      prerequisites: ["ch4-l6"],
    },
    {
      id: "ch6-l3",
      chapterId: 6,
      slug: "correlated-subqueries",
      order: 3,
      title: "Correlated Subqueries",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "A correlated subquery references columns from the outer query table. It executes once for each row evaluated by the outer query. This is ideal for finding items that exceed their own category average.",
      syntaxExamples: "SELECT p.name, p.price, p.category_id\nFROM products p\nWHERE p.price > (\n  SELECT AVG(p2.price)\n  FROM products p2\n  WHERE p2.category_id = p.category_id\n);",
      whyItMatters:
        "Comparing an entity not to the entire universe, but to its immediate peer group (department, category, country).",
      commonMistakes:
        "Using the same table alias in both inner and outer queries, causing the database to compare the table to itself blindly.",
      rememberThis:
        "Use distinct aliases (e.g. `p` for outer, `p2` for inner) in correlated subqueries.",
      analystContext:
        "Merchandising wants to find products that are priced above the average price of their own specific category.",
      taskPrompt:
        "Select p.id, p.name, p.category_id, p.price from products p where p.price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category_id = p.category_id) ORDER BY p.category_id ASC, p.price DESC.",
      starterSql: "-- Products above their category average\nSELECT p.id, p.name, p.category_id, p.price\nFROM products p\nWHERE p.price > (\n  SELECT AVG(p2.price)\n  FROM products p2\n  WHERE p2.category_id = p.category_id\n)\nORDER BY p.category_id ASC, p.price DESC;",
      referenceSql: "SELECT p.id, p.name, p.category_id, p.price FROM products p WHERE p.price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category_id = p.category_id) ORDER BY p.category_id ASC, p.price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Match the category: WHERE p2.category_id = p.category_id" },
      ],
      solutionExplanation:
        "For each product, the inner query calculates the average price of only items sharing that product's category_id.",
      xpReward: 65,
      tags: ["correlated", "subqueries", "benchmarking"],
      prerequisites: ["ch6-l1"],
    },
    {
      id: "ch6-l4",
      chapterId: 6,
      slug: "intro-to-ctes-with-clause",
      order: 4,
      title: "Modular Logic: The WITH Clause (CTE)",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "A Common Table Expression (CTE) creates a temporary, named result set that you can reference within a subsequent query. CTEs make complex SQL read top-to-bottom like clean code rather than nested Russian nesting dolls.\nSyntax:\nWITH cte_name AS (\n  SELECT ...\n)\nSELECT * FROM cte_name;",
      syntaxExamples: "WITH customer_orders AS (\n  SELECT customer_id, COUNT(*) AS order_count, SUM(total_amount) AS total_spend\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT * FROM customer_orders WHERE total_spend > 300;",
      whyItMatters:
        "CTEs are the cornerstone of professional SQL analytics. They make complex logic maintainable, debuggable, and readable for team reviews.",
      commonMistakes:
        "Putting a comma after the CTE parenthesis before the main SELECT statement.",
      rememberThis:
        "Define your CTE with `WITH name AS (...)` and immediately follow with your SELECT statement.",
      analystContext:
        "Create a CTE named customer_totals that aggregates orders by customer_id. Then query the CTE joined to customers to display full names and spend.",
      taskPrompt:
        "Write a CTE named customer_spend that computes customer_id, COUNT(*) AS orders_count, and SUM(total_amount) AS total_spent from orders GROUP BY customer_id. In the main query, join customers c ON customer_spend.customer_id = c.id, selecting c.id, (c.first_name || ' ' || c.last_name) AS customer_name, customer_spend.orders_count, ROUND(customer_spend.total_spent, 2) AS total_spent. Order by total_spent DESC.",
      starterSql: "-- Modular CTE query\nWITH customer_spend AS (\n  SELECT customer_id, COUNT(*) AS orders_count, SUM(total_amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.id, (c.first_name || ' ' || c.last_name) AS customer_name, cs.orders_count, ROUND(cs.total_spent, 2) AS total_spent\nFROM customers c\nJOIN customer_spend cs ON c.id = cs.customer_id\nORDER BY total_spent DESC;",
      referenceSql: "WITH customer_spend AS (SELECT customer_id, COUNT(*) AS orders_count, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.id, (c.first_name || ' ' || c.last_name) AS customer_name, cs.orders_count, ROUND(cs.total_spent, 2) AS total_spent FROM customers c JOIN customer_spend cs ON c.id = cs.customer_id ORDER BY total_spent DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Reference the CTE alias 'cs' in the main query." },
      ],
      solutionExplanation:
        "The CTE computes the aggregate spend per customer first, keeping the outer join clean and readable.",
      xpReward: 65,
      tags: ["cte", "with", "modular-sql"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch6-l5",
      chapterId: 6,
      slug: "multi-stage-cte-pipelines",
      order: 5,
      title: "Multi-Step Pipelines: Chaining CTEs",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "You can define multiple CTEs in a single query by separating them with commas (the WITH keyword is only written once at the beginning). Later CTEs can reference earlier CTEs!\nSyntax:\nWITH step1 AS (\n  SELECT ...\n),\nstep2 AS (\n  SELECT ... FROM step1 ...\n)\nSELECT * FROM step2;",
      syntaxExamples: "WITH monthly_revenue AS (\n  SELECT STRFTIME('%Y-%m', order_date) AS month, SUM(total_amount) AS revenue\n  FROM orders\n  GROUP BY month\n),\nbenchmark AS (\n  SELECT AVG(revenue) AS avg_monthly_rev FROM monthly_revenue\n)\nSELECT m.month, m.revenue, ROUND(b.avg_monthly_rev, 2) AS benchmark_avg\nFROM monthly_revenue m, benchmark b;",
      whyItMatters:
        "Building multi-tier metrics—like calculating customer metrics, summarizing into cohorts, and comparing against benchmarks—mirrors production ETL workflows.",
      commonMistakes:
        "Repeating the WITH keyword before the second CTE: `WITH step1 AS (...), WITH step2 AS (...)`. Only write WITH once at the start.",
      rememberThis:
        "Use a single WITH keyword and separate subsequent CTEs with commas.",
      analystContext:
        "Build a two-step CTE pipeline: Step 1 ('category_revenue') calculates total sales per category. Step 2 ('market_avg') calculates the average sales across all categories. Finally, select categories that exceed the market average.",
      taskPrompt:
        "Build a chained CTE query: First CTE 'category_sales' computes p.category_id, SUM(oi.quantity * oi.unit_price) AS cat_revenue from products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category_id. Second CTE 'avg_sales' computes AVG(cat_revenue) AS bench_revenue FROM category_sales. Main query joins category_sales cs, categories c ON cs.category_id = c.id, cross joins avg_sales a, selecting c.name AS category_name, ROUND(cs.cat_revenue, 2) AS category_revenue, ROUND(a.bench_revenue, 2) AS bench_revenue WHERE cs.cat_revenue >= a.bench_revenue ORDER BY cs.cat_revenue DESC.",
      starterSql: "-- Multi-step CTE pipeline\nWITH category_sales AS (\n  SELECT p.category_id, SUM(oi.quantity * oi.unit_price) AS cat_revenue\n  FROM products p\n  JOIN order_items oi ON p.id = oi.product_id\n  GROUP BY p.category_id\n),\navg_sales AS (\n  SELECT AVG(cat_revenue) AS bench_revenue\n  FROM category_sales\n)\nSELECT c.name AS category_name, ROUND(cs.cat_revenue, 2) AS category_revenue, ROUND(a.bench_revenue, 2) AS bench_revenue\nFROM category_sales cs\nJOIN categories c ON cs.category_id = c.id\nCROSS JOIN avg_sales a\nWHERE cs.cat_revenue >= a.bench_revenue\nORDER BY cs.cat_revenue DESC;",
      referenceSql: "WITH category_sales AS (SELECT p.category_id, SUM(oi.quantity * oi.unit_price) AS cat_revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category_id), avg_sales AS (SELECT AVG(cat_revenue) AS bench_revenue FROM category_sales) SELECT c.name AS category_name, ROUND(cs.cat_revenue, 2) AS category_revenue, ROUND(a.bench_revenue, 2) AS bench_revenue FROM category_sales cs JOIN categories c ON cs.category_id = c.id CROSS JOIN avg_sales a WHERE cs.cat_revenue >= a.bench_revenue ORDER BY cs.cat_revenue DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Notice how avg_sales references the output of category_sales." },
      ],
      solutionExplanation:
        "The multi-step CTE chains data transformation sequentially, calculating category revenue and benchmarking it against the overall average.",
      xpReward: 75,
      tags: ["cte", "chained-cte", "pipelines"],
      prerequisites: ["ch6-l4"],
    },
    {
      id: "ch6-l6",
      chapterId: 6,
      slug: "deriving-metrics-in-separate-steps",
      order: 6,
      title: "Deriving Metrics in Steps",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Often you need to filter on a computed metric. In standard SQL, you cannot use a newly aliased SELECT metric inside the WHERE clause of the same query block (e.g. `SELECT price * 1.2 AS marked_up WHERE marked_up > 100` fails). Wrapping the calculation in a CTE lets you cleanly filter on the derived column in the outer query.",
      syntaxExamples: "WITH calculated AS (\n  SELECT name, price - cost AS gross_profit\n  FROM products\n)\nSELECT * FROM calculated WHERE gross_profit > 100;",
      whyItMatters:
        "Avoids repeating ugly formulas multiple times across SELECT and WHERE clauses.",
      commonMistakes:
        "Trying to write WHERE on an alias in the same SELECT block.",
      rememberThis:
        "Wrap calculations in a CTE so you can filter and sort them with plain WHERE clauses.",
      analystContext:
        "Calculate each product's estimated gross margin: price - cost. Filter for items where gross_profit >= 100.00.",
      taskPrompt:
        "Using a CTE named product_profits (selecting id, name, price, cost, (price - cost) AS profit), query id, name, profit from product_profits where profit >= 100.00 ORDER BY profit DESC.",
      starterSql: "-- Derived metric filtering\nWITH product_profits AS (\n  SELECT id, name, price, cost, (price - cost) AS profit\n  FROM products\n)\nSELECT id, name, profit\nFROM product_profits\nWHERE profit >= 100.00\nORDER BY profit DESC;",
      referenceSql: "WITH product_profits AS (SELECT id, name, price, cost, (price - cost) AS profit FROM products) SELECT id, name, profit FROM product_profits WHERE profit >= 100.00 ORDER BY profit DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Filter using: WHERE profit >= 100.00 ORDER BY profit DESC" },
      ],
      solutionExplanation:
        "Defining the profit calculation inside the CTE makes the outer WHERE filter simple and clean.",
      xpReward: 65,
      tags: ["cte", "derived-metrics", "clean-sql"],
      prerequisites: ["ch6-l4"],
    },
    {
      id: "ch6-l7",
      chapterId: 6,
      slug: "chapter-6-mastery",
      order: 7,
      title: "Mastery Challenge: The Executive Churn Risk Model",
      difficulty: "Advanced",
      estimatedMinutes: 14,
      type: "mastery-challenge",
      conceptExplanation:
        "Construct an end-to-end multi-step CTE analytics model isolating high-value accounts experiencing payment disputes or returns.",
      syntaxExamples: "WITH cte1 AS (...), cte2 AS (...) SELECT ...",
      whyItMatters:
        "Proactive churn prevention identifies high-spending shoppers encountering friction before they abandon the platform.",
      commonMistakes:
        "Mishandling NULLs when joining returns or payments.",
      rememberThis:
        "Modular CTEs break massive business logic into digestible, testable units.",
      analystContext:
        "Identify at-risk VIP shoppers: Customers who have placed at least 1 order and spent over $200 total, but also experienced a returned item or failed payment. Build a CTE 'customer_spend' (customer_id, total_spend) and a CTE 'troubled_customers' (customer_id who have a return or failed payment). Select c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS customer_name, ROUND(cs.total_spend, 2) AS total_spent from customers c JOIN customer_spend cs ON c.id = cs.customer_id JOIN troubled_customers tc ON c.id = tc.customer_id WHERE cs.total_spend >= 200.0 ORDER BY total_spent DESC.",
      taskPrompt:
        "Build the VIP Churn Risk Model using CTEs as described. Output customer_id, customer_name, and total_spent for shoppers with total_spend >= 200 who had a return or failed payment. Order by total_spent DESC.",
      starterSql: "-- VIP Churn Risk Model\nWITH customer_spend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spend\n  FROM orders\n  GROUP BY customer_id\n),\ntroubled_customers AS (\n  SELECT DISTINCT o.customer_id\n  FROM orders o\n  JOIN order_items oi ON o.id = oi.order_id\n  JOIN returns r ON oi.id = r.order_item_id\n  UNION\n  SELECT DISTINCT o.customer_id\n  FROM orders o\n  JOIN payments p ON o.id = p.order_id\n  WHERE p.status = 'failed'\n)\nSELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS customer_name, ROUND(cs.total_spend, 2) AS total_spent\nFROM customers c\nJOIN customer_spend cs ON c.id = cs.customer_id\nJOIN troubled_customers tc ON c.id = tc.customer_id\nWHERE cs.total_spend >= 200.0\nORDER BY total_spent DESC;",
      referenceSql: "WITH customer_spend AS (SELECT customer_id, SUM(total_amount) AS total_spend FROM orders GROUP BY customer_id), troubled_customers AS (SELECT DISTINCT o.customer_id FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id UNION SELECT DISTINCT o.customer_id FROM orders o JOIN payments p ON o.id = p.order_id WHERE p.status = 'failed') SELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS customer_name, ROUND(cs.total_spend, 2) AS total_spent FROM customers c JOIN customer_spend cs ON c.id = cs.customer_id JOIN troubled_customers tc ON c.id = tc.customer_id WHERE cs.total_spend >= 200.0 ORDER BY total_spent DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Ensure UNION joins customer IDs from returns and failed payments." },
        { costXp: 10, text: "Order by total_spent DESC" },
      ],
      solutionExplanation:
        "This query synthesizes multi-CTE pipeline architecture, unions distinct problem accounts, and benchmarks spending thresholds.",
      xpReward: 95,
      tags: ["mastery", "chapter6", "churn-risk", "ctes"],
      prerequisites: ["ch6-l5"],
    },
  ],
};
