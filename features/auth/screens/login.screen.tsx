import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLogin } from '../hooks/use-login';

export default function LoginScreen() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    loading, error,
    login,
  } = useLogin();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {/* Atmospheric background blobs */}
      <View className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <View className="absolute top-[-88px] right-[-39px] w-[500px] h-[500px] rounded-full bg-[#D7E3FF]" />
        <View className="absolute bottom-[-88px] left-[-39px] w-[400px] h-[400px] rounded-full bg-[#A3F69C]" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full flex-col" style={{ maxWidth: 440, gap: 40 }}>

            {/* Header Branding */}
            <View className="items-center" style={{ gap: 8 }}>
              <View className="w-20 h-20 bg-[#0066CC] rounded-xl items-center justify-center">
                <MaterialCommunityIcons name="medical-bag" size={40} color="white" />
              </View>
              <Text
                className="text-[#004E9F] text-center"
                style={{ fontSize: 26, fontWeight: '700', letterSpacing: -0.65, marginTop: 4 }}
              >
                CareConnect
              </Text>
              <Text className="text-[#414753] text-xl text-center">
                Acesse sua conta para gerenciar{'\n'}seus cuidados.
              </Text>
            </View>

            {/* Form Card */}
            <View
              className="bg-white rounded-xl border-2 border-[#C1C6D5]"
              style={{ paddingHorizontal: 26, paddingTop: 26, paddingBottom: 42, gap: 24 }}
            >
              {/* Email */}
              <View style={{ gap: 8 }}>
                <Text className="text-[#1A1C1E] text-lg font-semibold">E-mail</Text>
                <TextInput
                  className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                  style={{ height: 48, fontSize: 18 }}
                  placeholder="nome@exemplo.com"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <View style={{ gap: 8 }}>
                <Text className="text-[#1A1C1E] text-lg font-semibold">Senha</Text>
                <View>
                  <TextInput
                    className="bg-[#F9F9FB] border-2 border-[#727784] rounded-lg px-[18px] text-[#1A1C1E]"
                    style={{ height: 48, fontSize: 18, paddingRight: 52 }}
                    placeholder="••••••••"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={login}
                  />
                  <TouchableOpacity
                    className="absolute right-2 items-center justify-center"
                    style={{ top: 0, height: 48, width: 40 }}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color="#727784"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error */}
              {error ? (
                <Text className="text-red-500 text-sm text-center">{error}</Text>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                className="bg-[#004E9F] rounded-xl flex-row items-center justify-center"
                style={{ height: 56, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 }}
                onPress={login}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="text-white text-lg font-semibold">Entrar</Text>
                    <Ionicons name="arrow-forward" size={18} color="white" />
                  </>
                )}
              </TouchableOpacity>

              {/* Forgot password */}
              <View className="items-center justify-center" style={{ paddingTop: 8, height: 48 }}>
                <TouchableOpacity>
                  <Text className="text-[#004E9F] text-base font-semibold">
                    Esqueceu sua senha?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="items-center" style={{ gap: 24 }}>
              {/* Separator */}
              <View className="flex-row items-center w-full" style={{ gap: 16 }}>
                <View className="flex-1 h-px bg-[#C1C6D5]" />
                <Text className="text-[#414753] text-base font-semibold">Novo por aqui?</Text>
                <View className="flex-1 h-px bg-[#C1C6D5]" />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className="border-2 border-[#004E9F] rounded-xl w-full items-center justify-center"
                style={{ height: 48 }}
                onPress={() => router.push('/(auth)/register')}
                activeOpacity={0.8}
              >
                <Text className="text-[#004E9F] text-lg font-semibold">Criar Nova Conta</Text>
              </TouchableOpacity>

              {/* Footer links */}
              <View className="flex-row items-center" style={{ gap: 16, paddingTop: 24 }}>
                <TouchableOpacity>
                  <Text className="text-[#414753] text-base font-semibold">Termos</Text>
                </TouchableOpacity>
                <Text className="text-[#C1C6D5] text-base">•</Text>
                <TouchableOpacity>
                  <Text className="text-[#414753] text-base font-semibold">Privacidade</Text>
                </TouchableOpacity>
                <Text className="text-[#C1C6D5] text-base">•</Text>
                <TouchableOpacity>
                  <Text className="text-[#414753] text-base font-semibold">Ajuda</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
