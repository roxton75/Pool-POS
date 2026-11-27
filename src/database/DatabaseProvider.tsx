// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type PropsWithChildren,
// } from "react";
// import { View, Text, ActivityIndicator } from "react-native";
// import type { SQLiteDatabase } from "expo-sqlite";

// //import { getDatabase } from "./connection";
// import { initializeDatabase, isDatabaseInitialized } from "./migrationRunner";

// type DatabaseContextValue = {
//   db: SQLiteDatabase | null;
//   ready: boolean;
//   error: string | null;
// };

// const DatabaseContext = createContext<DatabaseContextValue | null>(null);

// export function useDatabase(): SQLiteDatabase {
//   const context = useContext(DatabaseContext);

//   if (!context) {
//     throw new Error("useDatabase must be used inside DatabaseProvider.");
//   }

//   if (!context.db) {
//     throw new Error("Database not initialized yet.");
//   }

//   return context.db;
// }

// export function useDatabaseReady(): boolean {
//   const context = useContext(DatabaseContext);

//   if (!context) {
//     throw new Error("useDatabaseReady must be used inside DatabaseProvider.");
//   }

//   return context.ready;
// }

// export function useDatabaseError(): string | null {
//   const context = useContext(DatabaseContext);

//   if (!context) {
//     throw new Error("useDatabaseError must be used inside DatabaseProvider.");
//   }

//   return context.error;
// }

// interface DatabaseProviderProps {
//   children: React.ReactNode;
// }

// export default function DatabaseProvider({ children }: DatabaseProviderProps) {
//   const [db, setDb] = useState<SQLiteDatabase | null>(null);
//   const [ready, setReady] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     async function initialize() {
//       try {
//         console.log("[DatabaseProvider] Running migrations...");
//         const { db: migratedDb, migrations } = await initializeDatabase();

//         if (!mounted) return;

//         const initialized = await isDatabaseInitialized(migratedDb);
//         if (!initialized) {
//           throw new Error("Database initialization verification failed");
//         }

//         setDb(migratedDb);
//         setReady(true);

//         console.log(
//           `[DatabaseProvider] Migrations applied: ${migrations.length}`,
//           migrations.map((m) => `${m.version}:${m.name}`),
//         );
//       } catch (err) {
//         console.error("[SQLite] Initialization failed:", err);

//         if (mounted) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Database initialization failed.",
//           );
//         }
//       }
//     }

//     void initialize();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (error) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           padding: 24,
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: "600" }}>
//           Database initialization failed
//         </Text>
//         <Text style={{ marginTop: 8, textAlign: "center" }}>{error}</Text>
//       </View>
//     );
//   }

//   if (!ready || !db) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <DatabaseContext.Provider value={{ db, ready, error }}>
//       {children}
//     </DatabaseContext.Provider>
//   );
// }

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { SQLiteDatabase } from "expo-sqlite";

import { initializeDatabase } from "./migrationRunner";

type DatabaseContextValue = {
  db: SQLiteDatabase | null;
  ready: boolean;
  error: Error | null;
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        const result = await initializeDatabase();

        const failedMigration = result.migrations.find(
          (migration) => !migration.success,
        );

        if (failedMigration) {
          throw new Error(
            `Migration ${failedMigration.version} failed: ${failedMigration.error}`,
          );
        }

        if (mounted) {
          setDb(result.db);
          setReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Database initialization failed."),
          );
        }
      }
    };

    void setup();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, ready, error }}>
      {/* {children} */}
      {ready ? children : null}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLiteDatabase {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider.");
  }

  if (!context.db) {
    throw new Error(context.error?.message ?? "Database is not ready yet.");
  }

  return context.db;
}

export function useDatabaseReady(): boolean {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabaseReady must be used within DatabaseProvider.");
  }

  return context.ready;
}

export function useDatabaseError(): Error | null {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabaseError must be used within DatabaseProvider.");
  }

  return context.error;
}
