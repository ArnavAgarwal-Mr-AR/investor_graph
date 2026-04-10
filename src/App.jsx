import React, { useState, useEffect } from 'react';
import DealFloor from './components/DealFloor';
import ControlStrip from './components/ControlStrip';
import NegotiationSidebar from './components/NegotiationSidebar';
import TopSearch from './components/TopSearch';
import EntityOnboarding from './components/EntityOnboarding';
import ErrorBoundary from './components/ErrorBoundary';
import FilterMenu from './components/FilterMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchGraphData, createInvestor } from './neo4j';
import { AlertTriangle } from 'lucide-react';

function App() {
  const [data, setData] = useState({ nodes: [], links: [], loading: true, error: null });
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [summonedEntity, setSummonedEntity] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

  async function loadData() {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const neoData = await fetchGraphData();
      if (neoData && neoData.nodes.length > 0) {
        setData({ ...neoData, loading: false, error: null });
      } else {
        setData({ nodes: [], links: [], loading: false, error: "DATABASE_EMPTY" });
      }
    } catch (error) {
      console.error("Failed to fetch from Neo4j:", error);
      setData({ nodes: [], links: [], loading: false, error: "CONNECTION_FAILED" });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAddInvestor = async (investor) => {
    const success = await createInvestor(investor);
    if (success) {
      setIsOnboarding(false);
      await loadData(); // Refresh floor
    } else {
      alert("Failed to synchronize with Neo4j Cloud.");
    }
  };

  const handleSummon = (query) => {
    setSummonedEntity(query);
    setTimeout(() => setSummonedEntity(null), 100);
  };

  // We mount the deal floor and the other UI overlay segments.
  if (data.loading) {
    return (
      <div className="app-loading">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="loading-content"
        >
          <div className="spinner" />
          <div className="loading-text mono">SYNCHRONIZING NEXUS CORE...</div>
        </motion.div>
        <style>{`
          .app-loading {
            width: 100vw;
            height: 100vh;
            background: #060608;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-accent-green);
          }
          .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 255, 65, 0.1);
            border-top: 2px solid var(--color-accent-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            font-size: 12px;
            letter-spacing: 2px;
          }
        `}</style>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="app-error">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="error-content glass-panel"
        >
          <AlertTriangle size={48} className="text-gold" />
          <h2 className="error-title mono">SYNC ERROR</h2>
          <p className="error-desc text-muted">
            {data.error === "CONNECTION_FAILED" 
              ? "Unable to establish communication with Neo4j Aura Cloud. Verify VITE_NEO4J credentials in .env.local."
              : "The Negotiation Floor is currently empty. Direct Seed operation required."
            }
          </p>
          <button className="retry-btn mono" onClick={loadData}>RETRY HANDSHAKE</button>
        </motion.div>
        <style>{`
          .app-error {
            width: 100vw;
            height: 100vh;
            background: #060608;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .error-content {
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            text-align: center;
            max-width: 440px;
          }
          .error-title {
            color: var(--color-accent-gold);
            letter-spacing: 4px;
          }
          .retry-btn {
            margin-top: 10px;
            padding: 12px 24px;
            background: transparent;
            border: 1px solid var(--color-accent-gold);
            color: var(--color-accent-gold);
            cursor: pointer;
            transition: all 0.2s;
          }
          .retry-btn:hover {
            background: var(--color-accent-gold);
            color: black;
          }
        `}</style>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
      <DealFloor 
        nodes={data.nodes}
        links={data.links}
        onSelectInvestor={(investor) => setSelectedInvestor(investor)} 
        selectedInvestor={selectedInvestor}
        resetCounter={resetCounter}
        summonedEntity={summonedEntity}
        activeFilter={activeFilter}
      />

      {/* Floating Overlays */}
      <ControlStrip 
        onAdd={() => setIsOnboarding(true)} 
        onFilterToggle={() => setShowFilter(!showFilter)}
        onReset={() => setResetCounter(c => c + 1)}
      />
      <AnimatePresence>
        {showFilter && <FilterMenu activeFilter={activeFilter} onSelectFilter={setActiveFilter} onClose={() => setShowFilter(false)} />}
      </AnimatePresence>

      <TopSearch investors={data.nodes} onSummon={handleSummon} />
      
      {/* Right side slide-in panel */}
      <NegotiationSidebar 
        investor={selectedInvestor} 
        onClose={() => setSelectedInvestor(null)} 
      />

      {/* Fullscreen blocking overlay for LinkedIn add flow */}
      {isOnboarding && (
        <EntityOnboarding onAdd={handleAddInvestor} onClose={() => setIsOnboarding(false)} />
      )}

      {/* Generic styling to make overlay items absolutely positioned */}
      <style>{`
        .app-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}

export default App;
