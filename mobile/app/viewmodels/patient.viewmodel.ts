import { create } from "zustand";

import apiService from "../services/api.service";

interface Doctor {
  id: string;
  name?: string;
  email?: string;
  crm?: string;
  phone?: string;
  specialty?: string;
  biography?: string;
  approvalStatus?: string;
}

interface PatientState {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;

  loadApprovedDoctors: () => Promise<void>;
}

export const usePatientViewModel = create<PatientState>((set) => ({
  doctors: [],
  isLoading: false,
  error: null,

  loadApprovedDoctors: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await apiService.getApprovedDoctors();

      set({
        doctors: response.doctors || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Erro ao carregar médicos",
        isLoading: false,
      });
    }
  },
}));