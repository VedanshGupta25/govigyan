
export interface Document {
  id: string;
  title: string;
  preview: string; // Base64 image data
  extractedText: string;
  createdAt: Date;
}
