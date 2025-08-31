/**
 * Secure one‑time admin seeding script.
 *
 * Behaviour:
 *  - Reuses the canonical Admin model (no duplicated schema).
 *  - Idempotent: if ANY admin already exists, it aborts without changes.
 *  - Reads credentials from env: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL.
 *  - If password missing, a strong random one is generated and printed ONCE.
 *  - Minimal logging: never re-prints provided password unless ADMIN_SHOW_PASSWORD=true.
 *  - Encourages removal of env secrets & script after successful run.
 */
import dotenv from 'dotenv';
import crypto from 'crypto';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import Admin from './models/Admin.js';

dotenv.config();

const strongRandomPassword = () =>
  crypto.randomBytes(18).toString('base64url'); // ~24 chars URL-safe

const validatePasswordStrength = (pwd) => {
  if (!pwd) return 'MISSING';
  const issues = [];
  if (pwd.length < 12) issues.push('length<12');
  if (!/[A-Z]/.test(pwd)) issues.push('no-uppercase');
  if (!/[a-z]/.test(pwd)) issues.push('no-lowercase');
  if (!/[0-9]/.test(pwd)) issues.push('no-digit');
  if (!/[#@$!%*?&^_\-]/.test(pwd)) issues.push('no-symbol');
  return issues.length ? issues.join(',') : 'OK';
};

async function seedAdmin() {
  const start = Date.now();
  try {
    await connectDB();

    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      console.log(`🛑 Aborting: ${existingCount} admin user(s) already present. No changes made.`);
      return;
    }

    let username = process.env.ADMIN_USERNAME?.trim();
    let password = process.env.ADMIN_PASSWORD?.trim();
    let email = process.env.ADMIN_EMAIL?.trim();

    if (!username) username = 'admin';
    if (!email) email = 'admin@local';
    const supplied = Boolean(password);
    if (!password) {
      password = strongRandomPassword();
      console.log('⚠️  ADMIN_PASSWORD not provided; generated a strong random password. Store it securely NOW.');
    }

    const strength = validatePasswordStrength(password);
    if (strength !== 'OK') {
      console.log(`⚠️  Password strength issues: ${strength}. Recommend rotating to a stronger password after login.`);
    }

    const admin = new Admin({ username, password, email, role: 'admin' });
    await admin.save();

    console.log('✅ Admin user created.');
    console.log(`   Username: ${username}`);
    console.log(`   Email   : ${email}`);
    if (!supplied || process.env.ADMIN_SHOW_PASSWORD === 'true') {
      console.log(`   Password: ${password}`);
    } else {
      console.log('   Password: (hidden — set via environment)');
    }
    console.log('\nNext steps:');
    console.log('  1. Login immediately and change the password via your UI (if feature exists) or implement change flow.');
    console.log('  2. Remove ADMIN_* vars from your production .env (rotate JWT secret if it was shared).');
    console.log('  3. Delete this script if you will not need seeding again.');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log(`⏱  Done in ${Date.now() - start}ms`);
    process.exit(0);
  }
}

seedAdmin();
