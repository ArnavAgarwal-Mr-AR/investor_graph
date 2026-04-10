import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'All',
  'SaaS',
  'Fintech',
  'Consumer',
  'Deeptech',
  'Healthtech',
  'Growth'
];

export default function FilterMenu({ activeFilter, onSelectFilter }) {
  return (
    <motion.div 
      className="filter-menu glass-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="filter-title text-muted">TARGET SECTOR</div>
      <div className="filter-options">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            className={`filter-cat-btn ${activeFilter === cat || (cat === 'All' && !activeFilter) ? 'active' : ''}`}
            onClick={() => onSelectFilter(cat === 'All' ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <style>{`
        .filter-menu {
          position: absolute;
          left: 80px;
          top: 50%;
          transform: translateY(-50%);
          padding: 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 150;
        }

        .filter-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-cat-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          text-align: left;
          padding: 8px 12px;
          border-radius: 6px;
          font-family: var(--font-family-base);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-cat-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-primary);
        }

        .filter-cat-btn.active {
          background: rgba(0, 255, 65, 0.1);
          color: var(--color-accent-green);
          border-left: 2px solid var(--color-accent-green);
        }
      `}</style>
    </motion.div>
  );
}
