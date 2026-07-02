const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gatifleet.com' },
    update: {},
    create: {
      email: 'admin@gatifleet.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
