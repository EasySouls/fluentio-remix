ALTER TABLE "users" ALTER COLUMN "username" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE ("username");--> statement-breakpoint