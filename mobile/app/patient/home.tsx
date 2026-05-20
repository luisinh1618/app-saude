import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

import { useAuthViewModel } from "../viewmodels/auth.viewmodel";

export default function PatientHomeScreen() {
  const router = useRouter();

  const { logout } = useAuthViewModel();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <ScreenContainer>
      <AppHeader
        title="Área do Paciente"
        showBackButton={false}
      />

      <Card>
        <Text style={styles.cardTitle}>
          Bem-vindo ao Saúde App
        </Text>

        <Text style={styles.item}>• Buscar médicos</Text>
        <Text style={styles.item}>• Agendar consultas</Text>
        <Text style={styles.item}>• Visualizar histórico</Text>
        <Text style={styles.item}>• Avaliar médicos</Text>
      </Card>

      <Button
        title="Dashboard"
        onPress={() =>
          router.push({
            pathname: "/patient/dashboard",
          } as any)
        }
      />

      <Button
        title="Ver médicos"
        onPress={() =>
          router.push({
            pathname: "/patient/doctors",
          } as any)
        }
      />

      <Button
        title="Meu perfil"
        onPress={() =>
          router.push({
            pathname: "/patient/profile",
          } as any)
        }
      />

      <Button
        title="Meus prontuários"
        onPress={() =>
          router.push({
            pathname: "/patient/records",
          } as any)
        }
      />

      <Button
        title="Minhas receitas"
        onPress={() =>
          router.push({
            pathname: "/patient/prescriptions",
          } as any)
        }
      />

      <Button
        title="Meus exames"
        onPress={() =>
          router.push({
            pathname: "/patient/exam-requests",
          } as any)
        }
      />

      <Button title="Sair" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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