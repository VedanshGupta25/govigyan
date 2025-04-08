import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Camera, Upload, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import CameraCapture from '@/components/CameraCapture';
import DocumentCard from '@/components/DocumentCard';
import DocumentDetail from '@/components/DocumentDetail';
import EmptyState from '@/components/EmptyState';
import FileUpload from '@/components/FileUpload';
import { Document } from '@/types/document';
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

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const loadedDocuments = getDocuments();
    setDocuments(loadedDocuments);
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
          <h2 className="text-2xl font-semibold text-navy-900">My Documents</h2>
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
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Spreadsheet
              </Link>
            </Button>
          </div>
        </div>
        
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
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          DocuScan &copy; {new Date().getFullYear()} | All documents are stored locally
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
