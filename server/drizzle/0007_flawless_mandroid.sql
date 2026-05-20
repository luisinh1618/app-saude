CREATE TABLE `prescriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`medical_record_id` text NOT NULL,
	`patient_id` text NOT NULL,
	`doctor_id` text NOT NULL,
	`medication` text NOT NULL,
	`dosage` text NOT NULL,
	`instructions` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON UPDATE no action ON DELETE no action
);
