import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { View, Text } from "react-native";
import type { Database } from "@nozbe/watermelondb";

import { database } from "./database";
import { seedInitialData } from "./seeds/initialSeed";

const DatabaseContext = createContext<Database | null>(null);

export function useDatabase(): Database {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase must be used inside DatabaseProvider.");
  }

  return context;
}

export default function DatabaseProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        await seedInitialData(database);

        if (mounted) {
          setReady(true);
        }
      } catch (err) {
        console.error("[WatermelonDB] Initialization failed:", err);

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Database initialization failed.",
          );
        }
      }
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Database initialization failed
        </Text>
        <Text style={{ marginTop: 8, textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
}
