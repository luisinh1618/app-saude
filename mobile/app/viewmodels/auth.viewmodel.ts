import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

import apiService from "../services/api.service";
import { User } from "../models/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthViewModel = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiService.login(email, password);

      const token = response.accessToken || response.token;
      const user = response.user;

      if (!token || !user?.role) {
        throw new Error("Resposta inválida do servidor");
      }

      await SecureStore.setItemAsync("accessToken", token);
      await SecureStore.setItemAsync("userRole", user.role);

      set({
        user,
        isLoading: false,
      });

      return true;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao realizar login",
        isLoading: false,
      });

      return false;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });

      await apiService.register(data);

      set({ isLoading: false });

      return true;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao criar conta",
        isLoading: false,
      });

      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("userRole");

    set({
      user: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));