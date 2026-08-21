// src/Doctor/Hooks/usePrakritiAssessment.ts
import { useState, useMemo, useEffect } from 'react';
import {
  useGetPrakritiQuestionsQuery,
  useGetPatientsQuery,
  useLockPrakritiMutation,
} from '../apis/doctorApi';
import { DoshaScores } from '../types/doctor.types';

export function usePrakritiAssessment(patientId: string) {
  const { data: questions = [], isLoading } = useGetPrakritiQuestionsQuery();
  const { data: patients = [] } = useGetPatientsQuery();
  const [lockPrakritiMutation, { isLoading: isLocking }] = useLockPrakritiMutation();

  const patient = patients.find((p) => p.id === patientId);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [pulseObservation, setPulseObservation] = useState(
    'Vataja Sarpa Gati (snake-like, fast rhythm, 76 bpm).'
  );
  const [physicalExamNotes, setPhysicalExamNotes] = useState(
    'Dry scaly skin over lumbar area. Muscle spasm in lower back.'
  );
  const [doctorNotes, setDoctorNotes] = useState(
    'Primary diagnosis confirms doshic imbalance.'
  );
  const [isLocked, setIsLocked] = useState(false);

  // Sync locked state and initialize questions when questions or patient changes
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers((prev) => {
        const next: Record<string, string> = { ...prev };
        questions.forEach((q) => {
          if (!next[q.id] || !q.options.some((o) => o.id === next[q.id])) {
            // Default select based on patient's dominant dosha if known, else first option
            if (patient?.dominantPrakriti?.toLowerCase().includes('pitta') && q.options[1]) {
              next[q.id] = q.options[1].id;
            } else if (patient?.dominantPrakriti?.toLowerCase().includes('kapha') && q.options[2]) {
              next[q.id] = q.options[2].id;
            } else if (q.options[0]) {
              next[q.id] = q.options[0].id;
            }
          }
        });
        return next;
      });
    }
  }, [questions, patientId, patient?.dominantPrakriti]);

  useEffect(() => {
    if (patient) {
      setIsLocked(!!patient.dominantPrakriti);
    }
  }, [patientId, patient]);

  const setAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const liveScore: DoshaScores = useMemo(() => {
    let vataTotal = 0;
    let pittaTotal = 0;
    let kaphaTotal = 0;

    questions.forEach((q) => {
      const selectedOptId = answers[q.id];
      if (selectedOptId) {
        const opt = q.options.find((o) => o.id === selectedOptId);
        if (opt) {
          vataTotal += opt.vataWeight;
          pittaTotal += opt.pittaWeight;
          kaphaTotal += opt.kaphaWeight;
        }
      }
    });

    const sum = vataTotal + pittaTotal + kaphaTotal || 1;
    const vataPct = Math.round((vataTotal / sum) * 100);
    const pittaPct = Math.round((pittaTotal / sum) * 100);
    const kaphaPct = Math.max(0, 100 - (vataPct + pittaPct));

    let dominant = 'Tridoshic';
    if (vataPct >= 45 && pittaPct >= 30) dominant = 'Vata-Pitta';
    else if (pittaPct >= 45 && vataPct >= 30) dominant = 'Pitta-Vata';
    else if (vataPct >= 45 && kaphaPct >= 30) dominant = 'Vata-Kapha';
    else if (kaphaPct >= 45 && vataPct >= 30) dominant = 'Kapha-Vata';
    else if (pittaPct >= 45 && kaphaPct >= 30) dominant = 'Pitta-Kapha';
    else if (vataPct >= 50) dominant = 'Vata Dominant';
    else if (pittaPct >= 50) dominant = 'Pitta Dominant';
    else if (kaphaPct >= 50) dominant = 'Kapha Dominant';

    return {
      vata: vataPct,
      pitta: pittaPct,
      kapha: kaphaPct,
      dominant,
    };
  }, [questions, answers]);

  const lockFinalPrakriti = async () => {
    const formattedAnswers = Object.entries(answers)
      .map(([qId, optId]) => ({
        question_id: parseInt(qId, 10),
        option_id: parseInt(optId, 10),
      }))
      .filter((a) => !isNaN(a.question_id) && !isNaN(a.option_id));

    await lockPrakritiMutation({
      patientId,
      dominantPrakriti: liveScore.dominant || 'Vata-Pitta',
      notes: `${pulseObservation} | ${physicalExamNotes} | ${doctorNotes}`,
      answers: formattedAnswers,
      tentative_vata: liveScore.vata,
      tentative_pitta: liveScore.pitta,
      tentative_kapha: liveScore.kapha,
      scores: {
        vata: liveScore.vata,
        pitta: liveScore.pitta,
        kapha: liveScore.kapha,
      },
    }).unwrap();
    setIsLocked(true);
  };



  return {
    questions,
    isLoading,
    answers,
    setAnswer,
    liveScore,
    pulseObservation,
    setPulseObservation,
    physicalExamNotes,
    setPhysicalExamNotes,
    doctorNotes,
    setDoctorNotes,
    isLocked,
    isLocking,
    lockFinalPrakriti,
  };
}

export default usePrakritiAssessment;
