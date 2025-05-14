ALTER TABLE "quizzes" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" text DEFAULT '' NOT NULL;--> statement-breakpoint