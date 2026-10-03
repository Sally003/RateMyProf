import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import CollegeDiscoveryPage from './pages/CollegeDiscoveryPage';
import ProfessorSearchPage from './pages/ProfessorSearchPage';
import ProfessorProfilePage from './pages/ProfessorProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Modals
import AuthPortalModal from './components/Modals/AuthPortalModal';
import SubmitReviewModal from './components/Modals/SubmitReviewModal';
import ReportReviewModal from './components/Modals/ReportReviewModal';
import RequestProfessorModal from './components/Modals/RequestProfessorModal';
import RequestCollegeModal from './components/Modals/RequestCollegeModal';
import { DataService } from './services/dataService';

export default function App() {
  // User & Modal States
  const [currentUser, setCurrentUser] = useState(DataService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
  const [targetProfessor, setTargetProfessor] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState(null);
  const [isRequestProfOpen, setIsRequestProfOpen] = useState(false);
  const [isRequestCollegeOpen, setIsRequestCollegeOpen] = useState(false);

  const handleUserUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleOpenSubmitReview = (prof) => {
    setTargetProfessor(prof);
    setIsSubmitReviewOpen(true);
  };

  const handleOpenReportModal = (reviewId) => {
    setTargetReviewId(reviewId);
    setIsReportOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Navigation */}
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenRequestModal={() => setIsRequestProfOpen(true)}
        onOpenRequestCollegeModal={() => setIsRequestCollegeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenRequestModal={() => setIsRequestProfOpen(true)}
              />
            } 
          />
          <Route path="/colleges" element={<CollegeDiscoveryPage />} />
          <Route 
            path="/professors" 
            element={
              <ProfessorSearchPage 
                onOpenRequestModal={() => setIsRequestProfOpen(true)}
              />
            } 
          />
          <Route 
            path="/professors/:id" 
            element={
              <ProfessorProfilePage 
                onOpenSubmitReview={handleOpenSubmitReview}
                onOpenReportModal={handleOpenReportModal}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminDashboardPage 
                onUserUpdated={handleUserUpdated}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <AuthPortalModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onUserUpdated={handleUserUpdated}
      />

      <SubmitReviewModal 
        isOpen={isSubmitReviewOpen} 
        onClose={() => setIsSubmitReviewOpen(false)}
        professor={targetProfessor}
      />

      <ReportReviewModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)}
        reviewId={targetReviewId}
      />

      <RequestProfessorModal 
        isOpen={isRequestProfOpen} 
        onClose={() => setIsRequestProfOpen(false)}
      />

      <RequestCollegeModal
        isOpen={isRequestCollegeOpen}
        onClose={() => setIsRequestCollegeOpen(false)}
      />

    </div>
  );
}
