import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdherence } from '../hooks/use-adherence';
import type { MedicationAdherence, ReportPeriod } from '../types/report.types';

const PERIODS: { key: ReportPeriod; label: string }[] = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '1 mês' },
];

export default function AdherenceReportScreen() {
  const { report, period, setPeriod, loading } = useAdherence();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] font-semibold text-base">Relatório de Aderência</Text>
        <Ionicons name="share-outline" size={22} color="#414753" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <View className="flex-row bg-[#F3F3F6] rounded-xl p-1 mb-6" style={{ gap: 4 }}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              className="flex-1 items-center justify-center rounded-lg"
              style={{ height: 40, backgroundColor: period === p.key ? 'white' : 'transparent' }}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={{ fontSize: 16, fontWeight: period === p.key ? '700' : '400', color: period === p.key ? '#004E9F' : '#414753' }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading || !report ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 60 }} />
        ) : (
          <View style={{ gap: 24 }}>
            {/* Overall */}
            <View className="bg-[#004E9F] rounded-xl p-6 items-center" style={{ gap: 16 }}>
              <Text className="text-[#D7E3FF] text-base">Adesão Geral</Text>
              <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                <ProgressCircle percentage={report.overallPercentage} size={120} />
              </View>
              <Text className="text-[#D7E3FF] text-sm">
                {period === '7d' ? 'Últimos 7 dias' : 'Último mês'}
              </Text>
            </View>

            {/* Per medication */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E' }}>Por Medicamento</Text>
              {report.byMedication.map((med) => (
                <MedAdherenceCard key={med.prescriptionId} med={med} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MedAdherenceCard({ med }: { med: MedicationAdherence }) {
  const color = med.percentage >= 80 ? '#34A853' : med.percentage >= 60 ? '#FBBC04' : '#EA4335';

  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-5" style={{ gap: 12 }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1" style={{ gap: 10 }}>
          <View className="w-10 h-10 rounded-lg bg-[#D7E3FF] items-center justify-center">
            <Ionicons name="medical" size={18} color="#004E9F" />
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1C1E' }} numberOfLines={1}>{med.medicamentName}</Text>
            <Text className="text-[#9AA0A6] text-xs">{med.dosage}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '700', color }}>{med.percentage}%</Text>
      </View>
      <View className="h-2 bg-[#E8EAED] rounded-full overflow-hidden">
        <View style={{ height: '100%', width: `${med.percentage}%`, backgroundColor: color, borderRadius: 99 }} />
      </View>
      <Text className="text-[#9AA0A6] text-xs">{med.taken} de {med.scheduled} doses tomadas</Text>
    </View>
  );
}

function ProgressCircle({ percentage, size }: { percentage: number; size: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 10, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size - 24, height: size - 24, borderRadius: (size - 24) / 2, borderWidth: 8, borderColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: 'white' }}>{percentage}%</Text>
      </View>
    </View>
  );
}
