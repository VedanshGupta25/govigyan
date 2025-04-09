
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Minus, Copy, Clipboard, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  Download, Import, Redo, Undo, Save
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onExport: () => void;
  onImport: () => void;
  onAlignChange?: (align: 'left' | 'center' | 'right') => void;
  onFormatChange?: (format: 'bold' | 'italic' | 'underline', value?: boolean) => void;
  canDeleteRow: boolean;
  canDeleteColumn: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onCopy,
  onPaste,
  onExport,
  onImport,
  onAlignChange,
  onFormatChange,
  canDeleteRow,
  canDeleteColumn
}) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 overflow-x-auto">
      <ToolbarButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onAddRow} className="text-sm font-medium transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Row
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add row</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onAddColumn} className="text-sm font-medium transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Column
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add column</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDeleteRow} 
              disabled={!canDeleteRow}
              className="text-sm font-medium transition-colors"
            >
              <Minus className="h-4 w-4 mr-1" />
              Row
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete row</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDeleteColumn}
              disabled={!canDeleteColumn}
              className="text-sm font-medium transition-colors"
            >
              <Minus className="h-4 w-4 mr-1" />
              Column
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete column</TooltipContent>
        </Tooltip>
      </ToolbarButtonGroup>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onCopy} className="transition-colors hover:bg-gray-100">
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onPaste} className="transition-colors hover:bg-gray-100">
              <Clipboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Paste</TooltipContent>
        </Tooltip>
      </ToolbarButtonGroup>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAlignChange && onAlignChange('left')}
              className="transition-colors hover:bg-gray-100"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align left</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAlignChange && onAlignChange('center')}
              className="transition-colors hover:bg-gray-100"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align center</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAlignChange && onAlignChange('right')}
              className="transition-colors hover:bg-gray-100"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align right</TooltipContent>
        </Tooltip>
      </ToolbarButtonGroup>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onFormatChange && onFormatChange('bold')}
              className="transition-colors hover:bg-gray-100"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onFormatChange && onFormatChange('italic')}
              className="transition-colors hover:bg-gray-100"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onFormatChange && onFormatChange('underline')}
              className="transition-colors hover:bg-gray-100"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
      </ToolbarButtonGroup>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onImport} className="text-sm font-medium text-secondary hover:bg-secondary/10">
              <Import className="h-4 w-4 mr-1" />
              Import
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import CSV</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onExport} className="text-sm font-medium text-primary hover:bg-primary/10">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export to CSV</TooltipContent>
        </Tooltip>
      </ToolbarButtonGroup>
    </div>
  );
};

const ToolbarButtonGroup: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="flex items-center gap-1">
      {children}
    </div>
  );
};

export default Toolbar;
