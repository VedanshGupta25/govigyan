
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Spreadsheet from '@/components/SpreadsheetTable/Spreadsheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const SpreadsheetPage = () => {
  const [spreadsheetName, setSpreadsheetName] = useState('Untitled Spreadsheet');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              value={spreadsheetName}
              onChange={(e) => setSpreadsheetName(e.target.value)}
              className="font-semibold text-lg border-transparent focus:border-gray-300"
            />
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-md flex-1">
          <Spreadsheet initialRows={15} initialColumns={10} />
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          DocuScan &copy; {new Date().getFullYear()} | Spreadsheet Edition
        </div>
      </footer>
    </div>
  );
};

export default SpreadsheetPage;
