// Live Diagnostic Simulation - Real-time progress display
import React, { useState, useEffect } from 'react';

const LAYERS = [
    {
        id: 1,
        name: 'Network Layer',
        duration: 15000, // 15 seconds
        steps: [
            'Testing internet speed...',
            'Checking ping latency...',
            'Verifying DNS resolution...',
            'Testing packet loss...',
        ],
    },
    {
        id: 2,
        name: 'Roblox Workflow Layer',
        duration: 30000, // 30 seconds
        steps: [
            'Opening Roblox website...',
            'Testing login functionality...',
            'Verifying homepage load...',
            'Checking play button...',
        ],
    },
    {
        id: 3,
        name: 'TestRail Workflow Layer',
        duration: 20000, // 20 seconds
        steps: [
            'Connecting to TestRail API...',
            'Authenticating user...',
            'Fetching test cases...',
            'Updating test results...',
        ],
    },
];

export default function DiagnosticRunner({ onComplete }) {
    const [currentLayer, setCurrentLayer] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (currentLayer >= LAYERS.length) {
            // Test complete - generate results
            setTimeout(() => {
                onComplete({
                    status: 'PASS',
                    layers: LAYERS.map((layer, i) => ({
                        name: layer.name,
                        status: 'PASS',
                        time: `${layer.duration / 1000}s`,
                    })),
                    rootCause: null,
                    recommendation: 'All systems operational',
                });
            }, 1000);
            return;
        }

        const layer = LAYERS[currentLayer];
        const stepDuration = layer.duration / layer.steps.length;

        const stepTimer = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < layer.steps.length - 1) {
                    setProgress(prev => prev + (100 / (LAYERS.length * layer.steps.length)));
                    return prev + 1;
                } else {
                    // Move to next layer
                    setCompleted(prev => [...prev, currentLayer]);
                    setCurrentLayer(prev => prev + 1);
                    setCurrentStep(0);
                    return 0;
                }
            });
        }, stepDuration);

        return () => clearInterval(stepTimer);
    }, [currentLayer, onComplete]);

    return (
        <div style={styles.container} className="fade-in">
            <div style={styles.header}>
                <h2 style={styles.title}>🔬 Running Diagnostic...</h2>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <p style={styles.progressText}>{Math.round(progress)}% Complete</p>
            </div>

            <div style={styles.layers}>
                {LAYERS.map((layer, index) => {
                    let status = 'pending';
                    if (completed.includes(index)) status = 'completed';
                    else if (index === currentLayer) status = 'running';

                    return (
                        <div key={layer.id} style={styles.layerCard}>
                            <div style={styles.layerHeader}>
                                <div style={styles.layerInfo}>
                                    <div style={{
                                        ...styles.layerIcon,
                                        background: status === 'completed' ? '#10b981' :
                                            status === 'running' ? '#3b82f6' : '#6b7280'
                                    }}>
                                        {status === 'completed' ? '✅' :
                                            status === 'running' ? '🔄' : '⏳'}
                                    </div>
                                    <div>
                                        <h3 style={styles.layerName}>{layer.name}</h3>
                                        <p style={styles.layerStatus}>
                                            {status === 'completed' ? 'Completed' :
                                                status === 'running' ? 'In Progress...' : 'Waiting...'}
                                        </p>
                                    </div>
                                </div>
                                <div style={styles.layerTime}>
                                    {layer.duration / 1000}s
                                </div>
                            </div>

                            {status === 'running' && (
                                <div style={styles.steps}>
                                    {layer.steps.map((step, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                ...styles.step,
                                                opacity: i <= currentStep ? 1 : 0.3,
                                            }}
                                            className={i === currentStep ? 'pulse' : ''}
                                        >
                                            <span style={styles.stepIcon}>
                                                {i < currentStep ? '✓' : i === currentStep ? '⟳' : '○'}
                                            </span>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        width: '100%',
        border: '1px solid var(--border-color)',
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px',
        marginBottom: '24px',
        fontWeight: '700',
    },
    progressBar: {
        width: '100%',
        height: '12px',
        background: 'var(--bg-secondary)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '12px',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
        transition: 'width 0.3s ease',
        borderRadius: '6px',
    },
    progressText: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
    },
    layers: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    layerCard: {
        background: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
    },
    layerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    layerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    layerIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
    },
    layerName: {
        fontSize: '18px',
        fontWeight: '700',
        margin: 0,
    },
    layerStatus: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        margin: 0,
    },
    layerTime: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        fontFamily: 'JetBrains Mono',
    },
    steps: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
    },
    step: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        transition: 'opacity 0.3s',
    },
    stepIcon: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'var(--accent-blue)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        flexShrink: 0,
    },
};