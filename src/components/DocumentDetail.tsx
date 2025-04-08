
import React from 'react';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Document } from '@/types/document';

interface DocumentDetailProps {
  document: Document;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ document: documentItem, onBack, onDelete }) => {
  const timeAgo = formatDistanceToNow(documentItem.createdAt, { addSuffix: true });
  
  const handleDownload = () => {
    // Create a text file with the extracted content
    const element = document.createElement('a');
    const file = new Blob([documentItem.extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${documentItem.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-gray-500">Scanned {timeAgo}</div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-navy-900">{documentItem.title}</h2>
        </div>
        
        <div className="aspect-[3/4] bg-gray-100 relative">
          <img 
            src={documentItem.preview} 
            alt={documentItem.title}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-navy-700 mb-2">Extracted Text</h3>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-80 overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap">{documentItem.extractedText}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-between">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:border-red-300"
            onClick={() => onDelete(documentItem.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
