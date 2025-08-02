import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  password: text("password"), // For email/password auth
  phone: text("phone"),
  location: text("location"),
  linkedin: text("linkedin"),
  github: text("github"),
  website: text("website"),
  summary: text("summary"),
  skills: json("skills").$type<string[]>().default(sql`'[]'::json`),
  // OAuth provider info
  googleId: text("google_id"),
  facebookId: text("facebook_id"),
  provider: text("provider").default("email"), // email, google, facebook
  profileImageUrl: text("profile_image_url"),
  emailVerified: boolean("email_verified").default(false),
  createdAt: text("created_at").default(sql`now()`),
  updatedAt: text("updated_at").default(sql`now()`),
});

export const education = pgTable("education", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  gpa: text("gpa"),
  description: text("description"),
});

export const experience = pgTable("experience", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  current: boolean("current").default(false),
  description: text("description"),
  achievements: json("achievements").$type<string[]>().default(sql`'[]'::json`),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  technologies: json("technologies").$type<string[]>().default(sql`'[]'::json`),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  startDate: text("start_date"),
  endDate: text("end_date"),
});

export const jobAnalyses = pgTable("job_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobTitle: text("job_title").notNull(),
  jobRequirements: text("job_requirements").notNull(),
  matchScore: integer("match_score"),
  missingSkills: json("missing_skills").$type<string[]>().default(sql`'[]'::json`),
  recommendedProjects: json("recommended_projects").$type<Array<{name: string, description: string, url: string}>>().default(sql`'[]'::json`),
  atsKeywords: json("ats_keywords").$type<string[]>().default(sql`'[]'::json`),
  createdAt: text("created_at").default(sql`now()`),
});

export const resumeTemplates = pgTable("resume_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  templateData: json("template_data"),
  isAts: boolean("is_ats").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertExperienceSchema = createInsertSchema(experience).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertJobAnalysisSchema = createInsertSchema(jobAnalyses).omit({
  id: true,
  matchScore: true,
  missingSkills: true,
  recommendedProjects: true,
  atsKeywords: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type JobAnalysis = typeof jobAnalyses.$inferSelect;
export type InsertJobAnalysis = z.infer<typeof insertJobAnalysisSchema>;
export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
