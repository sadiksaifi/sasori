CREATE INDEX `chats_updated_at_idx` ON `chats` (`updated_at`);--> statement-breakpoint
CREATE INDEX `messages_chat_id_created_at_idx` ON `messages` (`chat_id`,`created_at`);