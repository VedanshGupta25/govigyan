
import React from 'react';

interface SpreadsheetHeaderProps {
  columns: number;
}

const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({ columns }) => {
  return (
    <div className="flex">
      <div className="w-10 h-8 bg-gray-100 border border-gray-300 flex items-center justify-center">
        {/* Corner cell */}
      </div>
      {Array.from({ length: columns }).map((_, index) => (
        <div 
          key={index} 
          className="min-w-[80px] h-8 bg-gray-100 border border-gray-300 flex items-center justify-center font-medium"
        >
          {String.fromCharCode(65 + index)}
        </div>
      ))}
    </div>
  );
};

export default SpreadsheetHeader;
