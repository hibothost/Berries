import { Feather } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useConnectWallet,
  useGetUserWallets,
  getGetUserWalletsQueryKey,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(false);

  const { data: wallets, isLoading } = useGetUserWallets({
    query: { queryKey: getGetUserWalletsQueryKey(), enabled: !!isSignedIn },
  });

  const connectWalletMutation = useConnectWallet();

  const handleConnectPhantom = async () => {
    if (!isSignedIn) {
      Alert.alert("Sign In Required", "Please sign in to connect your wallet.");
      return;
    }

    if (Platform.OS !== "web") {
      Alert.alert(
        "Phantom Wallet",
        "To connect your Phantom wallet, please use the web version of Berries at your browser.",
        [{ text: "OK" }]
      );
      return;
    }

    const provider = (window as any).solana;
    if (!provider?.isPhantom) {
      await Linking.openURL("https://phantom.app/");
      return;
    }

    try {
      setConnecting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const resp = await provider.connect();
      const address = resp.publicKey.toString();

      connectWalletMutation.mutate(
        { data: { address, provider: "phantom" } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetUserWalletsQueryKey() });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          onError: () => {
            Alert.alert("Error", "Failed to register wallet. Please try again.");
          },
        }
      );
    } catch {
      Alert.alert("Connection Failed", "Could not connect to Phantom wallet.");
    } finally {
      setConnecting(false);
    }
  };

  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.subtitle}>Connect your Phantom wallet to participate</Text>
      </View>

      <TouchableOpacity
        style={styles.connectButton}
        onPress={handleConnectPhantom}
        disabled={connecting || connectWalletMutation.isPending}
        activeOpacity={0.8}
      >
        {connecting || connectWalletMutation.isPending ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <>
            <View style={styles.phantomIcon}>
              <Feather name="zap" size={20} color={colors.primaryForeground} />
            </View>
            <Text style={styles.connectButtonText}>Connect Phantom Wallet</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.walletsSection}>
        <Text style={styles.sectionTitle}>Connected Wallets</Text>

        {!isSignedIn ? (
          <View style={styles.emptyState}>
            <Feather name="lock" size={32} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>Sign in to see your wallets</Text>
          </View>
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
        ) : !wallets || wallets.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="credit-card" size={32} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>No wallets connected</Text>
            <Text style={styles.emptyText}>Connect your Phantom wallet above to get started</Text>
          </View>
        ) : (
          <FlatList
            data={wallets}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.walletCard}>
                <View style={styles.walletIconWrap}>
                  <Feather name="zap" size={18} color={colors.primary} />
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletAddress}>{shortenAddress(item.address)}</Text>
                  <Text style={styles.walletProvider}>{item.provider}</Text>
                </View>
                <View style={styles.connectedBadge}>
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.infoCard}>
        <Feather name="info" size={16} color={colors.mutedForeground} />
        <Text style={styles.infoText}>
          Phantom wallet is a Solana-based wallet. Download it at phantom.app for web or mobile.
        </Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    subtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 4,
      fontFamily: "Inter_400Regular",
    },
    connectButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginBottom: 28,
    },
    phantomIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    connectButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
    },
    walletsSection: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 12,
      fontFamily: "Inter_600SemiBold",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    emptyText: {
      fontSize: 13,
      color: colors.mutedForeground,
      textAlign: "center",
      fontFamily: "Inter_400Regular",
    },
    walletCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    walletIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    walletInfo: {
      flex: 1,
    },
    walletAddress: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    walletProvider: {
      fontSize: 12,
      color: colors.mutedForeground,
      textTransform: "capitalize",
      fontFamily: "Inter_400Regular",
    },
    connectedBadge: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    connectedText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 12,
      color: colors.mutedForeground,
      lineHeight: 18,
      fontFamily: "Inter_400Regular",
    },
  });
}
