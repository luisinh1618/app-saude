import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import Card from "../components/Card";
import AppHeader from "../components/AppHeader";

export default function FinanceScreen() {

  // Simulação de transações
  const transactions = [
    {
      id: 1,
      user: "João",
      value: 100,
    },
    {
      id: 2,
      user: "Maria",
      value: 200,
    },
    {
      id: 3,
      user: "Carlos",
      value: 150,
    },
  ];

  const PLATFORM_FEE = 0.15;

  const totalRevenue = transactions.reduce(
    (acc, item) => acc + item.value,
    0
  );

  const totalPlatform = totalRevenue * PLATFORM_FEE;

  const totalDoctors =
    totalRevenue - totalPlatform;

  return (
    <ScreenContainer>

      <AppHeader title="Finanças" />

      <Card>
        <Text style={styles.summaryTitle}>
          Resumo Financeiro
        </Text>

        <Text style={styles.summaryText}>
          Total recebido: R${" "}
          {totalRevenue.toFixed(2)}
        </Text>

        <Text style={styles.platform}>
          Plataforma (15%): R${" "}
          {totalPlatform.toFixed(2)}
        </Text>

        <Text style={styles.doctor}>
          Profissionais (85%): R${" "}
          {totalDoctors.toFixed(2)}
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>
        Transações
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {transactions.map((t) => {
          const platformValue =
            t.value * PLATFORM_FEE;

          const doctorValue =
            t.value - platformValue;

          return (
            <Card key={t.id}>
              <Text style={styles.user}>
                Usuário: {t.user}
              </Text>

              <Text style={styles.info}>
                Valor pago: R${" "}
                {t.value.toFixed(2)}
              </Text>

              <Text style={styles.platform}>
                Plataforma (15%): R${" "}
                {platformValue.toFixed(2)}
              </Text>

              <Text style={styles.doctor}>
                Profissional (85%): R${" "}
                {doctorValue.toFixed(2)}
              </Text>
            </Card>
          );
        })}
      </ScrollView>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  summaryText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 10,
    marginBottom: 16,
  },

  user: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },

  info: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },

  platform: {
    fontSize: 15,
    color: "#DC2626",
    marginTop: 4,
  },

  doctor: {
    fontSize: 15,
    color: "#16A34A",
    marginTop: 4,
  },
});