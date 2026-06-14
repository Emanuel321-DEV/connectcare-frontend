import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useConfirmDose } from '../hooks/use-confirm-dose';

export default function ConfirmDoseScreen() {
  const { doseId, prescriptionId, medicamentName, dosage, scheduledTime } = useLocalSearchParams<{
    doseId: string;
    prescriptionId: string;
    medicamentName: string;
    dosage: string;
    scheduledTime: string;
  }>();

  const { loading, markAsTaken, skipDose } = useConfirmDose(doseId ?? '', prescriptionId ?? '');

  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center px-5">
        <TouchableOpacity className="w-10 h-10 items-center justify-center mr-2" onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={24} color="#004E9F" />
        </TouchableOpacity>
        <Text className="text-[#004E9F] text-base font-semibold flex-1 text-center">CareConnect</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 items-center justify-center px-5" style={{ gap: 40 }}>
        {/* Title section */}
        <View className="items-center" style={{ gap: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#1A1C1E' }}>Confirmar Dose</Text>
          <Text className="text-[#414753] text-lg text-center">
            São {scheduledTime ?? timeStr}, é hora da sua dose.
          </Text>
        </View>

        {/* Medication card */}
        <View className="bg-white border-2 border-[#C1C6D5] rounded-xl w-full p-6 items-center" style={{ gap: 16 }}>
          <View className="w-20 h-20 rounded-full bg-[#D7E3FF] items-center justify-center">
            <Ionicons name="medical" size={40} color="#004E9F" />
          </View>
          <View className="items-center" style={{ gap: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1C1E' }}>{medicamentName ?? 'Losartana'}</Text>
            <Text className="text-[#414753] text-lg">{dosage ?? '10mg'}</Text>
          </View>
          <View className="flex-row items-center bg-[#F3F3F6] rounded-full px-4 py-2" style={{ gap: 6 }}>
            <Ionicons name="time-outline" size={16} color="#414753" />
            <Text className="text-[#414753] text-base">{scheduledTime ?? timeStr}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="w-full" style={{ gap: 12 }}>
          <TouchableOpacity
            className="bg-[#004E9F] rounded-xl flex-row items-center justify-center"
            style={{ height: 56, gap: 10 }}
            onPress={markAsTaken}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#A3F69C" />
                <Text className="text-white text-lg font-semibold">Marcar como Tomado</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="border-2 border-[#C1C6D5] rounded-xl items-center justify-center bg-white"
            style={{ height: 56 }}
            onPress={skipDose}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-[#414753] text-lg font-semibold">Tomar mais tarde</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center py-2" onPress={() => router.back()}>
            <Text className="text-[#9AA0A6] text-base">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
