// TODO: phase 4 — run migration after auth + Postgres provisioning
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const reportsTable = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  tags: jsonb("tags").notNull().default([]),
  hotelIds: jsonb("hotel_ids").notNull().default([]),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ReportRow = typeof reportsTable.$inferSelect;
export type InsertReportRow = typeof reportsTable.$inferInsert;
