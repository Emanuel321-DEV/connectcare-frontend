import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRegister } from '../hooks/use-register';

type Role = 'patient' | 'caregiver';

export default function RegisterScreen() {
  const {
    name, setName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    role, setRole,
    showPassword, setShowPassword,
    acceptedTerms, setAcceptedTerms,
    loading, error,
    register,
  } = useRegister();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {/* Decorative blobs */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none">
        <View className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#A3F69C] opacity-20" />
        <View className="absolute bottom-[-63px] left-[-80px] w-[256px] h-[256px] rounded-full bg-[#D7E3FF] opacity-20" />
      </View>

      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] text-base">CareConnect</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="help-circle-outline" size={22} color="#004E9F" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40, maxWidth: 448 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View className="items-center" style={{ gap: 8, paddingBottom: 40 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>Crie sua conta</Text>
            <Text className="text-[#414753] text-lg text-center">
              Comece sua jornada de cuidado agora mesmo.
            </Text>
          </View>

          {/* Role selector */}
          <View style={{ gap: 16, paddingBottom: 40 }}>
            <Text className="text-[#1A1C1E] text-lg font-semibold">Eu sou...</Text>
            <View className="flex-row" style={{ gap: 16 }}>
              <RoleCard
                icon={<Ionicons name="person" size={24} color="#004E9F" />}
                bgColor="#D7E3FF"
                label="Paciente"
                labelColor="#004E9F"
                selected={role === 'patient'}
                onPress={() => setRole('patient' as Role)}
              />
              <RoleCard
                icon={<MaterialCommunityIcons name="medical-bag" size={24} color="#1B6D24" />}
                bgColor="#A3F69C"
                label="Cuidador"
                labelColor="#1B6D24"
                selected={role === 'caregiver'}
                onPress={() => setRole('caregiver' as Role)}
              />
            </View>
          </View>

          {/* Form */}
          <View style={{ gap: 24, paddingBottom: 16 }}>
            {/* Nome */}
            <View style={{ gap: 8 }}>
              <Text className="text-[#1A1C1E] text-lg font-semibold">Nome Completo</Text>
              <TextInput
                className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                style={{ height: 48, fontSize: 18 }}
                placeholder="Como devemos chamar você?"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={{ gap: 8 }}>
              <Text className="text-[#1A1C1E] text-lg font-semibold">E-mail</Text>
              <TextInput
                className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                style={{ height: 48, fontSize: 18 }}
                placeholder="exemplo@email.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Telefone */}
            <View style={{ gap: 8 }}>
              <Text className="text-[#1A1C1E] text-lg font-semibold">Telefone</Text>
              <TextInput
                className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                style={{ height: 48, fontSize: 18 }}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#6B7280"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Senha */}
            <View style={{ gap: 8 }}>
              <Text className="text-[#1A1C1E] text-lg font-semibold">Senha</Text>
              <View>
                <TextInput
                  className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                  style={{ height: 48, fontSize: 18, paddingRight: 52 }}
                  placeholder="Crie uma senha forte"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-3 items-center justify-center"
                  style={{ top: 0, height: 48, width: 40 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#727784" />
                </TouchableOpacity>
              </View>
              <Text className="text-[#414753] text-xs px-1">Mínimo de 8 caracteres com letras e números.</Text>
            </View>

            {/* Terms */}
            <View className="flex-row items-start" style={{ gap: 16, paddingBottom: 24 }}>
              <Pressable
                className="mt-1 items-center justify-center rounded"
                style={{ width: 28, height: 28, borderWidth: 2, borderColor: '#727784', backgroundColor: acceptedTerms ? '#004E9F' : 'white' }}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              >
                {acceptedTerms && <Ionicons name="checkmark" size={18} color="white" />}
              </Pressable>
              <Text className="text-[#414753] text-lg flex-1" style={{ lineHeight: 28 }}>
                Eu concordo com os{' '}
                <Text className="text-[#004E9F] font-bold underline">Termos de Serviço</Text>
                {' '}e{' '}
                <Text className="text-[#004E9F] font-bold underline">Política de Privacidade</Text>.
              </Text>
            </View>

            {error ? <Text className="text-red-500 text-sm text-center">{error}</Text> : null}

            {/* Submit */}
            <TouchableOpacity
              className="bg-[#004E9F] rounded-xl flex-row items-center justify-center"
              style={{ height: 56, gap: 8 }}
              onPress={register}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-lg font-semibold">Finalizar cadastro</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View className="items-center py-10">
            <Text className="text-[#414753] text-lg">
              Já possui uma conta?{' '}
              <Text className="text-[#004E9F] font-bold" onPress={() => router.back()}>
                Faça login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RoleCard({ icon, bgColor, label, labelColor, selected, onPress }: {
  icon: React.ReactNode;
  bgColor: string;
  label: string;
  labelColor: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-1 bg-white rounded-xl items-center py-6"
      style={{ borderWidth: 2, borderColor: selected ? labelColor : '#C1C6D5', gap: 8 }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <Text style={{ fontSize: 18, fontWeight: '600', color: labelColor }}>{label}</Text>
    </TouchableOpacity>
  );
}
