import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, File, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface UploadStatus {
  message: string;
  isSuccess: boolean;
}

const PdfUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      setSelectedFile(null);
      setUploadStatus({
        message: 'Please select a valid PDF file',
        isSuccess: false
      });
    }
  };

  const handleFileUpload = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus({
        message: 'No file selected',
        isSuccess: false
      });
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      setUploadStatus({
        message: 'Uploading...',
        isSuccess: false
      });
      
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadStatus({
          message: 'File uploaded successfully!',
          isSuccess: true
        });
        setSelectedFile(null);
      } else {
        setUploadStatus({
          message: 'Upload failed. Please try again.',
          isSuccess: false
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        message: 'Upload failed. Network error.',
        isSuccess: false
      });
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <File className="mr-3 text-blue-400" /> 
          PDF Upload
        </h2>
        
        <form onSubmit={handleFileUpload}>
          <div className="mb-6">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden" 
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload" 
              className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Upload className="mr-2 text-gray-400" />
              <span className="text-gray-300">
                {selectedFile ? selectedFile.name : 'Select PDF File'}
              </span>
            </label>
          </div>

          {uploadStatus && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              uploadStatus.isSuccess
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-red-600/20 text-red-400'
            }`}>
              {uploadStatus.message}
            </div>
          )}

          <button 
            type="submit"
            disabled={!selectedFile}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
              transition-colors flex items-center justify-center 
              disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Send className="mr-2" />
            Upload PDF
          </button>
        </form>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default PdfUploadPage;