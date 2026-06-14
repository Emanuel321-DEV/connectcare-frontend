import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/use-notifications';
import type { Notification, NotificationType } from '../types/notification.types';

const TYPE_CONFIG: Record<NotificationType, { color: string; bg: string; icon: string }> = {
  dose_reminder: { color: '#004E9F', bg: '#D7E3FF', icon: 'alarm-outline' },
  dose_confirmed: { color: '#34A853', bg: '#E8F5E9', icon: 'checkmark-circle-outline' },
  weekly_report: { color: '#FBBC04', bg: '#FFF8E1', icon: 'bar-chart-outline' },
  low_adherence: { color: '#EA4335', bg: '#FFEBEE', icon: 'warning-outline' },
};

export default function NotificationsCentralScreen() {
  const { notifications, loading, markAsRead, unreadCount } = useNotifications();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text className="text-[#004E9F] font-semibold text-base">Notificações</Text>
          {unreadCount > 0 && (
            <View className="bg-[#EA4335] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="search-outline" size={20} color="#414753" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 8 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 60 }} />
        ) : notifications.length === 0 ? (
          <View className="items-center py-20" style={{ gap: 8 }}>
            <Ionicons name="notifications-off-outline" size={48} color="#C1C6D5" />
            <Text className="text-[#9AA0A6] text-lg">Nenhuma notificação.</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onPress={() => markAsRead(n.id)} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationItem({ notification: n, onPress }: { notification: Notification; onPress: () => void }) {
  const cfg = TYPE_CONFIG[n.type];
  const timeStr = getTimeLabel(n.createdAt);

  return (
    <TouchableOpacity
      className={`flex-row items-start px-5 py-4 border-b border-[#E8EAED] ${!n.read ? 'bg-white' : 'bg-[#F9F9FB]'}`}
      onPress={onPress}
      activeOpacity={0.7}
      style={{ gap: 14 }}
    >
      {/* Left border indicator */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: !n.read ? cfg.color : 'transparent' }} />

      {/* Icon */}
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: cfg.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
      </View>

      {/* Content */}
      <View className="flex-1" style={{ gap: 4 }}>
        <View className="flex-row items-center justify-between">
          <Text style={{ fontSize: 16, fontWeight: n.read ? '400' : '700', color: '#1A1C1E', flex: 1 }} numberOfLines={1}>
            {n.title}
          </Text>
          {!n.read && <View className="w-2 h-2 rounded-full bg-[#004E9F] ml-2" />}
        </View>
        <Text className="text-[#414753] text-sm" style={{ lineHeight: 20 }} numberOfLines={2}>{n.body}</Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-[#9AA0A6] text-xs">{timeStr}</Text>
          {n.actionLabel && (
            <TouchableOpacity className="bg-[#004E9F] rounded-lg px-3 py-1">
              <Text className="text-white text-xs font-semibold">{n.actionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getTimeLabel(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)}d atrás`;
}
