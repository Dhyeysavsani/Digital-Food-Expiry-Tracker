import webpush from 'web-push';
import { getSubscriptions } from '../routes/push.js';

export async function sendWebPush(userId, payload) {
  const subs = getSubscriptions(userId);
  if (!subs.length) return;
  const body = JSON.stringify({ title: payload.title, body: payload.body });
  await Promise.all(
    subs.map((sub) => webpush.sendNotification(sub, body).catch(() => null))
  );
}