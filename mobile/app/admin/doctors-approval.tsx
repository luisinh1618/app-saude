import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function DoctorsApprovalScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadPendingDoctors() {
    try {
      setIsLoading(true);

      const response = await apiService.getPendingDoctors();

      setDoctors(response.doctors || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar médicos pendentes"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(doctorId: string) {
    try {
      await apiService.approveDoctor(doctorId);

      Alert.alert(
        "Sucesso",
        "Médico aprovado com sucesso"
      );

      loadPendingDoctors();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao aprovar médico"
      );
    }
  }

  async function handleReject(doctorId: string) {
    try {
      await apiService.rejectDoctor(doctorId);

      Alert.alert(
        "Sucesso",
        "Médico rejeitado com sucesso"
      );

      loadPendingDoctors();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao rejeitar médico"
      );
    }
  }

  useEffect(() => {
    loadPendingDoctors();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Aprovação de Médicos" />

      {isLoading ? <Loading /> : null}

      <FlatList
        data={doctors}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhum médico pendente encontrado.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card key={item.id}>
            <Text style={styles.name}>
              {item.name || item.userName || "Médico"}
            </Text>

            <Text style={styles.info}>
              CRM: {item.crm || "Não informado"}
            </Text>

            <Text style={styles.info}>
              Especialidade: {item.specialty || "Não informada"}
            </Text>

            <Text style={styles.info}>
              Status: {item.approvalStatus || "pending"}
            </Text>

            <Button
              title="Aprovar"
              onPress={() => handleApprove(item.id)}
            />

            <Button
              title="Rejeitar"
              onPress={() => handleReject(item.id)}
            />
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

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },
});