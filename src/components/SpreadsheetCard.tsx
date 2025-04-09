
import React, { useState } from 'react';
import { FileSpreadsheet, Calendar, Grid, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SpreadsheetMetadata } from '@/types/spreadsheet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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

interface SpreadsheetCardProps {
  spreadsheet: SpreadsheetMetadata;
  onDelete?: (id: string) => void;
}

const SpreadsheetCard: React.FC<SpreadsheetCardProps> = ({ spreadsheet, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, lastModified, rowCount, columnCount } = spreadsheet;
  const timeAgo = formatDistanceToNow(new Date(lastModified), { addSuffix: true });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast.success(`"${name}" deleted successfully`);
    }
  };

  return (
    <>
      <div 
        className="doc-card group cursor-pointer animate-fade-in hover:translate-y-[-4px] transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/spreadsheet/${id}`} className="block">
          <div className="doc-card-preview bg-gradient-to-br from-secondary/10 to-primary/10 relative overflow-hidden rounded-t-lg">
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              <FileSpreadsheet 
                className={`h-16 w-16 text-secondary mb-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`} 
              />
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-secondary h-2 rounded-full transition-all duration-500" 
                  style={{ width: isHovered ? '90%' : '70%' }}
                ></div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-md">
              <FileSpreadsheet className="h-4 w-4 text-secondary" />
            </div>
            {onDelete && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="doc-card-content p-4">
            <h3 className="font-medium text-navy-800 mb-1 line-clamp-1 group-hover:text-navy-900 transition-colors">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
              <Grid className="h-3 w-3" />
              <span>{rowCount}×{columnCount} cells</span>
            </div>
            <div className="flex items-center mt-3 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </Link>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="animate-fade-in animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the spreadsheet "{name}".
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

export default SpreadsheetCard;
