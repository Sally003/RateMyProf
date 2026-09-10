import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Users, Building2, BookOpen, MessageSquare, Plus, Activity, UserPlus, Check, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ThreeDTile from '../components/3DTile';
import { DataService } from '../services/dataService';

export default function AdminDashboardPage({ onUserUpdated }) {
  const currentUser = DataService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'requests' | 'add_prof' | 'analytics'
  const [stats, setStats] = useState(null);
  const [moderationQueue, setModerationQueue] = useState([]);
  const [collegeRequests, setCollegeRequests] = useState([]);
  const [professorRequests, setProfessorRequests] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  // New Prof Form State
  const [profName, setProfName] = useState('');
  const [profDesignation, setProfDesignation] = useState('Assistant Professor');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Faculty Verified');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAdminData = async () => {
    const adminStats = await DataService.getAdminStats();
    setStats(adminStats);
    
    const queue = await DataService.getModerationQueue();
    setModerationQueue(queue);
    
    const colReqs = await DataService.getCollegeRequests();
    setCollegeRequests(colReqs);

    const profReqs = await DataService.getProfessorRequests();
    setProfessorRequests(profReqs);

    const cols = await DataService.getColleges();
    setColleges(cols);
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

  const handleModerationAction = async (reviewId, action) => {
    await DataService.updateReviewStatus(reviewId, action);
    loadAdminData();
  };

  const handleApproveCollegeReq = async (reqId) => {
    await DataService.approveCollegeRequest(reqId);
    setSuccessMsg('University approved and added to site catalog!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleApproveProfReq = async (reqId) => {
    await DataService.approveProfessorRequest(reqId, 'Faculty Verified');
    setSuccessMsg('Professor approved and published to faculty search!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRejectReq = async (type, reqId) => {
    await DataService.rejectRequest(type, reqId);
    loadAdminData();
  };

  const handleAddProfessor = async (e) => {
    e.preventDefault();
    if (!profName.trim()) return;

    const college = colleges.find(c => c.id === selectedCollegeId);
    const department = departments.find(d => d.id === selectedDepartmentId);

    await DataService.addProfessor({
      name: profName.trim(),
      designation: profDesignation,
      collegeId: selectedCollegeId,
      collegeName: college ? college.name : 'University',
      departmentId: selectedDepartmentId,
      departmentName: department ? department.name : 'Department',
      verificationStatus
    });

    setProfName('');
    setSuccessMsg('Professor added and directory updated!');
    loadAdminData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!currentUser.isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ThreeDTile variant="indigo" hover={false} className="p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-2xl text-white">Admin Role Required</h2>
          <p className="text-xs text-indigo-200 mt-2 max-w-md mx-auto">
            You are currently in Student View mode. Click the <strong>Admin Mode</strong> toggle button in the top navigation bar to switch roles and access the moderation queue.
          </p>
          <button
            onClick={() => {
              DataService.toggleAdminRole(true);
              if (onUserUpdated) onUserUpdated(DataService.getCurrentUser());
              loadAdminData();
            }}
            className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg cursor-pointer"
          >
            Switch to Admin Mode Now
          </button>
        </ThreeDTile>
      </div>
    );
  }

  // Analytics Chart Sample Data
  const ratingDistributionData = [
    { rating: '5 Star', count: 420 },
    { rating: '4 Star', count: 310 },
    { rating: '3 Star', count: 140 },
    { rating: '2 Star', count: 65 },
    { rating: '1 Star', count: 35 },
  ];

  const reviewVolumeData = [
    { month: 'Sep', count: 120 },
    { month: 'Oct', count: 240 },
    { month: 'Nov', count: 480 },
    { month: 'Dec', count: 920 },
    { month: 'Jan', count: 650 },
    { month: 'Feb', count: 810 },
  ];

  const pendingCollegeReqs = collegeRequests.filter(r => r.status === 'pending');
  const pendingProfReqs = professorRequests.filter(r => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-extrabold uppercase">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 font-semibold">Moderation & Verification Operations</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-950">CampusRate Control Center</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'moderation' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reviews Queue ({stats?.pendingModerationCount || 0})
          </button>
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests' ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Verification Queue ({pendingCollegeReqs.length + pendingProfReqs.length})
          </button>

          <button
            onClick={() => setActiveTab('add_prof')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'add_prof' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Add Professor
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* 3D STAT TILES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ThreeDTile variant="default" hover={false} className="p-4">
          <div className="text-xs font-semibold text-slate-500">Total Universities</div>
          <div className="font-display font-extrabold text-2xl text-indigo-950 mt-1">{stats?.totalColleges || 0}</div>
        </ThreeDTile>
        
        <ThreeDTile variant="default" hover={false} className="p-4">
          <div className="text-xs font-semibold text-slate-500">Total Professors</div>
          <div className="font-display font-extrabold text-2xl text-indigo-950 mt-1">{stats?.totalProfessors || 0}</div>
        </ThreeDTile>

        <ThreeDTile variant="gold" hover={false} className="p-4">
          <div className="text-xs font-bold text-amber-900">Pending Submissions</div>
          <div className="font-display font-extrabold text-2xl text-amber-950 mt-1">
            {(pendingCollegeReqs.length + pendingProfReqs.length)}
          </div>
        </ThreeDTile>

        <ThreeDTile variant="default" hover={false} className="p-4 border-rose-200 bg-rose-50/50">
          <div className="text-xs font-bold text-rose-800">Flagged Reviews</div>
          <div className="font-display font-extrabold text-2xl text-rose-950 mt-1">{stats?.flaggedReviewsCount || 0}</div>
        </ThreeDTile>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* TAB 1: REVIEWS MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">Review Moderation & Fraud Signal Queue</h2>

          {moderationQueue.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Moderation Queue Clear</p>
              <p className="text-xs text-slate-500 mt-1">No pending or flagged reviews require review right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moderationQueue.map((rev) => (
                <ThreeDTile key={rev.id} variant="default" hover={false} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          rev.status === 'flagged' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          Status: {rev.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{rev.courseName}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Credibility Score: <span className="text-indigo-900">{rev.credibilityScore}%</span> | Risk Score: <span className={rev.riskScore > 30 ? 'text-rose-600' : 'text-slate-600'}>{rev.riskScore}%</span>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleModerationAction(rev.id, 'approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerationAction(rev.id, 'rejected')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">"{rev.reviewText}"</p>
                </ThreeDTile>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VERIFICATION & REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="space-y-8">
          
          {/* SECTION A: PENDING COLLEGE REQUESTS */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              Student University Submissions ({pendingCollegeReqs.length})
            </h2>

            {pendingCollegeReqs.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 font-semibold">
                No pending university requests to verify.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingCollegeReqs.map(req => (
                  <ThreeDTile key={req.id} variant="gold" hover={false} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                          Pending University
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-950">{req.name}</h3>
                      <p className="text-xs text-amber-900 font-semibold">{req.city}, {req.state}</p>
                      {req.website && <p className="text-xs text-indigo-900 mt-1 underline">{req.website}</p>}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-300/60">
                      <button
                        onClick={() => handleApproveCollegeReq(req.id)}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" /> Approve & Publish
                      </button>
                      <button
                        onClick={() => handleRejectReq('college', req.id)}
                        className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </ThreeDTile>
                ))}
              </div>
            )}
          </div>

          {/* SECTION B: PENDING PROFESSOR REQUESTS */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Student Faculty Submissions ({pendingProfReqs.length})
            </h2>

            {pendingProfReqs.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 font-semibold">
                No pending professor requests to verify.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingProfReqs.map(req => (
                  <ThreeDTile key={req.id} variant="default" hover={false} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                          Pending Professor
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-950">{req.name}</h3>
                      <p className="text-xs text-slate-600 font-medium">{req.departmentName} • {req.collegeName}</p>
                      {req.sourceUrl && <p className="text-xs text-indigo-900 mt-1 underline">{req.sourceUrl}</p>}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleApproveProfReq(req.id)}
                        className="flex-1 py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4 text-amber-400" /> Approve & Verify
                      </button>
                      <button
                        onClick={() => handleRejectReq('prof', req.id)}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </ThreeDTile>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: ADD PROFESSOR FORM */}
      {activeTab === 'add_prof' && (
        <ThreeDTile variant="glass" hover={false} className="max-w-2xl mx-auto p-6">
          <h2 className="font-display font-bold text-xl text-slate-900 mb-4">Add Faculty Member Manually</h2>

          <form onSubmit={handleAddProfessor} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Professor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Robert Chen"
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <select
                  value={profDesignation}
                  onChange={(e) => setProfDesignation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Adjunct Professor">Adjunct Professor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Status Badge</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Official Source Verified">Official Source Verified</option>
                  <option value="Faculty Verified">Faculty Verified</option>
                  <option value="Community Submitted">Community Submitted</option>
                  <option value="Pending Verification">Pending Verification</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University</label>
                <select
                  value={selectedCollegeId}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer mt-2"
            >
              Add Professor to Platform Directory
            </button>
          </form>
        </ThreeDTile>
      )}

      {/* TAB 4: RECHARTS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreeDTile variant="default" hover={false} className="p-6">
            <h3 className="font-display font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Ratings Score Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistributionData}>
                  <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4338ca" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ThreeDTile>

          <ThreeDTile variant="default" hover={false} className="p-6">
            <h3 className="font-display font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Monthly Review Volume Trend
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reviewVolumeData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#fef3c7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ThreeDTile>
        </div>
      )}

    </div>
  );
}
