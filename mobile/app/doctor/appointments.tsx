import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function DoctorAppointmentsScreen() {
  const router = useRouter();

  const [appointments, setAppointments] =
    useState<any[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadAppointments() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getDoctorAppointments();

      setAppointments(
        response.appointments || []
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar consultas"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateStatus(
    appointmentId: string,
    status:
      | "confirmed"
      | "cancelled"
      | "completed"
  ) {
    try {
      setIsLoading(true);

      await apiService.updateAppointmentStatus(
        appointmentId,
        status
      );

      Alert.alert(
        "Sucesso",
        "Status atualizado com sucesso"
      );

      loadAppointments();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao atualizar status"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Minhas Consultas" />

      {isLoading ? <Loading /> : null}

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhuma consulta encontrada.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card key={item.id}>
            <Text style={styles.info}>
              Data: {item.appointmentDate}
            </Text>

            <Text style={styles.info}>
              Horário: {item.appointmentTime}
            </Text>

            <Text style={styles.info}>
              Status: {item.status}
            </Text>

            {item.notes ? (
              <Text style={styles.info}>
                Obs: {item.notes}
              </Text>
            ) : null}

            <Button
              title="Confirmar"
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "confirmed"
                )
              }
            />

            <Button
              title="Finalizar"
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "completed"
                )
              }
            />

            <Button
              title="Criar prontuário"
              onPress={() =>
                router.push({
                  pathname:
                    "/doctor/create-record",
                  params: {
                    appointmentId: item.id,
                  },
                } as any)
              }
            />

            <Button
              title="Cancelar"
              onPress={() =>
                handleUpdateStatus(
                  item.id,
                  "cancelled"
                )
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