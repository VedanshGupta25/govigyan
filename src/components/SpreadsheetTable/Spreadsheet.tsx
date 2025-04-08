
import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import Cell from './Cell';
import SpreadsheetHeader from './SpreadsheetHeader';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpreadsheetProps {
  initialRows?: number;
  initialColumns?: number;
}

interface CellData {
  value: string;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  initialRows = 10, 
  initialColumns = 8 
}) => {
  const [rows, setRows] = useState(initialRows);
  const [columns, setColumns] = useState(initialColumns);
  const [data, setData] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [copiedCell, setCopiedCell] = useState<{ value: string } | null>(null);

  // Initialize data grid
  useEffect(() => {
    // Initialize with empty data
    const initialData = Array.from({ length: rows }, () => 
      Array.from({ length: columns }, () => ({ value: '' }))
    );
    setData(initialData);
  }, []);

  // Handle cell value change
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array.from({ length: columns }, () => ({ value: '' }));
    }
    newData[rowIndex][colIndex] = { value };
    setData(newData);
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

  // Export to CSV
  const handleExport = () => {
    // Convert data to CSV
    const csvContent = data.map(row => 
      row.map(cell => cell.value).join(',')
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

  return (
    <div className="flex flex-col border border-gray-300 rounded-md shadow-sm h-full">
      <Toolbar 
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onCopy={handleCopy}
        onPaste={handlePaste}
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
    </div>
  );
};

export default Spreadsheet;
