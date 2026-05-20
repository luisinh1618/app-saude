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

export default function CreateRecordScreen() {
  const router = useRouter();

  const { appointmentId } = useLocalSearchParams();

  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRecord() {
    if (!appointmentId) {
      Alert.alert("Erro", "Consulta não informada.");
      return;
    }

    if (!diagnosis) {
      Alert.alert("Erro", "Informe o diagnóstico.");
      return;
    }

    try {
      setIsLoading(true);

      await apiService.createMedicalRecord({
        appointmentId: String(appointmentId),
        diagnosis,
        treatment,
        notes,
      });

      Alert.alert(
        "Sucesso",
        "Prontuário criado com sucesso."
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao criar prontuário"
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
        <AppHeader title="Criar Prontuário" />

        <Card>
          <Input
            label="Diagnóstico"
            value={diagnosis}
            onChangeText={setDiagnosis}
            placeholder="Ex: Gripe, dor lombar..."
          />

          <Input
            label="Tratamento"
            value={treatment}
            onChangeText={setTreatment}
            placeholder="Ex: Repouso e medicação"
          />

          <Input
            label="Observações"
            value={notes}
            onChangeText={setNotes}
            placeholder="Observações adicionais"
          />

          <Button
            title="Salvar prontuário"
            onPress={handleCreateRecord}
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