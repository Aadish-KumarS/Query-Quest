import { Chapter } from "./types";

export const chapter7: Chapter = {
  id: 7,
  slug: "analysing-across-rows",
  title: "Analysing Across Rows",
  subtitle: "Window functions, rankings, partitions, running totals, and row offsets",
  capabilityStatement: "Unlock advanced analytical power: calculate running balances, moving rankings, top-N per category, and period-over-period differences without collapsing rows.",
  estimatedHours: 2.2,
  totalXp: 550,
  badgeId: "window_wizard",
  lessons: [
    {
      id: "ch7-l1",
      chapterId: 7,
      slug: "why-window-functions-exist",
      order: 1,
      title: "The Anatomy of Window Functions: OVER()",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "Standard GROUP BY aggregates collapse individual rows into a single summary row. In contrast, Window Functions perform calculations across a set of table rows while PRESERVING individual row identity! The OVER() clause defines the window of rows evaluated.",
      syntaxExamples: "SELECT id, total_amount, AVG(total_amount) OVER () AS avg_overall_amount\nFROM orders;",
      whyItMatters:
        "Comparing an individual order's value directly against the overall average order value in the same row without doing a separate subquery or self-join.",
      commonMistakes:
        "Placing GROUP BY in the same query expecting window functions to behave like group aggregates.",
      rememberThis:
        "Window functions do not collapse rows. Every input row remains in the final output.",
      analystContext:
        "Finance wants each delivered order shown alongside the global average order amount and the difference between them.",
      taskPrompt:
        "Select id, order_date, total_amount, ROUND(AVG(total_amount) OVER (), 2) AS overall_avg, ROUND(total_amount - AVG(total_amount) OVER (), 2) AS diff_from_avg from orders WHERE status = 'delivered' ORDER BY total_amount DESC.",
      starterSql: "-- Compare individual orders to global average\nSELECT id, order_date, total_amount,\n  ROUND(AVG(total_amount) OVER (), 2) AS overall_avg,\n  ROUND(total_amount - AVG(total_amount) OVER (), 2) AS diff_from_avg\nFROM orders\nWHERE status = 'delivered'\nORDER BY total_amount DESC;",
      referenceSql: "SELECT id, order_date, total_amount, ROUND(AVG(total_amount) OVER (), 2) AS overall_avg, ROUND(total_amount - AVG(total_amount) OVER (), 2) AS diff_from_avg FROM orders WHERE status = 'delivered' ORDER BY total_amount DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use AVG(total_amount) OVER () to compute the global average across all rows." },
      ],
      solutionExplanation:
        "OVER() creates an open window spanning all rows, enabling row-by-row variance analysis against the global mean.",
      xpReward: 60,
      tags: ["window-functions", "over", "benchmarking"],
      prerequisites: ["ch6-l4"],
    },
    {
      id: "ch7-l2",
      chapterId: 7,
      slug: "partitioning-by-group",
      order: 2,
      title: "Scoped Windows: PARTITION BY",
      difficulty: "Intermediate",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Adding PARTITION BY inside OVER() divides the rows into discrete subsets. The calculation runs independently within each partition and restarts for the next partition.",
      syntaxExamples: "SELECT name, category_id, price,\n  ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS category_avg\nFROM products;",
      whyItMatters:
        "Calculating category averages, department averages, or per-user spend metrics alongside raw line items.",
      commonMistakes:
        "Using commas between partition columns: 'PARTITION BY col1, col2' is valid, but writing 'PARTITION BY col1 OVER col2' is a syntax error.",
      rememberThis:
        "PARTITION BY splits the window into independent groups; calculations reset for each partition.",
      analystContext:
        "Merchandising needs to display each product's price alongside the average price of its specific category.",
      taskPrompt:
        "From products, select id, name, category_id, price, ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS cat_avg_price from products ORDER BY category_id ASC, price DESC.",
      starterSql: "-- Category benchmark with PARTITION BY\nSELECT id, name, category_id, price,\n  ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS cat_avg_price\nFROM products\nORDER BY category_id ASC, price DESC;",
      referenceSql: "SELECT id, name, category_id, price, ROUND(AVG(price) OVER (PARTITION BY category_id), 2) AS cat_avg_price FROM products ORDER BY category_id ASC, price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Write: AVG(price) OVER (PARTITION BY category_id)" },
      ],
      solutionExplanation:
        "The PARTITION BY category_id clause computes the average price specifically for that category.",
      xpReward: 65,
      tags: ["window-functions", "partition-by", "scoping"],
      prerequisites: ["ch7-l1"],
    },
    {
      id: "ch7-l3",
      chapterId: 7,
      slug: "row-numbering-row-number",
      order: 3,
      title: "Sequential Numbering: ROW_NUMBER()",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "ROW_NUMBER() assigns a unique sequential integer (1, 2, 3...) to each row within a partition, ordered by the specified criteria in ORDER BY inside OVER().",
      syntaxExamples: "SELECT id, customer_id, order_date,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS order_sequence\nFROM orders;",
      whyItMatters:
        "Determining which order is a customer's 1st purchase, 2nd purchase, etc. is crucial for onboarding vs. retention analytics.",
      commonMistakes:
        "Omitting the ORDER BY clause inside OVER() when using ROW_NUMBER(). Without ORDER BY, row numbers are assigned nondeterministically.",
      rememberThis:
        "ROW_NUMBER() always requires an ORDER BY inside OVER(...).",
      analystContext:
        "Identify the chronological sequence number of each order placed by every customer (e.g. order 1, order 2).",
      taskPrompt:
        "Select id AS order_id, customer_id, order_date, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS purchase_number from orders ORDER BY customer_id ASC, purchase_number ASC.",
      starterSql: "-- Number customer purchases chronologically\nSELECT id AS order_id, customer_id, order_date,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS purchase_number\nFROM orders\nORDER BY customer_id ASC, purchase_number ASC;",
      referenceSql: "SELECT id AS order_id, customer_id, order_date, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS purchase_number FROM orders ORDER BY customer_id ASC, purchase_number ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Partition by customer_id and order by order_date ASC inside OVER()." },
      ],
      solutionExplanation:
        "ROW_NUMBER() numbers orders from 1 upwards for each customer, ordered by order date.",
      xpReward: 65,
      tags: ["row-number", "sequence", "window-functions"],
      prerequisites: ["ch7-l2"],
    },
    {
      id: "ch7-l4",
      chapterId: 7,
      slug: "rank-and-dense-rank",
      order: 4,
      title: "Rankings: RANK() vs DENSE_RANK()",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "When values tie:\n- RANK() assigns the same rank to ties, but leaves gaps afterwards (e.g. 1, 2, 2, 4).\n- DENSE_RANK() assigns the same rank to ties without gaps (e.g. 1, 2, 2, 3).\n- ROW_NUMBER() arbitrarily breaks ties with unique integers (e.g. 1, 2, 3, 4).",
      syntaxExamples: "SELECT name, price,\n  RANK() OVER (ORDER BY price DESC) AS price_rank,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_price_rank\nFROM products;",
      whyItMatters:
        "Leaderboards and competition rankings often require dense ranks so medal tiers (gold, silver, bronze) don't have gaps.",
      commonMistakes:
        "Using RANK() when you need consecutive ranks for pagination or tier grouping.",
      rememberThis:
        "DENSE_RANK() never skips ranks; RANK() leaves gaps after ties.",
      analystContext:
        "Generate a dense rank leaderboard of active products by price, highest to lowest.",
      taskPrompt:
        "Select id, name, price, DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank from products WHERE status = 'active' ORDER BY price_rank ASC, name ASC.",
      starterSql: "-- Dense rank leaderboard\nSELECT id, name, price,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank\nFROM products\nWHERE status = 'active'\nORDER BY price_rank ASC, name ASC;",
      referenceSql: "SELECT id, name, price, DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank FROM products WHERE status = 'active' ORDER BY price_rank ASC, name ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use: DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank" },
      ],
      solutionExplanation:
        "DENSE_RANK assigns consecutive rank positions to products based on their prices.",
      xpReward: 65,
      tags: ["rank", "dense-rank", "leaderboard"],
      prerequisites: ["ch7-l3"],
    },
    {
      id: "ch7-l5",
      chapterId: 7,
      slug: "top-n-per-category",
      order: 5,
      title: "Top-N per Category Pattern",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "A classic analytical challenge is: 'What are the top 2 products in each category?' You cannot put window functions inside WHERE. The gold-standard solution is calculating ROW_NUMBER() or DENSE_RANK() inside a CTE, then filtering `WHERE rank <= N` in the outer query.",
      syntaxExamples: "WITH ranked_products AS (\n  SELECT id, name, category_id, price,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rnk\n  FROM products\n)\nSELECT id, name, category_id, price\nFROM ranked_products\nWHERE rnk <= 2;",
      whyItMatters:
        "Finding top 3 sales reps per region, top 5 viewed movies per genre, or most recent 2 orders per user is required in every reporting tool.",
      commonMistakes:
        "Attempting to write `WHERE ROW_NUMBER() OVER (...) <= 2`. Window functions are evaluated after WHERE, so they must be enclosed in a CTE or subquery first.",
      rememberThis:
        "Wrap the ranking in a CTE, then filter `WHERE rank <= N` in the outer query.",
      analystContext:
        "Merchandising needs the 2 most expensive products from each product category for a seasonal showcase.",
      taskPrompt:
        "Using a CTE named ranked_items, rank products partitioned by category_id ordered by price DESC using ROW_NUMBER() AS rnk. In the outer query, select id, name, category_id, price from ranked_items where rnk <= 2 ORDER BY category_id ASC, price DESC.",
      starterSql: "-- Top 2 items per category\nWITH ranked_items AS (\n  SELECT id, name, category_id, price,\n    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rnk\n  FROM products\n)\nSELECT id, name, category_id, price\nFROM ranked_items\nWHERE rnk <= 2\nORDER BY category_id ASC, price DESC;",
      referenceSql: "WITH ranked_items AS (SELECT id, name, category_id, price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rnk FROM products) SELECT id, name, category_id, price FROM ranked_items WHERE rnk <= 2 ORDER BY category_id ASC, price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Filter using: WHERE rnk <= 2" },
      ],
      solutionExplanation:
        "The CTE assigns numbers 1, 2, 3... per category, and the outer filter isolates ranks 1 and 2.",
      xpReward: 75,
      tags: ["top-n", "cte", "row-number", "partition"],
      prerequisites: ["ch7-l3", "ch6-l4"],
    },
    {
      id: "ch7-l6",
      chapterId: 7,
      slug: "running-totals-cumulative",
      order: 6,
      title: "Cumulative Calculations: Running Totals",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "When you include an ORDER BY inside the OVER() clause of an aggregate function (such as SUM), it calculates a cumulative running total from the first row up to the current row.",
      syntaxExamples: "SELECT id, order_date, total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date ASC, id ASC), 2) AS running_revenue\nFROM orders;",
      whyItMatters:
        "Tracking cumulative revenue progress toward quarterly targets, or tracking cumulative user signups over time.",
      commonMistakes:
        "Forgetting ORDER BY inside OVER(). Without ORDER BY, `SUM(col) OVER ()` yields the grand total across all rows rather than a running total.",
      rememberThis:
        "SUM(col) OVER (ORDER BY date ASC) generates an accumulating running total.",
      analystContext:
        "The CFO wants a day-by-day running total of delivered order revenue.",
      taskPrompt:
        "From orders where status = 'delivered', select id, order_date, total_amount, ROUND(SUM(total_amount) OVER (ORDER BY order_date ASC, id ASC), 2) AS running_total ORDER BY order_date ASC, id ASC.",
      starterSql: "-- Cumulative revenue ledger\nSELECT id, order_date, total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date ASC, id ASC), 2) AS running_total\nFROM orders\nWHERE status = 'delivered'\nORDER BY order_date ASC, id ASC;",
      referenceSql: "SELECT id, order_date, total_amount, ROUND(SUM(total_amount) OVER (ORDER BY order_date ASC, id ASC), 2) AS running_total FROM orders WHERE status = 'delivered' ORDER BY order_date ASC, id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Ensure OVER includes (ORDER BY order_date ASC, id ASC)" },
      ],
      solutionExplanation:
        "The window function accumulates revenue sequentially row-by-row as each delivered order occurs.",
      xpReward: 70,
      tags: ["running-total", "cumulative", "finance"],
      prerequisites: ["ch7-l1"],
    },
    {
      id: "ch7-l7",
      chapterId: 7,
      slug: "row-offsets-lag-and-lead",
      order: 7,
      title: "Time Shifts: LAG() & LEAD()",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "LAG(column, offset) looks backward to access data from the previous row. LEAD(column, offset) looks forward to access the next row. Default offset is 1.\nThis enables computing growth rates and time gaps between customer actions.",
      syntaxExamples: "SELECT id, customer_id, order_date,\n  LAG(order_date, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS prev_order_date\nFROM orders;",
      whyItMatters:
        "Calculating days between purchases, or period-over-period metric changes without complex self-joins.",
      commonMistakes:
        "Expecting the first row in a partition to have a non-NULL LAG() value. The first row has no preceding row, so LAG naturally yields NULL.",
      rememberThis:
        "LAG looks back one row; LEAD looks forward one row.",
      analystContext:
        "Compute the previous order amount and difference in spend for repeat customer orders.",
      taskPrompt:
        "From orders, select id, customer_id, order_date, total_amount, LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS prev_amount, ROUND(total_amount - LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC), 2) AS amount_diff from orders ORDER BY customer_id ASC, order_date ASC.",
      starterSql: "-- Repeat order spend difference\nSELECT id, customer_id, order_date, total_amount,\n  LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS prev_amount,\n  ROUND(total_amount - LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC), 2) AS amount_diff\nFROM orders\nORDER BY customer_id ASC, order_date ASC;",
      referenceSql: "SELECT id, customer_id, order_date, total_amount, LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS prev_amount, ROUND(total_amount - LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date ASC), 2) AS amount_diff FROM orders ORDER BY customer_id ASC, order_date ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Partition by customer_id and order by order_date ASC inside OVER()." },
      ],
      solutionExplanation:
        "LAG fetches the previous purchase value for the same customer, enabling calculation of basket size changes.",
      xpReward: 75,
      tags: ["lag", "lead", "cohort", "differences"],
      prerequisites: ["ch7-l3"],
    },
    {
      id: "ch7-l8",
      chapterId: 7,
      slug: "chapter-7-mastery",
      order: 8,
      title: "Mastery Challenge: The Category Revenue Leaderboard",
      difficulty: "Advanced",
      estimatedMinutes: 14,
      type: "mastery-challenge",
      conceptExplanation:
        "Combine multi-table joins, aggregations, window rankings with DENSE_RANK(), and percentage of total calculations.",
      syntaxExamples: "WITH metrics AS (...) SELECT ..., DENSE_RANK() OVER (...), ROUND(100.0 * rev / SUM(rev) OVER (), 1) ...",
      whyItMatters:
        "Executive category performance briefings demand both absolute rankings and relative share-of-wallet percentages.",
      commonMistakes:
        "Dividing without multiplying by 100.0 or forgetting that SUM() OVER () provides the denominator across all rows.",
      rememberThis:
        "`SUM(revenue) OVER ()` calculates the grand total denominator without requiring a separate query.",
      analystContext:
        "The Head of Merchandising requests an executive Category Performance Matrix: For each category with sales, compute category name, total revenue ('category_revenue', rounded to 2 decimals), dense rank by revenue descending ('revenue_rank'), and revenue share percentage ('revenue_share_pct', calculated as `ROUND(100.0 * category_revenue / SUM(category_revenue) OVER (), 1)`). Sort by revenue_rank ASC.",
      taskPrompt:
        "Build the Category Performance Matrix CTE: CTE 'cat_rev' calculates c.id, c.name, SUM(oi.quantity * oi.unit_price) AS revenue from categories c JOIN products p ON c.id = p.category_id JOIN order_items oi ON p.id = oi.product_id GROUP BY c.id, c.name. Main query selects name AS category_name, ROUND(revenue, 2) AS category_revenue, DENSE_RANK() OVER (ORDER BY revenue DESC) AS revenue_rank, ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS revenue_share_pct from cat_rev ORDER BY revenue_rank ASC.",
      starterSql: "-- Category Performance Matrix\nWITH cat_rev AS (\n  SELECT c.id, c.name, SUM(oi.quantity * oi.unit_price) AS revenue\n  FROM categories c\n  JOIN products p ON c.id = p.category_id\n  JOIN order_items oi ON p.id = oi.product_id\n  GROUP BY c.id, c.name\n)\nSELECT name AS category_name,\n  ROUND(revenue, 2) AS category_revenue,\n  DENSE_RANK() OVER (ORDER BY revenue DESC) AS revenue_rank,\n  ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS revenue_share_pct\nFROM cat_rev\nORDER BY revenue_rank ASC;",
      referenceSql: "WITH cat_rev AS (SELECT c.id, c.name, SUM(oi.quantity * oi.unit_price) AS revenue FROM categories c JOIN products p ON c.id = p.category_id JOIN order_items oi ON p.id = oi.product_id GROUP BY c.id, c.name) SELECT name AS category_name, ROUND(revenue, 2) AS category_revenue, DENSE_RANK() OVER (ORDER BY revenue DESC) AS revenue_rank, ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS revenue_share_pct FROM cat_rev ORDER BY revenue_rank ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use SUM(revenue) OVER () in the percentage calculation." },
        { costXp: 10, text: "Sort with ORDER BY revenue_rank ASC" },
      ],
      solutionExplanation:
        "This master query computes category revenue, assigns dense ranks, and calculates market share percentage in a unified window pass.",
      xpReward: 100,
      tags: ["mastery", "chapter7", "market-share", "window-functions"],
      prerequisites: ["ch7-l5", "ch7-l6"],
    },
  ],
};
