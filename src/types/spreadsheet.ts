
export interface SpreadsheetMetadata {
  id: string;
  name: string;
  lastModified: string;
  rowCount: number;
  columnCount: number;
}

export interface CellData {
  value: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right';
    color?: string;
    bgColor?: string;
  };
}
