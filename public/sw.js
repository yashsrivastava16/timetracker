self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (err) {
      console.error('[Service Worker] Error parsing push data as JSON:', err);
      data = { title: "Notification", body: event.data.text() };
    }
    
    const options = {
      body: data.body,
      data: {
        scheduleId: data.scheduleId,
        taskId: data.taskId,
        type: data.type
      }
    };
    
    if (data.tag) {
      options.tag = data.tag;
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a dashboard tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new tab to the dashboard
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
