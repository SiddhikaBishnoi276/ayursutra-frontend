// src/admin/hooks/useQuestionnaire.ts
import { useState, useEffect } from 'react';
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '../apis/adminApi';
import { PrakritiQuestion, PrakritiWeightOption } from '../types/admin.types';

export const useQuestionnaire = () => {
  const { data: initialQuestions = [], isLoading } = useGetQuestionsQuery();
  const [createQuestionMutation] = useCreateQuestionMutation();
  const [updateQuestionMutation] = useUpdateQuestionMutation();
  const [deleteQuestionMutation] = useDeleteQuestionMutation();

  const [questionsList, setQuestionsList] = useState<PrakritiQuestion[]>([]);

  // Keep local state synchronized with database responses
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestionsList(initialQuestions);
    }
  }, [initialQuestions]);

  const addQuestion = async (data: {
    attribute: string;
    questionText: string;
    options: PrakritiWeightOption[];
  }) => {
    const tempId = `TEMP-${Date.now().toString().slice(-3)}`;
    const newQ: PrakritiQuestion = {
      id: tempId,
      attribute: data.attribute,
      questionText: data.questionText,
      options: data.options,
      version: 1.0,
      hasHistoricalResponses: false,
    };
    
    // Optimistic update
    setQuestionsList((prev) => [...prev, newQ]);

    try {
      await createQuestionMutation({
        attribute: data.attribute,
        questionText: data.questionText,
        options: data.options,
      }).unwrap();
    } catch (err) {
      console.error('Failed to create question in DB:', err);
      // Revert optimistic update
      setQuestionsList((prev) => prev.filter((q) => q.id !== tempId));
    }
    return newQ;
  };

  const editQuestion = async (updated: PrakritiQuestion) => {
    const nextVersion = updated.hasHistoricalResponses
      ? parseFloat((updated.version + 0.1).toFixed(1))
      : updated.version;

    const modified = { ...updated, version: nextVersion, hasHistoricalResponses: true };
    const original = questionsList.find((q) => q.id === updated.id);

    setQuestionsList((prev) =>
      prev.map((q) => (q.id === updated.id ? modified : q))
    );

    try {
      await updateQuestionMutation(modified).unwrap();
    } catch (err) {
      console.error('Failed to update question in DB:', err);
      if (original) {
        setQuestionsList((prev) =>
          prev.map((q) => (q.id === updated.id ? original : q))
        );
      }
    }
  };

  const removeQuestion = async (id: string) => {
    const deletedQ = questionsList.find((q) => q.id === id);
    if (!deletedQ) return;

    // Optimistic delete
    setQuestionsList((prev) => prev.filter((q) => q.id !== id));

    try {
      await deleteQuestionMutation(id).unwrap();
    } catch (err) {
      console.error('Failed to delete question from DB:', err);
      // Revert optimistic delete
      setQuestionsList((prev) => [...prev, deletedQ]);
    }
  };

  return {
    questions: questionsList,
    isLoading,
    addQuestion,
    editQuestion,
    removeQuestion,
  };
};

