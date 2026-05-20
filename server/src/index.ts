import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import specialtyRoutes from "./routes/specialty.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import timeSlotRoutes from "./routes/time-slot.routes.js";
import medicalRecordRoutes from "./routes/medical-record.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import examRequestRoutes from "./routes/exam-request.routes.js";
import doctorReviewRoutes from "./routes/doctor-review.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/specialties", specialtyRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/time-slots", timeSlotRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/exam-requests", examRequestRoutes);
app.use("/api/doctor-reviews", doctorReviewRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "API Saúde App rodando com Drizzle ORM",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});