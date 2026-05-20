import { ReactNode } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
} from "react-native";

interface Props {
  children: ReactNode;
}

export default function ScreenContainer({
  children,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    padding: 20,
  },
});