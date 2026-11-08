import { Chapter } from "./types";

export const chapter2: Chapter = {
  id: 2,
  slug: "finding-the-right-rows",
  title: "Finding the Right Rows",
  subtitle: "Filtering data with WHERE, comparisons, logical operators, and NULL checks",
  capabilityStatement: "Isolate target cohorts using precise logical filters, pattern matching, range bounds, and null guards.",
  estimatedHours: 1.5,
  totalXp: 420,
  badgeId: "filter_finder",
  lessons: [
    {
      id: "ch2-l1",
      chapterId: 2,
      slug: "the-where-clause",
      order: 1,
      title: "The WHERE Clause",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "The WHERE clause evaluates a condition for each row in a table. Only rows where the condition evaluates to TRUE are included in the result. In SQL, text values must be enclosed in single quotes (e.g. 'active').",
      syntaxExamples: "SELECT * FROM customers WHERE status = 'active';\nSELECT * FROM products WHERE price > 100;",
      whyItMatters:
        "Without row filtering, every query dumps the entire database. Filtering isolates specific segments—such as active subscribers or pending shipments.",
      commonMistakes:
        "Using double quotes around string literals instead of single quotes (e.g. \"active\"), or using '==' instead of single '='.",
      rememberThis:
        "WHERE acts before rows are presented. Strings must be enclosed in single quotes: 'like_this'.",
      analystContext:
        "The customer success team is launching a retention survey exclusively for shoppers whose account status is currently marked as 'active'.",
      taskPrompt:
        "Query first_name, last_name, and email from the customers table for all customers whose status is 'active'.",
      starterSql: "-- Select active customers\nSELECT first_name, last_name, email\nFROM customers\nWHERE ",
      referenceSql: "SELECT first_name, last_name, email FROM customers WHERE status = 'active';",
      hints: [
        { costXp: 5, text: "Write: WHERE status = 'active'" },
      ],
      solutionExplanation:
        "The WHERE clause checks each row's status column, returning only those matching the string 'active'.",
      xpReward: 40,
      tags: ["where", "filtering", "equality"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch2-l2",
      chapterId: 2,
      slug: "numeric-comparisons",
      order: 2,
      title: "Numeric Comparisons",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "SQL supports standard numeric comparison operators: > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to), and != or <> (not equal to). Numbers do not use quotes.",
      syntaxExamples: "SELECT * FROM products WHERE price >= 100.00;\nSELECT * FROM orders WHERE total_amount > 200;",
      whyItMatters:
        "Identifying luxury items, bulk orders, or low-stock thresholds relies on numeric inequality evaluations.",
      commonMistakes:
        "Wrapping numeric values in single quotes like '100.00'. While SQLite is flexible with types, treating numbers as numbers is standard practice across SQL engines.",
      rememberThis:
        "Do not put quotes around numerical quantities and thresholds.",
      analystContext:
        "Finance has flagged high-value orders for fraud prevention review. We need to identify all orders with a total_amount exceeding $300.00.",
      taskPrompt:
        "Select id, customer_id, and total_amount from the orders table where total_amount is strictly greater than 300.00.",
      starterSql: "-- High-value orders\nSELECT id, customer_id, total_amount\nFROM orders\nWHERE ",
      referenceSql: "SELECT id, customer_id, total_amount FROM orders WHERE total_amount > 300.00;",
      hints: [
        { costXp: 5, text: "Use the greater-than symbol: total_amount > 300.00" },
      ],
      solutionExplanation:
        "The condition 'total_amount > 300.00' filters out orders equal to or below $300, returning only larger transactions.",
      xpReward: 45,
      tags: ["where", "comparisons", "numbers"],
      prerequisites: ["ch2-l1"],
    },
    {
      id: "ch2-l3",
      chapterId: 2,
      slug: "combining-conditions-and-or",
      order: 3,
      title: "Conjunctions: AND & OR",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "fix-broken",
      conceptExplanation:
        "To filter by multiple criteria, combine conditions using AND (both conditions must be true) or OR (at least one condition must be true).",
      syntaxExamples: "SELECT * FROM orders WHERE status = 'delivered' AND total_amount > 200;\nSELECT * FROM customers WHERE country = 'USA' OR country = 'UK';",
      whyItMatters:
        "Business definitions usually have multiple facets: e.g., 'active customers living in Germany' or 'orders placed this year that are delivered'.",
      commonMistakes:
        "Writing 'WHERE country = 'USA' OR 'UK''. Each condition on either side of OR/AND must be a complete logical expression: 'country = 'USA' OR country = 'UK''.",
      rememberThis:
        "Both sides of AND/OR require a full comparison expression with column and operator.",
      analystContext:
        "Warehouse logistics needs to spot active products in category 3 (Computing) that are priced at or above $100.",
      taskPrompt:
        "Retrieve name, price, and stock_quantity from products where category_id is 3 AND price >= 100.",
      starterSql: "SELECT name, price, stock_quantity\nFROM products\nWHERE category_id = 3 AND price >= 100;",
      referenceSql: "SELECT name, price, stock_quantity FROM products WHERE category_id = 3 AND price >= 100;",
      hints: [
        { costXp: 5, text: "Make sure both conditions are joined with the AND keyword." },
      ],
      solutionExplanation:
        "Using AND enforces that both criteria must hold true for a row to be included.",
      xpReward: 45,
      tags: ["and", "or", "logic"],
      prerequisites: ["ch2-l2"],
    },
    {
      id: "ch2-l4",
      chapterId: 2,
      slug: "set-membership-in",
      order: 4,
      title: "Set Membership with IN",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "Writing chained OR statements (e.g. status = 'delivered' OR status = 'shipped' OR status = 'processing') quickly becomes tedious. The IN operator tests whether a value matches any item in a provided list.",
      syntaxExamples: "SELECT * FROM orders WHERE status IN ('delivered', 'shipped');\nSELECT * FROM products WHERE id IN (1, 3, 5);",
      whyItMatters:
        "Targeting a cluster of states, product categories, or specific regions is cleanly handled by IN.",
      commonMistakes:
        "Leaving off the parentheses around the target list: 'WHERE status IN 'delivered', 'shipped''. Always wrap the list in parentheses: IN (...).",
      rememberThis:
        "IN (...) is concise syntax for multiple OR conditions on the same column.",
      analystContext:
        "Operations wants an update on non-cancelled orders that are on their way or completed. Specifically, orders with status 'shipped' or 'delivered'.",
      taskPrompt:
        "Select id, order_date, status, and total_amount from orders where status is IN ('shipped', 'delivered').",
      starterSql: "-- Orders currently shipped or delivered\n",
      referenceSql: "SELECT id, order_date, status, total_amount FROM orders WHERE status IN ('shipped', 'delivered');",
      hints: [
        { costXp: 5, text: "Use: WHERE status IN ('shipped', 'delivered')" },
      ],
      solutionExplanation:
        "IN ('shipped', 'delivered') matches any row whose status is either shipped or delivered.",
      xpReward: 45,
      tags: ["in", "set", "filtering"],
      prerequisites: ["ch2-l3"],
    },
    {
      id: "ch2-l5",
      chapterId: 2,
      slug: "ranges-with-between",
      order: 5,
      title: "Continuous Ranges with BETWEEN",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "The BETWEEN operator filters values within an inclusive range: 'col BETWEEN low AND high' is shorthand for 'col >= low AND col <= high'. It works seamlessly on numbers and ISO date strings.",
      syntaxExamples: "SELECT * FROM products WHERE price BETWEEN 50 AND 150;\nSELECT * FROM orders WHERE order_date BETWEEN '2023-11-01' AND '2023-11-15';",
      whyItMatters:
        "Analyzing mid-tier merchandise or bounding a campaign by fiscal calendar dates is standard analytical work.",
      commonMistakes:
        "Putting the higher value first. 'BETWEEN 150 AND 50' evaluates to false in SQL.",
      rememberThis:
        "BETWEEN is inclusive: both boundary endpoints are included in the result.",
      analystContext:
        "Merchandising is setting up a 'Mid-Tier Essentials' gift guide. Find all products priced between 50 and 150 dollars inclusive.",
      taskPrompt:
        "Select name and price from products where price is BETWEEN 50.00 AND 150.00.",
      starterSql: "-- Mid-tier products\nSELECT name, price\nFROM products\nWHERE ",
      referenceSql: "SELECT name, price FROM products WHERE price BETWEEN 50.00 AND 150.00;",
      hints: [
        { costXp: 5, text: "Write: WHERE price BETWEEN 50.00 AND 150.00" },
      ],
      solutionExplanation:
        "BETWEEN 50.00 AND 150.00 selects any product with a price from 50 to 150 inclusive.",
      xpReward: 45,
      tags: ["between", "range", "pricing"],
      prerequisites: ["ch2-l2"],
    },
    {
      id: "ch2-l6",
      chapterId: 2,
      slug: "pattern-matching-like",
      order: 6,
      title: "Fuzzy Matching with LIKE",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "When you don't know the exact string, the LIKE operator enables pattern matching with wildcards:\n- % matches zero, one, or multiple characters.\n- _ matches exactly one single character.",
      syntaxExamples: "SELECT * FROM customers WHERE email LIKE '%@example.com';\nSELECT * FROM products WHERE name LIKE 'Aura%';",
      whyItMatters:
        "Search bars, domain filtering, and keyword exploration frequently require substring matching.",
      commonMistakes:
        "Using '*' instead of '%' for wildcard matching. In SQL, '%' is the multi-character wildcard.",
      rememberThis:
        "'%term%' matches anywhere, 'term%' matches prefix, and '%term' matches suffix.",
      analystContext:
        "Marketing wants to find all customers with a German email address (domain ending in .de).",
      taskPrompt:
        "Select first_name, last_name, and email from customers where email ends with '.de'.",
      starterSql: "-- Customers with .de emails\nSELECT first_name, last_name, email\nFROM customers\nWHERE email LIKE ",
      referenceSql: "SELECT first_name, last_name, email FROM customers WHERE email LIKE '%.de';",
      hints: [
        { costXp: 5, text: "Use the % wildcard before .de: '%.de'" },
      ],
      solutionExplanation:
        "The pattern '%.de' matches any string that concludes with '.de'.",
      xpReward: 50,
      tags: ["like", "wildcards", "strings"],
      prerequisites: ["ch2-l1"],
    },
    {
      id: "ch2-l7",
      chapterId: 2,
      slug: "handling-null-values",
      order: 7,
      title: "Missing Data: IS NULL",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "In SQL, NULL represents unknown or missing information. NULL is not zero, nor is it an empty string. You cannot compare NULL using '=' (the expression 'col = NULL' always yields UNKNOWN / FALSE). Instead, use IS NULL or IS NOT NULL.",
      syntaxExamples: "SELECT * FROM categories WHERE parent_id IS NULL;\nSELECT * FROM categories WHERE parent_id IS NOT NULL;",
      whyItMatters:
        "A classic bug in data reporting is using '= NULL', which silently returns zero rows. Real data is riddled with optional fields and missing keys.",
      commonMistakes:
        "Writing 'WHERE parent_id = NULL'. In SQL, always use 'IS NULL' or 'IS NOT NULL'.",
      rememberThis:
        "Never use '= NULL'. Always write 'IS NULL' or 'IS NOT NULL'.",
      analystContext:
        "In our product category hierarchy, top-level root categories have no parent category (their parent_id is NULL). Identify these root categories.",
      taskPrompt:
        "Select id, name, and description from categories where parent_id IS NULL.",
      starterSql: "-- Find root categories\nSELECT id, name, description\nFROM categories\nWHERE ",
      referenceSql: "SELECT id, name, description FROM categories WHERE parent_id IS NULL;",
      hints: [
        { costXp: 5, text: "Write: WHERE parent_id IS NULL" },
      ],
      solutionExplanation:
        "IS NULL tests for the absence of a value, successfully identifying the root parent categories.",
      xpReward: 50,
      tags: ["null", "is-null", "data-quality"],
      prerequisites: ["ch2-l1"],
    },
    {
      id: "ch2-l8",
      chapterId: 2,
      slug: "chapter-2-mastery",
      order: 8,
      title: "Mastery Challenge: The Targeted Campaign",
      difficulty: "Intermediate",
      estimatedMinutes: 10,
      type: "mastery-challenge",
      conceptExplanation:
        "Master boolean logic precedence: AND takes precedence over OR. Use parentheses to group expressions explicitly when combining AND with OR.",
      syntaxExamples: "SELECT * FROM tbl WHERE (colA = 'X' OR colA = 'Y') AND colB > 50;",
      whyItMatters:
        "Without parentheses, 'A OR B AND C' is evaluated as 'A OR (B AND C)', which completely alters the population of your business cohort.",
      commonMistakes:
        "Omitting parentheses around OR conditions when combined with an AND filter.",
      rememberThis:
        "Always use parentheses when mixing AND and OR: (A OR B) AND C.",
      analystContext:
        "Growth Marketing wants to send a VIP invitation to customers who live in either 'USA' OR 'UK', AND who currently hold 'active' status.",
      taskPrompt:
        "Select first_name, last_name, country, and status from customers where country is either 'USA' or 'UK', AND status is 'active'. Order by first_name ascending.",
      starterSql: "-- VIP Campaign Cohort\n",
      referenceSql: "SELECT first_name, last_name, country, status FROM customers WHERE (country = 'USA' OR country = 'UK') AND status = 'active' ORDER BY first_name ASC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Group the country check in parentheses: (country = 'USA' OR country = 'UK')" },
        { costXp: 10, text: "Or use: country IN ('USA', 'UK') AND status = 'active'" },
      ],
      solutionExplanation:
        "Parentheses guarantee that customer accounts must first match one of the two target nations, while strictly requiring the active account state.",
      xpReward: 65,
      tags: ["mastery", "precedence", "parentheses"],
      prerequisites: ["ch2-l7"],
    },
  ],
};
