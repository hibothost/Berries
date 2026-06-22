import { Feather } from "@expo/vector-icons";
import { useAuth, useUser, useSignIn, useSignUp } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";

type AuthMode = "menu" | "sign-in" | "sign-up" | "verify";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();

  const [authMode, setAuthMode] = useState<AuthMode>("menu");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const joinWaitlist = useJoinWaitlist();

  const handleSignIn = async () => {
    if (!signIn) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        setAuthMode("menu");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      Alert.alert("Sign In Failed", "Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setAuthMode("verify");
    } catch {
      Alert.alert("Sign Up Failed", "Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        setAuthMode("menu");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      Alert.alert("Verification Failed", "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signOut();
  };

  const handleJoinWaitlist = () => {
    if (!waitlistEmail.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    joinWaitlist.mutate(
      { data: { email: waitlistEmail } },
      {
        onSuccess: () => {
          setWaitlistDone(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: () => {
          setWaitlistDone(true);
        },
      }
    );
  };

  const styles = makeStyles(colors);

  if (isSignedIn) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={28} color={colors.primaryForeground} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
            <Text style={styles.profileMember}>$BERRY Holder</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Waitlist</Text>
          {waitlistDone ? (
            <View style={styles.successCard}>
              <Feather name="check-circle" size={20} color={colors.green} />
              <Text style={styles.successText}>You are on the waitlist!</Text>
            </View>
          ) : (
            <View style={styles.waitlistCard}>
              <Text style={styles.waitlistLabel}>
                Join the Berries waitlist for early access to staking and NFT drops
              </Text>
              <TextInput
                style={styles.input}
                value={waitlistEmail}
                onChangeText={setWaitlistEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleJoinWaitlist}
                disabled={joinWaitlist.isPending}
                activeOpacity={0.8}
              >
                {joinWaitlist.isPending ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={styles.primaryButtonText}>Join Waitlist</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
          <Feather name="log-out" size={18} color={colors.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (authMode === "sign-in") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.authContainer, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity onPress={() => setAuthMode("menu")} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.authTitle}>Sign In</Text>
          <Text style={styles.authSubtitle}>Welcome back to Berries</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAuthMode("sign-up")} style={styles.linkButton}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (authMode === "sign-up") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.authContainer, { paddingBottom: insets.bottom + 24 }]}>
          <TouchableOpacity onPress={() => setAuthMode("menu")} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Join the Berries community</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAuthMode("sign-in")} style={styles.linkButton}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (authMode === "verify") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.authContainer, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.authTitle}>Verify Email</Text>
          <Text style={styles.authSubtitle}>Enter the 6-digit code sent to {email}</Text>
          <TextInput
            style={[styles.input, styles.codeInput]}
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Sign in to access all features</Text>
      </View>

      <View style={styles.authCard}>
        <Feather name="user" size={40} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setAuthMode("sign-in")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setAuthMode("sign-up")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join Waitlist</Text>
        {waitlistDone ? (
          <View style={styles.successCard}>
            <Feather name="check-circle" size={20} color={colors.green} />
            <Text style={styles.successText}>You are on the waitlist!</Text>
          </View>
        ) : (
          <View style={styles.waitlistCard}>
            <Text style={styles.waitlistLabel}>
              Get early access — enter your email to join the Berries waitlist
            </Text>
            <TextInput
              style={styles.input}
              value={waitlistEmail}
              onChangeText={setWaitlistEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleJoinWaitlist}
              disabled={joinWaitlist.isPending}
              activeOpacity={0.8}
            >
              {joinWaitlist.isPending ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={styles.primaryButtonText}>Join Waitlist</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
    header: {
      padding: 20,
      paddingBottom: 8,
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
    profileCard: {
      margin: 20,
      marginTop: 8,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    profileInfo: {
      flex: 1,
    },
    profileEmail: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    profileMember: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
      marginTop: 2,
    },
    authContainer: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
    },
    authCard: {
      margin: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButton: {
      marginBottom: 16,
      alignSelf: "flex-start",
    },
    authTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 6,
    },
    authSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 24,
      fontFamily: "Inter_400Regular",
    },
    input: {
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 12,
      width: "100%",
    },
    codeInput: {
      textAlign: "center",
      fontSize: 24,
      letterSpacing: 6,
      fontFamily: "Inter_700Bold",
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    primaryButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      width: "100%",
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "Inter_600SemiBold",
    },
    linkButton: {
      paddingVertical: 12,
      alignItems: "center",
    },
    linkText: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 10,
      fontFamily: "Inter_600SemiBold",
    },
    waitlistCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    waitlistLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginBottom: 12,
      lineHeight: 18,
      fontFamily: "Inter_400Regular",
    },
    successCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    successText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.green,
      fontFamily: "Inter_600SemiBold",
    },
    signOutButton: {
      margin: 20,
      marginTop: 4,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    signOutText: {
      color: colors.red,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "Inter_600SemiBold",
    },
  });
}
