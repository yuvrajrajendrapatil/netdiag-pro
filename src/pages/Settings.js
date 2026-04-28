// Main Settings Page - Sagale components integrate kelele
import React, { useState, useEffect } from 'react';
import UserSettings from '../components/settings/UserSettings';
import DiagnosticSettings from '../components/settings/DiagnosticSettings';
import WorkflowSettings from '../components/settings/WorkflowSettings';
import UISettings from '../components/settings/UISettings';
import ReportSettings from '../components/settings/ReportSettings';
import { loadSettings, saveSettings, resetSettings } from '../utils/settingsStorage';

export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Component load hotan settings load kara
    useEffect(() => {
        console.log('🔄 Loading settings...');
        const loaded = loadSettings();
        console.log('📦 Loaded settings:', loaded);
        setSettings(loaded);
    }, []);

    // Settings update handler
    const handleSettingChange = (section, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: value,
        }));
        setHasChanges(true);
    };

    // Save Settings
    const handleSave = () => {
        const success = saveSettings(settings);
        if (success) {
            console.log('✅ Settings Saved:', settings);
            setShowToast(true);
            setHasChanges(false);

            // Toast 3 seconds nanatr gayab honar
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    // Reset to Default
    const handleReset = () => {
        if (window.confirm('Sure default settings var reset karayche?')) {
            const defaults = resetSettings();
            setSettings(defaults);
            setHasChanges(true);
        }
    };

    // Loading state
    if (!settings) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}>⚙️</div>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div style={styles.container} className="fade-in">

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>⚙️ Settings</h1>
                    <p style={styles.subtitle}>
                        Configure your diagnostic system preferences
                    </p>
                </div>
                <div style={styles.headerActions}>
                    <button onClick={handleReset} style={styles.resetBtn}>
                        🔄 Reset to Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        style={{
                            ...styles.saveBtn,
                            opacity: hasChanges ? 1 : 0.5,
                            cursor: hasChanges ? 'pointer' : 'not-allowed',
                        }}
                    >
                        💾 Save Settings
                    </button>
                </div>
            </div>

            {/* Settings Grid */}
            <div style={styles.grid}>

                {/* Column 1 */}
                <div style={styles.column}>
                    <UserSettings
                        settings={settings}
                        onChange={handleSettingChange}
                    />

                    <DiagnosticSettings
                        settings={settings}
                        onChange={handleSettingChange}
                    />
                </div>

                {/* Column 2 */}
                <div style={styles.column}>
                    <WorkflowSettings
                        settings={settings}
                        onChange={handleSettingChange}
                    />

                    <UISettings
                        settings={settings}
                        onChange={handleSettingChange}
                    />

                    <ReportSettings
                        settings={settings}
                        onChange={handleSettingChange}
                    />
                </div>

            </div>

            {/* Toast Notification */}
            {showToast && (
                <div style={styles.toast} className="fade-in">
                    <span style={styles.toastIcon}>✅</span>
                    <span style={styles.toastText}>Settings saved successfully!</span>
                </div>
            )}

        </div>
    );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
    },

    // Header
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
    },
    title: {
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: 'var(--text-secondary)',
    },
    headerActions: {
        display: 'flex',
        gap: '12px',
    },
    resetBtn: {
        padding: '12px 24px',
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    saveBtn: {
        padding: '12px 32px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },

    // Grid Layout
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },

    // Loading State
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
    },
    spinner: {
        fontSize: '48px',
        animation: 'ndSpin 2s linear infinite',
        marginBottom: '16px',
    },

    // Toast Notification
    toast: {
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        padding: '16px 24px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1000,
    },
    toastIcon: {
        fontSize: '24px',
    },
    toastText: {
        fontSize: '15px',
        fontWeight: '600',
        color: 'white',
    },
};