
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Spreadsheet from '@/components/SpreadsheetTable/Spreadsheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, FileSpreadsheet, Table } from 'lucide-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';

const SpreadsheetPage = () => {
  const [spreadsheetName, setSpreadsheetName] = useState('Untitled Spreadsheet');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-2 flex-1 flex flex-col">
        <div className="flex flex-col space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-secondary" />
              <Input
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
                className="font-semibold text-lg border-transparent focus:border-gray-300 focus-visible:ring-0 h-9 px-2 py-1"
              />
              <Button variant="outline" size="sm" className="ml-2">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <Menubar className="border-none bg-transparent p-0 h-auto">
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-2 py-1 data-[state=open]:bg-accent/50">File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                <MenubarItem>Open<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
                <MenubarItem>Save<MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Import</MenubarItem>
                <MenubarItem>Export</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-2 py-1 data-[state=open]:bg-accent/50">Edit</MenubarTrigger>
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
              <MenubarTrigger className="font-normal text-sm px-2 py-1 data-[state=open]:bg-accent/50">View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Formulas</MenubarItem>
                <MenubarItem>Grid lines</MenubarItem>
                <MenubarItem>Headers</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            
            <MenubarMenu>
              <MenubarTrigger className="font-normal text-sm px-2 py-1 data-[state=open]:bg-accent/50">Data</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Sort</MenubarItem>
                <MenubarItem>Filter</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Validate</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-md flex-1 border border-gray-200">
          <Spreadsheet initialRows={15} initialColumns={10} />
        </div>
        
        <div className="text-xs text-muted-foreground py-2 px-1">
          <span className="mr-4">Cells: 150</span>
          <span>Last modified: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-sm text-gray-500">
        <div className="container mx-auto flex items-center justify-center">
          <Table className="h-4 w-4 mr-2 text-secondary" />
          DocuScan &copy; {new Date().getFullYear()} | Spreadsheet Edition
        </div>
      </footer>
    </div>
  );
};

export default SpreadsheetPage;
