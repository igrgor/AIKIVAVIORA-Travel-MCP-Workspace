// TODO: phase 4 — run migration after auth + Postgres provisioning
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workspaceTable = pgTable("workspace", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  watchlist: jsonb("watchlist").notNull().default([]),
  activeHotelId: text("active_hotel_id"),
  comparisonIds: jsonb("comparison_ids").notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WorkspaceRow = typeof workspaceTable.$inferSelect;
export type InsertWorkspaceRow = typeof workspaceTable.$inferInsert;
