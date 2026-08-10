

type StatusColor = 'red' | 'red-distinct' | 'amber' | 'green' | 'blue' | 'neutral';

interface StatusChipProps {
  label: string;
  color: StatusColor;
}

export function StatusChip({ label, color }: StatusChipProps) {
  let colorClasses = '';

  // Matching the design tokens strictly
  switch (color) {
    case 'green':
      // Paid / Success
      colorClasses = 'bg-primary-fixed text-on-primary-fixed-variant'; // Reusing fixed primary container for positive/neutral if no green exists, or I can use custom tailwind.
      // Wait, design says: "Semantic colors (Green, Amber, Red, Blue) are used strictly for status indicators"
      // But the generated HTML didn't use generic green, it used standard tailwind error/secondary-container.
      // Let's use custom tailwind colors for semantic statuses based on standard conventions but following the shape.
      colorClasses = 'bg-[#d1e7dd] text-[#0f5132]'; 
      break;
    case 'amber':
      // Partially Paid
      colorClasses = 'bg-secondary-container text-on-secondary-container';
      break;
    case 'red':
    case 'red-distinct':
      // Overdue / Failed
      colorClasses = 'bg-error-container text-on-error-container';
      break;
    case 'blue':
      // Credit
      colorClasses = 'bg-primary-fixed text-on-primary-fixed';
      break;
    case 'neutral':
    default:
      colorClasses = 'bg-surface-container-highest text-on-surface';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded font-label-caps text-[12px] font-bold tracking-[0.05em] uppercase ${colorClasses}`}
    >
      {label.replace('_', ' ')}
    </span>
  );
}
