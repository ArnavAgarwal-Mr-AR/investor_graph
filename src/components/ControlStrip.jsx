import React from 'react';
import { Plus, Filter, LayoutGrid, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ControlStrip({ onAdd, onFilterToggle, onReset }) {
  return (
    <motion.div 
      className="control-strip glass-panel"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring' }}
    >
      <button className="strip-btn primary" onClick={onAdd} title="Onboard Entity">
        <Plus size={20} />
      </button>

      <div className="strip-divider" />

      <button className="strip-btn" title="Filter Tiles" onClick={onFilterToggle}>
        <Filter size={18} />
      </button>
      <button className="strip-btn" title="Reset Surface" onClick={onReset}>
        <RotateCcw size={18} />
      </button>

      <style>{`
        .control-strip {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          z-index: 100;
        }

        .strip-divider {
          height: 1px;
          background: var(--color-border-light);
          margin: 4px 0;
        }

        .strip-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .strip-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-primary);
        }

        .strip-btn.primary {
          background: rgba(0, 255, 65, 0.1);
          color: var(--color-accent-green);
          border: 1px solid rgba(0, 255, 65, 0.2);
        }

        .strip-btn.primary:hover {
          background: rgba(0, 255, 65, 0.2);
          box-shadow: 0 0 12px rgba(0, 255, 65, 0.2);
        }
      `}</style>
    </motion.div>
  );
}
