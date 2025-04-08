
export interface Document {
  id: string;
  title: string;
  preview: string; // Base64 image data
  extractedText: string;
  createdAt: Date;
  type?: 'document' | 'spreadsheet';
}

export interface SpreadsheetDocument extends Document {
  type: 'spreadsheet';
  spreadsheetId: string; // Reference to the actual spreadsheet data
}
