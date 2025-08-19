import cron from 'node-cron';
import { Op } from 'sequelize';
import { models } from '../utils/db.js';
import { sendWebPush } from '../services/push.js';

function computeStatus(expiryDate) {
  const today = new Date();
  const exp = new Date(expiryDate);
  const diffDays = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring';
  return 'safe';
}

export function scheduleDailyCheck() {
  cron.schedule('0 7 * * *', async () => {
    const items = await models.Item.findAll();
    for (const item of items) {
      const newStatus = computeStatus(item.expiry_date);
      if (newStatus !== item.status) {
        await item.update({ status: newStatus });
      }
      if (newStatus === 'expiring') {
        const message = `${item.name} is expiring on ${item.expiry_date}`;
        await models.Notification.create({ user_id: item.user_id, item_id: item.id, message });
        await sendWebPush(item.user_id, { title: 'Expiry Alert', body: message });
      }
    }
  });
}