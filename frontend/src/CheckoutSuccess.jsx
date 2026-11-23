import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useCart } from './CartContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();
  const { loadCart } = useCart();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    if (!orderId) {
      navigate('/OrderHistory');
      return;
    }

    let attempts = 0;
    const pollStatus = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}/status`);
        const current = res.data.status;
        if (current === 'paid' || current === 'refunded_out_of_stock') {
          setStatus(current);
          await loadCart();
          return;
        }
      } catch (err) {
        console.error('Status poll failed', err);
      }

      attempts += 1;
      if (attempts < 6) {
        setTimeout(pollStatus, 1500);
      } else {
        setStatus('pending');
      }
    };

    void pollStatus();
  }, [orderId, loadCart, navigate]);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '520px', margin: '6rem auto', textAlign: 'center', padding: '2rem' }}>
        {status === 'checking' && (
          <>
            <h2>Confirming your payment...</h2>
            <p>Waiting for Stripe webhook verification for Order #{orderId}.</p>
          </>
        )}
        {status === 'paid' && (
          <>
            <h2>Payment Confirmed!</h2>
            <p>Order #{orderId} has been paid and verified via Stripe Webhook.</p>
            <button onClick={() => navigate('/OrderHistory')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
              View Order History
            </button>
          </>
        )}
        {status === 'refunded_out_of_stock' && (
          <>
            <h2>Item Sold Out — Automatically Refunded</h2>
            <p>An item in Order #{orderId} sold out during checkout. A full refund was automatically issued via Stripe.</p>
            <button onClick={() => navigate('/MainPage')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
              Back to Menu
            </button>
          </>
        )}
        {status === 'pending' && (
          <>
            <h2>Payment Processing</h2>
            <p>Your payment for Order #{orderId} is still being confirmed. Check Order History shortly.</p>
            <button onClick={() => navigate('/OrderHistory')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
              Go to Order History
            </button>
          </>
        )}
      </div>
    </div>
  );
}