import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePrescriptions } from '../hooks/use-prescriptions';
import type { Prescription } from '../types/prescription.types';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Ativas' },
  { key: 'inactive', label: 'Inativas' },
] as const;

export default function PrescriptionsListScreen() {
  const { prescriptions, filter, setFilter, search, setSearch, loading } = usePrescriptions();

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
      {/* Header */}
      <View className="bg-[#F9F9FB] border-b-2 border-[#C1C6D5] h-12 flex-row items-center justify-between px-5">
        <Text className="text-[#004E9F] text-base font-semibold">Minhas Prescrições</Text>
        <Ionicons name="notifications-outline" size={22} color="#004E9F" />
      </View>

      {/* Search */}
      <View className="px-5 py-3 bg-white border-b border-[#E8EAED]">
        <View className="bg-[#F3F3F6] border border-[#C1C6D5] rounded-xl flex-row items-center px-4" style={{ height: 44, gap: 8 }}>
          <Ionicons name="search-outline" size={18} color="#9AA0A6" />
          <TextInput
            className="flex-1 text-[#1A1C1E] text-base"
            placeholder="Buscar medicamento..."
            placeholderTextColor="#9AA0A6"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter tabs */}
      <View className="flex-row px-5 py-3 bg-white border-b border-[#E8EAED]" style={{ gap: 8 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            className="rounded-full px-4 py-1.5"
            style={{ backgroundColor: filter === f.key ? '#004E9F' : '#F3F3F6' }}
            onPress={() => setFilter(f.key)}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: filter === f.key ? 'white' : '#414753' }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#004E9F" style={{ marginTop: 40 }} />
        ) : prescriptions.length === 0 ? (
          <View className="items-center py-16" style={{ gap: 8 }}>
            <Ionicons name="document-outline" size={48} color="#C1C6D5" />
            <Text className="text-[#9AA0A6] text-lg text-center">Nenhuma prescrição encontrada.</Text>
          </View>
        ) : (
          prescriptions.map((p) => (
            <PrescriptionCard key={p.id} prescription={p} onPress={() => router.push({ pathname: '/prescription/[id]', params: { id: p.id } })} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PrescriptionCard({ prescription: p, onPress }: { prescription: Prescription; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-white border-2 border-[#C1C6D5] rounded-xl p-5 flex-row items-center justify-between"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1" style={{ gap: 14 }}>
        <View className="w-12 h-12 rounded-xl bg-[#D7E3FF] items-center justify-center">
          <Ionicons name="medical" size={24} color="#004E9F" />
        </View>
        <View className="flex-1" style={{ gap: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1C1E' }} numberOfLines={1}>
            {p.medicament.name}
          </Text>
          <Text className="text-[#414753] text-sm">{p.medicament.dosage} · {p.medicament.time.join(', ')}</Text>
          <Text className="text-[#9AA0A6] text-xs">{p.medicName}</Text>
        </View>
      </View>
      <View className="flex-row items-center" style={{ gap: 10 }}>
        <View style={{ backgroundColor: p.active ? '#E8F5E9' : '#F3F3F6', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: p.active ? '#34A853' : '#9AA0A6' }}>
            {p.active ? 'Ativa' : 'Inativa'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#C1C6D5" />
      </View>
    </TouchableOpacity>
  );
}
