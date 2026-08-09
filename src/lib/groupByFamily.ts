import type { Student } from '../types';

export type FamilyGroup = {
  familyId: string;
  guardianName: string;
  students: Student[];
  totalBalance: number;
  isStandalone: boolean;
};

export function groupByFamily(students: Student[]): FamilyGroup[] {
  const familyMap = new Map<string, FamilyGroup>();

  for (const student of students) {
    if (!familyMap.has(student.familyId)) {
      familyMap.set(student.familyId, {
        familyId: student.familyId,
        guardianName: student.guardian.name,
        students: [],
        totalBalance: 0,
        isStandalone: true,
      });
    }

    const group = familyMap.get(student.familyId)!;
    group.students.push(student);
    group.totalBalance += student.balance;
    if (group.students.length > 1) {
      group.isStandalone = false;
    }
  }

  return Array.from(familyMap.values());
}
