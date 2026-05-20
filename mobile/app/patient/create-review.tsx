import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import apiService from "../services/api.service";

export default function CreateReviewScreen() {
  const router = useRouter();

  const { doctorId, appointmentId } = useLocalSearchParams();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateReview() {
    if (!doctorId || !appointmentId) {
      Alert.alert("Erro", "Médico ou consulta não informado.");
      return;
    }

    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      Alert.alert("Erro", "Informe uma nota de 1 a 5.");
      return;
    }

    try {
      setIsLoading(true);

      await apiService.createDoctorReview({
        doctorId: String(doctorId),
        appointmentId: String(appointmentId),
        rating: numericRating,
        comment,
      });

      Alert.alert("Sucesso", "Avaliação enviada com sucesso.");

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao criar avaliação"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Avaliar Médico</Text>

      <Card>
        <Input
          label="Nota"
          placeholder="Digite uma nota de 1 a 5"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        <Input
          label="Comentário"
          placeholder="Conte como foi sua consulta"
          value={comment}
          onChangeText={setComment}
        />

        <Button
          title="Enviar avaliação"
          onPress={handleCreateReview}
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