import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Search, MapPin, ExternalLink, ChevronRight, BookOpen, Users } from 'lucide-react';
import ThreeDTile from '../components/3DTile';
import { DataService } from '../services/dataService';

export default function CollegeDiscoveryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState(searchParams.get('id') || null);

  useEffect(() => {
    DataService.getColleges().then(setColleges);
  }, []);

  useEffect(() => {
    if (selectedCollegeId) {
      DataService.getDepartments(selectedCollegeId).then(setDepartments);
    }
  }, [selectedCollegeId]);

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Campus Directory</span>
          <h1 className="font-display text-3xl font-extrabold text-slate-950">University & College Discovery</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Browse higher education institutions and their faculty departments</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search university, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600 shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Colleges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((col) => {
          const isSelected = selectedCollegeId === col.id;
          return (
            <ThreeDTile
              key={col.id}
              variant={isSelected ? 'gold' : 'default'}
              onClick={() => setSelectedCollegeId(isSelected ? null : col.id)}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center font-bold shadow-md shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  {col.website && (
                    <a
                      href={col.website}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-slate-400 hover:text-indigo-900 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Visit University Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-slate-950 mb-1">{col.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{col.city}, {col.state}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 py-3 border-t border-slate-200/60">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> {col.departmentsCount} Departments</span>
                  <span className="flex items-center gap-1.5 text-amber-900"><Users className="w-3.5 h-3.5 text-amber-600" /> {col.professorsCount} Faculty</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/professors?collegeId=${col.id}`);
                  }}
                  className="w-full mt-2 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>View Faculty Members</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ThreeDTile>
          );
        })}
      </div>

      {/* Selected College Department Drawer */}
      {selectedCollegeId && (
        <div className="bg-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-700/50 mt-8 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-xl text-amber-400">
              Departments at {colleges.find(c => c.id === selectedCollegeId)?.name}
            </h3>
            <button
              onClick={() => setSelectedCollegeId(null)}
              className="text-xs text-indigo-300 hover:text-white underline cursor-pointer"
            >
              Close Drawer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => navigate(`/professors?collegeId=${selectedCollegeId}&departmentId=${dept.id}`)}
                className="bg-indigo-900/80 hover:bg-indigo-900 p-3.5 rounded-xl border border-indigo-700/60 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="text-xs font-semibold text-white">{dept.name}</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
