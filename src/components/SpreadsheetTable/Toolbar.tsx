
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Minus, Copy, Clipboard, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, 
  Download, Redo, Undo
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
  canDeleteRow,
  canDeleteColumn
}) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-white border-b border-gray-200">
      <Button variant="outline" size="sm" onClick={onAddRow} title="Add row">
        <Plus className="h-4 w-4 mr-1" />
        Row
      </Button>
      
      <Button variant="outline" size="sm" onClick={onAddColumn} title="Add column">
        <Plus className="h-4 w-4 mr-1" />
        Column
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDeleteRow} 
        disabled={!canDeleteRow}
        title="Delete row"
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
      >
        <Minus className="h-4 w-4 mr-1" />
        Column
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" onClick={onCopy} title="Copy">
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" onClick={onPaste} title="Paste">
        <Clipboard className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" title="Align left">
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Align center">
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Align right">
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" title="Bold">
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Italic">
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" size="sm" title="Underline">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="outline" size="sm" onClick={onExport} title="Export to CSV">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Toolbar;
