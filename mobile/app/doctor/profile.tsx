import { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function DoctorProfileScreen() {
  const [crm, setCrm] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [biography, setBiography] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const response = await apiService.getDoctorProfile();

      const doctor = response.doctor;

      setCrm(doctor?.crm || "");
      setPhone(doctor?.phone || "");
      setSpecialty(doctor?.specialty || "");
      setBiography(doctor?.biography || "");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao carregar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    try {
      setIsLoading(true);

      await apiService.updateDoctorProfile({
        crm,
        phone,
        specialty,
        biography,
      });

      Alert.alert(
        "Sucesso",
        "Perfil atualizado com sucesso"
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message ||
          "Erro ao atualizar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Meu Perfil Médico" />

        {isLoading ? <Loading /> : null}

        <Card>
          <Input
            label="CRM"
            value={crm}
            onChangeText={setCrm}
          />

          <Input
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
          />

          <Input
            label="Especialidade"
            value={specialty}
            onChangeText={setSpecialty}
          />

          <Input
            label="Biografia"
            value={biography}
            onChangeText={setBiography}
          />

          <Button
            title="Salvar alterações"
            onPress={handleSave}
            loading={isLoading}
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