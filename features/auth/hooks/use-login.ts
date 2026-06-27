import { useState } from 'react';
import { router } from 'expo-router';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_AUTH_RESPONSE } from '@/shared/mocks';
import { useAuthStore } from '../store/auth.store';
import type { LoginResponse } from '../types/auth.types';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);

  async function login() {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        setAuth(MOCK_AUTH_RESPONSE.token, { ...MOCK_AUTH_RESPONSE.user, email: email.trim() });
      } else {
        const response = await apiClient.post<LoginResponse>(API_ROUTES.auth.login, {
          email: email.trim(),
          password,
        });
        setAuth(response.token, response.user);
      }
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    login,
  };
}
