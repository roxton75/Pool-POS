// import { ScrollView, StyleSheet, View } from "react-native";

// import { ThemedBadge, ThemedCard, ThemedText } from "../shared";
// import { spacing } from "../../theme";

// export interface BookingRow {
//   id: string;
//   resource: string;
//   customer: string;
//   startTime: string;
//   endTime: string;
//   amount: string;
//   status: string;
//   variant: "active" | "info" | "success" | "warning" | "error";
// }

// interface TodaysBookingsTableProps {
//   bookings: BookingRow[];
// }

// const columns = [
//   { label: "Booking ID", flex: 1.1 },
//   { label: "Resource", flex: 1.5 },
//   { label: "Customer", flex: 1.4 },
//   { label: "Start Time", flex: 1 },
//   { label: "End Time", flex: 1 },
//   { label: "Amount", flex: 0.8 },
//   { label: "Status", flex: 1 },
// ];

// export default function TodaysBookingsTable({
//   bookings,
// }: TodaysBookingsTableProps) {
//   return (
//     <ThemedCard padding="none" radius="lg" style={styles.card}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         nestedScrollEnabled
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.headerRow}>
//             {columns.map((column) => (
//               <View
//                 key={column.label}
//                 style={[styles.cell, { flex: column.flex }]}
//               >
//                 <ThemedText
//                   variant="caption"
//                   color="secondary"
//                 //   weight="semibold"
//                   numberOfLines={1}
//                 >
//                   {column.label}
//                 </ThemedText>
//               </View>
//             ))}
//           </View>

//           {/* Booking Rows */}
//           {bookings.map((booking, index) => (
//             <View
//               key={booking.id}
//               style={[
//                 styles.row,
//                 index !== bookings.length - 1 && styles.rowBorder,
//               ]}
//             >
//               <Cell flex={1.1} secondary>
//                 {booking.id}
//               </Cell>

//               <Cell flex={1.5}>{booking.resource}</Cell>

//               <Cell flex={1.4}>{booking.customer}</Cell>

//               <Cell flex={1} secondary>
//                 {booking.startTime}
//               </Cell>

//               <Cell flex={1} secondary>
//                 {booking.endTime}
//               </Cell>

//               <Cell flex={0.8} strong>
//                 {booking.amount}
//               </Cell>

//               <View style={[styles.cell, { flex: 1 }]}>
//                 <ThemedBadge
//                   label={booking.status}
//                   variant={booking.variant}
//                   size="sm"
//                 />
//               </View>
//             </View>
//           ))}

//           {bookings.length === 0 && (
//             <View style={styles.empty}>
//               <ThemedText color="secondary" variant="bodySmall">
//                 No bookings recorded today.
//               </ThemedText>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </ThemedCard>
//   );
// }

// function Cell({
//   children,
//   flex,
//   secondary = false,
//   strong = false,
// }: {
//   children: string;
//   flex: number;
//   secondary?: boolean;
//   strong?: boolean;
// }) {
//   return (
//     <View style={[styles.cell, { flex }]}>
//       <ThemedText
//         variant="bodySmall"
//         color={secondary ? "secondary" : "primary"}
//         // weight={strong ? "semibold" : "normal"}
//         numberOfLines={1}
//       >
//         {children}
//       </ThemedText>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: "100%",
//     overflow: "hidden",
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   table: {
//     width: "100%",
//     minWidth: 680,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     minHeight: 46,
//     paddingHorizontal: spacing.md,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#88888855",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     minHeight: 56,
//     paddingHorizontal: spacing.md,
//   },
//   rowBorder: {
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#88888833",
//   },
//   cell: {
//     minWidth: 0,
//     justifyContent: "center",
//     paddingRight: spacing.sm,
//   },
//   empty: {
//     minHeight: 100,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { StyleSheet, View } from "react-native";

import { ThemedBadge, ThemedCard, ThemedText } from "../shared";
import { spacing } from "../../theme";

export interface BookingRow {
  id: string;
  resource: string;
  customer: string;
  startTime: string;
  endTime: string;
  amount: string;
  status: string;
  variant: "active" | "info" | "success" | "warning" | "error";
}

interface TodaysBookingsTableProps {
  bookings: BookingRow[];
}

const columns = [
  { key: "id", label: "Booking ID", flex: 1 },
  { key: "resource", label: "Resource", flex: 1.35 },
  { key: "customer", label: "Customer", flex: 1.3 },
  { key: "startTime", label: "Start Time", flex: 0.9 },
  { key: "endTime", label: "End Time", flex: 0.9 },
  { key: "amount", label: "Amount", flex: 0.7 },
  { key: "status", label: "Status", flex: 0.95 },
] as const;

export default function TodaysBookingsTable({
  bookings,
}: TodaysBookingsTableProps) {
  return (
    <ThemedCard padding="none" radius="lg" style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        {columns.map((column) => (
          <View key={column.key} style={[styles.cell, { flex: column.flex }]}>
            <ThemedText
              variant="caption"
              color="secondary"
              //   weight="semibold"
              numberOfLines={1}
            >
              {column.label}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Booking Rows */}
      {bookings.map((booking, index) => (
        <View
          key={booking.id}
          style={[
            styles.row,
            index !== bookings.length - 1 && styles.rowBorder,
          ]}
        >
          <Cell flex={columns[0].flex} secondary>
            {booking.id}
          </Cell>

          <Cell flex={columns[1].flex}>{booking.resource}</Cell>

          <Cell flex={columns[2].flex}>{booking.customer}</Cell>

          <Cell flex={columns[3].flex} secondary>
            {booking.startTime}
          </Cell>

          <Cell flex={columns[4].flex} secondary>
            {booking.endTime}
          </Cell>

          <Cell flex={columns[5].flex} strong>
            {booking.amount}
          </Cell>

          <View style={[styles.cell, { flex: columns[6].flex }]}>
            <ThemedBadge
              label={booking.status}
              variant={booking.variant}
              size="sm"
            />
          </View>
        </View>
      ))}

      {bookings.length === 0 && (
        <View style={styles.empty}>
          <ThemedText variant="bodySmall" color="secondary">
            No bookings recorded today.
          </ThemedText>
        </View>
      )}
    </ThemedCard>
  );
}

function Cell({
  children,
  flex,
  secondary = false,
  strong = false,
}: {
  children: string;
  flex: number;
  secondary?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={[styles.cell, { flex }]}>
      <ThemedText
        variant="bodySmall"
        color={secondary ? "secondary" : "primary"}
        // weight={strong ? "semibold" : "normal"}
        numberOfLines={1}
      >
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#88888855",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#88888833",
  },
  cell: {
    minWidth: 0,
    justifyContent: "center",
    paddingRight: spacing.sm,
  },
  empty: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
