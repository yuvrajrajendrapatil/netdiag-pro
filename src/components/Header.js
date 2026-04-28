// Top Navigation Bar
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header style={styles.header}>
            <div style={styles.left}>
                <h2 style={styles.pageTitle}>NetDiag Pro Dashboard</h2>
                <span style={styles.badge}>v2.0</span>
            </div>

            <div style={styles.right}>
                <div style={styles.user}>
                    <div style={styles.avatar}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={styles.username}>{user?.username}</span>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout →
                </button>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 32px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    pageTitle: {
        fontSize: '20px',
        fontWeight: '700',
    },
    badge: {
        padding: '4px 12px',
        background: 'var(--accent-blue)',
        color: 'white',
        fontSize: '12px',
        borderRadius: '12px',
        fontWeight: '600',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    user: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '16px',
    },
    username: {
        fontWeight: '500',
    },
    logoutBtn: {
        padding: '10px 20px',
        background: 'transparent',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
    },
};