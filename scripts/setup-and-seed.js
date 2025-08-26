const { execSync } = require('child_process');

console.log('Running migrations...');
execSync('node scripts/run-migrations.js', { stdio: 'inherit' });

console.log('Seeding database...');
execSync('node scripts/seed-db.js', { stdio: 'inherit' });

console.log('Creating test user...');
execSync('node scripts/create-test-user.js', { stdio: 'inherit' });

console.log('Setup and seed complete.');
