// src/Doctor/Hooks/useApproveAndDispatch.ts
import { useState } from 'react';
import { useApproveAIDietPlanMutation } from '../apis/doctorApi';
import {
  sendPatientEmail,
  sendCredentialsSMS,
  EmailDispatchResult,
} from '../Services/emailService';
import { AIDietCarePlan } from '../types/doctor.types';

export interface ApproveDispatchParams {
  patientId: string;
  patientName: string;
  patientContact: string;
  patientEmail?: string;
  assignedPackageName: string;
  dietPlan: AIDietCarePlan;
}

export interface DispatchResultState {
  approved: boolean;
  credentialsSent: boolean;
  emailSent: boolean;
  emailRecipient?: string;
  messageId?: string;
  error?: string;
  statusText: string;
}

export function useApproveAndDispatch() {
  const [approveMutation, { isLoading: isApproving }] = useApproveAIDietPlanMutation();
  const [dispatchResult, setDispatchResult] = useState<DispatchResultState | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const approveAndDispatch = async ({
    patientId,
    patientName,
    patientContact,
    patientEmail,
    assignedPackageName,
    dietPlan,
  }: ApproveDispatchParams) => {
    setIsDispatching(true);

    try {
      // 1. Mutate Backend approval state
      await approveMutation(patientId).unwrap();

      // 2. Dispatch SMS Credentials
      const cleanId = patientId.replace(/[^0-9]/g, '') || '101';
      const loginId = `PT${cleanId}`;
      const tempPass = Math.floor(100000 + Math.random() * 900000).toString();

      await sendCredentialsSMS({
        to: patientContact,
        loginId,
        tempPassword: tempPass,
        message: `Your Panchakarma Care Plan for ${assignedPackageName} is approved. Log in with ID: ${loginId} & PIN: ${tempPass}.`,
      });

      // 3. Dispatch Email with Diet Chart
      let emailSuccess = false;
      let emailMsgId: string | undefined;

      if (patientEmail && patientEmail.includes('@')) {
        const emailRes: EmailDispatchResult = await sendPatientEmail({
          to: patientEmail,
          patientName,
          subject: `AyurSutra Care Plan Approved: ${assignedPackageName}`,
          templateType: 'DIET_PLAN',
          data: {
            patientId,
            patientName,
            package: assignedPackageName,
            stages: dietPlan.stages,
          },
        });
        emailSuccess = emailRes.success;
        emailMsgId = emailRes.messageId;
      }

      const resultState: DispatchResultState = {
        approved: true,
        credentialsSent: true,
        emailSent: emailSuccess,
        emailRecipient: patientEmail,
        messageId: emailMsgId,
        statusText: emailSuccess
          ? `✅ Diet & Exercise Plan approved and emailed to ${patientEmail} — Also visible in patient's app now. Login credentials sent via SMS.`
          : patientEmail
          ? `⚠️ Plan approved, but email failed to send. Patient can still view in app.`
          : `⚠️ No email on file — plan is approved and active in-app, but could not be emailed.`,
      };

      setDispatchResult(resultState);
      return resultState;
    } catch (err: any) {
      console.error('[APPROVE & DISPATCH ERROR]', err);
      const failState: DispatchResultState = {
        approved: false,
        credentialsSent: false,
        emailSent: false,
        statusText: `❌ Couldn't complete approval. Please try again.`,
        error: err?.message || 'Approval mutation failed',
      };
      setDispatchResult(failState);
      return failState;
    } finally {
      setIsDispatching(false);
    }
  };

  const retryEmail = async (patientEmail: string, patientName: string, dietPlan: AIDietCarePlan) => {
    if (!patientEmail) return;
    setIsDispatching(true);
    const emailRes = await sendPatientEmail({
      to: patientEmail,
      patientName,
      subject: `AyurSutra Care Plan Re-Dispatch`,
      templateType: 'DIET_PLAN',
      data: { stages: dietPlan.stages },
    });
    setIsDispatching(false);
    if (emailRes.success) {
      setDispatchResult((prev) =>
        prev
          ? {
              ...prev,
              emailSent: true,
              statusText: `✅ Email successfully sent to ${patientEmail}.`,
            }
          : null
      );
    }
  };

  return {
    approveAndDispatch,
    retryEmail,
    dispatchResult,
    isDispatching: isDispatching || isApproving,
  };
}
