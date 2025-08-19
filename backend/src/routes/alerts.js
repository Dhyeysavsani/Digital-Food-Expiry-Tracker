import { Router } from 'express';
import { Op } from 'sequelize';
import { models } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const alerts = await models.Item.findAll({
    where: {
      user_id: req.user.id,
      expiry_date: { [Op.lte]: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
    },
    order: [['expiry_date', 'ASC']]
  });
  res.json({ alerts });
});

export default router;