import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadUsers() {
    try {
      setIsLoading(true);

      const response = await apiService.getUsers();

      setUsers(response.users || []);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar usuários"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleStatus(userId: string) {
    try {
      setIsLoading(true);

      await apiService.toggleUserStatus(userId);

      Alert.alert(
        "Sucesso",
        "Status atualizado com sucesso"
      );

      loadUsers();
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
    loadUsers();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Gerenciar Usuários" />

      {isLoading ? <Loading /> : null}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhum usuário encontrado.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card key={item.id}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.info}>
              Email: {item.email}
            </Text>

            <Text style={styles.info}>
              Role: {item.role}
            </Text>

            <Text style={styles.info}>
              Status: {item.isActive ? "Ativo" : "Bloqueado"}
            </Text>

            <Button
              title={
                item.isActive
                  ? "Bloquear"
                  : "Desbloquear"
              }
              onPress={() =>
                handleToggleStatus(item.id)
              }
            />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },
});