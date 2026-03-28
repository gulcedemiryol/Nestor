import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "Bilinmeyen hata" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Nestor ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Küçük bir aksaklık oldu</Text>
          <Text style={styles.body}>
            Uygulama beklenmedik şekilde durdu. Lütfen Expo’yu yeniden başlatmayı dene.
          </Text>
          <View style={styles.box}>
            <Text style={styles.mono}>{this.state.message}</Text>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textOnBackground,
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textOnBackground,
    lineHeight: 22,
    marginBottom: 14,
  },
  box: {
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  mono: {
    fontSize: 13,
    color: "#111",
    fontWeight: "600",
  },
});
