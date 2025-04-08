
import React from 'react';

interface SpreadsheetHeaderProps {
  columns: number;
}

const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({ columns }) => {
  return (
    <div className="flex sticky top-0 z-10">
      <div className="w-10 h-8 bg-secondary/20 border border-gray-300 flex items-center justify-center shadow-sm">
        {/* Corner cell */}
      </div>
      {Array.from({ length: columns }).map((_, index) => (
        <div 
          key={index} 
          className="min-w-[80px] h-8 bg-secondary/20 border border-gray-300 flex items-center justify-center font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/30"
        >
          {String.fromCharCode(65 + index)}
        </div>
      ))}
    </div>
  );
};

export default SpreadsheetHeader;
