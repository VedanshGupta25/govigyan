
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Toolbar from './Toolbar';
import Cell from './Cell';
import SpreadsheetHeader from './SpreadsheetHeader';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SpreadsheetProps {
  initialRows?: number;
  initialColumns?: number;
  spreadsheetId?: string;
  spreadsheetName?: string;
  onSave?: (id: string, name: string, data: CellData[][]) => void;
}

interface CellData {
  value: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right';
    color?: string;
    bgColor?: string;
  };
}

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  initialRows = 10, 
  initialColumns = 8,
  spreadsheetId,
  spreadsheetName = 'Untitled Spreadsheet',
  onSave 
}) => {
  const [rows, setRows] = useState(initialRows);
  const [columns, setColumns] = useState(initialColumns);
  const [data, setData] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [copiedCell, setCopiedCell] = useState<{ value: string; style?: CellData['style'] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [id] = useState<string>(spreadsheetId || uuidv4());
  const [name, setName] = useState<string>(spreadsheetName);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize data grid
  useEffect(() => {
    // Check if we have existing data in localStorage
    const savedData = localStorage.getItem(`spreadsheet-data-${id}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        setRows(parsedData.length);
        setColumns(Math.max(...parsedData.map((row: CellData[]) => row.length)));
      } catch (error) {
        console.error("Failed to load saved spreadsheet data:", error);
        initializeEmptyData();
      }
    } else {
      initializeEmptyData();
    }
  }, [id]);

  const initializeEmptyData = () => {
    const initialData = Array.from({ length: rows }, () => 
      Array.from({ length: columns }, () => ({ value: '' }))
    );
    setData(initialData);
  };

  // Autosave functionality
  useEffect(() => {
    if (isAutosaveEnabled) {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
      
      autosaveTimerRef.current = setInterval(() => {
        saveSpreadsheet();
      }, AUTOSAVE_INTERVAL);
    } else if (autosaveTimerRef.current) {
      clearInterval(autosaveTimerRef.current);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [isAutosaveEnabled, data, name, id]);

  // Save functionality
  const saveSpreadsheet = useCallback(() => {
    try {
      localStorage.setItem(`spreadsheet-data-${id}`, JSON.stringify(data));
      localStorage.setItem(`spreadsheet-name-${id}`, name);
      
      // Save the spreadsheet ID to a list of all spreadsheets
      const spreadsheetList = JSON.parse(localStorage.getItem('spreadsheet-list') || '[]');
      if (!spreadsheetList.includes(id)) {
        spreadsheetList.push(id);
        localStorage.setItem('spreadsheet-list', JSON.stringify(spreadsheetList));
      }
      
      // Also save metadata
      const metadata = {
        id,
        name,
        lastModified: new Date().toISOString(),
        rowCount: data.length,
        columnCount: data[0]?.length || 0
      };
      localStorage.setItem(`spreadsheet-meta-${id}`, JSON.stringify(metadata));
      
      setLastSaved(new Date());
      
      if (onSave) {
        onSave(id, name, data);
      }
      
      return true;
    } catch (error) {
      console.error("Failed to save spreadsheet:", error);
      return false;
    }
  }, [data, id, name, onSave]);

  // Handle manual save
  const handleSave = () => {
    if (saveSpreadsheet()) {
      toast.success("Spreadsheet saved successfully");
    } else {
      toast.error("Failed to save spreadsheet");
    }
  };

  // Handle cell value change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string, style?: CellData['style']) => {
    const newData = [...data];
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array.from({ length: columns }, () => ({ value: '' }));
    }
    newData[rowIndex][colIndex] = { value, style };
    setData(newData);
  };

  // Apply style to selected cell
  const handleApplyStyle = (styleProperty: keyof CellData['style'], value: any) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const currentCell = data[row]?.[col] || { value: '' };
    const newStyle = { ...(currentCell.style || {}), [styleProperty]: value };
    
    handleCellChange(row, col, currentCell.value, newStyle);
  };

  // Add a new row
  const handleAddRow = () => {
    const newData = [...data];
    newData.push(Array.from({ length: columns }, () => ({ value: '' })));
    setData(newData);
    setRows(rows + 1);
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
      setCopiedCell({ 
        value: data[row][col].value,
        style: data[row][col].style
      });
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
    handleCellChange(row, col, copiedCell.value, copiedCell.style);
    toast.success("Cell pasted");
  };

  // Handle align changes
  const handleAlignChange = (align: 'left' | 'center' | 'right') => {
    handleApplyStyle('align', align);
  };

  // Handle formatting changes
  const handleFormatChange = (format: 'bold' | 'italic' | 'underline', value?: boolean) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const currentCell = data[row]?.[col] || { value: '' };
    const currentValue = currentCell.style?.[format];
    
    // Toggle value if not specified
    const newValue = value !== undefined ? value : !currentValue;
    
    handleApplyStyle(format, newValue);
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
    element.download = `${name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Spreadsheet exported to CSV");
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-md shadow-sm h-full bg-white">
      <div className="flex items-center justify-between p-2 bg-white/90 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-2 flex-1">
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[240px] font-medium border-transparent focus:border-gray-300 focus-visible:ring-0"
            placeholder="Spreadsheet name"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className="text-primary hover:bg-primary/10"
          >
            Save
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
            <Switch
              id="autosave"
              checked={isAutosaveEnabled}
              onCheckedChange={setIsAutosaveEnabled}
              size="sm"
            />
            <Label htmlFor="autosave" className="text-xs">Autosave</Label>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {lastSaved && `Last saved: ${lastSaved.toLocaleTimeString()}`}
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
        onAlignChange={handleAlignChange}
        onFormatChange={handleFormatChange}
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
                <div className="w-10 h-8 bg-secondary/10 border border-gray-300 flex items-center justify-center font-medium text-secondary-foreground">
                  {rowIndex + 1}
                </div>
                
                {/* Cells */}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Cell
                    key={`${rowIndex}-${colIndex}`}
                    value={data[rowIndex]?.[colIndex]?.value || ''}
                    style={data[rowIndex]?.[colIndex]?.style}
                    onChange={(value) => handleCellChange(rowIndex, colIndex, value, data[rowIndex]?.[colIndex]?.style)}
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
