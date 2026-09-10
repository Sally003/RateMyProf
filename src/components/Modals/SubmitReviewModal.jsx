import React, { useState, useEffect } from 'react';
import { X, Star, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DataService } from '../../services/dataService';

export default function SubmitReviewModal({ isOpen, onClose, professor, onReviewSubmitted }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [semester, setSemester] = useState('Fall');
  const [academicYear, setAcademicYear] = useState(2025);
  
  // Ratings (1-5)
  const [teachingRating, setTeachingRating] = useState(5);
  const [markingRating, setMarkingRating] = useState(4);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [approachabilityRating, setApproachabilityRating] = useState(5);
  const [difficultyRating, setDifficultyRating] = useState(3);
  
  const [wouldTakeAgain, setWouldTakeAgain] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && professor) {
      setErrorMsg('');
      DataService.getCourses(professor.collegeId, professor.departmentId).then(list => {
        setCourses(list);
        if (list.length > 0) setSelectedCourseId(list[0].id);
      });
    }
  }, [isOpen, professor]);

  if (!isOpen || !professor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (reviewText.trim().length < 15) {
      setErrorMsg('Review text must be at least 15 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedCourse = courses.find(c => c.id === selectedCourseId);
      const courseName = selectedCourse ? `${selectedCourse.courseCode} - ${selectedCourse.name}` : 'General Course';

      await DataService.submitReview({
        profId: professor.id,
        courseId: selectedCourseId,
        courseName,
        teachingRating,
        markingRating,
        communicationRating,
        approachabilityRating,
        difficultyRating,
        wouldTakeAgain,
        reviewText: reviewText.trim(),
        semester,
        academicYear
      });

      setIsSubmitting(false);
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error submitting review. Please check duplicate entries.');
    }
  };

  const StarRatingInput = ({ label, value, onChange, subtitle }) => (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <span className="font-display text-sm font-extrabold text-indigo-900">{value} / 5</span>
      </div>
      {subtitle && <p className="text-[10px] text-slate-500 mb-2">{subtitle}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              star <= value 
                ? 'text-amber-500 hover:scale-110' 
                : 'text-slate-300 hover:text-slate-400'
            }`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">Rate Professor</span>
            <h3 className="font-display font-bold text-lg text-white">{professor.name}</h3>
            <p className="text-xs text-indigo-200">{professor.departmentName} • {professor.collegeName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-indigo-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Anonymity Shield Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Anonymous Review:</strong> Your name/email is stripped. Public tag will display as <em>Verified Student</em>.</span>
          </div>

          {/* Course & Term Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.courseCode} - {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>

          {/* Rating Categories Grid (4 Pillars) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StarRatingInput label="Teaching Quality" value={teachingRating} onChange={setTeachingRating} subtitle="Clarity & delivery of lecture material" />
            <StarRatingInput label="Marking Fairness" value={markingRating} onChange={setMarkingRating} subtitle="Transparency & grading accuracy" />
            <StarRatingInput label="Communication" value={communicationRating} onChange={setCommunicationRating} subtitle="Responsiveness to questions" />
            <StarRatingInput label="Approachability" value={approachabilityRating} onChange={setApproachabilityRating} subtitle="Office hours helpfulness" />
          </div>

          {/* Difficulty & Would Take Again */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StarRatingInput label="Course Difficulty" value={difficultyRating} onChange={setDifficultyRating} subtitle="1 = Easy, 5 = Extremely Hard" />
            
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950">Would Take Again?</span>
                <p className="text-[10px] text-amber-800">Would you take another class with this prof?</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setWouldTakeAgain(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    wouldTakeAgain ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setWouldTakeAgain(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !wouldTakeAgain ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Written Feedback Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Written Feedback & Review Text
              <span className="text-slate-400 font-normal"> (min 15 chars)</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your experience with lectures, coursework, exams, and advice for future students..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Anonymous Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
