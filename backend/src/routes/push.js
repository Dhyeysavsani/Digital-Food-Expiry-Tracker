import { Router } from 'express';
import webpush from 'web-push';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const userIdToSubscriptions = new Map();

function configureVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || '';
  const privateKey = process.env.VAPID_PRIVATE_KEY || '';
  if (publicKey && privateKey) {
    webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:admin@example.com', publicKey, privateKey);
  }
}
configureVapid();

router.post('/subscribe', requireAuth, (req, res) => {
  const sub = req.body;
  const list = userIdToSubscriptions.get(req.user.id) || [];
  list.push(sub);
  userIdToSubscriptions.set(req.user.id, list);
  res.json({ ok: true });
});

router.get('/subscriptions', requireAuth, (req, res) => {
  res.json({ subscriptions: userIdToSubscriptions.get(req.user.id) || [] });
});

export function getSubscriptions(userId) {
  return userIdToSubscriptions.get(userId) || [];
}

export default router;