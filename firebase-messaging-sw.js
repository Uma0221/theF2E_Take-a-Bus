// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

var firebaseConfig = {
  apiKey: 'AIzaSyCuNSt10JtORrzP3Pq_D0nzs4BUouHm0NI',
  authDomain: 'babago-noti.firebaseapp.com',
  projectId: 'babago-noti',
  storageBucket: 'babago-noti.appspot.com',
  messagingSenderId: '127721117499',
  appId: '1:127721117499:web:48b56d8aea4e31f1d5c91e',
  measurementId: 'G-M4R7NFGZB0',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
