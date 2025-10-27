import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TokenCreator } from "./components/TokenCreator";
import { useAccount, useBalance, useChainId } from "wagmi";

function App() {
  //获取账户地址、连接状态、余额和链ID
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1rem",
          width: "100%",
        }}
      >
        <div>
          {isConnected ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* 网络状态提示 */}
              {chainId !== 97 && (
                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fcd34d",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0 }}>
                      <span style={{ color: "#f59e0b" }}>⚠️</span>
                    </div>
                    <div style={{ marginLeft: "0.75rem" }}>
                      <h3
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#92400e",
                        }}
                      >
                        网络不匹配
                      </h3>
                      <div style={{ marginTop: "0.25rem" }}>
                        <p style={{ fontSize: "0.875rem", color: "#92400e" }}>
                          请切换到 BSC 测试网以使用完整功能
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 账户信息卡片 */}
              <div
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "1.5rem" }}>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "1rem",
                    }}
                  >
                    📊 账户信息
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#6b7280",
                        }}
                      >
                        地址
                      </p>
                      <p
                        style={{
                          marginTop: "0.25rem",
                          fontSize: "0.875rem",
                          color: "#111827",
                          fontFamily: "monospace",
                        }}
                      >
                        {address}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#6b7280",
                        }}
                      >
                        余额
                      </p>
                      <p
                        style={{
                          marginTop: "0.25rem",
                          fontSize: "0.875rem",
                          color: "#111827",
                        }}
                      >
                        {balance
                          ? `${parseFloat(balance.formatted).toFixed(4)} ${
                              balance.symbol
                            }`
                          : "加载中..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 一键发币组件 */}
              <TokenCreator />

              {/* 准备就绪提示 */}
              {chainId === 97 && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#166534",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🎉 准备就绪！
                  </h3>
                  <p style={{ color: "#166534" }}>
                    你的 DApp 已成功连接到 BSC 测试网，可以开始创建代币了！
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* 未连接时的页面*/
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "#6b7280",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                欢迎使用一键发币 DApp
              </h2>
              <p>请先连接钱包开始使用</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
