// Reports Page - View, Download & Email Reports
import React, { useState } from 'react';

// Dummy Report Data - Backend connect kelya var real data yenar
const SAMPLE_REPORTS = [
    {
        id: 'RPT-001',
        date: '2025-01-15 14:30:22',
        status: 'PASS',
        duration: '65s',
        layers: {
            network: 'PASS',
            roblox: 'PASS',
            testrail: 'PASS'
        },
        rootCause: null,
        recommendation: 'All systems operational',
        testedBy: 'admin'
    },
    {
        id: 'RPT-002',
        date: '2025-01-15 11:22:15',
        status: 'FAIL',
        duration: '42s',
        layers: {
            network: 'PASS',
            roblox: 'FAIL',
            testrail: 'WARNING'
        },
        rootCause: 'Roblox login page timeout after 30s',
        recommendation: 'Check Roblox server status or firewall settings',
        testedBy: 'admin'
    },
    {
        id: 'RPT-003',
        date: '2025-01-14 16:45:10',
        status: 'WARNING',
        duration: '58s',
        layers: {
            network: 'PASS',
            roblox: 'PASS',
            testrail: 'WARNING'
        },
        rootCause: 'TestRail API response time > 5s (slow)',
        recommendation: 'Monitor TestRail server performance',
        testedBy: 'admin'
    },
    {
        id: 'RPT-004',
        date: '2025-01-14 09:12:33',
        status: 'PASS',
        duration: '61s',
        layers: {
            network: 'PASS',
            roblox: 'PASS',
            testrail: 'PASS'
        },
        rootCause: null,
        recommendation: 'All systems operational',
        testedBy: 'admin'
    },
];

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({
        to: '',
        cc: '',
        subject: '',
        message: ''
    });
    const [emailSending, setEmailSending] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);

    // Status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'PASS': return '#10b981';
            case 'FAIL': return '#ef4444';
            case 'WARNING': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    // Download Report as JSON
    const handleDownload = (report) => {
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.id}_diagnostic_report.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Open Email Modal
    const handleEmailClick = (report) => {
        setSelectedReport(report);
        setEmailForm({
            to: 'it-team@company.com',
            cc: 'qa-team@company.com',
            subject: `Network Diagnostic Report - ${report.id} (${report.status})`,
            message: `Hi IT Team,

Please find the diagnostic report details below:

Report ID: ${report.id}
Test Date: ${report.date}
Overall Status: ${report.status}
Duration: ${report.duration}

Layer Results:
- Network Layer: ${report.layers.network}
- Roblox Workflow: ${report.layers.roblox}
- TestRail Workflow: ${report.layers.testrail}

${report.rootCause ? `Root Cause:\n${report.rootCause}\n\n` : ''}Recommendation:
${report.recommendation}

Regards,
QA Team`
        });
        setShowEmailModal(true);
        setEmailSuccess(false);
    };

    // Send Email (Simulated)
    const handleSendEmail = (e) => {
        e.preventDefault();
        setEmailSending(true);

        // Simulate API call
        setTimeout(() => {
            setEmailSending(false);
            setEmailSuccess(true);

            // Close modal after 2 seconds
            setTimeout(() => {
                setShowEmailModal(false);
                setEmailSuccess(false);
            }, 2000);
        }, 1500);
    };

    return (
        <div style={styles.container} className="fade-in">

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📊 Diagnostic Reports</h1>
                    <p style={styles.subtitle}>
                        View, download, and share historical test results
                    </p>
                </div>
                <div style={styles.stats}>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{SAMPLE_REPORTS.length}</div>
                        <div style={styles.statLabel}>Total Reports</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statValue, color: '#10b981' }}>
                            {SAMPLE_REPORTS.filter(r => r.status === 'PASS').length}
                        </div>
                        <div style={styles.statLabel}>Passed</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={{ ...styles.statValue, color: '#ef4444' }}>
                            {SAMPLE_REPORTS.filter(r => r.status === 'FAIL').length}
                        </div>
                        <div style={styles.statLabel}>Failed</div>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Report ID</th>
                            <th style={styles.th}>Date & Time</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Duration</th>
                            <th style={styles.th}>Network</th>
                            <th style={styles.th}>Roblox</th>
                            <th style={styles.th}>TestRail</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SAMPLE_REPORTS.map((report, index) => (
                            <tr key={report.id} style={{
                                ...styles.tableRow,
                                animationDelay: `${index * 0.1}s`
                            }}>
                                <td style={styles.td}>
                                    <code style={styles.reportId}>{report.id}</code>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.dateText}>{report.date}</div>
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: `${getStatusColor(report.status)}20`,
                                        color: getStatusColor(report.status),
                                        border: `1px solid ${getStatusColor(report.status)}`,
                                    }}>
                                        {report.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <code style={styles.duration}>{report.duration}</code>
                                </td>
                                <td style={styles.td}>
                                    <LayerBadge status={report.layers.network} />
                                </td>
                                <td style={styles.td}>
                                    <LayerBadge status={report.layers.roblox} />
                                </td>
                                <td style={styles.td}>
                                    <LayerBadge status={report.layers.testrail} />
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.actions}>
                                        {/* View Button */}
                                        <button
                                            style={styles.actionBtn}
                                            onClick={() => setSelectedReport(
                                                selectedReport?.id === report.id ? null : report
                                            )}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>

                                        {/* Download Button */}
                                        <button
                                            style={{ ...styles.actionBtn, ...styles.downloadBtn }}
                                            onClick={() => handleDownload(report)}
                                            title="Download Report"
                                        >
                                            ⬇️
                                        </button>

                                        {/* Email Button */}
                                        <button
                                            style={{ ...styles.actionBtn, ...styles.emailBtn }}
                                            onClick={() => handleEmailClick(report)}
                                            title="Email to IT Team"
                                        >
                                            📧
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Expanded Report Details */}
            {selectedReport && (
                <div style={styles.detailsCard} className="fade-in">
                    <div style={styles.detailsHeader}>
                        <h3 style={styles.detailsTitle}>
                            📄 Report Details - {selectedReport.id}
                        </h3>
                        <button
                            onClick={() => setSelectedReport(null)}
                            style={styles.closeBtn}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                            <div style={styles.detailLabel}>Test Date</div>
                            <div style={styles.detailValue}>{selectedReport.date}</div>
                        </div>

                        <div style={styles.detailItem}>
                            <div style={styles.detailLabel}>Duration</div>
                            <div style={styles.detailValue}>{selectedReport.duration}</div>
                        </div>

                        <div style={styles.detailItem}>
                            <div style={styles.detailLabel}>Tested By</div>
                            <div style={styles.detailValue}>{selectedReport.testedBy}</div>
                        </div>

                        <div style={styles.detailItem}>
                            <div style={styles.detailLabel}>Overall Status</div>
                            <div style={{
                                ...styles.detailValue,
                                color: getStatusColor(selectedReport.status)
                            }}>
                                {selectedReport.status}
                            </div>
                        </div>
                    </div>

                    {selectedReport.rootCause && (
                        <div style={styles.rootCauseBox}>
                            <div style={styles.boxTitle}>🔍 Root Cause</div>
                            <div style={styles.boxContent}>{selectedReport.rootCause}</div>
                        </div>
                    )}

                    <div style={styles.recommendationBox}>
                        <div style={styles.boxTitle}>💡 Recommendation</div>
                        <div style={styles.boxContent}>{selectedReport.recommendation}</div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div style={styles.modalOverlay} onClick={() => setShowEmailModal(false)}>
                    <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                📧 Email Report to IT Team
                            </h3>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                style={styles.modalClose}
                            >
                                ✕
                            </button>
                        </div>

                        {emailSuccess ? (
                            <div style={styles.successMessage} className="fade-in">
                                <div style={styles.successIcon}>✅</div>
                                <h3>Email Sent Successfully!</h3>
                                <p>Report has been sent to IT Team</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendEmail} style={styles.emailForm}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>To:</label>
                                    <input
                                        type="email"
                                        value={emailForm.to}
                                        onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CC:</label>
                                    <input
                                        type="email"
                                        value={emailForm.cc}
                                        onChange={(e) => setEmailForm({ ...emailForm, cc: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Subject:</label>
                                    <input
                                        type="text"
                                        value={emailForm.subject}
                                        onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Message:</label>
                                    <textarea
                                        value={emailForm.message}
                                        onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                        style={styles.textarea}
                                        rows="10"
                                        required
                                    />
                                </div>

                                <div style={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmailModal(false)}
                                        style={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={emailSending}
                                        style={{
                                            ...styles.sendBtn,
                                            opacity: emailSending ? 0.6 : 1,
                                            cursor: emailSending ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {emailSending ? '📤 Sending...' : '📧 Send Email'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

// Helper Component - Layer Status Badge
function LayerBadge({ status }) {
    const getColor = () => {
        switch (status) {
            case 'PASS': return '#10b981';
            case 'FAIL': return '#ef4444';
            case 'WARNING': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            background: `${getColor()}20`,
            color: getColor(),
            border: `1px solid ${getColor()}`,
            display: 'inline-block',
        }}>
            {status}
        </span>
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
        marginBottom: '32px',
    },
    title: {
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: 'var(--text-secondary)',
        marginBottom: '24px',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginTop: '24px',
    },
    statCard: {
        background: 'var(--bg-card)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: '800',
        color: 'var(--accent-blue)',
        marginBottom: '8px',
    },
    statLabel: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
    },

    // Table
    tableCard: {
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    th: {
        padding: '16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '700',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    tableRow: {
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.2s',
        cursor: 'pointer',
        animation: 'fadeIn 0.5s ease',
    },
    td: {
        padding: '16px',
        fontSize: '14px',
    },
    reportId: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        color: 'var(--accent-blue)',
        fontWeight: '600',
    },
    dateText: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        color: 'var(--text-secondary)',
    },
    statusBadge: {
        padding: '6px 14px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '700',
        display: 'inline-block',
    },
    duration: {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        color: 'var(--text-primary)',
    },

    // Actions
    actions: {
        display: 'flex',
        gap: '8px',
    },
    actionBtn: {
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    downloadBtn: {
        borderColor: 'var(--accent-blue)',
        background: 'rgba(59, 130, 246, 0.1)',
    },
    emailBtn: {
        borderColor: 'var(--accent-green)',
        background: 'rgba(16, 185, 129, 0.1)',
    },

    // Details Card
    detailsCard: {
        marginTop: '24px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '32px',
    },
    detailsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-color)',
    },
    detailsTitle: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
    },
    closeBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'var(--text-secondary)',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px',
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    detailLabel: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    rootCauseBox: {
        padding: '16px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--accent-red)',
        borderRadius: '12px',
        marginBottom: '16px',
    },
    recommendationBox: {
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid var(--accent-green)',
        borderRadius: '12px',
    },
    boxTitle: {
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '8px',
    },
    boxContent: {
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
    },

    // Email Modal
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
    },
    modalCard: {
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        padding: '24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
    },
    modalClose: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        background: 'var(--bg-secondary)',
        cursor: 'pointer',
        fontSize: '16px',
        color: 'var(--text-secondary)',
    },
    emailForm: {
        padding: '24px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--text-secondary)',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    textarea: {
        width: '100%',
        padding: '12px 16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'JetBrains Mono, monospace',
        resize: 'vertical',
        lineHeight: '1.6',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
    },
    cancelBtn: {
        flex: 1,
        padding: '12px',
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    sendBtn: {
        flex: 1,
        padding: '12px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },

    // Success Message
    successMessage: {
        padding: '60px',
        textAlign: 'center',
    },
    successIcon: {
        fontSize: '64px',
        marginBottom: '20px',
    },
};