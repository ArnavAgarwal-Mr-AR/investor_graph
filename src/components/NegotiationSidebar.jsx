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
                Strategic Capital
              </div>
              <div className="metric-row">
                <span className="text-muted">Total Deployed</span>
                <span className="mono text-gold">{investor.deployed || "Confidential"}</span>
              </div>
            </div>

            <div className="divider" />

            <div className="section">
              <div className="section-title">
                <Link2 size={14} className="text-green" />
                Sector Alignment
              </div>
              <div className="tag-cloud">
                {investor.tags?.map((tag, i) => (
                  <span key={i} className="sector-tag mono">{tag}</span>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div className="section">
              <div className="section-title">
                <BrainCircuit size={14} className="text-blue" />
                Network Intelligence
              </div>
              <div className="insight-card">
                {`Entity footprint confirmed via ${investor.firm} data nodes. Primarily active in ${investor.tags?.[0] || 'emerging'} sectors with a ${investor.type === 'elite' ? 'dominant' : 'strategic'} presence on the Deal Floor.`}
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
              justify-content: flex-end;
              align-items: center;
              padding: 24px 24px 0;
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
              position: relative;
              background: rgba(0, 0, 0, 0.2);
              padding: 16px 16px 16px 20px;
              border-radius: 8px;
              font-size: 14px;
              line-height: 1.5;
              color: var(--color-text-secondary);
              border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .insight-card::before {
              content: '';
              position: absolute;
              left: 0;
              top: 12px;
              bottom: 12px;
              width: 3px;
              background: var(--color-accent-blue);
              border-radius: 0 4px 4px 0;
              box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
            }
            .insight-card strong {
              color: var(--color-text-primary);
            }

            .tag-cloud {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .sector-tag {
              font-size: 10px;
              padding: 4px 10px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid var(--color-border-light);
              border-radius: 4px;
              color: var(--color-text-secondary);
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .text-gold {
              color: var(--color-accent-gold);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
