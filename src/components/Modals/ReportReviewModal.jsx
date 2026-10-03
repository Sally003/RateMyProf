import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function ReportReviewModal({ isOpen, onClose, reviewId, onReportSubmitted }) {
  const [reason, setReason] = useState('Spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !reviewId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await DataService.reportReview({
        reviewId,
        reason,
        details
      });
      setIsSubmitting(false);
      setSubmitted(true);
      if (onReportSubmitted) onReportSubmitted();
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
        <div className="bg-rose-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Report Review</h3>
              <p className="text-xs text-rose-200">Help keep RateMyProff accurate & trustworthy</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3 animate-bounce" />
              <h4 className="font-display font-bold text-lg text-slate-900">Report Submitted</h4>
              <p className="text-xs text-slate-500 mt-1">Our moderation queue has flagged this review for admin investigation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Reporting</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-rose-600"
                >
                  <option value="Spam">Spam or Promotional content</option>
                  <option value="Abusive">Abusive or Profane language</option>
                  <option value="Personal attack">Personal attack or harassment</option>
                  <option value="Personal info">Contains private personal information</option>
                  <option value="Suspected fake">Suspected fake or bot review</option>
                  <option value="Other">Other rule violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide any context that will help our moderators..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-600 focus:bg-white"
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Flagging...' : 'Submit Flag'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
