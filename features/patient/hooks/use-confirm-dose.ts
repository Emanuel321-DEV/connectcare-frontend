import { useState } from 'react';
import { router } from 'expo-router';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useConfirmDose(doseId: string, prescriptionId: string) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  async function markAsTaken() {
    setLoading(true);
    try {
      await apiClient.post(`/prescriptions/${prescriptionId}/doses/${doseId}/confirm`, {}, token ?? undefined);
      router.back();
    } catch {
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function skipDose() {
    setLoading(true);
    try {
      await apiClient.post(`/prescriptions/${prescriptionId}/doses/${doseId}/skip`, {}, token ?? undefined);
      router.back();
    } catch {
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return { loading, markAsTaken, skipDose };
}
