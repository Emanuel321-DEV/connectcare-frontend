import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// URL base da API
const API_BASE_URL = 'https://careconnect.lmezencio.dev/api/v1';

// Configuração de como as notificações aparecem quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Envia o token FCM para o backend.
 * Quando a autenticação for implementada, substitua o userId pelo ID real do usuário logado.
 */
async function salvarTokenNoBackend(userId: string, fcmToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/firebase-token`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebase_token: fcmToken }),
    });

    if (!response.ok) {
      console.warn('[PushNotifications] Falha ao salvar token no backend:', response.status);
    } else {
      console.log('[PushNotifications] Token FCM salvo com sucesso no backend!');
    }
  } catch (error) {
    console.error('[PushNotifications] Erro ao salvar token:', error);
  }
}

/**
 * Hook principal de push notifications.
 *
 * USO:
 *   const { fcmToken, notification } = usePushNotifications(userId);
 *
 * PARÂMETROS:
 *   userId — ID do usuário logado. Quando não houver auth, passe null.
 *             Quando implementar auth, passe o ID real aqui.
 */
export function usePushNotifications(userId: string | null) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<FirebaseMessagingTypes.RemoteMessage | null>(null);
  const notificationListener = useRef<any>(null);

  useEffect(() => {
    // Só roda em dispositivo físico (não funciona em emulador sem configuração extra)
    if (!Device.isDevice) {
      console.warn('[PushNotifications] Push notifications não funcionam em emulador sem configuração extra.');
      return;
    }

    // Só roda no Android (iOS precisa de configuração adicional na Apple Developer)
    if (Platform.OS !== 'android') {
      return;
    }

    async function configurarNotificacoes() {
      try {
        // 1. Solicitar permissão
        const permissao = await messaging().requestPermission();
        const autorizado =
          permissao === messaging.AuthorizationStatus.AUTHORIZED ||
          permissao === messaging.AuthorizationStatus.PROVISIONAL;

        if (!autorizado) {
          console.warn('[PushNotifications] Permissão negada pelo usuário.');
          return;
        }

        // 2. Obter token FCM
        const token = await messaging().getToken();
        console.log('[PushNotifications] Token FCM:', token);
        setFcmToken(token);

        // 3. Enviar token para o backend (só se tiver userId)
        if (userId) {
          await salvarTokenNoBackend(userId, token);
        } else {
          console.log('[PushNotifications] userId não disponível ainda. Token será enviado após login.');
        }

        // 4. Atualizar token automaticamente se o Firebase gerar um novo
        messaging().onTokenRefresh(async (novoToken) => {
          console.log('[PushNotifications] Token FCM atualizado:', novoToken);
          setFcmToken(novoToken);
          if (userId) {
            await salvarTokenNoBackend(userId, novoToken);
          }
        });

        // 5. Notificação recebida com app ABERTO (foreground)
        notificationListener.current = messaging().onMessage(async (remoteMessage) => {
          console.log('[PushNotifications] Notificação recebida (foreground):', remoteMessage);
          setNotification(remoteMessage);

          // Exibir como notificação local quando app está aberto
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title ?? 'ConnectCare',
              body: remoteMessage.notification?.body ?? '',
              data: remoteMessage.data,
            },
            trigger: null, // exibe imediatamente
          });
        });

        // 6. Notificação clicada com app em BACKGROUND
        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log('[PushNotifications] App aberto via notificação (background):', remoteMessage);
          setNotification(remoteMessage);
        });

        // 7. Verificar se o app foi aberto por uma notificação (estava FECHADO)
        const initialMessage = await messaging().getInitialNotification();
        if (initialMessage) {
          console.log('[PushNotifications] App aberto via notificação (fechado):', initialMessage);
          setNotification(initialMessage);
        }

      } catch (error) {
        console.error('[PushNotifications] Erro ao configurar notificações:', error);
      }
    }

    configurarNotificacoes();

    // Limpar listeners ao desmontar
    return () => {
      if (notificationListener.current) {
        notificationListener.current();
      }
    };
  }, [userId]);

  return { fcmToken, notification };
}
