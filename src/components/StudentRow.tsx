import React from 'react';
import type { Student } from '../types';
import { computeStudentState } from '../lib/computeStudentState';
import { StatusChip } from './StatusChip';

interface StudentRowProps {
  student: Student;
  selected: boolean;
  onToggle: (id: string, selected: boolean) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function StudentRow({ student, selected, onToggle }: StudentRowProps) {
  const state = computeStudentState(student);

  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-4 flex items-center gap-4">
      <input 
        className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant cursor-pointer" 
        type="checkbox" 
        checked={selected}
        onChange={(e) => onToggle(student.id, e.target.checked)}
      />
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-[16px] leading-[24px] font-semibold text-on-surface">{student.name}</h3>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">
              {student.class}-{student.section}
              <span className="ml-2 opacity-70">Roll: {student.rollNo}</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-[16px] leading-[24px] font-bold tabular-nums ${student.balance > 0 ? (state.displayStatus.color === 'red' || state.displayStatus.color === 'red-distinct' ? 'text-error' : 'text-on-surface') : 'text-on-surface'}`}>
              {formatCurrency(student.balance)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <StatusChip label={state.displayStatus.label} color={state.displayStatus.color} />
          
          {state.hasWaiver && state.waiverInfo && (
            <span className="text-[12px] text-primary font-medium flex items-center bg-primary-fixed/30 px-2 py-1 rounded">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {state.waiverInfo}
            </span>
          )}
          
          {state.hasNote && (
            <span className="text-[12px] text-on-secondary-container font-medium flex items-center bg-secondary-container px-2 py-1 rounded">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Note
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
