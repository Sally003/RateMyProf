import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ShieldCheck, Star, GraduationCap, ChevronRight, Award, PlusCircle } from 'lucide-react';
import ThreeDTile from '../components/3DTile';
import ProfessorAvatar from '../components/ProfessorAvatar';
import { DataService } from '../services/dataService';

export default function ProfessorSearchPage({ onOpenRequestModal }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [professors, setProfessors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCollegeId, setSelectedCollegeId] = useState(searchParams.get('collegeId') || '');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get('departmentId') || '');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    DataService.getColleges().then(setColleges);
  }, []);

  useEffect(() => {
    if (selectedCollegeId) {
      DataService.getDepartments(selectedCollegeId).then(setDepartments);
    } else {
      setDepartments([]);
    }
  }, [selectedCollegeId]);

  useEffect(() => {
    DataService.getProfessors({
      search: searchQuery,
      collegeId: selectedCollegeId,
      departmentId: selectedDepartmentId
    }).then(list => {
      let filtered = list;
      if (minRating > 0) {
        filtered = filtered.filter(p => (p.overallRating || 0) >= minRating);
      }
      setProfessors(filtered);
    });
  }, [searchQuery, selectedCollegeId, selectedDepartmentId, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Filter Controls Tile */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Academic Search</span>
            <h1 className="font-display text-3xl font-extrabold text-white">Find & Evaluate Professors</h1>
          </div>

          <button
            onClick={onOpenRequestModal}
            className="self-start md:self-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Request Missing Professor
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Name Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* College Filter */}
          <div>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value="">All Universities</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              disabled={!selectedCollegeId}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-amber-400 disabled:opacity-40"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Min Rating Filter */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-amber-400"
            >
              <option value={0}>Any Overall Rating</option>
              <option value={4.5}>4.5+ Rating Only</option>
              <option value={4.0}>4.0+ Rating Only</option>
              <option value={3.5}>3.5+ Rating Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl text-slate-900">
          Faculty Results ({professors.length})
        </h2>
      </div>

      {/* 3D Tile Professor Grid */}
      {professors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-800">No professors match your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or request a missing professor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((prof) => (
            <ThreeDTile
              key={prof.id}
              variant="default"
              onClick={() => navigate(`/professors/${prof.id}`)}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <ProfessorAvatar name={prof.name} profileUrl={prof.profileUrl} size="md" />

                  {/* Rating Score Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-800 text-amber-400 flex flex-col items-center justify-center shadow-md shrink-0">
                    <span className="font-display text-lg font-bold">
                      {prof.overallRating ? prof.overallRating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-[9px] uppercase font-semibold text-slate-300">/ 5.0</span>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 text-[11px] font-semibold mb-2 border border-indigo-200">
                  {prof.verificationStatus}
                </div>

                <h3 className="font-display font-bold text-lg text-slate-950">{prof.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{prof.designation} • {prof.departmentName}</p>
                <p className="text-xs text-slate-600 font-medium mt-1">{prof.collegeName}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">{prof.totalReviews || 0} Student Reviews</span>
                <span className="text-indigo-900 font-bold flex items-center gap-1">
                  View Ratings <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </ThreeDTile>
          ))}
        </div>
      )}

    </div>
  );
}
