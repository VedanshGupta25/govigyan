
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  acceptTypes?: string;
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  acceptTypes = "image/*", 
  buttonText = "Upload Image" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Check file type based on accept parameter
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if (acceptTypes.includes('image/*') && !isImage && !isPdf) {
      toast.error('Please select an image or PDF file');
      return;
    } else if (acceptTypes === 'application/pdf' && !isPdf) {
      toast.error('Please select a PDF file');
      return;
    } else if (!isImage && !isPdf) {
      toast.error('Unsupported file type');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB');
      return;
    }
    
    onFileSelected(file);
    
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center w-full">
      <Button 
        variant="ghost" 
        onClick={() => fileInputRef.current?.click()}
        className="w-full justify-start px-2 py-1.5 h-auto"
      >
        <Upload className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptTypes}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
