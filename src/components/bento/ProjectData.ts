export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  highlights: string[];
  techStack: string[];
  demo?: string;
  repo?: string;
  featured?: boolean;
}

export const CATEGORIES = ['ALL', 'FULL-STACK', 'DSA+BACKEND', 'AI/ML'];

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'Day 0',
    category: 'Full-Stack',
    featured: true,
    image: '/project_day0.png',
    description:
      'Built a web-based career simulation platform that helps students and freshers experience real-world job roles before entering the workforce. Users select a career path and complete daily tasks in a simulated work environment designed to mirror actual workplace pressures and expectations.',
    highlights: [
      'Interactive role simulator mirroring production workplace sprints and daily duties',
      'Structured task verification engine with automated progress benchmarks',
      'Scalable full-stack architecture built with React, Node.js, Express, and MongoDB',
    ],
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Machine Learning'],
    demo: 'https://day-0-delta.vercel.app/',
    repo: 'https://github.com/vinit-singh2007/Day-0',
  },
  {
    id: 2,
    title: 'Delivr-X',
    category: 'AI/Ml',
    image: '/project_Delivr-x.png',
    description:
      'Built an autonomous drone fleet dispatch and telemetry platform for dense urban airspace. Engineered a dynamic 3D route planning engine with real-time weather integration, Scikit-Learn battery decay prediction, and Google Gemini LLM safety clearance. Streamed live telemetry and automated emergency Return-to-Base (RTH) protocols via WebSockets and FastAPI.',
    highlights: [
      'Dynamic 3D route trajectory optimization with live weather feed integration',
      'Scikit-Learn ML battery decay modeling & Google Gemini flight safety validation',
      'Real-time WebSocket telemetry stream with automated emergency Return-to-Base protocols',
    ],
    techStack: ['React', 'Vite', 'Python', 'FastAPI', 'Scikit-Learn', 'WebSockets', 'OpenWeather API', 'Google Gemini'],
    demo: '',
    repo: 'https://github.com/vinit-singh2007/AeroRoute-AI',
  },
  {
    id: 3,
    title: 'DeepShield',
    category: 'AI/Ml',
    image: '/project_deepshield.png',
    description:
      'Developed a web-based deepfake detection platform that enables users to upload and evaluate video files for authenticity. Integrated frame-by-frame lip-sync verification and facial landmark analysis to identify potential manipulations. Included temporal analysis tools to track anomalies and inconsistencies across video timelines.',
    highlights: [
      'Frame-by-frame biometric verification analyzing facial landmarks and lip-sync alignment',
      'Temporal inconsistency detection scanning frame sequences for synthetic anomalies',
      'High-throughput computer vision pipeline powered by PyTorch and OpenCV backends',
    ],
    techStack: ['React', 'Tailwind CSS', 'Python', 'FastAPI', 'PyTorch', 'OpenCV'],
    demo: '',
    repo: 'https://github.com/vinit-singh2007/Deepfake_Detection',
  },
  {
    id: 4,
    title: 'Disk Scheduling Algorithm Analyzer',
    category: 'DSA+Backend',
    image: '/project_DSAA.png',
    description:
      'Built a web application that visualizes and analyzes classic disk scheduling algorithms helping students and developers understand operating system concepts through interactive simulation.',
    highlights: [
      'Interactive visualization and simulation for FCFS, SSTF, SCAN, C-SCAN, and LOOK',
      'Comparative seek-time analysis graphs with detailed track movement statistics',
      'Educational step-by-step head execution controls designed for OS conceptual clarity',
    ],
    techStack: ['React', 'Node.js', 'Express.js', 'DSA', 'Algorithms'],
    demo: 'https://disk-scheduling-algorithm-analyzer-1.onrender.com',
    repo: 'https://github.com/vinit-singh2007/Disk-scheduling-Algorithm-Analyzer',
  },
  {
    id: 5,
    title: 'Mirror Memory',
    category: 'Full-Stack',
    image: '/project_memory_mirror.jpeg',
    description:
      'An IoT-powered inventory system that links physical equipment to a live web dashboard using an ESP32 and RFID tags. It tracks asset status, records maintenance history, and generates QR badges, with every scan synced in real time.',
    highlights: [
      'Hardware-to-cloud IoT pipeline linking ESP32 RFID scanners to web dashboard',
      'Real-time asset telemetry, maintenance timeline auditing, and Supabase integration',
      'Automated QR equipment badge generation and instant scan status verification',
    ],
    techStack: ['React', 'Node.js', 'Express.js', 'Supabase', 'ESP32', 'RFID'],
    demo: '',
    repo: 'https://github.com/vinit-singh2007/Smart_Inventory_System',
  },
];

