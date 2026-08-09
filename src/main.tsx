import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import feeDataJson from './data/fee-data.json.json'
import { computeStudentState } from './lib/computeStudentState'
import { groupByFamily } from './lib/groupByFamily'
import type { Student } from './types'

const feeData = feeDataJson as any;

const stu1005 = feeData.students.find((s: any) => s.id === 'STU-1005');
console.log('--- STU-1005 (Scholarship) State ---');
console.log(computeStudentState(stu1005 as Student));

const fernandesStudents = feeData.students.filter((s: any) => s.familyId === 'FAM-360');
console.log('--- Fernandes Family Students State ---');
fernandesStudents.forEach((s: any) => {
  console.log(s.name, computeStudentState(s as Student));
});

console.log('--- Grouped By Family ---');
console.log(groupByFamily(feeData.students as Student[]));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
