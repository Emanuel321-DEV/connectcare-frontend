import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGenerateInvite } from '../hooks/use-generate-invite';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function GenerateInviteScreen() {
  const { invite, loading, copied, copyCode, shareCode } = useGenerateInvite();
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <TouchableOpacity className="w-12 h-12 items-center justify-center" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#004E9F" />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#004E9F' }}>CareConnect</Text>
        </View>
        <View className="w-10 h-10 rounded-full border-2 border-[#004E9F] bg-[#D7E3FF] items-center justify-center">
          <Text className="text-[#004E9F] font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40, maxWidth: 448, gap: 0 }} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View className="items-center" style={{ gap: 8, paddingBottom: 40 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>Convidar Cuidador</Text>
          <Text className="text-[#414753] text-lg text-center">
            Peça para seu cuidador abrir o CareConnect e escanear este código para conectar as contas com segurança.
          </Text>
        </View>

        {/* QR Code Card */}
        <View className="bg-white border-2 border-[#C1C6D5] rounded-xl items-center p-8" style={{ marginBottom: 24, gap: 24 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#004E9F" style={{ height: 192 }} />
          ) : (
            <View className="border-4 border-[#004E9F] rounded-2xl p-5">
              <QRPlaceholder />
            </View>
          )}

          {/* Code */}
          <View className="w-full items-center" style={{ gap: 4 }}>
            <Text className="text-[#414753] font-semibold text-base text-center tracking-widest uppercase">
              Código de Acesso
            </Text>
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <Text style={{ fontSize: 26, fontWeight: '700', color: '#004E9F', letterSpacing: 5.2 }}>
                {invite?.code ?? '------'}
              </Text>
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-[#F3F3F6] items-center justify-center"
                onPress={copyCode}
              >
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color="#004E9F" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Toast feedback */}
        {copied && (
          <View className="bg-[#2E3133] rounded-full px-6 py-3 self-center mb-4">
            <Text className="text-white font-semibold text-base">Código copiado!</Text>
          </View>
        )}

        {/* Actions */}
        <View style={{ gap: 12, marginBottom: 40 }}>
          <TouchableOpacity
            className="bg-[#004E9F] rounded-xl flex-row items-center justify-center"
            style={{ height: 56, gap: 12 }}
            onPress={shareCode}
            activeOpacity={0.85}
          >
            <Ionicons name="share-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold">Compartilhar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border-2 border-[#004E9F] rounded-xl flex-row items-center justify-center"
            style={{ height: 56, gap: 12 }}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={20} color="#004E9F" />
            <Text className="text-[#004E9F] text-lg font-semibold">Enviar por E-mail</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="bg-[#F3F3F6] border-2 border-[#C1C6D5] rounded-xl p-6" style={{ gap: 12, marginBottom: 24 }}>
          <Text className="text-[#1A1C1E] text-lg font-semibold">Como funciona?</Text>
          {[
            'Seu cuidador baixa o app CareConnect.',
            'Ele escolhe "Entrar como Cuidador" e escaneia o código acima.',
            'Pronto! Vocês agora compartilham o histórico de saúde.',
          ].map((step, i) => (
            <View key={i} className="flex-row items-start" style={{ gap: 12 }}>
              <View className="w-7 h-7 rounded-full bg-[#004E9F] items-center justify-center">
                <Text className="text-white text-sm font-bold">{i + 1}</Text>
              </View>
              <Text className="text-[#414753] text-lg flex-1" style={{ lineHeight: 28 }}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Safety note */}
        <View className="items-center px-4 opacity-70">
          <Text className="text-[#414753] text-lg text-center" style={{ lineHeight: 28 }}>
            Este código é único para sua conta e expira em 24 horas para sua segurança.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QRPlaceholder() {
  const pattern = [
    [1,1,1,0,1],[1,0,1,1,1],[1,1,1,0,1],[0,1,0,1,1],[1,1,1,1,1],
  ];
  return (
    <View style={{ width: 192, height: 192, backgroundColor: '#E8E8EA', borderRadius: 8, padding: 8 }}>
      <View style={{ flex: 1, flexDirection: 'column', gap: 4 }}>
        {pattern.map((row, r) => (
          <View key={r} style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
            {row.map((cell, c) => (
              <View key={c} style={{ flex: 1, backgroundColor: cell ? '#004E9F' : 'transparent', borderRadius: 2, opacity: cell ? 0.8 + Math.random() * 0.2 : 0 }} />
            ))}
          </View>
        ))}
      </View>
      <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }], backgroundColor: 'white', borderRadius: 8, padding: 4, borderWidth: 1, borderColor: '#C1C6D5' }}>
        <MaterialCommunityIcons name="qrcode" size={32} color="#004E9F" />
      </View>
    </View>
  );
}
