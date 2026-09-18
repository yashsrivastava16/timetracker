import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const { getToken, isSignedIn } = useAuth();
  
  useEffect(() => {
    if (!isSignedIn) return;

    const registerAndSubscribe = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          console.log("Push notifications not supported by browser.");
          return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log("Service Worker registered");

        // Wait for Service Worker to be ready before subscribing
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log("Notification permission denied");
          return;
        }

        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.warn("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set. Cannot subscribe to push.");
          return;
        }

        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          try {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });
          } catch (e: any) {
            if (e.name === 'AbortError' || e.message.includes('push service error')) {
              console.warn("Push subscription failed. Trying to unsubscribe existing (if any) and retry.");
              const oldSub = await registration.pushManager.getSubscription();
              if (oldSub) {
                await oldSub.unsubscribe();
              }
              // Retry
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
              });
            } else {
              throw e;
            }
          }
        }

        const token = await getToken();
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(subscription)
        });
        console.log("Push subscription sent to backend");
      } catch (err) {
        console.error("Error setting up push notifications:", err);
      }
    };

    registerAndSubscribe();
  }, [isSignedIn, getToken]);
};
