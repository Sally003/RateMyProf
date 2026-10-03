import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function RequestProfessorModal({ isOpen, onClose, onRequestSubmitted }) {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [name, setName] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('col-1');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('dept-1');
  const [sourceUrl, setSourceUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      DataService.getColleges().then(setColleges);
      DataService.getDepartments('col-1').then(setDepartments);
    }
  }, [isOpen]);

  const handleCollegeChange = (cId) => {
    setSelectedCollegeId(cId);
    DataService.getDepartments(cId).then(depts => {
      setDepartments(depts);
      if (depts.length > 0) setSelectedDepartmentId(depts[0].id);
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const college = colleges.find(c => c.id === selectedCollegeId);
      const department = departments.find(d => d.id === selectedDepartmentId);

      await DataService.requestMissingProfessor({
        name: name.trim(),
        collegeId: selectedCollegeId,
        collegeName: college ? college.name : 'University',
        departmentId: selectedDepartmentId,
        departmentName: department ? department.name : 'Department',
        sourceUrl: sourceUrl.trim()
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onRequestSubmitted) onRequestSubmitted();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Request Missing Professor</h3>
              <p className="text-xs text-indigo-200">Add a faculty member to RateMyProff</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h4 className="font-display font-bold text-lg text-slate-900">Request Sent</h4>
              <p className="text-xs text-slate-500 mt-1">Our moderation team will verify the directory link and add the professor shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Foster"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                <select
                  value={selectedCollegeId}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Directory Source URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://university.edu/faculty/jane-foster"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
