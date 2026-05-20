import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";

import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function DoctorRecordsScreen() {
  const router = useRouter();

  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadRecords() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getDoctorMedicalRecords();

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
      <AppHeader title="Prontuários" />

      {isLoading ? <Loading /> : null}

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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

            <Button
              title="Criar receita"
              onPress={() =>
                router.push({
                  pathname:
                    "/doctor/create-prescription",
                  params: {
                    medicalRecordId: item.id,
                  },
                } as any)
              }
            />

            <Button
              title="Solicitar exame"
              onPress={() =>
                router.push({
                  pathname:
                    "/doctor/create-exam-request",
                  params: {
                    medicalRecordId: item.id,
                  },
                } as any)
              }
            />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 40,
  },

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