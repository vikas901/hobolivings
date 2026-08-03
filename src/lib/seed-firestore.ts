import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { properties as newProperties } from './dummy-data';

export async function seedFirestoreDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    // 1. Fetch existing properties from Firestore
    const snapshot = await getDocs(collection(db, 'properties'));
    
    // 2. Delete existing documents to clear old/placeholder data
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'properties', docSnap.id)));
    await Promise.all(deletePromises);

    // 3. Insert the 24 new high-quality properties
    const seedPromises = newProperties.map(prop => {
      return setDoc(doc(db, 'properties', prop.id), {
        ...prop,
        createdAt: prop.createdAt || Date.now()
      });
    });

    await Promise.all(seedPromises);

    return {
      success: true,
      count: newProperties.length,
      message: `Successfully purged old data and seeded ${newProperties.length} realistic properties across all 6 cities and 4 categories.`
    };
  } catch (error: any) {
    console.error("Firestore seeder error:", error);
    return {
      success: false,
      count: 0,
      message: error.message || "Failed to seed Firestore database."
    };
  }
}
