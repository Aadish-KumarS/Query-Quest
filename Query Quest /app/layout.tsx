import type { Metadata } from "next";
import "./globals.css";
import { LearnerProvider } from "@/components/LearnerContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Query Quest — In-Browser Analytical SQL Platform",
  description: "Master modern SQL from First Queries to Window Functions & Business Analytics in an in-browser SQLite WebAssembly engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="obsidian">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased selection:bg-accent-gold/20 selection:text-text-primary">
        <LearnerProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </LearnerProvider>
      </body>
    </html>
  );
}
