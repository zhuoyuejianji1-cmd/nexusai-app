import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// 用户表
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    nickname: varchar("nickname", { length: 64 }).notNull(),
    avatar_url: text("avatar_url"),
    bio: text("bio"),
    points: integer("points").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_created_at_idx").on(table.created_at),
  ]
);

// 动态表
export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    content: text("content").notNull(),
    images: jsonb("images").default(sql`'[]'::jsonb`),
    likes_count: integer("likes_count").default(0).notNull(),
    comments_count: integer("comments_count").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("posts_user_id_idx").on(table.user_id),
    index("posts_created_at_idx").on(table.created_at),
  ]
);

// 点赞表
export const likes = pgTable(
  "likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    post_id: varchar("post_id", { length: 36 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("likes_user_id_idx").on(table.user_id),
    index("likes_post_id_idx").on(table.post_id),
    index("likes_user_post_idx").on(table.user_id, table.post_id),
  ]
);

// 评论表
export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    post_id: varchar("post_id", { length: 36 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("comments_user_id_idx").on(table.user_id),
    index("comments_post_id_idx").on(table.post_id),
    index("comments_created_at_idx").on(table.created_at),
  ]
);

// 资源表
export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 64 }).notNull(),
    url: text("url").notNull(),
    cover_url: text("cover_url"),
    likes_count: integer("likes_count").default(0).notNull(),
    views_count: integer("views_count").default(0).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("resources_category_idx").on(table.category),
    index("resources_created_at_idx").on(table.created_at),
    index("resources_likes_count_idx").on(table.likes_count),
  ]
);

// 任务表
export const tasks = pgTable(
  "tasks",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    steps: jsonb("steps").default(sql`'[]'::jsonb`),
    duration: varchar("duration", { length: 32 }),
    points: integer("points").default(10).notNull(),
    path_id: integer("path_id").default(1).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("tasks_path_id_idx").on(table.path_id),
    index("tasks_created_at_idx").on(table.created_at),
  ]
);

// 用户任务进度表
export const userTaskProgress = pgTable(
  "user_task_progress",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    task_id: varchar("task_id", { length: 36 }).notNull().references(() => tasks.id),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    completed_at: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("utp_user_id_idx").on(table.user_id),
    index("utp_task_id_idx").on(table.task_id),
    index("utp_user_task_idx").on(table.user_id, table.task_id),
    index("utp_status_idx").on(table.status),
  ]
);

// AI新闻表
export const news = pgTable(
  "news",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 256 }).notNull(),
    summary: text("summary"),
    source: varchar("source", { length: 128 }),
    url: text("url"),
    week_number: integer("week_number").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("news_week_number_idx").on(table.week_number),
    index("news_created_at_idx").on(table.created_at),
  ]
);

// 热榜表
export const hotList = pgTable(
  "hot_list",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 128 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    heat_score: integer("heat_score").default(0).notNull(),
    trend: varchar("trend", { length: 10 }).default("stable"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("hotlist_category_idx").on(table.category),
    index("hotlist_heat_score_idx").on(table.heat_score),
    index("hotlist_created_at_idx").on(table.created_at),
  ]
);

// 收藏表
export const favorites = pgTable(
  "favorites",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    user_id: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    resource_id: varchar("resource_id", { length: 36 }).notNull().references(() => resources.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("favorites_user_id_idx").on(table.user_id),
    index("favorites_resource_id_idx").on(table.resource_id),
    index("favorites_user_resource_idx").on(table.user_id, table.resource_id),
  ]
);

// Zod Schema
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({ coerce: { date: true } });

export const insertUserSchema = createCoercedInsertSchema(users).pick({ email: true, nickname: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertPostSchema = createCoercedInsertSchema(posts).pick({ content: true, images: true });
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const insertCommentSchema = createCoercedInsertSchema(comments).pick({ post_id: true, content: true });
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const insertResourceSchema = createCoercedInsertSchema(resources).pick({ title: true, description: true, category: true, url: true, cover_url: true });
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export const insertTaskSchema = createCoercedInsertSchema(tasks).pick({ title: true, description: true, steps: true, duration: true, points: true, path_id: true });
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const insertNewsSchema = createCoercedInsertSchema(news).pick({ title: true, summary: true, source: true, url: true, week_number: true });
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export const insertHotListSchema = createCoercedInsertSchema(hotList).pick({ name: true, category: true, heat_score: true, trend: true });
export type HotListItem = typeof hotList.$inferSelect;
export type InsertHotListItem = z.infer<typeof insertHotListSchema>;
