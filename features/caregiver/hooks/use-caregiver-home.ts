import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENTS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PatientSummary } from '../types/caregiver.types';

export type { PatientSummary };

// Não existe endpoint /home (ou /patients) para o cuidador no backend.
// Buscamos os pacientes vinculados via GET /users/{caregiverId}/charges
// (ver docs/api.yaml, schema User) e, para cada um, GET /users/{patientId}/dose-records
// para calcular adesão e doses pendentes no frontend.
interface RawUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface RawDoseRecord {
  id: string;
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  confirmed_at: string | null;
}

async function buildPatientSummary(patient: RawUser, token?: string): Promise<PatientSummary> {
  let records: RawDoseRecord[] = [];
  try {
    records = (await apiClient.get<RawDoseRecord[] | null>(API_ROUTES.users.doseRecords(patient.id), token)) ?? [];
  } catch {
    records = [];
  }

  const taken = records.filter((r) => r.status === 'TAKEN').length;
  const finished = records.filter((r) => r.status === 'TAKEN' || r.status === 'MISSED').length;
  const adherencePercentage = finished > 0 ? Math.round((taken / finished) * 100) : 100;
  const pendingDoses = records.filter((r) => r.status === 'PENDING').length;

  const alertMessage = pendingDoses > 0 ? `${pendingDoses} dose${pendingDoses > 1 ? 's' : ''} pendente${pendingDoses > 1 ? 's' : ''}` : undefined;

  return {
    id: patient.id,
    name: patient.name,
    adherencePercentage,
    pendingDoses,
    alertMessage,
  };
}

export function useCaregiverHome() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setPatients(MOCK_PATIENTS);
        return;
      }
      const charges = await apiClient.get<RawUser[] | null>(
        API_ROUTES.users.charges(user?.id ?? ''),
        token ?? undefined
      );
      const summaries = await Promise.all(
        (charges ?? []).map((patient) => buildPatientSummary(patient, token ?? undefined))
      );
      setPatients(summaries);
    } catch (err) {
      // Erro real do backend — não mascarar com dado mockado.
      setPatients([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar seus pacientes.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return { patients, loading, error, user, refetch: fetchPatients };
}
