// Final Report Display
import React from 'react';

export default function ReportCard({ results }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PASS': return '#10b981';
            case 'FAIL': return '#ef4444';
            case 'WARNING': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div style={styles.container} className="fade-in">
            {/* Status Header */}
            <div style={{
                ...styles.header,
                background: `${getStatusColor(results.status)}20`,
                border: `2px solid ${getStatusColor(results.status)}`,
            }}>
                <div style={styles.statusIcon}>
                    {results.status === 'PASS' ? '✅' :
                        results.status === 'FAIL' ? '❌' : '⚠️'}
                </div>
                <h2 style={{ ...styles.statusText, color: getStatusColor(results.status) }}>
                    {results.status}
                </h2>
            </div>

            {/* Layer Results */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Test Results by Layer</h3>
                {results.layers.map((layer, i) => (
                    <div key={i} style={styles.layerResult}>
                        <div style={styles.layerName}>{layer.name}</div>
                        <div style={styles.layerRight}>
                            <span style={styles.layerTime}>{layer.time}</span>
                            <span style={{
                                ...styles.layerStatus,
                                color: getStatusColor(layer.status),
                            }}>
                                {layer.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Root Cause */}
            {results.rootCause && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Root Cause Identified</h3>
                    <div style={styles.rootCause}>
                        🔍 {results.rootCause}
                    </div>
                </div>
            )}

            {/* Recommendation */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Recommendation</h3>
                <div style={styles.recommendation}>
                    💡 {results.recommendation}
                </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
                <button style={styles.button}>
                    Download Report
                </button>
                <button style={{ ...styles.button, ...styles.buttonSecondary }}>
                    Share Results
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid var(--border-color)',
    },
    header: {
        padding: '32px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '32px',
    },
    statusIcon: {
        fontSize: '64px',
        marginBottom: '16px',
    },
    statusText: {
        fontSize: '36px',
        fontWeight: '800',
        margin: 0,
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px',
        color: 'var(--text-secondary)',
    },
    layerResult: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        marginBottom: '12px',
    },
    layerName: {
        fontSize: '15px',
        fontWeight: '600',
    },
    layerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    layerTime: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: 'JetBrains Mono',
    },
    layerStatus: {
        fontSize: '14px',
        fontWeight: '700',
    },
    rootCause: {
        padding: '16px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-red)',
        borderRadius: '8px',
        fontSize: '15px',
        color: 'var(--accent-red)',
    },
    recommendation: {
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid var(--accent-green)',
        borderRadius: '8px',
        fontSize: '15px',
        color: 'var(--accent-green)',
    },
    actions: {
        display: 'flex',
        gap: '16px',
        marginTop: '32px',
    },
    button: {
        flex: 1,
        padding: '14px',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    buttonSecondary: {
        background: 'transparent',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
    },
};