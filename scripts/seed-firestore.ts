/**
 * Seed Firestore with initial menu data.
 * 
 * Usage:
 *   1. Set up your Firebase project and get your service account JSON
 *   2. Set the GOOGLE_APPLICATION_CREDENTIALS env variable to the path of your service account JSON
 *   3. Run: npx tsx scripts/seed-firestore.ts
 * 
 * Or set the env variables in .env.local and run: npm run seed
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  categories,
  milkTeaItems,
  coffeeItems,
  italianSodaItems,
  otherItems,
  matchaItems,
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
  console.log('🌱 Seeding Firestore...\n');

  // Seed categories
  console.log('📂 Adding categories...');
  const categoryIds: Record<string, string> = {};
  const categorySlugMap: Record<number, string> = {
    1: 'milk-tea',
    2: 'coffee',
    3: 'italian-soda',
    4: 'other',
    5: 'matcha',
  };

  for (const cat of categories) {
    const slug = categorySlugMap[cat.order];
    const ref = db.collection('categories').doc(slug);
    await ref.set(cat);
    categoryIds[slug] = slug;
    console.log(`  ✅ ${cat.name_en}`);
  }

  // Seed menu items
  console.log('\n🍵 Adding menu items...');
  const itemGroups = [
    { items: milkTeaItems, catId: 'milk-tea' },
    { items: coffeeItems, catId: 'coffee' },
    { items: italianSodaItems, catId: 'italian-soda' },
    { items: otherItems, catId: 'other' },
    { items: matchaItems, catId: 'matcha' },
  ];

  for (const group of itemGroups) {
    for (const item of group.items) {
      const ref = await db.collection('menuItems').add({
        ...item,
        categoryId: group.catId,
      });
      console.log(`  ✅ ${item.name_en} (${ref.id})`);
    }
  }

  // Seed addons
  console.log('\n🧋 Adding addons...');
  for (const addon of addons) {
    const ref = await db.collection('addons').add(addon);
    console.log(`  ✅ ${addon.name_en} (${ref.id})`);
  }

  console.log('\n✨ Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
