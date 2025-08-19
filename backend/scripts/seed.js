import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { initializeDatabase, models, sequelize } from '../src/utils/db.js';

async function run() {
  await initializeDatabase();
  await sequelize.sync({ alter: false });

  const email = 'demo@example.com';
  let user = await models.User.findOne({ where: { email } });
  if (!user) {
    user = await models.User.create({ name: 'Demo User', email, password_hash: await bcrypt.hash('demopass', 10) });
  }

  const today = new Date();
  const addDays = (d) => new Date(today.getTime() + d * 86400000);
  const items = [
    { name: 'Milk 2%', category: 'Dairy', quantity: 1, barcode: '0123456789012', expiry_date: addDays(1) },
    { name: 'Yogurt', category: 'Dairy', quantity: 4, barcode: '0987654321098', expiry_date: addDays(4) },
    { name: 'Chicken Breast', category: 'Meat', quantity: 2, expiry_date: addDays(-1) },
    { name: 'Apples', category: 'Fruit', quantity: 6, expiry_date: addDays(10) },
    { name: 'Bread', category: 'Bakery', quantity: 1, expiry_date: addDays(2) }
  ];

  for (const it of items) {
    const exists = await models.Item.findOne({ where: { user_id: user.id, name: it.name } });
    if (!exists) {
      await models.Item.create({ user_id: user.id, ...it });
    }
  }

  console.log('Seed complete. Login with demo@example.com / demopass');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});