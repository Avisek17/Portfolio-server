#!/usr/bin/env node
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import readline from 'readline';

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found at', envPath);
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

(async () => {
  console.log('Secret Rotation Utility');
  const confirm = (await ask('Generate and apply new JWT_SECRET? (yes/no): ')).trim().toLowerCase();
  if (!['y','yes'].includes(confirm)) {
    console.log('Aborted.');
    rl.close();
    return;
  }
  const newSecret = crypto.randomBytes(48).toString('base64url');
  let envContent = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  let replaced = false;
  envContent = envContent.map(line => {
    if (line.startsWith('JWT_SECRET=')) {
      replaced = true;
      return `JWT_SECRET=${newSecret}`;
    }
    return line;
  });
  if (!replaced) envContent.push(`JWT_SECRET=${newSecret}`);
  fs.writeFileSync(envPath, envContent.join('\n'));
  rl.close();
  console.log('\nNew JWT_SECRET written. Restart backend to take effect. Force users to re-login (clear old tokens).');
})();
