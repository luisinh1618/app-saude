import { primaryKey } from "drizzle-orm/sqlite-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  role: text("role", {
    enum: ["patient", "doctor", "admin"],
  }).notNull(),

  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const patients = sqliteTable("patients", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  phone: text("phone"),
  birthDate: text("birth_date"),
  address: text("address"),
});

export const doctors = sqliteTable("doctors", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  crm: text("crm").notNull().unique(),
  phone: text("phone"),
  specialty: text("specialty"),
  biography: text("biography"),

  approvalStatus: text("approval_status", {
    enum: ["pending", "approved", "rejected"],
  })
    .notNull()
    .default("pending"),
});
export const specialties = sqliteTable("specialties", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const doctorSpecialties = sqliteTable(
  "doctor_specialties",
  {
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),

    specialtyId: text("specialty_id")
      .notNull()
      .references(() => specialties.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.doctorId, table.specialtyId],
    }),
  })
);
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),

  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),

  status: text("status", {
    enum: ["pending", "confirmed", "cancelled", "completed"],
  })
    .notNull()
    .default("pending"),

  notes: text("notes"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const timeSlots = sqliteTable("time_slots", {
  id: text("id").primaryKey(),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),

  isAvailable: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const medicalRecords = sqliteTable("medical_records", {
  id: text("id").primaryKey(),

  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id),

  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  diagnosis: text("diagnosis").notNull(),

  treatment: text("treatment"),

  notes: text("notes"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const prescriptions = sqliteTable("prescriptions", {
  id: text("id").primaryKey(),

  medicalRecordId: text("medical_record_id")
    .notNull()
    .references(() => medicalRecords.id),

  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  medication: text("medication").notNull(),
  dosage: text("dosage").notNull(),
  instructions: text("instructions"),

  createdAt: text("created_at").notNull(),
});
export const examRequests = sqliteTable("exam_requests", {
  id: text("id").primaryKey(),

  medicalRecordId: text("medical_record_id")
    .notNull()
    .references(() => medicalRecords.id),

  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  examName: text("exam_name").notNull(),
  reason: text("reason"),
  instructions: text("instructions"),

  createdAt: text("created_at").notNull(),
});
export const doctorReviews = sqliteTable("doctor_reviews", {
  id: text("id").primaryKey(),

  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id),

  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),

  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id),

  rating: integer("rating").notNull(),
  comment: text("comment"),

  createdAt: text("created_at").notNull(),
});
