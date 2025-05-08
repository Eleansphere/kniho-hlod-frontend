export type ColumnDataType = 'date' | 'number' | 'text' | 'binary';

export interface TableColumnDefinition {
    field: string | Array<string>;
    header: string;
    type: ColumnDataType;
}
