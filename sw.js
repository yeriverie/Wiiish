self.addEventListener('install', (event) => {
  
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle 1-Tap Notification Check-In Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'check_in') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            client.postMessage({ type: 'PULSE_CHECK_IN_SUCCESS' });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('./index.html?action=checkin');
        }
      })
    );
  }
});
