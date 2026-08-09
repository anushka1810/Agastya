import React, { useState, useMemo } from 'react';
import type { FeeData } from '../types';

export function StudentsView({ data }: { data: FeeData }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return data.students;
    const lower = searchTerm.toLowerCase();
    return data.students.filter(
      (s) => s.name.toLowerCase().includes(lower) || s.admissionNo.toLowerCase().includes(lower)
    );
  }, [data.students, searchTerm]);

  return (
    <div className="max-w-[1280px] mx-auto w-full p-4 space-y-4">
      <div>
        <h2 className="text-[20px] font-bold text-on-surface mb-1">Student Directory</h2>
        <p className="text-[14px] text-on-surface-variant">Total {data.students.length} students enrolled.</p>
      </div>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input
          type="text"
          placeholder="Search by name or admission number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
        />
      </div>

      <div className="space-y-3 pt-2">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-[14px]">
            No students found matching "{searchTerm}".
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[14px]">
                {student.name.charAt(0)}
              </div>
              <div className="flex-grow">
                <h3 className="text-[14px] leading-[20px] font-semibold text-on-surface">{student.name}</h3>
                <p className="text-[12px] leading-[16px] text-on-surface-variant">
                  Adm: {student.admissionNo} | {student.class}-{student.section}
                </p>
              </div>
              <button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
