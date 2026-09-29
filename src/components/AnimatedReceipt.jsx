import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { receipts } from '../data/receiptsData';
import './AnimatedReceipt.css';

export const AnimatedReceipt = () => {
  const [index, setIndex] = useState(0);

  // Trigger paper blast (confetti)
  const triggerBlast = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.38 },
      colors: ['#262626', '#f59e0b', '#10b981', '#3b82f6', '#ec4899']
    });
  };

  useEffect(() => {
    // Rotates the receipt every 4.5 seconds
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % receipts.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const current = receipts[index];

  return (
    <div className="receipt-wrapper">
      {/* Blurred background image layer */}
      <div className="bg-blur-container" />

      <div className="printer-container">
        {/* Top Hardware Slot */}
        <div className="printer-slot">
          <div className="slot-light" />
          <div className="slot-bar" />
          <div className="slot-dot" />
        </div>

        {/* Masked Paper Output */}
        <div className="paper-mask">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '120%', opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              /* ⚡ Fires the blast ONLY after the bill has completely finished coming out */
              onAnimationComplete={triggerBlast}
            >
              <div className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-icon">{current.icon}</div>
                  <h2 className="ticket-title">{current.title}</h2>
                  <p className="ticket-subtitle">{current.subtitle}</p>
                </div>

                <div className="ticket-grid">
                  <div>
                    <span className="ticket-label">{current.idLabel}</span>
                    <span className="ticket-value">{current.idValue}</span>
                  </div>
                  <div className="align-right">
                    <span className="ticket-label">AMOUNT</span>
                    <span className="ticket-amount">{current.amount}</span>
                  </div>
                  <div>
                    <span className="ticket-label">DATE & TIME</span>
                    <span className="ticket-value">{current.dateTime}</span>
                  </div>
                  <div className="align-right">
                    <span className="ticket-label">STATUS</span>
                    <span className="ticket-status">{current.status}</span>
                  </div>
                </div>

                <div className="ticket-user">
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{current.user}</p>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '10px' }}>
                      •••• {current.cardLast4}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    {current.cardType}
                  </span>
                </div>

                <div className="ticket-footer">
                  {current.type === 'qr' ? (
                    <div>
                      <div className="qr-wrapper">
                        <QRCodeSVG 
                          value={current.qrUrl} 
                          size={70} 
                          level="M" 
                        />
                      </div>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 700, display: 'block', marginTop: '6px' }}>
                        SCAN TO VERIFY AUTHENTICITY
                      </span>
                    </div>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <div className="barcode-lines" />
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#6b7280' }}>
                        {current.code}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};