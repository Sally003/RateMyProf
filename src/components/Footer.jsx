import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Anonymity & Trust Banner (Tile 3D Dark) */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 md:p-8 mb-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
                100% Anonymous & Secure Student Reviews
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Privacy Guaranteed</span>
              </h4>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Your identity (name, email, student ID) is strictly protected and never exposed to professors, administrators, or public APIs. Only anonymous credibility labels ("Verified Student" / "Community Review") are displayed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Row Level Security Active
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">CampusRate</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students with transparent, trustworthy academic feedback to make informed course selection decisions.
            </p>
          </div>

          <div>
            <h5 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/colleges" className="hover:text-amber-400 transition-colors">Browse Colleges</Link></li>
              <li><Link to="/professors" className="hover:text-amber-400 transition-colors">Find Professors</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Trust & Safety</h5>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Moderation Queue</span></li>
              <li><span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fraud & Risk Detection</span></li>
              <li><span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Duplicate Check</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4">Verification</h5>
            <p className="text-xs text-slate-400 mb-3">
              Official faculty & source verification badges help differentiate community reviews from verified source entries.
            </p>
            <div className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} CampusRate Inc. All rights reserved.
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
