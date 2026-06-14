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
import { useSchedule } from '../hooks/use-schedule';
import type { DoseItem, ScheduleSection } from '../types/schedule.types';

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function ScheduleScreen() {
  const { sections, loading, selectedDate, setSelectedDate } = useSchedule();

  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const dateLabel = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const formatted = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] text-base font-semibold">CareConnect</Text>
        <Ionicons name="notifications-outline" size={22} color="#004E9F" />
      </View>

      {/* Week selector */}
      <View className="bg-white border-b-2 border-[#C1C6D5] px-4 py-3">
        <View className="flex-row justify-between">
          {weekDates.map((date, i) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            return (
              <TouchableOpacity
                key={i}
                className="items-center"
                style={{ gap: 4 }}
                onPress={() => setSelectedDate(new Date(date))}
              >
                <Text style={{ fontSize: 12, color: '#9AA0A6' }}>{WEEK_DAYS[i]}</Text>
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: isSelected ? '#004E9F' : isToday ? '#D7E3FF' : 'transparent',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: isSelected ? '700' : '400', color: isSelected ? 'white' : '#1A1C1E' }}>
                    {date.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1C1E' }}>{formatted}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 40 }} />
        ) : sections.length === 0 ? (
          <View className="items-center py-16" style={{ gap: 8 }}>
            <Ionicons name="calendar-outline" size={48} color="#C1C6D5" />
            <Text className="text-[#9AA0A6] text-lg text-center">Nenhuma dose para este dia.</Text>
          </View>
        ) : (
          sections.map((section) => (
            <ScheduleSectionView key={section.label} section={section} />
          ))
        )}

        <TouchableOpacity
          className="border-2 border-[#004E9F] rounded-xl items-center justify-center"
          style={{ height: 48 }}
          activeOpacity={0.8}
        >
          <Text className="text-[#004E9F] font-semibold text-base">Ver Agenda Completa</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScheduleSectionView({ section }: { section: ScheduleSection }) {
  return (
    <View style={{ gap: 12 }}>
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1C1E' }}>{section.label}</Text>
        <Text className="text-[#9AA0A6] text-sm">({section.timeRange})</Text>
        <View className="flex-1 h-px bg-[#E8EAED]" />
      </View>
      {section.doses.map((dose) => (
        <DoseScheduleCard key={dose.id} dose={dose} />
      ))}
    </View>
  );
}

function DoseScheduleCard({ dose }: { dose: DoseItem }) {
  const statusConfig = {
    taken: { color: '#34A853', bg: '#E8F5E9', label: 'Tomado', icon: 'checkmark-circle' as const },
    pending: { color: '#004E9F', bg: '#EEF2FF', label: 'Pendente', icon: 'ellipse-outline' as const },
    skipped: { color: '#EA4335', bg: '#FFEBEE', label: 'Pulado', icon: 'close-circle-outline' as const },
  };
  const s = statusConfig[dose.status];

  return (
    <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-4 flex-row items-center justify-between">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={s.icon} size={24} color={s.color} />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1C1E' }}>{dose.medicamentName}</Text>
          <Text className="text-[#414753] text-sm">{dose.dosage}</Text>
          <Text className="text-[#9AA0A6] text-xs">{dose.scheduledTime}</Text>
        </View>
      </View>
      {dose.status === 'pending' && (
        <TouchableOpacity
          className="bg-[#004E9F] rounded-lg px-4 py-2"
          onPress={() => router.push({ pathname: '/confirm-dose', params: { doseId: dose.id, prescriptionId: dose.prescriptionId, medicamentName: dose.medicamentName, dosage: dose.dosage, scheduledTime: dose.scheduledTime } })}
        >
          <Text className="text-white text-sm font-semibold">Tomar</Text>
        </TouchableOpacity>
      )}
      {dose.status !== 'pending' && (
        <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: s.color }}>{s.label}</Text>
        </View>
      )}
    </View>
  );
}
