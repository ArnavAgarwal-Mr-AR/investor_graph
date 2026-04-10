import React, { useState } from 'react';
import DealFloor from './components/DealFloor';
import ControlStrip from './components/ControlStrip';
import NegotiationSidebar from './components/NegotiationSidebar';
import TopSearch from './components/TopSearch';
import EntityOnboarding from './components/EntityOnboarding';
import ErrorBoundary from './components/ErrorBoundary';
import FilterMenu from './components/FilterMenu';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isClustered, setIsClustered] = useState(true);
  const [resetCounter, setResetCounter] = useState(0);
  const [summonedEntity, setSummonedEntity] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

  const handleSummon = (query) => {
    setSummonedEntity(query);
    setTimeout(() => setSummonedEntity(null), 100);
  };

  // We mount the deal floor and the other UI overlay segments.
  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* 
          The Deal Floor is the main fullscreen canvas-like area (using DOM).
        It manages the D3 force simulation and renders CapitalTiles.
      */}
      <DealFloor 
        onSelectInvestor={(investor) => setSelectedInvestor(investor)} 
        selectedInvestor={selectedInvestor}
        isClustered={isClustered}
        resetCounter={resetCounter}
        summonedEntity={summonedEntity}
        activeFilter={activeFilter}
      />

      {/* Floating Overlays */}
      <ControlStrip 
        onAdd={() => setIsOnboarding(true)} 
        onFilterToggle={() => setShowFilter(!showFilter)}
        onToggleCluster={() => setIsClustered(!isClustered)}
        isClustered={isClustered}
        onReset={() => setResetCounter(c => c + 1)}
      />
      <AnimatePresence>
        {showFilter && <FilterMenu activeFilter={activeFilter} onSelectFilter={setActiveFilter} />}
      </AnimatePresence>

      <TopSearch onSummon={handleSummon} />
      
      {/* Right side slide-in panel */}
      <NegotiationSidebar 
        investor={selectedInvestor} 
        onClose={() => setSelectedInvestor(null)} 
      />

      {/* Fullscreen blocking overlay for LinkedIn add flow */}
      {isOnboarding && (
        <EntityOnboarding onClose={() => setIsOnboarding(false)} />
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
