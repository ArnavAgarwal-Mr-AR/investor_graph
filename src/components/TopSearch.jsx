import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

export default function TopSearch({ investors, onSummon }) {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      // Find top match if available to auto-summon best result
      const bestMatch = matches[0] ? matches[0].name : query;
      onSummon(bestMatch);
      setQuery('');
      setActive(false);
    }
  };

  const matches = query ? investors.filter(n => 
    n.name.toLowerCase().includes(query.toLowerCase()) || 
    n.firm.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <div className="top-search-container">
      <motion.div 
        className="search-bar glass-panel"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <Search size={16} className="text-muted" />
        <input 
          type="text" 
          placeholder="Summon entity..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setTimeout(() => setActive(false), 200)}
          onKeyDown={handleKeyDown}
        />
        <div className="shortcut mono text-muted">⌘ K</div>
      </motion.div>

      <AnimatePresence>
        {active && query && (
          <motion.div 
            className="search-results glass-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {matches.length > 0 ? (
              <div className="matches-list">
                <div className="result-header text-muted">AVAILABLE ENTITIES</div>
                {matches.map(m => (
                  <div 
                    key={m.id} 
                    className="result-item clickable"
                    onClick={() => {
                      onSummon(m.name);
                      setQuery('');
                      setActive(false);
                    }}
                  >
                    <strong>{m.name}</strong> <span className="text-muted">– {m.firm}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="result-item text-muted">
                No entities found matching <strong>"{query}"</strong>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .top-search-container {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 150;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 24px;
          width: 320px;
          background: rgba(18, 18, 22, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          width: 380px;
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 30px rgba(0, 255, 65, 0.1);
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          flex: 1;
          font-family: var(--font-family-base);
          font-size: 14px;
          outline: none;
        }

        .search-bar input::placeholder {
          color: var(--color-text-muted);
        }

        .shortcut {
          font-size: 11px;
          border: 1px solid var(--color-border-light);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .search-results {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          background: rgba(18, 18, 22, 0.95);
        }

        .result-item {
          font-size: 14px;
          color: var(--color-text-secondary);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .result-item.clickable {
          cursor: pointer;
          transition: background 0.2s;
        }

        .result-item.clickable:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-primary);
        }

        .result-header {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 4px 12px 8px;
        }

        .result-item strong {
          color: var(--color-accent-green);
        }
      `}</style>
    </div>
  );
}
