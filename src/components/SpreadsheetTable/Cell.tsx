
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CellProps {
  value: string;
  onChange: (value: string) => void;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}

const Cell: React.FC<CellProps> = ({ 
  value, 
  onChange, 
  rowIndex, 
  colIndex, 
  isSelected,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  return (
    <div 
      className={cn(
        "border border-gray-200 min-w-[80px] h-8 flex items-center relative p-1 select-none",
        isSelected && "ring-2 ring-blue-400 bg-blue-50",
        !isEditing && "truncate"
      )}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      data-row={rowIndex}
      data-col={colIndex}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="w-full h-full outline-none bg-white"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="truncate">{value}</span>
      )}
    </div>
  );
};

export default Cell;
