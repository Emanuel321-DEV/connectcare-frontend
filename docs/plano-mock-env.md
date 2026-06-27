# Plano de Ação — Controle de Mock via Variável de Ambiente

## Contexto

Atualmente todos os dados do app são estáticos. O padrão em vigor em todos os hooks é:

```ts
// TODO: descomentar quando integração estiver pronta
// const response = await apiClient.get(...)
setData(MOCK_DATA) // ← hardcoded direto no hook
```

**Problemas identificados:**
- Dados mock embutidos dentro dos hooks de negócio (acopla lógica de negócio a fixture)
- Nenhuma variável de ambiente controla o chaveamento mock ↔ real
- 8 hooks afetados espalhados por 6 features
- `EXPO_PUBLIC_API_URL` já existe no `api.client.ts` mas nenhum `.env` está presente no projeto

---

## Fase 1 — Infraestrutura de ambiente

### Arquivos a criar

**`.env`**
```env
EXPO_PUBLIC_USE_MOCK=true
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

**`.env.example`** (para documentar para outros devs)
```env
EXPO_PUBLIC_USE_MOCK=true        # true = dados mock | false = API real
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

**`shared/config/env.ts`**
```ts
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
export const API_URL  = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';
```

> Todas as leituras de `process.env` ficam centralizadas aqui. Nenhum outro arquivo importa `process.env` diretamente.

---

## Fase 2 — Centralizar os dados mock

Criar o diretório `shared/mocks/` com um arquivo por domínio. Os dados são **movidos** (não copiados) dos hooks para cá.

| Arquivo a criar | Dados atualmente em |
|---|---|
| `shared/mocks/patient.mock.ts` | `features/patient/hooks/use-patient-home.ts` |
| `shared/mocks/caregiver.mock.ts` | `features/caregiver/hooks/use-caregiver-home.ts` |
| `shared/mocks/schedule.mock.ts` | `features/patient/hooks/use-schedule.ts` |
| `shared/mocks/prescriptions.mock.ts` | `features/prescriptions/hooks/use-prescriptions.ts` |
| `shared/mocks/reports.mock.ts` | `features/reports/hooks/use-adherence.ts` |
| `shared/mocks/notifications.mock.ts` | `features/notifications/hooks/use-notifications.ts` |
| `shared/mocks/invites.mock.ts` | `features/invites/hooks/use-accept-invite.ts` + `use-generate-invite.ts` |
| `shared/mocks/index.ts` | barrel de re-export de todos os mocks |

Cada arquivo segue o padrão:
```ts
// shared/mocks/patient.mock.ts
import type { PatientHomeData } from '@/features/patient/types/schedule.types';

export const MOCK_PATIENT_HOME: PatientHomeData = {
  adherencePercentage: 85,
  takenCount: 2,
  pendingCount: 1,
  skippedCount: 0,
  todayDoses: [ /* ... */ ],
};
```

---

## Fase 3 — Adaptar os 8 hooks

Cada hook recebe a lógica de chaveamento no início do `useEffect`. O bloco de API real (hoje comentado) é descomentado e colocado no branch `else`.

**Padrão a aplicar:**
```ts
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_HOME } from '@/shared/mocks';

useEffect(() => {
  const load = async () => {
    if (USE_MOCK) {
      setData(MOCK_PATIENT_HOME);
      setLoading(false);
      return;
    }
    try {
      const response = await apiClient.get<PatientHomeData>('/patient/home');
      setData(response);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

### Hooks a modificar

| Hook | Caminho |
|---|---|
| `use-patient-home` | `features/patient/hooks/use-patient-home.ts` |
| `use-caregiver-home` | `features/caregiver/hooks/use-caregiver-home.ts` |
| `use-schedule` | `features/patient/hooks/use-schedule.ts` |
| `use-prescriptions` | `features/prescriptions/hooks/use-prescriptions.ts` |
| `use-adherence` | `features/reports/hooks/use-adherence.ts` |
| `use-accept-invite` | `features/invites/hooks/use-accept-invite.ts` |
| `use-generate-invite` | `features/invites/hooks/use-generate-invite.ts` |
| `use-notifications` | `features/notifications/hooks/use-notifications.ts` |

---

## Fase 4 — Ajuste no `api.client.ts`

Substituir a URL hardcoded pela constante centralizada:

```ts
// antes
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';

// depois
import { API_URL } from '@/shared/config/env';
const BASE_URL = API_URL;
```

---

## Resumo do impacto

| Critério | Antes | Depois |
|---|---|---|
| Chaveamento mock/real | Nenhum | `EXPO_PUBLIC_USE_MOCK=true/false` |
| Localização dos mocks | Dentro dos hooks | `shared/mocks/` isolados |
| Config de ambiente | Espalhada / inexistente | `shared/config/env.ts` |
| Arquivos criados | — | ~9 novos |
| Arquivos modificados | — | ~9 existentes |

---

## Como usar após implementação

Para rodar com dados mock:
```env
EXPO_PUBLIC_USE_MOCK=true
```

Para rodar contra a API real:
```env
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_URL=https://careconnect.lmezencio.dev/api/v1
```

Reiniciar o servidor Expo após qualquer alteração nas variáveis de ambiente.
