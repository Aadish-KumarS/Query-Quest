import { DatasetMeta } from "./types";

export const streamingDataset: DatasetMeta = {
  id: "streaming",
  name: "CineFlow Streaming",
  badge: "Entertainment & Media",
  description: "A subscription video-on-demand service with subscriber accounts, content catalog, genre taxonomies, and high-frequency playback sessions.",
  tableCount: 5,
  tables: [
    {
      name: "users",
      description: "Subscribers registered on the platform",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Subscriber ID" },
        { name: "username", type: "TEXT", nullable: false, description: "Handle / display handle" },
        { name: "email", type: "TEXT", nullable: false, description: "Account email" },
        { name: "signup_date", type: "TEXT", nullable: false, description: "Member since date" },
        { name: "country", type: "TEXT", nullable: false, description: "Region code" },
      ],
    },
    {
      name: "genres",
      description: "Film and television categories",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Genre code" },
        { name: "name", type: "TEXT", nullable: false, description: "Genre designation" },
      ],
    },
    {
      name: "shows",
      description: "Available titles in the streaming library",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Title identifier" },
        { name: "title", type: "TEXT", nullable: false, description: "Show or movie title" },
        { name: "genre_id", type: "INTEGER", isForeign: true, references: "genres.id", nullable: false, description: "Primary genre" },
        { name: "release_year", type: "INTEGER", nullable: false, description: "Year of initial broadcast" },
        { name: "rating", type: "REAL", nullable: false, description: "Viewer critique score (1.0 to 10.0)" },
        { name: "total_episodes", type: "INTEGER", nullable: false, description: "Episode count (1 for feature film)" },
      ],
    },
    {
      name: "subscriptions",
      description: "Membership tier and billing status",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Subscription tier record" },
        { name: "user_id", type: "INTEGER", isForeign: true, references: "users.id", nullable: false, description: "Subscriber identifier" },
        { name: "plan", type: "TEXT", nullable: false, description: "Tier: free, standard, premium" },
        { name: "monthly_cost", type: "REAL", nullable: false, description: "Recurring billing cost (USD)" },
        { name: "start_date", type: "TEXT", nullable: false, description: "Tier commencement date" },
        { name: "is_active", type: "INTEGER", nullable: false, description: "1 for currently active, 0 for lapsed" },
      ],
    },
    {
      name: "viewing_events",
      description: "Stream session telemetry and watch history",
      columns: [
        { name: "id", type: "INTEGER", isPrimary: true, description: "Watch log ID" },
        { name: "user_id", type: "INTEGER", isForeign: true, references: "users.id", nullable: false, description: "Viewing user" },
        { name: "show_id", type: "INTEGER", isForeign: true, references: "shows.id", nullable: false, description: "Streamed title" },
        { name: "watch_date", type: "TEXT", nullable: false, description: "Playback timestamp / date" },
        { name: "duration_minutes", type: "INTEGER", nullable: false, description: "Minutes consumed" },
        { name: "device", type: "TEXT", nullable: false, description: "Client: smart_tv, mobile, web, tablet" },
      ],
    },
  ],
  sampleQueries: [
    {
      title: "Top Rated Shows by Genre",
      description: "Discover highest rated shows partitioned by genre",
      sql: `SELECT g.name AS genre, s.title, s.rating, s.release_year
FROM shows s
JOIN genres g ON s.genre_id = g.id
WHERE s.rating >= 8.5
ORDER BY s.rating DESC;`,
    },
    {
      title: "Watch Time by Platform Device",
      description: "Calculate total hours streamed across device classes",
      sql: `SELECT device,
       COUNT(*) AS total_streams,
       ROUND(SUM(duration_minutes) / 60.0, 1) AS total_hours_streamed
FROM viewing_events
GROUP BY device
ORDER BY total_hours_streamed DESC;`,
    },
  ],
  sql: `
DROP TABLE IF EXISTS viewing_events;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  signup_date TEXT NOT NULL,
  country TEXT NOT NULL
);

CREATE TABLE genres (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE shows (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  genre_id INTEGER NOT NULL,
  release_year INTEGER NOT NULL,
  rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 10),
  total_episodes INTEGER NOT NULL,
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL CHECK(plan IN ('free', 'standard', 'premium')),
  monthly_cost REAL NOT NULL,
  start_date TEXT NOT NULL,
  is_active INTEGER NOT NULL CHECK(is_active IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE viewing_events (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  watch_date TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  device TEXT NOT NULL CHECK(device IN ('smart_tv', 'mobile', 'web', 'tablet')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (show_id) REFERENCES shows(id)
);

INSERT INTO genres (id, name) VALUES
  (1, 'Sci-Fi & Fantasy'),
  (2, 'Crime & Mystery'),
  (3, 'Historical Drama'),
  (4, 'Documentary'),
  (5, 'Comedy & Satire');

INSERT INTO shows (id, title, genre_id, release_year, rating, total_episodes) VALUES
  (1, 'Chronos Paradox', 1, 2022, 9.1, 10),
  (2, 'The Midnight Dossier', 2, 2021, 8.8, 8),
  (3, 'Crown of Castille', 3, 2020, 8.4, 24),
  (4, 'Deep Ocean Odyssey', 4, 2023, 9.4, 6),
  (5, 'Silicon Bureau', 5, 2022, 8.2, 18),
  (6, 'Quantum Horizon', 1, 2023, 7.9, 12),
  (7, 'Fog on the Thames', 2, 2019, 8.6, 16),
  (8, 'The Last Glacier', 4, 2024, 8.9, 1);

INSERT INTO users (id, username, email, signup_date, country) VALUES
  (1, 'cinephile99', 'cinephile@example.com', '2023-01-10', 'US'),
  (2, 'luna_stream', 'luna@example.co.uk', '2023-02-15', 'UK'),
  (3, 'nordic_eye', 'nordic@example.se', '2023-03-22', 'SE'),
  (4, 'tokyo_drift', 'tokyo@example.jp', '2023-04-05', 'JP'),
  (5, 'samba_watcher', 'samba@example.br', '2023-05-18', 'BR'),
  (6, 'indie_dev', 'indie@example.de', '2023-06-30', 'DE');

INSERT INTO subscriptions (id, user_id, plan, monthly_cost, start_date, is_active) VALUES
  (1, 1, 'premium', 19.99, '2023-01-10', 1),
  (2, 2, 'standard', 14.99, '2023-02-15', 1),
  (3, 3, 'premium', 19.99, '2023-03-22', 1),
  (4, 4, 'free', 0.00, '2023-04-05', 1),
  (5, 5, 'standard', 14.99, '2023-05-18', 0),
  (6, 6, 'premium', 19.99, '2023-06-30', 1);

INSERT INTO viewing_events (id, user_id, show_id, watch_date, duration_minutes, device) VALUES
  (1, 1, 1, '2023-10-01', 58, 'smart_tv'),
  (2, 1, 1, '2023-10-02', 62, 'smart_tv'),
  (3, 2, 2, '2023-10-03', 45, 'mobile'),
  (4, 3, 4, '2023-10-05', 90, 'web'),
  (5, 4, 5, '2023-10-06', 30, 'tablet'),
  (6, 6, 1, '2023-10-07', 60, 'smart_tv'),
  (7, 2, 7, '2023-10-08', 52, 'mobile'),
  (8, 1, 4, '2023-10-10', 88, 'smart_tv'),
  (9, 3, 1, '2023-10-12', 60, 'web'),
  (10, 5, 2, '2023-10-14', 44, 'smart_tv');
`,
};
