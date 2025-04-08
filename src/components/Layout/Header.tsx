
import React from 'react';
import { FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          {onMenuToggle && (
            <Button variant="ghost" size="icon" onClick={onMenuToggle} className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-navy-900 mr-2" />
            <h1 className="text-lg font-semibold text-navy-900">DocuScan</h1>
          </div>
        </div>
        <div className="text-sm text-navy-600 font-medium">Smart Document Scanner</div>
      </div>
    </header>
  );
};

export default Header;
