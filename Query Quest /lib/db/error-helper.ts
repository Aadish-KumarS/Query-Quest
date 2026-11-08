export interface ErrorDiagnosis {
  category: string;
  friendlyMessage: string;
  hint: string;
  exampleFix?: string;
}

export function diagnoseSqlError(rawError: string, sqlQuery: string): ErrorDiagnosis {
  const err = rawError.toLowerCase();
  const query = sqlQuery.trim();

  // 1. Missing comma or syntax error near FROM / WHERE
  if (err.includes('near "from"') || err.includes('near "where"') || err.includes('near "join"')) {
    return {
      category: "Syntax Error",
      friendlyMessage: "SQLite encountered an unexpected keyword before it finished parsing the preceding clause.",
      hint: "Check the line right before this keyword. You may have missed a comma between column names, or left a trailing operator.",
      exampleFix: "Ensure columns are separated like: SELECT id, name, price FROM ...",
    };
  }

  // 2. Unknown / misspelled column name
  if (err.includes("no such column")) {
    const match = rawError.match(/no such column:\s*([^\s,]+)/i);
    const col = match ? match[1] : "the specified column";
    return {
      category: "Invalid Column Name",
      friendlyMessage: `Column '${col}' does not exist on this table or alias.`,
      hint: "Check spelling against the schema explorer on the left or center. If you are joining tables, remember to prefix with table alias (e.g., 'customers.id' or 'c.id').",
    };
  }

  // 3. Unknown table name
  if (err.includes("no such table")) {
    const match = rawError.match(/no such table:\s*([^\s,]+)/i);
    const tbl = match ? match[1] : "table";
    return {
      category: "Unknown Table",
      friendlyMessage: `Table '${tbl}' was not found in the active database.`,
      hint: "Consult the Schema tab to see valid table names (e.g. customers, products, orders, order_items, payments, returns, discounts).",
    };
  }

  // 4. Misuse of aggregate / GROUP BY errors
  if (err.includes("misuse of aggregate") || err.includes("aggregate function")) {
    return {
      category: "Aggregate Placement Error",
      friendlyMessage: "Aggregate functions (like SUM, AVG, COUNT, MAX) cannot be placed inside a WHERE clause directly.",
      hint: "To filter results based on aggregate calculations, use the HAVING clause following GROUP BY, or wrap the aggregate in a subquery/CTE.",
      exampleFix: "SELECT category_id, COUNT(*) FROM products GROUP BY category_id HAVING COUNT(*) > 5;",
    };
  }

  // 5. Incomplete query / unexpected EOF
  if (err.includes("incomplete input") || err.includes("unrecognized token")) {
    return {
      category: "Incomplete Statement",
      friendlyMessage: "Your SQL query seems to end abruptly or has an unclosed quote/parenthesis.",
      hint: "Check that every opened single quote ' has a matching closing quote, and all parentheses () are properly closed.",
    };
  }

  // 6. Ambiguous column name in JOIN
  if (err.includes("ambiguous column name")) {
    const match = rawError.match(/ambiguous column name:\s*([^\s,]+)/i);
    const col = match ? match[1] : "column";
    return {
      category: "Ambiguous Column Reference",
      friendlyMessage: `The column '${col}' exists in more than one joined table.`,
      hint: "Prefix the column with the specific table name or alias so SQLite knows which one you mean (e.g. orders.id vs products.id).",
      exampleFix: "SELECT orders.id, products.id FROM orders JOIN ...",
    };
  }

  // 7. General syntax error
  if (err.includes("syntax error")) {
    return {
      category: "Syntax Error",
      friendlyMessage: "SQLite could not parse the structure of your query.",
      hint: "Review SQL clause order: SELECT -> FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT.",
    };
  }

  // Default fallback
  return {
    category: "Execution Error",
    friendlyMessage: rawError,
    hint: "Examine the syntax and verify table and column names with the Schema Explorer.",
  };
}
