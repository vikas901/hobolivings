import { seedFirestoreDatabase } from '../lib/seed-firestore';

async function main() {
  console.log("🌱 Starting Firestore database purge and re-seeding process...");
  const result = await seedFirestoreDatabase();
  console.log("Result:", result);
  process.exit(result.success ? 0 : 1);
}

main();
