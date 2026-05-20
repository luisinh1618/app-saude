import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function SpecialtiesScreen() {
  const [specialties, setSpecialties] =
    useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadSpecialties() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getSpecialties();

      setSpecialties(
        response.specialties || []
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar especialidades"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert(
        "Erro",
        "Informe o nome da especialidade"
      );
      return;
    }

    try {
      setIsLoading(true);

      await apiService.createSpecialty({
        name,
        description,
      });

      Alert.alert(
        "Sucesso",
        "Especialidade criada"
      );

      setName("");
      setDescription("");

      loadSpecialties();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao criar especialidade"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setIsLoading(true);

      await apiService.deleteSpecialty(id);

      Alert.alert(
        "Sucesso",
        "Especialidade removida"
      );

      loadSpecialties();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao remover especialidade"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSpecialties();
  }, []);

  return (
    <ScreenContainer>
      <AppHeader title="Especialidades" />

      <Card>
        <Input
          label="Nome"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Descrição"
          value={description}
          onChangeText={setDescription}
        />

        <Button
          title="Criar especialidade"
          onPress={handleCreate}
          loading={isLoading}
        />
      </Card>

      {isLoading ? <Loading /> : null}

      <FlatList
        data={specialties}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.empty}>
              Nenhuma especialidade encontrada.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.description}>
              {item.description ||
                "Sem descrição informada."}
            </Text>

            <Button
              title="Remover"
              onPress={() =>
                handleDelete(item.id)
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
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 12,
  },
});