import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Search, ShieldCheck, UserCheck, ShieldAlert, PlusCircle, LogIn, LogOut, CheckCircle2, ChevronDown, Shield, User } from 'lucide-react';
import { DataService } from '../services/dataService';

export default function Navbar({ onOpenAuth, onOpenRequestModal, onOpenRequestCollegeModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(DataService.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Keep user state in sync
    setCurrentUser(DataService.getCurrentUser());
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    const defaultUser = DataService.logout();
    setCurrentUser(defaultUser);
    setIsDropdownOpen(false);
    navigate('/');
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
              RateMyProff
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

            {currentUser.isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/80'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Request Buttons */}
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

          {/* USER SESSION AVATAR & DROPDOWN MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 p-1.5 pl-2.5 pr-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
                currentUser.isAdmin
                  ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-amber-500/50 hover:border-amber-400'
                  : 'bg-indigo-900 hover:bg-indigo-950 text-white border-indigo-700/50'
              }`}
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-xs">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                  currentUser.isAdmin ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </div>

              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[9px] font-semibold uppercase text-amber-300 tracking-wider">
                  {currentUser.isAdmin ? 'Admin Lead' : 'Verified Student'}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* DROPDOWN MENU OVERLAY */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in slide-in-from-top-2 duration-150">
                
                {/* User Info Header */}
                <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                  <div className="font-display font-bold text-sm text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 truncate font-medium">{currentUser.email}</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-900 border border-indigo-200">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    {currentUser.isAdmin ? 'Lead Moderator' : 'Verified Student'}
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="space-y-1">
                  {currentUser.isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Admin Command Center
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                    >
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Authenticate Admin Portal
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Switch User / Credentials
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out Session
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
