// @ts-nocheck
'use client';

import { useEffect, type FC } from 'react';
import { Button } from './ui/button';
import { UploadCloud } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
}

export const CloudinaryUploadWidget: FC<CloudinaryUploadWidgetProps> = ({ onUploadSuccess }) => {
  useEffect(() => {
    // This check is necessary to ensure the script is loaded before creating the widget
    if (!window.cloudinary) {
      console.error('Cloudinary script not loaded');
      return;
    }

    const cloudName = "dbf1vsz6g"; // From your Cloudinary dashboard
    const uploadPreset = "hobo_livings_preset"; // The *unsigned* preset you created

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Image uploaded successfully:", result.info.secure_url);
          onUploadSuccess(result.info.secure_url);
        }
        if (error) {
          console.error('Cloudinary Upload Error:', error);
        }
      }
    );

    const handleClick = (e: MouseEvent) => {
      e.preventDefault(); // Prevent form submission
      myWidget.open();
    };
    
    const uploadButton = document.getElementById("upload_widget_button");
    if (uploadButton) {
        uploadButton.addEventListener("click", handleClick);
    }
    
    // Cleanup function to remove event listener
    return () => {
        if (uploadButton) {
            uploadButton.removeEventListener('click', handleClick);
        }
    };
  }, [onUploadSuccess]);

  return (
    <Button id="upload_widget_button" variant="outline" className="w-full">
      <UploadCloud className="mr-2" />
      Upload an Image
    </Button>
  );
};
