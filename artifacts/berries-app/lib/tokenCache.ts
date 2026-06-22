import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const tokenCache =
  Platform.OS !== "web"
    ? {
        getToken: async (key: string) => {
          try {
            return await SecureStore.getItemAsync(key);
          } catch {
            await SecureStore.deleteItemAsync(key);
            return null;
          }
        },
        saveToken: (key: string, token: string) =>
          SecureStore.setItemAsync(key, token),
        clearToken: (key: string) => SecureStore.deleteItemAsync(key),
      }
    : undefined;
