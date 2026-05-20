import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";
import AppHeader from "../components/AppHeader";

import apiService from "../services/api.service";

export default function PatientProfileScreen() {
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const response =
        await apiService.getPatientProfile();

      const patient = response.patient;

      setPhone(patient?.phone || "");

      setBirthDate(
        patient?.birthDate || ""
      );

      setAddress(
        patient?.address || ""
      );
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

      await apiService.updatePatientProfile(
        {
          phone,
          birthDate,
          address,
        }
      );

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

      <AppHeader
        title="Meu Perfil"
      />

      {isLoading ? <Loading /> : null}

      <Card>
        <Input
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
        />

        <Input
          label="Data de nascimento"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Input
          label="Endereço"
          value={address}
          onChangeText={setAddress}
        />
      </Card>

      <Button
        title="Salvar alterações"
        onPress={handleSave}
        loading={isLoading}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});