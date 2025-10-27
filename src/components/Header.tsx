//导入所需的wagmi钩子和React的useEffect
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { useEffect } from "react";

//定义BSC测试网的链ID常量
const BSC_TESTNET_ID = 97;

export function Header() {
  //使用wagmi钩子获取账户和连接状态
  const { address, isConnected } = useAccount();
  //获取连接、断开连接和切换链的函数
  const { connect, connectors, isPending } = useConnect();
  // 调用 disconnect() 可断开当前钱包连接
  const { disconnect } = useDisconnect();
  //调用 switchChain() 可切换网络
  const { switchChain } = useSwitchChain();
  //获取当前链ID
  const chainId = useChainId();

  // 自动切换网络
  useEffect(() => {
    if (isConnected && chainId !== BSC_TESTNET_ID) {
      console.log("当前链接的id:", chainId);
      switchChain({ chainId: BSC_TESTNET_ID });
      console.log("已尝试切换到 BSC 测试网,链ID:", chainId);
    }
  }, [isConnected, chainId, switchChain]);

  //格式化地址显示函数
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  //处理连接钱包按钮点击事件
  const handleConnect = () => {
    connect({ connector: connectors[0] });//使用第一个连接器（通常是MetaMask）
  };

  return (
    <header
      style={{
        backgroundColor: "white",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* 左边：一键发币标题 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            🚀 一键发币
          </h1>
        </div>

        {/* 右边：钱包连接状态 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isConnected ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {/* 网络状态指示器 */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: chainId === 97 ? "#10b981" : "#f59e0b",
                }}
              ></div>

              {/* 地址显示 */}
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  backgroundColor: "#f3f4f6",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                }}
              >
                {formatAddress(address!)}
              </span>

              {/* 断开连接按钮 */}
              <button
                onClick={() => disconnect()}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
              >
                断开连接
              </button>
            </div>
          ) : (
            /* 连接钱包按钮 */
            <button
              onClick={handleConnect}
              disabled={isPending}
              style={{
                backgroundColor: isPending ? "#93c5fd" : "#3b82f6",
                color: "white",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                border: "none",
                cursor: isPending ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (!isPending)
                  e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseOut={(e) => {
                if (!isPending)
                  e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              {isPending ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span>连接中...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>连接钱包</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </header>
  );
}
