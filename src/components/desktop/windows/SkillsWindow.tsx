'use client';

import { skillsData } from '@/lib/content';
import { useState } from 'react';
import { 
  Brain, Database, Globe, Smartphone, Cpu, Layers, Bot, 
  Wifi, Eye, Cloud, Users, Lightbulb, Zap, Layout, Terminal, Blocks, Presentation, Code2
} from 'lucide-react';

const SKILL_ICONS: Record<string, string> = {
  'python': 'python/python-original.svg',
  'javascript': 'javascript/javascript-original.svg',
  'c/c++': 'cplusplus/cplusplus-original.svg',
  'dart': 'dart/dart-original.svg',
  'html/css': 'html5/html5-original.svg',
  'php': 'php/php-original.svg',
  'react.js': 'react/react-original.svg',
  'next.js': 'nextjs/nextjs-original.svg',
  'svelte': 'svelte/svelte-original.svg',
  'sveltekit': 'svelte/svelte-original.svg',
  'node.js': 'nodejs/nodejs-original.svg',
  'express': 'express/express-original.svg',
  'fastapi': 'fastapi/fastapi-original.svg',
  'socket.io': 'socketio/socketio-original.svg',
  'flutter': 'flutter/flutter-original.svg',
  'mysql': 'mysql/mysql-original.svg',
  'mongodb': 'mongodb/mongodb-original.svg',
  'postgresql': 'postgresql/postgresql-original.svg',
  'firebase': 'firebase/firebase-original.svg',
  'redis': 'redis/redis-original.svg',
  'tensorflow/pytorch': 'tensorflow/tensorflow-original.svg',
  'docker': 'docker/docker-original.svg',
  'figma': 'figma/figma-original.svg',
  'arduino mega': 'arduino/arduino-original.svg',
  'raspberry pi': 'raspberrypi/raspberrypi-original.svg',
};

function getSkillIconUrl(skill: string) {
  const key = skill.toLowerCase();
  if (SKILL_ICONS[key]) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${SKILL_ICONS[key]}`;
  }
  return null;
}

function getFallbackIcon(skill: string, size: number = 14) {
  const s = skill.toLowerCase();
  if (s.includes('api') || s.includes('socket')) return <Globe size={size} color="var(--text-muted)" />;
  if (s.includes('data') || s.includes('sql') || s.includes('postgis')) return <Database size={size} color="var(--text-muted)" />;
  if (s.includes('ai ') || s.includes('machine') || s.includes('neural') || s.includes('nlp') || s.includes('transformers')) return <Brain size={size} color="var(--text-muted)" />;
  if (s.includes('vision') || s.includes('yolo') || s.includes('mediapipe')) return <Eye size={size} color="var(--text-muted)" />;
  if (s.includes('iot') || s.includes('esp') || s.includes('sensors') || s.includes('hardware')) return <Cpu size={size} color="var(--text-muted)" />;
  if (s.includes('robot') || s.includes('agent')) return <Bot size={size} color="var(--text-muted)" />;
  if (s.includes('cloud') || s.includes('docker') || s.includes('celery')) return <Cloud size={size} color="var(--text-muted)" />;
  if (s.includes('management') || s.includes('leadership')) return <Users size={size} color="var(--text-muted)" />;
  if (s.includes('speaking')) return <Presentation size={size} color="var(--text-muted)" />;
  if (s.includes('problem') || s.includes('adaptability')) return <Lightbulb size={size} color="var(--text-muted)" />;
  if (s.includes('prototyping') || s.includes('agile')) return <Zap size={size} color="var(--text-muted)" />;
  if (s.includes('ui/ux') || s.includes('design') || s.includes('figma') || s.includes('archimate')) return <Layout size={size} color="var(--text-muted)" />;
  if (s.includes('stack') || s.includes('architecture')) return <Layers size={size} color="var(--text-muted)" />;
  if (s.includes('app') || s.includes('mobile')) return <Smartphone size={size} color="var(--text-muted)" />;
  return <Terminal size={size} color="var(--text-muted)" />;
}

/**
 * Skills.exe — Premium Tab-based skills viewer.
 */
export default function SkillsWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const category = skillsData[activeTab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Classic Windows Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '8px 8px 0 8px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {skillsData.map((cat, i) => {
          const isActive = i === activeTab;
          return (
            <button
              key={cat.categoryName}
              onClick={() => setActiveTab(i)}
              style={{
                background: 'var(--os-window-body, #ece9d8)',
                border: '1px solid',
                borderColor: isActive ? '#fff #808080 var(--os-window-body) #fff' : '#fff #808080 #808080 #fff',
                padding: isActive ? '6px 14px 8px' : '4px 12px 4px',
                marginTop: isActive ? '0' : '4px',
                marginRight: '2px',
                marginBottom: isActive ? '-1px' : '0',
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                boxShadow: isActive ? 'none' : 'inset 0 -1px 2px rgba(0,0,0,0.05)',
                position: 'relative',
                zIndex: isActive ? 3 : 1,
              }}
            >
              {cat.categoryName}
            </button>
          );
        })}
      </div>

      {/* Classic Tab Content Frame */}
      <div 
        style={{ 
          flex: 1, 
          margin: '0 8px 8px 8px', 
          padding: '16px', 
          background: 'var(--os-window-body, #ece9d8)',
          border: '1px solid',
          borderColor: '#fff #808080 #808080 #fff',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <img src="/icons/skills.svg" alt="Skills" width={20} height={20} style={{ imageRendering: 'pixelated' }} />
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
            {category.categoryName}
          </h2>
          <div style={{ fontSize: '13px', color: '#666', marginLeft: 'auto' }}>
            {category.skills.length} items
          </div>
        </div>

        {/* Inset List View for Skills */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid',
            borderColor: '#808080 #e0e0e0 #e0e0e0 #808080',
            padding: '16px',
            overflow: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '8px',
            alignContent: 'start',
          }}
        >
          {category.skills.map((skill) => {
            const iconUrl = getSkillIconUrl(skill);
            return (
              <div
                key={skill}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 8px',
                  fontSize: '14px',
                  color: 'var(--text)',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--os-highlight)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text)';
                }}
              >
                {iconUrl ? (
                  <img src={iconUrl} alt={skill} width={18} height={18} style={{ objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getFallbackIcon(skill, 18)}
                  </div>
                )}
                {skill}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
