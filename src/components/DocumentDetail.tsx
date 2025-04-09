
import React from 'react';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Document } from '@/types/document';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface DocumentDetailProps {
  document: Document;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ document: documentItem, onBack, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const confirmDelete = () => {
    onDelete(documentItem.id);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onBack} className="hover:scale-105 transition-transform duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-gray-500">Scanned {timeAgo}</div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
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
          <Button variant="outline" size="sm" onClick={handleDownload} className="hover:scale-105 transition-transform duration-200">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:border-red-300 hover:bg-red-50 hover:scale-105 transition-all duration-200"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{documentItem.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentDetail;
