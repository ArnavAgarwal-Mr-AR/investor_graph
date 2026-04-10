import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Link2, BrainCircuit } from 'lucide-react';

export default function NegotiationSidebar({ investor, onClose }) {
  return (
    <AnimatePresence>
      {investor && (
        <motion.div
          className="negotiation-sidebar glass-panel"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="sidebar-header">
            <h2 className="sidebar-title">Entity Snapshot</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="sidebar-content">
            <div className="entity-hero">
              <img src={investor.image} alt={investor.name} className="hero-avatar" />
              <div>
                <div className="entity-name">{investor.name}</div>
                <div className="entity-firm text-muted">{investor.firm}</div>
              </div>
            </div>
            
            <div className="divider" />

            <div className="section">
              <div className="section-title">
                <Activity size={14} className="text-gold" />
                Influence Balance
              </div>
              <div className="balance-scale">
                <div 
                  className="balance-fill" 
                  style={{ width: `${(investor.weight / 15) * 100}%`, background: 'var(--color-accent-gold)' }} 
                />
              </div>
              <div className="metric-row">
                <span className="text-muted">Capital Weight</span>
                <span className="mono">{investor.weight}.0x</span>
              </div>
            </div>

            <div className="divider" />

            <div className="section">
              <div className="section-title">
                <Link2 size={14} className="text-green" />
                Active Deals & Tension
              </div>
              <ul className="deal-list">
                <li className="deal-item">
                  <div className="deal-meta">
                    <span className="deal-name">Project Quantum</span>
                    <span className="text-muted text-small">Co-lead</span>
                  </div>
                  <span className="mono text-green">High</span>
                </li>
                <li className="deal-item">
                  <div className="deal-meta">
                    <span className="deal-name">AeroSpace X1</span>
                    <span className="text-muted text-small">Syndicate</span>
                  </div>
                  <span className="mono text-muted">Passive</span>
                </li>
              </ul>
            </div>

            <div className="divider" />

            <div className="section">
              <div className="section-title">
                <BrainCircuit size={14} className="text-blue" />
                AI Insight
              </div>
              <div className="insight-card">
                "High probability co-investor with <strong>Meridian Capital</strong> based on shared deeptech thesis. Avoids early-stage consumer hardware."
              </div>
            </div>
          </div>

          <style>{`
            .negotiation-sidebar {
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 380px;
              background: rgba(10, 10, 13, 0.85);
              border-left: 1px solid var(--color-border-light);
              display: flex;
              flex-direction: column;
              z-index: 200;
              backdrop-filter: blur(24px);
            }

            .sidebar-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 24px;
              border-bottom: 1px solid var(--color-border-light);
            }

            .sidebar-title {
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: var(--color-text-secondary);
            }

            .close-btn {
              background: transparent;
              border: none;
              color: var(--color-text-secondary);
              cursor: pointer;
              transition: color 0.2s;
            }

            .close-btn:hover {
              color: var(--color-text-primary);
            }

            .sidebar-content {
              padding: 24px;
              display: flex;
              flex-direction: column;
              gap: 24px;
              overflow-y: auto;
            }

            .entity-hero {
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .hero-avatar {
              width: 64px;
              height: 64px;
              border-radius: 12px;
              border: 1px solid var(--color-border-light);
            }

            .entity-name {
              font-size: 24px;
              font-weight: 600;
              letter-spacing: -0.5px;
            }

            .divider {
              height: 1px;
              background: var(--color-border-light);
            }

            .section {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .section-title {
              font-size: 13px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .balance-scale {
              height: 4px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
              overflow: hidden;
            }

            .balance-fill {
              height: 100%;
              border-radius: 2px;
            }

            .metric-row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
            }

            .deal-list {
              list-style: none;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .deal-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: rgba(255, 255, 255, 0.03);
              padding: 10px 12px;
              border-radius: 8px;
            }

            .deal-meta {
              display: flex;
              flex-direction: column;
            }

            .deal-name {
              font-size: 14px;
              font-weight: 500;
            }

            .text-small {
              font-size: 12px;
            }

            .insight-card {
              background: rgba(74, 96, 120, 0.1);
              border-left: 2px solid var(--color-accent-blue);
              padding: 16px;
              border-radius: 0 8px 8px 0;
              font-size: 14px;
              line-height: 1.5;
              color: var(--color-text-secondary);
            }
            .insight-card strong {
              color: var(--color-text-primary);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
