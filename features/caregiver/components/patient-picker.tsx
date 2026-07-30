import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Patient {
  id: string;
  name: string;
}

export function PatientPicker({
  patients,
  selectedId,
  onSelect,
}: {
  patients: Patient[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (patients.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-white border-b border-[#E8EAED]"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
    >
      {patients.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <TouchableOpacity
            key={p.id}
            onPress={() => onSelect(p.id)}
            className="rounded-full px-4 py-1.5"
            style={{ backgroundColor: isSelected ? '#004E9F' : '#F3F3F6' }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: isSelected ? 'white' : '#414753' }}>
              {p.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function NoPatientsState() {
  return (
    <View className="flex-1 items-center justify-center px-6" style={{ gap: 8 }}>
      <Text className="text-[#9AA0A6] text-lg text-center">
        Você ainda não tem pacientes vinculados.
      </Text>
    </View>
  );
}
