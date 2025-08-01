'use client';

import { useEffect, useRef, type FC } from 'react';
import { Button } from './ui/button';
import { UploadCloud } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
}

// Extend the Window interface to include the cloudinary object
declare global {
  interface Window {
    cloudinary: any;
  }
}

export const CloudinaryUploadWidget: FC<CloudinaryUploadWidgetProps> = ({ onUploadSuccess }) => {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Store the cloudinary instance in a ref
    cloudinaryRef.current = window.cloudinary;
    
    // Only create the widget once
    if (cloudinaryRef.current) {
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "dbf1vsz6g",
          uploadPreset: "hobo_livings_preset",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onUploadSuccess(result.info.secure_url);
          }
          if (error) {
            console.error('Cloudinary Upload Error:', error);
          }
        }
      );
    }

  }, [onUploadSuccess]);

  const handleUploadClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <Button onClick={handleUploadClick} variant="outline" className="w-full">
      <UploadCloud className="mr-2 h-4 w-4" />
      Upload an Image
    </Button>
  );
};
