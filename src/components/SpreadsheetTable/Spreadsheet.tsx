import React, { useState, useEffect, useRef, useCallback } from 'react';
import Toolbar from './Toolbar';
import Cell from './Cell';
import SpreadsheetHeader from './SpreadsheetHeader';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { saveSpreadsheet, SpreadsheetData } from '@/services/spreadsheetService';
import { createSpreadsheetDocument } from '@/services/documentService';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SpreadsheetProps {
  initialRows?: number;
  initialColumns?: number;
  initialData?: SpreadsheetData | null;
  spreadsheetTitle?: string;
}

interface CellData {
  value: string;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  initialRows = 10, 
  initialColumns = 8,
  initialData = null,
  spreadsheetTitle = `Spreadsheet ${new Date().toLocaleDateString()}`
}) => {
  const [rows, setRows] = useState(initialData?.rows || initialRows);
  const [columns, setColumns] = useState(initialData?.columns || initialColumns);
  const [data, setData] = useState<CellData[][]>(initialData?.data || []);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [copiedCell, setCopiedCell] = useState<{ value: string } | null>(null);
  const [title, setTitle] = useState(initialData?.title || spreadsheetTitle);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(initialData?.id || '');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(initialData?.lastModified || null);
  const [needsSaving, setNeedsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Initialize data grid
  useEffect(() => {
    if (data.length === 0) {
      // Initialize with empty data
      const initialData = Array.from({ length: rows }, () => 
        Array.from({ length: columns }, () => ({ value: '' }))
      );
      setData(initialData);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !needsSaving) return;
    
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set a new timer for autosave
    autoSaveTimerRef.current = window.setTimeout(() => {
      handleSaveSpreadsheet();
      autoSaveTimerRef.current = null;
    }, 3000); // Autosave after 3 seconds of inactivity
    
    // Cleanup timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [data, autoSaveEnabled, needsSaving, title]);

  // Handle cell value change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array.from({ length: columns }, () => ({ value: '' }));
    }
    newData[rowIndex][colIndex] = { value };
    setData(newData);
    setNeedsSaving(true);
  };

  // Add a new row
  const handleAddRow = () => {
    const newData = [...data];
    newData.push(Array.from({ length: columns }, () => ({ value: '' })));
    setData(newData);
    setRows(rows + 1);
    setNeedsSaving(true);
    toast.success("Row added");
  };

  // Add a new column
  const handleAddColumn = () => {
    if (columns >= 26) {
      toast.error("Maximum number of columns reached (A-Z)");
      return;
    }
    
    const newData = data.map(row => {
      const newRow = [...row];
      newRow.push({ value: '' });
      return newRow;
    });
    
    setData(newData);
    setColumns(columns + 1);
    setNeedsSaving(true);
    toast.success("Column added");
  };

  // Delete a row
  const handleDeleteRow = () => {
    if (rows <= 1) {
      toast.error("Cannot delete the last row");
      return;
    }

    if (selectedCell === null) {
      toast.error("Select a row first");
      return;
    }

    const newData = [...data];
    newData.splice(selectedCell.row, 1);
    setData(newData);
    setRows(rows - 1);
    setSelectedCell(null);
    setNeedsSaving(true);
    toast.success("Row deleted");
  };

  // Delete a column
  const handleDeleteColumn = () => {
    if (columns <= 1) {
      toast.error("Cannot delete the last column");
      return;
    }

    if (selectedCell === null) {
      toast.error("Select a column first");
      return;
    }

    const newData = data.map(row => {
      const newRow = [...row];
      newRow.splice(selectedCell.col, 1);
      return newRow;
    });
    
    setData(newData);
    setColumns(columns - 1);
    setSelectedCell(null);
    setNeedsSaving(true);
    toast.success("Column deleted");
  };

  // Copy cell
  const handleCopy = () => {
    if (!selectedCell) {
      toast.error("Select a cell first");
      return;
    }
    
    const { row, col } = selectedCell;
    if (data[row] && data[row][col]) {
      setCopiedCell({ value: data[row][col].value });
      toast.success("Cell copied");
    }
  };

  // Paste cell
  const handlePaste = () => {
    if (!selectedCell || !copiedCell) {
      toast.error(selectedCell ? "Copy a cell first" : "Select a cell first");
      return;
    }
    
    const { row, col } = selectedCell;
    handleCellChange(row, col, copiedCell.value);
    toast.success("Cell pasted");
  };

  // Handle import CSV
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').filter(row => row.trim() !== '');
        const parsedData: CellData[][] = [];

        const maxColumns = Math.max(...rows.map(row => row.split(',').length));
        const actualColumns = Math.min(maxColumns, 26); // Limit to 26 columns (A-Z)
        
        rows.forEach(row => {
          const cells = row.split(',');
          const rowData: CellData[] = [];
          
          for (let i = 0; i < actualColumns; i++) {
            rowData.push({ value: cells[i] ? cells[i].replace(/^"|"$/g, '') : '' });
          }
          
          parsedData.push(rowData);
        });

        setData(parsedData);
        setRows(parsedData.length);
        setColumns(actualColumns);
        toast.success("CSV data imported successfully");
      } catch (error) {
        toast.error("Failed to import CSV data");
        console.error("CSV import error:", error);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the file");
    };

    reader.readAsText(file);
  };

  // Export to CSV
  const handleExport = () => {
    // Convert data to CSV
    const csvContent = data.map(row => 
      row.map(cell => {
        // Escape commas and quotes
        const value = cell.value || '';
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    ).join('\n');
    
    // Create file and download
    const element = document.createElement('a');
    const file = new Blob([csvContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = `spreadsheet-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Spreadsheet exported to CSV");
  };

  // Save spreadsheet
  const handleSaveSpreadsheet = useCallback(() => {
    if (data.length === 0) return;
    
    try {
      const currentDate = new Date();
      const spreadsheetData: SpreadsheetData = {
        id: spreadsheetId || uuidv4(),
        title,
        data,
        rows,
        columns,
        lastModified: currentDate,
        createdAt: spreadsheetId ? (initialData?.createdAt || currentDate) : currentDate
      };
      
      saveSpreadsheet(spreadsheetData);
      setSpreadsheetId(spreadsheetData.id);
      setLastSaved(currentDate);
      setNeedsSaving(false);
      
      // Create document entry if it's a new spreadsheet
      if (!initialData) {
        createSpreadsheetDocument(spreadsheetData);
      }
      
      toast.success("Spreadsheet saved");
    } catch (error) {
      console.error('Error saving spreadsheet:', error);
      toast.error('Failed to save spreadsheet');
    }
  }, [data, rows, columns, title, spreadsheetId, initialData]);

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setNeedsSaving(true);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-md shadow-sm h-full bg-white">
      <div className="flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Input
            value={title}
            onChange={handleTitleChange}
            className="w-64 border-gray-300 focus-visible:ring-offset-0"
            placeholder="Untitled Spreadsheet"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveSpreadsheet}
            className={needsSaving ? "border-red-300 text-red-600 hover:bg-red-50" : ""}
          >
            <Save className="h-4 w-4 mr-2" />
            {needsSaving ? "Save*" : "Save"}
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mr-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="autosave" 
              checked={autoSaveEnabled} 
              onCheckedChange={setAutoSaveEnabled} 
            />
            <Label htmlFor="autosave">Autosave</Label>
          </div>
          
          {lastSaved && (
            <span className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <Toolbar 
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onImport={handleImport}
        onExport={handleExport}
        canDeleteRow={rows > 1 && selectedCell !== null}
        canDeleteColumn={columns > 1 && selectedCell !== null}
      />
      
      <ScrollArea className="h-full">
        <div>
          <SpreadsheetHeader columns={columns} />
          
          <div className="spreadsheet-body">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex">
                {/* Row header */}
                <div className="w-10 h-8 bg-gray-100 border border-gray-300 flex items-center justify-center font-medium">
                  {rowIndex + 1}
                </div>
                
                {/* Cells */}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Cell
                    key={`${rowIndex}-${colIndex}`}
                    value={data[rowIndex]?.[colIndex]?.value || ''}
                    onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                    onSelect={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {/* Hidden file input for CSV import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        style={{ display: 'none' }}
        onChange={processImport}
      />
    </div>
  );
};

export default Spreadsheet;
