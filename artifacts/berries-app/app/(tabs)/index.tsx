import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useGetCoinStats,
  useGetWaitlistCount,
  getGetCoinStatsQueryKey,
  getGetWaitlistCountQueryKey,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";

const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    name: "Berry Drop",
    status: "complete" as const,
    items: ["Token launch", "Community formation", "Website & socials"],
  },
  {
    phase: "Phase 2",
    name: "Berry Patch",
    status: "active" as const,
    items: ["CEX listings", "10k holders", "Influencer campaigns"],
  },
  {
    phase: "Phase 3",
    name: "Berry Bloom",
    status: "upcoming" as const,
    items: ["NFT collection drop", "Staking rewards", "DAO formation"],
  },
  {
    phase: "Phase 4",
    name: "Berry World",
    status: "upcoming" as const,
    items: ["Cross-chain bridge", "Mobile app launch", "IRL events"],
  },
];

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  const colors = useColors();
  const styles = makeStyles(colors);
  return (
    <View style={styles.statCard}>
      <Feather name={icon as any} size={18} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data: stats, isLoading: statsLoading } = useGetCoinStats({
    query: { queryKey: getGetCoinStatsQueryKey() },
  });
  const { data: waitlistCount } = useGetWaitlistCount({
    query: { queryKey: getGetWaitlistCountQueryKey() },
  });

  const styles = makeStyles(colors);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <LinearGradient
        colors={[colors.primary, colors.berryDark] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.ticker}>$BERRY</Text>
        <Text style={styles.heroTitle}>Berries</Text>
        <Text style={styles.heroSubtitle}>
          The juiciest meme coin on Solana. Community-driven, fun-first.
        </Text>
        <View style={styles.phaseBadge}>
          <View style={styles.phaseDot} />
          <Text style={styles.phaseText}>{stats?.currentPhase ?? "Phase 2 — Berry Patch"}</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        {statsLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <StatCard label="Holders" value={stats?.totalHolders ?? 0} icon="users" />
            <StatCard label="Wallets" value={stats?.totalWallets ?? 0} icon="credit-card" />
            <StatCard label="Waitlist" value={waitlistCount?.count ?? 0} icon="mail" />
          </>
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.sectionTitle}>Roadmap Progress</Text>
          <Text style={styles.progressPct}>{stats?.roadmapProgress ?? 35}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${stats?.roadmapProgress ?? 35}%` as any }]}
          />
        </View>
      </View>

      <View style={styles.roadmapSection}>
        <Text style={styles.sectionTitle}>Roadmap</Text>
        {ROADMAP_PHASES.map((phase) => (
          <View
            key={phase.phase}
            style={[
              styles.phaseCard,
              phase.status === "active" && styles.phaseCardActive,
            ]}
          >
            <View style={styles.phaseHeader}>
              <View
                style={[
                  styles.phaseStatus,
                  phase.status === "complete" && styles.phaseComplete,
                  phase.status === "active" && styles.phaseActive,
                  phase.status === "upcoming" && styles.phaseUpcoming,
                ]}
              >
                {phase.status === "complete" && (
                  <Feather name="check" size={12} color="#fff" />
                )}
                {phase.status === "active" && (
                  <View style={styles.activeDot} />
                )}
                {phase.status === "upcoming" && (
                  <Feather name="clock" size={12} color={colors.mutedForeground} />
                )}
              </View>
              <View style={styles.phaseTitleWrap}>
                <Text style={styles.phaseLabel}>{phase.phase}</Text>
                <Text
                  style={[
                    styles.phaseName,
                    phase.status === "upcoming" && styles.phaseNameMuted,
                  ]}
                >
                  {phase.name}
                </Text>
              </View>
              {phase.status === "active" && (
                <View style={styles.liveChip}>
                  <Text style={styles.liveText}>Live</Text>
                </View>
              )}
            </View>
            <View style={styles.phaseItems}>
              {phase.items.map((item) => (
                <View key={item} style={styles.phaseItem}>
                  <View
                    style={[
                      styles.itemDot,
                      phase.status === "complete" && { backgroundColor: colors.green },
                      phase.status === "active" && { backgroundColor: colors.primary },
                      phase.status === "upcoming" && { backgroundColor: colors.mutedForeground },
                    ]}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      phase.status === "upcoming" && { color: colors.mutedForeground },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    hero: {
      padding: 28,
      paddingTop: 40,
      paddingBottom: 32,
    },
    ticker: {
      fontSize: 13,
      fontWeight: "700",
      color: "rgba(255,255,255,0.7)",
      letterSpacing: 2,
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    heroTitle: {
      fontSize: 40,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "Inter_700Bold",
    },
    heroSubtitle: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      marginTop: 6,
      lineHeight: 20,
      fontFamily: "Inter_400Regular",
    },
    phaseBadge: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    },
    phaseDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#4ADE80",
    },
    phaseText: {
      fontSize: 12,
      color: "#fff",
      fontFamily: "Inter_600SemiBold",
    },
    statsRow: {
      flexDirection: "row",
      padding: 16,
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      alignItems: "center",
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    statLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    progressSection: {
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    progressPct: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.secondary,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    roadmapSection: {
      padding: 16,
      paddingTop: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      marginBottom: 12,
      fontFamily: "Inter_700Bold",
    },
    phaseCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    phaseCardActive: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
    phaseHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    phaseStatus: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    phaseComplete: { backgroundColor: colors.green },
    phaseActive: { backgroundColor: colors.primary },
    phaseUpcoming: { backgroundColor: colors.secondary },
    activeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#fff",
    },
    phaseTitleWrap: {
      flex: 1,
    },
    phaseLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    phaseName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    phaseNameMuted: {
      color: colors.mutedForeground,
    },
    liveChip: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    liveText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.primaryForeground,
      fontFamily: "Inter_700Bold",
    },
    phaseItems: {
      gap: 8,
    },
    phaseItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    itemDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    itemText: {
      fontSize: 13,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
  });
}
