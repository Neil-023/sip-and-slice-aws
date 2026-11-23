import React from 'react';
import OrderHistoryItem from './OrderHistoryItem';
import './OrderHistoryCard.css';

export default function OrderHistoryCard({
  id,
  shopname,
  date,
  status,
  isManager,
  items,
  onStatusChange,
  onRefund,
  isRefunding,
}) {
  const total = items.reduce(
    (acc, item) => acc + Number(item.price_each) * item.quantity,
    0
  );

  return (
    <div className="order-history-card">
      <div className="order-header">
        <div className="order-header-1strow">
          <div className="order-id">{shopname}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isManager ? (
              <select
                className={`order-status-select ${status}`}
                value={status}
                onChange={(e) => onStatusChange(id, e.target.value)}
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
              </select>
            ) : (
              <span className={`order-status-badge ${status}`}>{status}</span>
            )}

            {isManager && status === 'paid' && onRefund && (
              <button
                type="button"
                onClick={() => onRefund(id)}
                disabled={isRefunding}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#fff',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isRefunding ? 'not-allowed' : 'pointer',
                  opacity: isRefunding ? 0.6 : 1,
                }}
              >
                {isRefunding ? 'Refunding...' : 'Refund'}
              </button>
            )}
          </div>
        </div>

        <div className="order-header-date">
          Ordered at {new Date(date).toLocaleString()}
        </div>
      </div>

      <div className="order-items">
        {items.map((item, index) => (
          <OrderHistoryItem key={index} {...item} />
        ))}
      </div>

      <div className="order-total">Total: ₱{total.toLocaleString()}</div>
    </div>
  );
}