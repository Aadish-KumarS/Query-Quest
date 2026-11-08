import { Chapter } from "./types";

export const chapter8: Chapter = {
  id: 8,
  slug: "solving-business-questions",
  title: "Solving Business Questions",
  subtitle: "Real-world analytics scenarios: revenue metrics, cohort retention, and margin analysis",
  capabilityStatement: "Translate ambiguous executive business challenges into exact analytical SQL queries, uncovering revenue leaks and product retention drivers.",
  estimatedHours: 2.5,
  totalXp: 600,
  badgeId: "analytics_detective",
  lessons: [
    {
      id: "ch8-l1",
      chapterId: 8,
      slug: "gross-vs-net-revenue",
      order: 1,
      title: "Revenue Telemetry: GMV vs. Net Sales",
      difficulty: "Intermediate",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "In commerce, Gross Merchandise Value (GMV) is total billed sales before deductions. Net Revenue subtracts returns, cancellations, and refunds. Confusing these two numbers in an executive dashboard can cause misleading financial projections.",
      syntaxExamples: "SELECT SUM(total_amount) AS gmv FROM orders;\nSELECT SUM(refund_amount) FROM returns;",
      whyItMatters:
        "C-suite executives evaluate business health on true net proceeds, not top-line unadjusted checkout volumes.",
      commonMistakes:
        "Counting cancelled orders or ignoring refunds when reporting revenue to investors.",
      rememberThis:
        "Net Sales = Delivered Order Total - Total Refund Amounts.",
      analystContext:
        "Finance needs an official breakdown for Q4: Total GMV (all non-cancelled orders), Total Returns refunded, and Net Revenue (GMV minus Returns).",
      taskPrompt:
        "Using CTEs: CTE 'gmv_data' calculates ROUND(SUM(total_amount), 2) AS gmv FROM orders WHERE status != 'cancelled'. CTE 'return_data' calculates ROUND(SUM(refund_amount), 2) AS total_refunds FROM returns. In main query, cross join both CTEs and output gmv, total_refunds, and ROUND(gmv - total_refunds, 2) AS net_revenue.",
      starterSql: "-- Gross vs Net Revenue Diagnostic\nWITH gmv_data AS (\n  SELECT ROUND(SUM(total_amount), 2) AS gmv\n  FROM orders\n  WHERE status != 'cancelled'\n),\nreturn_data AS (\n  SELECT ROUND(SUM(refund_amount), 2) AS total_refunds\n  FROM returns\n)\nSELECT g.gmv, r.total_refunds, ROUND(g.gmv - r.total_refunds, 2) AS net_revenue\nFROM gmv_data g\nCROSS JOIN return_data r;",
      referenceSql: "WITH gmv_data AS (SELECT ROUND(SUM(total_amount), 2) AS gmv FROM orders WHERE status != 'cancelled'), return_data AS (SELECT ROUND(SUM(refund_amount), 2) AS total_refunds FROM returns) SELECT g.gmv, r.total_refunds, ROUND(g.gmv - r.total_refunds, 2) AS net_revenue FROM gmv_data g CROSS JOIN return_data r;",
      hints: [
        { costXp: 5, text: "Cross join the single-row CTEs to subtract refunds from GMV." },
      ],
      solutionExplanation:
        "Separating gross sales and refund liabilities isolates true net revenue.",
      xpReward: 70,
      tags: ["business-metrics", "gmv", "net-revenue"],
      prerequisites: ["ch6-l5"],
    },
    {
      id: "ch8-l2",
      chapterId: 8,
      slug: "repeat-purchase-rate",
      order: 2,
      title: "Repeat Purchase Rate Analysis",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "Repeat Purchase Rate measures the percentage of buyers who have purchased more than once: (Customers with >= 2 orders) / (All purchasing customers) * 100.",
      syntaxExamples: "WITH customer_orders AS (\n  SELECT customer_id, COUNT(*) AS orders\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT ...",
      whyItMatters:
        "Repeat purchase rate is the ultimate indicator of product-market fit and customer loyalty.",
      commonMistakes:
        "Including registered customers who have never bought in the denominator for purchase repeat rate. The denominator is distinct buyers.",
      rememberThis:
        "Repeat Rate = (Repeat Buyers / Total Purchasing Customers) * 100.",
      analystContext:
        "Calculate our platform repeat purchase rate: count total purchasing customers, repeat customers (>= 2 orders), and calculate repeat_rate_pct rounded to 1 decimal.",
      taskPrompt:
        "Build a CTE 'buyer_counts' selecting customer_id, COUNT(*) AS order_cnt from orders GROUP BY customer_id. In main query, select COUNT(*) AS total_buyers, SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) AS repeat_buyers, ROUND(100.0 * SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS repeat_rate_pct from buyer_counts.",
      starterSql: "-- Repeat Purchase Rate Calculation\nWITH buyer_counts AS (\n  SELECT customer_id, COUNT(*) AS order_cnt\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT COUNT(*) AS total_buyers,\n  SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) AS repeat_buyers,\n  ROUND(100.0 * SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS repeat_rate_pct\nFROM buyer_counts;",
      referenceSql: "WITH buyer_counts AS (SELECT customer_id, COUNT(*) AS order_cnt FROM orders GROUP BY customer_id) SELECT COUNT(*) AS total_buyers, SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) AS repeat_buyers, ROUND(100.0 * SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS repeat_rate_pct FROM buyer_counts;",
      hints: [
        { costXp: 5, text: "Use SUM(CASE WHEN order_cnt >= 2 THEN 1 ELSE 0 END) in the numerator." },
      ],
      solutionExplanation:
        "Aggregating order counts per user inside a CTE allows clean ratio computation across the customer base.",
      xpReward: 75,
      tags: ["business-metrics", "retention", "repeat-rate"],
      prerequisites: ["ch6-l4", "ch5-l7"],
    },
    {
      id: "ch8-l3",
      chapterId: 8,
      slug: "rfm-monetary-recency-frequency",
      order: 3,
      title: "RFM Segmentation Basics",
      difficulty: "Advanced",
      estimatedMinutes: 11,
      type: "scratch",
      conceptExplanation:
        "RFM (Recency, Frequency, Monetary) is a classic customer value framework:\n- Recency: Most recent order date (MAX(order_date))\n- Frequency: Total orders count (COUNT(id))\n- Monetary: Total currency spent (SUM(total_amount))",
      syntaxExamples: "SELECT customer_id, MAX(order_date) AS recency, COUNT(*) AS frequency, SUM(total_amount) AS monetary\nFROM orders\nGROUP BY customer_id;",
      whyItMatters:
        "Marketing uses RFM to tailor campaigns: rewarding recent big spenders and re-engaging lapsed high-value customers.",
      commonMistakes:
        "Not sorting by monetary value descending when identifying VIPs.",
      rememberThis:
        "RFM summarizes three dimensions of customer value in one clean group aggregation.",
      analystContext:
        "Marketing wants an RFM baseline table for all customers who have ordered: show customer_id, first_name, last_name, recency (most recent order date), frequency (order count), and monetary (total spend rounded to 2 decimals). Order by monetary DESC.",
      taskPrompt:
        "Join customers c and orders o ON c.id = o.customer_id. Group by c.id, c.first_name, c.last_name. Select c.id AS customer_id, c.first_name, c.last_name, MAX(o.order_date) AS recency, COUNT(o.id) AS frequency, ROUND(SUM(o.total_amount), 2) AS monetary ORDER BY monetary DESC.",
      starterSql: "-- RFM Customer Baseline\nSELECT c.id AS customer_id, c.first_name, c.last_name,\n  MAX(o.order_date) AS recency,\n  COUNT(o.id) AS frequency,\n  ROUND(SUM(o.total_amount), 2) AS monetary\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.first_name, c.last_name\nORDER BY monetary DESC;",
      referenceSql: "SELECT c.id AS customer_id, c.first_name, c.last_name, MAX(o.order_date) AS recency, COUNT(o.id) AS frequency, ROUND(SUM(o.total_amount), 2) AS monetary FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name, c.last_name ORDER BY monetary DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by c.id, c.first_name, c.last_name and order by monetary DESC." },
      ],
      solutionExplanation:
        "The query synthesizes recency date, order frequency, and monetary spend per customer.",
      xpReward: 75,
      tags: ["rfm", "segmentation", "business-analytics"],
      prerequisites: ["ch4-l2", "ch3-l4"],
    },
    {
      id: "ch8-l4",
      chapterId: 8,
      slug: "product-profit-margins",
      order: 4,
      title: "Profitability: Realized Gross Margin",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "Total revenue does not equal profit. A product generating $10,000 in sales with a $9,500 cost delivers only $500 in margin. Realized profit calculates: SUM((oi.unit_price - p.cost) * oi.quantity).",
      syntaxExamples: "SELECT p.name, SUM((oi.unit_price - p.cost) * oi.quantity) AS total_profit\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nGROUP BY p.name;",
      whyItMatters:
        "Merchandising strategies prioritize high-margin products over high-volume loss-leaders.",
      commonMistakes:
        "Using `p.price - p.cost` instead of the actual historical `oi.unit_price - p.cost` (unit_price reflects discounts or price changes at time of sale).",
      rememberThis:
        "Always calculate realized margin from transaction line items rather than current catalog prices.",
      analystContext:
        "The CFO requests a product profitability report: calculate total units sold ('units_sold'), total sales revenue ('gross_revenue'), and total profit ('total_profit', rounded to 2 decimals) for each product ordered. Sort by total_profit DESC.",
      taskPrompt:
        "Join products p and order_items oi ON p.id = oi.product_id. Group by p.id, p.name. Select p.name AS product_name, SUM(oi.quantity) AS units_sold, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue, ROUND(SUM(oi.quantity * (oi.unit_price - p.cost)), 2) AS total_profit ORDER BY total_profit DESC.",
      starterSql: "-- Product Realized Profitability\nSELECT p.name AS product_name,\n  SUM(oi.quantity) AS units_sold,\n  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue,\n  ROUND(SUM(oi.quantity * (oi.unit_price - p.cost)), 2) AS total_profit\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nGROUP BY p.id, p.name\nORDER BY total_profit DESC;",
      referenceSql: "SELECT p.name AS product_name, SUM(oi.quantity) AS units_sold, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue, ROUND(SUM(oi.quantity * (oi.unit_price - p.cost)), 2) AS total_profit FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY total_profit DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Compute profit with: ROUND(SUM(oi.quantity * (oi.unit_price - p.cost)), 2) AS total_profit" },
      ],
      solutionExplanation:
        "By multiplying line-item margin by purchased quantities, the true bottom-line contribution of each product is revealed.",
      xpReward: 80,
      tags: ["profit-margin", "order-items", "cfo-reporting"],
      prerequisites: ["ch4-l6"],
    },
    {
      id: "ch8-l5",
      chapterId: 8,
      slug: "return-rate-anomaly-detection",
      order: 5,
      title: "Quality Control: Return Rate Diagnostics",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "High return rates erode margins and signal defective batches. Return rate is calculated as: (Total units returned / Total units sold) * 100.",
      syntaxExamples: "SELECT p.name, COUNT(r.id) AS returns_count\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nLEFT JOIN returns r ON oi.id = r.order_item_id\nGROUP BY p.name;",
      whyItMatters:
        "Identifying problem suppliers or misleading catalog descriptions before negative reviews mount.",
      commonMistakes:
        "Using INNER JOIN on returns (which drops products that had zero returns). Use LEFT JOIN on returns.",
      rememberThis:
        "Use LEFT JOIN to retain items with 0 returns when calculating return rates.",
      analystContext:
        "Operations wants to identify any product where returns have occurred. List product name, total units sold ('sold_qty'), total return claims filed ('return_count'), and return rate percentage ('return_rate_pct' rounded to 1 decimal). Filter for products with return_count > 0 and sort by return_rate_pct DESC.",
      taskPrompt:
        "Join products p JOIN order_items oi ON p.id = oi.product_id LEFT JOIN returns r ON oi.id = r.order_item_id. Group by p.id, p.name. Having COUNT(r.id) > 0. Select p.name AS product_name, SUM(oi.quantity) AS sold_qty, COUNT(r.id) AS return_count, ROUND(100.0 * COUNT(r.id) / SUM(oi.quantity), 1) AS return_rate_pct ORDER BY return_rate_pct DESC.",
      starterSql: "-- Return Rate Diagnostic\nSELECT p.name AS product_name,\n  SUM(oi.quantity) AS sold_qty,\n  COUNT(r.id) AS return_count,\n  ROUND(100.0 * COUNT(r.id) / SUM(oi.quantity), 1) AS return_rate_pct\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nLEFT JOIN returns r ON oi.id = r.order_item_id\nGROUP BY p.id, p.name\nHAVING COUNT(r.id) > 0\nORDER BY return_rate_pct DESC;",
      referenceSql: "SELECT p.name AS product_name, SUM(oi.quantity) AS sold_qty, COUNT(r.id) AS return_count, ROUND(100.0 * COUNT(r.id) / SUM(oi.quantity), 1) AS return_rate_pct FROM products p JOIN order_items oi ON p.id = oi.product_id LEFT JOIN returns r ON oi.id = r.order_item_id GROUP BY p.id, p.name HAVING COUNT(r.id) > 0 ORDER BY return_rate_pct DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use HAVING COUNT(r.id) > 0 and order by return_rate_pct DESC." },
      ],
      solutionExplanation:
        "The query joins products to orders and left-joins returns, isolating return frequency against overall volume.",
      xpReward: 80,
      tags: ["anomaly", "returns", "quality-control"],
      prerequisites: ["ch4-l6", "ch3-l5"],
    },
    {
      id: "ch8-l6",
      chapterId: 8,
      slug: "marketing-discount-effectiveness",
      order: 6,
      title: "Discount & Coupon Utilization",
      difficulty: "Advanced",
      estimatedMinutes: 9,
      type: "scratch",
      conceptExplanation:
        "Promotional vouchers are intended to drive volume. Examining discount usage across order line items quantifies the markdown cost vs. order revenue.",
      syntaxExamples: "SELECT product_id, SUM(discount_amount) AS total_discounted FROM order_items GROUP BY product_id;",
      whyItMatters:
        "Preventing margin erosion caused by excessive promotional stacking.",
      commonMistakes:
        "Summing discounts without checking if any discount was applied.",
      rememberThis:
        "Track total discount deductions against gross product revenue.",
      analystContext:
        "Merchandising needs to see which products received line-item discount markdowns, the total discount amount absorbed, and total quantity sold with discounts.",
      taskPrompt:
        "Join products p and order_items oi ON p.id = oi.product_id WHERE oi.discount_amount > 0. Group by p.id, p.name. Select p.name AS product_name, SUM(oi.quantity) AS discounted_units, ROUND(SUM(oi.discount_amount), 2) AS total_discounts_absorbed ORDER BY total_discounts_absorbed DESC.",
      starterSql: "-- Promotional Discount Absorption\nSELECT p.name AS product_name,\n  SUM(oi.quantity) AS discounted_units,\n  ROUND(SUM(oi.discount_amount), 2) AS total_discounts_absorbed\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nWHERE oi.discount_amount > 0\nGROUP BY p.id, p.name\nORDER BY total_discounts_absorbed DESC;",
      referenceSql: "SELECT p.name AS product_name, SUM(oi.quantity) AS discounted_units, ROUND(SUM(oi.discount_amount), 2) AS total_discounts_absorbed FROM products p JOIN order_items oi ON p.id = oi.product_id WHERE oi.discount_amount > 0 GROUP BY p.id, p.name ORDER BY total_discounts_absorbed DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Filter WHERE oi.discount_amount > 0 and sort by total_discounts_absorbed DESC." },
      ],
      solutionExplanation:
        "Identifies merchandise with active promotional markdown absorption.",
      xpReward: 75,
      tags: ["discounts", "promotions", "margin-erosion"],
      prerequisites: ["ch4-l2"],
    },
    {
      id: "ch8-l7",
      chapterId: 8,
      slug: "payment-gateway-funnel-conversion",
      order: 7,
      title: "Checkout Funnel: Payment Gateway Health",
      difficulty: "Advanced",
      estimatedMinutes: 10,
      type: "scratch",
      conceptExplanation:
        "Payment failures at checkout represent high-intent customers who failed to convert. Calculating payment success rates per gateway informs infrastructure choices.",
      syntaxExamples: "SELECT payment_method, COUNT(*) AS txns, SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS success ...",
      whyItMatters:
        "A 3% drop in payment gateway authorization rate can cost millions in lost revenue.",
      commonMistakes:
        "Ignoring failed status codes in transaction analysis.",
      rememberThis:
        "Authorization Rate = (Completed Transactions / Total Transactions) * 100.",
      analystContext:
        "The Fintech lead asks for gateway success rates: For each payment_method, count total transactions ('total_attempts'), completed transactions ('success_count'), and success rate percentage ('success_rate_pct' rounded to 1 decimal). Sort by success_rate_pct DESC.",
      taskPrompt:
        "From payments, select payment_method, COUNT(*) AS total_attempts, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS success_count, ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 1) AS success_rate_pct GROUP BY payment_method ORDER BY success_rate_pct DESC.",
      starterSql: "-- Payment Gateway Conversion\nSELECT payment_method,\n  COUNT(*) AS total_attempts,\n  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS success_count,\n  ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 1) AS success_rate_pct\nFROM payments\nGROUP BY payment_method\nORDER BY success_rate_pct DESC;",
      referenceSql: "SELECT payment_method, COUNT(*) AS total_attempts, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS success_count, ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 1) AS success_rate_pct FROM payments GROUP BY payment_method ORDER BY success_rate_pct DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by payment_method and order by success_rate_pct DESC." },
      ],
      solutionExplanation:
        "Computes the authorization reliability across credit card, paypal, and bank transfer rails.",
      xpReward: 80,
      tags: ["payments", "conversion", "fintech"],
      prerequisites: ["ch5-l7"],
    },
    {
      id: "ch8-l8",
      chapterId: 8,
      slug: "chapter-8-mastery",
      order: 8,
      title: "Mastery Challenge: The Executive E-Commerce Diagnostic",
      difficulty: "Advanced",
      estimatedMinutes: 15,
      type: "mastery-challenge",
      conceptExplanation:
        "Conduct a full-funnel executive diagnostic uniting customer geo-demographics, order volume, net realized spend, and return disputes.",
      syntaxExamples: "WITH customer_metrics AS (...) SELECT ...",
      whyItMatters:
        "This capstone business intelligence model answers the fundamental CEO question: 'Where is our most profitable, dependable growth coming from?'",
      commonMistakes:
        "Dropping customers who haven't ordered yet or double-counting returns.",
      rememberThis:
        "Careful joins and clean group metrics yield bulletproof executive diagnostics.",
      analystContext:
        "The CEO wants a Geographic Revenue & Risk Diagnostic by country. For each country in the customers table: count total registered customers ('total_customers'), count delivered orders ('delivered_orders'), calculate total delivered revenue ('delivered_revenue', rounded to 2 decimals, or 0.0 if none), and count total returns filed ('return_count'). Group by c.country and order by delivered_revenue DESC, total_customers DESC.",
      taskPrompt:
        "Build the Geographic Diagnostic: CTE 'order_stats' aggregates customer orders by customer_id (delivered orders count and sum). CTE 'return_stats' aggregates returns by customer_id. Join customers c to both CTEs. Group by c.country. Output c.country, COUNT(DISTINCT c.id) AS total_customers, COALESCE(SUM(os.delivered_cnt), 0) AS delivered_orders, ROUND(COALESCE(SUM(os.delivered_rev), 0.0), 2) AS delivered_revenue, COALESCE(SUM(rs.ret_cnt), 0) AS return_count. Order by delivered_revenue DESC, total_customers DESC.",
      starterSql: "-- Executive Geographic Diagnostic\nWITH order_stats AS (\n  SELECT customer_id,\n    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_cnt,\n    SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0.0 END) AS delivered_rev\n  FROM orders\n  GROUP BY customer_id\n),\nreturn_stats AS (\n  SELECT o.customer_id, COUNT(r.id) AS ret_cnt\n  FROM orders o\n  JOIN order_items oi ON o.id = oi.order_id\n  JOIN returns r ON oi.id = r.order_item_id\n  GROUP BY o.customer_id\n)\nSELECT c.country,\n  COUNT(DISTINCT c.id) AS total_customers,\n  COALESCE(SUM(os.delivered_cnt), 0) AS delivered_orders,\n  ROUND(COALESCE(SUM(os.delivered_rev), 0.0), 2) AS delivered_revenue,\n  COALESCE(SUM(rs.ret_cnt), 0) AS return_count\nFROM customers c\nLEFT JOIN order_stats os ON c.id = os.customer_id\nLEFT JOIN return_stats rs ON c.id = rs.customer_id\nGROUP BY c.country\nORDER BY delivered_revenue DESC, total_customers DESC;",
      referenceSql: "WITH order_stats AS (SELECT customer_id, SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_cnt, SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0.0 END) AS delivered_rev FROM orders GROUP BY customer_id), return_stats AS (SELECT o.customer_id, COUNT(r.id) AS ret_cnt FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN returns r ON oi.id = r.order_item_id GROUP BY o.customer_id) SELECT c.country, COUNT(DISTINCT c.id) AS total_customers, COALESCE(SUM(os.delivered_cnt), 0) AS delivered_orders, ROUND(COALESCE(SUM(os.delivered_rev), 0.0), 2) AS delivered_revenue, COALESCE(SUM(rs.ret_cnt), 0) AS return_count FROM customers c LEFT JOIN order_stats os ON c.id = os.customer_id LEFT JOIN return_stats rs ON c.id = rs.customer_id GROUP BY c.country ORDER BY delivered_revenue DESC, total_customers DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group by c.country and order by delivered_revenue DESC, total_customers DESC." },
      ],
      solutionExplanation:
        "The master geographic query combines pre-aggregated CTEs with customer geo-demographics to deliver a risk and revenue profile per country.",
      xpReward: 110,
      tags: ["mastery", "chapter8", "executive-diagnostic", "c-suite"],
      prerequisites: ["ch8-l1", "ch8-l5"],
    },
  ],
};
