import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  loading,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});