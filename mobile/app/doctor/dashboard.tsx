import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Alert,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function DoctorDashboardScreen() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadDashboard() {
    try {
      setIsLoading(true);

      const response = await apiService.getDoctorDashboard();

      setMetrics(response.metrics || {});
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao carregar dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Dashboard do Médico" />

      {isLoading ? <Loading /> : null}

      {metrics && Object.keys(metrics).length > 0 ? (
        <View style={styles.grid}>
          {Object.entries(metrics).map(([key, value]) => (
            <Card key={key}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </Card>
          ))}
        </View>
      ) : (
        !isLoading && (
          <Text style={styles.empty}>
            Nenhuma métrica carregada.
          </Text>
        )
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
  },

  value: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});