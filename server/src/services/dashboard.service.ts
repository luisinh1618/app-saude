import { and, count, eq } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  appointments,
  doctors,
  examRequests,
  medicalRecords,
  prescriptions,
  specialties,
  users,
} from "../db/schema.js";

export async function getAdminDashboardMetrics() {
  const totalUsers = await db
    .select({ total: count() })
    .from(users);

  const totalPatients = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "patient"));

  const totalDoctors = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "doctor"));

  const pendingDoctors = await db
    .select({ total: count() })
    .from(doctors)
    .where(eq(doctors.approvalStatus, "pending"));

  const totalAppointments = await db
    .select({ total: count() })
    .from(appointments);

  const totalSpecialties = await db
    .select({ total: count() })
    .from(specialties);

  return {
    totalUsers: totalUsers[0]?.total ?? 0,
    totalPatients: totalPatients[0]?.total ?? 0,
    totalDoctors: totalDoctors[0]?.total ?? 0,
    pendingDoctors: pendingDoctors[0]?.total ?? 0,
    totalAppointments: totalAppointments[0]?.total ?? 0,
    totalSpecialties: totalSpecialties[0]?.total ?? 0,
  };
}

export async function getDoctorDashboardMetrics(
  doctorId: string
) {
  const totalAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId));

  const pendingAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.status, "pending")
      )
    );

  const confirmedAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.status, "confirmed")
      )
    );

  const completedAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.status, "completed")
      )
    );

  const doctorAppointments = await db
    .select({
      patientId: appointments.patientId,
    })
    .from(appointments)
    .where(eq(appointments.doctorId, doctorId));

  const uniquePatients = new Set(
    doctorAppointments.map((a) => a.patientId)
  );

  return {
    totalAppointments:
      totalAppointments[0]?.total ?? 0,

    pendingAppointments:
      pendingAppointments[0]?.total ?? 0,

    confirmedAppointments:
      confirmedAppointments[0]?.total ?? 0,

    completedAppointments:
      completedAppointments[0]?.total ?? 0,

    totalPatients: uniquePatients.size,
  };
}
export async function getPatientDashboardMetrics(
  patientId: string
) {
  const totalAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(eq(appointments.patientId, patientId));

  const pendingAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        eq(appointments.status, "pending")
      )
    );

  const confirmedAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        eq(appointments.status, "confirmed")
      )
    );

  const completedAppointments = await db
    .select({ total: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        eq(appointments.status, "completed")
      )
    );

  const medicalRecordsCount = await db
    .select({ total: count() })
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId));

  const prescriptionsCount = await db
    .select({ total: count() })
    .from(prescriptions)
    .where(eq(prescriptions.patientId, patientId));

  const examRequestsCount = await db
    .select({ total: count() })
    .from(examRequests)
    .where(eq(examRequests.patientId, patientId));

  return {
    totalAppointments:
      totalAppointments[0]?.total ?? 0,

    pendingAppointments:
      pendingAppointments[0]?.total ?? 0,

    confirmedAppointments:
      confirmedAppointments[0]?.total ?? 0,

    completedAppointments:
      completedAppointments[0]?.total ?? 0,

    medicalRecords:
      medicalRecordsCount[0]?.total ?? 0,

    prescriptions:
      prescriptionsCount[0]?.total ?? 0,

    examRequests:
      examRequestsCount[0]?.total ?? 0,
  };
}