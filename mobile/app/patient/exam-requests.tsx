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

export default function PatientExamRequestsScreen() {
  const [examRequests, setExamRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadExamRequests() {
    try {
      setIsLoading(true);

      const response = await apiService.getPatientExamRequests();

      setExamRequests(response.examRequests || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar exames"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExamRequests();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Meus Exames" />

      {isLoading ? <ActivityIndicator size="large" /> : null}

      <FlatList
        data={examRequests}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhum exame encontrado.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.info}>
              Exame: {item.examName}
            </Text>

            <Text style={styles.info}>
              Motivo: {item.reason || "Não informado"}
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