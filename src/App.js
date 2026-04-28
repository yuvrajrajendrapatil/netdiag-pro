function App() {
  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", padding: "20px" }}>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        NetDiag Pro Dashboard 🚀
      </h1>

      {/* Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        <div style={{ background: "#222", padding: "20px", borderRadius: "10px", flex: 1 }}>
          <h2 style={{ color: "#aaa" }}>Download Speed</h2>
          <p style={{ fontSize: "24px" }}>50 Mbps</p>
        </div>

        <div style={{ background: "#222", padding: "20px", borderRadius: "10px", flex: 1 }}>
          <h2 style={{ color: "#aaa" }}>Upload Speed</h2>
          <p style={{ fontSize: "24px" }}>20 Mbps</p>
        </div>

        <div style={{ background: "#222", padding: "20px", borderRadius: "10px", flex: 1 }}>
          <h2 style={{ color: "#aaa" }}>Ping</h2>
          <p style={{ fontSize: "24px" }}>15 ms</p>
        </div>

      </div>

      {/* Graph Section */}
      <div style={{ background: "#222", padding: "20px", borderRadius: "10px" }}>
        <h2>Network Performance 📊</h2>

        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#777" }}>
          Graph coming soon...
        </div>
      </div>

    </div>
  );
}

export default App;