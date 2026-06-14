import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ===========================================================
  // PUSH NOTIFICATIONS
  //
  // Por enquanto userId está como null pois não há autenticação.
  // Quando implementar o login, substitua null pelo ID do usuário:
  //
  //   const { userId } = useAuth(); // seu contexto de auth
  //   const { fcmToken, notification } = usePushNotifications(userId);
  //
  // ===========================================================
  const { fcmToken, notification } = usePushNotifications(null);

  // Log para desenvolvimento — remova quando for para produção
  if (__DEV__) {
    if (fcmToken) console.log('[Layout] FCM Token disponível:', fcmToken);
    if (notification) console.log('[Layout] Última notificação:', notification);
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(caregiver)" options={{ headerShown: false }} />
        <Stack.Screen name="invite" options={{ headerShown: false }} />
        <Stack.Screen name="accept-invite" options={{ headerShown: false }} />
        <Stack.Screen name="confirm-dose" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="prescription/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
