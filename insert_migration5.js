const fs = require('fs');
const content = fs.readFileSync('./src/database/migrationRunner.ts', 'utf8');
const migration5 = fs.readFileSync('./src/database/migrations/005_cleanup_and_seed.sql', 'utf8');

const newConst = `\n\nconst MIGRATION_5_CLEANUP_AND_SEED = \`${migration5}\`;\n`;

// Insert after the closing backtick of MIGRATION_4 (at position 23552)
const insertPos = 23552;
const newContent = content.slice(0, insertPos) + '\n' + 'const MIGRATION_5_CLEANUP_AND_SEED = `' + migration5 + '`;\n' + content.slice(insertPos);

fs.writeFileSync('./src/database/migrationRunner.ts', newContent);
console.log('Done!');