import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, ShieldCheck, Mail, Lock, Key, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function AuthPortalModal({ isOpen, onClose, onUserUpdated }) {
  const [portalType, setPortalType] = useState('student'); // 'student' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [step, setStep] = useState('credentials'); // 'credentials' | 'onboarding'
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Onboarding fields for student registration
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('col-in-1');
  const [selectedDepartment, setSelectedDepartment] = useState('dept-in-1');
  const [yearOfStudy, setYearOfStudy] = useState('Junior');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      const user = DataService.getCurrentUser();
      setName(user.name || '');
      setEmail(user.email || '');
      setSelectedCollege(user.collegeId || 'col-in-1');
      setSelectedDepartment(user.departmentId || 'dept-in-1');

      DataService.getColleges().then(setColleges);
      DataService.getDepartments('col-in-1').then(setDepartments);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isEduDomain = email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in');

  const handleCollegeSelectChange = async (cId) => {
    setSelectedCollege(cId);
    const depts = await DataService.getDepartments(cId);
    setDepartments(depts);
    if (depts.length > 0) setSelectedDepartment(depts[0].id);
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (portalType === 'admin') {
        if (authMode === 'signup') {
          const user = DataService.registerAccount({
            name: name || 'Admin User',
            email,
            password: password || adminKey,
            role: 'admin',
            adminKey: adminKey.trim()
          });
          if (onUserUpdated) onUserUpdated(user);
          onClose();
        } else {
          const user = DataService.loginAccount({
            email,
            password: password || adminKey.trim(),
            portalType: 'admin'
          });
          if (onUserUpdated) onUserUpdated(user);
          onClose();
        }
      } else {
        if (authMode === 'signup' && step === 'credentials') {
          setStep('onboarding');
        } else {
          const user = DataService.loginAccount({
            email,
            password,
            portalType: 'student'
          });
          if (onUserUpdated) onUserUpdated(user);
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    }
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const collegeObj = colleges.find(c => c.id === selectedCollege);
      const user = DataService.registerAccount({
        name: name || 'Student User',
        email,
        password,
        role: 'student',
        collegeId: selectedCollege,
        collegeName: collegeObj ? collegeObj.name : 'University',
        departmentId: selectedDepartment,
        yearOfStudy
      });
      if (onUserUpdated) onUserUpdated(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete registration.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/80 overflow-hidden relative">
        
        {/* MODAL HEADER: DUAL PORTAL SWITCHER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-indigo-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold shadow-lg border border-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">RateMyProff Portal</h3>
              <p className="text-xs text-indigo-200 font-medium">Verified Academic Feedback & Moderation</p>
            </div>
          </div>

          {/* PORTAL SELECTOR TABS */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-indigo-700/40">
            <button
              onClick={() => {
                setPortalType('student');
                setErrorMsg('');
                setStep('credentials');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                portalType === 'student'
                  ? 'bg-gradient-to-r from-indigo-800 to-indigo-700 text-white shadow-md border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              Student Access
            </button>

            <button
              onClick={() => {
                setPortalType('admin');
                setErrorMsg('');
                setStep('credentials');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                portalType === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Access Portal
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6">

          {/* AUTH MODE TOGGLE (Sign In vs Register) */}
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <div className="text-sm font-extrabold text-slate-900">
              {portalType === 'admin' 
                ? (authMode === 'login' ? 'Administrator Sign In' : 'Register Admin Account')
                : (authMode === 'login' ? 'Student & Faculty Sign In' : 'Create Student Account')}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setStep('credentials'); }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  authMode === 'login' ? 'bg-indigo-100 text-indigo-950 border border-indigo-200' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); setStep('credentials'); }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  authMode === 'signup' ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              
              {portalType === 'admin' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Authorized Admin Portal Access
                  </div>
                  <p className="text-[11px] text-amber-900">
                    Use Admin email <code className="bg-amber-200 font-mono px-1 py-0.5 rounded">admin@ratemyproff.edu</code> and passcode <code className="bg-amber-200 font-mono px-1 py-0.5 rounded">ADMIN-2026</code>.
                  </p>
                </div>
              )}

              {/* Full Name for Signup */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {portalType === 'admin' ? 'Admin Email Address' : 'Email Address'}
                  </label>
                  {isEduDomain && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Academic Email Verified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={portalType === 'admin' ? 'admin@ratemyproff.edu' : 'student@ratemyproff.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {portalType === 'admin' ? 'Passcode / Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Admin Security Key (Only in Admin Mode) */}
              {portalType === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Security Passcode
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminKey ? 'text' : 'password'}
                      required
                      placeholder="ADMIN-2026"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminKey(!showAdminKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3.5 font-extrabold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  portalType === 'admin'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-indigo-900 hover:bg-indigo-950 text-white'
                }`}
              >
                <span>{portalType === 'admin' ? 'Authenticate Admin Portal' : (authMode === 'login' ? 'Sign In' : 'Continue to Onboarding')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ONBOARDING STEP FOR STUDENT REGISTRATION */
            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                <strong>University Onboarding:</strong> Select your primary institution and major.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select College/University</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => handleCollegeSelectChange(e.target.value)}
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
                  onClick={() => setStep('credentials')}
                  className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Complete Registration & Launch
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
