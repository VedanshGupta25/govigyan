
import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  id: string;
  title: string;
  preview: string;
  extractedText: string;
  createdAt: Date;
  onClick: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  preview,
  extractedText,
  createdAt,
  onClick,
}) => {
  const truncatedText = extractedText.length > 100 
    ? `${extractedText.substring(0, 100)}...` 
    : extractedText;
  
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div 
      className="doc-card cursor-pointer animate-fade-in"
      onClick={() => onClick(id)}
    >
      <div className="doc-card-preview">
        <img 
          src={preview} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-md">
          <FileText className="h-4 w-4 text-navy-700" />
        </div>
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
  );
};

export default DocumentCard;
