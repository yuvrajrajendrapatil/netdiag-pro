import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler
);

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconDownload = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v13M7 12l5 5 5-5" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21h18" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const IconUpload = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 21V8M7 12l5-5 5 5" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3h18" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const IconPing = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#f5c400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconRefresh = ({ spinning }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        style={{ animation: spinning ? "ndSpin 1s linear infinite" : "none" }}>
        <path d="M23 4v6h-6" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 20v-6h6" stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
            stroke="#00f5c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColor = (s) => s === "good" ? "#00f5c4" : s === "moderate" ? "#f5c400" : "#f54b00";
const statusBg = (s) => s === "good" ? "rgba(0,245,196,0.05)" : s === "moderate" ? "rgba(245,196,0,0.05)" : "rgba(245,75,0,0.05)";
const statusLabel = (s) => s === "good" ? "OPTIMAL" : s === "moderate" ? "MODERATE" : "POOR";
const overallStatus = (dl, ping) => dl > 70 && ping < 40 ? "good" : dl > 40 && ping < 100 ? "moderate" : "poor";

function cardStatus(type, val) {
    if (type === "download") return val > 70 ? "good" : val > 40 ? "moderate" : "poor";
    if (type === "upload") return val > 20 ? "good" : val > 10 ? "moderate" : "poor";
    return val < 30 ? "good" : val < 80 ? "moderate" : "poor";
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1300, loading) {
    const [val, setVal] = useState(0);
    const raf = useRef(null);
    useEffect(() => {
        if (loading) { setVal(0); return; }
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(parseFloat((target * ease).toFixed(1)));
            if (p < 1) raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf.current);
    }, [target, duration, loading]);
    return val;
}

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ w = "100%", h = "14px", r = "6px", mb = "0" }) => (
    <div style={{
        width: w, height: h, borderRadius: r, marginBottom: mb,
        background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)",
        backgroundSize: "400px 100%", animation: "ndShimmer 1.4s ease infinite"
    }} />
);

// ─── Data generators ──────────────────────────────────────────────────────────
const rand = (min, max, dec = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));

function genChart() {
    const labels = [], download = [], upload = [];
    for (let h = 0; h < 24; h++) {
        labels.push(String(h).padStart(2, "0") + ":00");
        const base = rand(55, 100);
        download.push(rand(base - 10, base + 10));
        upload.push(rand(base * 0.3, base * 0.5));
    }
    return { labels, download, upload };
}

function genPing() {
    return {
        labels: Array.from({ length: 12 }, (_, i) => i * 5 + "m"),
        values: Array.from({ length: 12 }, () => rand(8, 95, 0)),
    };
}

const EVENTS = [
    { type: "good", message: "Connection stable — latency within threshold", time: "14:32:01" },
    { type: "warn", message: "Packet loss detected: 2.1% on eth0", time: "14:18:45" },
    { type: "good", message: "Speed test completed — 94.2 Mbps down", time: "14:00:00" },
    { type: "bad", message: "DNS resolution timeout — retrying…", time: "13:47:12" },
    { type: "good", message: "Reconnected successfully via fallback", time: "13:47:19" },
];

const NODES = [
    { name: "Gateway Router", ip: "192.168.1.1", ping: 2, online: true },
    { name: "Primary DNS", ip: "8.8.8.8", ping: 14, online: true },
    { name: "CDN Edge Node", ip: "104.21.45.82", ping: 28, online: true },
    { name: "Backup Server", ip: "10.0.0.50", ping: 87, online: false },
];

