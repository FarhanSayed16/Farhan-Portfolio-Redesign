'use client';

import { experienceData } from '@/lib/content';
import { useState } from 'react';
import { Briefcase } from 'lucide-react';

/**
 * Experience — Classic Windows TreeView.
 */
export default function ExperienceWindow() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div style={{ 
      padding: '16px', 
      fontFamily: 'var(--font-sans)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'var(--os-window-body, #ece9d8)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <img src="/icons/experience.png" alt="Experience" width={24} height={24} style={{ imageRendering: 'pixelated' }} />
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
          Work Experience
        </h2>
        <div style={{ fontSize: '11px', color: '#666', marginLeft: 'auto' }}>
          {experienceData.length} entries
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        background: '#fff', 
        border: '1px solid',
        borderColor: '#808080 #e0e0e0 #e0e0e0 #808080',
        padding: '8px', 
        overflowY: 'auto' 
      }}>
        {experienceData.map((exp, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} style={{ marginBottom: '4px' }}>
              <div 
                style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                <div style={{
                  width: '11px', height: '11px', 
                  border: '1px solid #808080', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#fff',
                  marginTop: '3px',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: '#000',
                  lineHeight: 1
                }}>
                  {isExpanded ? '-' : '+'}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} color="#666" />
                  <div
                    style={{ 
                      fontSize: '12px', 
                      color: isExpanded ? '#fff' : 'var(--text)',
                      background: isExpanded ? '#0831d9' : 'transparent',
                      padding: '1px 4px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{exp.role}</span>
                    <span> at {exp.company}</span>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ 
                  marginLeft: '5px', 
                  paddingLeft: '22px', 
                  borderLeft: '1px dotted #808080',
                  marginTop: '4px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--text)',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '6px', color: '#666' }}>{exp.duration}</div>
                  <div>{exp.description}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
