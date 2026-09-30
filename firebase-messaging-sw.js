
const SITE_URL = "https://ah1310.github.io/MOKALAMATI/";

// التعامل مع الضغط على الإشعارات التي ننشئها هنا.
self.addEventListener("notificationclick", event => {
  if (event.notification.data?.source !== "mokalamati") {
    return;
  }

  event.stopImmediatePropagation();
  event.notification.close();

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if (client.url.startsWith(SITE_URL)) {
        await client.focus();
        return;
      }
    }

    await self.clients.openWindow(SITE_URL);
  })());
});

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDyL1ScnIX6GqLM30V696YAVPYqkJFruCs",
  authDomain: "mokalamati-77933.firebaseapp.com",
  projectId: "mokalamati-77933",
  storageBucket: "mokalamati-77933.firebasestorage.app",
  messagingSenderId: "159076253967",
  appId: "1:159076253967:web:876a2aab60d719bbad3e7a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  // إشعار notification يعرضه Firebase تلقائيًا.
  // نتجنب عرض نسخة ثانية منه.
  if (payload.notification) {
    return;
  }

  const data = payload.data || {};

  return self.registration.showNotification(
    data.title || "مكالماتي",
    {
      body: data.body || "لديك طلب مكالمة جديد",
      tag: "mokalamati-" + (data.callId || "notification"),
      data: {
        source: "mokalamati",
        url: SITE_URL
      }
    }
  );
});
