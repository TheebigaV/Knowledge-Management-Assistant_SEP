import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Eye, Download, Trash2, Search, Filter, Network, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import DocumentUpload from '../../components/documents/DocumentUpload';
import documentService from '../../services/documentService';

const DocumentsPage = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await documentService.getDocuments();
        
        if (response.success && response.data) {
          // Map MongoDB _id to id for frontend compatibility
          const documents = response.data.map(doc => ({
            ...doc,
            id: doc._id, // Use MongoDB _id as id
            uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
            size: (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB',
            pages: doc.pageCount || 0
          }));
          setDocuments(documents);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUploadSuccess = (newDocument) => {
    // Refresh the documents list to get the latest data
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await documentService.getDocuments();
        
        if (response.success && response.data) {
          // Map MongoDB _id to id for frontend compatibility
          const documents = response.data.map(doc => ({
            ...doc,
            id: doc._id, // Use MongoDB _id as id
            uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
            size: (doc.fileSize / 1024 / 1024).toFixed(1) + ' MB',
            pages: doc.pageCount || 0
          }));
          setDocuments(documents);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to fetch documents');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
    setShowUpload(false);
  };

  const handleDeleteDocument = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleDownloadDocument = (doc) => {
    try {
      if (doc && doc.filePath) {
        // Create a temporary link to download the file
        const link = window.document.createElement('a');
        link.href = doc.filePath;
        link.setAttribute('download', doc.fileName || 'document.pdf');
        link.setAttribute('target', '_blank');
        window.document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Document downloaded successfully');
      } else {
        toast.error('Document file not found');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (showUpload) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back to Documents
            </button>
          </div>
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                <p className="text-sm text-slate-600">Manage and view your uploaded documents</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-2 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              Upload Document
            </button>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white/80 backdrop-blur-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" strokeWidth={2} />
            </button>
            <div className="flex items-center bg-white/80 backdrop-blur-xl border border-slate-300 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  view === 'grid' ? 'bg-blue-500 text-white' : 'text-slate-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  view === 'list' ? 'bg-blue-500 text-white' : 'text-slate-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowUpload(true)}
                className="px-6 py-2 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-200"
              >
                {view === 'grid' ? (
                  // Grid View
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate mb-1">{doc.title}</h3>
                        <p className="text-sm text-slate-600 truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" strokeWidth={2} />
                        <span>{doc.uploadDate}</span>
                      </div>
                      <span>{doc.size}</span>
                      <span>{doc.pages} pages</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 text-center"
                      >
                        <Eye className="w-4 h-4 inline mr-1" strokeWidth={2} />
                        View
                      </Link>
                      <button 
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                      <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate">{doc.title}</h3>
                      <p className="text-sm text-slate-600">{doc.fileName} • {doc.size} • {doc.pages} pages</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    </Link>
                    <button 
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
