import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  name: text().notNull(),
  age: integer(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
});

export const quizzesTable = pgTable('quizzes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const quizQuestionTable = pgTable('quiz_questions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzesTable.id),
  question: text('question').notNull(),
  // questionType: text('question_type').notNull(),
  answer: text('answer').notNull(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export type Quiz = typeof quizzesTable.$inferSelect;
export type QuizInsert = typeof quizzesTable.$inferInsert;

export type QuizQuestion = typeof quizQuestionTable.$inferSelect;
export type QuizQuestionInsert = typeof quizQuestionTable.$inferInsert;
