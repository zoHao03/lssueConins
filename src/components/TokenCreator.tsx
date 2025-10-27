//导入 React 和相关钩子
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits } from "viem";
import { Alert } from "./Alert"; // 导入弹窗组件
import { TOKEN_FACTORY_ABI } from "./contractABI";

// 合约地址
const TOKEN_FACTORY_ADDRESS = "0x78BA3081A5b0d0C5bE90D7181eA458afa739F535";

export function TokenCreator() {
  //获取钱包地址
  const { address } = useAccount();
  //表单状态
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: "",
  });

  // 弹窗状态
  const [alert, setAlert] = useState({
    isVisible: false,
    type: "info" as "success" | "error" | "warning" | "info",
    message: "",
  });

  //writeContract钩子用于发送交易，获取交易哈希和状态，是否等待确认，错误信息等
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  //等待交易确认，获取区块链确认状态
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // 显示弹窗的函数
  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlert({ isVisible: true, type, message });
  };

  // 隐藏弹窗的函数
  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  };

  //处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    /**
     * e 是事件对象（Event），这里的类型是 React.FormEvent
     * React.FormEvent 是 React 框架专门为表单事件提供的类型定义
     * 它可以获取触发该事件的元素、输入内容、状态等信息
     */

    //   调用 e.preventDefault() 的作用：
    //   表单在浏览器中默认会触发一次“提交事件”，
    //   而默认行为通常是 **刷新页面** 或 **跳转到指定的 action URL**。
    //   我们不希望页面被刷新（尤其在 React 单页应用中），
    //   所以调用 preventDefault() 来阻止浏览器的默认提交行为。
    e.preventDefault();

    //检查地址是否存在
    if (!address) {
      showAlert("warning", "请先连接钱包");
      return;
    }

    // 输入验证
    if (!formData.name.trim()) {
      showAlert("warning", "请输入代币名称");
      return;
    }
    if (!formData.symbol.trim()) {
      showAlert("warning", "请输入代币符号");
      return;
    }
    // 验证代币总量为正数
    if (!formData.supply || parseFloat(formData.supply) <= 0) {
      showAlert("warning", "请输入有效的代币总量");
      return;
    }

    try {
      // 使用 18 位小数（标准 ERC20 小数位数）
      const actualSupply = parseUnits(formData.supply, 18);

      // 调用合约的 createToken 方法
      writeContract({
        address: TOKEN_FACTORY_ADDRESS, // 合约地址
        abi: TOKEN_FACTORY_ABI, // 合约 ABI
        functionName: "createToken", // 方法名
        args: [
          formData.name.trim(), // 代币名称
          formData.symbol.trim().toUpperCase(), // 代币符号
          actualSupply, // 代币总量
          address, // 自动传入当前用户地址作为 owner
        ],
      });
    } catch (err) {
      console.error("创建代币错误:", err); // 打印错误日志
      showAlert("error", "创建代币失败，请检查输入参数"); // 提示用户错误
    }
  };

  // 处理输入框变化的函数
  // 参数 field 表示当前输入框对应的字段名，比如 "name"、"symbol"、"supply"
  // 参数 value 表示当前输入框的最新值（字符串类型）
  const handleInputChange = (field: string, value: string) => {
    // 👉 特殊处理：如果当前输入的是 "supply" 字段（也就是代币总量）
    if (field === "supply") {
      // 使用正则表达式限制输入内容：
      // ^ 开头
      // \d* 表示任意数量的数字（0~9）
      // \.? 表示可以有 0 或 1 个小数点
      // \d* 表示小数点后也可以有任意数量的数字
      // $ 结尾
      // 整体意思：允许纯数字或带一个小数点的数字（例如 123、12.5、0.1）
      //
      // 另外，允许空字符串 ""（用户正在删除内容时也合法）
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        // 更新表单数据
        // setFormData 是一个状态更新函数（来自 useState）
        // prev 是上一次的表单状态（对象）
        // 使用展开语法 ...prev 保留之前的其他字段值
        // [field]: value 动态更新指定字段的值
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      // 如果不是 supply 字段（比如 name、symbol 等普通文本）
      // 就直接更新，不需要正则验证
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  //重置表单内容
  const resetForm = () => {
    setFormData({
      name: "",
      symbol: "",
      supply: "",
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      {/* 弹窗组件 */}
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        duration={3000}
      />
      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "1rem",
          }}
        >
          🪙 一键发币
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1rem",
            }}
          >
            {/* 代币名称 */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                代币名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="例如: My Token"
                required
                disabled={isPending}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  backgroundColor: isPending ? "#f9fafb" : "white",
                }}
              />
            </div>

            {/* 代币符号 */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                代币符号 *
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  handleInputChange("symbol", e.target.value.toUpperCase())
                }
                placeholder="例如: MTK"
                required
                disabled={isPending}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  backgroundColor: isPending ? "#f9fafb" : "white",
                  textTransform: "uppercase",
                }}
              />
            </div>

            {/* 代币总量 */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                代币总量 *
              </label>
              <input
                type="text"
                value={formData.supply}
                onChange={(e) => handleInputChange("supply", e.target.value)}
                placeholder="例如: 1000000"
                required
                disabled={isPending}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  backgroundColor: isPending ? "#f9fafb" : "white",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginTop: "0.25rem",
                }}
              >
                注意：代币将使用 18 位小数，{formData.supply || 0} 个代币 ={" "}
                {formData.supply || 0} × 10¹⁸ 个最小单位
              </p>
            </div>

            {/* 按钮组 */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="submit"
                disabled={isPending || !address}
                style={{
                  flex: 1,
                  backgroundColor: isPending ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  border: "none",
                  cursor: isPending || !address ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {isPending ? "发送交易中..." : "创建代币"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                }}
              >
                重置
              </button>
            </div>
          </div>
        </form>

        {/* 错误提示 */}
        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.375rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "#dc2626", margin: 0 }}>
              ❌ 错误: {error.message}
            </p>
          </div>
        )}

        {/* 交易状态显示 */}
        {hash && (
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: isConfirmed ? "#f0fdf4" : "#fffbeb",
                border: isConfirmed ? "1px solid #bbf7d0" : "1px solid #fcd34d",
                borderRadius: "0.375rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: isConfirmed ? "#065f46" : "#92400e",
                  margin: 0,
                  fontWeight: "500",
                }}
              >
                {isConfirmed ? "✅" : "⏳"}
                {isConfirmed ? " 代币创建成功！" : " 交易已发送，等待确认..."}
              </p>

              <p
                style={{
                  fontSize: "0.75rem",
                  color: isConfirmed ? "#047857" : "#b45309",
                  margin: "0.25rem 0 0 0",
                  fontFamily: "monospace",
                }}
              >
                交易哈希: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>

              {isConfirmed && (
                <button
                  onClick={resetForm}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  创建新代币
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
