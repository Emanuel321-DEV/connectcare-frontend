// O backend interpreta o campo `time` da prescrição ("HH:MM") como UTC, não
// como horário de Brasília — bug conhecido em nextScheduleTime (pdsi1,
// redis_scheduler.go). Até isso ser corrigido no backend, as prescrições de
// teste são cadastradas com +3h manualmente pra compensar. Essa função desfaz
// esse ajuste só pra exibição, mostrando o horário real esperado pelo usuário.
// Remover quando o backend passar a interpretar `time` como horário local.
export function utcClockToBrazilTime(time: string): string {
  const [hh, mm] = time.split(':');
  const hours = ((parseInt(hh, 10) - 3) + 24) % 24;
  return `${String(hours).padStart(2, '0')}:${mm}`;
}
