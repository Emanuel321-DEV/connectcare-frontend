import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

// Push notifications não funcionam no Expo Go a partir do SDK 53
const isExpoGo = Constants.appOwnership === 'expo';

let firebaseMessaging: any = null;
let Notifications: any = null;

if (!isExpoGo) {
  try {
    firebaseMessaging = require('@react-native-firebase/messaging').default;
  } catch { /* development build não configurado */ }

  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch { /* silencioso */ }
}

const API_BASE_URL = 'https://careconnect.lmezencio.dev/api/v1';

async function salvarTokenNoBackend(userId: string, fcmToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/firebase-token`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebase_token: fcmToken }),
    });
    if (!response.ok) {
      console.warn('[PushNotifications] Falha ao salvar token:', response.status);
    }
  } catch (error) {
    console.error('[PushNotifications] Erro ao salvar token:', error);
  }
}

export function usePushNotifications(userId: string | null) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);
  const notificationListener = useRef<any>(null);

  useEffect(() => {
    if (isExpoGo || !firebaseMessaging || !Device.isDevice || Platform.OS !== 'android') return;

    async function configurar() {
      try {
        const permissao = await firebaseMessaging().requestPermission();
        const autorizado =
          permissao === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
          permissao === firebaseMessaging.AuthorizationStatus.PROVISIONAL;

        if (!autorizado) return;

        const token = await firebaseMessaging().getToken();
        setFcmToken(token);
        if (userId) await salvarTokenNoBackend(userId, token);

        firebaseMessaging().onTokenRefresh(async (novoToken: string) => {
          setFcmToken(novoToken);
          if (userId) await salvarTokenNoBackend(userId, novoToken);
        });

        notificationListener.current = firebaseMessaging().onMessage(async (msg: any) => {
          setNotification(msg);
          if (Notifications) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: msg.notification?.title ?? 'CareConnect',
                body: msg.notification?.body ?? '',
                data: msg.data,
              },
              trigger: null,
            });
          }
        });

        firebaseMessaging().onNotificationOpenedApp((msg: any) => setNotification(msg));

        const initial = await firebaseMessaging().getInitialNotification();
        if (initial) setNotification(initial);
      } catch (error) {
        console.error('[PushNotifications] Erro:', error);
      }
    }

    configurar();

    return () => {
      if (notificationListener.current) notificationListener.current();
    };
  }, [userId]);

  return { fcmToken, notification };
}
