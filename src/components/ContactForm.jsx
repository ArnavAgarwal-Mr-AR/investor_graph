import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function ContactForm({ onClose }) {
  const [phase, setPhase] = useState('input'); // input, sending, success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Bug Report', // default
    details: ''
  });
  const [errorObj, setErrorObj] = useState(null);

  const subjects = ["Bug Report", "Data Correction", "Feature Request", "General Inquiry"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorObj(null);

    // Basic regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorObj("Strict validation failed: Invalid email format detected.");
      return;
    }

    setPhase('sending');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "A secure transmission failure occurred.");
      }

      setPhase('success');
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setErrorObj(err.message);
      setPhase('input');
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
        className="contact-modal glass-panel"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <button className="close-btn-absolute" onClick={onClose}>
          <X size={20} />
        </button>

        {phase === 'input' && (
          <div className="phase-input">
            <h2 className="title">Contact Support</h2>
            <p className="subtitle text-muted">
              Securely transmit issues, corrections, or requests to the platform administrators.
            </p>
            
            <form onSubmit={handleSubmit} className="input-form">
              <div className="input-group">
                <label>Entity Designation (Name) <span className="req">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Secure Routing (Email) <span className="req">*</span></label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
                <span className="disclaimer mono">
                  <AlertTriangle size={12} className="inline-icon text-gold" style={{marginRight: '4px', verticalAlign: 'middle'}} />
                  WARNING: Responses cannot be transmitted to invalid or inaccessible domains.
                </span>
              </div>

              <div className="input-group">
                <label>Transmission Subject <span className="req">*</span></label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label>Cryptographic Payload (Details) <span className="req">*</span></label>
                <textarea 
                  rows={4} 
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  required 
                />
              </div>

              {errorObj && (
                <div className="error-box mono text-green">
                  [SYSTEM FAULT]: {errorObj}
                </div>
              )}

              <button type="submit" className="submit-btn primary">
                Initialize Dispatch
              </button>
            </form>
          </div>
        )}

        {phase === 'sending' && (
          <div className="phase-sending">
            <Send size={48} className="text-blue pulse-anim" />
            <div className="log-container mono">
              <span className="log-line text-blue">&gt; Compiling cryptologic payload...</span>
              <span className="log-line text-blue">&gt; Establishing secure SMTP gateway...</span>
              <span className="log-line text-blue">&gt; Dispatching to administrators...</span>
            </div>
          </div>
        )}

        {phase === 'success' && (
          <div className="phase-complete">
            <CheckCircle size={64} className="text-green" />
            <h2 className="title" style={{marginTop: '16px'}}>Transmission Confirmed</h2>
            <div className="extracted-preview mono text-muted" style={{ fontSize: '13px' }}>
              Your communication has been successfully routed to the platform core.
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          z-index: 500;
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

        .contact-modal {
          position: relative;
          width: 540px;
          padding: 40px;
          border-radius: 20px;
          background: rgba(18, 18, 22, 0.95);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          z-index: 501;
        }
        
        .close-btn-absolute {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn-absolute:hover {
          color: white;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .input-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .req { color: var(--color-accent-gold); }

        .input-group input, 
        .input-group select, 
        .input-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border-light);
          padding: 14px;
          border-radius: 12px;
          color: white;
          font-family: var(--font-family-base);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
        }

        .input-group input:focus, 
        .input-group select:focus, 
        .input-group textarea:focus {
          border-color: var(--color-accent-blue);
        }

        .input-group select option {
          background: #111115;
          color: white;
        }

        .disclaimer {
          font-size: 11px;
          color: var(--color-text-muted);
          margin-top: 4px;
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
          margin-top: 8px;
        }

        .submit-btn.primary {
          background: var(--color-accent-blue);
          color: white;
        }
        
        .submit-btn.primary:hover {
          background: #3B82F6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        .error-box {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          color: var(--color-accent-gold);
        }

        .phase-sending, .phase-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          padding: 40px 0;
        }

        .pulse-anim {
          animation: pulseBlue 1.5s infinite alternate;
        }

        @keyframes pulseBlue {
          0% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 10px var(--color-accent-blue)); }
          100% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 20px var(--color-accent-blue)); }
        }

        .log-container {
          width: 100%;
          text-align: left;
          background: rgba(0, 0, 0, 0.5);
          padding: 16px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </motion.div>
  );
}
