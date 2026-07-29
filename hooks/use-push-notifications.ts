import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { API_URL } from '@/shared/config/env';

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

// POST /users/me/device-tokens (não é mais PATCH /users/{id}/firebase-token —
// essa rota antiga foi removida junto com a coluna firebase_token do User).
// Usa a mesma EXPO_PUBLIC_API_URL do resto do app (shared/config/env) em vez de
// uma URL fixa, para não divergir silenciosamente do backend usado pelo apiClient.
async function salvarTokenNoBackend(fcmToken: string, authToken: string) {
  try {
    const response = await fetch(`${API_URL}/users/me/device-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token: fcmToken }),
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
  const authToken = useAuthStore((s) => s.token);

  useEffect(() => {
    if (isExpoGo || !firebaseMessaging || !Device.isDevice || Platform.OS !== 'android') return;
    if (!userId || !authToken) return;

    async function configurar() {
      try {
        // firebaseMessaging().requestPermission() não tem implementação nativa no
        // Android (é essencialmente um no-op lá, existe para iOS). Em Android 13+
        // (API 33+) é preciso pedir a permissão de runtime POST_NOTIFICATIONS
        // explicitamente via expo-notifications, senão o token é obtido mas
        // nenhuma notificação chega a ser exibida.
        if (Notifications) {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') return;
        }

        const permissao = await firebaseMessaging().requestPermission();
        const autorizado =
          permissao === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
          permissao === firebaseMessaging.AuthorizationStatus.PROVISIONAL;

        if (!autorizado) return;

        const token = await firebaseMessaging().getToken();
        setFcmToken(token);
        await salvarTokenNoBackend(token, authToken as string);

        firebaseMessaging().onTokenRefresh(async (novoToken: string) => {
          setFcmToken(novoToken);
          await salvarTokenNoBackend(novoToken, authToken as string);
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
  }, [userId, authToken]);

  return { fcmToken, notification };
}
