import { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuthViewModel } from "../viewmodels/auth.viewmodel";

export default function LoginScreen() {
  const router = useRouter();

  const { login, isLoading, error, clearError } = useAuthViewModel();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    clearError();

    if (!email || !password) {
      Alert.alert("Atenção", "Preencha email e senha.");
      return;
    }

    const success = await login(email, password);

    if (!success) {
      return;
    }

    router.replace("/");
  }

  return (
    <ScreenContainer>
      <Image
  source={require("../../assets/logo.png")}
  style={styles.logo}
/>
      <Text style={styles.subtitle}>Entre na sua conta</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Input
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={isLoading}
      />

      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.link}>
          Ainda não tem conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginTop: 60,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 30,
    textAlign: "center",
  },

  error: {
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },

  link: {
    marginTop: 20,
    color: "#2563EB",
    textAlign: "center",
    fontWeight: "600",
  },

  logo: {
  width: 150,
  height: 150,
  resizeMode: "contain",
  alignSelf: "center",
  marginTop: 60,
},
});