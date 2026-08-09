import React, { useState } from 'react';
import type { FamilyGroup } from '../lib/groupByFamily';
import { StudentRow } from './StudentRow';

interface FamilyCardProps {
  group: FamilyGroup;
  selectedIds: string[];
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

export function FamilyCard({ group, selectedIds, onToggle }: FamilyCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 bg-surface-container-low flex justify-between items-center transition-colors"
      >
        <div>
          <h3 className="text-[16px] leading-[24px] font-semibold text-on-surface">
            {group.guardianName} (Family)
          </h3>
          <p className="text-[14px] leading-[20px] text-on-surface-variant mt-0.5">
            {group.students.length} students
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[14px] text-on-surface-variant">Family Balance</p>
            <p className={`text-[16px] leading-[24px] font-bold tabular-nums ${group.totalBalance > 0 ? 'text-error' : 'text-primary'}`}>
              {formatCurrency(group.totalBalance)}
            </p>
          </div>
          <svg 
            className={`w-5 h-5 text-outline transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4 bg-surface border-t border-outline-variant">
          {group.students.map((student) => (
            <StudentRow 
              key={student.id} 
              student={student} 
              selected={selectedIds.includes(student.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
