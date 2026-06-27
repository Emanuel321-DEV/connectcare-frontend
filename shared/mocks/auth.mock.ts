import type { LoginResponse } from '@/features/auth/types/auth.types';

export const MOCK_AUTH_RESPONSE: LoginResponse = {
  token: 'mock-token',
  user: { id: '1', name: 'Dona Maria', email: 'maria@exemplo.com', phone: '' },
};
