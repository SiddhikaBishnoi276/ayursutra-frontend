// src/Patient/Components/FeedbackFormModal.tsx
// Post-session feedback modal reusing Common Modal with star ratings, VAS slider, and review text

import React, { useState } from 'react';
import { Star, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { Appointment } from '../types/patient.types';
import { SymptomVASTracker } from './SymptomVASTracker';

export interface FeedbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSubmit: (payload: {
    rating: number;
    symptomImprovementScore: number;
    overallExperience: string;
    comments: string;
    therapistPunctualityRating?: number;
    facilityCleanlinessRating?: number;
  }) => Promise<any>;
  isLoading?: boolean;
}

export const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSubmit,
  isLoading = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [improvementScore, setImprovementScore] = useState<number>(2);
  const [overallExperience, setOverallExperience] = useState<string>('Very Relieved');
  const [comments, setComments] = useState<string>('');
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!appointment) return null;

  const experienceOptions = [
    'Very Relieved',
    'Comfortable & Relaxed',
    'Mild Improvement',
    'No Noticeable Change',
    'Mild Post-Session Soreness',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (rating === 0) {
      setErrorMessage('Please select a star rating for this session.');
      return;
    }

    try {
      await onSubmit({
        rating,
        symptomImprovementScore: improvementScore,
        overallExperience,
        comments: comments.trim() || 'Session conducted professionally with noticeable therapeutic relief.',
        therapistPunctualityRating: punctualityRating,
        facilityCleanlinessRating: cleanlinessRating,
      });
      // reset form
      setRating(5);
      setComments('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Feedback & Rating"
      subtitle={`Share your experience for "${appointment.stageName}" with ${appointment.therapistName}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isLoading}
            icon={<Check className="w-4 h-4" />}
            className="bg-purple-700 hover:bg-purple-800"
          >
            {isLoading ? 'Submitting...' : 'Submit Session Feedback'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary 5-Star Rating */}
        <div className="p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 text-center">
          <label className="text-xs font-bold text-gray-900 font-serif block mb-1">
            Overall Session Rating
          </label>
          <p className="text-[11px] text-gray-500 mb-3">
            How would you rate the treatment delivered by {appointment.therapistName}?
          </p>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                title={`${star} Star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-stone-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="block text-xs font-bold text-gray-700 mt-2 font-serif">
            {rating === 5 && 'Outstanding & Restorative'}
            {rating === 4 && 'Very Good Treatment'}
            {rating === 3 && 'Average Experience'}
            {rating === 2 && 'Below Expectations'}
            {rating === 1 && 'Unsatisfactory'}
          </span>
        </div>

        {/* Symptom Relief VAS Scale */}
        <SymptomVASTracker
          value={improvementScore}
          onChange={setImprovementScore}
          label="Post-Session Pain / Stiffness Level (VAS Score)"
          subtitle="Rate your current level of discomfort after this session (0 = completely pain-free)."
        />

        {/* Overall Experience Pill Selection */}
        <div>
          <label className="text-xs font-bold text-gray-900 font-serif block mb-1.5">
            How do you feel after this session?
          </label>
          <div className="flex flex-wrap gap-2">
            {experienceOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setOverallExperience(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  overallExperience === opt
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Ratings (Punctuality & Cleanliness) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div className="p-3 bg-white rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-bold text-gray-800 block mb-1.5">
              Therapist Care & Punctuality
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPunctualityRating(s)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      punctualityRating >= s
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-bold text-gray-800 block mb-1.5">
              Chamber Hygiene & Ambiance
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCleanlinessRating(s)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      cleanlinessRating >= s
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="text-xs font-bold text-gray-900 font-serif block mb-1">
            Personal Comments & Physical Sensations (Optional)
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any sensations, relief, muscle warmth, or suggestions for your next session..."
            className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:border-purple-600 focus:outline-none bg-white placeholder-gray-400"
          />
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackFormModal;
