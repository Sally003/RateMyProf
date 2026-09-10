import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Flag, Award, BookOpen, ThumbsUp, Flame, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import ThreeDTile from '../components/3DTile';
import RatingBreakdownTile from '../components/RatingBreakdownTile';
import { DataService } from '../services/dataService';

export default function ProfessorProfilePage({ onOpenSubmitReview, onOpenReportModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfessorData = () => {
    setLoading(true);
    DataService.getProfessorById(id).then(data => {
      setProfessor(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProfessorData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Professor Profile...</p>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-800">Professor Not Found</h2>
        <button onClick={() => navigate('/professors')} className="mt-4 px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold">
          Back to Professors
        </button>
      </div>
    );
  }

  const { ratingStats } = professor;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search Results
      </button>

      {/* PROFESSOR HEADER (3D TILE INDIGO) */}
      <ThreeDTile variant="indigo" hover={false} className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={professor.profileUrl}
              alt={professor.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{professor.verificationStatus}</span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">{professor.name}</h1>
              <p className="text-sm text-indigo-200 font-medium">{professor.designation} • {professor.departmentName}</p>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">{professor.collegeName}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenSubmitReview(professor)}
              className="flex-1 md:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Submit Review
            </button>
          </div>
        </div>
      </ThreeDTile>

      {/* 3D CATEGORY RATING BREAKDOWN TILE */}
      <RatingBreakdownTile stats={ratingStats} />

      {/* COURSES TAUGHT PILL TAGS */}
      {professor.courses && professor.courses.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Courses Taught
          </h3>
          <div className="flex flex-wrap gap-2">
            {professor.courses.map(c => (
              <span key={c.id} className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200">
                <strong className="text-indigo-900">{c.courseCode}</strong> - {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS FEED SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-slate-950">
            Student Reviews ({professor.reviews.length})
          </h2>
        </div>

        {professor.reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">No reviews published yet for this professor.</p>
            <button
              onClick={() => onOpenSubmitReview(professor)}
              className="mt-3 px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-bold"
            >
              Be the first to post a review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {professor.reviews.map((rev) => (
              <ThreeDTile key={rev.id} variant="default" hover={false} className="p-6">
                
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    
                    {/* Privacy Anonymity Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {rev.credibilityLabel || 'Verified Student'}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      {rev.courseName} • {rev.semester} {rev.academicYear}
                    </span>
                  </div>

                  {/* Flag / Report Button */}
                  <button
                    onClick={() => onOpenReportModal(rev.id)}
                    className="self-start sm:self-auto text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Report suspicious or abusive review"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>

                {/* Ratings Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200/60 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Teaching</div>
                    <div className="font-display font-extrabold text-indigo-900">{rev.teachingRating} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Marking</div>
                    <div className="font-display font-extrabold text-indigo-900">{rev.markingRating} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Comm</div>
                    <div className="font-display font-extrabold text-indigo-900">{rev.communicationRating} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Approach</div>
                    <div className="font-display font-extrabold text-indigo-900">{rev.approachabilityRating} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Difficulty</div>
                    <div className="font-display font-extrabold text-amber-600">{rev.difficultyRating} / 5</div>
                  </div>
                </div>

                {/* Review Written Text */}
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  "{rev.reviewText}"
                </p>

                {/* Footer timestamp & Take Again status */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <ThumbsUp className={`w-3.5 h-3.5 ${rev.wouldTakeAgain ? 'text-emerald-600' : 'text-slate-400'}`} />
                    Would Take Again: <strong className={rev.wouldTakeAgain ? 'text-emerald-700' : 'text-slate-600'}>{rev.wouldTakeAgain ? 'Yes' : 'No'}</strong>
                  </span>
                  <span>Posted {new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>

              </ThreeDTile>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
