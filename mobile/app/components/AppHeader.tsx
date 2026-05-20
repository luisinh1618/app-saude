import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { useRouter } from "expo-router";

type Props = {
  title: string;
  showBackButton?: boolean;
};

export default function AppHeader({
  title,
  showBackButton = true,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* TOPO */}
      <View style={styles.topRow}>

        {/* BOTÃO VOLTAR */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.back}>
              ← Voltar
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 70 }} />
        )}

        {/* LOGO */}
    <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
         resizeMode="contain"
    />

        <View style={{ width: 70 }} />
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2563EB",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  logo: {
    width: 70,
    height: 70,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
});