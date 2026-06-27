import { useState } from 'react';
import { router } from 'expo-router';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useConfirmDose(_doseId: string, _prescriptionId: string) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  async function markAsTaken() {
    setLoading(true);
    try {
      if (!USE_MOCK) {
        await apiClient.post(API_ROUTES.prescriptions.doseConfirm(_prescriptionId, _doseId), {}, token ?? undefined);
      }
    } catch { /* silently fail */ }
    setLoading(false);
    router.back();
  }

  async function skipDose() {
    setLoading(true);
    try {
      if (!USE_MOCK) {
        await apiClient.post(API_ROUTES.prescriptions.doseSkip(_prescriptionId, _doseId), {}, token ?? undefined);
      }
    } catch { /* silently fail */ }
    setLoading(false);
    router.back();
  }

  return { loading, markAsTaken, skipDose };
}
