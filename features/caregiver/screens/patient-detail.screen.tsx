import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePatientDetail } from '../hooks/use-patient-detail';

export default function PatientDetailScreen({ patientId }: { patientId: string }) {
  const { patient, loading } = usePatientDetail(patientId);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center px-4" style={{ gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="#004E9F" />
        </TouchableOpacity>
        <Text className="text-[#004E9F] text-base font-semibold">Detalhes do Paciente</Text>
      </View>

      {loading || !patient ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#004E9F" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Patient info */}
          <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-5 flex-row items-center" style={{ gap: 16, marginBottom: 24 }}>
            <View className="w-16 h-16 rounded-full bg-[#E6F4FE] border-2 border-[#004E9F] items-center justify-center">
              <Ionicons name="person" size={28} color="#004E9F" />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1C1E' }}>{patient.name}</Text>
              <Text className="text-[#414753] text-sm">{patient.age} anos</Text>
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#34A853' }} />
                <Text className="text-[#414753] text-sm">Adesão {patient.adherencePercentage}%</Text>
              </View>
            </View>
          </View>

          {/* Prescriptions */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E', marginBottom: 12 }}>Prescrições Ativas</Text>
          <View style={{ gap: 10, marginBottom: 24 }}>
            {patient.prescriptions.map((p) => (
              <View key={p.id} className="bg-white border-2 border-[#C1C6D5] rounded-xl p-4 flex-row items-center justify-between">
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A1C1E' }}>{p.medication}</Text>
                  <Text className="text-[#414753] text-sm">{p.schedule}</Text>
                </View>
                <Ionicons
                  name={p.status === 'ok' ? 'checkmark-circle' : 'warning'}
                  size={22}
                  color={p.status === 'ok' ? '#34A853' : '#FBBC04'}
                />
              </View>
            ))}
          </View>

          {/* Recent history */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E', marginBottom: 12 }}>Histórico Recente</Text>
          <View style={{ gap: 10 }}>
            {patient.history.map((h) => (
              <View key={h.id} className="bg-white border-2 border-[#C1C6D5] rounded-xl p-4 flex-row items-center" style={{ gap: 12 }}>
                <View
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: h.taken ? '#ECFDF5' : '#FEF3F2',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Ionicons name={h.taken ? 'checkmark' : 'close'} size={18} color={h.taken ? '#34A853' : '#EA4335'} />
                </View>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A1C1E' }}>{h.medication}</Text>
                  <Text className="text-[#414753] text-xs">{h.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
