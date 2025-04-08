
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface SpreadsheetData {
  id: string;
  title: string;
  data: { value: string }[][];
  rows: number;
  columns: number;
  lastModified: Date;
  createdAt: Date;
}

const SPREADSHEETS_STORAGE_KEY = 'docuscan-spreadsheets';

export const saveSpreadsheet = (spreadsheet: SpreadsheetData): void => {
  try {
    const existingSpreadsheets = getSpreadsheets();
    const existingIndex = existingSpreadsheets.findIndex(s => s.id === spreadsheet.id);
    
    let updatedSpreadsheets = [...existingSpreadsheets];
    
    if (existingIndex >= 0) {
      // Update existing spreadsheet
      updatedSpreadsheets[existingIndex] = spreadsheet;
    } else {
      // Add new spreadsheet
      updatedSpreadsheets = [spreadsheet, ...existingSpreadsheets];
    }
    
    localStorage.setItem(SPREADSHEETS_STORAGE_KEY, JSON.stringify(updatedSpreadsheets));
  } catch (error) {
    console.error('Error saving spreadsheet:', error);
    toast.error('Failed to save spreadsheet');
  }
};

export const getSpreadsheets = (): SpreadsheetData[] => {
  try {
    const spreadsheets = localStorage.getItem(SPREADSHEETS_STORAGE_KEY);
    if (!spreadsheets) return [];
    
    const parsedSpreadsheets = JSON.parse(spreadsheets);
    // Convert date strings back to Date objects
    return parsedSpreadsheets.map((sheet: any) => ({
      ...sheet,
      lastModified: new Date(sheet.lastModified),
      createdAt: new Date(sheet.createdAt)
    }));
  } catch (error) {
    console.error('Error getting spreadsheets:', error);
    toast.error('Failed to load spreadsheets');
    return [];
  }
};

export const getSpreadsheetById = (id: string): SpreadsheetData | undefined => {
  const spreadsheets = getSpreadsheets();
  return spreadsheets.find(sheet => sheet.id === id);
};

export const deleteSpreadsheet = (id: string): void => {
  try {
    const spreadsheets = getSpreadsheets();
    const updatedSpreadsheets = spreadsheets.filter(sheet => sheet.id !== id);
    localStorage.setItem(SPREADSHEETS_STORAGE_KEY, JSON.stringify(updatedSpreadsheets));
  } catch (error) {
    console.error('Error deleting spreadsheet:', error);
    toast.error('Failed to delete spreadsheet');
  }
};

export const createNewSpreadsheet = (
  title: string = `Spreadsheet ${new Date().toLocaleDateString()}`,
  rows: number = 15,
  columns: number = 10
): SpreadsheetData => {
  // Create empty data grid
  const data = Array.from({ length: rows }, () => 
    Array.from({ length: columns }, () => ({ value: '' }))
  );
  
  const newSpreadsheet: SpreadsheetData = {
    id: uuidv4(),
    title,
    data,
    rows,
    columns,
    lastModified: new Date(),
    createdAt: new Date()
  };
  
  saveSpreadsheet(newSpreadsheet);
  return newSpreadsheet;
};
