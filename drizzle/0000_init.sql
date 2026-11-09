CREATE TABLE `intake_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`handle` text NOT NULL,
	`email` text NOT NULL,
	`discipline` text NOT NULL,
	`corridor` text NOT NULL,
	`country` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `intake_handle_uq` ON `intake_requests` (`handle`);--> statement-breakpoint
CREATE INDEX `intake_status_idx` ON `intake_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`handle` text NOT NULL,
	`display_name` text NOT NULL,
	`location` text NOT NULL,
	`hub` text NOT NULL,
	`discipline` text NOT NULL,
	`project` text NOT NULL,
	`project_url` text,
	`visible` integer DEFAULT true NOT NULL,
	`approved_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_handle_unique` ON `members` (`handle`);--> statement-breakpoint
CREATE TABLE `web_vitals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`metric` text NOT NULL,
	`value` real NOT NULL,
	`rating` text NOT NULL,
	`path` text NOT NULL,
	`country` text,
	`colo` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `vitals_metric_time_idx` ON `web_vitals` (`metric`,`created_at`);--> statement-breakpoint
CREATE INDEX `vitals_time_idx` ON `web_vitals` (`created_at`);