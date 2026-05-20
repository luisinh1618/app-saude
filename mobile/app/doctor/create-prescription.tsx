import { useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function CreatePrescriptionScreen() {
  const router = useRouter();

  const { medicalRecordId } =
    useLocalSearchParams();

  const [medication, setMedication] =
    useState("");

  const [dosage, setDosage] =
    useState("");

  const [instructions, setInstructions] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function handleCreatePrescription() {
    if (!medicalRecordId) {
      Alert.alert(
        "Erro",
        "Prontuário não informado."
      );
      return;
    }

    if (!medication || !dosage) {
      Alert.alert(
        "Erro",
        "Informe medicamento e dosagem."
      );
      return;
    }

    try {
      setIsLoading(true);

      await apiService.createPrescription({
        medicalRecordId: String(
          medicalRecordId
        ),
        medication,
        dosage,
        instructions,
      });

      Alert.alert(
        "Sucesso",
        "Receita criada com sucesso."
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao criar receita"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Criar Receita" />

        <Card>
          <Input
            label="Medicamento"
            value={medication}
            onChangeText={setMedication}
            placeholder="Ex: Dipirona"
          />

          <Input
            label="Dosagem"
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ex: 500mg de 8 em 8 horas"
          />

          <Input
            label="Instruções"
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Ex: Tomar após alimentação"
          />

          <Button
            title="Salvar receita"
            onPress={
              handleCreatePrescription
            }
            loading={isLoading}
          />

          <Button
            title="Voltar"
            onPress={() => router.back()}
          />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
});