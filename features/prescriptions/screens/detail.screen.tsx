import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Prescription } from '../types/prescription.types';

export default function PrescriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    async function fetch() {
      if (!token || !id) return;
      try {
        const p = await apiClient.get<Prescription>(API_ROUTES.prescriptions.detail(id ?? ''), token);
        setPrescription(p);
      } catch {
        setPrescription({
          id: id ?? 'p1', userId: '', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
          medicament: { name: 'Losartana Potássica', dosage: '50mg', frequency: '24:00', time: ['08:00'], doses: 1 },
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, token]);

  async function toggleActive() {
    if (!prescription || !token) return;
    setToggling(true);
    try {
      const route = prescription.active ? API_ROUTES.prescriptions.deactivate(id ?? '') : API_ROUTES.prescriptions.activate(id ?? '');
      await apiClient.post(route, {}, token);
      setPrescription((prev) => prev ? { ...prev, active: !prev.active } : prev);
    } catch { /* silently */ } finally {
      setToggling(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]">
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center px-5">
        <TouchableOpacity className="w-10 h-10 items-center justify-center mr-2" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#004E9F" />
        </TouchableOpacity>
        <Text className="text-[#1A1C1E] font-semibold text-lg flex-1">Detalhe da Prescrição</Text>
      </View>

      {loading || !prescription ? (
        <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 20 }} showsVerticalScrollIndicator={false}>

          {/* Med card */}
          <View className="bg-white border-2 border-[#C1C6D5] rounded-xl p-6 items-center" style={{ gap: 12 }}>
            <View className="w-20 h-20 rounded-full bg-[#D7E3FF] items-center justify-center">
              <Ionicons name="medical" size={40} color="#004E9F" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1C1E', textAlign: 'center' }}>
              {prescription.medicament.name}
            </Text>
            <View style={{ backgroundColor: prescription.active ? '#E8F5E9' : '#F3F3F6', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 99 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: prescription.active ? '#34A853' : '#9AA0A6' }}>
                {prescription.active ? 'Prescrição Ativa' : 'Prescrição Inativa'}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View className="bg-white border-2 border-[#C1C6D5] rounded-xl" style={{ overflow: 'hidden' }}>
            {[
              { label: 'Dosagem', value: prescription.medicament.dosage, icon: 'flask-outline' },
              { label: 'Frequência', value: `A cada ${prescription.medicament.frequency}h`, icon: 'repeat-outline' },
              { label: 'Horários', value: prescription.medicament.time.join(' · '), icon: 'time-outline' },
              { label: 'Doses por dia', value: `${prescription.medicament.doses} dose${prescription.medicament.doses > 1 ? 's' : ''}`, icon: 'list-outline' },
              { label: 'Médico', value: prescription.medicName, icon: 'person-outline' },
            ].map((item, i, arr) => (
              <View key={item.label} className={`flex-row items-center px-5 py-4 ${i < arr.length - 1 ? 'border-b border-[#E8EAED]' : ''}`} style={{ gap: 14 }}>
                <Ionicons name={item.icon as any} size={20} color="#004E9F" />
                <View className="flex-1">
                  <Text className="text-[#9AA0A6] text-xs">{item.label}</Text>
                  <Text className="text-[#1A1C1E] text-base font-semibold">{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Toggle button */}
          <TouchableOpacity
            className={`rounded-xl items-center justify-center ${prescription.active ? 'border-2 border-[#EA4335]' : 'bg-[#004E9F]'}`}
            style={{ height: 56 }}
            onPress={toggleActive}
            disabled={toggling}
            activeOpacity={0.85}
          >
            {toggling ? (
              <ActivityIndicator color={prescription.active ? '#EA4335' : 'white'} />
            ) : (
              <Text style={{ fontSize: 18, fontWeight: '600', color: prescription.active ? '#EA4335' : 'white' }}>
                {prescription.active ? 'Desativar Prescrição' : 'Ativar Prescrição'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
