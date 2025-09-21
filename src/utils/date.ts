export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function sortBy<T>(array: T[], sortProperty: keyof T, order: 1 | -1 = -1): T[] {
  return [...array].sort((a, b) => {
    // null/undefined
    const valueA = a[sortProperty] ?? null;
    const valueB = b[sortProperty] ?? null;

    // date
    if (valueA instanceof Date || typeof valueA === 'string') {
      const processedA =
        valueA instanceof Date ? valueA.getTime() : new Date(valueA as string).getTime();
      const processedB =
        valueB instanceof Date ? valueB.getTime() : new Date(valueB as string).getTime();

      return order * (processedB - processedA);
    }

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return order * -1;
    if (valueB == null) return order * 1;

    if (valueA < valueB) return order * -1;
    if (valueA > valueB) return order * 1;
    return 0;
  });
}
