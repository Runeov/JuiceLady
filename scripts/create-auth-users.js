const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, 'utf8');
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const envPath = path.join(process.cwd(), '.env.local');
loadEnv(envPath);

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  console.error('Missing Firebase Admin credentials in .env.local');
  process.exit(1);
}

const app =
  getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApps()[0];
const auth = getAuth(app);

async function upsertUser({ email, password, displayName, claims }) {
  let user;
  try {
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { email, password, displayName });
    console.log(`Updated user: ${email}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      user = await auth.createUser({ email, password, displayName });
      console.log(`Created user: ${email}`);
    } else {
      throw error;
    }
  }

  if (claims) {
    await auth.setCustomUserClaims(user.uid, claims);
    console.log(`Set claims for ${email}: ${JSON.stringify(claims)}`);
  }
}

(async () => {
  const password = 'password';
  await upsertUser({
    email: 'testuser@test.th',
    password,
    displayName: 'Test User',
    claims: null,
  });
  await upsertUser({
    email: 'testadmin@test.th',
    password,
    displayName: 'Test Admin',
    claims: { admin: true },
  });
})();
