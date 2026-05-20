import { Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

import { useAuthViewModel } from "../viewmodels/auth.viewmodel";

export default function AdminHomeScreen() {
  const router = useRouter();

  const { logout } = useAuthViewModel();

  async function handleLogout() {
    await logout();

    router.replace("/(auth)/login");
  }

  return (
    <ScreenContainer>

      <AppHeader
        title="Área Administrativa"
        showBackButton={false}
      />

      <Card>
        <Text style={styles.cardTitle}>
          Painel do Administrador
        </Text>

        <Text style={styles.item}>
          • Aprovar médicos
        </Text>

        <Text style={styles.item}>
          • Gerenciar usuários
        </Text>

        <Text style={styles.item}>
          • Gerenciar especialidades
        </Text>

        <Text style={styles.item}>
          • Visualizar logs
        </Text>

        <Text style={styles.item}>
          • Dashboard do sistema
        </Text>
      </Card>

      <Button
        title="Dashboard"
        onPress={() =>
          router.push({
            pathname: "/admin/dashboard",
          } as any)
        }
      />

      <Button
        title="Aprovar médicos"
        onPress={() =>
          router.push({
            pathname:
              "/admin/doctors-approval",
          } as any)
        }
      />

      <Button
        title="Gerenciar usuários"
        onPress={() =>
          router.push({
            pathname: "/admin/users",
          } as any)
        }
      />

      <Button
        title="Especialidades"
        onPress={() =>
          router.push({
            pathname:
              "/admin/specialties",
          } as any)
        }
      />

      <Button
        title="Finanças"
        onPress={() =>
          router.push({
            pathname: "/admin/finance",
          } as any)
        }
      />

      <Button
        title="Sair"
        onPress={handleLogout}
      />
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