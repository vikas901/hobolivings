'use client';

import { useEffect, useRef, type FC } from 'react';
import { Button } from './ui/button';
import { UploadCloud } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
  className?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export const CloudinaryUploadWidget: FC<CloudinaryUploadWidgetProps> = ({ 
  onUploadSuccess,
  buttonText = "Upload Images",
  className
}) => {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    
    if (cloudinaryRef.current) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "dbf1vsz6g",
          uploadPreset: "hobo_livings_preset",
          multiple: true, // Enable multi-file selection
          maxFileSize: 10 * 1024 * 1024, // 10MB
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
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
    <Button onClick={handleUploadClick} variant="outline" className={className}>
      <UploadCloud className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};

