export function Footer() {
  // 获取当前日期，格式为 YYYY-MM-DD
  const currentDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <footer
      style={{
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* 左边：日期 */}
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {currentDate}
        </div>

        {/* 右边：网络信息 */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          ></div>
          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            BSC Testnet
          </span>
        </div>
      </div>
    </footer>
  );
}
