
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
  bgColor?: string;
}

interface CellProps {
  value: string;
  style?: CellStyle;
  onChange: (value: string) => void;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  onSelect: () => void;
}

const Cell: React.FC<CellProps> = ({ 
  value, 
  style,
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

  const getCellStyles = () => {
    if (!style) return '';
    
    let styles = '';
    
    if (style.align === 'center') styles += ' text-center';
    else if (style.align === 'right') styles += ' text-right';
    else styles += ' text-left';
    
    if (style.bold) styles += ' font-bold';
    if (style.italic) styles += ' italic';
    if (style.underline) styles += ' underline';
    
    return styles;
  };

  const cellTextStyles = getCellStyles();

  return (
    <div 
      className={cn(
        "border border-gray-200 min-w-[80px] h-8 flex items-center relative p-1 select-none",
        isSelected && "ring-2 ring-blue-400 bg-blue-50 z-10",
        !isEditing && "truncate",
        style?.bgColor && `bg-[${style.bgColor}]`
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
        <span 
          className={cn("truncate w-full", cellTextStyles)}
          style={style?.color ? { color: style.color } : undefined}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default Cell;
