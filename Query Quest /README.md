# Query Quest 🧭 — In-Browser Analytical SQL Platform

**Query Quest** is a polished, frontend-only SQL learning platform engineered to teach real analytical SQL—from foundational `SELECT` projections through multi-table joins, subqueries, Common Table Expressions (CTEs), and window functions.

Unlike platforms that simulate queries with static string matching or mock servers, Query Quest executes every query against an authentic, preloaded **SQLite database running directly in the browser via WebAssembly (sql.js)** inside a dedicated Web Worker.

---

## ⚡ Technical Architecture

- **Framework**: Next.js 14 with TypeScript & React 18
- **Styling**: Tailwind CSS with CSS Variables / Design Tokens
- **Database Engine**: `sql.js` (SQLite compiled to WebAssembly)
- **Concurrency**: Dedicated Web Worker (`/sql-worker.js`) executing queries off the main UI thread
- **State & Persistence**: `localStorage` (XP, lesson completion, calendar streak, badges, weak-area analytics, theme preferences)
- **Deployment**: Static Vercel deployment with zero backend, database server, login, or third-party paid API requirements

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js `v18+` or `v20+` or `v22+`
- npm or pnpm

### 1. Installation

```bash
npm install
```

### 2. Copy WebAssembly Assets (Automatic or Manual)

The WebAssembly binary `sql-wasm.wasm` and loader `sql-wasm.js` are copied to the `public/` directory:

```bash
mkdir -p public && cp node_modules/sql.js/dist/sql-wasm.wasm public/ && cp node_modules/sql.js/dist/sql-wasm.js public/
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## ☁️ Vercel Deployment Instructions

Query Quest is designed to run seamlessly on Vercel as a zero-configuration deployment:

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, click **Add New Project** and import the repository.
3. Keep default settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Click **Deploy**. Vercel will build and serve the application globally on its Edge network.

---

## 🧬 Browser-Only Data Model & Validation Engine

### Ephemeral Database Snapshots

- When the application boots, the Web Worker creates SQLite database instances initialized with realistic domain data and exports a pristine binary snapshot (`db.export()`).
- When a learner submits a query, the validation engine spawns **ephemeral database clones** from the snapshot for both the learner's query and the curriculum reference query.
- The learner's actual output matrix (columns, row count, and values) is compared against the reference output.
- Queries are judged on **semantic output**, allowing multiple valid approaches (e.g. CTE vs subquery, different column alias styles).
- Ordering is strictly validated only when the exercise explicitly specifies `requireOrdering: true`.

### Error Diagnosis Help Layer

When SQLite returns a syntax error, Query Quest parses the compiler error and provides diagnostic help:
- Explains why the parser failed (e.g. missing comma before `FROM`, misplaced aggregate in `WHERE`, ambiguous column name in multi-table join).
- Suggests targeted fixes and syntax examples.
- Automatically logs the error topic in `weakAreas` to recommend review exercises.

---

## 🎨 Design Themes

Query Quest features three distinct handcrafted design themes:

1. **The Obsidian Archive (Dark Fantasy)**:
   - Charcoal, ink-black, near-black navy with muted gold and ember orange accents.
   - High-contrast, crisp code editor syntax.
2. **The Scholar’s Guild (Medieval Fantasy)**:
   - Warm parchment, deep ink, forest green, burgundy, and antique gold.
   - Tasteful manuscript styling with refined typography.
3. **The Coastal Lab (Beach & Ocean)**:
   - Soft sand, off-white, ocean blue, seafoam, and sunset navy.
   - Clean, calm, modern editorial feel.

Themes can be switched in **Settings**, **Onboarding**, or the top navigation bar.

---

## 📚 Complete 9-Chapter Curriculum

| Chapter | Title | Focus & Core Concepts |
| :--- | :--- | :--- |
| **1** | **First Queries** | Projections, `SELECT`, column selection, `AS` aliases, `DISTINCT`, `ORDER BY`, `LIMIT` |
| **2** | **Finding the Right Rows** | `WHERE`, comparisons, `AND`, `OR`, `IN`, `BETWEEN`, `LIKE` wildcards, `IS NULL` |
| **3** | **Summarising the Evidence** | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`, `COUNT(DISTINCT)` |
| **4** | **Connecting the Tables** | Relational keys, `INNER JOIN`, `LEFT JOIN`, anti-joins, table aliases, self-joins |
| **5** | **Shaping Messy Data** | `CASE WHEN`, `COALESCE`, `NULLIF`, string concatenation (`\|\|`), `STRFTIME`, `CAST` |
| **6** | **Thinking in Steps** | Scalar subqueries, `IN` subqueries, correlated subqueries, modular CTEs (`WITH`) |
| **7** | **Analysing Across Rows** | Window functions (`OVER`, `PARTITION BY`), `ROW_NUMBER`, `DENSE_RANK`, `LAG`, running totals |
| **8** | **Solving Business Questions** | GMV vs. Net Sales, repeat purchase rate, RFM, realized margins, return rates, funnels |
| **9** | **Writing SQL Like a Pro** | `UNION` / `UNION ALL`, `EXCEPT`, Views, sargable index seeks, quality assertions, capstone case study |

