import axios, { AxiosInstance, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.15.80:3000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("userRole");
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password });
    return response.data;
  }

  async register(data: any) {
    const response = await this.api.post("/auth/register", data);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get("/auth/me");
    return response.data;
  }

  async getApprovedDoctors() {
    const response = await this.api.get("/doctor/approved");
    return response.data;
  }

  async getApprovedDoctorsBySpecialty(specialtyId: string) {
    const response = await this.api.get(`/doctor/specialty/${specialtyId}`);
    return response.data;
  }

  async getDoctorDashboard() {
    const response = await this.api.get("/doctor/dashboard");
    return response.data;
  }

  async getDoctorProfile() {
    const response = await this.api.get("/doctor/profile");
    return response.data;
  }

  async updateDoctorProfile(data: {
    crm?: string;
    phone?: string;
    specialty?: string;
    biography?: string;
  }) {
    const response = await this.api.put("/doctor/profile", data);
    return response.data;
  }

  async createAppointment(data: {
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
  }) {
    const response = await this.api.post("/appointments", data);
    return response.data;
  }

  async getPatientAppointments() {
    const response = await this.api.get("/appointments/patient");
    return response.data;
  }

  async getDoctorAppointments() {
    const response = await this.api.get("/appointments/doctor");
    return response.data;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: "pending" | "confirmed" | "cancelled" | "completed"
  ) {
    const response = await this.api.put(
      `/appointments/${appointmentId}/status`,
      { status }
    );

    return response.data;
  }

  async getPendingDoctors() {
    const response = await this.api.get("/admin/doctors/pending");
    return response.data;
  }

  async approveDoctor(doctorId: string) {
    const response = await this.api.put(
      `/admin/doctors/${doctorId}/approve`
    );

    return response.data;
  }

  async rejectDoctor(doctorId: string) {
    const response = await this.api.put(
      `/admin/doctors/${doctorId}/reject`
    );

    return response.data;
  }

  async getUsers() {
    const response = await this.api.get("/admin/users");
    return response.data;
  }

  async toggleUserStatus(userId: string) {
    const response = await this.api.put(
      `/admin/users/${userId}/toggle-status`
    );

    return response.data;
  }

  async getAdminDashboard() {
    const response = await this.api.get("/admin/dashboard");
    return response.data;
  }

  async getPatientDashboard() {
    const response = await this.api.get("/patient/dashboard");
    return response.data;
  }

  async getPatientProfile() {
    const response = await this.api.get("/patient/profile");
    return response.data;
  }

  async updatePatientProfile(data: {
    phone?: string;
    birthDate?: string;
    address?: string;
  }) {
    const response = await this.api.put("/patient/profile", data);
    return response.data;
  }

  async getSpecialties() {
    const response = await this.api.get("/specialties");
    return response.data;
  }

  async createSpecialty(data: {
    name: string;
    description?: string;
  }) {
    const response = await this.api.post("/specialties", data);
    return response.data;
  }

  async updateSpecialty(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    const response = await this.api.put(`/specialties/${id}`, data);
    return response.data;
  }

  async deleteSpecialty(id: string) {
    const response = await this.api.delete(`/specialties/${id}`);
    return response.data;
  }

  async createTimeSlot(data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }) {
    const response = await this.api.post("/time-slots", data);
    return response.data;
  }

  async getDoctorTimeSlots(doctorId: string) {
    const response = await this.api.get(
      `/time-slots/doctor/${doctorId}`
    );

    return response.data;
  }

  async deleteTimeSlot(id: string) {
    const response = await this.api.delete(`/time-slots/${id}`);
    return response.data;
  }

  async createMedicalRecord(data: {
    appointmentId: string;
    diagnosis: string;
    treatment?: string;
    notes?: string;
  }) {
    const response = await this.api.post("/medical-records", data);
    return response.data;
  }

  async getPatientMedicalRecords() {
    const response = await this.api.get("/medical-records/patient");
    return response.data;
  }

  async getDoctorMedicalRecords() {
    const response = await this.api.get("/medical-records/doctor");
    return response.data;
  }

  async createPrescription(data: {
    medicalRecordId: string;
    medication: string;
    dosage: string;
    instructions?: string;
  }) {
    const response = await this.api.post("/prescriptions", data);
    return response.data;
  }

  async getDoctorPrescriptions() {
    const response = await this.api.get("/prescriptions/doctor");
    return response.data;
  }

  async getPatientPrescriptions() {
    const response = await this.api.get("/prescriptions/patient");
    return response.data;
  }

  async createExamRequest(data: {
    medicalRecordId: string;
    examName: string;
    reason?: string;
    instructions?: string;
  }) {
    const response = await this.api.post("/exam-requests", data);
    return response.data;
  }

  async getDoctorExamRequests() {
    const response = await this.api.get("/exam-requests/doctor");
    return response.data;
  }

  async getPatientExamRequests() {
    const response = await this.api.get("/exam-requests/patient");
    return response.data;
  }

  async createDoctorReview(data: {
    doctorId: string;
    appointmentId: string;
    rating: number;
    comment?: string;
  }) {
    const response = await this.api.post("/doctor-reviews", data);
    return response.data;
  }

  async getDoctorReviews(doctorId: string) {
    const response = await this.api.get(
      `/doctor-reviews/doctor/${doctorId}`
    );

    return response.data;
  }

  async getDoctorAverageRating(doctorId: string) {
    const response = await this.api.get(
      `/doctor-reviews/doctor/${doctorId}/average`
    );

    return response.data;
  }
}

export default new ApiService();