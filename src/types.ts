export type Guardian = {
  name: string;
  phone: string;
  email: string | null;
};

export type Waiver = {
  type: string;
  percent: number;
  reason: string;
};

export type ComponentType = 'TUITION' | 'TRANSPORT' | 'LAB' | 'EXAM' | 'ANNUAL' | 'LATE_FEE';

export type Component = {
  type: ComponentType | string;
  billed: number;
  paid: number;
  waiver?: Waiver;
};

export type PaymentStatus = 'SUCCESS' | 'BOUNCED' | 'FAILED' | 'PENDING';
export type PaymentMode = 'UPI' | 'NETBANKING' | 'CASH' | 'CHEQUE' | 'CARD';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  mode: PaymentMode | string;
  reference: string;
  term: string;
  status: PaymentStatus | string;
};

export type StudentStatus = 
  | 'OVERDUE'
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'CREDIT_BALANCE'
  | 'PAYMENT_FAILED'
  | 'INSTALMENT_PLAN'
  | 'WITHDRAWN';

export type Student = {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  admissionNo: string;
  familyId: string;
  guardian: Guardian;
  components: Component[];
  totalBilled: number;
  totalPaid: number;
  balance: number;
  status: StudentStatus;
  daysOverdue: number;
  nextInstalmentDate?: string;
  nextInstalmentAmount?: number;
  withdrawnOn?: string;
  refundDue?: number;
  lastPaymentDate: string | null;
  remindersSent: number;
  lastReminderAt: string | null;
  notes: string | null;
  payments: Payment[];
};

export type Meta = {
  school: string;
  academicYear: string;
  term: string;
  dueDate: string;
  asOf: string;
  currency: string;
};

export type FeeData = {
  meta: Meta;
  students: Student[];
};
