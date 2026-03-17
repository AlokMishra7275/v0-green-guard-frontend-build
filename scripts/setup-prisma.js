import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Ensure prisma directory exists
const prismaDir = join(projectRoot, 'prisma');
if (!existsSync(prismaDir)) {
  mkdirSync(prismaDir, { recursive: true });
}

// Set DATABASE_URL if not set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { 
    stdio: 'inherit', 
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db' }
  });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
  process.exit(1);
}

console.log('Pushing database schema...');
try {
  execSync('npx prisma db push', { 
    stdio: 'inherit', 
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db' }
  });
  console.log('Database schema pushed successfully!');
} catch (error) {
  console.error('Failed to push database schema:', error.message);
  process.exit(1);
}
