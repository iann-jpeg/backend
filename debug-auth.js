const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function debugAuth() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 DEBUG: Checking authentication...');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'info@galloways.co.ke' }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      passwordPreview: user.password?.substring(0, 10) + '...'
    });
    
    // Test password comparison
    const testPassword = '123456';
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('🔑 Password test with "123456":', isValid ? '✅ VALID' : '❌ INVALID');
    
    // Test different variations
    const variations = ['123456', 'admin123', 'password', 'galloways'];
    for (const pwd of variations) {
      const valid = await bcrypt.compare(pwd, user.password);
      console.log(`   Testing "${pwd}":`, valid ? '✅' : '❌');
    }
    
    // Check all admin users
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, name: true, email: true, role: true }
    });
    
    console.log('\n👑 All admin users:');
    admins.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();
