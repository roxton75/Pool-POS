const fs = require('fs');
let fileContent = fs.readFileSync('./src/database/migrationRunner.ts', 'utf8');

const oldArray = `const MIGRATIONS: Migration[] = [
  { version: 1, name: "001_initial_schema", sql: MIGRATION_1_SCHEMA },
  { version: 2, name: "002_indexes", sql: MIGRATION_2_INDEXES },
  { version: 3, name: "003_seed_data", sql: MIGRATION_3_SEED_DATA },
  { version: 4, name: "004_billing_system", sql: MIGRATION_4_BILLING_SYSTEM },
];`;

const newArray = `const MIGRATIONS: Migration[] = [
  { version: 1, name: "001_initial_schema", sql: MIGRATION_1_SCHEMA },
  { version: 2, name: "002_indexes", sql: MIGRATION_2_INDEXES },
  { version: 3, name: "003_seed_data", sql: MIGRATION_3_SEED_DATA },
  { version: 4, name: "004_billing_system", sql: MIGRATION_4_BILLING_SYSTEM },
  { version: 5, name: "005_cleanup_and_seed", sql: MIGRATION_5_CLEANUP_AND_SEED },
];`;

let fileContent = fs.readFileSync('./src/database/migrationRunner.ts', 'utf8');
if (fileContent.includes('version: 5')) {
  console.log('Already updated');
} else {
  fileContent = fileContent.replace(oldArray, newArray);
  fs.writeFileSync('./src/database/migrationRunner.ts', fileContent);
  console.log('Updated MIGRATIONS array');
}