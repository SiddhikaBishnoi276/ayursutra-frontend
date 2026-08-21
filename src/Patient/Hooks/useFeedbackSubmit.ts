// src/Patient/Hooks/useFeedbackSubmit.ts
// Custom hook for handling feedback modal states and mutation submission

import { useState } from 'react';
import { useSubmitFeedbackMutation } from '../apis/patientApi';
import { Appointment, FeedbackSubmissionPayload } from '../types/patient.types';

export const useFeedbackSubmit = () => {
  const [submitFeedbackMutation, { isLoading, isSuccess, isError, error }] = useSubmitFeedbackMutation();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const openFeedbackModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setSubmittedMessage(null);
  };

  const closeFeedbackModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const submit = async (payload: Omit<FeedbackSubmissionPayload, 'appointmentId' | 'sessionId' | 'stageName' | 'therapistName'>) => {
    if (!selectedAppointment) return;

    try {
      const fullPayload: FeedbackSubmissionPayload = {
        appointmentId: selectedAppointment.id,
        sessionId: selectedAppointment.sessionId,
        stageName: selectedAppointment.stageName,
        therapistName: selectedAppointment.therapistName,
        ...payload,
      };

      const res = await submitFeedbackMutation(fullPayload).unwrap();
      setSubmittedMessage(`Thank you! Your feedback for "${selectedAppointment.stageName}" has been submitted successfully.`);
      closeFeedbackModal();
      return res;
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      throw err;
    }
  };

  return {
    isModalOpen,
    selectedAppointment,
    openFeedbackModal,
    closeFeedbackModal,
    submit,
    isLoading,
    isSuccess,
    isError,
    error,
    submittedMessage,
    clearSubmittedMessage: () => setSubmittedMessage(null),
  };
};
