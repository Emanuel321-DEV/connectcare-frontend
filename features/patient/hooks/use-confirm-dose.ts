import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useConfirmDose(doseRecordId: string) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);

  async function markAsTaken() {
    setLoading(true);
    try {
      if (!USE_MOCK) {
        await apiClient.post(API_ROUTES.prescriptions.doseConfirm(doseRecordId), {}, token ?? undefined);
      }
      router.back();
    } catch (err) {
      Alert.alert('Erro ao confirmar dose', err instanceof Error ? err.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function skipDose() {
    setLoading(true);
    try {
      if (!USE_MOCK) {
        await apiClient.post(API_ROUTES.prescriptions.doseSkip(doseRecordId), {}, token ?? undefined);
      }
      router.back();
    } catch (err) {
      Alert.alert('Erro ao registrar dose perdida', err instanceof Error ? err.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return { loading, markAsTaken, skipDose };
}
