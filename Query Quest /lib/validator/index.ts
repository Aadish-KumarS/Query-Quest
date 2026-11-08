export interface QueryResult {
  columns: string[];
  values: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs?: number;
}

export interface ValidationRule {
  requireOrdering?: boolean;
  strictColumns?: boolean;
  expectedRowCount?: number;
  customCheck?: (userRes: QueryResult, expectedRes: QueryResult) => { pass: boolean; message: string } | null;
}

export interface ValidationOutcome {
  passed: boolean;
  headline: string;
  feedback: string;
  diagnostics?: {
    expectedColumns?: string[];
    actualColumns?: string[];
    expectedRowCount?: number;
    actualRowCount?: number;
    orderMismatch?: boolean;
  };
}

/**
 * Normalizes values for comparison (floats rounded to 2 decimals, strings trimmed and lowercased if needed)
 */
function normalizeVal(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") {
    // If it has decimals, round to 2 decimal places to avoid floating point precision discrepancies
    return Number.isInteger(val) ? val.toString() : val.toFixed(2);
  }
  return String(val).trim();
}

/**
 * Normalizes column names (case-insensitive, trims quotes or spaces)
 */
function normalizeCol(col: string): string {
  return col.trim().toLowerCase().replace(/[`"']/g, "");
}

/**
 * Serializes a row for set-based (order-independent) comparison
 */
function serializeRow(row: any[]): string {
  return row.map(normalizeVal).join("||");
}

export function validateQueryOutput(
  userResult: QueryResult,
  expectedResult: QueryResult,
  rules: ValidationRule = {}
): ValidationOutcome {
  const { requireOrdering = false, strictColumns = true } = rules;

  // 1. Column Count and Names Check
  const normUserCols = userResult.columns.map(normalizeCol);
  const normExpectedCols = expectedResult.columns.map(normalizeCol);

  if (normUserCols.length !== normExpectedCols.length) {
    return {
      passed: false,
      headline: "Column count does not match",
      feedback: `The task expected ${normExpectedCols.length} column(s) (${expectedResult.columns.join(", ")}), but your query returned ${normUserCols.length} (${userResult.columns.join(", ")}). Adjust your SELECT clause to output the requested fields.`,
      diagnostics: {
        expectedColumns: expectedResult.columns,
        actualColumns: userResult.columns,
        expectedRowCount: expectedResult.rowCount,
        actualRowCount: userResult.rowCount,
      },
    };
  }

  // If strict columns, verify each column name exists in expected
  if (strictColumns) {
    const missingCols = expectedResult.columns.filter(
      (c) => !normUserCols.includes(normalizeCol(c))
    );
    if (missingCols.length > 0) {
      return {
        passed: false,
        headline: "Missing required column(s)",
        feedback: `Your result is missing the column(s): ${missingCols.map((c) => `'${c}'`).join(", ")}. If you used an aggregate or calculation, make sure you used the 'AS' alias specified in the instructions.`,
        diagnostics: {
          expectedColumns: expectedResult.columns,
          actualColumns: userResult.columns,
        },
      };
    }
  }

  // 2. Row Count Check
  if (userResult.rowCount !== expectedResult.rowCount) {
    let diffFeedback = `Expected ${expectedResult.rowCount} row(s), but your query returned ${userResult.rowCount} row(s).`;
    if (userResult.rowCount === 0) {
      diffFeedback += " Your query returned no rows at all. Check your WHERE filter or JOIN conditions.";
    } else if (userResult.rowCount > expectedResult.rowCount) {
      diffFeedback += " You returned too many rows. Check if you need a WHERE filter, GROUP BY, DISTINCT, or LIMIT.";
    } else {
      diffFeedback += " You returned fewer rows than expected. Check if your WHERE filter is too restrictive or if you accidentally used INNER JOIN instead of LEFT JOIN.";
    }

    return {
      passed: false,
      headline: "Row count mismatch",
      feedback: diffFeedback,
      diagnostics: {
        expectedRowCount: expectedResult.rowCount,
        actualRowCount: userResult.rowCount,
      },
    };
  }

  // Align user columns to expected columns order if columns are permuted
  const colIndexMap = normExpectedCols.map((expCol) => {
    const idx = normUserCols.indexOf(expCol);
    return idx !== -1 ? idx : 0;
  });

  const alignedUserValues = userResult.values.map((row) =>
    colIndexMap.map((idx) => row[idx])
  );

  // 3. Ordered Comparison
  if (requireOrdering) {
    let orderFailed = false;
    for (let r = 0; r < expectedResult.rowCount; r++) {
      const expRow = expectedResult.values[r];
      const userRow = alignedUserValues[r];
      for (let c = 0; c < expRow.length; c++) {
        if (normalizeVal(expRow[c]) !== normalizeVal(userRow[c])) {
          orderFailed = true;
          break;
        }
      }
      if (orderFailed) break;
    }

    if (orderFailed) {
      // Check if rows are identical as a multiset but in wrong order
      const expRowsSorted = [...expectedResult.values].map(serializeRow).sort();
      const userRowsSorted = [...alignedUserValues].map(serializeRow).sort();
      const multisetEqual =
        expRowsSorted.every((v, i) => v === userRowsSorted[i]);

      if (multisetEqual) {
        return {
          passed: false,
          headline: "Order of results is incorrect",
          feedback: "Your query returned the correct rows and calculations, but in the wrong order. This exercise requires explicit ordering. Add an 'ORDER BY ... ASC/DESC' clause.",
          diagnostics: {
            orderMismatch: true,
          },
        };
      } else {
        return {
          passed: false,
          headline: "Result values do not match",
          feedback: "The values in your result rows do not match the expected dataset. Check your calculations, formulas, or filter logic.",
        };
      }
    }
  } else {
    // 4. Unordered (Set-based) Comparison
    const expRowsSorted = [...expectedResult.values].map(serializeRow).sort();
    const userRowsSorted = [...alignedUserValues].map(serializeRow).sort();

    const multisetEqual =
      expRowsSorted.length === userRowsSorted.length &&
      expRowsSorted.every((v, i) => v === userRowsSorted[i]);

    if (!multisetEqual) {
      return {
        passed: false,
        headline: "Result values do not match",
        feedback: "Your query returned the expected number of rows and columns, but the actual row values do not match. Verify your filter criteria, mathematical expressions, or join relationships.",
      };
    }
  }

  // 5. Custom Check (if provided)
  if (rules.customCheck) {
    const customRes = rules.customCheck(userResult, expectedResult);
    if (customRes && !customRes.pass) {
      return {
        passed: false,
        headline: "Task criteria not satisfied",
        feedback: customRes.message,
      };
    }
  }

  return {
    passed: true,
    headline: "Mission accomplished!",
    feedback: "All rows, columns, and data validations match expected output. Excellent analytical work!",
  };
}
