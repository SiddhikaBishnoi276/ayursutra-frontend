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

  const [answers, setAnswers] = useState<Record<string, string>>({
    Q1: 'Q1-A',
    Q2: 'Q2-A',
    Q3: 'Q3-A',
    Q4: 'Q4-A',
    Q5: 'Q5-A',
    Q6: 'Q6-A',
    Q7: 'Q7-B',
    Q8: 'Q8-A',
    Q9: 'Q9-A',
    Q10: 'Q10-A',
  });

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

  // Sync locked state whenever patient changes
  useEffect(() => {
    if (patient) {
      setIsLocked(!!patient.dominantPrakriti);
      if (patient.dominantPrakriti?.toLowerCase().includes('pitta')) {
        setAnswers({
          Q1: 'Q1-B',
          Q2: 'Q2-B',
          Q3: 'Q3-B',
          Q4: 'Q4-B',
          Q5: 'Q5-B',
          Q6: 'Q6-B',
          Q7: 'Q7-B',
          Q8: 'Q8-B',
          Q9: 'Q9-B',
          Q10: 'Q10-B',
        });
        setPulseObservation('Manduka Gati (jumping frog rhythm, 82 bpm, hot/sharp).');
        setPhysicalExamNotes('Warm erythematous patches with burning sensation.');
      } else if (patient.dominantPrakriti?.toLowerCase().includes('kapha')) {
        setAnswers({
          Q1: 'Q1-C',
          Q2: 'Q2-C',
          Q3: 'Q3-C',
          Q4: 'Q4-C',
          Q5: 'Q5-C',
          Q6: 'Q6-C',
          Q7: 'Q7-C',
          Q8: 'Q8-C',
          Q9: 'Q9-C',
          Q10: 'Q10-C',
        });
        setPulseObservation('Hamsa Gati (swan-like, slow, deep, 64 bpm).');
        setPhysicalExamNotes('Cold, clammy skin with mucus congestion.');
      } else {
        setAnswers({
          Q1: 'Q1-A',
          Q2: 'Q2-A',
          Q3: 'Q3-A',
          Q4: 'Q4-A',
          Q5: 'Q5-A',
          Q6: 'Q6-A',
          Q7: 'Q7-B',
          Q8: 'Q8-A',
          Q9: 'Q9-A',
          Q10: 'Q10-A',
        });
        setPulseObservation('Vataja Sarpa Gati (snake-like, fast rhythm, 76 bpm).');
        setPhysicalExamNotes('Dry scaly skin, tenderness in joints.');
      }
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
    await lockPrakritiMutation({
      patientId,
      dominantPrakriti: liveScore.dominant,
      notes: `${pulseObservation} | ${physicalExamNotes} | ${doctorNotes}`,
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
