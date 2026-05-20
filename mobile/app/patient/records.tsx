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

export default function PatientRecordsScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadRecords() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getPatientMedicalRecords();

      setRecords(response.records || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar prontuários"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <ScreenContainer>

      <AppHeader
        title="Meus Prontuários"
      />

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : null}

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhum prontuário encontrado.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.info}>
              Diagnóstico: {item.diagnosis}
            </Text>

            <Text style={styles.info}>
              Tratamento:{" "}
              {item.treatment || "Não informado"}
            </Text>

            <Text style={styles.info}>
              Observações:{" "}
              {item.notes || "Nenhuma"}
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