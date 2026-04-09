/**
 * Seed Firestore with initial menu data.
 *
 * Usage:
 *   1. Set up your Firebase project and get your service account JSON
 *   2. Set the env variables in .env.local
 *   3. Run: npm run seed
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  categories,
  hotDrinkItems,
  coldDrinkItems,
  foodItems,
  dessertItems,
  addons,
} from '../data/menu-data';

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

async function seed() {
  console.log('Seeding Firestore...\n');

  // Seed categories
  console.log('Adding categories...');
  const categorySlugMap: Record<number, string> = {
    1: 'hot-drinks',
    2: 'cold-drinks',
    3: 'food',
    4: 'desserts',
  };

  for (const cat of categories) {
    const slug = categorySlugMap[cat.order];
    const ref = db.collection('categories').doc(slug);
    await ref.set(cat);
    console.log(`  + ${cat.name}`);
  }

  // Seed menu items
  console.log('\nAdding menu items...');
  const itemGroups = [
    { items: hotDrinkItems, catId: 'hot-drinks' },
    { items: coldDrinkItems, catId: 'cold-drinks' },
    { items: foodItems, catId: 'food' },
    { items: dessertItems, catId: 'desserts' },
  ];

  for (const group of itemGroups) {
    for (const item of group.items) {
      const ref = await db.collection('menuItems').add({
        ...item,
        categoryId: group.catId,
      });
      console.log(`  + ${item.name} (${ref.id})`);
    }
  }

  // Seed addons
  console.log('\nAdding addons...');
  for (const addon of addons) {
    const ref = await db.collection('addons').add(addon);
    console.log(`  + ${addon.name} (${ref.id})`);
  }

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
