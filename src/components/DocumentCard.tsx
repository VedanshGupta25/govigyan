
import React, { useState } from 'react';
import { FileText, Calendar, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
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

interface DocumentCardProps {
  id: string;
  title: string;
  preview: string;
  extractedText: string;
  createdAt: Date;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  preview,
  extractedText,
  createdAt,
  onClick,
  onDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const truncatedText = extractedText.length > 100 
    ? `${extractedText.substring(0, 100)}...` 
    : extractedText;
  
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <>
      <div 
        className="doc-card cursor-pointer animate-fade-in group hover:translate-y-[-4px] transition-all duration-300"
        onClick={() => onClick(id)}
      >
        <div className="doc-card-preview relative">
          <img 
            src={preview} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-md">
            <FileText className="h-4 w-4 text-navy-700" />
          </div>
          {onDelete && (
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-full bg-white/80 hover:bg-red-50 hover:text-red-500"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="doc-card-content">
          <h3 className="font-medium text-navy-800 mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{truncatedText}</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{title}".
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
    </>
  );
};

export default DocumentCard;
