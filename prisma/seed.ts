import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Seed additional sample users
  const userPassword = await bcrypt.hash('password123', 10);
  const sampleUsers = [
    { name: 'John Doe', email: 'john.doe@example.com', role: Role.USER },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: Role.USER },
    { name: 'Michael Brown', email: 'michael.brown@example.com', role: Role.USER },
    { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: Role.USER },
    { name: 'David Johnson', email: 'david.johnson@example.com', role: Role.USER },
  ];

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: userPassword,
        role: user.role,
      },
    });
  }

  // Seed sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'Health Insurance',
        description: 'Comprehensive medical cover for individuals and families',
        features: [
          'Inpatient & Outpatient Cover',
          'Maternity Benefits',
          'Dental & Optical',
          'Emergency Services',
          'Chronic Disease Management',
        ],
        category: 'health',
      },
      {
        name: 'Motor Insurance',
        description: 'Complete vehicle protection with competitive rates',
        features: [
          'Third Party Cover',
          'Comprehensive Cover',
          'Passenger Legal Liability',
          'Windscreen Protection',
          '24/7 Emergency Assistance',
        ],
        category: 'motor',
      },
      {
        name: 'Life Insurance',
        description: 'Financial security for your loved ones',
        features: [
          'Term Life Insurance',
          'Whole Life Insurance',
          'Education Policies',
          'Funeral Cover',
          'Investment-Linked Policies',
        ],
        category: 'life',
      },
      {
        name: 'Property Insurance',
        description: 'Protect your home and valuable possessions',
        features: [
          'Fire & Allied Perils',
          'Burglary & Theft',
          'All Risks Cover',
          'Public Liability',
          'Loss of Rent',
        ],
        category: 'property',
      },
      {
        name: 'Travel Insurance',
        description: 'Stay protected wherever your journey takes you',
        features: [
          'Medical Emergency Cover',
          'Trip Cancellation',
          'Lost Luggage Protection',
          'Personal Accident',
          '24/7 Global Assistance',
        ],
        category: 'travel',
      },
      {
        name: 'Corporate Packages',
        description: 'Comprehensive business insurance solutions',
        features: [
          'Professional Indemnity',
          'Public Liability',
          'Group Life & Medical',
          'Commercial Property',
          'Business Interruption',
        ],
        category: 'corporate',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
