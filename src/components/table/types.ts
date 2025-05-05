export type ColumnDataType = 'date' | 'number' | 'text';

export interface TableColumnDefinition {
    field: string | Array<string>;
    header: string;
    type: ColumnDataType;
}
