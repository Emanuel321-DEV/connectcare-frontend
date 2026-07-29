import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCaregiverHome, type PatientSummary } from '../hooks/use-caregiver-home';
import { AppHeader } from '@/shared/components/app-header';

export default function CaregiverHomeScreen() {
  const { patients, loading, error, user, refetch } = useCaregiverHome();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = user?.name?.split(' ')[0] ?? 'Cuidador';

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      <AppHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} colors={['#1B6D24']} tintColor="#1B6D24" />}
      >

        {/* Greeting */}
        <View style={{ marginBottom: 24, gap: 4 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>
            {greeting}, {firstName}
          </Text>
          <Text className="text-[#414753] text-lg">
            Você pode gerir as doses dos seus pacientes.
          </Text>
        </View>

        {/* Monitoring title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1C1E' }}>Meus Pacientes</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 40 }} />
        ) : error ? (
          <View className="items-center py-16" style={{ gap: 8 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#EA4335" />
            <Text className="text-[#EA4335] text-base text-center px-6">
              {error ?? 'Não foi possível carregar seus pacientes.'}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}

            <TouchableOpacity
              className="border-2 border-[#004E9F] rounded-xl flex-row items-center justify-center"
              style={{ height: 48, gap: 8 }}
              onPress={() => router.push('/accept-invite')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#004E9F" />
              <Text className="text-[#004E9F] font-semibold text-base">Adicionar Paciente</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PatientCard({ patient }: { patient: PatientSummary }) {
  const hasAlert = !!patient.alertMessage;
  const adherenceColor = patient.adherencePercentage >= 80 ? '#34A853' : patient.adherencePercentage >= 60 ? '#FBBC04' : '#EA4335';

  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl overflow-hidden">
      {hasAlert && (
        <View className="bg-[#FEF3F2] border-b border-[#FECACA] px-4 py-2 flex-row items-center" style={{ gap: 8 }}>
          <Ionicons name="warning-outline" size={16} color="#EA4335" />
          <Text className="text-[#EA4335] text-sm font-semibold">{patient.alertMessage}</Text>
        </View>
      )}
      <View className="p-5 flex-row items-center justify-between">
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View className="w-12 h-12 rounded-full bg-[#EDEEF0] border-2 border-[#C1C6D5] items-center justify-center">
            <Ionicons name="person" size={20} color="#414753" />
          </View>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E' }}>{patient.name}</Text>
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: adherenceColor }} />
              <Text style={{ fontSize: 14, color: '#414753' }}>Adesão {patient.adherencePercentage}%</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="border-2 border-[#004E9F] rounded-lg px-4 py-2"
          onPress={() => router.push({ pathname: '/patient-detail', params: { patientId: patient.id } })}
        >
          <Text className="text-[#004E9F] text-sm font-semibold">Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
