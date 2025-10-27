//导入 React 和 useEffect 钩子
import { useEffect } from "react";

// 定义 Alert 组件的属性类型
interface AlertProps {
  type: "success" | "error" | "warning" | "info"; // 提示类型，有四种可选值
  message: string; // 提示信息，类型为字符串
  isVisible: boolean; // 是否可见，类型为布尔值
  onClose: () => void; // 关闭提示的回调函数
  duration?: number; // 可选属性，提示显示的持续时间，单位为毫秒，默认值为 3000 毫秒
}

export function Alert({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}: AlertProps) {
  useEffect(() => {
    // 如果提示可见且持续时间大于 0，则设置定时器在持续时间后调用 onClose 函数关闭提示
    if (isVisible && duration > 0) {
      //设置定时器
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer); // 清除定时器以防止内存泄漏
    }
  }, [isVisible, duration, onClose]); // 依赖项数组，确保在这些值变化时重新运行 useEffect

  // 如果提示不可见，则不渲染任何内容
  if (!isVisible) return null;

  // 使用内联样式替代 Tailwind
  const alertStyles = {
    success: {
      backgroundColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      color: "#065f46",
    },
    error: {
      backgroundColor: "#fef2f2",
      borderColor: "#fecaca",
      color: "#dc2626",
    },
    warning: {
      backgroundColor: "#fffbeb",
      borderColor: "#fcd34d",
      color: "#92400e",
    },
    info: {
      backgroundColor: "#eff6ff",
      borderColor: "#93c5fd",
      color: "#1e40af",
    },
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 50,
        maxWidth: "24rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "1rem",
          border: "1px solid",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          ...alertStyles[type],
        }}
      >
        <span style={{ fontSize: "1.125rem", marginRight: "0.5rem" }}>
          {icons[type]}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 500, margin: 0 }}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: "1rem",
            color: "#9ca3af",
            background: "none",
            border: "none",
            fontSize: "1.125rem",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#6b7280")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