// ════════════════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ─── Top Bar (Refresh + Status) ──────────────────────────────────────────────
function TopBar({ onRefresh, loading, lastUpdated, status }) {
    const [hov, setHov] = useState(false);
    const sc = statusColor(status);

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {/* Status */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 18px", borderRadius: 10, border: `1px solid ${sc}`,
                background: statusBg(status), flex: 1, minWidth: 280, gap: 8, transition: "all 0.5s"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: sc, boxShadow: `0 0 10px ${sc}`, animation: "ndPulse 2s ease infinite"
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: sc }}>
                        {status === "good" ? "All Systems Optimal" : status === "moderate" ? "Degraded Performance" : "Critical Issues"}
                    </span>
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace" }}>
                    {lastUpdated ? lastUpdated.toLocaleTimeString("en-US", { hour12: false }) : "—"}
                </span>
            </div>

            {/* Refresh button */}
            <button
                disabled={loading}
                onClick={onRefresh}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 8, cursor: "pointer",
                    border: "1px solid rgba(0,245,196,0.3)", background: "rgba(0,245,196,0.06)", color: "#00f5c4",
                    fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                    ...(hov && !loading ? { background: "rgba(0,245,196,0.14)", borderColor: "#00f5c4" } : {}),
                    ...(loading ? { opacity: 0.55, cursor: "not-allowed" } : {})
                }}
            >
                <IconRefresh spinning={loading} />
                {loading ? "Refreshing…" : "Refresh"}
            </button>
        </div>
    );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, icon, status, trend, loading }) {
    const [hov, setHov] = useState(false);
    const animated = useCountUp(value || 0, 1300, loading);
    const sc = statusColor(status);

    if (loading) return (
        <div style={{ ...card.wrap, flex: 1, minWidth: 220 }}>
            <Skeleton w="40px" h="40px" r="10px" mb="16px" />
            <Skeleton w="70%" h="48px" r="8px" mb="10px" />
            <Skeleton w="45%" h="12px" r="6px" />
        </div>
    );

    return (
        <div
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                ...card.wrap, flex: 1, minWidth: 220,
                borderColor: hov ? sc + "44" : "rgba(255,255,255,0.06)",
                boxShadow: hov ? `0 0 32px ${sc}18,0 8px 32px rgba(0,0,0,0.4)` : "0 4px 24px rgba(0,0,0,0.3)",
                transform: hov ? "translateY(-3px)" : "translateY(0)"
            }}>
            {/* Top */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${sc}12`, border: `1px solid ${sc}30`
                }}>{icon}</div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20,
                    background: `${sc}12`, border: `1px solid ${sc}30`
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc, boxShadow: `0 0 6px ${sc}` }} />
                    <span style={{ fontSize: 9, fontFamily: "'Space Mono',monospace", fontWeight: 700, letterSpacing: "0.8px", color: sc }}>
                        {statusLabel(status)}
                    </span>
                </div>
            </div>
            {/* Value */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", lineHeight: 1, letterSpacing: "-2px" }}>
                    {animated}
                </span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Mono',monospace", marginBottom: 8 }}>{unit}</span>
            </div>
            {/* Label */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.5px" }}>{label}</span>
                {trend !== undefined && (
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: trend >= 0 ? "#00f5c4" : "#f54b00" }}>
                        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            {/* Bottom glow line */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg,${sc},transparent)`, opacity: hov ? 1 : 0.45, transition: "opacity 0.3s"
            }} />
        </div>
    );
}

const card = {
    wrap: {
        background: "rgba(12,18,30,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
        padding: 24, position: "relative", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "default"
    },
};

