const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Simple connection test
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query successful:', result);
    
    // Check if users table exists and count users
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Users table accessible. Current user count: ${userCount}`);
      
      // If there are users, let's see their details (without passwords)
      if (userCount > 0) {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        });
        console.log('👥 Existing users:', JSON.stringify(users, null, 2));
      }
    } catch (error) {
      console.log('❌ Users table not accessible:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.message.includes("Can't reach database server")) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if the Neon database is running');
      console.log('2. Verify the database URL in .env file');
      console.log('3. Check if your IP is whitelisted in Neon dashboard');
      console.log('4. Verify internet connectivity');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
