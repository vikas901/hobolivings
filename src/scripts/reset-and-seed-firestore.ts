import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { properties as newProperties } from '../lib/dummy-data';

async function resetAndSeed() {
  console.log("🧹 1. Fetching current properties from Cloud Firestore...");
  const snapshot = await getDocs(collection(db, 'properties'));
  console.log(`Found ${snapshot.docs.length} properties to purge.`);

  for (const docSnap of snapshot.docs) {
    console.log(` Deleting old property ID: ${docSnap.id} ("${docSnap.data().title}")`);
    await deleteDoc(doc(db, 'properties', docSnap.id));
  }
  console.log("✅ Purge complete!");

  console.log("🌱 2. Inserting 24 new clean city properties into Cloud Firestore...");
  for (const prop of newProperties) {
    console.log(` Writing property ID: ${prop.id} ("${prop.title}")`);
    await setDoc(doc(db, 'properties', prop.id), {
      ...prop,
      createdAt: prop.createdAt || Date.now()
    });
  }
  console.log("🎉 Successfully seeded 24 new properties into Cloud Firestore!");
  process.exit(0);
}

resetAndSeed().catch(err => {
  console.error("Error during reset and seed:", err);
  process.exit(1);
});
