import type { ColumnDataType, TableColumnDefinition } from './types';

export function getNestedValue(obj: any, path: string | string[]): any {
  // If path is a string, use it directly
  if (typeof path === 'string') {
    return obj[path];
  }

  // If path is an array, traverse the object
  if (Array.isArray(path)) {
    return path.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  return null;
}

export function formatValue(value: ColumnDataType, column: TableColumnDefinition): any {
  if (!value) return value;

  switch (column.type) {
    case 'date':
      return formatDateValue(value);
    case 'boolean':
      return value ? 'Ano' : 'Ne';
    default:
      return value;
  }
}

function formatDateValue(value: ColumnDataType): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  // Format to DD.MM.YYYY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
