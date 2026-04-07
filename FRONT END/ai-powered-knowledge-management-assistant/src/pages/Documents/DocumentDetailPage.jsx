import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  FileText,
  Calendar,
  Eye,
  BrainCircuit,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import documentService from "../../services/documentService";
import AIActions from "../../components/ai/AIActions";
import FlashcardGenerator from "../../components/flashcards/FlashcardGenerator";
import FlashcardViewer from "../../components/flashcards/FlashcardViewer";
import QuizGenerator from "../../components/quizzes/QuizGenerator";
import QuizViewer from "../../components/quizzes/QuizViewer";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("viewer");
  const [generatedFlashcards, setGeneratedFlashcards] = useState(null);
  const [flashcardView, setFlashcardView] = useState('generator'); // 'generator' or 'viewer'
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizView, setQuizView] = useState('generator'); // 'generator' or 'viewer'

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await documentService.getDocumentById(id);
        setDocumentData(response.data);
      } catch (error) {
        toast.error("Failed to load document");
        navigate("/documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      // Use the direct file URL from the document
      if (documentData && documentData.filePath) {
        // Create a temporary link to download the file
        const link = window.document.createElement("a");
        link.href = documentData.filePath;
        link.setAttribute("download", documentData.fileName || "document.pdf");
        link.setAttribute("target", "_blank");
        window.document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Document downloaded successfully");
      } else {
        toast.error("Document file not found");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await documentService.deleteDocument(id);
        toast.success("Document deleted successfully");
        navigate("/documents");
      } catch (error) {
        toast.error("Failed to delete document");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: documentData.title,
        text: `Check out this document: ${documentData.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleFlashcardsGenerated = (flashcards) => {
    setGeneratedFlashcards(flashcards);
    setFlashcardView('viewer');
    toast.success('Flashcards ready for study!');
  };

  const handleQuizGenerated = (quiz) => {
    setGeneratedQuiz(quiz);
    setQuizView('viewer');
    toast.success('Quiz ready to take!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Document not found
          </h2>
          <Link
            to="/documents"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/documents"
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {documentData.title}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {documentData.fileName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" strokeWidth={2} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" strokeWidth={2} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Document Info Bar */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={2} />
                <span>
                  Uploaded{" "}
                  {new Date(documentData.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" strokeWidth={2} />
                <span>{documentData.pages} pages</span>
              </div>
              <span>{documentData.size}</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  documentData.status === "ready"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {documentData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("viewer")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "viewer"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" strokeWidth={2} />
                Document Viewer
              </div>
            </button>
            <button
              onClick={() => setActiveTab("ai-tools")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "ai-tools"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" strokeWidth={2} />
                AI Tools
              </div>
            </button>              
            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'quiz'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" strokeWidth={2} />
                Quiz
              </div>
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'flashcards'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" strokeWidth={2} />
                Flashcards
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "viewer" && (
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-8">
            <div className="aspect-[4/3] bg-slate-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText
                  className="w-16 h-16 text-slate-400 mx-auto mb-4"
                  strokeWidth={2}
                />
                <p className="text-slate-600 mb-4">PDF Viewer</p>
                <p className="text-sm text-slate-500 mb-6">
                  PDF viewer will be integrated here. For now, you can download
                  the document to view it.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai-tools" && <AIActions />}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            {/* Flashcard View Toggle */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setFlashcardView('generator')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    flashcardView === 'generator'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Generate Flashcards
                </button>
                <button
                  onClick={() => setFlashcardView('viewer')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    flashcardView === 'viewer'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Study Flashcards
                </button>
              </div>
            </div>

            {/* Flashcard Content */}
            {flashcardView === 'generator' ? (
              <FlashcardGenerator onFlashcardsGenerated={handleFlashcardsGenerated} />
            ) : (
              <FlashcardViewer generatedFlashcards={generatedFlashcards} />
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="space-y-6">
            {/* Quiz View Toggle */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setQuizView('generator')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    quizView === 'generator'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Generate Quiz
                </button>
                <button
                  onClick={() => setQuizView('viewer')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    quizView === 'viewer'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Take Quiz
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            {quizView === 'generator' ? (
              <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            ) : (
              <QuizViewer generatedQuiz={generatedQuiz} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentDetailPage;
