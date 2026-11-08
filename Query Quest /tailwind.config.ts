import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="obsidian"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          hover: "var(--bg-hover)",
        },
        border: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
          accent: "var(--border-accent)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          accent: "var(--text-accent)",
        },
        accent: {
          gold: "var(--accent-gold)",
          orange: "var(--accent-orange)",
          emerald: "var(--accent-emerald)",
          cyan: "var(--accent-cyan)",
          rose: "var(--accent-rose)",
          violet: "var(--accent-violet)",
        },
        status: {
          success: "var(--status-success)",
          error: "var(--status-error)",
          warning: "var(--status-warning)",
          info: "var(--status-info)",
        },
        editor: {
          bg: "var(--editor-bg)",
          line: "var(--editor-line)",
          selection: "var(--editor-selection)",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.25)',
        'glow-accent': '0 0 25px var(--accent-glow)',
      }
    },
  },
  plugins: [],
};

export default config;
