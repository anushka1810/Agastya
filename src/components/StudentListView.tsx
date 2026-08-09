import React, { useMemo, useState, useEffect } from 'react';
import feeDataJson from '../data/fee-data.json.json';
import { groupByFamily } from '../lib/groupByFamily';
import { FamilyCard } from './FamilyCard';
import { StudentRow } from './StudentRow';
import { computeStudentState } from '../lib/computeStudentState';
import { SummaryView } from './SummaryView';
import { StudentsView } from './StudentsView';
import { SettingsView } from './SettingsView';
import { StudentDetailModal } from './StudentDetailModal';
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
  const [data, setData] = useState<FeeData | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Summary' | 'Payments' | 'Students' | 'Settings'>('Payments');
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<Student | null>(null);

  const fetchData = () => {
    setStatus('loading');
    setData(null);
    setTimeout(() => {
      setData(feeDataJson as unknown as FeeData);
      setStatus('success');
    }, 1500);
  };

  const simulateError = () => {
    setStatus('error');
    setData(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate summary stats
  const totalOutstanding = useMemo(() => {
    if (!data) return 0;
    return data.students.reduce((acc, student) => {
      return acc + (student.balance > 0 ? student.balance : 0);
    }, 0);
  }, [data]);

  const overdueCount = useMemo(() => {
    if (!data) return 0;
    return data.students.filter(s => s.status === 'OVERDUE').length;
  }, [data]);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!data) return [];
    if (filter === 'ALL') return data.students as Student[];
    return (data.students as Student[]).filter(s => {
      if (filter === 'OVERDUE') return s.status === 'OVERDUE';
      if (filter === 'PARTIALLY_PAID') return s.status === 'PARTIALLY_PAID';
      if (filter === 'PAID') return s.status === 'PAID';
      return true;
    });
  }, [data, filter]);

  // Group filtered students
  const familyGroups = useMemo(() => {
    return groupByFamily(filteredStudents);
  }, [filteredStudents]);

  // Selection Logic
  const overdueStudentIds = useMemo(() => {
    if (!data) return [];
    return data.students
      .filter(s => computeStudentState(s).displayStatus.label === 'Overdue')
      .map(s => s.id);
  }, [data]);

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
    <div className="bg-background text-on-background h-screen flex flex-col md:flex-row overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[250px] bg-surface border-r border-outline-variant flex-shrink-0 shadow-sm z-20">
         {/* Desktop Header */}
         <div className="flex items-center gap-[12px] px-[20px] py-[16px] bg-[#0F1729]">
            <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-sm shadow-sm border border-[#334155]">
              LA
            </div>
            <div>
              <h1 className="text-[16px] leading-[20px] font-bold text-white">EduFinance</h1>
              <p className="text-[12px] text-[#94a3b8]">Admin Dashboard</p>
            </div>
         </div>
         
         {/* Desktop Navigation */}
         <nav className="flex flex-col p-4 space-y-2 mt-4 flex-grow">
           <button onClick={() => setActiveTab('Summary')} className={`flex items-center gap-4 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Summary' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
             <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
             Summary
           </button>
           <button onClick={() => setActiveTab('Payments')} className={`flex items-center gap-4 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Payments' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
             <span className="material-symbols-outlined text-[20px]">receipt_long</span>
             Fee Collection
           </button>
           <button onClick={() => setActiveTab('Students')} className={`flex items-center gap-4 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Students' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
             <span className="material-symbols-outlined text-[20px]">person_search</span>
             Students
           </button>
         </nav>

         <div className="p-4 border-t border-outline-variant">
           <button onClick={() => setActiveTab('Settings')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Settings' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>
             <span className="material-symbols-outlined text-[20px]">settings</span>
             Settings
           </button>
         </div>
      </aside>

      <div className="flex flex-col flex-grow overflow-hidden relative">
        {/* Top Section (Fixed) - Hidden on Desktop */}
        <header className="flex-shrink-0 bg-surface z-10 border-b border-outline-variant">
          {/* TopAppBar - Fixed Contrast (Mobile Only) */}
          <div className="md:hidden flex justify-between items-center px-[24px] py-[8px] w-full font-headline-md h-16" style={{ backgroundColor: '#0F1729', color: '#FFFFFF' }}>
            <div className="flex items-center gap-[8px]">
              <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-sm">
                LA
              </div>
              <h1 className="text-[20px] leading-[28px] font-bold text-white">EduFinance Admin</h1>
            </div>
            <div className="flex items-center gap-[16px] text-[#F1F5F9]">
              <button aria-label="Search" className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F1729] rounded flex">
                <span className="material-symbols-outlined hover:text-white">search</span>
              </button>
              <button aria-label="Settings" className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F1729] rounded flex">
                <span className="material-symbols-outlined hover:text-white">settings</span>
              </button>
            </div>
          </div>
        
        {activeTab === 'Payments' && (
          <>
            {status !== 'error' && (
              <>
                {/* Dashboard Summary */}
            <div className="px-[16px] py-[16px] max-w-[1280px] mx-auto w-full">
              <h2 className="text-[18px] leading-[24px] font-semibold mb-[12px] text-on-surface">Fee Collection</h2>
              <div className="grid grid-cols-2 gap-[8px]">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-[16px]">
                  <p className="text-[12px] leading-[16px] text-on-surface-variant mb-[4px]">Total Outstanding</p>
                  {status === 'loading' ? (
                    <div className="h-[28px] w-24 bg-surface-container-highest animate-pulse rounded"></div>
                  ) : (
                    <p className="text-[20px] leading-[28px] text-error font-bold tabular-nums">
                      {formatCurrency(totalOutstanding)}
                    </p>
                  )}
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-[16px]">
                  <p className="text-[12px] leading-[16px] text-on-surface-variant mb-[4px]">Overdue Students</p>
                  {status === 'loading' ? (
                    <div className="h-[28px] w-16 bg-surface-container-highest animate-pulse rounded"></div>
                  ) : (
                    <p className="text-[20px] leading-[28px] text-primary font-bold tabular-nums">
                      {overdueCount}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Chips & Bulk Actions */}
            <div className="px-[16px] pb-[12px] max-w-[1280px] mx-auto w-full flex flex-col gap-[12px] border-b border-outline-variant">
              {/* Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(['ALL', 'OVERDUE', 'PARTIALLY_PAID', 'PAID'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                      filter === f 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
              
              {/* Select All */}
              <label className="flex items-center gap-2 cursor-pointer pt-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background rounded">
                <input 
                  type="checkbox" 
                  className="rounded text-primary focus:ring-primary h-[18px] w-[18px] border-outline-variant cursor-pointer focus:ring-0 focus:outline-none" 
                  checked={allOverdueSelected}
                  onChange={handleSelectAllOverdue}
                />
                <span className="text-[13px] font-semibold text-primary">Select all overdue</span>
              </label>
            </div>
              </>
            )}
          </>
        )}
      </header>

      {/* Main List (Scrollable) */}
      <main className="flex-grow overflow-y-auto px-[16px] py-[16px] pb-[200px] md:pb-[100px]">
        {activeTab === 'Payments' && (
          <div className="max-w-[1280px] mx-auto w-full space-y-[8px]">
            {status === 'loading' ? (
              // Loading Skeleton
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex items-start gap-3 shadow-sm animate-pulse">
                  <div className="mt-1 rounded h-[18px] w-[18px] bg-surface-container-highest"></div>
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="h-5 w-32 bg-surface-container-highest rounded"></div>
                      <div className="h-5 w-20 bg-surface-container-highest rounded"></div>
                    </div>
                    <div className="h-4 w-48 bg-surface-container-highest rounded mt-1"></div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 w-16 bg-surface-container-highest rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : status === 'error' ? (
              // Error State
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
                <h3 className="text-[18px] font-bold text-on-surface mb-2">Failed to load fee data</h3>
                <p className="text-[14px] text-on-surface-variant mb-6">There was a problem connecting to the server.</p>
                <button 
                  onClick={fetchData}
                  className="bg-primary text-on-primary font-bold py-2 px-6 rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  Retry
                </button>
              </div>
            ) : familyGroups.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                {filter === 'OVERDUE' && (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-primary mb-4">celebration</span>
                    <h3 className="text-[16px] font-bold text-on-surface">No overdue students right now — nice work!</h3>
                  </>
                )}
                {filter === 'PARTIALLY_PAID' && (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">account_balance_wallet</span>
                    <h3 className="text-[16px] font-bold text-on-surface">No partially paid students.</h3>
                  </>
                )}
                {filter === 'PAID' && (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">task</span>
                    <h3 className="text-[16px] font-bold text-on-surface">No fully paid students yet.</h3>
                  </>
                )}
                {filter === 'ALL' && (
                  <>
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">inbox</span>
                    <h3 className="text-[16px] font-bold text-on-surface">No students found.</h3>
                  </>
                )}
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
                      onClickRow={setSelectedStudentForDetails}
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
                      onClickRow={setSelectedStudentForDetails}
                    />
                  );
                }
              })
            )}
          </div>
        )}
        
        {activeTab === 'Summary' && data && <SummaryView data={data} />}
        {activeTab === 'Students' && data && <StudentsView data={data} />}
        {activeTab === 'Settings' && <SettingsView onSimulateError={simulateError} />}
      </main>
      
      {/* Floating Bulk Action Area */}
      {activeTab === 'Payments' && (
        <div className="fixed bottom-[64px] md:bottom-0 left-0 w-full p-4 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none z-20">
          <div className="max-w-[1280px] mx-auto flex justify-center md:justify-end md:pl-[250px]">
             <button 
                onClick={() => {
                  if (selectedIds.length > 0) {
                    alert(`Sent msg to ${selectedIds.length} student(s)`);
                  } else {
                    alert('Please select at least one student first.');
                  }
                }}
                className="pointer-events-auto w-full md:w-auto bg-primary text-on-primary font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                Send Reminder {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-surface-container-lowest border-t border-outline-variant shadow-sm z-50 md:hidden h-[64px]">
        <button 
          onClick={() => setActiveTab('Summary')}
          className={`flex flex-col items-center justify-center p-2 w-[72px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Summary' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="text-[10px] font-semibold mt-1">Summary</span>
        </button>
        <button 
          onClick={() => setActiveTab('Payments')}
          className={`flex flex-col items-center justify-center p-2 w-[72px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Payments' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          <span className="text-[10px] font-semibold mt-1">Payments</span>
        </button>
        <button 
          onClick={() => setActiveTab('Students')}
          className={`flex flex-col items-center justify-center p-2 w-[72px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Students' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[24px]">person_search</span>
          <span className="text-[10px] font-semibold mt-1">Students</span>
        </button>
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`flex flex-col items-center justify-center p-2 w-[72px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${activeTab === 'Settings' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[24px]">settings</span>
          <span className="text-[10px] font-semibold mt-1">Settings</span>
        </button>
      </nav>

      {/* Detail Modal */}
      {selectedStudentForDetails && (
        <StudentDetailModal 
          student={selectedStudentForDetails} 
          onClose={() => setSelectedStudentForDetails(null)} 
        />
      )}
      </div>
    </div>
  );
}
