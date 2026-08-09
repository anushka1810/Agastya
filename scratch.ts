import feeDataJson from './src/data/fee-data.json.json';
import { computeStudentState } from './src/lib/computeStudentState';
import { groupByFamily } from './src/lib/groupByFamily';
import type { Student } from './src/types';

const feeData = feeDataJson as any;

const stu1005 = feeData.students.find((s: any) => s.id === 'STU-1005');
console.log('--- STU-1005 (Scholarship) State ---');
console.log(JSON.stringify(computeStudentState(stu1005 as Student), null, 2));

const fernandesStudents = feeData.students.filter((s: any) => s.familyId === 'FAM-360');
console.log('\n--- Fernandes Family Students State ---');
fernandesStudents.forEach((s: any) => {
  console.log(s.name, JSON.stringify(computeStudentState(s as Student), null, 2));
});

console.log('\n--- Grouped By Family (First 2) ---');
const grouped = groupByFamily(feeData.students as Student[]);
console.log(JSON.stringify(grouped.slice(0, 2), null, 2));
console.log(`Total families: ${grouped.length}`);