---

## 🧪 Seeded Datasets

1. **Meridian Commerce (Primary Curriculum)**:
   - Tables: `customers`, `products`, `categories`, `orders`, `order_items`, `payments`, `returns`, `discounts`
   - Features deliberate edge cases: customers with 0 orders, products with 0 sales, failed payments, item returns, discounts.
2. **Apex Global Operations (Sandbox)**:
   - Tables: `departments`, `employees`, `projects`, `salaries`, `performance_reviews`
   - Explores management self-joins and departmental compensation distributions.
3. **CineFlow Streaming (Sandbox)**:
   - Tables: `users`, `genres`, `shows`, `subscriptions`, `viewing_events`
   - Telemetry data for device usage and subscription tier tracking.

---

## 🛠️ Adding a New Lesson or Dataset

### Adding a Lesson

1. Open `lib/curriculum/chapterX.ts`.
2. Add a new `LessonItem` object to the `lessons` array:
   ```typescript
   {
     id: "chX-lY",
     chapterId: X,
     slug: "lesson-slug-name",
     order: Y,
     title: "Lesson Title",
     difficulty: "Beginner" | "Intermediate" | "Advanced",
     estimatedMinutes: 8,
     type: "scratch",
     conceptExplanation: "...",
     syntaxExamples: "...",
     whyItMatters: "...",
     commonMistakes: "...",
     rememberThis: "...",
     analystContext: "...",
     taskPrompt: "...",
     starterSql: "SELECT ...",
     referenceSql: "SELECT ...",
     requireOrdering: false,
     hints: [{ costXp: 5, text: "..." }],
     solutionExplanation: "...",
     xpReward: 50,
     tags: ["join", "where"],
     prerequisites: ["chX-lPrev"],
   }
   ```
3. The new lesson automatically populates in the learning map, navigation, and challenge pages!

### Adding a Dataset

1. Create `lib/datasets/myDataset.ts` adhering to `DatasetMeta`.
2. Export schema definitions, column descriptions, and SQL DDL + seed queries.
3. Register the dataset in `lib/datasets/index.ts`.

---

## ⚠️ SQLite Browser WebAssembly Notes

- **RIGHT JOIN & FULL OUTER JOIN**: SQLite does not implement `RIGHT JOIN` natively. The platform teaches learners to reverse table positions with `LEFT JOIN`, which is standard practice in SQLite.
- **Date/Time Storage**: SQLite stores dates as ISO 8601 strings (`YYYY-MM-DD`). Date operations use SQLite's native `STRFTIME()`.
- **Concurrency**: All database calculations execute inside a Web Worker, ensuring zero UI thread stuttering or blocking.
