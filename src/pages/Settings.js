import React, { useState } from 'react';
import { useTheme, useAuth } from '../App';

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, color }) {
    var c = color || '#00f5c4';
    return (
        <div
            onClick={function () { onChange(!checked); }}
            style={{
                width: 48, height: 26, borderRadius: 13, cursor: 'pointer',
                position: 'relative', flexShrink: 0, transition: 'background 0.25s',
                background: checked ? c : 'rgba(255,255,255,0.12)',
                border: '1.5px solid ' + (checked ? c + '70' : 'rgba(255,255,255,0.18)'),
            }}
        >
            <div style={{
                position: 'absolute', top: 3,
                left: checked ? 24 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: checked ? '#070e1a' : 'rgba(255,255,255,0.55)',
                transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: checked ? ('0 0 8px ' + c + '90') : 'none',
            }} />
        </div>
    );
}

// ── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ icon, title, sub }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 18, paddingBottom: 14,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
                <h3 style={{
                    margin: 0, fontSize: 15, fontWeight: 800,
                    color: '#fff', fontFamily: "'Syne',sans-serif",
                }}>
                    {title}
                </h3>
                {sub && (
                    <p style={{
                        margin: 0, fontSize: 10, marginTop: 2,
                        color: 'rgba(255,255,255,0.38)',
                        fontFamily: "'Space Mono',monospace",
                    }}>
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Setting Row ───────────────────────────────────────────────────────────────
function SettingRow({ label, sub, children }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            gap: 16,
        }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: 13, color: '#fff',
                    fontFamily: "'Syne',sans-serif", fontWeight: 600,
                }}>
                    {label}
                </div>
                {sub && (
                    <div style={{
                        fontSize: 10, marginTop: 2,
                        color: 'rgba(255,255,255,0.35)',
                        fontFamily: "'Space Mono',monospace",
                    }}>
                        {sub}
                    </div>
                )}
            </div>
            <div style={{ flexShrink: 0 }}>{children}</div>
        </div>
    );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, accent }) {
    return (
        <div style={{
            background: accent ? 'rgba(0,245,196,0.04)' : 'rgba(12,20,36,0.88)',
            border: '1px solid ' + (accent ? 'rgba(0,245,196,0.14)' : 'rgba(255,255,255,0.07)'),
            borderRadius: 16, padding: 24,
        }}>
            {children}
        </div>
    );
}

// ── DEFAULT SETTINGS CONSTANTS ────────────────────────────────────────────────
const DEFAULT_NOTIFS = {
    alerts: true,
    email: false,
    packetLoss: true,
    downtime: true,
    weeklyReport: false
};

const DEFAULT_NETWORK = {
    autoRefresh: true,
    pingInterval: '30',
    speedTest: false,
    logRetention: '7',
    debugMode: false
};

const DEFAULT_SECURITY = {
    twoFactor: false,
    sessionLog: true,
    apiAccess: false
};

const DEFAULT_APPEARANCE = {
    compactView: false,
    animatedCharts: true,
    showTooltips: true
};

// ── Reusable button styles ────────────────────────────────────────────────────
var outlineBtn = {
    padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
    border: '1px solid rgba(0,245,196,0.3)',
    background: 'rgba(0,245,196,0.07)',
    color: '#00f5c4', fontFamily: "'Syne',sans-serif",
    fontSize: 12, fontWeight: 700,
    transition: 'all 0.2s',
};

var dangerBtn = {
    padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
    border: '1px solid rgba(245,75,0,0.3)',
    background: 'rgba(245,75,0,0.07)',
    color: '#f54b00', fontFamily: "'Syne',sans-serif",
    fontSize: 12, fontWeight: 700,
    transition: 'all 0.2s',
};

var selectSt = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 8, color: '#fff',
    padding: '7px 12px',
    fontFamily: "'Space Mono',monospace",
    fontSize: 11, cursor: 'pointer', outline: 'none',
};

