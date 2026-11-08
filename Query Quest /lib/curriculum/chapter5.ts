import { Chapter } from "./types";

export const chapter5: Chapter = {
  id: 5,
  slug: "shaping-messy-data",
  title: "Shaping Messy Data",
  subtitle: "Cleaning strings, dates, conditional buckets with CASE WHEN, and NULL functions",
  capabilityStatement: "Transform unstandardized raw data using conditional CASE statements, null fallbacks, date extraction, and string cleaning.",
  estimatedHours: 1.8,
  totalXp: 480,
  badgeId: "analytics_detective",
  lessons: [
    {
      id: "ch5-l1",
      chapterId: 5,
      slug: "conditional-logic-case-when",
      order: 1,
      title: "Conditional Logic: CASE WHEN",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "The CASE expression is SQL's if-then-else construct. It evaluates conditions sequentially and returns the corresponding result from the first matching WHEN clause.\nSyntax:\nCASE\n  WHEN condition1 THEN result1\n  WHEN condition2 THEN result2\n  ELSE default_result\nEND",
      syntaxExamples: "SELECT name, price,\n  CASE\n    WHEN price >= 200 THEN 'Premium'\n    WHEN price >= 80 THEN 'Standard'\n    ELSE 'Budget'\n  END AS price_tier\nFROM products;",
      whyItMatters:
        "Raw numbers alone don't explain business reality. Analysts bucket continuous metrics into clear categorical tiers for executive briefings.",
      commonMistakes:
        "Forgetting the terminating END keyword, or putting commas between WHEN clauses.",
      rememberThis:
        "Every CASE statement must conclude with the END keyword.",
      analystContext:
        "Product marketing wants to classify all items into pricing tiers: 'Budget' (< $50), 'Mid-Range' ($50 to $199.99), and 'Luxury' ($200 and up).",
      taskPrompt:
        "Select name, price, and a CASE expression aliased as 'tier': when price >= 200 then 'Luxury', when price >= 50 then 'Mid-Range', else 'Budget'. Order by price DESC.",
      starterSql: "-- Categorize products by price tier\nSELECT name, price,\n  CASE\n    WHEN price >= 200 THEN 'Luxury'\n    WHEN price >= 50 THEN 'Mid-Range'\n    ELSE 'Budget'\n  END AS tier\nFROM products\nORDER BY price DESC;",
      referenceSql: "SELECT name, price, CASE WHEN price >= 200 THEN 'Luxury' WHEN price >= 50 THEN 'Mid-Range' ELSE 'Budget' END AS tier FROM products ORDER BY price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Check: WHEN price >= 200 THEN 'Luxury' WHEN price >= 50 THEN 'Mid-Range' ELSE 'Budget' END AS tier" },
      ],
      solutionExplanation:
        "CASE evaluates top-to-bottom, labeling prices $200+ as Luxury, $50-$199.99 as Mid-Range, and the rest as Budget.",
      xpReward: 55,
      tags: ["case-when", "conditionals", "bucketing"],
      prerequisites: ["ch3-l4"],
    },
    {
      id: "ch5-l2",
      chapterId: 5,
      slug: "null-handling-coalesce",
      order: 2,
      title: "Null Fallbacks with COALESCE",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "COALESCE(val1, val2, ... valN) accepts multiple arguments and returns the FIRST non-NULL value. If an optional field is missing, you can supply a sensible fallback.",
      syntaxExamples: "SELECT code, COALESCE(min_purchase, 0.0) AS min_spend FROM discounts;\nSELECT id, COALESCE(email, 'No contact provided') FROM leads;",
      whyItMatters:
        "Passing raw NULL values into mathematical formulas causes the entire formula result to become NULL. COALESCE ensures reliable calculations.",
      commonMistakes:
        "Supplying mismatched data types to COALESCE (e.g. passing a string fallback for a numeric column in strictly typed databases).",
      rememberThis:
        "COALESCE scans arguments from left to right, returning the first non-NULL value found.",
      analystContext:
        "In the discounts table, vouchers with no minimum spending requirement have a NULL min_purchase. In reporting, these should show as 0.0.",
      taskPrompt:
        "Select code, discount_percent, and COALESCE(min_purchase, 0.0) AS min_spend from discounts ORDER BY discount_percent DESC.",
      starterSql: "-- Replace NULL with 0.0\nSELECT code, discount_percent, COALESCE(min_purchase, 0.0) AS min_spend\nFROM discounts\nORDER BY discount_percent DESC;",
      referenceSql: "SELECT code, discount_percent, COALESCE(min_purchase, 0.0) AS min_spend FROM discounts ORDER BY discount_percent DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use COALESCE(min_purchase, 0.0) AS min_spend" },
      ],
      solutionExplanation:
        "Any row where min_purchase is NULL will gracefully output 0.0 instead.",
      xpReward: 45,
      tags: ["coalesce", "null", "fallbacks"],
      prerequisites: ["ch2-l7"],
    },
    {
      id: "ch5-l3",
      chapterId: 5,
      slug: "preventing-division-by-zero-nullif",
      order: 3,
      title: "Safe Division with NULLIF",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "In SQL, dividing by zero causes a fatal error or invalid output. The NULLIF(expr1, expr2) function returns NULL if expr1 equals expr2; otherwise, it returns expr1. Wrapping your divisor in NULLIF(denominator, 0) prevents crashes because division by NULL safely yields NULL.",
      syntaxExamples: "SELECT revenue / NULLIF(total_clicks, 0) AS revenue_per_click FROM ad_metrics;",
      whyItMatters:
        "Batch reporting jobs running across millions of rows will crash entirely if even one row has a zero denominator. NULLIF is defensive engineering.",
      commonMistakes:
        "Confusing NULLIF with COALESCE. COALESCE turns NULL into a value; NULLIF turns a specific value into NULL.",
      rememberThis:
        "NULLIF(col, 0) turns zeros into NULLs, preventing division-by-zero runtime crashes.",
      analystContext:
        "We want to compute the profit margin percentage for each active product: ((price - cost) / price) * 100. Guard against any accidental zero price using NULLIF.",
      taskPrompt:
        "Select name, price, cost, ROUND(((price - cost) / NULLIF(price, 0)) * 100, 1) AS margin_pct from products WHERE status = 'active' ORDER BY margin_pct DESC.",
      starterSql: "-- Safe margin calculation\nSELECT name, price, cost, ROUND(((price - cost) / NULLIF(price, 0)) * 100, 1) AS margin_pct\nFROM products\nWHERE status = 'active'\nORDER BY margin_pct DESC;",
      referenceSql: "SELECT name, price, cost, ROUND(((price - cost) / NULLIF(price, 0)) * 100, 1) AS margin_pct FROM products WHERE status = 'active' ORDER BY margin_pct DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "NULLIF(price, 0) replaces 0 with NULL so division won't crash." },
      ],
      solutionExplanation:
        "Using NULLIF protects the calculation, yielding percentage margin safely sorted.",
      xpReward: 55,
      tags: ["nullif", "division", "defensive-sql"],
      prerequisites: ["ch5-l2"],
    },
    {
      id: "ch5-l4",
      chapterId: 5,
      slug: "string-transformations",
      order: 4,
      title: "String Cleaning & Concatenation",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "SQL provides string functions to normalize text:\n- UPPER(str) and LOWER(str) standardize case.\n- LENGTH(str) measures character count.\n- || concatenates strings together.",
      syntaxExamples: "SELECT first_name || ' ' || last_name AS full_name FROM customers;\nSELECT UPPER(country) FROM customers;",
      whyItMatters:
        "Raw user input has erratic casing and fragmented name fields. Presentation layers require normalized strings.",
      commonMistakes:
        "Trying to concatenate strings with the '+' operator. In standard SQL, '+' performs mathematical addition. Use '||' for string concatenation.",
      rememberThis:
        "Use || to concatenate strings in SQLite and PostgreSQL: 'First' || ' ' || 'Last'.",
      analystContext:
        "Generate a clean contact card showing the customer's full name, and their capitalized country code.",
      taskPrompt:
        "Select (first_name || ' ' || last_name) AS full_name, UPPER(country) AS country_code, LOWER(email) AS email_address from customers ORDER BY full_name ASC;",
      starterSql: "-- Format contact cards\n",
      referenceSql: "SELECT (first_name || ' ' || last_name) AS full_name, UPPER(country) AS country_code, LOWER(email) AS email_address FROM customers ORDER BY full_name ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Concatenate with: (first_name || ' ' || last_name) AS full_name" },
      ],
      solutionExplanation:
        "The query uses || to join first and last names with a space, UPPER for country, and LOWER for email.",
      xpReward: 45,
      tags: ["strings", "concatenation", "upper-lower"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch5-l5",
      chapterId: 5,
      slug: "date-extraction-strftime",
      order: 5,
      title: "Date Extraction: STRFTIME",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "In SQLite, dates are stored as ISO 8601 text strings ('YYYY-MM-DD'). The STRFTIME() function formats and extracts date parts:\n- '%Y' extracts the 4-digit year\n- '%m' extracts the 2-digit month (01-12)\n- '%Y-%m' extracts year-month (ideal for monthly cohorts)",
      syntaxExamples: "SELECT STRFTIME('%Y-%m', order_date) AS order_month, COUNT(*) FROM orders GROUP BY order_month;\nSELECT STRFTIME('%Y', created_at) AS signup_year FROM customers;",
      whyItMatters:
        "Monthly recurring revenue (MRR), seasonal spikes, and year-over-year growth require parsing dates into temporal buckets.",
      commonMistakes:
        "Using uppercase '%M' when trying to extract month. In strftime, '%m' is month, while '%M' is minute!",
      rememberThis:
        "STRFTIME('%Y-%m', date_column) is the standard SQLite idiom for monthly aggregation.",
      analystContext:
        "Finance needs monthly order counts and revenue totals grouped by order month (formatted as 'YYYY-MM').",
      taskPrompt:
        "From orders, select STRFTIME('%Y-%m', order_date) AS order_month, COUNT(*) AS total_orders, ROUND(SUM(total_amount), 2) AS monthly_revenue. Group by order_month and order by order_month ASC.",
      starterSql: "-- Monthly revenue trend\nSELECT STRFTIME('%Y-%m', order_date) AS order_month, COUNT(*) AS total_orders, ROUND(SUM(total_amount), 2) AS monthly_revenue\nFROM orders\nGROUP BY order_month\nORDER BY order_month ASC;",
      referenceSql: "SELECT STRFTIME('%Y-%m', order_date) AS order_month, COUNT(*) AS total_orders, ROUND(SUM(total_amount), 2) AS monthly_revenue FROM orders GROUP BY order_month ORDER BY order_month ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by order_month and order by order_month ASC." },
      ],
      solutionExplanation:
        "STRFTIME('%Y-%m', order_date) slices out the month segment for monthly trend aggregation.",
      xpReward: 60,
      tags: ["dates", "strftime", "time-series"],
      prerequisites: ["ch3-l4"],
    },
    {
      id: "ch5-l6",
      chapterId: 5,
      slug: "type-conversion-with-cast",
      order: 6,
      title: "Type Casting with CAST",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "Sometimes numbers are stored as text, or integer division truncates decimals unexpectedly. The CAST(expr AS target_type) function converts an expression into a designated data type: INTEGER, REAL, or TEXT.",
      syntaxExamples: "SELECT CAST(stock_quantity AS REAL) FROM products;\nSELECT CAST('2023' AS INTEGER);",
      whyItMatters:
        "Dividing two integers in SQL (e.g. 5 / 2) can result in integer division yielding 2 instead of 2.5. Casting to REAL ensures decimal accuracy.",
      commonMistakes:
        "Casting invalid string text to an integer (e.g. CAST('N/A' AS INTEGER)), which in SQLite evaluates to 0.",
      rememberThis:
        "CAST(column AS REAL) guarantees floating point arithmetic.",
      analystContext:
        "Merchandising wants to see each product's cost-to-price ratio: CAST(cost AS REAL) / price, rounded to 2 decimals.",
      taskPrompt:
        "Select name, price, cost, ROUND(CAST(cost AS REAL) / price, 2) AS cost_ratio from products ORDER BY cost_ratio DESC.",
      starterSql: "-- Calculate cost ratio\nSELECT name, price, cost, ROUND(CAST(cost AS REAL) / price, 2) AS cost_ratio\nFROM products\nORDER BY cost_ratio DESC;",
      referenceSql: "SELECT name, price, cost, ROUND(CAST(cost AS REAL) / price, 2) AS cost_ratio FROM products ORDER BY cost_ratio DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use CAST(cost AS REAL) / price inside ROUND(..., 2)" },
      ],
      solutionExplanation:
        "Explicitly casting cost to REAL guarantees precise decimal floating point division.",
      xpReward: 50,
      tags: ["cast", "types", "precision"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch5-l7",
      chapterId: 5,
      slug: "conditional-aggregations",
      order: 7,
      title: "Conditional Aggregations",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Nesting a CASE WHEN statement inside SUM() or COUNT() allows you to calculate conditional metrics (e.g. counting only delivered orders while still reviewing all orders in a single pass).\nPattern: SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_count",
      syntaxExamples: "SELECT customer_id,\n  COUNT(*) AS total_orders,\n  SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders,\n  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders\nFROM orders\nGROUP BY customer_id;",
      whyItMatters:
        "Pivoting status counts into separate columns in a single table scan is an elite SQL analytics skill.",
      commonMistakes:
        "Writing 'COUNT(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)'. Because 0 is not NULL, COUNT will count both 1 and 0! Use SUM(...) or use ELSE NULL with COUNT(...).",
      rememberThis:
        "Use SUM(CASE WHEN cond THEN 1 ELSE 0 END) for counting specific occurrences.",
      analystContext:
        "Operations needs an order health report: for each payment method in the payments table, count total transactions, count completed transactions, and count failed/refunded transactions.",
      taskPrompt:
        "From payments, select payment_method, COUNT(*) AS total_txns, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_txns, SUM(CASE WHEN status IN ('failed', 'refunded') THEN 1 ELSE 0 END) AS disputed_txns. Group by payment_method ORDER BY total_txns DESC.",
      starterSql: "-- Pivot transaction health by gateway\nSELECT payment_method, COUNT(*) AS total_txns,\n  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_txns,\n  SUM(CASE WHEN status IN ('failed', 'refunded') THEN 1 ELSE 0 END) AS disputed_txns\nFROM payments\nGROUP BY payment_method\nORDER BY total_txns DESC;",
      referenceSql: "SELECT payment_method, COUNT(*) AS total_txns, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_txns, SUM(CASE WHEN status IN ('failed', 'refunded') THEN 1 ELSE 0 END) AS disputed_txns FROM payments GROUP BY payment_method ORDER BY total_txns DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by payment_method and order by total_txns DESC." },
      ],
      solutionExplanation:
        "Conditional aggregation pivots row-level states into separate metric columns across payment gateways.",
      xpReward: 65,
      tags: ["pivot", "conditional-aggregation", "case-when"],
      prerequisites: ["ch5-l1", "ch3-l4"],
    },
    {
      id: "ch5-l8",
      chapterId: 5,
      slug: "chapter-5-mastery",
      order: 8,
      title: "Mastery Challenge: Customer Health Scoring",
      difficulty: "Advanced",
      estimatedMinutes: 12,
      type: "mastery-challenge",
      conceptExplanation:
        "Synthesize CASE statements, string formatting, date extraction, and null guards into a production-grade customer segmentation pipeline.",
      syntaxExamples: "SELECT c.id, (c.first_name || ' ' || c.last_name) AS full_name, ... CASE ... END AS segment ...",
      whyItMatters:
        "Customer scoring algorithms directly feed email automated workflows and CRM account management.",
      commonMistakes:
        "Ordering conditions improperly in CASE statement or omitting aliases.",
      rememberThis:
        "Order CASE WHEN branches from most specific to least specific.",
      analystContext:
        "Marketing wants an automated Customer Health Segment for every customer based on their status and order history. Select c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, c.country, CASE WHEN c.status = 'churned' THEN 'At-Risk' WHEN c.status = 'new' THEN 'Onboarding' WHEN COUNT(o.id) >= 2 THEN 'VIP Champion' ELSE 'Regular Shopper' END AS customer_segment. Join customers c LEFT JOIN orders o ON c.id = o.customer_id. Group by c.id, c.first_name, c.last_name, c.country, c.status. Order by customer_id ASC.",
      taskPrompt:
        "From customers c LEFT JOIN orders o ON c.id = o.customer_id, group by c.id, c.first_name, c.last_name, c.country, c.status. Output customer_id, full_name, country, and customer_segment using the specified CASE logic. Order by customer_id ASC.",
      starterSql: "-- Customer Health Scoring Engine\n",
      referenceSql: "SELECT c.id AS customer_id, (c.first_name || ' ' || c.last_name) AS full_name, c.country, CASE WHEN c.status = 'churned' THEN 'At-Risk' WHEN c.status = 'new' THEN 'Onboarding' WHEN COUNT(o.id) >= 2 THEN 'VIP Champion' ELSE 'Regular Shopper' END AS customer_segment FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name, c.last_name, c.country, c.status ORDER BY customer_id ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by c.id, c.first_name, c.last_name, c.country, c.status" },
        { costXp: 10, text: "Order by customer_id ASC" },
      ],
      solutionExplanation:
        "The query classifies each user account into marketing cohorts using multi-condition business rules.",
      xpReward: 85,
      tags: ["mastery", "chapter5", "segmentation"],
      prerequisites: ["ch5-l7"],
    },
  ],
};
