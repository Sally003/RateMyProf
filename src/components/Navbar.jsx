import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Search, ShieldCheck, UserCheck, ShieldAlert, PlusCircle, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { DataService } from '../services/dataService';

export default function Navbar({ onOpenAuth, onOpenRequestModal, onOpenRequestCollegeModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(DataService.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleAdmin = () => {
    const updated = DataService.toggleAdminRole(!currentUser.isAdmin);
    setCurrentUser(updated);
    if (updated.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-700 text-amber-400 flex items-center justify-center shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform duration-200 border border-indigo-700/50">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display font-extrabold text-xl text-indigo-950 tracking-tight flex items-center gap-1.5">
              CampusRate
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Academic Feedback</p>
          </div>
        </Link>

        {/* Global Quick Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search professor, college, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Nav Links & Actions */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-1 mr-2">
            <Link 
              to="/colleges" 
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                location.pathname.startsWith('/colleges') 
                  ? 'bg-indigo-50 text-indigo-900 font-bold' 
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-100'
              }`}
            >
              Colleges
            </Link>

            <Link 
              to="/professors" 
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                location.pathname.startsWith('/professors') 
                  ? 'bg-indigo-50 text-indigo-900 font-bold' 
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-100'
              }`}
            >
              Professors
            </Link>
          </nav>

          {/* Request Missing College / Professor Buttons */}
          <button
            onClick={onOpenRequestCollegeModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            Add College
          </button>

          <button
            onClick={onOpenRequestModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Add Prof
          </button>

          {/* Admin Demo Role Switcher Toggle */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={handleToggleAdmin}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                currentUser.isAdmin
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Toggle role between Student and Admin"
            >
              {currentUser.isAdmin ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
                  <span>Admin Mode</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Student View</span>
                </>
              )}
            </button>

            {/* Auth / Profile Modal Trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer border border-indigo-700/50"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
