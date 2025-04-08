
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Spreadsheet from '@/components/SpreadsheetTable/Spreadsheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, FileSpreadsheet, Table, Info } from 'lucide-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getSpreadsheetById, createNewSpreadsheet } from '@/services/spreadsheetService';
import { toast } from 'sonner';

const SpreadsheetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const spreadsheetId = queryParams.get('id');
  
  const [spreadsheetData, setSpreadsheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (spreadsheetId) {
      const data = getSpreadsheetById(spreadsheetId);
      if (data) {
        setSpreadsheetData(data);
      } else {
        toast.error('Spreadsheet not found');
        // Create a new spreadsheet if not found
        const newData = createNewSpreadsheet();
        setSpreadsheetData(newData);
      }
    } else {
      // Create a new spreadsheet if no ID provided
      const newData = createNewSpreadsheet();
      setSpreadsheetData(newData);
    }
    setLoading(false);
  }, [spreadsheetId]);
  
  const handleNewSpreadsheet = () => {
    const newData = createNewSpreadsheet();
    navigate(`/spreadsheet?id=${newData.id}`);
    window.location.reload(); // Easiest way to reset the state completely
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-7xl">
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-100">
              <FileSpreadsheet className="h-5 w-5 text-secondary" />
              <span className="font-semibold text-lg px-2 py-1">DocuScan Spreadsheets</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
          </div>
          
          <Menubar className="border-none bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-1 h-auto">
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-3 py-1.5 rounded-md data-[state=open]:bg-accent/50">File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={handleNewSpreadsheet}>New<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                <MenubarItem>Open<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Import</MenubarItem>
                <MenubarItem>Export</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-3 py-1.5 rounded-md data-[state=open]:bg-accent/50">Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Cut<MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
                <MenubarItem>Copy<MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
                <MenubarItem>Paste<MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find<MenubarShortcut>⌘F</MenubarShortcut></MenubarItem>
                <MenubarItem>Replace<MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-3 py-1.5 rounded-md data-[state=open]:bg-accent/50">View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Formulas</MenubarItem>
                <MenubarItem>Grid lines</MenubarItem>
                <MenubarItem>Headers</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-3 py-1.5 rounded-md data-[state=open]:bg-accent/50">Data</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Sort</MenubarItem>
                <MenubarItem>Filter</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Validate</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        
        <div className="spreadsheet-container flex-1">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Spreadsheet 
              initialData={spreadsheetData}
              initialRows={spreadsheetData?.rows || 15} 
              initialColumns={spreadsheetData?.columns || 10} 
              spreadsheetTitle={spreadsheetData?.title}
            />
          )}
        </div>
        
        <div className="text-xs text-muted-foreground py-3 px-3 bg-white/80 backdrop-blur-sm mt-4 rounded-lg shadow-sm border border-gray-100 flex justify-between">
          <span>Cells: {(spreadsheetData?.rows || 15) * (spreadsheetData?.columns || 10)}</span>
          <span>Last modified: {spreadsheetData?.lastModified ? new Date(spreadsheetData.lastModified).toLocaleDateString() : new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 text-center text-sm text-gray-500">
        <div className="container mx-auto flex items-center justify-center">
          <Table className="h-4 w-4 mr-2 text-secondary" />
          <span className="font-medium">DocuScan</span>
          <span className="mx-1">•</span>
          <span className="text-muted-foreground">Spreadsheet Edition</span>
          <span className="mx-1">•</span>
          <span className="text-muted-foreground">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default SpreadsheetPage;
