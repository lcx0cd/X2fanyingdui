import React, { useState } from 'react';
import './PaymentWindow.css';

function PaymentWindow() {
  const [balance, setBalance] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleRecharge = () => {
    setShowQRCode(true);
  };

  // 模拟余额检查
  const checkBalance = () => {
    return balance > 0;
  };

  return (
    <div className="payment-window">
      <h2>账户信息</h2>
      <div className="balance-info">
        <p>当前余额: ¥{balance.toFixed(2)}</p>
        <button onClick={handleRecharge} className="recharge-button">
          充值
        </button>
      </div>

      {showQRCode && (
        <div className="qr-code-container">
          <h3>微信扫码支付</h3>
          <div className="qr-code-placeholder">
            {/* 这里后续需要集成实际的微信支付二维码 */}
            <svg width="200" height="200" viewBox="0 0 200 200">
              <rect width="200" height="200" fill="#f0f0f0" />
              <text x="100" y="100" textAnchor="middle" fill="#666">
                微信支付二维码
              </text>
            </svg>
          </div>
          <button onClick={() => setShowQRCode(false)} className="close-button">
            关闭
          </button>
        </div>
      )}

      <div className="service-status">
        {checkBalance() ? (
          <p className="status-active">✓ AI服务可用</p>
        ) : (
          <p className="status-inactive">✗ 余额不足，请充值</p>
        )}
      </div>
    </div>
  );
}

export default PaymentWindow;