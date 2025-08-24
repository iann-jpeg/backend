const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function hiddenQuestion(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(query);
    stdin.resume();
    stdin.setRawMode(true);
    
    let password = '';
    stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u0008':
        case '\u007F':
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  console.log('\n🔐 GALLOWAYS SECURE ADMIN CREATOR');
  console.log('===================================\n');
  
  try {
    // Get admin details
    const name = await question('👤 Enter admin full name: ');
    const email = await question('📧 Enter admin email: ');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format!');
      process.exit(1);
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      console.log(`❌ User with email ${email} already exists!`);
      console.log(`   Current role: ${existingUser.role}`);
      
      if (existingUser.role === 'ADMIN') {
        console.log('   This user is already an admin.');
      } else {
        const makeAdmin = await question('   Would you like to upgrade this user to ADMIN? (y/n): ');
        if (makeAdmin.toLowerCase() === 'y') {
          await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: { role: 'ADMIN' }
          });
          console.log('✅ User upgraded to ADMIN successfully!');
        }
      }
      process.exit(0);
    }
    
    // Get password securely
    const password = await hiddenQuestion('🔑 Enter admin password: ');
    
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long!');
      process.exit(1);
    }
    
    // Hash password
    console.log('\n🔄 Creating admin user...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!');
    console.log('====================================');
    console.log(`ID: ${admin.id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Created: ${admin.createdAt.toISOString()}`);
    console.log('\n🚀 You can now login with these credentials!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: [The password you just entered]`);
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin();
