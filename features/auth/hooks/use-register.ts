import { useState } from 'react';
import { router } from 'expo-router';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '../store/auth.store';
import type { LoginResponse, RegisterRequest } from '../types/auth.types';

type Role = 'patient' | 'caregiver';

export function useRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);

  async function register() {
    if (!role) { setError('Selecione seu perfil.'); return; }
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Preencha todos os campos.'); return; }
    if (!acceptedTerms) { setError('Aceite os termos para continuar.'); return; }
    if (password.length < 8) { setError('A senha deve ter no mínimo 8 caracteres.'); return; }

    setLoading(true);
    setError(null);

    try {
      // TODO: descomentar quando integração estiver pronta
      // const payload: RegisterRequest = { name: name.trim(), email: email.trim(), phone: phone.trim(), password };
      // const response = await apiClient.post<LoginResponse>('/auth/register', payload);
      // setAuth(response.token, response.user);

      setAuth('mock-token', { id: '1', name: name.trim(), email: email.trim(), phone: phone.trim() });
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return {
    name, setName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    role, setRole,
    showPassword, setShowPassword,
    acceptedTerms, setAcceptedTerms,
    loading, error,
    register,
  };
}
