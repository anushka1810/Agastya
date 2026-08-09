import React from 'react';
import type { Student } from '../types';
import { computeStudentState } from '../lib/computeStudentState';
import { StatusChip } from './StatusChip';

interface StudentRowProps {
  student: Student;
  selected: boolean;
  onToggle: (id: string, selected: boolean) => void;
  onClickRow?: (student: Student) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function StudentRow({ student, selected, onToggle, onClickRow }: StudentRowProps) {
  const state = computeStudentState(student);
  
  // Format based on the image provided
  const isPartiallyPaid = student.status === 'PARTIALLY_PAID';
  const displayAmount = isPartiallyPaid 
    ? `${formatCurrency(student.totalPaid)} of ${formatCurrency(student.totalBilled)} paid`
    : formatCurrency(student.balance);

  return (
    <div 
      className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex items-start gap-3 shadow-sm ${onClickRow ? 'cursor-pointer hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background' : ''}`}
      onClick={() => onClickRow?.(student)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClickRow) {
          onClickRow(student);
        }
      }}
      tabIndex={onClickRow ? 0 : undefined}
      role={onClickRow ? 'button' : undefined}
    >
      <input 
        className="mt-1 rounded text-primary focus:ring-primary h-[18px] w-[18px] border-outline-variant cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background" 
        type="checkbox" 
        checked={selected}
        onChange={(e) => onToggle(student.id, e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-[14px] leading-[20px] font-semibold text-on-surface">{student.name}</h3>
          <p className={`text-[14px] leading-[20px] font-bold tabular-nums ${
            student.balance > 0 
              ? (state.displayStatus.color === 'red' || state.displayStatus.color === 'red-distinct' ? 'text-error' : 'text-on-surface') 
              : 'text-on-surface'
          }`}>
            {displayAmount}
          </p>
        </div>
        <p className="text-[12px] leading-[16px] text-on-surface-variant mt-0.5 mb-1.5">
          Adm: {student.admissionNo} | {student.class}-{student.section}
        </p>
        
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip label={state.displayStatus.label} color={state.displayStatus.color} />
          
          {state.hasWaiver && state.waiverInfo && (
            <span className="text-[10px] text-primary font-medium flex items-center bg-primary-fixed/30 px-1.5 py-0.5 rounded border border-primary">
              {state.waiverInfo}
            </span>
          )}
          
          {state.hasNote && (
            <span className="text-[14px] text-on-surface-variant flex items-center">
              <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
