import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { models } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';

export function computeStatus(expiryDate) {
  const today = new Date();
  const exp = new Date(expiryDate);
  const diffDays = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'expiring';
  return 'safe';
}

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const items = await models.Item.findAll({ where: { user_id: req.user.id }, order: [['expiry_date', 'ASC']] });
  const enriched = items.map((i) => ({ ...i.toJSON(), status: computeStatus(i.expiry_date) }));
  res.json(enriched);
});

router.post(
  '/',
  requireAuth,
  [
    body('name').isString().isLength({ min: 1 }),
    body('category').optional().isString(),
    body('quantity').optional().isInt({ min: 1 }),
    body('barcode').optional().isString(),
    body('expiry_date').isISO8601()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, category, quantity = 1, barcode, expiry_date } = req.body;
    const status = computeStatus(expiry_date);
    const item = await models.Item.create({ user_id: req.user.id, name, category, quantity, barcode, expiry_date, status });
    res.status(201).json(item);
  }
);

router.put(
  '/:id',
  requireAuth,
  [param('id').isInt(), body('expiry_date').optional().isISO8601()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = Number(req.params.id);
    const item = await models.Item.findOne({ where: { id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Not found' });

    const updates = { ...req.body };
    if (updates.expiry_date) updates.status = computeStatus(updates.expiry_date);
    await item.update(updates);
    res.json(item);
  }
);

router.delete('/:id', requireAuth, [param('id').isInt()], async (req, res) => {
  const id = Number(req.params.id);
  const item = await models.Item.findOne({ where: { id, user_id: req.user.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.destroy();
  res.json({ ok: true });
});

export default router;