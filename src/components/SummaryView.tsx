import { useMemo } from 'react';
import type { FeeData } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function SummaryView({ data }: { data: FeeData }) {
  const stats = useMemo(() => {
    let totalBilled = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let overdueCount = 0;
    let fullyPaidCount = 0;

    data.students.forEach(student => {
      totalBilled += student.totalBilled;
      totalPaid += student.totalPaid;
      if (student.balance > 0) totalOutstanding += student.balance;
      if (student.status === 'OVERDUE') overdueCount++;
      if (student.status === 'PAID') fullyPaidCount++;
    });

    const collectionRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;

    return { totalBilled, totalPaid, totalOutstanding, overdueCount, fullyPaidCount, collectionRate };
  }, [data]);

  return (
    <div className="max-w-[1280px] mx-auto w-full p-4 space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-on-surface mb-1">Financial Summary</h2>
        <p className="text-[14px] text-on-surface-variant">Overview of current fee collection cycle.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
        <h3 className="text-[14px] font-semibold text-on-surface-variant mb-2">Collection Progress</h3>
        <div className="flex justify-between items-end mb-2">
          <span className="text-[28px] font-bold text-primary tabular-nums leading-none">
            {stats.collectionRate.toFixed(1)}%
          </span>
          <span className="text-[14px] font-medium text-primary">Collected</span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${stats.collectionRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[12px] text-on-surface-variant font-medium">
          <span>{formatCurrency(stats.totalPaid)}</span>
          <span>Target: {formatCurrency(stats.totalBilled)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <p className="text-[12px] text-on-surface-variant mb-1">Total Outstanding</p>
          <p className="text-[20px] font-bold text-error tabular-nums">
            {formatCurrency(stats.totalOutstanding)}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <p className="text-[12px] text-on-surface-variant mb-1">Total Collected</p>
          <p className="text-[20px] font-bold text-primary tabular-nums">
            {formatCurrency(stats.totalPaid)}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
        <h3 className="text-[14px] font-semibold text-on-surface-variant mb-4">Student Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error" />
              <span className="text-[14px] text-on-surface">Overdue</span>
            </div>
            <span className="text-[14px] font-bold">{stats.overdueCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[14px] text-on-surface">Fully Paid</span>
            </div>
            <span className="text-[14px] font-bold">{stats.fullyPaidCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-outline-variant" />
              <span className="text-[14px] text-on-surface">Other</span>
            </div>
            <span className="text-[14px] font-bold">{data.students.length - stats.overdueCount - stats.fullyPaidCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
