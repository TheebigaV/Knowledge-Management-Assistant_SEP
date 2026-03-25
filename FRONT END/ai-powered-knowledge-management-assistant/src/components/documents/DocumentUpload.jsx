import React, { useState } from 'react';
import { Upload, FileText, X, Check, Network } from 'lucide-react';
import toast from 'react-hot-toast';
import documentService from '../../services/documentService';

const DocumentUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploaded(false);
      // Auto-populate title from filename (remove extension and clean up)
      if (!documentTitle) {
        const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setDocumentTitle(fileName);
      }
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (!documentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    // Check file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', documentTitle.trim());
      
      console.log('Uploading file:', selectedFile.name, 'Size:', (selectedFile.size / 1024 / 1024).toFixed(2) + 'MB');
      console.log('Document title:', documentTitle);
      
      const response = await documentService.uploadDocument(formData);
      
      setUploading(false);
      setUploaded(true);
      toast.success('Document uploaded successfully!');
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedFile(null);
        setUploaded(false);
        setDocumentTitle('');
      }, 2000);
      
    } catch (error) {
      setUploading(false);
      
      // More detailed error handling
      let errorMessage = 'Failed to upload document';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'Authentication required. Please login again.';
            break;
          case 413:
            errorMessage = 'File too large. Maximum size is 10MB.';
            break;
          case 400:
            errorMessage = data?.error || 'Invalid file format. Please upload a PDF.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.message || `Upload failed (${status})`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout. Please check your connection and try again.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if server is running.';
      }
      
      toast.error(errorMessage);
      console.error('Upload error details:', error);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploaded(false);
    setDocumentTitle('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Upload Document</h2>
          <p className="text-slate-600">Share your PDF documents to generate AI-powered learning materials</p>
        </div>

        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 ${
                dragActive ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <Upload className={`w-8 h-8 transition-colors duration-200 ${
                  dragActive ? 'text-blue-600' : 'text-slate-400'
                }`} strokeWidth={2} />
              </div>
              
              <div className="text-center">
                <p className="text-lg font-medium text-slate-900 mb-2">
                  {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                </p>
                <p className="text-sm text-slate-600 mb-4">or</p>
                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200">
                  Browse Files
                </button>
              </div>
              
              <p className="text-xs text-slate-500">PDF files only (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Document Title
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter a title for this document"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                disabled={uploading}
              />
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" strokeWidth={2} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <button
                onClick={handleRemoveFile}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-200"
                disabled={uploading}
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {uploaded ? (
              <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <Check className="w-4 h-4 text-blue-600" strokeWidth={2} />
                </div>
                <p className="text-sm font-medium text-blue-800">Document uploaded successfully!</p>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Document'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
