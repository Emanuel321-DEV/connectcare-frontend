import { useState } from 'react';
import { router } from 'expo-router';
// import { apiClient } from '@/shared/services/api.client';
// import { useAuthStore } from '@/features/auth/store/auth.store';

export function useConfirmDose(_doseId: string, _prescriptionId: string) {
  const [loading, setLoading] = useState(false);

  async function markAsTaken() {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   await apiClient.post(`/prescriptions/${_prescriptionId}/doses/${_doseId}/confirm`, {}, token ?? undefined);
    // } catch { /* silently fail */ }
    setLoading(false);
    router.back();
  }

  async function skipDose() {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   await apiClient.post(`/prescriptions/${_prescriptionId}/doses/${_doseId}/skip`, {}, token ?? undefined);
    // } catch { /* silently fail */ }
    setLoading(false);
    router.back();
  }

  return { loading, markAsTaken, skipDose };
}
