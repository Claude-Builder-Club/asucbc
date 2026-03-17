import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const resourceSubmissions = pgTable(
  "resource_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    link: text("link").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("resource_submissions_created_at_idx").on(table.createdAt)]
);

export type ResourceSubmission = typeof resourceSubmissions.$inferSelect;
export type NewResourceSubmission = typeof resourceSubmissions.$inferInsert;
