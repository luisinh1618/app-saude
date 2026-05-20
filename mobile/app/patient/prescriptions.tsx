import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function PatientPrescriptionsScreen() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadPrescriptions() {
    try {
      setIsLoading(true);

      const response = await apiService.getPatientPrescriptions();

      setPrescriptions(response.prescriptions || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar receitas"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPrescriptions();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Minhas Receitas" />

      {isLoading ? <ActivityIndicator size="large" /> : null}

      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhuma receita encontrada.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.info}>
              Medicamento: {item.medication}
            </Text>

            <Text style={styles.info}>
              Dosagem: {item.dosage}
            </Text>

            <Text style={styles.info}>
              Instruções: {item.instructions || "Nenhuma"}
            </Text>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },
});