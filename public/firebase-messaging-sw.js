importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAleL1SxpeFefPeIN70ajg0a7MqS9gDuZo",
  authDomain: "notification-ayursutra.firebaseapp.com",
  projectId: "notification-ayursutra",
  storageBucket: "notification-ayursutra.firebasestorage.app",
  messagingSenderId: "43546740136",
  appId: "1:43546740136:web:fce2af2beda0f28594099d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || payload.data || {};
  self.registration.showNotification(title || "New Alert", {
    body,
    icon: "/logo192.png",
    data: payload.data
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const route = event.notification.data?.route;
  if (route) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(route) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(route);
        }
      })
    );
  }
});