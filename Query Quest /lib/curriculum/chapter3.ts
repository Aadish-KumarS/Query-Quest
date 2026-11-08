import { Chapter } from "./types";

export const chapter3: Chapter = {
  id: 3,
  slug: "summarising-the-evidence",
  title: "Summarising the Evidence",
  subtitle: "Aggregating metrics with COUNT, SUM, AVG, GROUP BY, and HAVING",
  capabilityStatement: "Compute executive metrics, revenue sums, averages, and group dimensions while filtering aggregated cohorts with HAVING.",
  estimatedHours: 1.6,
  totalXp: 450,
  badgeId: "aggregation_adept",
  lessons: [
    {
      id: "ch3-l1",
      chapterId: 3,
      slug: "counting-records",
      order: 1,
      title: "Counting Records with COUNT",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "The COUNT() aggregate function tallies the number of rows that match your query criteria.\n- COUNT(*) counts every single row regardless of NULL values.\n- COUNT(column_name) counts only rows where that specific column is NOT NULL.",
      syntaxExamples: "SELECT COUNT(*) AS total_orders FROM orders;\nSELECT COUNT(min_purchase) FROM discounts;",
      whyItMatters:
        "Calculating totals (order volume, churned accounts, active tickets) is the most ubiquitous analytical calculation in any business.",
      commonMistakes:
        "Assuming COUNT(column) counts rows containing NULL values. If a column is NULL, it is omitted from that column's count.",
      rememberThis:
        "Use COUNT(*) when you want to count total rows in a table or partition.",
      analystContext:
        "During weekly operational review, the logistics manager asks for the total number of delivered orders in the system.",
      taskPrompt:
        "Count the total number of orders with status = 'delivered' and alias the result as 'delivered_orders'.",
      starterSql: "-- Count delivered orders\nSELECT COUNT(*) AS delivered_orders\nFROM orders\nWHERE ",
      referenceSql: "SELECT COUNT(*) AS delivered_orders FROM orders WHERE status = 'delivered';",
      hints: [
        { costXp: 5, text: "Filter by status = 'delivered' in the WHERE clause." },
      ],
      solutionExplanation:
        "COUNT(*) with WHERE status = 'delivered' filters rows first, then tallies the remaining matching rows.",
      xpReward: 45,
      tags: ["count", "aggregate", "volume"],
      prerequisites: ["ch2-l1"],
    },
    {
      id: "ch3-l2",
      chapterId: 3,
      slug: "sum-and-average",
      order: 2,
      title: "Totals & Averages: SUM & AVG",
      difficulty: "Beginner",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "SUM(column) adds together all numeric values in a column. AVG(column) calculates the arithmetic mean. You can round floating point figures with ROUND(value, decimals).",
      syntaxExamples: "SELECT SUM(total_amount) AS gross_sales, ROUND(AVG(total_amount), 2) AS aov FROM orders;",
      whyItMatters:
        "Revenue, costs, and Average Order Value (AOV) are foundational KPIs in commercial telemetry.",
      commonMistakes:
        "Running SUM or AVG on non-numeric or text columns. If numeric figures are formatted as text with dollar signs (e.g. '$100'), SQL cannot calculate the sum without casting.",
      rememberThis:
        "NULL values are ignored by both SUM() and AVG().",
      analystContext:
        "The Finance VP requests total revenue (sum of total_amount) and average order value (rounded to 2 decimal places) for delivered orders.",
      taskPrompt:
        "Select SUM(total_amount) aliased as 'gross_sales', and ROUND(AVG(total_amount), 2) aliased as 'avg_order_value' from orders where status = 'delivered'.",
      starterSql: "-- Delivered orders revenue metrics\n",
      referenceSql: "SELECT SUM(total_amount) AS gross_sales, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE status = 'delivered';",
      hints: [
        { costXp: 5, text: "Use: SELECT SUM(total_amount) AS gross_sales, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE status = 'delivered';" },
      ],
      solutionExplanation:
        "SUM adds all order values while AVG finds the mean, rounded nicely to two decimal cents.",
      xpReward: 50,
      tags: ["sum", "avg", "round"],
      prerequisites: ["ch3-l1"],
    },
    {
      id: "ch3-l3",
      chapterId: 3,
      slug: "min-and-max-extremes",
      order: 3,
      title: "Extremes: MIN & MAX",
      difficulty: "Beginner",
      estimatedMinutes: 5,
      type: "scratch",
      conceptExplanation:
        "MIN(column) discovers the lowest value, and MAX(column) discovers the highest value. They function across numeric values, dates (earliest to latest), and text (alphabetical).",
      syntaxExamples: "SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive FROM products;\nSELECT MIN(order_date), MAX(order_date) FROM orders;",
      whyItMatters:
        "Understanding range boundaries, transaction date envelopes, and pricing brackets is essential for anomaly detection.",
      commonMistakes:
        "Attempting to select 'name' alongside MIN(price) without a GROUP BY or subquery in standard SQL engines. Always pair extreme values with careful grouping.",
      rememberThis:
        "MIN and MAX work on dates as well as numbers.",
      analystContext:
        "Catalog merchandising needs to know the price span of active products: the minimum price and maximum price.",
      taskPrompt:
        "Query MIN(price) AS min_price and MAX(price) AS max_price from the products table for active items (status = 'active').",
      starterSql: "-- Catalog price span\n",
      referenceSql: "SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products WHERE status = 'active';",
      hints: [
        { costXp: 5, text: "Write: SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products WHERE status = 'active';" },
      ],
      solutionExplanation:
        "MIN finds the lowest price in active merchandise, and MAX finds the highest.",
      xpReward: 45,
      tags: ["min", "max", "extremes"],
      prerequisites: ["ch3-l1"],
    },
    {
      id: "ch3-l4",
      chapterId: 3,
      slug: "group-by-dimensions",
      order: 4,
      title: "Grouping by Dimensions: GROUP BY",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "The GROUP BY clause collapses rows that share common values into summary groups. Any column not wrapped in an aggregate function (COUNT, SUM, AVG) should appear in the GROUP BY clause.",
      syntaxExamples: "SELECT status, COUNT(*) AS count FROM orders GROUP BY status;\nSELECT category_id, AVG(price) AS avg_price FROM products GROUP BY category_id;",
      whyItMatters:
        "Real business analytics is dimensional: breakdown by category, cohort, country, device, or month.",
      commonMistakes:
        "Selecting a column like 'category_id, name, AVG(price)' but only grouping by 'category_id'. Which product 'name' should the database show when multiple exist in that category? Always group by every non-aggregated projected column.",
      rememberThis:
        "Every un-aggregated column in your SELECT list must be listed in GROUP BY.",
      analystContext:
        "Operations wants a distribution of orders by their status to see how many are delivered, shipped, processing, or cancelled.",
      taskPrompt:
        "Select status and COUNT(*) AS order_count from orders GROUP BY status ORDER BY order_count DESC.",
      starterSql: "-- Order distribution by status\nSELECT status, COUNT(*) AS order_count\nFROM orders\n",
      referenceSql: "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Add: GROUP BY status ORDER BY order_count DESC;" },
      ],
      solutionExplanation:
        "GROUP BY status partitions orders into buckets for each status, and COUNT(*) counts rows in each bucket.",
      xpReward: 55,
      tags: ["group-by", "aggregates", "breakdown"],
      prerequisites: ["ch3-l2"],
    },
    {
      id: "ch3-l5",
      chapterId: 3,
      slug: "filtering-groups-with-having",
      order: 5,
      title: "Filtering Groups: HAVING",
      difficulty: "Intermediate",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "WHERE filters individual rows BEFORE aggregation happens. HAVING filters summarized groups AFTER aggregation happens. You cannot put aggregate functions like COUNT(*) or SUM() inside WHERE; you must use HAVING.",
      syntaxExamples: "SELECT customer_id, COUNT(*) AS total_orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) >= 2;",
      whyItMatters:
        "Distinguishing repeat buyers from one-time shoppers, high-volume sellers, or categories with critical inventory requires post-aggregation filtering.",
      commonMistakes:
        "Attempting to write 'WHERE COUNT(*) > 1'. The database evaluates WHERE before any groups are created. Use HAVING for aggregate conditions.",
      rememberThis:
        "WHERE filters rows before grouping; HAVING filters groups after aggregation.",
      analystContext:
        "CRM Marketing wants to identify loyal repeat customers who have placed 2 or more orders.",
      taskPrompt:
        "Select customer_id and COUNT(*) AS order_count from orders GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC.",
      starterSql: "-- Repeat buyers with 2+ orders\n",
      referenceSql: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2 ORDER BY order_count DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by customer_id, then add: HAVING COUNT(*) >= 2" },
      ],
      solutionExplanation:
        "GROUP BY customer_id tallies purchases per shopper, and HAVING filters out anyone with fewer than 2 orders.",
      xpReward: 55,
      tags: ["having", "group-by", "repeat-buyers"],
      prerequisites: ["ch3-l4"],
    },
    {
      id: "ch3-l6",
      chapterId: 3,
      slug: "counting-distinct-values",
      order: 6,
      title: "Counting Unique Entities: COUNT(DISTINCT)",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "If you write COUNT(customer_id) on the orders table, a customer with 5 orders will be counted 5 times. To count how many unique shoppers have placed an order, nest DISTINCT inside COUNT: COUNT(DISTINCT customer_id).",
      syntaxExamples: "SELECT COUNT(DISTINCT customer_id) AS unique_purchasers FROM orders;\nSELECT status, COUNT(DISTINCT customer_id) FROM orders GROUP BY status;",
      whyItMatters:
        "Total orders vs. Unique buyers is one of the most critical metric distinctions in commerce and user analytics.",
      commonMistakes:
        "Writing 'DISTINCT COUNT(customer_id)'. That would calculate the count first, then deduplicate the single count number! Write 'COUNT(DISTINCT customer_id)'.",
      rememberThis:
        "DISTINCT goes inside the parenthesis of COUNT: COUNT(DISTINCT column).",
      analystContext:
        "Leadership wants to know the number of distinct customers who have placed at least one delivered order.",
      taskPrompt:
        "Query COUNT(DISTINCT customer_id) AS active_buyers from orders where status = 'delivered'.",
      starterSql: "-- Count unique buyers\nSELECT ",
      referenceSql: "SELECT COUNT(DISTINCT customer_id) AS active_buyers FROM orders WHERE status = 'delivered';",
      hints: [
        { costXp: 5, text: "Use: SELECT COUNT(DISTINCT customer_id) AS active_buyers FROM orders WHERE status = 'delivered';" },
      ],
      solutionExplanation:
        "COUNT(DISTINCT customer_id) de-duplicates customer IDs before tallying them.",
      xpReward: 50,
      tags: ["count-distinct", "unique-entities"],
      prerequisites: ["ch3-l1"],
    },
    {
      id: "ch3-l7",
      chapterId: 3,
      slug: "multi-dimensional-grouping",
      order: 7,
      title: "Multi-Column Aggregations",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "You can group by multiple dimensions simultaneously (such as country and status). SQL will construct a subgroup for every unique combination of those columns.",
      syntaxExamples: "SELECT country, status, COUNT(*) AS count\nFROM customers\nGROUP BY country, status\nORDER BY country;",
      whyItMatters:
        "Cross-tabulating metrics across multiple segments (e.g. churn rate by country, device breakdown by platform) gives depth to business reports.",
      commonMistakes:
        "Listing one column in SELECT and forgetting to include it in the GROUP BY list.",
      rememberThis:
        "Each added GROUP BY column further subdivides the aggregation into more granular buckets.",
      analystContext:
        "The customer analytics team wants to see customer counts broken down by country and status.",
      taskPrompt:
        "Select country, status, and COUNT(*) AS total_customers from customers GROUP BY country, status ORDER BY country ASC, status ASC.",
      starterSql: "-- Country and status breakdown\n",
      referenceSql: "SELECT country, status, COUNT(*) AS total_customers FROM customers GROUP BY country, status ORDER BY country ASC, status ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by both country and status: GROUP BY country, status" },
      ],
      solutionExplanation:
        "Groups are formed for each unique combination of country and status.",
      xpReward: 55,
      tags: ["group-by", "multi-dimensional"],
      prerequisites: ["ch3-l4"],
    },
    {
      id: "ch3-l8",
      chapterId: 3,
      slug: "chapter-3-mastery",
      order: 8,
      title: "Mastery Challenge: Category Portfolio Analysis",
      difficulty: "Advanced",
      estimatedMinutes: 12,
      type: "mastery-challenge",
      conceptExplanation:
        "Synthesize grouping, aggregations, multiple metrics, post-aggregation HAVING filtering, and sorting in a single query.",
      syntaxExamples: "SELECT category_id, COUNT(*) AS items, ROUND(AVG(price), 2) AS avg_price, MAX(price) AS peak_price\nFROM products\nWHERE status = 'active'\nGROUP BY category_id\nHAVING COUNT(*) >= 2\nORDER BY avg_price DESC;",
      whyItMatters:
        "This query pattern mirrors actual merchandise portfolio dashboards created by corporate business analysts.",
      commonMistakes:
        "Placing HAVING before GROUP BY, or filtering on aggregate metrics inside WHERE.",
      rememberThis:
        "Order of clauses: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT.",
      analystContext:
        "The Category General Manager requests an executive inventory breakdown of active products by category_id. For each category with at least 2 active products: compute the total number of products ('item_count'), average price rounded to 2 decimals ('avg_price'), and total inventory value calculated as SUM(price * stock_quantity) rounded to 2 decimals ('inventory_value'). Sort by inventory_value descending.",
      taskPrompt:
        "From products where status = 'active', select category_id, COUNT(*) AS item_count, ROUND(AVG(price), 2) AS avg_price, ROUND(SUM(price * stock_quantity), 2) AS inventory_value. Group by category_id, filter for groups with item_count >= 2, and order by inventory_value descending.",
      starterSql: "-- Category Portfolio Summary\n",
      referenceSql: "SELECT category_id, COUNT(*) AS item_count, ROUND(AVG(price), 2) AS avg_price, ROUND(SUM(price * stock_quantity), 2) AS inventory_value FROM products WHERE status = 'active' GROUP BY category_id HAVING COUNT(*) >= 2 ORDER BY inventory_value DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Filter status = 'active' in WHERE, then GROUP BY category_id HAVING COUNT(*) >= 2" },
        { costXp: 10, text: "Sort with: ORDER BY inventory_value DESC" },
      ],
      solutionExplanation:
        "This comprehensive query filters for active items, groups by category, computes count, average price, and total stock holding value, and removes sparse categories with HAVING.",
      xpReward: 80,
      tags: ["mastery", "chapter3", "portfolio"],
      prerequisites: ["ch3-l7"],
    },
  ],
};
