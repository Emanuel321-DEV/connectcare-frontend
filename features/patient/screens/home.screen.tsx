import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePatientHome } from '../hooks/use-patient-home';
import type { DoseItem } from '../types/schedule.types';

export default function PatientHomeScreen() {
  const { data, loading, user } = usePatientHome();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = user?.name?.split(' ')[0] ?? 'Paciente';

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] text-base font-semibold">CareConnect</Text>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.push('/invite')}>
            <Ionicons name="person-add-outline" size={22} color="#004E9F" />
          </TouchableOpacity>
          <View className="w-9 h-9 rounded-full border-2 border-[#004E9F] bg-[#D7E3FF] items-center justify-center">
            <Text className="text-[#004E9F] font-bold text-sm">{user?.name?.charAt(0).toUpperCase() ?? 'P'}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>{greeting}, {firstName}</Text>
          <Text className="text-[#414753] text-lg">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>

        {loading || !data ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 40 }} />
        ) : (
          <View style={{ gap: 20 }}>
            {/* Adherence card */}
            <View className="bg-[#004E9F] rounded-xl p-6 flex-row items-center justify-between">
              <View style={{ gap: 4 }}>
                <Text className="text-[#D7E3FF] text-base">Resumo de Adesão</Text>
                <Text style={{ fontSize: 40, fontWeight: '700', color: 'white' }}>{data.adherencePercentage}%</Text>
                <Text className="text-[#D7E3FF] text-sm">nos últimos 7 dias</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <AdherenceRing percentage={data.adherencePercentage} />
              </View>
            </View>

            {/* Progress today */}
            <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-5" style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E' }}>Progresso de hoje</Text>
              <View style={{ gap: 8 }}>
                <View className="flex-row justify-between">
                  <View className="items-center" style={{ gap: 2 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#34A853' }}>{data.takenCount}</Text>
                    <Text className="text-[#414753] text-sm">Tomado</Text>
                  </View>
                  <View className="items-center" style={{ gap: 2 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#004E9F' }}>{data.pendingCount}</Text>
                    <Text className="text-[#414753] text-sm">Pendente</Text>
                  </View>
                  <View className="items-center" style={{ gap: 2 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#EA4335' }}>{data.skippedCount}</Text>
                    <Text className="text-[#414753] text-sm">Puladas</Text>
                  </View>
                </View>
                <View className="h-2 bg-[#E8EAED] rounded-full overflow-hidden">
                  <View
                    className="h-full bg-[#34A853] rounded-full"
                    style={{ width: `${data.takenCount / (data.takenCount + data.pendingCount + data.skippedCount) * 100}%` }}
                  />
                </View>
              </View>
            </View>

            {/* Today doses */}
            <View style={{ gap: 12 }}>
              <View className="flex-row items-center justify-between">
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E' }}>Doses de Hoje</Text>
                <Text className="text-[#004E9F] font-semibold text-sm">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</Text>
              </View>
              {data.todayDoses.map((dose) => (
                <DoseCard key={dose.id} dose={dose} />
              ))}
            </View>

            {/* Ver agenda completa */}
            <TouchableOpacity
              className="border-2 border-[#004E9F] rounded-xl items-center justify-center"
              style={{ height: 48 }}
              onPress={() => router.push('/(tabs)/schedule')}
              activeOpacity={0.8}
            >
              <Text className="text-[#004E9F] text-base font-semibold">Ver Agenda Completa</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DoseCard({ dose }: { dose: DoseItem }) {
  const statusConfig = {
    taken: { color: '#34A853', bg: '#E8F5E9', label: 'Tomado', icon: 'checkmark-circle' as const },
    pending: { color: '#004E9F', bg: '#E3F2FD', label: 'Pendente', icon: 'time-outline' as const },
    skipped: { color: '#EA4335', bg: '#FFEBEE', label: 'Pulado', icon: 'close-circle-outline' as const },
  };
  const s = statusConfig[dose.status];

  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-4 flex-row items-center justify-between">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={s.icon} size={22} color={s.color} />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1C1E' }}>{dose.medicamentName}</Text>
          <Text className="text-[#414753] text-sm">{dose.dosage} · {dose.scheduledTime}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: s.color }}>{s.label}</Text>
      </View>
    </View>
  );
}

function AdherenceRing({ percentage }: { percentage: number }) {
  return (
    <View style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 6, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 5, borderColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>{percentage}%</Text>
      </View>
    </View>
  );
}
