import { STUDENTS } from '../data/content';

/** Merge baseline class data with saved assessments (latest score per student wins). */
export function studentScores(records) {
  const map = new Map(STUDENTS.map((s) => [s.name, s.score]));
  [...records].reverse().forEach((r) => {
    if (r.type === 'assessment' && r.student) map.set(r.student, r.score);
  });
  return [...map.entries()].map(([name, score]) => ({ name, score }));
}

export function classAverage(records) {
  const s = studentScores(records);
  return Math.round(s.reduce((a, b) => a + b.score, 0) / s.length);
}

export const gradeFor = (pct) => (pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D');
