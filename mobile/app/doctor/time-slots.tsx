import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

const days = [
  { label: "Domingo", value: 0 },
  { label: "Segunda", value: 1 },
  { label: "Terça", value: 2 },
  { label: "Quarta", value: 3 },
  { label: "Quinta", value: 4 },
  { label: "Sexta", value: 5 },
  { label: "Sábado", value: 6 },
];

export default function DoctorTimeSlotsScreen() {
  const [dayOfWeek, setDayOfWeek] =
    useState(1);

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [slots, setSlots] = useState<any[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadMySlots() {
    try {
      setIsLoading(true);

      const profileResponse =
        await apiService.getDoctorProfile();

      const doctor =
        profileResponse.doctor;

      if (!doctor?.id) {
        return;
      }

      const slotsResponse =
        await apiService.getDoctorTimeSlots(
          doctor.id
        );

      setSlots(
        slotsResponse.slots || []
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar horários"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateSlot() {
    if (!startTime || !endTime) {
      Alert.alert(
        "Erro",
        "Informe horário inicial e final."
      );

      return;
    }

    try {
      setIsLoading(true);

      await apiService.createTimeSlot({
        dayOfWeek,
        startTime,
        endTime,
      });

      Alert.alert(
        "Sucesso",
        "Horário criado com sucesso."
      );

      setStartTime("");
      setEndTime("");

      await loadMySlots();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao criar horário"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSlot(
    id: string
  ) {
    try {
      setIsLoading(true);

      await apiService.deleteTimeSlot(id);

      Alert.alert(
        "Sucesso",
        "Horário removido com sucesso."
      );

      await loadMySlots();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao remover horário"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function getDayName(day: number) {
    const found = days.find(
      (d) => d.value === day
    );

    return found?.label || "Dia";
  }

  useEffect(() => {
    loadMySlots();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Meus Horários" />

      {isLoading ? <Loading /> : null}

      <Card>
        <Text style={styles.label}>
          Dia da semana
        </Text>

        <FlatList
          horizontal
          data={days}
          keyExtractor={(item) =>
            String(item.value)
          }
          showsHorizontalScrollIndicator={
            false
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayButton,
                dayOfWeek ===
                  item.value &&
                  styles.dayButtonActive,
              ]}
              onPress={() =>
                setDayOfWeek(item.value)
              }
            >
              <Text
                style={[
                  styles.dayText,
                  dayOfWeek ===
                    item.value &&
                    styles.dayTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Input
          label="Horário inicial"
          placeholder="Ex: 08:00"
          value={startTime}
          onChangeText={setStartTime}
        />

        <Input
          label="Horário final"
          placeholder="Ex: 12:00"
          value={endTime}
          onChangeText={setEndTime}
        />

        <Button
          title="Criar horário"
          onPress={handleCreateSlot}
          loading={isLoading}
        />
      </Card>

      <Text style={styles.subtitle}>
        Horários cadastrados
      </Text>

      <FlatList
        data={slots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhum horário carregado ainda.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.info}>
              Dia:{" "}
              {getDayName(item.dayOfWeek)}
            </Text>

            <Text style={styles.info}>
              Início: {item.startTime}
            </Text>

            <Text style={styles.info}>
              Fim: {item.endTime}
            </Text>

            <Button
              title="Remover"
              onPress={() =>
                handleDeleteSlot(item.id)
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

  subtitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },

  dayButton: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },

  dayButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  dayText: {
    color: "#374151",
    fontWeight: "700",
  },

  dayTextActive: {
    color: "#FFFFFF",
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },

  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
  },
});