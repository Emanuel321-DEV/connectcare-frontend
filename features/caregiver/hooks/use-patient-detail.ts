import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_DETAIL } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PatientDetail } from '../types/caregiver.types';

export function usePatientDetail(patientId: string) {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setPatient(MOCK_PATIENT_DETAIL);
        return;
      }
      const response = await apiClient.get<PatientDetail>(API_ROUTES.patients.detail(patientId), token ?? undefined);
      setPatient(response);
    } catch {
      setPatient(MOCK_PATIENT_DETAIL);
    } finally {
      setLoading(false);
    }
  }, [patientId, token]);

  useEffect(() => { fetchPatient(); }, [fetchPatient]);

  return { patient, loading };
}
