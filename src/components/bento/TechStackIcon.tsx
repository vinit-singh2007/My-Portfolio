import React from 'react';
import {
  Brain,
  CloudSun,
  Radio,
  Binary,
  Code2,
} from 'lucide-react';
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiVite,
  SiPython,
  SiFastapi,
  SiScikitlearn,
  SiGooglegemini,
  SiTailwindcss,
  SiPytorch,
  SiOpencv,
  SiSupabase,
  SiEspressif,
  SiThealgorithms,
  SiSocketdotio,
} from 'react-icons/si';

// Authentic raw brand colors for every technology in the portfolio
const RAW_BRAND_COLORS: Record<string, string> = {
  react: '#61DAFB',
  'node.js': '#539E43',
  nodejs: '#539E43',
  'express.js': '#FFFFFF',
  express: '#FFFFFF',
  mongodb: '#47A248',
  'machine learning': '#A855F7',
  vite: '#646CFF',
  python: '#3776AB',
  fastapi: '#05998B',
  'scikit-learn': '#F7931E',
  websockets: '#38BDF8',
  'openweather api': '#EB6E4B',
  'google gemini': '#4E88D4',
  'tailwind css': '#38BDF8',
  pytorch: '#EE4C2C',
  opencv: '#5C3EE8',
  dsa: '#F59E0B',
  algorithms: '#10B981',
  supabase: '#3ECF8E',
  esp32: '#E7352C',
  rfid: '#3B82F6',
};

export default function TechStackIcon({
  name,
  className = 'w-3 h-3 flex-shrink-0',
  raw = true,
}: {
  name: string;
  className?: string;
  raw?: boolean;
}) {
  const normalized = name.toLowerCase().trim();
  const brandColor = raw ? RAW_BRAND_COLORS[normalized] : undefined;
  const style = brandColor ? { color: brandColor } : undefined;

  switch (normalized) {
    case 'react':
      return <SiReact className={className} style={style} />;
    case 'node.js':
    case 'nodejs':
      return <SiNodedotjs className={className} style={style} />;
    case 'express.js':
    case 'express':
      return <SiExpress className={className} style={style} />;
    case 'mongodb':
      return <SiMongodb className={className} style={style} />;
    case 'machine learning':
      return <Brain className={className} style={style} />;
    case 'vite':
      return <SiVite className={className} style={style} />;
    case 'python':
      return <SiPython className={className} style={style} />;
    case 'fastapi':
      return <SiFastapi className={className} style={style} />;
    case 'scikit-learn':
      return <SiScikitlearn className={className} style={style} />;
    case 'websockets':
      return <SiSocketdotio className={className} style={style} />;
    case 'openweather api':
      return <CloudSun className={className} style={style} />;
    case 'google gemini':
      return <SiGooglegemini className={className} style={style} />;
    case 'tailwind css':
      return <SiTailwindcss className={className} style={style} />;
    case 'pytorch':
      return <SiPytorch className={className} style={style} />;
    case 'opencv':
      return <SiOpencv className={className} style={style} />;
    case 'dsa':
      return <Binary className={className} style={style} />;
    case 'algorithms':
      return <SiThealgorithms className={className} style={style} />;
    case 'supabase':
      return <SiSupabase className={className} style={style} />;
    case 'esp32':
      return <SiEspressif className={className} style={style} />;
    case 'rfid':
      return <Radio className={className} style={style} />;
    default:
      return <Code2 className={className} style={style} />;
  }
}
