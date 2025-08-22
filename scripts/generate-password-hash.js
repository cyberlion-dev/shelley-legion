const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('Usage: node scripts/generate-password-hash.js <password>');
    console.log('Example: node scripts/generate-password-hash.js mySecurePassword123');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    console.log('Password hash generated:');
    console.log(hash);
    console.log('\nAdd this to your .env.local file as ADMIN_PASSWORD_HASH');
    console.log('Or set it as an environment variable in Netlify');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();