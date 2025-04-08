
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Minus, Copy, Clipboard, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  Download, Import, Redo, Undo
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onExport: () => void;
  onImport: () => void;
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
  canDeleteRow,
  canDeleteColumn
}) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 overflow-x-auto">
      <Button variant="outline" size="sm" onClick={onAddRow} title="Add row" className="text-sm font-medium transition-colors">
        <Plus className="h-4 w-4 mr-1" />
        Row
      </Button>
      
      <Button variant="outline" size="sm" onClick={onAddColumn} title="Add column" className="text-sm font-medium transition-colors">
        <Plus className="h-4 w-4 mr-1" />
        Column
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDeleteRow} 
        disabled={!canDeleteRow}
        title="Delete row"
        className="text-sm font-medium transition-colors"
      >
        <Minus className="h-4 w-4 mr-1" />
        Row
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDeleteColumn}
        disabled={!canDeleteColumn}
        title="Delete column"
        className="text-sm font-medium transition-colors"
      >
        <Minus className="h-4 w-4 mr-1" />
        Column
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" onClick={onCopy} title="Copy" className="transition-colors hover:bg-gray-100">
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" onClick={onPaste} title="Paste" className="transition-colors hover:bg-gray-100">
        <Clipboard className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" title="Align left" className="transition-colors hover:bg-gray-100">
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Align center" className="transition-colors hover:bg-gray-100">
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Align right" className="transition-colors hover:bg-gray-100">
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" title="Bold" className="transition-colors hover:bg-gray-100">
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Italic" className="transition-colors hover:bg-gray-100">
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Underline" className="transition-colors hover:bg-gray-100">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" onClick={onImport} title="Import CSV" className="text-sm font-medium text-secondary hover:bg-secondary/10">
        <Import className="h-4 w-4 mr-1" />
        Import
      </Button>

      <Button variant="outline" size="sm" onClick={onExport} title="Export to CSV" className="text-sm font-medium text-primary hover:bg-primary/10">
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
    </div>
  );
};

export default Toolbar;
