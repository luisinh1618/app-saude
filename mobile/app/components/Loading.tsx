import { View, ActivityIndicator, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});