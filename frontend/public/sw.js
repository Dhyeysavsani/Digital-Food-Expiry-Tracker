self.addEventListener('push', function(event) {
  let data = {}
  try { data = event.data.json() } catch {}
  const title = data.title || 'DFET Notification'
  const body = data.body || ''
  const options = { body, icon: '/favicon.ico' }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})