import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Users, Building2, BookOpen, Plus, UserCheck, Trash2, Edit3, Lock, History, Sparkles } from 'lucide-react';
import ThreeDTile from '../components/3DTile';
import { DataService } from '../services/dataService';

export default function AdminDashboardPage({ onUserUpdated, onOpenAuth }) {
  const [currentUser, setCurrentUser] = useState(DataService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'professors' | 'colleges' | 'users' | 'requests' | 'add_prof' | 'audit'
  const [stats, setStats] = useState(null);
  
  // Data State
  const [moderationQueue, setModerationQueue] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [professorsList, setProfessorsList] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [collegeRequests, setCollegeRequests] = useState([]);
  const [professorRequests, setProfessorRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Editing state
  const [editingProf, setEditingProf] = useState(null);
  const [editingCollege, setEditingCollege] = useState(null);

  // New Prof Form State
  const [profName, setProfName] = useState('');
  const [profDesignation, setProfDesignation] = useState('Assistant Professor');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Faculty Verified');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAdminData = async () => {
    setCurrentUser(DataService.getCurrentUser());
    const adminStats = await DataService.getAdminStats();
    setStats(adminStats);
    
    const queue = await DataService.getModerationQueue();
    setModerationQueue(queue);

    const revs = await DataService.getAllReviews();
    setAllReviews(revs);
    
    const profs = await DataService.getProfessors();
    setProfessorsList(profs);

    const cols = await DataService.getColleges();
    setCollegesList(cols);

    const accs = DataService.getAccounts();
    setAccountsList(accs);
    
    const colReqs = await DataService.getCollegeRequests();
    setCollegeRequests(colReqs);

    const profReqs = await DataService.getProfessorRequests();
    setProfessorRequests(profReqs);

    const logs = DataService.getAuditLogs();
    setAuditLogs(logs);

    if (cols.length > 0) {
      setSelectedCollegeId(cols[0].id);
      const depts = await DataService.getDepartments(cols[0].id);
      setDepartments(depts);
      if (depts.length > 0) setSelectedDepartmentId(depts[0].id);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCollegeChange = async (cId) => {
    setSelectedCollegeId(cId);
    const depts = await DataService.getDepartments(cId);
    setDepartments(depts);
    if (depts.length > 0) setSelectedDepartmentId(depts[0].id);
  };

  // --- CRUD ACTIONS ---
  const handleModerationAction = async (reviewId, action) => {
    await DataService.updateReviewStatus(reviewId, action);
    DataService.logAdminAction(`REVIEW_${action.toUpperCase()}`, `Updated review #${reviewId} to ${action}`);
    loadAdminData();
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review entry?')) {
      await DataService.deleteReview(reviewId);
      setSuccessMsg('Review deleted permanently.');
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleDeleteProfessor = async (profId) => {
    if (window.confirm('Are you sure you want to remove this professor from RateMyProff?')) {
      await DataService.deleteProfessor(profId);
      setSuccessMsg('Professor record deleted.');
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleUpdateProfessorSubmit = async (e) => {
    e.preventDefault();
    if (!editingProf) return;
    await DataService.updateProfessor(editingProf.id, editingProf);
    setEditingProf(null);
    setSuccessMsg('Professor details updated successfully.');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to remove this institution?')) {
      await DataService.deleteCollege(collegeId);
      setSuccessMsg('University record removed.');
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleUpdateCollegeSubmit = async (e) => {
    e.preventDefault();
    if (!editingCollege) return;
    await DataService.updateCollege(editingCollege.id, editingCollege);
    setEditingCollege(null);
    setSuccessMsg('University details updated successfully.');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteAccount = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      await DataService.deleteAccount(userId);
      setSuccessMsg('User account deleted.');
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleToggleUserRole = async (userId) => {
    await DataService.toggleAccountRole(userId);
    setSuccessMsg('User role updated.');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleApproveCollegeReq = async (reqId) => {
    const col = await DataService.approveCollegeRequest(reqId);
    DataService.logAdminAction('COLLEGE_APPROVED', `Approved university submission: ${col ? col.name : reqId}`);
    setSuccessMsg('University approved and added to site catalog!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleApproveProfReq = async (reqId) => {
    const prof = await DataService.approveProfessorRequest(reqId, 'Faculty Verified');
    DataService.logAdminAction('PROFESSOR_APPROVED', `Approved faculty member submission: ${prof ? prof.name : reqId}`);
    setSuccessMsg('Professor approved and published to faculty search!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRejectReq = async (type, reqId) => {
    await DataService.rejectRequest(type, reqId);
    DataService.logAdminAction('REQUEST_REJECTED', `Rejected ${type} submission #${reqId}`);
    loadAdminData();
  };

  const handleAddProfessor = async (e) => {
    e.preventDefault();
    if (!profName.trim()) return;

    const college = collegesList.find(c => c.id === selectedCollegeId);
    const department = departments.find(d => d.id === selectedDepartmentId);

    const newProf = await DataService.addProfessor({
      name: profName.trim(),
      designation: profDesignation,
      collegeId: selectedCollegeId,
      collegeName: college ? college.name : 'University',
      departmentId: selectedDepartmentId,
      departmentName: department ? department.name : 'Department',
      verificationStatus
    });

    DataService.logAdminAction('PROFESSOR_ADDED_MANUALLY', `Added faculty member ${newProf.name} to ${newProf.collegeName}`);
    setProfName('');
    setSuccessMsg('Professor added and directory updated!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSecurityLock = () => {
    const user = DataService.logout();
    if (onUserUpdated) onUserUpdated(user);
    setCurrentUser(user);
  };

  if (!currentUser.isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ThreeDTile variant="indigo" hover={false} className="p-8 text-center shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-2xl text-white">RateMyProff Admin Authorization Required</h2>
          <p className="text-xs text-indigo-200 mt-2 max-w-md mx-auto">
            Sign in as Administrator with email <code className="bg-indigo-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">admin@ratemyproff.edu</code> and passcode <code className="bg-indigo-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">ADMIN-2026</code> to access full site management authority.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg cursor-pointer transition-all"
            >
              Sign In to Admin Command Portal →
            </button>
          </div>
        </ThreeDTile>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ACTIVE ADMIN BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-3xl text-white shadow-2xl border border-indigo-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg border-2 border-amber-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Full Management Authority Enabled
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white">RateMyProff Command Center</h1>
            <p className="text-xs text-indigo-200">Session: {currentUser.name} ({currentUser.email})</p>
          </div>
        </div>

        <button
          onClick={handleSecurityLock}
          className="px-4 py-2 bg-slate-900 hover:bg-rose-950 text-rose-300 hover:text-rose-200 font-bold text-xs rounded-xl border border-rose-800/40 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Lock className="w-4 h-4 text-rose-400" />
          <span>Lock Admin Session</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* METRICS METERS */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ThreeDTile variant="indigo" hover={false} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-indigo-200">Institutions</span>
            </div>
            <div className="font-display font-extrabold text-2xl text-white">{stats.totalColleges}</div>
          </ThreeDTile>

          <ThreeDTile variant="indigo" hover={false} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-indigo-200">Faculty Directory</span>
            </div>
            <div className="font-display font-extrabold text-2xl text-white">{stats.totalProfessors}</div>
          </ThreeDTile>

          <ThreeDTile variant="indigo" hover={false} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-indigo-200">Pending Reviews</span>
            </div>
            <div className="font-display font-extrabold text-2xl text-amber-400">{stats.pendingModerationCount}</div>
          </ThreeDTile>

          <ThreeDTile variant="indigo" hover={false} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-indigo-200">User Accounts</span>
            </div>
            <div className="font-display font-extrabold text-2xl text-white">{accountsList.length}</div>
          </ThreeDTile>
        </div>
      )}

      {/* ADMIN CONTROL TABS */}
      <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-indigo-900/60 overflow-x-auto gap-1">
        {[
          { id: 'moderation', label: `Reviews & Moderation (${moderationQueue.length})`, icon: AlertTriangle },
          { id: 'professors', label: `Faculty Directory (${professorsList.length})`, icon: BookOpen },
          { id: 'colleges', label: `Universities (${collegesList.length})`, icon: Building2 },
          { id: 'users', label: `User Accounts (${accountsList.length})`, icon: Users },
          { id: 'requests', label: `Pending Requests (${collegeRequests.length + professorRequests.length})`, icon: Plus },
          { id: 'add_prof', label: 'Add Professor', icon: Plus },
          { id: 'audit', label: 'Audit Logs', icon: History }
        ].map(t => {
          const IconComponent = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MODERATION & ALL REVIEWS */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-extrabold text-lg text-slate-900">Review Moderation Queue & Catalog</h2>
            <span className="text-xs font-bold text-slate-500">Total Reviews: {allReviews.length}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allReviews.map(rev => (
              <ThreeDTile key={rev.id} variant="default" hover={false} className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        rev.status === 'flagged' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        STATUS: {rev.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-indigo-950">{rev.courseName}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      "{rev.reviewText}"
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Submitted by: {rev.credibilityLabel} • Teaching Rating: {rev.teachingRating}/5 • Date: {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleModerationAction(rev.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </ThreeDTile>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FACULTY DIRECTORY MANAGEMENT */}
      {activeTab === 'professors' && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-lg text-slate-900">Faculty Directory Management (Full CRUD Authority)</h2>

          {/* EDIT PROFESSOR MODAL FORM */}
          {editingProf && (
            <div className="p-6 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-4">
              <h3 className="font-bold text-amber-950 text-sm">Editing Faculty Member: {editingProf.name}</h3>
              <form onSubmit={handleUpdateProfessorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingProf.name}
                    onChange={(e) => setEditingProf({ ...editingProf, name: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editingProf.designation}
                    onChange={(e) => setEditingProf({ ...editingProf, designation: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Bio</label>
                  <textarea
                    rows={2}
                    value={editingProf.bio || ''}
                    onChange={(e) => setEditingProf({ ...editingProf, bio: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProf(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professorsList.map(prof => (
              <ThreeDTile key={prof.id} variant="default" hover={false} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{prof.name}</div>
                  <div className="text-xs text-indigo-900 font-semibold">{prof.designation} • {prof.departmentName}</div>
                  <div className="text-[11px] text-slate-500">{prof.collegeName}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingProf(prof)}
                    className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-xl cursor-pointer"
                    title="Edit Professor"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProfessor(prof.id)}
                    className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl cursor-pointer"
                    title="Delete Professor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </ThreeDTile>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: UNIVERSITY CATALOG */}
      {activeTab === 'colleges' && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-lg text-slate-900">University Catalog Management (Full CRUD)</h2>

          {/* EDIT COLLEGE MODAL FORM */}
          {editingCollege && (
            <div className="p-6 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-4">
              <h3 className="font-bold text-amber-950 text-sm">Editing Institution: {editingCollege.name}</h3>
              <form onSubmit={handleUpdateCollegeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">University Name</label>
                  <input
                    type="text"
                    value={editingCollege.name}
                    onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingCollege.city}
                    onChange={(e) => setEditingCollege({ ...editingCollege, city: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCollege(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collegesList.map(col => (
              <ThreeDTile key={col.id} variant="default" hover={false} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{col.name}</div>
                  <div className="text-xs text-slate-600 font-semibold">{col.city}, {col.state}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingCollege(col)}
                    className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-xl cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCollege(col.id)}
                    className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </ThreeDTile>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: USER ACCOUNTS DATABASE */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-lg text-slate-900">User Accounts Credentials Database</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {accountsList.map(acc => (
              <ThreeDTile key={acc.id} variant="default" hover={false} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    acc.isAdmin ? 'bg-amber-500 text-slate-950' : 'bg-indigo-900'
                  }`}>
                    {acc.isAdmin ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      {acc.name}
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        acc.isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-indigo-100 text-indigo-900'
                      }`}>
                        {acc.isAdmin ? 'LEAD ADMIN' : 'STUDENT'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{acc.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleUserRole(acc.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {acc.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </ThreeDTile>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADD PROFESSOR FORM */}
      {activeTab === 'add_prof' && (
        <ThreeDTile variant="default" hover={false} className="p-6 md:p-8 max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-xl text-slate-950 mb-4">Add Faculty Member to RateMyProff</h2>
          <form onSubmit={handleAddProfessor} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Professor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ramesh Kumar"
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select College</label>
              <select
                value={selectedCollegeId}
                onChange={(e) => handleCollegeChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              >
                {collegesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer transition-all"
            >
              Add Professor to Directory
            </button>
          </form>
        </ThreeDTile>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-lg text-slate-900">System Audit Log Stream</h2>
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 bg-slate-900 text-indigo-100 rounded-xl text-xs font-mono flex items-center justify-between border border-indigo-900/40">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded text-[10px]">
                    {log.action}
                  </span>
                  <span>{log.details}</span>
                </div>
                <span className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
