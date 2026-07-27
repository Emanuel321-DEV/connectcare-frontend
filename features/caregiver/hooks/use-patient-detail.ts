import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_DETAIL } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PatientDetail, PatientHistoryEntry, PatientPrescription } from '../types/caregiver.types';
import type { Prescription } from '@/features/prescriptions/types/prescription.types';

// Não existe endpoint /patients/{id} no backend. GET /users/{id} retorna
// apenas o schema User (id, name, email, phone) — sem idade, adesão,
// prescrições ou histórico. Montamos o PatientDetail combinando:
//  - GET /users/{id}                       -> dados básicos do paciente
//  - GET /prescriptions?user_id={id}        -> prescrições ativas/inativas
//  - GET /users/{id}/dose-records            -> histórico e cálculo de adesão
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

function formatHistoryDate(isoDate: string): string {
  const date = new Date(isoDate);
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return `Hoje, ${time}`;
  if (isSameDay(date, yesterday)) return `Ontem, ${time}`;
  return `${date.toLocaleDateString('pt-BR')}, ${time}`;
}

function buildPrescriptions(prescriptions: Prescription[], doseRecords: RawDoseRecord[]): PatientPrescription[] {
  return prescriptions.map((p) => {
    const recentMissed = doseRecords.some((r) => r.prescription_id === p.id && r.status === 'MISSED');
    return {
      id: p.id,
      medication: `${p.medicament.name} ${p.medicament.dosage}`.trim(),
      schedule: p.medicament.time.join(', '),
      status: recentMissed ? 'alert' : 'ok',
    };
  });
}

function buildHistory(doseRecords: RawDoseRecord[]): PatientHistoryEntry[] {
  return doseRecords
    .filter((r) => r.status !== 'PENDING')
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      date: formatHistoryDate(r.scheduled_at),
      medication: r.medicament_name,
      taken: r.status === 'TAKEN',
    }));
}

async function buildPatientDetail(patientId: string, token?: string): Promise<PatientDetail> {
  const [user, rawPrescriptions, rawDoseRecords] = await Promise.all([
    apiClient.get<RawUser>(API_ROUTES.patients.detail(patientId), token),
    apiClient.get<Prescription[] | null>(API_ROUTES.prescriptions.list(patientId), token),
    apiClient.get<RawDoseRecord[] | null>(API_ROUTES.users.doseRecords(patientId), token),
  ]);
  // Backend retorna null (não []) quando a lista está vazia.
  const prescriptions = rawPrescriptions ?? [];
  const doseRecords = rawDoseRecords ?? [];

  const taken = doseRecords.filter((r) => r.status === 'TAKEN').length;
  const finished = doseRecords.filter((r) => r.status === 'TAKEN' || r.status === 'MISSED').length;
  const adherencePercentage = finished > 0 ? Math.round((taken / finished) * 100) : 100;

  return {
    id: user.id,
    name: user.name,
    // O backend não tem campo de idade no schema User; não há como calcular
    // isso a partir dos dados reais, então mantemos 0 em vez de inventar valor.
    age: 0,
    adherencePercentage,
    prescriptions: buildPrescriptions(prescriptions, doseRecords),
    history: buildHistory(doseRecords),
  };
}

export function usePatientDetail(patientId: string) {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setPatient(MOCK_PATIENT_DETAIL);
        return;
      }
      const detail = await buildPatientDetail(patientId, token ?? undefined);
      setPatient(detail);
    } catch (err) {
      // Erro real do backend — não mascarar com dado mockado.
      setPatient(null);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados do paciente.');
    } finally {
      setLoading(false);
    }
  }, [patientId, token]);

  useEffect(() => { fetchPatient(); }, [fetchPatient]);

  return { patient, loading, error };
}
