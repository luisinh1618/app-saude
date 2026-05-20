CREATE TABLE `doctor_specialties` (
	`doctor_id` text NOT NULL,
	`specialty_id` text NOT NULL,
	PRIMARY KEY(`doctor_id`, `specialty_id`),
	FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`specialty_id`) REFERENCES `specialties`(`id`) ON UPDATE no action ON DELETE no action
);
