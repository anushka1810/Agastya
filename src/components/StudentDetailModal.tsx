import { useEffect, useRef } from 'react';
import type { Student } from '../types';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
};

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Trap focus inside modal
    modalRef.current?.focus();
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-surface w-full max-w-[600px] max-h-[90vh] md:rounded-2xl rounded-t-2xl shadow-xl flex flex-col outline-none animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-outline-variant bg-surface-container-lowest md:rounded-t-2xl rounded-t-2xl sticky top-0 z-10">
          <div>
            <h2 className="text-[20px] font-bold text-on-surface leading-tight">{student.name}</h2>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Class {student.class}-{student.section} • Roll {student.rollNo} • Adm: {student.admissionNo}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shrink-0"
            aria-label="Close details"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow p-4 space-y-6">
          
          {/* Guardian Info */}
          <section>
            <h3 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">family_restroom</span>
              Guardian Info
            </h3>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
              <p className="text-[16px] font-semibold text-on-surface">{student.guardian.name}</p>
              <div className="flex flex-col gap-1 mt-2 text-[14px] text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {student.guardian.phone}
                </div>
                {student.guardian.email && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    {student.guardian.email}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Notes (if any) */}
          {student.notes && (
            <section>
              <h3 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sticky_note_2</span>
                Internal Notes
              </h3>
              <div className="bg-secondary-container/50 border border-secondary-container rounded-xl p-4">
                <p className="text-[14px] text-on-surface italic">{student.notes}</p>
              </div>
            </section>
          )}

          {/* Fee Components */}
          <section>
            <h3 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              Fee Breakdown
            </h3>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-3 bg-surface-container-low border-b border-outline-variant text-[12px] font-bold text-on-surface-variant">
                <div>Component</div>
                <div className="text-right">Billed</div>
                <div className="text-right">Paid</div>
              </div>
              {student.components.map((comp, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_auto_auto] gap-4 p-3 border-b border-outline-variant last:border-0 text-[14px] items-center">
                  <div>
                    <span className="font-semibold text-on-surface capitalize">{comp.type.toLowerCase().replace('_', ' ')}</span>
                    {comp.waiver && (
                      <span className="block text-[12px] text-primary mt-0.5">
                        {comp.waiver.percent}% Waiver ({comp.waiver.reason})
                      </span>
                    )}
                  </div>
                  <div className="text-right tabular-nums text-on-surface-variant">{formatCurrency(comp.billed)}</div>
                  <div className="text-right tabular-nums font-semibold text-on-surface">{formatCurrency(comp.paid)}</div>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-3 bg-surface-container border-t border-outline-variant text-[14px] font-bold">
                <div>Total</div>
                <div className="text-right tabular-nums">{formatCurrency(student.totalBilled)}</div>
                <div className="text-right tabular-nums text-primary">{formatCurrency(student.totalPaid)}</div>
              </div>
            </div>
          </section>

          {/* Payment History */}
          <section>
            <h3 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Payment History
            </h3>
            {student.payments && student.payments.length > 0 ? (
              <div className="space-y-3">
                {student.payments.map((payment) => {
                  const isBounced = payment.status === 'BOUNCED';
                  const isSuccess = payment.status === 'SUCCESS';
                  
                  return (
                    <div 
                      key={payment.id} 
                      className={`border rounded-xl p-4 shadow-sm flex flex-col gap-2 ${
                        isBounced ? 'bg-error-container/20 border-error' : 'bg-surface-container-lowest border-outline-variant'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[16px] font-bold tabular-nums flex items-center gap-2">
                            {formatCurrency(payment.amount)}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isBounced ? 'bg-error text-on-error' : 
                              isSuccess ? 'bg-primary text-on-primary' : 
                              'bg-surface-variant text-on-surface-variant'
                            }`}>
                              {payment.status}
                            </span>
                          </p>
                          <p className="text-[12px] text-on-surface-variant mt-1">
                            {formatDate(payment.date)} • {payment.mode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                            Ref: {payment.reference}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-on-surface-variant text-[14px] bg-surface-container-lowest border border-outline-variant rounded-xl">
                No payment history recorded.
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
