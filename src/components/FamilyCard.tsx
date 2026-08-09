import React, { useState } from 'react';
import type { FamilyGroup } from '../lib/groupByFamily';
import { StudentRow } from './StudentRow';
import type { Student } from '../types';

interface FamilyCardProps {
  group: FamilyGroup;
  selectedIds: string[];
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

export function FamilyCard({ group, selectedIds, onToggle, onClickRow }: FamilyCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 bg-surface-container-lowest flex justify-between items-center transition-colors hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant mt-0.5">groups</span>
          <div>
            <h3 className="text-[14px] leading-[20px] font-semibold text-on-surface">
              {group.guardianName} Family
            </h3>
            <p className="text-[12px] leading-[16px] text-on-surface-variant mt-0.5">
              {group.students.length} children — <span className={group.totalBalance > 0 ? 'text-error font-semibold' : 'text-primary font-semibold'}>{formatCurrency(group.totalBalance)} due</span>
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-outline transition-transform ${expanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-3 space-y-3 bg-surface-container-lowest border-t border-outline-variant">
          {group.students.map((student) => (
            <StudentRow 
              key={student.id} 
              student={student} 
              selected={selectedIds.includes(student.id)}
              onToggle={onToggle}
              onClickRow={onClickRow}
            />
          ))}
        </div>
      )}
    </div>
  );
}
