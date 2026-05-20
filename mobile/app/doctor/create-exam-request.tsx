import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import apiService from "../services/api.service";

export default function CreateExamRequestScreen() {
  const router = useRouter();
  const { medicalRecordId } = useLocalSearchParams();

  const [examName, setExamName] = useState("");
  const [reason, setReason] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateExamRequest() {
    if (!medicalRecordId) {
      Alert.alert("Erro", "Prontuário não informado.");
      return;
    }

    if (!examName) {
      Alert.alert("Erro", "Informe o nome do exame.");
      return;
    }

    try {
      setIsLoading(true);

      await apiService.createExamRequest({
        medicalRecordId: String(medicalRecordId),
        examName,
        reason,
        instructions,
      });

      Alert.alert("Sucesso", "Solicitação de exame criada com sucesso.");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao solicitar exame"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Solicitar Exame</Text>

      <Card>
        <Input
          label="Nome do exame"
          value={examName}
          onChangeText={setExamName}
          placeholder="Ex: Hemograma completo"
        />

        <Input
          label="Motivo"
          value={reason}
          onChangeText={setReason}
          placeholder="Ex: Investigação clínica"
        />

        <Input
          label="Instruções"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Ex: Fazer em jejum"
        />

        <Button
          title="Salvar solicitação"
          onPress={handleCreateExamRequest}
          loading={isLoading}
        />

        <Button title="Voltar" onPress={() => router.back()} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginTop: 30,
    marginBottom: 20,
  },
});