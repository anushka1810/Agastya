import React, { useMemo, useState } from 'react';
import feeDataJson from '../data/fee-data.json.json';
import { groupByFamily } from '../lib/groupByFamily';
import { FamilyCard } from './FamilyCard';
import { StudentRow } from './StudentRow';
import { MobileDashboard } from './MobileDashboard';
import { computeStudentState } from '../lib/computeStudentState';
import type { Student, FeeData } from '../types';

type FilterType = 'ALL' | 'OVERDUE' | 'PARTIALLY_PAID' | 'PAID';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function StudentListView() {
  const data = feeDataJson as unknown as FeeData;
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Calculate summary stats
  const totalOutstanding = useMemo(() => {
    return data.students.reduce((acc, student) => {
      return acc + (student.balance > 0 ? student.balance : 0);
    }, 0);
  }, [data.students]);

  const overdueCount = useMemo(() => {
    return data.students.filter(s => s.status === 'OVERDUE').length;
  }, [data.students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (filter === 'ALL') return data.students as Student[];
    return (data.students as Student[]).filter(s => {
      if (filter === 'OVERDUE') return s.status === 'OVERDUE';
      if (filter === 'PARTIALLY_PAID') return s.status === 'PARTIALLY_PAID';
      if (filter === 'PAID') return s.status === 'PAID';
      return true;
    });
  }, [data.students, filter]);

  // Group filtered students
  const familyGroups = useMemo(() => {
    return groupByFamily(filteredStudents);
  }, [filteredStudents]);

  // Selection Logic
  const overdueStudentIds = useMemo(() => {
    return data.students
      .filter(s => computeStudentState(s).displayStatus.label === 'Overdue')
      .map(s => s.id);
  }, [data.students]);

  const allOverdueSelected = overdueStudentIds.length > 0 && overdueStudentIds.every(id => selectedIds.includes(id));

  const handleSelectAllOverdue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = new Set(selectedIds);
      overdueStudentIds.forEach(id => newSelected.add(id));
      setSelectedIds(Array.from(newSelected));
    } else {
      setSelectedIds(prev => prev.filter(id => !overdueStudentIds.includes(id)));
    }
  };

  const handleToggleStudent = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(v => v !== id));
    }
  };

  return (
    <>
      {/* Mobile View */}
      <MobileDashboard data={data} totalOutstanding={totalOutstanding} overdueCount={overdueCount} />

      {/* Desktop View */}
      <div className="bg-background text-on-background h-screen hidden md:flex flex-col overflow-hidden">
        {/* Top Section (Fixed) */}
        <header className="flex-shrink-0 bg-surface z-10 border-b border-outline-variant">
          {/* TopAppBar - Fixed Contrast */}
          <div className="flex justify-between items-center px-[24px] py-[8px] w-full font-headline-md h-16" style={{ backgroundColor: '#0F1729', color: '#FFFFFF' }}>
            <div className="flex items-center gap-[8px]">
              <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-sm">
                LA
              </div>
              <h1 className="text-[20px] leading-[28px] font-bold text-white">EduFinance Admin</h1>
            </div>
            <div className="flex items-center gap-[16px] text-[#F1F5F9]">
              <span className="material-symbols-outlined cursor-pointer hover:text-white">search</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-white">settings</span>
            </div>
          </div>
          
          {/* Dashboard Summary */}
          <div className="px-[16px] py-[24px] max-w-[1280px] mx-auto w-full">
            <h2 className="text-[20px] leading-[28px] font-semibold mb-[16px] text-on-surface">Fee Collection</h2>
            <div className="grid grid-cols-2 gap-[8px]">
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-[16px]">
                <p className="text-[14px] leading-[20px] text-on-surface-variant mb-[4px]">Total Outstanding</p>
                <p className="text-[24px] leading-[32px] text-error font-bold tabular-nums">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-[16px]">
                <p className="text-[14px] leading-[20px] text-on-surface-variant mb-[4px]">Overdue Students</p>
                <p className="text-[24px] leading-[32px] text-primary font-bold tabular-nums">
                  {overdueCount}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Chips & Bulk Actions Bar */}
          <div className="px-[16px] pb-[16px] max-w-[1280px] mx-auto w-full flex justify-between items-center border-b border-outline-variant">
            <div className="flex gap-2 overflow-x-auto">
              {(['ALL', 'OVERDUE', 'PARTIALLY_PAID', 'PAID'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[14px] font-semibold whitespace-nowrap border ${
                    filter === f 
                      ? 'bg-primary-container text-on-primary-container border-primary-container' 
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant cursor-pointer" 
                  checked={allOverdueSelected}
                  onChange={handleSelectAllOverdue}
                />
                <span className="text-[14px] font-semibold text-on-surface">Select all overdue</span>
              </label>
            </div>
          </div>
        </header>

        {/* Main List (Scrollable) */}
        <main className="flex-grow overflow-y-auto px-[16px] py-[24px] pb-[160px]">
          <div className="max-w-[1280px] mx-auto w-full space-y-[8px]">
            {familyGroups.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant text-[14px]">
                No students found matching this filter.
              </div>
            ) : (
              familyGroups.map(group => {
                if (group.students.length > 1) {
                  return (
                    <FamilyCard 
                      key={group.familyId} 
                      group={group} 
                      selectedIds={selectedIds}
                      onToggle={handleToggleStudent}
                    />
                  );
                } else {
                  const student = group.students[0];
                  return (
                    <StudentRow 
                      key={student.id} 
                      student={student} 
                      selected={selectedIds.includes(student.id)}
                      onToggle={handleToggleStudent}
                    />
                  );
                }
              })
            )}
          </div>
        </main>
        
        {/* Floating Bulk Action Area (Desktop) */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none z-20">
          <div className="max-w-[1280px] mx-auto flex justify-end">
             <button 
                onClick={() => {
                  if (selectedIds.length > 0) {
                    alert(`Sent msg to ${selectedIds.length} student(s)`);
                  } else {
                    alert('Please select at least one student first.');
                  }
                }}
                className="pointer-events-auto bg-primary text-on-primary font-bold py-3 px-6 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                Send Reminder {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
