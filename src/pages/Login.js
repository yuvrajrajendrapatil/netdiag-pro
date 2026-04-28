// Login Page - Demo credentials: admin / admin123
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Demo credentials check
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            login({ username: credentials.username });
            navigate('/home');
        } else {
            setError('Invalid credentials. Try: admin / admin123');
        }
    };

    return (
        <div style={styles.container}>
            {/* Background Grid */}
            <div style={styles.gridBg}></div>

            <div style={styles.card} className="fade-in">
                {/* Logo */}
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>🔬</div>
                    <h1 style={styles.title}>NetDiag Pro</h1>
                    <p style={styles.subtitle}>Network & Workflow Diagnostic System</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            style={styles.input}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            style={styles.input}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.button}>
                        Login to Dashboard →
                    </button>

                    <div style={styles.hint}>
                        💡 Demo: <code>admin / admin123</code>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
    },
    gridBg: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `
      linear-gradient(var(--border-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-color) 1px, transparent 1px)
    `,
        backgroundSize: '50px 50px',
        opacity: 0.1,
    },
    card: {
        background: 'var(--bg-card)',
        padding: '48px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        maxWidth: '440px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    logo: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoIcon: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
    },
    input: {
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '14px',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    error: {
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-red)',
        borderRadius: '8px',
        color: 'var(--accent-red)',
        fontSize: '14px',
        textAlign: 'center',
    },
    hint: {
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginTop: '8px',
    },
};