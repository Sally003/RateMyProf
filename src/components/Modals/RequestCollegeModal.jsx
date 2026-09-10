import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function RequestCollegeModal({ isOpen, onClose, onRequestSubmitted }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !state.trim()) return;

    try {
      setIsSubmitting(true);
      await DataService.requestMissingCollege({
        name: name.trim(),
        city: city.trim(),
        state: state.trim(),
        website: website.trim(),
        description: description.trim()
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Add Missing University</h3>
              <p className="text-xs text-indigo-200">Submit a college for admin verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h4 className="font-display font-bold text-lg text-slate-900">University Submitted</h4>
              <p className="text-xs text-slate-500 mt-1">Our platform admin team will verify the details and publish the university shorty.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University / College Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Delhi or IISc Bengaluru"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://university.edu"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Campus Details (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Any additional details to assist admin verification..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  className="px-5 py-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit University'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
