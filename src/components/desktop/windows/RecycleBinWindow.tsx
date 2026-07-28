'use client';

import { useState } from 'react';

/**
 * Recycle Bin — Easter egg window with humorous "deleted" items.
 */
const DELETED_ITEMS = [
  { name: 'impostor_syndrome.exe', size: '∞ KB', date: 'Every day', status: 'Permanently deleted', icon: '☠️' },
  { name: 'tutorial_hell/', size: '2.4 GB', date: '2023', status: 'Permanently deleted', icon: '📁' },
  { name: 'giving_up.txt', size: '0 KB', date: 'Never', status: 'File not found', icon: '📄' },
  { name: 'sleep_schedule.ics', size: '404 KB', date: '2024', status: 'Corrupted beyond repair', icon: '📅' },
  { name: 'procrastination.dll', size: '999 MB', date: 'Tomorrow', status: 'In progress...', icon: '⚙️' },
  { name: 'first_portfolio_v1/', size: '12 MB', date: '2023', status: 'Permanently deleted', icon: '📁' },
  { name: 'first_portfolio_v2/', size: '34 MB', date: '2024', status: 'Permanently deleted', icon: '📁' },
  { name: 'unnecessary_meetings.zip', size: '8 HR', date: 'Weekly', status: 'Permanently deleted', icon: '🗜️' },
  { name: 'perfect_code.js', size: '0 KB', date: 'Never existed', status: 'Mythical artifact', icon: '📜' },
  { name: 'free_time.exe', size: '0 B', date: '2025', status: 'Insufficient memory', icon: '⏳' },
];

export default function RecycleBinWindow() {
  const [items, setItems] = useState(DELETED_ITEMS);
  const [isEmptying, setIsEmptying] = useState(false);

  const emptyBin = () => {
    setIsEmptying(true);
    setTimeout(() => {
      setItems([]);
      setIsEmptying(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ece9d8', color: '#000', fontFamily: 'Tahoma, sans-serif' }}>
      
      {/* Menu Bar */}
      <div style={{ display: 'flex', gap: '16px', padding: '2px 8px', fontSize: '11px', borderBottom: '1px solid #aca899' }}>
        <span style={{ cursor: 'pointer' }}>File</span>
        <span style={{ cursor: 'pointer' }}>Edit</span>
        <span style={{ cursor: 'pointer' }}>View</span>
        <span style={{ cursor: 'pointer' }}>Favorites</span>
        <span style={{ cursor: 'pointer' }}>Tools</span>
        <span style={{ cursor: 'pointer' }}>Help</span>
      </div>
      
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px 8px', borderBottom: '1px solid #aca899', alignItems: 'center', backgroundColor: '#ece9d8' }}>
        <button onClick={emptyBin} disabled={items.length === 0 || isEmptying} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent', border: '1px solid transparent', cursor: items.length ? 'pointer' : 'default', padding: '4px 8px', borderRadius: '3px', opacity: items.length ? 1 : 0.5 }}>
          <span style={{ fontSize: '16px' }}>🗑️</span> <span style={{ fontSize: '11px' }}>Empty Recycle Bin</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar - Classic XP Blue Gradient */}
        <div style={{ width: '220px', background: 'linear-gradient(to bottom, #7ba2e7, #6375d6)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Task Box */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #fff', borderTopLeftRadius: '3px', borderTopRightRadius: '3px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#215dc6', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>Recycle Bin Tasks</span>
              <span>^</span>
            </div>
            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: items.length ? '#0000cc' : '#888', cursor: items.length ? 'pointer' : 'default', textDecoration: items.length ? 'underline' : 'none' }}
                onClick={emptyBin}
              >
                <span>❌</span> {isEmptying ? 'Emptying...' : 'Empty the Recycle Bin'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', cursor: 'default' }}>
                <span>↩️</span> Restore all items
              </div>
            </div>
          </div>

          {/* Details Box */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #fff', borderTopLeftRadius: '3px', borderTopRightRadius: '3px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#215dc6', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>Details</span>
              <span>^</span>
            </div>
            <div style={{ padding: '12px 8px', fontSize: '11px', color: '#000' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗑️</div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Recycle Bin</div>
              <div style={{ marginBottom: '8px' }}>System Folder</div>
              <div style={{ color: '#444' }}>Contains files and folders that you have deleted.</div>
            </div>
          </div>

        </div>

        {/* File List - White background */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#ffffff', borderLeft: '1px solid #aca899' }}>
          {items.length === 0 ? (
            <div style={{ padding: '24px', color: '#888', fontSize: '12px' }}>
              The Recycle Bin is empty.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'Tahoma, sans-serif' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ebeadb', boxShadow: '0 1px 0 #aca899' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 400, borderRight: '1px solid #aca899', borderBottom: '1px solid #aca899' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 400, borderRight: '1px solid #aca899', borderBottom: '1px solid #aca899' }}>Size</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 400, borderRight: '1px solid #aca899', borderBottom: '1px solid #aca899' }}>Date Deleted</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 400, borderBottom: '1px solid #aca899' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr 
                    key={i} 
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e3f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>
                    </td>
                    <td style={{ padding: '4px 8px', color: '#555' }}>{item.size}</td>
                    <td style={{ padding: '4px 8px', color: '#555' }}>{item.date}</td>
                    <td style={{ padding: '4px 8px', color: item.status.includes('progress') ? '#d97706' : '#555', fontStyle: item.status.includes('Mythical') ? 'italic' : 'normal' }}>
                      {item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
