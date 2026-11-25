// import type { Database } from "@nozbe/watermelondb";

// const resources = [
//   {
//     id: "resource_pool_01",
//     name: "American Pool",
//     type: "american_pool",
//     ratePerHour: 250,
//     displayOrder: 1,
//   },
//   {
//     id: "resource_mini_snooker_01",
//     name: "Mini Snooker",
//     type: "mini_snooker",
//     ratePerHour: 250,
//     displayOrder: 2,
//   },
//   {
//     id: "resource_big_snooker_01",
//     name: "Big Snooker 01",
//     type: "big_snooker",
//     ratePerHour: 350,
//     displayOrder: 3,
//   },
//   {
//     id: "resource_big_snooker_02",
//     name: "Big Snooker 02",
//     type: "big_snooker",
//     ratePerHour: 350,
//     displayOrder: 4,
//   },
//   {
//     id: "resource_ps5_01",
//     name: "PS5 Console 01",
//     type: "ps5",
//     ratePerHour: 0,
//     displayOrder: 5,
//   },
// ];

// const settings = [
//   ["grace_period_minutes", "12"],
//   ["currency", "INR"],
//   ["rounding_mode", "ceil"],
//   ["business_name", "Q-Zone"],
// ];

// export async function seedInitialData(db: Database): Promise<void> {
//   const resourceCollection = db.get("resources");
//   const settingCollection = db.get("settings");

//   const existingResources = await resourceCollection.query().fetch();

//   if (existingResources.length > 0) {
//     return;
//   }

//   await db.write(async () => {
//     for (const resource of resources) {
//       await resourceCollection.create((record) => {
//         record._raw.id = resource.id;
//         record._setRaw("name", resource.name);
//         record._setRaw("type", resource.type);
//         record._setRaw("rate_per_hour", resource.ratePerHour);
//         record._setRaw("is_active", true);
//         record._setRaw("is_maintenance", false);
//         record._setRaw("display_order", resource.displayOrder);
//         record._setRaw("created_at", new Date().toISOString());
//         record._setRaw("updated_at", new Date().toISOString());
//       });
//     }

//     for (const [key, value] of settings) {
//       await settingCollection.create((record) => {
//         record._setRaw("key", key);
//         record._setRaw("value", value);
//         record._setRaw("updated_at", new Date().toISOString());
//       });
//     }
//   });
// }

import type { Database } from "@nozbe/watermelondb";

type ResourceSeedRecord = {
  _raw: { id: string };
  name: string;
  type: string;
  ratePerHour: number;
  isActive: boolean;
  isMaintenance: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

type SettingSeedRecord = {
  _raw: { id: string };
  key: string;
  value: string;
  updatedAt: string;
};
export async function seedInitialData(db: Database): Promise<void> {
  const resourceCollection = db.get("resources");
  const settingCollection = db.get("settings");

  const existingResources = await resourceCollection.query().fetch();

  if (existingResources.length > 0) return;

  const now = new Date().toISOString();

  await db.write(async () => {
    const preparedResources = [
      {
        id: "resource_pool_01",
        name: "American Pool",
        type: "american_pool",
        rate: 250,
        order: 1,
      },
      {
        id: "resource_mini_snooker_01",
        name: "Mini Snooker",
        type: "mini_snooker",
        rate: 250,
        order: 2,
      },
      {
        id: "resource_big_snooker_01",
        name: "Big Snooker 01",
        type: "big_snooker",
        rate: 350,
        order: 3,
      },
      {
        id: "resource_big_snooker_02",
        name: "Big Snooker 02",
        type: "big_snooker",
        rate: 350,
        order: 4,
      },
      {
        id: "resource_ps5_01",
        name: "PS5 Console 01",
        type: "ps5",
        rate: 0,
        order: 5,
      },
    ].map((item) =>
      resourceCollection.prepareCreate((model) => {
        const record = model as typeof model & ResourceSeedRecord;

        record._raw.id = item.id;
        record.name = item.name;
        record.type = item.type;
        record.ratePerHour = item.rate;
        record.isActive = true;
        record.isMaintenance = false;
        record.displayOrder = item.order;
        record.createdAt = now;
        record.updatedAt = now;
      }),
    );

    const preparedSettings = [
      ["grace_period_minutes", "12"],
      ["currency", "INR"],
      ["rounding_mode", "ceil"],
      ["business_name", "Q-Zone"],
    ].map(([key, value]) =>
      settingCollection.prepareCreate((model) => {
        const record = model as typeof model & SettingSeedRecord;

        record._raw.id = key;
        record.key = key;
        record.value = value;
        record.updatedAt = now;
      }),
    );

    await db.batch(...preparedResources, ...preparedSettings);
  });
}
