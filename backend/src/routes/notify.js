import { Router } from 'express';
import { Op } from 'sequelize';
import { models } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';
import { sendWebPush } from '../services/push.js';

const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const soon = await models.Item.findAll({
    where: {
      user_id: req.user.id,
      expiry_date: { [Op.lte]: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
    },
    order: [['expiry_date', 'ASC']]
  });

  const messages = await Promise.all(
    soon.map(async (item) => {
      const message = `${item.name} is expiring on ${item.expiry_date}`;
      await models.Notification.create({ user_id: req.user.id, item_id: item.id, message });
      await sendWebPush(req.user.id, {
        title: 'Expiry Alert',
        body: message
      });
      return message;
    })
  );

  res.json({ sent: messages.length });
});

export default router;