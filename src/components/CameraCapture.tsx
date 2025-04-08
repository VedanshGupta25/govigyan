
import React, { useRef, useState, useEffect } from 'react';
import { Camera, FlipHorizontal, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    const startCamera = async () => {
      try {
        setIsLoading(true);
        const constraints = {
          video: { facingMode },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        toast.error('Failed to access camera. Please check your permissions.');
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md mx-4 overflow-hidden">
        <div className="p-4 bg-navy-900 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">Document Scanner</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-navy-800">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="camera-container aspect-[3/4] bg-black relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="scanner-line"></div>
              <div className="absolute inset-0 border-2 border-teal-400 border-dashed rounded-md m-4 pointer-events-none"></div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="p-4 flex justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={toggleCamera} 
            className="flex-1"
          >
            <FlipHorizontal className="h-5 w-5 mr-2" />
            Flip Camera
          </Button>
          <Button 
            onClick={handleCapture} 
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            <Camera className="h-5 w-5 mr-2" />
            Capture
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CameraCapture;
