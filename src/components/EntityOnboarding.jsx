import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Check } from 'lucide-react';

export default function EntityOnboarding({ onAdd, onClose }) {
  const [phase, setPhase] = useState('input'); // input, parsing, complete
  const [url, setUrl] = useState('');
  const [log, setLog] = useState([]);
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    if (phase === 'parsing') {
      const logs = [
        "Establishing SEC EDGAR connection...",
        "Parsing identity fragments...",
        "Calculating historical deployment weight...",
        "Identifying syndicate clusters...",
        "Fetching professional asset metadata...",
        "Mapping LinkedIn profile imagery...",
        "Identity assembled."
      ];
      
      let i = 0;
      const interval = setInterval(() => {
        setLog(prev => [...prev, logs[i]]);
        i++;
        if (i === logs.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('complete'), 800);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const simulateExtraction = (url) => {
    // Basic extraction of name from URL: linkedin.com/in/john-doe/ -> John Doe
    const parts = url.split('/in/')[1]?.split('/')[0]?.split('-') || ['New', 'Investor'];
    const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    
    const possibleFirms = ["Private Syndicate", "Investment Group", "Venture Partner", "Family Office", "Angel Network"];
    const possibleTags = ["SaaS", "Fintech", "AI/ML", "Consumer", "D2C", "Deeptech"];
    
    return {
      id: `i_${Date.now()}`,
      name: name,
      firm: possibleFirms[Math.floor(Math.random() * possibleFirms.length)],
      image: `https://i.pravatar.cc/150?u=${name}`,
      deployed: "Confidential",
      tags: [possibleTags[Math.floor(Math.random() * possibleTags.length)], "Strategic"],
      weight: 6,
      type: "flow",
      education: "Verified Graduate", 
      pastExperience: "Industry Professional"
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      setPhase('parsing');
      setExtractedData(simulateExtraction(url));
    }
  };

  return (
    <motion.div 
      className="onboarding-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="backdrop-blur" onClick={onClose} />
      
      <motion.div 
        className="onboarding-modal glass-panel"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {phase === 'input' && (
          <div className="phase-input">
            <h2 className="title">Onboard Entity</h2>
            <p className="subtitle text-muted">Paste LinkedIn or Crunchbase URL to construct identity.</p>
            
            <form onSubmit={handleSubmit} className="input-form">
              <input 
                type="text" 
                placeholder="https://linkedin.com/in/..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={!url} className="submit-btn primary">
                Extract
              </button>
            </form>
          </div>
        )}

        {phase === 'parsing' && (
          <div className="phase-parsing">
            <Fingerprint size={48} className="text-green pulse-anim" />
            <div className="log-container mono">
              <AnimatePresence>
                {log.map((line, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="log-line"
                  >
                    &gt; {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="metric-counting mono text-muted">
              Volumetric Scan: <span className="text-green">{Math.floor(Math.random() * 900) + 100}</span>
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="phase-complete">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Check size={48} className="text-gold" />
            </motion.div>
            <h2 className="title">Entity Constructed</h2>
            <div className="extracted-preview mono text-muted" style={{ fontSize: '12px', marginBottom: '16px' }}>
              Identified: <span className="text-green">{extractedData?.name}</span> @ {extractedData?.firm}
            </div>
            <button className="submit-btn primary" onClick={() => onAdd(extractedData)} style={{ marginTop: '8px' }}>
              Drop onto Deal Floor
            </button>
          </div>
        )}
      </motion.div>

      <style>{`
        .onboarding-overlay {
          position: absolute;
          inset: 0;
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .backdrop-blur {
          position: absolute;
          inset: 0;
          background: rgba(6, 6, 8, 0.7);
          backdrop-filter: blur(8px);
        }

        .onboarding-modal {
          position: relative;
          width: 480px;
          padding: 40px;
          border-radius: 20px;
          background: rgba(18, 18, 22, 0.95);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          z-index: 301;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          margin-bottom: 24px;
        }

        .input-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-form input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border-light);
          padding: 16px;
          border-radius: 12px;
          color: white;
          font-family: var(--font-family-base);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-form input:focus {
          border-color: var(--color-accent-green);
        }

        .submit-btn {
          padding: 16px;
          border-radius: 12px;
          border: none;
          font-family: var(--font-family-base);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn.primary {
          background: var(--color-accent-green);
          color: black;
        }
        
        .submit-btn.primary:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text-muted);
          cursor: not-allowed;
        }

        .phase-parsing, .phase-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .pulse-anim {
          animation: pulse 1.5s infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 10px var(--color-accent-green)); }
          100% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 20px var(--color-accent-green)); }
        }

        .log-container {
          width: 100%;
          text-align: left;
          background: rgba(0, 0, 0, 0.5);
          padding: 16px;
          border-radius: 8px;
          min-height: 220px;
          font-size: 13px;
          color: var(--color-text-secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .log-line {
          color: var(--color-accent-green);
        }
      `}</style>
    </motion.div>
  );
}
