import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAcceptInvite } from '../hooks/use-accept-invite';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PendingInvite } from '../types/invite.types';

export default function AcceptInviteScreen() {
  const { pendingInvites, loading, error, acceptInvite, rejectInvite } = useAcceptInvite();
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View className="w-10 h-10 rounded-full border-2 border-[#004E9F] bg-[#D7E3FF] items-center justify-center">
            <Text className="text-[#004E9F] font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() ?? 'C'}
            </Text>
          </View>
          <Text className="text-[#004E9F] text-base">CareConnect</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>Convites Pendentes</Text>
          <Text className="text-[#414753] text-lg" style={{ lineHeight: 28 }}>
            Pacientes que te convidaram para acompanhar a medicação deles aparecem aqui.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#004E9F" style={{ marginTop: 40 }} />
        ) : error ? (
          <View className="items-center py-16" style={{ gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#EA4335" />
            <Text className="text-[#EA4335] text-base text-center px-6">{error}</Text>
          </View>
        ) : pendingInvites.length === 0 ? (
          <View className="items-center py-16" style={{ gap: 8 }}>
            <Ionicons name="mail-open-outline" size={48} color="#C1C6D5" />
            <Text className="text-[#9AA0A6] text-lg text-center">Nenhum convite pendente.</Text>
          </View>
        ) : (
          pendingInvites.map((invite) => (
            <InviteCard
              key={invite.id}
              invite={invite}
              onAccept={() => acceptInvite(invite)}
              onReject={() => rejectInvite(invite)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InviteCard({ invite, onAccept, onReject }: { invite: PendingInvite; onAccept: () => void; onReject: () => void }) {
  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl overflow-hidden">
      <View className="p-5 flex-row items-center" style={{ gap: 16 }}>
        <View className="w-14 h-14 rounded-full bg-[#EDEEF0] border-2 border-[#C1C6D5] items-center justify-center">
          <Ionicons name="person" size={20} color="#414753" />
        </View>
        <View className="flex-1" style={{ gap: 2 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1C1E' }}>{invite.patientName}</Text>
          <Text className="text-[#414753] text-base">Convidou você para acompanhar a medicação</Text>
        </View>
      </View>
      <View className="bg-[#F3F3F6] border-t-2 border-[#C1C6D5] flex-row items-center justify-center px-3 py-3" style={{ gap: 12 }}>
        <TouchableOpacity
          className="flex-1 border-2 border-[#004E9F] rounded-lg items-center justify-center"
          style={{ height: 48 }}
          onPress={onReject}
        >
          <Text className="text-[#004E9F] text-base">Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-[#004E9F] rounded-lg items-center justify-center"
          style={{ height: 48 }}
          onPress={onAccept}
        >
          <Text className="text-white text-base">Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
