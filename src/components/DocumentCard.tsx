
import React from 'react';
import { FileText, Calendar, FileSpreadsheet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface DocumentCardProps {
  id: string;
  title: string;
  preview: string;
  extractedText: string;
  createdAt: Date;
  onClick: (id: string) => void;
  type?: 'document' | 'spreadsheet';
  spreadsheetId?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  preview,
  extractedText,
  createdAt,
  onClick,
  type = 'document',
  spreadsheetId,
}) => {
  const truncatedText = extractedText.length > 100 
    ? `${extractedText.substring(0, 100)}...` 
    : extractedText;
  
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  const handleClick = (e: React.MouseEvent) => {
    if (type === 'spreadsheet') {
      // Don't use the default onClick for spreadsheets
      e.stopPropagation();
    } else {
      onClick(id);
    }
  };

  return (
    <div 
      className={`doc-card animate-fade-in ${type === 'spreadsheet' ? 'border-secondary/30 hover:border-secondary' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <div className="doc-card-preview">
        {type === 'spreadsheet' ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary/5">
            <FileSpreadsheet className="h-16 w-16 text-secondary/50" />
          </div>
        ) : (
          <img 
            src={preview} 
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2 bg-white/80 p-1 rounded-md">
          {type === 'spreadsheet' ? (
            <FileSpreadsheet className="h-4 w-4 text-secondary" />
          ) : (
            <FileText className="h-4 w-4 text-navy-700" />
          )}
        </div>
      </div>
      <div className="doc-card-content">
        <h3 className="font-medium text-navy-800 mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{truncatedText}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
          
          {type === 'spreadsheet' && (
            <Link 
              to={`/spreadsheet?id=${spreadsheetId}`}
              className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-md hover:bg-secondary/20 transition-colors"
            >
              Open
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
