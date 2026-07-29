import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLinkedPatients } from '@/features/caregiver/hooks/use-linked-patients';
import { PatientPicker, NoPatientsState } from '@/features/caregiver/components/patient-picker';
import AdherenceReportScreen from '@/features/reports/screens/adherence.screen';

export default function CaregiverReportsScreen() {
  const { patients, loading } = useLinkedPatients();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && patients.length > 0) setSelectedId(patients[0].id);
  }, [patients, selectedId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB] items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#004E9F" />
      </SafeAreaView>
    );
  }

  if (patients.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9FB]" edges={['top']}>
        <NoPatientsState />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <PatientPicker patients={patients} selectedId={selectedId} onSelect={setSelectedId} />
      {selectedId && <AdherenceReportScreen patientId={selectedId} />}
    </View>
  );
}
