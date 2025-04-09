import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Camera, Upload, FileSpreadsheet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CameraCapture from '@/components/CameraCapture';
import DocumentCard from '@/components/DocumentCard';
import DocumentDetail from '@/components/DocumentDetail';
import EmptyState from '@/components/EmptyState';
import FileUpload from '@/components/FileUpload';
import { Document } from '@/types/document';
import { SpreadsheetMetadata } from '@/types/spreadsheet';
import SpreadsheetCard from '@/components/SpreadsheetCard';
import { 
  processNewDocument, 
  getDocuments, 
  getDocumentById, 
  deleteDocument 
} from '@/services/documentService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetMetadata[]>([]);
  const [activeContentTab, setActiveContentTab] = useState('documents');

  useEffect(() => {
    loadDocuments();
    loadSpreadsheets();
  }, []);

  const loadDocuments = () => {
    const loadedDocuments = getDocuments();
    setDocuments(loadedDocuments);
  };

  const loadSpreadsheets = () => {
    try {
      const spreadsheetList = JSON.parse(localStorage.getItem('spreadsheet-list') || '[]');
      const spreadsheetData: SpreadsheetMetadata[] = [];
      
      spreadsheetList.forEach((id: string) => {
        const metaStr = localStorage.getItem(`spreadsheet-meta-${id}`);
        if (metaStr) {
          try {
            const meta = JSON.parse(metaStr);
            spreadsheetData.push(meta);
          } catch (e) {
            console.error(`Error parsing metadata for spreadsheet ${id}:`, e);
          }
        }
      });
      
      spreadsheetData.sort((a, b) => 
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
      
      setSpreadsheets(spreadsheetData);
    } catch (error) {
      console.error('Error loading spreadsheets:', error);
    }
  };

  const handleCapture = async (imageData: string) => {
    setIsCapturing(false);
    setLoading(true);
    toast.info('Processing document...', { duration: 3000 });
    
    try {
      await processNewDocument(imageData);
      loadDocuments();
      toast.success('Document processed successfully!');
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    toast.info('Processing document...', { duration: 3000 });
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await processNewDocument(base64String);
        loadDocuments();
        toast.success('Document processed successfully!');
        setLoading(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setLoading(false);
    }
  };

  const handleDocumentClick = (id: string) => {
    setSelectedDocumentId(id);
  };

  const handleBackClick = () => {
    setSelectedDocumentId(null);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    loadDocuments();
    setSelectedDocumentId(null);
    toast.success('Document deleted');
  };

  const handleDeleteSpreadsheet = (id: string) => {
    try {
      const spreadsheetList = JSON.parse(localStorage.getItem('spreadsheet-list') || '[]');
      const newList = spreadsheetList.filter((item: string) => item !== id);
      localStorage.setItem('spreadsheet-list', JSON.stringify(newList));
      
      localStorage.removeItem(`spreadsheet-data-${id}`);
      localStorage.removeItem(`spreadsheet-meta-${id}`);
      localStorage.removeItem(`spreadsheet-name-${id}`);
      
      loadSpreadsheets();
      toast.success('Spreadsheet deleted');
    } catch (error) {
      console.error('Error deleting spreadsheet:', error);
      toast.error('Failed to delete spreadsheet');
    }
  };

  if (selectedDocumentId) {
    const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);
    if (selectedDocument) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="container max-w-2xl mx-auto p-4 flex-1">
            <DocumentDetail 
              document={selectedDocument}
              onBack={handleBackClick}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>
      );
    }
  }

  const filteredDocuments = documents.filter(doc => {
    if (activeTab === 'recent') return true;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="container max-w-4xl mx-auto p-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-navy-900">My Content</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCapturing(true)}
              disabled={loading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <FileUpload onFileSelected={handleFileUpload} />
            <Button variant="outline" size="sm" asChild>
              <Link to="/spreadsheet">
                <Plus className="h-4 w-4 mr-2" />
                New Sheet
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="documents" value={activeContentTab} onValueChange={setActiveContentTab} className="mb-6">
          <TabsList className="w-full flex justify-start">
            <TabsTrigger value="documents" className="flex-1 max-w-[200px]">Documents</TabsTrigger>
            <TabsTrigger value="spreadsheets" className="flex-1 max-w-[200px]">Spreadsheets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="animate-fade-in">
            <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="all">All Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="animate-fade-in">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-navy-700 mb-4"></div>
                      <p className="text-navy-600">Processing document...</p>
                    </div>
                  </div>
                ) : filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredDocuments.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        preview={doc.preview}
                        extractedText={doc.extractedText}
                        createdAt={doc.createdAt}
                        onClick={handleDocumentClick}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState onScan={() => setIsCapturing(true)} />
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                <EmptyState onScan={() => setIsCapturing(true)} />
              </TabsContent>
              
              <TabsContent value="all">
                {filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredDocuments.map(doc => (
                      <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        preview={doc.preview}
                        extractedText={doc.extractedText}
                        createdAt={doc.createdAt}
                        onClick={handleDocumentClick}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState onScan={() => setIsCapturing(true)} />
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="spreadsheets" className="animate-fade-in">
            {spreadsheets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {spreadsheets.map(sheet => (
                  <SpreadsheetCard
                    key={sheet.id}
                    spreadsheet={sheet}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white/80 rounded-xl p-8 text-center border border-gray-200">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No spreadsheets yet</h3>
                <p className="text-muted-foreground mb-6">Create a new spreadsheet to get started</p>
                <Button asChild>
                  <Link to="/spreadsheet">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Spreadsheet
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          DocuScan &copy; {new Date().getFullYear()} | All data is stored locally
        </div>
      </footer>
      
      {isCapturing && (
        <CameraCapture 
          onCapture={handleCapture} 
          onClose={() => setIsCapturing(false)} 
        />
      )}
    </div>
  );
};

export default Index;
