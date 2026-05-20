import { Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

import { useAuthViewModel } from "../viewmodels/auth.viewmodel";

export default function DoctorHomeScreen() {
  const router = useRouter();

  const { logout } = useAuthViewModel();

  async function handleLogout() {
    await logout();

    router.replace("/(auth)/login");
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader
          title="Área do Médico"
          showBackButton={false}
        />

        <Card>
          <Text style={styles.cardTitle}>
            Bem-vindo, Doutor(a)
          </Text>

          <Text style={styles.item}>• Gerenciar agenda</Text>
          <Text style={styles.item}>• Aceitar ou rejeitar consultas</Text>
          <Text style={styles.item}>• Criar prontuários</Text>
          <Text style={styles.item}>• Emitir receitas e exames</Text>
        </Card>

        <Button title="Dashboard" onPress={() => router.push({ pathname: "/doctor/dashboard" } as any)} />
        <Button title="Ver consultas" onPress={() => router.push({ pathname: "/doctor/appointments" } as any)} />
        <Button title="Meu perfil" onPress={() => router.push({ pathname: "/doctor/profile" } as any)} />
        <Button title="Meus horários" onPress={() => router.push({ pathname: "/doctor/time-slots" } as any)} />
        <Button title="Prontuários" onPress={() => router.push({ pathname: "/doctor/records" } as any)} />
        <Button title="Receitas" onPress={() => router.push({ pathname: "/doctor/prescriptions" } as any)} />
        <Button title="Exames solicitados" onPress={() => router.push({ pathname: "/doctor/exam-requests" } as any)} />

        <Button title="Sair" onPress={handleLogout} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  item: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 8,
  },
});