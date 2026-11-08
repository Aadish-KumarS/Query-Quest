import { Chapter } from "./types";

export const chapter1: Chapter = {
  id: 1,
  slug: "first-queries",
  title: "First Queries",
  subtitle: "Understanding tables, schemas, and fetching targeted columns",
  capabilityStatement: "Inspect relational tables, extract specific columns, eliminate duplicates, and sort records with precision.",
  estimatedHours: 1.2,
  totalXp: 350,
  badgeId: "first_query",
  lessons: [
    {
      id: "ch1-l1",
      chapterId: 1,
      slug: "inspecting-the-archive",
      order: 1,
      title: "Inspecting the Archive",
      difficulty: "Beginner",
      estimatedMinutes: 5,
      type: "scratch",
      conceptExplanation:
        "A relational database stores structured records organized in tables. Each row represents a single entity (such as a customer), and each column holds an attribute (such as first name or email). The SELECT statement is the fundamental tool for reading data from a table without modifying it.",
      syntaxExamples: "SELECT * FROM table_name;\nSELECT * FROM customers LIMIT 10;",
      whyItMatters:
        "Every analytical investigation begins with orientation. Before calculating metrics or filtering hypotheses, analysts inspect raw records to observe formats, data types, and null patterns.",
      commonMistakes:
        "Typing FROM before SELECT, or misspelling table names. Remember that SQL keywords are case-insensitive, but consistency improves readability.",
      rememberThis:
        "The asterisk (*) stands for 'all columns'. Use it during initial exploration, but request specific columns in production queries.",
      analystContext:
        "The marketing team has requested a raw sample of customer profiles to verify how customer records are formatted before launching an onboarding email sequence.",
      taskPrompt:
        "Write a query to retrieve all columns from the customers table, capped at the first 5 records.",
      starterSql: "-- Fetch the first 5 records from customers\nSELECT ",
      referenceSql: "SELECT * FROM customers LIMIT 5;",
      hints: [
        { costXp: 5, text: "Use the asterisk (*) symbol to select all columns." },
        { costXp: 10, text: "Finish your query with LIMIT 5; to restrict the output to 5 rows." },
      ],
      solutionExplanation:
        "The query 'SELECT * FROM customers LIMIT 5;' scans the customers table and returns the first 5 rows with all attributes.",
      xpReward: 35,
      tags: ["select", "basics", "limit"],
      prerequisites: [],
    },
    {
      id: "ch1-l2",
      chapterId: 1,
      slug: "choosing-specific-columns",
      order: 2,
      title: "Targeting Columns",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "In production analytics, querying with 'SELECT *' is an anti-pattern: it transfers unnecessary data over the wire, increases memory footprint, and slows execution. By specifying comma-separated column names, you retrieve only the data you need.",
      syntaxExamples: "SELECT column1, column2, column3 FROM table_name;",
      whyItMatters:
        "Real enterprise tables frequently contain 50+ columns, including JSON blobs, audit logs, and internal timestamps. Selective projection keeps dashboards snappy and pipelines lean.",
      commonMistakes:
        "Placing a comma after the last column name right before FROM (e.g. 'SELECT id, email, FROM customers').",
      rememberThis:
        "Separate each column name with a comma, but leave no trailing comma before the FROM keyword.",
      analystContext:
        "Privacy regulations dictate that internal marketing exports must exclude database IDs and account status flags. Extract only the shopper's name and contact email.",
      taskPrompt:
        "Retrieve only the first_name, last_name, and email columns from the customers table for all customers.",
      starterSql: "-- Select specific columns from customers\nSELECT \nFROM customers;",
      referenceSql: "SELECT first_name, last_name, email FROM customers;",
      hints: [
        { costXp: 5, text: "List the column names first_name, last_name, and email separated by commas." },
        { costXp: 10, text: "Do not add a comma after email." },
      ],
      solutionExplanation:
        "SELECT first_name, last_name, email FROM customers; reads solely those three columns across all customer rows.",
      xpReward: 40,
      tags: ["select", "columns", "projection"],
      prerequisites: ["ch1-l1"],
    },
    {
      id: "ch1-l3",
      chapterId: 1,
      slug: "aliasing-columns",
      order: 3,
      title: "Clarity with Aliases",
      difficulty: "Beginner",
      estimatedMinutes: 7,
      type: "fill-in-the-blank",
      conceptExplanation:
        "Database column names are often terse or follow legacy database naming schemes (such as 'cust_addr_ln1'). The AS keyword allows you to assign a clear, human-readable temporary label to a column for presentation.",
      syntaxExamples: "SELECT column_name AS clean_label FROM table_name;",
      whyItMatters:
        "When business stakeholders open an executive report, seeing 'product_name' and 'retail_price' is intuitive, whereas 'p_nm' or generic 'name' creates friction.",
      commonMistakes:
        "Using spaces inside alias names without wrapping them in double quotes. Prefer snake_case such as 'product_title' over 'Product Title'.",
      rememberThis:
        "Aliases only alter how the column header is labeled in the query output; they never modify the underlying table schema.",
      analystContext:
        "You are preparing a catalog export for the retail merchandising committee. Rename 'name' to 'product_title' and 'price' to 'unit_price'.",
      taskPrompt:
        "Fill in the blanks to query the products table, selecting 'name' aliased as 'product_title', and 'price' aliased as 'unit_price'.",
      starterSql: "SELECT name AS product_title, price AS unit_price FROM products;",
      referenceSql: "SELECT name AS product_title, price AS unit_price FROM products;",
      hints: [
        { costXp: 5, text: "Use the syntax: column_name AS alias_name." },
      ],
      solutionExplanation:
        "Using 'name AS product_title, price AS unit_price' renames the resulting columns in the output dataset.",
      xpReward: 40,
      tags: ["alias", "as", "readability"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch1-l4",
      chapterId: 1,
      slug: "deduplicating-with-distinct",
      order: 4,
      title: "Eliminating Duplicates",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      type: "scratch",
      conceptExplanation:
        "Tables frequently record multiple rows sharing identical values in particular columns. The DISTINCT keyword filters the output rows so that each unique combination appears only once.",
      syntaxExamples: "SELECT DISTINCT column_name FROM table_name;",
      whyItMatters:
        "If you query 'SELECT country FROM customers', the same country will repeat for every resident. Adding DISTINCT instantly answers: 'Which distinct countries do we serve?'",
      commonMistakes:
        "Placing DISTINCT after the column name (e.g. 'SELECT country DISTINCT'). DISTINCT always follows directly after SELECT.",
      rememberThis:
        "DISTINCT applies across all columns selected. If you write 'SELECT DISTINCT country, city', it returns unique pairs of country and city.",
      analystContext:
        "The logistics partner is planning regional fulfillment hubs. They need a clean list of every unique country represented in our customer database.",
      taskPrompt:
        "Write a query to return all unique countries from the customers table.",
      starterSql: "-- Return every unique country represented in customers\n",
      referenceSql: "SELECT DISTINCT country FROM customers;",
      hints: [
        { costXp: 5, text: "Start your statement with SELECT DISTINCT." },
        { costXp: 10, text: "Provide only the country column from customers." },
      ],
      solutionExplanation:
        "SELECT DISTINCT country FROM customers; extracts every row's country value and discards duplicates, producing one entry per nation.",
      xpReward: 45,
      tags: ["distinct", "deduplication"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch1-l5",
      chapterId: 1,
      slug: "sorting-records",
      order: 5,
      title: "Sorting the Findings",
      difficulty: "Beginner",
      estimatedMinutes: 8,
      type: "scratch",
      conceptExplanation:
        "Relational databases do not store rows in any guaranteed order. To arrange your output systematically, use the ORDER BY clause. Specify ASC for ascending order (lowest to highest / A-Z) or DESC for descending order (highest to lowest / Z-A). ASC is the default if omitted.",
      syntaxExamples: "SELECT name, price FROM products ORDER BY price DESC;\nSELECT name FROM products ORDER BY name ASC;",
      whyItMatters:
        "Whether identifying your top revenue drivers, longest-waiting support tickets, or most recent orders, analytical rankings depend strictly on deterministic sorting.",
      commonMistakes:
        "Placing ORDER BY before the FROM clause. SQL query clauses follow a rigid grammatical order: SELECT -> FROM -> ORDER BY.",
      rememberThis:
        "ORDER BY comes after FROM. If omitted, the database engine may return rows in arbitrary physical storage sequence.",
      analystContext:
        "The inventory director wants to review our most expensive products first to audit high-value items.",
      taskPrompt:
        "Retrieve the name and price of all products from the products table, ordered from highest price to lowest price.",
      starterSql: "-- Select name and price sorted from most expensive to least expensive\nSELECT name, price\nFROM products\n",
      referenceSql: "SELECT name, price FROM products ORDER BY price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Add ORDER BY price at the bottom of your query." },
        { costXp: 10, text: "Append the DESC keyword after price to sort in descending order." },
      ],
      solutionExplanation:
        "SELECT name, price FROM products ORDER BY price DESC; orders the merchandise from highest selling price to lowest.",
      xpReward: 45,
      tags: ["order-by", "sorting", "desc"],
      prerequisites: ["ch1-l2"],
    },
    {
      id: "ch1-l6",
      chapterId: 1,
      slug: "multi-column-sorting",
      order: 6,
      title: "Multi-Column Sorting",
      difficulty: "Intermediate",
      estimatedMinutes: 7,
      type: "reorder-clauses",
      conceptExplanation:
        "You can sort by multiple columns by listing them sequentially in the ORDER BY clause, separated by commas. The database sorts by the first column; whenever values tie, it sorts those ties by the second column.",
      syntaxExamples: "SELECT category_id, price, name FROM products ORDER BY category_id ASC, price DESC;",
      whyItMatters:
        "Grouping items visually within their respective departments while maintaining an internal ranking (e.g. premium to budget within each category) is a daily reporting requirement.",
      commonMistakes:
        "Writing 'ORDER BY category_id, price DESC' and assuming DESC applies to both. The direction flag applies only to the column immediately preceding it.",
      rememberThis:
        "Each sort column can have its own independent ASC or DESC modifier.",
      analystContext:
        "Merchandising needs products listed by category_id (in ascending order), and within each category, sorted from highest price to lowest price.",
      taskPrompt:
        "Query category_id, price, and name from the products table. Sort primary results by category_id ascending, and tie-break by price descending.",
      starterSql: "SELECT category_id, price, name\nFROM products\nORDER BY category_id ASC, price DESC;",
      referenceSql: "SELECT category_id, price, name FROM products ORDER BY category_id ASC, price DESC;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Order first by category_id ASC, then add a comma, then price DESC." },
      ],
      solutionExplanation:
        "Sorting by category_id ASC groups categories together from 1 to 7, and within each category products are sorted from priciest to cheapest.",
      xpReward: 50,
      tags: ["order-by", "multi-column", "sorting"],
      prerequisites: ["ch1-l5"],
    },
    {
      id: "ch1-l7",
      chapterId: 1,
      slug: "top-n-with-limit",
      order: 7,
      title: "Top-N Analysis with LIMIT",
      difficulty: "Beginner",
      estimatedMinutes: 7,
      type: "scratch",
      conceptExplanation:
        "Combining ORDER BY with LIMIT allows you to answer classic 'Top-N' questions: 'Who are our top 3 spenders?' or 'What are the 5 newest signups?'",
      syntaxExamples: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
      whyItMatters:
        "Executive summaries rarely display 10,000 rows. Stakeholders want the Top 3 bestsellers or Top 5 churn risks.",
      commonMistakes:
        "Using LIMIT without an ORDER BY clause. A LIMIT without ORDER BY returns an arbitrary subset of rows, making your report non-reproducible.",
      rememberThis:
        "Always pair LIMIT with an explicit ORDER BY when answering ranking questions.",
      analystContext:
        "The homepage curation team needs to showcase the 3 most premium products currently in the catalog.",
      taskPrompt:
        "Select the name and price of the 3 most expensive products from the products table.",
      starterSql: "-- Return top 3 most expensive items\n",
      referenceSql: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Order by price DESC, then append LIMIT 3 at the end." },
      ],
      solutionExplanation:
        "Sorting price descending puts the highest price at row 1, and LIMIT 3 caps the result to the top 3 items.",
      xpReward: 45,
      tags: ["limit", "top-n", "order-by"],
      prerequisites: ["ch1-l5"],
    },
    {
      id: "ch1-l8",
      chapterId: 1,
      slug: "chapter-1-mastery",
      order: 8,
      title: "Mastery Challenge: The Executive Catalog",
      difficulty: "Intermediate",
      estimatedMinutes: 10,
      type: "mastery-challenge",
      conceptExplanation:
        "Combine column projection, aliasing, deterministic multi-level sorting, and row limits in a single query.",
      syntaxExamples: "SELECT col1 AS a1, col2 AS a2 FROM tbl ORDER BY a1 ASC LIMIT 5;",
      whyItMatters:
        "Synthesizing multiple fundamental SQL clauses builds the fluency required for production data extraction.",
      commonMistakes:
        "Mixing up the order of clauses. Remember: SELECT ... FROM ... ORDER BY ... LIMIT ...",
      rememberThis:
        "SQLite allows referencing column aliases in the ORDER BY clause.",
      analystContext:
        "The Chief Commercial Officer requests an executive list of our 5 highest priced items. They want columns named 'item' (from name) and 'retail_cost' (from price), sorted from highest cost down.",
      taskPrompt:
        "Select the name column aliased as 'item', and price aliased as 'retail_cost' from products. Sort by retail_cost descending and limit to 5 rows.",
      starterSql: "-- Executive catalog query\n",
      referenceSql: "SELECT name AS item, price AS retail_cost FROM products ORDER BY retail_cost DESC LIMIT 5;",
      requireOrdering: true,
      hints: [
        { costXp: 5, text: "Use: SELECT name AS item, price AS retail_cost FROM products" },
        { costXp: 10, text: "Finish with: ORDER BY retail_cost DESC LIMIT 5;" },
      ],
      solutionExplanation:
        "This combines projection, aliasing with AS, descending sorting by the aliased metric, and row capping with LIMIT.",
      xpReward: 60,
      tags: ["mastery", "chapter1", "synthesis"],
      prerequisites: ["ch1-l7"],
    },
  ],
};
