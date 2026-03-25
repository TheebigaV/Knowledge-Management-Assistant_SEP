import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <Network className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">
                Knowledge Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Welcome, {user?.username || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.username || "User"}!
          </h2>
          <p className="text-slate-600">
            Continue your learning journey with AI-powered knowledge management.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <FileText className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Flashcards</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0%</p>
                <p className="text-sm text-slate-600">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <FileText className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Documents
                </h3>
                <p className="text-sm text-slate-600">
                  Upload, view, and manage your PDF documents
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/documents"
                className="py-3 px-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 text-center block"
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" strokeWidth={2} />
                  Upload Documents
                </div>
              </Link>
              <Link
                to="/documents"
                className="py-3 px-4 bg-linear-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-slate-500/25 text-center block"
              >
                <div className="flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" strokeWidth={2} />
                  View Documents
                </div>
              </Link>
            </div>
          </div>
          {/*will use later */}
          {/* <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <BookOpen className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Flashcards</h3>
                <p className="text-sm text-slate-600">Study with AI-generated flashcards</p>
              </div>
            </div>
            <button className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25">
              Manage Flashcards
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/25">
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Progress</h3>
                <p className="text-sm text-slate-600">Track your learning progress</p>
              </div>
            </div>
            <button className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25">
              View Progress
            </button>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
