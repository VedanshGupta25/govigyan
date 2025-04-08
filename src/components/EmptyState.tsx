
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onScan: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onScan }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 animate-fade-in">
      <div className="bg-navy-100 p-3 rounded-full mb-4">
        <FileText className="h-8 w-8 text-navy-700" />
      </div>
      <h3 className="text-lg font-medium text-navy-800 mb-2">No documents yet</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        Capture your first document by taking a photo or uploading an image
      </p>
      <Button onClick={onScan} className="bg-teal-600 hover:bg-teal-700">
        Scan a document
      </Button>
    </div>
  );
};

export default EmptyState;
