const { PrismaClient } = require('@prisma/client');

async function makeAdmin() {
  const prisma = new PrismaClient();
  
  try {
    const user = await prisma.user.update({
      where: { email: 'admin@test.com' },
      data: { role: 'ADMIN' }
    });
    
    console.log('✅ User updated to ADMIN role:', user);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
