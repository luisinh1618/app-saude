import { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuthViewModel } from "../viewmodels/auth.viewmodel";

type Role = "patient" | "doctor";

export default function RegisterScreen() {
  const router = useRouter();

  const { register, isLoading, error, clearError } =
    useAuthViewModel();

  const [role, setRole] = useState<Role>("patient");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // paciente
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");

  // comum
  const [phone, setPhone] = useState("");

  // médico
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [biography, setBiography] = useState("");

  async function handleRegister() {
    clearError();

    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha os campos obrigatórios");
      return;
    }

    const payload: any = {
      name,
      email,
      password,
      role,
      phone,
    };

    if (role === "patient") {
      payload.birthDate = birthDate;
      payload.address = address;
    }

    if (role === "doctor") {
      payload.crm = crm;
      payload.specialty = specialty;
      payload.biography = biography;
    }

    const success = await register(payload);

    if (!success) {
      return;
    }

    Alert.alert("Sucesso", "Conta criada com sucesso");

    router.replace("/(auth)/login");
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Criar Conta</Text>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "patient" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("patient")}
          >
            <Text
              style={[
                styles.roleText,
                role === "patient" && styles.roleTextActive,
              ]}
            >
              Paciente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "doctor" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("doctor")}
          >
            <Text
              style={[
                styles.roleText,
                role === "doctor" && styles.roleTextActive,
              ]}
            >
              Médico
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Nome"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Input
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
        />

        {role === "patient" && (
          <>
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
          </>
        )}

        {role === "doctor" && (
          <>
            <Input
              label="CRM"
              value={crm}
              onChangeText={setCrm}
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
          </>
        )}

        <Button
          title="Cadastrar"
          onPress={handleRegister}
          loading={isLoading}
        />

        <TouchableOpacity
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.link}>
            Já tenho conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 20,
    marginTop: 20,
    color: "#111827",
    textAlign: "center",
  },

  error: {
    color: "#DC2626",
    marginBottom: 14,
    textAlign: "center",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  roleButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  roleText: {
    fontWeight: "700",
    color: "#374151",
  },

  roleTextActive: {
    color: "#FFFFFF",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "700",
    marginBottom: 40,
  },
});