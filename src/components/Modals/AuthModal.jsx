import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Building2, CheckCircle2, ShieldCheck, Mail, Lock } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function AuthModal({ isOpen, onClose, onUserUpdated }) {
  const [step, setStep] = useState('auth'); // 'auth' | 'onboarding'
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  // User Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Onboarding fields
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('col-1');
  const [selectedDepartment, setSelectedDepartment] = useState('dept-1');
  const [yearOfStudy, setYearOfStudy] = useState('Junior');

  useEffect(() => {
    if (isOpen) {
      const user = DataService.getCurrentUser();
      setName(user.name || '');
      setEmail(user.email || '');
      setSelectedCollege(user.collegeId || 'col-1');
      setSelectedDepartment(user.departmentId || 'dept-1');
      setYearOfStudy(user.yearOfStudy || 'Junior');

      DataService.getColleges().then(setColleges);
      DataService.getDepartments('col-1').then(setDepartments);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setStep('onboarding');
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const updatedUser = DataService.setCurrentUser({
      id: `user-${Date.now()}`,
      name: name || 'Student User',
      email: email || 'student@university.edu',
      collegeId: selectedCollege,
      departmentId: selectedDepartment,
      yearOfStudy: yearOfStudy,
      verificationLevel: 'email_verified',
      isAdmin: false
    });

    if (onUserUpdated) onUserUpdated(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Modal Header (3D Indigo Gradient) */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-indigo-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {step === 'auth' ? (mode === 'login' ? 'Student Sign In' : 'Create Account') : 'Academic Profile Onboarding'}
              </h3>
              <p className="text-xs text-indigo-200">
                {step === 'auth' ? 'Secure authentication for trusted campus reviews' : 'Internal details (never shared publicly)'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === 'auth' ? (
            <div>
              {/* Google OAuth Simulation Button */}
              <button
                type="button"
                onClick={() => setStep('onboarding')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl font-semibold text-slate-700 text-sm transition-all shadow-2xs mb-4 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continue with Google OAuth
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-xs text-slate-400 font-medium">OR EMAIL</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University Email (.edu recommended)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@stanford.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer mt-2"
                >
                  {mode === 'login' ? 'Sign In & Continue' : 'Create Account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-indigo-700 font-semibold hover:underline cursor-pointer"
                >
                  {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Anonymity Guarantee:</strong> Your college, department, and graduation year are stored internally to verify student status, but will <strong>never</strong> be displayed on your public reviews.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select College/University</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Major / Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
