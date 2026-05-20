import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import apiService from "../services/api.service";

export default function DoctorDetailsScreen() {
  const router = useRouter();

  const {
    doctorId,
    name,
    crm,
    specialty,
    phone,
    biography,
  } = useLocalSearchParams();

  const [reviews, setReviews] = useState<any[]>([]);
  const [average, setAverage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadReviews() {
    if (!doctorId) return;

    try {
      setIsLoading(true);

      const reviewsResponse =
        await apiService.getDoctorReviews(String(doctorId));

      const averageResponse =
        await apiService.getDoctorAverageRating(String(doctorId));

      setReviews(reviewsResponse.reviews || []);
      setAverage(averageResponse);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Detalhes do Médico</Text>

      <Card>
        <Text style={styles.name}>
          {String(name || "Médico")}
        </Text>

        <Text style={styles.info}>
          CRM: {String(crm || "Não informado")}
        </Text>

        <Text style={styles.info}>
          Especialidade: {String(specialty || "Não informada")}
        </Text>

        <Text style={styles.info}>
          Telefone: {String(phone || "Não informado")}
        </Text>

        <Text style={styles.bio}>
          {String(biography || "Sem biografia informada.")}
        </Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Avaliação média</Text>

        <Text style={styles.rating}>
          {average?.averageRating
            ? `${average.averageRating} / 5`
            : "Ainda sem avaliação"}
        </Text>
      </Card>

      <Button
        title="Agendar consulta"
        onPress={() =>
          router.push({
            pathname: "/patient/appointments",
            params: {
              doctorId: String(doctorId || ""),
              doctorName: String(name || ""),
              doctorCrm: String(crm || ""),
            },
          } as any)
        }
      />

      <Text style={styles.sectionTitle}>Comentários</Text>

      {isLoading ? <ActivityIndicator size="large" /> : null}

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhuma avaliação encontrada.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.info}>
              Nota: {item.rating} / 5
            </Text>

            <Text style={styles.info}>
              Comentário: {item.comment || "Sem comentário"}
            </Text>
          </Card>
        )}
      />

      <Button title="Voltar" onPress={() => router.back()} />
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

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },

  bio: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  rating: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563EB",
  },

  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 20,
  },
});