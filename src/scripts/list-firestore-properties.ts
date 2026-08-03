import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function main() {
  console.log("🔍 Fetching all documents in Firestore 'properties' collection...");
  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    console.log(`Total properties found in Firestore: ${snapshot.docs.length}`);
    snapshot.docs.forEach((d, i) => {
      const data = d.data();
      console.log(`[${i + 1}] ID: ${d.id} | Title: "${data.title}" | Status: "${data.status}" | Image: "${data.image?.slice(0, 50)}..."`);
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
  }
  process.exit(0);
}

main();
