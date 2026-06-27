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
    invitesPending: (userId: string) => `/users/${userId}/invites/pending`,
    invite: (userId: string) => `/users/${userId}/invite`,
  },

  prescriptions: {
    list: (userId: string, active?: boolean) =>
      active === undefined
        ? `/prescriptions?user_id=${userId}`
        : `/prescriptions?user_id=${userId}&active=${active}`,
    detail: (id: string) => `/prescriptions/${id}`,
    activate: (id: string) => `/prescriptions/${id}/activate`,
    deactivate: (id: string) => `/prescriptions/${id}/deactivate`,
    doseConfirm: (prescriptionId: string, doseId: string) =>
      `/prescriptions/${prescriptionId}/doses/${doseId}/confirm`,
    doseSkip: (prescriptionId: string, doseId: string) =>
      `/prescriptions/${prescriptionId}/doses/${doseId}/skip`,
  },

  patients: {
    detail: (patientId: string) => `/patients/${patientId}`,
  },

  invites: {
    validate: '/invites/validate',
    accept: (inviteId: string) => `/invites/${inviteId}/accept`,
    reject: (inviteId: string) => `/invites/${inviteId}/reject`,
  },
};
