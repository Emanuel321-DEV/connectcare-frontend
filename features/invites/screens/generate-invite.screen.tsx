import { useState } from 'react';
import {
  ActivityIndicator,
  Clipboard,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGenerateInvite } from '../hooks/use-generate-invite';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function GenerateInviteScreen() {
  const { email, setEmail, loading, error, sentTo, acceptUrl, sendInvite, reset } = useGenerateInvite();
  const user = useAuthStore((s) => s.user);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (!acceptUrl) return;
    Clipboard.setString(acceptUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareLink() {
    if (!acceptUrl) return;
    Share.share({ message: `Use este link para se conectar comigo no CareConnect: ${acceptUrl}` });
  }

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
            Digite o email do cuidador. Ele precisa já ter uma conta no CareConnect.
          </Text>
        </View>

        {sentTo ? (
          <View className="bg-white border-2 border-[#C1C6D5] rounded-xl items-center p-8" style={{ gap: 16 }}>
            <Ionicons name="checkmark-circle" size={56} color="#34A853" />
            <Text className="text-[#1A1C1E] text-lg font-semibold text-center">
              Convite criado para {sentTo}
            </Text>
            <Text className="text-[#414753] text-base text-center">
              Não enviamos email automaticamente. Copie o link abaixo e mande pro cuidador (WhatsApp, pessoalmente, etc.).
            </Text>

            <View className="w-full" style={{ gap: 8 }}>
              <TouchableOpacity
                className="bg-[#004E9F] rounded-xl flex-row items-center justify-center"
                style={{ height: 48, gap: 8 }}
                onPress={copyLink}
              >
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="white" />
                <Text className="text-white font-semibold text-base">{copied ? 'Copiado!' : 'Copiar link'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border-2 border-[#004E9F] rounded-xl flex-row items-center justify-center"
                style={{ height: 48, gap: 8 }}
                onPress={shareLink}
              >
                <Ionicons name="share-outline" size={18} color="#004E9F" />
                <Text className="text-[#004E9F] font-semibold text-base">Compartilhar link</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="border-2 border-[#004E9F] rounded-xl items-center justify-center"
              style={{ height: 48, paddingHorizontal: 24 }}
              onPress={reset}
            >
              <Text className="text-[#004E9F] font-semibold text-base">Convidar outro cuidador</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-6" style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text className="text-[#1A1C1E] text-base font-semibold">Email do Cuidador</Text>
              <TextInput
                className="bg-white border-2 border-[#727784] rounded-lg px-4 text-[#1A1C1E]"
                style={{ height: 48, fontSize: 16 }}
                placeholder="cuidador@exemplo.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {error ? <Text className="text-[#EA4335] text-sm">{error}</Text> : null}

            <TouchableOpacity
              className="bg-[#004E9F] rounded-xl items-center justify-center"
              style={{ height: 56 }}
              onPress={sendInvite}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-semibold">Enviar Convite</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
