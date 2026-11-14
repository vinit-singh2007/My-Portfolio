export interface TimelineEntryItem {
  id: number;
  role: string;
  company: string;
  duration: string;
  startDateStr: string;
  endDateStr: string;
  startYear: string;
  description: string;
  monogram: string;
  skills: string[];
}

export function parseDate(str: string): Date {
  if (str.toLowerCase() === 'present') return new Date();
  const parts = str.trim().split(/\s+/);
  if (parts.length === 2) {
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const mIdx = monthNames.findIndex((m) => parts[0].toLowerCase().startsWith(m));
    const year = parseInt(parts[1], 10);
    return new Date(year, mIdx >= 0 ? mIdx : 0, 1);
  }
  return new Date();
}

export function calculateDuration(startDateStr: string, endDateStr: string): { totalMonths: number; formatted: string } {
  const start = parseDate(startDateStr);
  const end = endDateStr.toLowerCase() === 'present' ? new Date() : parseDate(endDateStr);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) months = 1;

  const yrs = Math.floor(months / 12);
  const mos = months % 12;

  let formatted = '';
  if (yrs > 0 && mos > 0) {
    formatted = `${yrs} YR ${mos} MO`;
  } else if (yrs > 0) {
    formatted = `${yrs} YR`;
  } else {
    formatted = `${mos} MO`;
  }

  return { totalMonths: months, formatted };
}

export function formatMonths(monthsCount: number): string {
  const yrs = Math.floor(monthsCount / 12);
  const mos = monthsCount % 12;
  if (yrs > 0 && mos > 0) return `${yrs} YR ${mos} MO`;
  if (yrs > 0) return `${yrs} YR`;
  return `${mos} MO`;
}

export const TIMELINE_DATA: TimelineEntryItem[] = [
  {
    id: 1,
    role: 'Student',
    company: 'ST. John College Of Engineering And Management',
    duration: 'Aug 2024 - Present',
    startDateStr: 'Aug 2024',
    endDateStr: 'Present',
    startYear: '2024',
    description:
      "I'm a Full Stack Developer and B.Tech student at St. John College of Engineering and Management, who loves turning ideas into real, working products. I build with React and Node.js on the frontend and backend, and I'm increasingly drawn to the world of AI — exploring how it's reshaping the way we build software.",
    monogram: 'SJ',
    skills: ['React', 'Node.js', 'Full-Stack', 'AI'],
  },
  {
    id: 2,
    role: 'Full Stack Engineer',
    company: 'ST. John College Of Engineering And Management',
    duration: 'June 2025 - Present',
    startDateStr: 'June 2025',
    endDateStr: 'Present',
    startYear: '2025',
    description:
      "I am a Full-Stack Developer who specializes in building the brains and architecture of modern web applications. While I am fully capable of translating a design into a clean frontend interface, my true expertise lies in architecting robust backend systems and integrating intelligent AI/ML models. I don't just build websites that look good; I build data-driven ecosystems that process complex logic, automate tasks, and scale seamlessly under pressure.",
    monogram: 'SJ',
    skills: ['Full-Stack', 'Backend Systems', 'AI/ML Models', 'System Architecture'],
  },
];

