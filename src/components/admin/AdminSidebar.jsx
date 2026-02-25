import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard',    path: '/admin',          icon: '⊡' },
  { label: 'Appointments', path: '/admin/appointments', icon: '📅' },
  { label: 'Patients',     path: '/admin/patients',  icon: '👥' },
  { label: 'Doctors',      path: '/admin/doctors',   icon: '🩺' },
  { label: 'Departments',  path: '/admin/departments',icon: '🏥' },
  { label: 'Reports',      path: '/admin/reports',   icon: '📊' },
  { label: 'Settings',     path: '/admin/settings',  icon: '⚙️' },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      width: collapsed ? 68 : 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 18px',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>🏥</div>
        {!collapsed && (
          <span style={{
            fontWeight: 700, fontSize: 16, color: 'var(--color-primary, #0F172A)',
            whiteSpace: 'nowrap',
          }}>MediAdmin</span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
              background: isActive ? '#EFF9FF' : 'transparent',
              color: isActive ? '#0EA5E9' : '#64748B',
              borderLeft: isActive ? '3px solid #0EA5E9' : '3px solid transparent',
            })}
          >
            <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #E2E8F0' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: 'none', background: '#F8FAFC', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
            color: '#94A3B8', fontSize: 16,
          }}
        >
          {collapsed ? '▷' : '◁'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;