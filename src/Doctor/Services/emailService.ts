// src/Doctor/Services/emailService.ts
// Mock Email and SMS Dispatch Service for Doctor Panel

export interface EmailPayload {
  to: string;
  patientName: string;
  subject: string;
  templateType: 'DIET_PLAN' | 'CLINICAL_REPORT';
  data: any;
}

export interface SMSPayload {
  to: string;
  loginId: string;
  tempPassword?: string;
  message: string;
}

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  recipient: string;
  timestamp: string;
  error?: string;
}

/**
 * Dispatches a formatted email with retry capability
 */
export async function sendPatientEmail(payload: EmailPayload): Promise<EmailDispatchResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!payload.to || !payload.to.includes('@')) {
    console.warn(`[MOCK EMAIL FAILURE] Missing or invalid email for patient ${payload.patientName}`);
    return {
      success: false,
      recipient: payload.to || 'None',
      timestamp: new Date().toISOString(),
      error: 'No valid recipient email address on file.',
    };
  }

  const messageId = `msg-ayur-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  console.log(`[MOCK EMAIL DISPATCH SUCCESS] 📧
    To: ${payload.to} (${payload.patientName})
    Subject: ${payload.subject}
    Template: ${payload.templateType}
    MessageId: ${messageId}
    Time: ${new Date().toLocaleTimeString()}
  `);

  return {
    success: true,
    messageId,
    recipient: payload.to,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Dispatches an SMS/WhatsApp with patient login credentials
 */
export async function sendCredentialsSMS(payload: SMSPayload): Promise<{ success: boolean; messageId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const messageId = `sms-ayur-${Date.now()}`;

  console.log(`[MOCK SMS / WHATSAPP DISPATCH] 📱
    To: ${payload.to}
    Login ID: ${payload.loginId}
    Password: ${payload.tempPassword || '******'}
    Message: "${payload.message}"
    MessageId: ${messageId}
  `);

  return { success: true, messageId };
}
