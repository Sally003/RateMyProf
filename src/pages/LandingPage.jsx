import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShieldCheck, Star, Award, GraduationCap, Building2, BookOpen, ThumbsUp, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import ThreeDTile from '../components/3DTile';
import { DataService } from '../services/dataService';

export default function LandingPage({ onOpenAuth, onOpenRequestModal }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [topProfessors, setTopProfessors] = useState([]);

  useEffect(() => {
    DataService.getColleges().then(setFeaturedColleges);
    DataService.getProfessors().then(profs => {
      // Sort by overall rating
      const sorted = [...profs].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
      setTopProfessors(sorted.slice(0, 3));
    });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION WITH 3D EMBEDDED TILE SEARCH */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-semibold mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>100% Anonymous • Faculty Verified • Duplicate Protected</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Discover & Rate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-600">Professors</span> With Confidence
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Real academic feedback by students, for students. Evaluate teaching quality, marking fairness, communication, and course difficulty anonymously.
          </p>

          {/* 3D Search Tile */}
          <div className="mt-8 max-w-2xl mx-auto">
            <ThreeDTile variant="glass" hover={false} className="p-3 shadow-2xl border-indigo-100">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-900" />
                  <input
                    type="text"
                    placeholder="Search by professor name, university, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-950 to-indigo-900 hover:from-indigo-900 hover:to-indigo-850 text-amber-400 font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-700/50 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </ThreeDTile>
          </div>

          {/* Quick Stat Highlights */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="tile-3d p-4 text-center">
              <div className="font-display font-bold text-2xl text-indigo-950">500+</div>
              <div className="text-xs font-semibold text-slate-500">Verified Universities</div>
            </div>
            <div className="tile-3d p-4 text-center">
              <div className="font-display font-bold text-2xl text-amber-600">12,000+</div>
              <div className="text-xs font-semibold text-slate-500">Rated Professors</div>
            </div>
            <div className="tile-3d p-4 text-center">
              <div className="font-display font-bold text-2xl text-indigo-950">4.8 / 5</div>
              <div className="text-xs font-semibold text-slate-500">Credibility Rating</div>
            </div>
            <div className="tile-3d p-4 text-center">
              <div className="font-display font-bold text-2xl text-emerald-600">100%</div>
              <div className="text-xs font-semibold text-slate-500">Privacy Protection</div>
            </div>
          </div>

        </div>
      </section>

      {/* TOP RATED PROFESSORS 3D CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Top Rated Faculty</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">Highest Rated Professors</h2>
          </div>
          <Link to="/professors" className="text-xs font-bold text-indigo-900 hover:text-amber-600 flex items-center gap-1">
            View All Professors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topProfessors.map((prof) => (
            <ThreeDTile 
              key={prof.id} 
              variant="default"
              onClick={() => navigate(`/professors/${prof.id}`)}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <img
                    src={prof.profileUrl}
                    alt={prof.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-indigo-100"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-800 text-amber-400 flex flex-col items-center justify-center shadow-md shrink-0">
                    <span className="font-display text-lg font-bold">{prof.overallRating ? prof.overallRating.toFixed(1) : 'N/A'}</span>
                    <span className="text-[9px] uppercase font-semibold text-slate-300">/ 5.0</span>
                  </div>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-2 border border-emerald-200">
                  {prof.verificationStatus}
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-900">{prof.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{prof.designation} • {prof.departmentName}</p>
                <p className="text-xs text-slate-600 mt-2 font-medium">{prof.collegeName}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">{prof.totalReviews} Student Reviews</span>
                <span className="text-indigo-900 font-bold flex items-center gap-1">
                  Profile <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </ThreeDTile>
          ))}
        </div>
      </section>

      {/* FEATURED UNIVERSITIES / COLLEGES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Campus Directory</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">Explore Featured Colleges</h2>
          </div>
          <Link to="/colleges" className="text-xs font-bold text-indigo-900 hover:text-amber-600 flex items-center gap-1">
            Browse All Universities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredColleges.map((col) => (
            <ThreeDTile
              key={col.id}
              variant="default"
              onClick={() => navigate(`/colleges?id=${col.id}`)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center font-bold border border-indigo-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{col.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{col.city}, {col.state}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mt-4 pt-3 border-t border-slate-100">
                <span>{col.departmentsCount} Departments</span>
                <span className="text-amber-600 font-bold">{col.professorsCount} Faculty Listed</span>
              </div>
            </ThreeDTile>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (3D TILE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Transparent Architecture</span>
          <h2 className="font-display text-3xl font-extrabold text-slate-950">How CampusRate Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ThreeDTile variant="indigo" hover={false} className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg mb-6">
              1
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Search Professor & Course</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Find your professor by college, department, or course code. Inspect verified category ratings for teaching and difficulty.
            </p>
          </ThreeDTile>

          <ThreeDTile variant="gold" hover={false} className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center font-extrabold text-xl shadow-lg mb-6">
              2
            </div>
            <h3 className="font-display font-bold text-xl text-amber-950 mb-2">Submit 4-Pillar Rating</h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              Evaluate Teaching Quality, Marking Fairness, Communication, and Approachability. Duplicate check prevents spamming.
            </p>
          </ThreeDTile>

          <ThreeDTile variant="indigo" hover={false} className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg mb-6">
              3
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">Guaranteed Anonymity</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Your name and email are never shown. Only verified credibility labels ("Verified Student") appear on public feedback.
            </p>
          </ThreeDTile>
        </div>
      </section>

    </div>
  );
}
