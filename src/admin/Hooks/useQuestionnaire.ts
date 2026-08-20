// src/admin/hooks/useQuestionnaire.ts
import { useState, useEffect } from 'react';
import { useGetQuestionsQuery, useUpdateQuestionMutation } from '../apis/adminApi';
import { PrakritiQuestion, PrakritiWeightOption } from '../types/admin.types';

export const useQuestionnaire = () => {
  const { data: initialQuestions = [], isLoading } = useGetQuestionsQuery();
  const [updateQuestionMutation] = useUpdateQuestionMutation();

  const [questionsList, setQuestionsList] = useState<PrakritiQuestion[]>([]);

  useEffect(() => {
    if (initialQuestions.length > 0 && questionsList.length === 0) {
      setQuestionsList(initialQuestions);
    }
  }, [initialQuestions]);

  const addQuestion = (data: {
    attribute: string;
    questionText: string;
    options: PrakritiWeightOption[];
  }) => {
    const newQ: PrakritiQuestion = {
      id: `Q-${(questionsList.length + 1).toString().padStart(2, '0')}`,
      attribute: data.attribute,
      questionText: data.questionText,
      options: data.options,
      version: 1.0,
      hasHistoricalResponses: false,
    };
    setQuestionsList((prev) => [...prev, newQ]);
    return newQ;
  };

  const editQuestion = async (updated: PrakritiQuestion) => {
    const nextVersion = updated.hasHistoricalResponses
      ? parseFloat((updated.version + 0.1).toFixed(1))
      : updated.version;

    const modified = { ...updated, version: nextVersion, hasHistoricalResponses: true };

    setQuestionsList((prev) =>
      prev.map((q) => (q.id === updated.id ? modified : q))
    );

    try {
      await updateQuestionMutation(modified).unwrap();
    } catch {
      // Local state ready
    }
  };

  const removeQuestion = (id: string) => {
    setQuestionsList((prev) => prev.filter((q) => q.id !== id));
  };

  return {
    questions: questionsList,
    isLoading,
    addQuestion,
    editQuestion,
    removeQuestion,
  };
};
