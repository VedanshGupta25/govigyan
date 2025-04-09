
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
      <div className="doc-card group cursor-pointer animate-fade-in hover:translate-y-[-4px] transition-all duration-300">
        <Link to={`/spreadsheet/${id}`} className="block">
          <div className="doc-card-preview bg-gradient-to-br from-secondary/10 to-primary/10">
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              <FileSpreadsheet className="h-16 w-16 text-secondary mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-md">
              <FileSpreadsheet className="h-4 w-4 text-secondary" />
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
            <h3 className="font-medium text-navy-800 mb-1 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Grid className="h-3 w-3" />
              <span>{rowCount}×{columnCount} cells</span>
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </Link>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="animate-fade-in">
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
