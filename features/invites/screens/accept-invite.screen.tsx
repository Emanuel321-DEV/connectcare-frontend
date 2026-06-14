import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAcceptInvite } from '../hooks/use-accept-invite';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PendingInvite } from '../types/invite.types';

export default function AcceptInviteScreen() {
  const { code, setCode, pendingInvites, loading, validating, error, validateCode, acceptInvite, rejectInvite } = useAcceptInvite();
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
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="settings-outline" size={22} color="#414753" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120, gap: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>Conectar novo paciente</Text>
          <Text className="text-[#414753] text-lg" style={{ lineHeight: 28 }}>
            Insira o código enviado pela família ou escaneie o QR Code do paciente para iniciar o acompanhamento.
          </Text>
        </View>

        {/* Input + QR */}
        <View style={{ gap: 16 }}>
          {/* Manual code */}
          <View className="bg-[#F9F9FB] border-2 border-[#C1C6D5] rounded-xl p-6" style={{ gap: 8 }}>
            <Text className="text-[#1A1C1E] text-lg font-semibold">Código de Convite</Text>
            <View style={{ gap: 16 }}>
              <TextInput
                className="bg-white border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                style={{ height: 48, fontSize: 22, fontWeight: '700' }}
                placeholder="Ex: ABC-1234"
                placeholderTextColor="#6B7280"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                className="bg-[#0066CC] rounded-xl items-center justify-center"
                style={{ height: 48 }}
                onPress={validateCode}
                disabled={validating}
                activeOpacity={0.85}
              >
                {validating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-[#DFE8FF] text-base">Validar Código</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* QR Scan */}
          <TouchableOpacity
            className="bg-[#E8E8EA] border-2 border-[#C1C6D5] rounded-xl flex-row items-center justify-between p-6"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center" style={{ gap: 16 }}>
              <View className="w-12 h-12 bg-[#004E9F] rounded-lg items-center justify-center">
                <Ionicons name="qr-code-outline" size={25} color="white" />
              </View>
              <View>
                <Text className="text-[#1A1C1E] text-lg font-semibold">Escanear QR Code</Text>
                <Text className="text-[#414753] text-lg">Use a câmera do celular</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#414753" />
          </TouchableOpacity>
        </View>

        {error ? <Text className="text-red-500 text-sm">{error}</Text> : null}

        {/* Pending invites */}
        <View style={{ gap: 16 }}>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1C1E' }}>Convites Pendentes</Text>
            {pendingInvites.length > 0 && (
              <View className="bg-[#A0F399] rounded-full px-3 py-0.5">
                <Text className="text-[#217128] font-semibold text-base">{pendingInvites.length} novos</Text>
              </View>
            )}
          </View>

          {loading ? (
            <ActivityIndicator color="#004E9F" />
          ) : (
            pendingInvites.map((invite) => (
              <InviteCard key={invite.id} invite={invite} onAccept={() => acceptInvite(invite.id)} onReject={() => rejectInvite(invite.id)} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#F9F9FB] border-t-2 border-[#C1C6D5]" style={{ height: 80, justifyContent: 'center' }}>
        <View className="flex-row items-center justify-around px-8">
          <TabItem icon="home-outline" label="Home" active={false} />
          <TabItem icon="calendar-outline" label="Agenda" active={true} />
          <TabItem icon="bar-chart-outline" label="Relatórios" active={false} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InviteCard({ invite, onAccept, onReject }: { invite: PendingInvite; onAccept: () => void; onReject: () => void }) {
  const receivedText = getReceivedText(invite.receivedAt);
  const isRecent = Date.now() - new Date(invite.receivedAt).getTime() < 86400000;

  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl overflow-hidden">
      <View className="p-5 flex-row items-start" style={{ gap: 16 }}>
        <View className="w-14 h-14 rounded-full bg-[#EDEEF0] border-2 border-[#C1C6D5] items-center justify-center">
          <Ionicons name="person" size={20} color="#414753" />
        </View>
        <View className="flex-1" style={{ gap: 2 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1C1E' }}>{invite.patientName}</Text>
          <Text className="text-[#414753] text-lg">
            Convidado por: <Text className="font-semibold">{invite.invitedBy}</Text>
            {'\n'}<Text className="font-semibold">({invite.relationship})</Text>
          </Text>
          <View className="flex-row items-center mt-1" style={{ gap: 6 }}>
            <Ionicons name="time-outline" size={12} color={isRecent ? '#004E9F' : '#414753'} />
            <Text style={{ fontSize: 14, color: isRecent ? '#004E9F' : '#414753' }}>{receivedText}</Text>
          </View>
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
          <Text className="text-white text-base">Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TabItem({ icon, label, active }: { icon: string; label: string; active: boolean }) {
  return (
    <View className={`items-center justify-center rounded-xl px-4 py-1 ${active ? 'bg-[#0066CC]' : ''}`}>
      <Ionicons name={icon as any} size={active ? 20 : 18} color={active ? '#DFE8FF' : '#414753'} />
      <Text style={{ fontSize: 14, fontWeight: '600', color: active ? '#DFE8FF' : '#414753', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function getReceivedText(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Recebido agora';
  if (hours < 24) return `Recebido há ${hours} hora${hours > 1 ? 's' : ''}`;
  return 'Recebido ontem';
}