// ─────────────────────────────────────────────────────────────────────────────
//  SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Settings() {
    // All hooks at the top
    var themeCtx = useTheme();
    var authCtx = useAuth();

    var theme = themeCtx ? themeCtx.theme : 'dark';
    var toggleTheme = themeCtx ? themeCtx.toggleTheme : function () { };
    var user = authCtx ? authCtx.user : { username: 'admin' };

    var s1 = useState(DEFAULT_NOTIFS);
    var s2 = useState(DEFAULT_NETWORK);
    var s3 = useState(DEFAULT_SECURITY);
    var s4 = useState(DEFAULT_APPEARANCE);
    var s5 = useState(false); // saved state
    var s6 = useState('appearance'); // active tab
    var s7 = useState(false); // reset confirmation

    var notifs = s1[0]; var setNotifs = s1[1];
    var network = s2[0]; var setNetwork = s2[1];
    var security = s3[0]; var setSecurity = s3[1];
    var appearance = s4[0]; var setAppearance = s4[1];
    var saved = s5[0]; var setSaved = s5[1];
    var activeTab = s6[0]; var setTab = s6[1];
    var showResetConfirm = s7[0]; var setShowResetConfirm = s7[1];

    // ✅ SAVE FUNCTION
    function handleSave() {
        // LocalStorage madhe save kara (optional)
        try {
            localStorage.setItem('netdiag_settings', JSON.stringify({
                notifs: notifs,
                network: network,
                security: security,
                appearance: appearance,
                theme: theme
            }));
        } catch (e) {
            console.error('Save error:', e);
        }

        setSaved(true);
        setTimeout(function () { setSaved(false); }, 2500);
    }

    // ✅ RESET TO DEFAULT FUNCTION
    function handleReset() {
        setShowResetConfirm(true);
    }

    function confirmReset() {
        // Reset all settings to default
        setNotifs(DEFAULT_NOTIFS);
        setNetwork(DEFAULT_NETWORK);
        setSecurity(DEFAULT_SECURITY);
        setAppearance(DEFAULT_APPEARANCE);

        // Reset theme to dark
        if (theme !== 'dark' && toggleTheme) {
            toggleTheme();
        }

        // Clear localStorage
        try {
            localStorage.removeItem('netdiag_settings');
        } catch (e) {
            console.error('Clear error:', e);
        }

        setShowResetConfirm(false);

        // Show success message
        setSaved(true);
        setTimeout(function () { setSaved(false); }, 2500);
    }

    function cancelReset() {
        setShowResetConfirm(false);
    }

    function setN(key, val) { setNotifs(function (p) { return Object.assign({}, p, { [key]: val }); }); }
    function setNw(key, val) { setNetwork(function (p) { return Object.assign({}, p, { [key]: val }); }); }
    function setSec(key, val) { setSecurity(function (p) { return Object.assign({}, p, { [key]: val }); }); }
    function setApp(key, val) { setAppearance(function (p) { return Object.assign({}, p, { [key]: val }); }); }

    var TABS = [
        { id: 'appearance', label: '🎨 Appearance' },
        { id: 'notifications', label: '🔔 Notifications' },
        { id: 'network', label: '📡 Network' },
        { id: 'security', label: '🔒 Security' },
        { id: 'about', label: 'ℹ️ About' },
    ];

    var username = user ? (user.username || 'admin') : 'admin';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }}>

            {/* Profile */}
            <Card>
                <SectionTitle icon="👤" title="User Profile" sub="Your account information" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                        background: 'linear-gradient(135deg,#00f5c4,#7b61ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, fontWeight: 800, color: '#070e1a', fontFamily: "'Syne',sans-serif",
                    }}>
                        {username[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif" }}>
                            {username}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", marginTop: 3 }}>
                            network.admin@netdiag.pro
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
                            padding: '3px 10px', background: 'rgba(0,245,196,0.1)',
                            border: '1px solid rgba(0,245,196,0.25)', borderRadius: 20,
                        }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00f5c4', boxShadow: '0 0 5px #00f5c4' }} />
                            <span style={{ fontSize: 9, color: '#00f5c4', fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: '0.8px' }}>
                                ADMIN
                            </span>
                        </div>
                    </div>
                    <button style={outlineBtn}>Edit Profile</button>
                </div>
            </Card>

            {/* Tab bar */}
            <div style={{
                display: 'flex', gap: 4, flexWrap: 'wrap', padding: 6,
                background: 'rgba(12,20,36,0.88)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
            }}>
                {TABS.map(function (tab) {
                    var active = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={function () { setTab(tab.id); }}
                            style={{
                                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', border: 'none',
                                background: active ? 'rgba(0,245,196,0.12)' : 'transparent',
                                color: active ? '#00f5c4' : 'rgba(255,255,255,0.45)',
                                fontFamily: "'Syne',sans-serif", fontSize: 12,
                                fontWeight: active ? 800 : 500,
                                borderBottom: active ? '2px solid #00f5c4' : '2px solid transparent',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Appearance */}
            {activeTab === 'appearance' && (
                <Card>
                    <SectionTitle icon="🎨" title="Appearance" sub="Theme & display preferences" />
                    <SettingRow label="Dark Mode" sub={'Currently: ' + (theme === 'dark' ? 'Dark' : 'Light') + ' Theme'}>
                        <Toggle checked={theme === 'dark'} onChange={toggleTheme} color="#00f5c4" />
                    </SettingRow>
                    <SettingRow label="Compact View" sub="Reduce card spacing for denser layout">
                        <Toggle
                            checked={appearance.compactView}
                            onChange={function (v) { setApp('compactView', v); }}
                            color="#7b61ff"
                        />
                    </SettingRow>
                    <SettingRow label="Animated Charts" sub="Enable smooth chart animations">
                        <Toggle
                            checked={appearance.animatedCharts}
                            onChange={function (v) { setApp('animatedCharts', v); }}
                            color="#00f5c4"
                        />
                    </SettingRow>
                    <SettingRow label="Show Tooltips" sub="Display help tooltips on hover">
                        <Toggle
                            checked={appearance.showTooltips}
                            onChange={function (v) { setApp('showTooltips', v); }}
                            color="#f5c400"
                        />
                    </SettingRow>
                    <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,245,196,0.05)', borderRadius: 10, border: '1px solid rgba(0,245,196,0.12)' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono',monospace", marginBottom: 10, letterSpacing: '0.8px' }}>
                            ACCENT COLORS
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['#00f5c4', '#7b61ff', '#f5c400', '#f54b00', '#00a8ff'].map(function (c) {
                                return (
                                    <div key={c} style={{
                                        width: 28, height: 28, borderRadius: 8,
                                        background: c, boxShadow: '0 0 10px ' + c + '60',
                                    }} />
                                );
                            })}
                        </div>
                    </div>
                </Card>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <Card>
                    <SectionTitle icon="🔔" title="Notifications" sub="Alert and notification preferences" />
                    <SettingRow label="In-App Alerts" sub="Show alerts inside the dashboard">
                        <Toggle checked={notifs.alerts} onChange={function (v) { setN('alerts', v); }} color="#00f5c4" />
                    </SettingRow>
                    <SettingRow label="Email Notifications" sub="Send diagnostic reports via email">
                        <Toggle checked={notifs.email} onChange={function (v) { setN('email', v); }} color="#7b61ff" />
                    </SettingRow>
                    <SettingRow label="Packet Loss Alerts" sub="Alert when packet loss exceeds 2%">
                        <Toggle checked={notifs.packetLoss} onChange={function (v) { setN('packetLoss', v); }} color="#f54b00" />
                    </SettingRow>
                    <SettingRow label="Node Downtime Alerts" sub="Alert when a node goes offline">
                        <Toggle checked={notifs.downtime} onChange={function (v) { setN('downtime', v); }} color="#f54b00" />
                    </SettingRow>
                    <SettingRow label="Weekly Summary Report" sub="PDF summary every Monday">
                        <Toggle checked={notifs.weeklyReport} onChange={function (v) { setN('weeklyReport', v); }} color="#00f5c4" />
                    </SettingRow>
                </Card>
            )}

            {/* Network */}
            {activeTab === 'network' && (
                <Card>
                    <SectionTitle icon="📡" title="Network Monitoring" sub="Diagnostic intervals & data settings" />
                    <SettingRow label="Auto-Refresh Dashboard" sub="Refresh stats automatically">
                        <Toggle checked={network.autoRefresh} onChange={function (v) { setNw('autoRefresh', v); }} color="#00f5c4" />
                    </SettingRow>
                    <SettingRow label="Ping Interval" sub="How often to ping nodes">
                        <select
                            value={network.pingInterval}
                            onChange={function (e) { setNw('pingInterval', e.target.value); }}
                            style={selectSt}
                        >
                            {['10', '30', '60', '120', '300'].map(function (v) {
                                return <option key={v} value={v} style={{ background: '#0d1b2e' }}>{v}s</option>;
                            })}
                        </select>
                    </SettingRow>
                    <SettingRow label="Scheduled Speed Tests" sub="Run automatic speed tests">
                        <Toggle checked={network.speedTest} onChange={function (v) { setNw('speedTest', v); }} color="#7b61ff" />
                    </SettingRow>
                    <SettingRow label="Log Retention" sub="How long to keep network logs">
                        <select
                            value={network.logRetention}
                            onChange={function (e) { setNw('logRetention', e.target.value); }}
                            style={selectSt}
                        >
                            {[['1', '1 Day'], ['7', '7 Days'], ['14', '14 Days'], ['30', '30 Days'], ['90', '90 Days']].map(function (item) {
                                return <option key={item[0]} value={item[0]} style={{ background: '#0d1b2e' }}>{item[1]}</option>;
                            })}
                        </select>
                    </SettingRow>
                    <SettingRow label="Debug Mode" sub="Log verbose output to console">
                        <Toggle checked={network.debugMode} onChange={function (v) { setNw('debugMode', v); }} color="#f5c400" />
                    </SettingRow>
                </Card>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <Card>
                    <SectionTitle icon="🔒" title="Security" sub="Authentication & access control" />
                    <SettingRow label="Two-Factor Authentication" sub="Require OTP code on each login">
                        <Toggle checked={security.twoFactor} onChange={function (v) { setSec('twoFactor', v); }} color="#00f5c4" />
                    </SettingRow>
                    <SettingRow label="Session Activity Log" sub="Track all login history">
                        <Toggle checked={security.sessionLog} onChange={function (v) { setSec('sessionLog', v); }} color="#7b61ff" />
                    </SettingRow>
                    <SettingRow label="API Access" sub="Allow external API integrations">
                        <Toggle checked={security.apiAccess} onChange={function (v) { setSec('apiAccess', v); }} color="#f5c400" />
                    </SettingRow>
                    <SettingRow label="Change Password" sub="Update your login credentials">
                        <button style={outlineBtn}>Change →</button>
                    </SettingRow>
                    <SettingRow label="Revoke All Sessions" sub="Force logout on all devices">
                        <button style={dangerBtn}>Revoke</button>
                    </SettingRow>
                </Card>
            )}

            {/* About */}
            {activeTab === 'about' && (
                <Card accent={true}>
                    <SectionTitle icon="ℹ️" title="About NetDiag Pro" sub="Application info & version" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
                        {[
                            ['Version', 'v2.1.0'], ['Build', '2025.01.15'],
                            ['React', '18.2.0'], ['Chart.js', '4.4.0'],
                            ['Router', 'v6.22.0'], ['License', 'MIT'],
                            ['Status', '✅ Up to date'], ['Support', 'netdiag.pro'],
                        ].map(function (item) {
                            return (
                                <div key={item[0]} style={{
                                    padding: '10px 14px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: 10,
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace", letterSpacing: '0.8px' }}>
                                        {item[0]}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#fff', fontFamily: "'Space Mono',monospace", marginTop: 4, fontWeight: 700 }}>
                                        {item[1]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

            {/* Save bar */}
            <div style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>
                <button
                    onClick={handleSave}
                    style={{
                        padding: '12px 28px', borderRadius: 10, cursor: 'pointer', border: 'none',
                        background: saved
                            ? 'linear-gradient(135deg,#00c49a,#009e7a)'
                            : 'linear-gradient(135deg,#00f5c4,#00c49a)',
                        color: '#070e1a', fontFamily: "'Syne',sans-serif",
                        fontSize: 14, fontWeight: 800, transition: 'all 0.3s',
                    }}
                >
                    {saved ? '✓ Settings Saved!' : '💾 Save Settings'}
                </button>

                {/* ✅ RESET BUTTON - WORKING */}
                <button
                    onClick={handleReset}
                    style={{
                        padding: '12px 22px', borderRadius: 10, cursor: 'pointer',
                        border: '1px solid rgba(245,75,0,0.3)',
                        background: 'rgba(245,75,0,0.08)',
                        color: '#f54b00',
                        fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600,
                        transition: 'all 0.2s',
                    }}
                >
                    🔄 Reset to Default
                </button>
            </div>

            {/* ✅ RESET CONFIRMATION MODAL */}
            {showResetConfirm && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'ndFadeIn 0.2s ease',
                }}>
                    <div style={{
                        background: 'rgba(12,20,36,0.98)',
                        border: '1px solid rgba(245,75,0,0.3)',
                        borderRadius: 16,
                        padding: 32,
                        maxWidth: 440,
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(245,75,0,0.4)',
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                            <h3 style={{
                                margin: 0, fontSize: 18, fontWeight: 800,
                                color: '#fff', fontFamily: "'Syne',sans-serif",
                                marginBottom: 8
                            }}>
                                Reset to Default Settings?
                            </h3>
                            <p style={{
                                margin: 0, fontSize: 12,
                                color: 'rgba(255,255,255,0.5)',
                                fontFamily: "'Space Mono',monospace",
                            }}>
                                Saglya settings default var reset honar. Hi action undo nahi karu shakat.
                            </p>
                        </div>

                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(245,75,0,0.1)',
                            border: '1px solid rgba(245,75,0,0.2)',
                            borderRadius: 10,
                            marginBottom: 24,
                        }}>
                            <div style={{ fontSize: 11, color: '#f54b00', fontFamily: "'Space Mono',monospace" }}>
                                ⚠ Following settings will be reset:
                            </div>
                            <ul style={{
                                margin: '8px 0 0', paddingLeft: 20,
                                fontSize: 11, color: 'rgba(255,255,255,0.6)',
                                fontFamily: "'Space Mono',monospace",
                            }}>
                                <li>Theme → Dark</li>
                                <li>All toggles → Default values</li>
                                <li>Intervals → Default timings</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={cancelReset}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'transparent',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: "'Syne',sans-serif",
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'linear-gradient(135deg,#f54b00,#d63a00)',
                                    color: '#fff',
                                    fontFamily: "'Syne',sans-serif",
                                    fontSize: 13,
                                    fontWeight: 800,
                                }}
                            >
                                Reset Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}