// ─── NetworkChart ─────────────────────────────────────────────────────────────
function NetworkChart({ data, loading }) {
    const [activePoint, setActivePoint] = useState(null);

    if (loading) return (
        <div style={card.wrap}>
            <Skeleton w="220px" h="18px" r="6px" mb="8px" />
            <Skeleton w="160px" h="11px" r="6px" mb="24px" />
            <Skeleton w="100%" h="300px" r="10px" />
        </div>
    );

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "Download",
                data: data.download,
                borderColor: "#00f5c4",
                backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 320);
                    g.addColorStop(0, "rgba(0,245,196,0.22)");
                    g.addColorStop(1, "rgba(0,245,196,0)");
                    return g;
                },
                tension: 0.45, fill: true,
                pointBackgroundColor: "#00f5c4", pointBorderColor: "#060b14",
                pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 8,
                pointHoverBackgroundColor: "#00f5c4", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 2,
                borderWidth: 2.5,
            },
            {
                label: "Upload",
                data: data.upload,
                borderColor: "#7b61ff",
                backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 320);
                    g.addColorStop(0, "rgba(123,97,255,0.18)");
                    g.addColorStop(1, "rgba(123,97,255,0)");
                    return g;
                },
                tension: 0.45, fill: true,
                pointBackgroundColor: "#7b61ff", pointBorderColor: "#060b14",
                pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 8,
                pointHoverBackgroundColor: "#7b61ff", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 2,
                borderWidth: 2.5,
            },
        ],
    };

    const opts = {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        onClick: (_, els) => {
            if (!els.length) return;
            const i = els[0].index;
            setActivePoint({ time: data.labels[i], dl: data.download[i], ul: data.upload[i] });
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(8,15,28,0.96)", borderColor: "rgba(0,245,196,0.25)", borderWidth: 1,
                titleColor: "rgba(255,255,255,0.9)", bodyColor: "rgba(255,255,255,0.6)",
                titleFont: { family: "'Syne',sans-serif", size: 13, weight: "700" },
                bodyFont: { family: "'Space Mono',monospace", size: 11 },
                padding: 14, cornerRadius: 10, boxWidth: 8, boxHeight: 8, boxPadding: 4,
                callbacks: { title: (i) => `⏱  ${i[0].label}`, label: (i) => ` ${i.dataset.label}: ${i.parsed.y} Mbps` },
            },
        },
        scales: {
            x: {
                grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false },
                ticks: { color: "rgba(255,255,255,0.35)", font: { family: "'Space Mono',monospace", size: 10 }, maxTicksLimit: 12 }
            },
            y: {
                grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false },
                ticks: { color: "rgba(255,255,255,0.35)", font: { family: "'Space Mono',monospace", size: 10 } },
                title: { display: true, text: "Mbps", color: "rgba(255,255,255,0.25)", font: { family: "'Space Mono',monospace", size: 9 } }
            },
        },
        animation: { duration: 800, easing: "easeInOutQuart" },
    };

    return (
        <div style={card.wrap}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Network Performance</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace" }}>Hourly throughput — last 24 hours</p>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                    {[["#00f5c4", "Download"], ["#7b61ff", "Upload"]].map(([c, l]) => (
                        <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}80` }} />
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace" }}>{l}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Active point info */}
            {activePoint && (
                <div style={{
                    display: "flex", alignItems: "center", gap: 16, background: "rgba(0,245,196,0.06)",
                    border: "1px solid rgba(0,245,196,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, flexWrap: "wrap"
                }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Mono',monospace" }}>🕐 {activePoint.time}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: "#00f5c4" }}>↓ {activePoint.dl} Mbps</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono',monospace", color: "#7b61ff" }}>↑ {activePoint.ul} Mbps</span>
                    <button onClick={() => setActivePoint(null)}
                        style={{ marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 12, padding: "2px 6px" }}>✕</button>
                </div>
            )}
            {/* Chart */}
            <div style={{ height: 300 }}><Line data={chartData} options={opts} /></div>
        </div>
    );
}

// ─── PingChart ────────────────────────────────────────────────────────────────
function PingChart({ data, loading }) {
    if (loading) return (
        <div style={card.wrap}>
            <Skeleton w="160px" h="16px" r="6px" mb="8px" />
            <Skeleton w="100%" h="150px" r="8px" mt="16px" />
        </div>
    );

    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.values,
            backgroundColor: data.values.map(v => v < 30 ? "rgba(0,245,196,0.75)" : v < 80 ? "rgba(245,196,0,0.75)" : "rgba(245,75,0,0.75)"),
            borderRadius: 4, borderSkipped: false,
        }],
    };

    const opts = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(8,15,28,0.96)", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1,
                titleColor: "#fff", bodyColor: "rgba(255,255,255,0.6)",
                titleFont: { family: "'Syne',sans-serif", size: 12 },
                bodyFont: { family: "'Space Mono',monospace", size: 11 },
                callbacks: { label: (i) => ` ${i.parsed.y} ms` },
            },
        },
        scales: {
            x: {
                grid: { display: false }, border: { display: false },
                ticks: { color: "rgba(255,255,255,0.3)", font: { family: "'Space Mono',monospace", size: 9 } }
            },
            y: {
                grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false },
                ticks: { color: "rgba(255,255,255,0.3)", font: { family: "'Space Mono',monospace", size: 9 }, callback: v => v + "ms" }
            },
        },
        animation: { duration: 600 },
    };

    return (
        <div style={card.wrap}>
            <h3 style={wt.title}>Ping Latency</h3>
            <p style={wt.sub}>Last 12 samples</p>
            <div style={{ height: 150, marginTop: 12 }}><Bar data={chartData} options={opts} /></div>
        </div>
    );
}

// ─── Event Log ────────────────────────────────────────────────────────────────
function EventLog() {
    return (
        <div style={card.wrap}>
            <h3 style={wt.title}>Event Log</h3>
            <p style={wt.sub}>Recent network events</p>
            <div style={{ marginTop: 12 }}>
                {EVENTS.map((e, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0",
                        borderBottom: i < EVENTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                    }}>
                        <div style={{
                            width: 7, height: 7, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                            background: e.type === "good" ? "#00f5c4" : e.type === "warn" ? "#f5c400" : "#f54b00"
                        }} />
                        <div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", fontFamily: "'Syne',sans-serif" }}>{e.message}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{e.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Node Map ─────────────────────────────────────────────────────────────────
function NodeMap() {
    return (
        <div style={card.wrap}>
            <h3 style={wt.title}>Network Nodes</h3>
            <p style={wt.sub}>Active infrastructure</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {NODES.map((n, i) => (
                    <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                                background: n.online ? "#00f5c4" : "#f54b00",
                                boxShadow: n.online ? "0 0 6px #00f5c4" : "none"
                            }} />
                            <div>
                                <div style={{ fontSize: 12, color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{n.name}</div>
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace" }}>{n.ip}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{
                                fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono',monospace",
                                color: n.ping < 30 ? "#00f5c4" : n.ping < 80 ? "#f5c400" : "#f54b00"
                            }}>{n.ping}ms</div>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Mono',monospace", letterSpacing: "0.5px" }}>
                                {n.online ? "ONLINE" : "OFFLINE"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const wt = {
    title: { margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif" },
    sub: { margin: "4px 0 0", fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono',monospace" },
};

// ════════════════════════════════════════════════════════════════════════════
//  HOME PAGE (NetDiag Dashboard)
// ════════════════════════════════════════════════════════════════════════════
export default function Home() {
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [metrics, setMetrics] = useState({ dl: 0, ul: 0, ping: 0 });
    const [trends, setTrends] = useState({ dl: 0, ul: 0, ping: 0 });
    const [chartData, setChartData] = useState(null);
    const [pingData, setPingData] = useState(null);

    const loadData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            const dl = rand(55, 105);
            const ul = rand(15, 40);
            const ping = rand(8, 70);
            setMetrics({ dl, ul, ping });
            setTrends({ dl: rand(-12, 18), ul: rand(-8, 14), ping: rand(-12, 2) });
            setChartData(genChart());
            setPingData(genPing());
            setLastUpdated(new Date());
            setLoading(false);
        }, 1400);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const status = overallStatus(metrics.dl, metrics.ping);

    const CARDS = [
        { label: "Download Speed", value: metrics.dl, unit: "Mbps", icon: <IconDownload />, status: cardStatus("download", metrics.dl), trend: trends.dl },
        { label: "Upload Speed", value: metrics.ul, unit: "Mbps", icon: <IconUpload />, status: cardStatus("upload", metrics.ul), trend: trends.ul },
        { label: "Ping Latency", value: metrics.ping, unit: "ms", icon: <IconPing />, status: cardStatus("ping", metrics.ping), trend: trends.ping },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Top bar with refresh */}
            <TopBar onRefresh={loadData} loading={loading} lastUpdated={lastUpdated} status={status} />

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {CARDS.map(c => <StatCard key={c.label} {...c} loading={loading} />)}
            </div>

            {/* Main line chart */}
            <NetworkChart data={chartData} loading={loading} />

            {/* Bottom row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
                <PingChart data={pingData} loading={loading} />
                <EventLog />
                <NodeMap />
            </div>
        </div>
    );
}