import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const NAV = [
    {
        to: '/home', label: 'Home',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        to: '/reports', label: 'Reports',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 17V13M12 17V9M16 17v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        to: '/settings', label: 'Settings',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [logoutHov, setLogoutHov] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <aside style={s.aside}>
            {/* Logo */}
            <div style={s.logoWrap}>
                <div style={s.logoIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#00f5c4" strokeWidth="1.6" />
                        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="#00f5c4" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="3" fill="#00f5c4" fillOpacity="0.2" stroke="#00f5c4" strokeWidth="1.6" />
                    </svg>
                </div>
                <div>
                    <div style={s.logoTitle}>NetDiag Pro</div>
                    <div style={s.logoSub}>v2.1.0</div>
                </div>
            </div>

            {/* User pill */}
            <div style={s.userPill}>
                <div style={s.avatar}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                    <div style={s.userName}>{user?.username || 'User'}</div>
                    <div style={s.userRole}>Network Admin</div>
                </div>
                <div style={{ ...s.onlineDot }} />
            </div>

            {/* Section label */}
            <div style={s.sectionLabel}>NAVIGATION</div>

            {/* Nav links */}
            <nav style={{ flex: 1 }}>
                {NAV.map(({ to, label, icon }) => (
                    <NavLink key={to} to={to} style={({ isActive }) => ({ ...s.link, ...(isActive ? s.linkActive : {}) })}>
                        {({ isActive }) => (
                            <>
                                {isActive && <div style={s.activeBar} />}
                                <span style={{ ...s.linkIcon, color: isActive ? '#00f5c4' : 'rgba(255,255,255,0.45)' }}>{icon}</span>
                                <span style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: isActive ? 700 : 500 }}>{label}</span>
                                {isActive && <div style={s.activeDot} />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Divider */}
            <div style={s.divider} />

            {/* Status */}
            <div style={s.statusBox}>
                <div style={s.statusRow}>
                    <div style={{ ...s.statusDot, background: '#00f5c4', boxShadow: '0 0 6px #00f5c4' }} />
                    <span style={s.statusText}>Network Online</span>
                </div>
                <div style={s.statusVal}>99.8% uptime</div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                onMouseEnter={() => setLogoutHov(true)}
                onMouseLeave={() => setLogoutHov(false)}
                style={{ ...s.logoutBtn, ...(logoutHov ? s.logoutBtnHov : {}) }}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Logout
            </button>
        </aside>
    );
}

const s = {
    aside: {
        width: 240, minHeight: '100vh', background: '#0a1525',
        borderRight: '1px solid rgba(0,245,196,0.1)',
        display: 'flex', flexDirection: 'column',
        padding: '0 0 24px', position: 'relative', flexShrink: 0,
    },
    logoWrap: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    logoIcon: {
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoTitle: { fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif" },
    logoSub: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace" },
    userPill: {
        margin: '16px 14px', padding: '12px 14px', borderRadius: 12,
        background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.12)',
        display: 'flex', alignItems: 'center', gap: 10, position: 'relative',
    },
    avatar: {
        width: 34, height: 34, borderRadius: 8,
        background: 'linear-gradient(135deg,#00f5c4,#7b61ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800, color: '#070e1a', fontFamily: "'Syne',sans-serif", flexShrink: 0,
    },
    userName: { fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Syne',sans-serif" },
    userRole: { fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace" },
    onlineDot: {
        position: 'absolute', top: 10, right: 10,
        width: 8, height: 8, borderRadius: '50%',
        background: '#00f5c4', boxShadow: '0 0 6px #00f5c4',
        animation: 'ndPulse 2s ease infinite',
    },
    sectionLabel: {
        fontSize: 9, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)',
        fontFamily: "'Space Mono',monospace", padding: '16px 20px 8px',
    },
    link: {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 20px', textDecoration: 'none',
        fontFamily: "'Syne',sans-serif", fontSize: 13,
        borderRadius: 0, position: 'relative', transition: 'background 0.2s',
        background: 'transparent',
    },
    linkActive: { background: 'rgba(0,245,196,0.07)' },
    linkIcon: { display: 'flex', alignItems: 'center', transition: 'color 0.2s' },
    activeBar: {
        position: 'absolute', left: 0, top: '20%', bottom: '20%',
        width: 3, borderRadius: '0 3px 3px 0', background: '#00f5c4',
        boxShadow: '0 0 8px #00f5c4',
    },
    activeDot: {
        marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
        background: '#00f5c4', boxShadow: '0 0 6px #00f5c4',
    },
    divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 20px' },
    statusBox: { padding: '10px 20px' },
    statusRow: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 },
    statusDot: { width: 7, height: 7, borderRadius: '50%' },
    statusText: { fontSize: 11, color: '#00f5c4', fontFamily: "'Syne',sans-serif", fontWeight: 700 },
    statusVal: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono',monospace", paddingLeft: 14 },
    logoutBtn: {
        margin: '8px 14px 0', padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
        border: '1px solid rgba(245,75,0,0.25)', background: 'rgba(245,75,0,0.06)',
        color: 'rgba(245,120,80,0.9)', fontFamily: "'Syne',sans-serif",
        fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
        transition: 'all 0.2s',
    },
    logoutBtnHov: { background: 'rgba(245,75,0,0.14)', borderColor: 'rgba(245,75,0,0.5)', color: '#f54b00' },
};