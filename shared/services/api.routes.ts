export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },

  users: {
    home: (userId: string) => `/users/${userId}/home`,
    schedule: (userId: string, date: string) => `/users/${userId}/schedule?date=${date}`,
    patients: (userId: string) => `/users/${userId}/patients`,
    adherence: (userId: string, period: string) => `/users/${userId}/adherence?period=${period}`,
    notifications: (userId: string) => `/users/${userId}/notifications`,
    notificationRead: (userId: string, notifId: string) => `/users/${userId}/notifications/${notifId}/read`,
    doseRecords: (userId: string) => `/users/${userId}/dose-records`,
    detail: (userId: string) => `/users/${userId}`,
    // Lista todos os usuários (não há endpoint de busca por email no backend;
    // usado pra localizar um cuidador pelo email filtrando no cliente).
    list: () => `/users`,
    // Pacientes vinculados a um cuidador (ver docs/api.yaml do backend).
    charges: (caregiverId: string) => `/users/${caregiverId}/charges`,
    // Cuidadores vinculados a um paciente (ver docs/api.yaml do backend).
    caregivers: (patientId: string) => `/users/${patientId}/caregivers`,
    // Convites (pendentes e histórico) recebidos/criados por este usuário.
    invitations: (userId: string) => `/users/${userId}/invitations`,
  },

  prescriptions: {
    list: (userId: string, active?: boolean) =>
      active === undefined
        ? `/prescriptions?user_id=${userId}`
        : `/prescriptions?user_id=${userId}&active=${active}`,
    detail: (id: string) => `/prescriptions/${id}`,
    activate: (id: string) => `/prescriptions/${id}/activate`,
    deactivate: (id: string) => `/prescriptions/${id}/deactivate`,
    doseConfirm: (doseRecordId: string) => `/dose-records/${doseRecordId}/confirm`,
    doseSkip: (doseRecordId: string) => `/dose-records/${doseRecordId}/miss`,
  },

  patients: {
    // Não existe endpoint /patients/{id} no backend; usamos GET /users/{id}
    // (schema User) e compomos o restante do PatientDetail no frontend.
    detail: (patientId: string) => `/users/${patientId}`,
  },

  invites: {
    // Rota real do backend é /invitations (não /invites). Criar um convite já
    // exige conhecer o caregiver_id de antemão — não existe "código público
    // redimível depois".
    create: () => `/invitations`,
    accept: (token: string) => `/invitations/${token}/accept`,
    reject: (token: string) => `/invitations/${token}/reject`,
  },
};
