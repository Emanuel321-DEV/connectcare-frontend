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

// Compara se um timestamp ISO cai no mesmo dia-calendário local (fuso do
// dispositivo) que uma data de referência. Não usar `isoString.startsWith(dateStr)`
// com `toISOString()` pra isso — `toISOString()` sempre devolve a data em UTC,
// que já é o dia seguinte no Brasil a partir de ~21h locais.
export function isSameLocalDay(isoDateTime: string, reference: Date): boolean {
  const d = new Date(isoDateTime);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}
