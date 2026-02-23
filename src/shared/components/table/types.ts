export type ColumnDataType = 'date' | 'number' | 'text' | 'boolean';

export interface TableColumnDefinition {
  field: string | Array<string>;
  header: string;
  type: ColumnDataType;
  label?: () => { label: string; severity: string };
}
