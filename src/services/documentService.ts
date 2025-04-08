import { v4 as uuidv4 } from 'uuid';
import { Document, SpreadsheetDocument } from '@/types/document';
import { toast } from 'sonner';
import { SpreadsheetData } from './spreadsheetService';

// Constants
const DOCUMENTS_STORAGE_KEY = 'docuscan-documents';

// Mock function for text extraction - in a real app, this would use a real OCR service
export const extractTextFromImage = async (imageData: string): Promise<string> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would call an OCR API or use a library
  // For now, return a placeholder text
  return "This is extracted text from the document image. In a real implementation, this would be actual text extracted using OCR technology. The text would contain all the information visible in the document image that was captured or uploaded by the user.";
};

// Save document to local storage
export const saveDocument = (document: Document): void => {
  try {
    const existingDocuments = getDocuments();
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify([document, ...existingDocuments]));
  } catch (error) {
    console.error('Error saving document:', error);
    toast.error('Failed to save document');
  }
};

// Get all documents from local storage
export const getDocuments = (): Document[] => {
  try {
    const documents = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!documents) return [];
    
    const parsedDocuments = JSON.parse(documents);
    // Convert date strings back to Date objects
    return parsedDocuments.map((doc: any) => ({
      ...doc,
      createdAt: new Date(doc.createdAt)
    }));
  } catch (error) {
    console.error('Error getting documents:', error);
    toast.error('Failed to load documents');
    return [];
  }
};

// Get a single document by ID
export const getDocumentById = (id: string): Document | undefined => {
  const documents = getDocuments();
  const document = documents.find(doc => doc.id === id);
  
  if (!document) {
    return undefined;
  }
  
  return {
    ...document,
    createdAt: new Date(document.createdAt)
  };
};

// Delete a document by ID
export const deleteDocument = (id: string): void => {
  try {
    const documents = getDocuments();
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocuments));
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error('Failed to delete document');
  }
};

// Process a new document - extract text and save
export const processNewDocument = async (
  imageData: string, 
  title: string = `Document ${new Date().toLocaleString()}`
): Promise<Document> => {
  try {
    const extractedText = await extractTextFromImage(imageData);
    
    const newDocument: Document = {
      id: uuidv4(),
      title,
      preview: imageData,
      extractedText,
      createdAt: new Date()
    };
    
    saveDocument(newDocument);
    return newDocument;
  } catch (error) {
    console.error('Error processing document:', error);
    toast.error('Failed to process document');
    throw error;
  }
};

// Create a document entry for a spreadsheet
export const createSpreadsheetDocument = (spreadsheet: SpreadsheetData): SpreadsheetDocument => {
  const spreadsheetDoc: SpreadsheetDocument = {
    id: uuidv4(),
    title: spreadsheet.title,
    preview: '', // We'll use a placeholder icon
    extractedText: `Spreadsheet with ${spreadsheet.rows} rows and ${spreadsheet.columns} columns`,
    createdAt: spreadsheet.createdAt,
    type: 'spreadsheet',
    spreadsheetId: spreadsheet.id
  };
  
  saveDocument(spreadsheetDoc);
  return spreadsheetDoc;
};
