import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertAdmin() {
  const email = 'admin@galloways.co.ke';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin',
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin',
    },
  });

  console.log('Admin user upserted:', admin);
  await prisma.$disconnect();
}

upsertAdmin().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
