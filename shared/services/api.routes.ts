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
    invitesPending: (userId: string) => `/users/${userId}/invites/pending`,
    invite: (userId: string) => `/users/${userId}/invite`,
    detail: (userId: string) => `/users/${userId}`,
    // Pacientes vinculados a um cuidador (ver docs/api.yaml do backend).
    charges: (caregiverId: string) => `/users/${caregiverId}/charges`,
    // Cuidadores vinculados a um paciente (ver docs/api.yaml do backend).
    caregivers: (patientId: string) => `/users/${patientId}/caregivers`,
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
    validate: '/invites/validate',
    accept: (inviteId: string) => `/invites/${inviteId}/accept`,
    reject: (inviteId: string) => `/invites/${inviteId}/reject`,
  },
};
