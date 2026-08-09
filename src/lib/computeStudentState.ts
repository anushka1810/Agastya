import type { Student } from '../types';

export type StudentUIState = {
  displayStatus: {
    label: string;
    color: 'red' | 'red-distinct' | 'amber' | 'green' | 'blue' | 'neutral';
  };
  hasWaiver: boolean;
  waiverInfo: string | null;
  hasNote: boolean;
};

export function computeStudentState(student: Student): StudentUIState {
  let displayStatus: StudentUIState['displayStatus'];

  switch (student.status) {
    case 'OVERDUE':
      displayStatus = { label: 'Overdue', color: 'red' };
      break;
    case 'PAYMENT_FAILED':
      displayStatus = { label: 'Payment Failed', color: 'red-distinct' };
      break;
    case 'PARTIALLY_PAID':
      displayStatus = { label: 'Partially Paid', color: 'amber' };
      break;
    case 'PAID':
      displayStatus = { label: 'Paid', color: 'green' };
      break;
    case 'CREDIT_BALANCE':
      displayStatus = { label: 'Credit Balance', color: 'blue' };
      break;
    case 'INSTALMENT_PLAN':
      displayStatus = { label: 'Instalment Plan', color: 'neutral' };
      break;
    default:
      displayStatus = { label: student.status, color: 'neutral' };
  }

  const componentWithWaiver = student.components.find(c => c.waiver);
  let waiverInfo = null;
  
  if (componentWithWaiver && componentWithWaiver.waiver) {
    const waiverType = componentWithWaiver.waiver.type;
    const formattedType = waiverType.charAt(0) + waiverType.slice(1).toLowerCase();
    const componentName = componentWithWaiver.type.toLowerCase();
    waiverInfo = `${formattedType} — ${componentName} waived`;
  }

  return {
    displayStatus,
    hasWaiver: !!componentWithWaiver,
    waiverInfo,
    hasNote: student.notes !== null,
  };
}
