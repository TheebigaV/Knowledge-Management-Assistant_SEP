import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BrainCircuit,
  FileText,
  Upload,
  BookOpen,
  TrendingUp,
  Network,
  Eye,
} from "lucide-react";
import documentService from "../../services/documentService";
import flashcardService from "../../services/flashcardService";
import quizService from "../../services/quizService";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [documentCount, setDocumentCount] = useState(0);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper function to check if a route is active
  const isActiveRoute = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const fetchAllCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch all counts in parallel
      const [docResponse, flashcardResponse, quizResponse] = await Promise.allSettled([
        documentService.getDocuments(),
        flashcardService.getFlashcardCount(),
        quizService.getQuizCount()
      ]);

      // Handle document count
      if (docResponse.status === 'fulfilled') {
        setDocumentCount(docResponse.value.data?.length || 0);
      } else {
        console.error('Document count failed:', docResponse.reason);
        setDocumentCount(0);
      }

      // Handle flashcard count
      if (flashcardResponse.status === 'fulfilled') {
        setFlashcardCount(flashcardResponse.value.count || flashcardResponse.value.data?.count || 0);
      } else {
        console.error('Flashcard count failed:', flashcardResponse.reason);
        setFlashcardCount(0);
      }

      // Handle quiz count
      if (quizResponse.status === 'fulfilled') {
        setQuizCount(quizResponse.value.count || quizResponse.value.data?.count || 0);
      } else {
        console.error('Quiz count failed:', quizResponse.reason);
        setQuizCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error);
      // Set all counts to 0 on error
      setDocumentCount(0);
      setFlashcardCount(0);
      setQuizCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-200/50 sticky top-0 z-50">
        {/* Gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <BrainCircuit className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Knowledge Assistant
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Learning Platform</p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveRoute("/dashboard") 
                    ? "text-blue-600" 
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                <span className="relative z-10">Dashboard</span>
                {/* Active underline */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${
                  isActiveRoute("/dashboard") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-200`}></div>
              </Link>
              <Link
                to="/documents"
                className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActiveRoute("/documents") 
                    ? "text-blue-600" 
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                <span className="relative z-10">Documents</span>
                {/* Active underline */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${
                  isActiveRoute("/documents") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-200`}></div>
              </Link>
              <div className={`group relative px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isActiveRoute("/ai-tools") 
                    ? "text-blue-600" 
                    : "text-slate-700 hover:text-blue-600"
              }`}
                onClick={() => {
                  // Navigate to documents and show AI tools tab
                  navigate("/documents");
                  // You could add state management to automatically switch to AI tools tab
                }}
              >
                <span className="relative z-10">AI Tools</span>
                {/* Active underline */}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform ${
                  isActiveRoute("/ai-tools") ? "scale-x-100" : "scale-x-0"
                } group-hover:scale-x-100 transition-transform duration-200`}></div>
              </div>
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors group">
                <div className="w-5 h-5 relative">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user?.username || "User"}</p>
                  <p className="text-xs text-slate-500">Premium Plan</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 p-0.5 shadow-lg shadow-purple-500/25">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-700">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-semibold">Logout</span>
                </span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl opacity-5 blur-3xl"></div>
          
          {/* Content */}
          <div className="relative p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username || "User"}</span>! 
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-4 leading-relaxed">
                Continue your learning journey with AI-powered knowledge management and unlock your full potential.
              </p>
              
              {/* Quick stats badges */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  {documentCount} Documents
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                  {flashcardCount} Flashcards
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                  {quizCount} Quizzes
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-4 right-12 w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Quick Actions</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ready to learn</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Documents Section */}
            <div className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-300 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
                    <FileText className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">Documents</h4>
                    <p className="text-sm text-slate-600">Manage and view your PDF documents</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/documents"
                    className="group/btn relative py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-center block overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" strokeWidth={2} />
                      Upload Documents
                    </span>
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-200"></div>
                  </Link>
                  <Link
                    to="/documents"
                    className="group/btn relative py-3 px-4 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 text-center block overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5" strokeWidth={2} />
                      View Documents
                    </span>
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-200"></div>
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Tools Section */}
            <div className="group relative bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-300 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                    <BrainCircuit className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900">AI Learning Tools</h4>
                    <p className="text-sm text-slate-600">Enhance your learning with AI assistance</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-purple-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Smart Flashcards</p>
                        <p className="text-xs text-slate-600">AI-generated study cards</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-purple-600">{flashcardCount} created</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Interactive Quizzes</p>
                        <p className="text-xs text-slate-600">Test your knowledge</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-indigo-600">{quizCount} available</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Network className="w-4 h-4 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">AI Chat Assistant</p>
                        <p className="text-xs text-slate-600">Get instant explanations</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-blue-600">Always available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
