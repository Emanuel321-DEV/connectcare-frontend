import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AccountMenu } from './account-menu';

const ROLE_STYLE = {
  CAREGIVER: { accentColor: '#1B6D24', avatarBg: '#A3F69C', inviteRoute: '/accept-invite' as const },
  PATIENT: { accentColor: '#004E9F', avatarBg: '#D7E3FF', inviteRoute: '/invite' as const },
};

// Header padrão usado em todas as abas (Home, Agenda, Relatórios) de paciente
// e cuidador — mesmo avatar/menu de conta e mesmo botão de convite em todo lugar.
export function AppHeader({ title = 'CareConnect' }: { title?: string }) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [menuVisible, setMenuVisible] = useState(false);
  const style = user?.role === 'CAREGIVER' ? ROLE_STYLE.CAREGIVER : ROLE_STYLE.PATIENT;

  function handleLogout() {
    clearAuth();
    router.replace('/(auth)/login');
  }

  return (
    <>
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] text-base font-semibold">{title}</Text>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.push(style.inviteRoute)}>
            <Ionicons name="person-add-outline" size={22} color="#004E9F" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-9 h-9 rounded-full border-2 items-center justify-center"
            style={{ borderColor: style.accentColor, backgroundColor: style.avatarBg }}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={{ color: style.accentColor, fontWeight: '700', fontSize: 14 }}>
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <AccountMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        userName={user?.name ?? ''}
        userEmail={user?.email}
        accentColor={style.accentColor}
        onLogout={handleLogout}
      />
    </>
  );
}
