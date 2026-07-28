'use client';

import { useState, useCallback } from 'react';
import { stats, siteData } from '@/lib/content';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DeviceMode } from '@/hooks/useDeviceMode';

export default function SystemInfoWindow() {
  const [activeTab, setActiveTab] = useState('General');
  const [uptime] = useState(() => `${Math.floor(Math.random() * 365) + 100} days (and counting)`);
  
  const [, setDevicePreference] = useLocalStorage<DeviceMode | null>(
    'farhan-device-preference',
    null
  );

  const resetDevicePreference = useCallback(() => {
    setDevicePreference(null);
    window.location.reload();
  }, [setDevicePreference]);

  const tabs = ['General', 'Hardware', 'Advanced'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ece9d8', color: '#000', fontFamily: 'Tahoma, sans-serif', padding: '10px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', paddingLeft: '2px' }}>
        {tabs.map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: activeTab === tab ? '#fff' : '#ece9d8',
              borderTop: '1px solid #fff',
              borderLeft: '1px solid #fff',
              borderRight: '1px solid #aca899',
              borderBottom: activeTab === tab ? 'none' : '1px solid #fff',
              marginBottom: activeTab === tab ? '-1px' : '0',
              marginTop: activeTab === tab ? '0' : '2px',
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
              cursor: 'pointer',
              zIndex: activeTab === tab ? 2 : 1,
              position: 'relative'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#fff', 
        borderTop: '1px solid #fff', 
        borderLeft: '1px solid #fff', 
        borderRight: '1px solid #aca899', 
        borderBottom: '1px solid #aca899',
        boxShadow: '-1px -1px 0 #aca899, 1px 1px 0 #fff',
        padding: '16px',
        overflow: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {activeTab === 'General' && (
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
            <div style={{ fontSize: '48px', paddingTop: '8px' }}>💻</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>System:</div>
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div>Farhan OS v3.0</div>
                  <div>Build 2026 (Modern Cyber-Retro)</div>
                  <div>Next.js + TypeScript + Tailwind</div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #dfdfdf', margin: '4px 0' }} />
              
              <div>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>Registered to:</div>
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div>{siteData.name}</div>
                  <div>{siteData.tagline}</div>
                  <div>{siteData.location}</div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #dfdfdf', margin: '4px 0' }} />
              
              <div>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>Computer:</div>
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div>Genius Mode: Active</div>
                  <div>Coffee Status: 99% — refill recommended</div>
                  <div>Uptime: {uptime}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Hardware' && (
          <div style={{ fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px' }}>⚙️</div>
              <div>
                <div style={{ fontWeight: 700 }}>Device Manager</div>
                <div>View and manage your loaded portfolio components.</div>
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dfdfdf' }}>
              <tbody>
                {[
                  ['Projects', `${stats.projectCount} loaded (${stats.featuredProjectCount} featured)`],
                  ['Skills', `${stats.skillCount}+ indexed across 8 neural pathways`],
                  ['Certifications', `${stats.certCount} verified standard protocols`],
                  ['Achievements', `${stats.achievementCount} major milestones unlocked`],
                  ['Internships', `${stats.experienceCount} professional deployments completed`],
                  ['Game Engine', 'Phaser.js (Phase 16+ hardware acceleration)'],
                ].map(([key, val], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #dfdfdf' }}>
                    <td style={{ padding: '6px', fontWeight: 700, width: '35%', borderRight: '1px solid #dfdfdf', backgroundColor: '#f9f9f9' }}>{key}</td>
                    <td style={{ padding: '6px' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Advanced' && (
          <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>📱</span> <span style={{ fontWeight: 700 }}>Performance & Display</span>
              </div>
              <div style={{ paddingLeft: '22px' }}>
                <div style={{ marginBottom: '8px' }}>Visual effects, rendering modes, and device emulation overrides.</div>
                <button 
                  onClick={resetDevicePreference}
                  style={{ padding: '2px 12px', fontSize: '11px', fontFamily: 'Tahoma', backgroundColor: '#ece9d8', borderTop: '1px solid #fff', borderLeft: '1px solid #fff', borderRight: '1px solid #888', borderBottom: '1px solid #888', cursor: 'pointer' }}
                >
                  Reset Device Preference
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #dfdfdf' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>🌐</span> <span style={{ fontWeight: 700 }}>Network Domain</span>
              </div>
              <div style={{ paddingLeft: '22px', color: '#0000cc' }}>
                farhanbuilds.in
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #dfdfdf' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>🔑</span> <span style={{ fontWeight: 700 }}>Status</span>
              </div>
              <div style={{ paddingLeft: '22px' }}>
                {siteData.availability}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer / OK buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', paddingTop: '12px' }}>
        <button style={{ minWidth: '75px', padding: '2px 12px', fontSize: '11px', fontFamily: 'Tahoma', backgroundColor: '#ece9d8', borderTop: '1px solid #fff', borderLeft: '1px solid #fff', borderRight: '1px solid #888', borderBottom: '1px solid #888', cursor: 'pointer' }}>OK</button>
        <button style={{ minWidth: '75px', padding: '2px 12px', fontSize: '11px', fontFamily: 'Tahoma', backgroundColor: '#ece9d8', borderTop: '1px solid #fff', borderLeft: '1px solid #fff', borderRight: '1px solid #888', borderBottom: '1px solid #888', cursor: 'pointer' }}>Cancel</button>
        <button style={{ minWidth: '75px', padding: '2px 12px', fontSize: '11px', fontFamily: 'Tahoma', backgroundColor: '#ece9d8', borderTop: '1px solid #fff', borderLeft: '1px solid #fff', borderRight: '1px solid #888', borderBottom: '1px solid #888', color: '#888' }} disabled>Apply</button>
      </div>
    </div>
  );
}
