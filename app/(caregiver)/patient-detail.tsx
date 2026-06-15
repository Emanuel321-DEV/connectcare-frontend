import { useLocalSearchParams } from 'expo-router';
import PatientDetailScreen from '@/features/caregiver/screens/patient-detail.screen';

export default function PatientDetailRoute() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  return <PatientDetailScreen patientId={patientId ?? ''} />;
}
