import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import ScreenContainer from "./components/ScreenContainer";
import apiService from "./services/api.service";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await SecureStore.getItemAsync("accessToken");

        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        const response = await apiService.getProfile();
        const user = response.user;

        if (!user?.role) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("userRole");
          router.replace("/(auth)/login");
          return;
        }

        await SecureStore.setItemAsync("userRole", user.role);

        if (user.role === "patient") {
          router.replace("/patient/home");
        } else if (user.role === "doctor") {
          router.replace("/doctor/home");
        } else if (user.role === "admin") {
          router.replace("/admin/home");
        } else {
          router.replace("/(auth)/login");
        }
      } catch {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("userRole");
        router.replace("/(auth)/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <ScreenContainer>
      <ActivityIndicator size="large" />
    </ScreenContainer>
  );
}