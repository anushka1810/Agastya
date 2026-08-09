import React from 'react';
import type { Student, FeeData } from '../types';

interface MobileDashboardProps {
  data: FeeData;
  totalOutstanding: number;
  overdueCount: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MobileDashboard({ data, totalOutstanding, overdueCount }: MobileDashboardProps) {
  // Sort overdue students by balance descending
  const topOverdue = [...data.students]
    .filter(s => s.status === 'OVERDUE')
    .sort((a, b) => b.balance - a.balance);

  return (
    <div className="flex flex-col h-full bg-background text-on-background md:hidden">
      {/* Header */}
      <header className="flex-shrink-0 z-10 sticky top-0 shadow-sm" style={{ backgroundColor: '#0F1729', color: '#FFFFFF' }}>
        <div className="flex justify-between items-center px-4 py-3 w-full font-headline-md h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              LA
            </div>
            <h1 className="text-[20px] leading-[28px] font-bold text-white">EduFinance Admin</h1>
          </div>
          <div className="flex items-center gap-4 text-white">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto pb-[100px]">
        {/* Dashboard Summary */}
        <div className="px-4 py-6">
          <h2 className="text-[18px] font-semibold mb-4 text-on-surface">Fee Collection Overview</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3">
              <p className="text-[12px] text-on-surface-variant mb-1">Total Outstanding</p>
              <p className="text-[20px] text-error font-bold tabular-nums">
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3">
              <p className="text-[12px] text-on-surface-variant mb-1">Overdue Students</p>
              <p className="text-[20px] text-primary font-bold tabular-nums">
                {overdueCount}
              </p>
            </div>
          </div>
        </div>

        {/* Top Overdue List */}
        <div className="px-4">
          <h3 className="text-[16px] font-bold text-on-surface mb-3 border-b border-outline-variant pb-2">
            Top Overdue Students
          </h3>
          <div className="space-y-3">
            {topOverdue.map(student => (
              <div key={student.id} className="bg-surface border border-outline-variant rounded-lg p-3 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="text-[15px] font-semibold text-on-surface">{student.name}</h4>
                  <p className="text-[13px] text-on-surface-variant">Class: {student.class}-{student.section}</p>
                  <p className="text-[15px] font-bold text-error tabular-nums mt-1">
                    {formatCurrency(student.balance)}
                  </p>
                </div>
                {student.guardian.phone && (
                  <a 
                    href={`tel:${student.guardian.phone}`} 
                    className="flex flex-col items-center justify-center p-2 rounded-full bg-surface-container-low border border-outline-variant text-primary hover:bg-surface-container"
                    aria-label={`Call ${student.guardian.name}`}
                  >
                    <span className="material-symbols-outlined">call</span>
                    <span className="text-[10px] mt-1 font-semibold">Call</span>
                  </a>
                )}
              </div>
            ))}
            {topOverdue.length === 0 && (
              <p className="text-center text-[14px] text-on-surface-variant py-4">No overdue students.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
