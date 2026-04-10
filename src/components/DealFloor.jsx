import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { mockInvestors, mockLinks } from '../data/mockEnvironment';
import CapitalTile from './CapitalTile';
import Minimap from './Minimap';

export default function DealFloor({ onSelectInvestor, selectedInvestor, isClustered, resetCounter, summonedEntity, activeFilter }) {
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  
  // We keep the nodes and links in ref so D3 can mutate them, 
  // and we trigger re-renders by updating the 'tick' state.
  const nodesRef = useRef([...mockInvestors]);
  const linksRef = useRef([...mockLinks]);
  const [, setTick] = useState(0);
  const [viewTransform, setViewTransform] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2, k: 0.5 });

  const clusterCenters = {
    'ENTERPRISE & SAAS': { x: -600, y: -400 },
    'FINTECH & WEB3': { x: 600, y: -400 },
    'CONSUMER & COMMERCE': { x: 800, y: 400 },
    'DEEPTECH & AI': { x: -800, y: 400 },
    'CLIMATE & IMPACT': { x: 0, y: 600 },
    'GROWTH & PE': { x: 0, y: -700 }
  };

  const getPrimaryCluster = (tags) => {
    const t = tags[0]?.toLowerCase() || '';
    if (t.includes('saas') || t.includes('enterprise') || t.includes('b2b') || t.includes('software')) return 'ENTERPRISE & SAAS';
    if (t.includes('fintech') || t.includes('web3') || t.includes('crypto')) return 'FINTECH & WEB3';
    if (t.includes('consumer') || t.includes('d2c') || t.includes('commerce') || t.includes('marketplace') || t.includes('edtech') || t.includes('health') || t.includes('logistics') || t.includes('media') || t.includes('agritech') || t.includes('retail') || t.includes('classifieds')) return 'CONSUMER & COMMERCE';
    if (t.includes('deeptech') || t.includes('ai') || t.includes('hardware') || t.includes('robotics')) return 'DEEPTECH & AI';
    if (t.includes('impact') || t.includes('climate') || t.includes('infrastructure')) return 'CLIMATE & IMPACT';
    if (t.includes('growth') || t.includes('private equity') || t.includes('late')) return 'GROWTH & PE';
    return 'ENTERPRISE & SAAS'; // fallback
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize D3 Force Simulation with localized gravity
    const simulation = d3.forceSimulation(nodesRef.current)
      .force('link', d3.forceLink(linksRef.current).id(d => d.id).distance(180).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-800)) // Reduced repulsion for closer nodes
      .force('x', d3.forceX(d => clusterCenters[getPrimaryCluster(d.tags)].x).strength(0.12))
      .force('y', d3.forceY(d => clusterCenters[getPrimaryCluster(d.tags)].y).strength(0.12))
      .force('collide', d3.forceCollide().radius(140).iterations(3)) 
      .alphaDecay(0.02)
      .on('tick', () => {
        setTick(t => t + 1);
      });

    simulationRef.current = simulation;

    // Viewport Pan & Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.2, 4]) // Allow zooming out to 20% and in to 400%
      .on('zoom', (e) => {
        setViewTransform(e.transform);
      });

    d3.select(containerRef.current).call(zoom)
      .call(zoom.transform, d3.zoomIdentity.translate(window.innerWidth / 2, window.innerHeight / 2).scale(0.5)); // Initial zoom out to see clusters

    const handleResize = () => {
      simulation.alpha(0.3).restart();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run once on mount

  // Handle clustering toggle
  useEffect(() => {
    if (!simulationRef.current) return;
    if (isClustered) {
      simulationRef.current
        .force('x', d3.forceX(d => clusterCenters[getPrimaryCluster(d.tags)].x).strength(0.12))
        .force('y', d3.forceY(d => clusterCenters[getPrimaryCluster(d.tags)].y).strength(0.12))
        .force('center', null);
    } else {
      simulationRef.current
        .force('x', null)
        .force('y', null)
        .force('center', d3.forceCenter(0, 0));
    }
    simulationRef.current.alpha(1).restart();
  }, [isClustered]);

  // Handle map reset
  useEffect(() => {
    if (resetCounter > 0 && containerRef.current) {
      d3.select(containerRef.current).select('.viewport-camera').transition().duration(750).style('transform', `translate(${window.innerWidth / 2}px, ${window.innerHeight / 2}px) scale(0.5)`);
      setViewTransform({ x: window.innerWidth / 2, y: window.innerHeight / 2, k: 0.5 });
      if (simulationRef.current) simulationRef.current.alpha(1).restart();
    }
  }, [resetCounter]);

  // Handle entity summoning
  useEffect(() => {
    if (!summonedEntity || !simulationRef.current) return;
    
    // Find closest match
    const node = nodesRef.current.find(n => 
      n.name.toLowerCase().includes(summonedEntity.toLowerCase()) || 
      n.firm.toLowerCase().includes(summonedEntity.toLowerCase())
    );

    if (node) {
      const centerX = (window.innerWidth / 2 - viewTransform.x) / viewTransform.k;
      const centerY = (window.innerHeight / 2 - viewTransform.y) / viewTransform.k;
      
      // Drop from "above"
      node.x = centerX;
      node.y = centerY - 3000;
      node.fx = centerX;
      node.fy = centerY;
      
      onSelectInvestor(node);
      simulationRef.current.alpha(1).restart();

      // Release it back to physics engine after landing
      setTimeout(() => {
        node.fx = null;
        node.fy = null;
        if (simulationRef.current) simulationRef.current.alpha(0.3).restart();
      }, 1500);
    } 
    // Removed strict alert. The Search dropdown handles feedback.
  }, [summonedEntity]);

  // Framer Motion Drag Handlers linked to D3
  const handleDragStart = (node) => {
    // Reheat the simulation a bit if it has settled
    if (simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  };

  const handleDrag = (node, info) => {
    // Update the fixed position of the node based on Framer Motion's drag delta
    // Notice info.point is absolute, but info.delta is relative. 
    // We can just add delta to current fx/fy
    node.fx += info.delta.x;
    node.fy += info.delta.y;
  };

  const handleDragEnd = (node) => {
    if (simulationRef.current) simulationRef.current.alphaTarget(0);
    node.fx = null; // Release from fixed position
    node.fy = null;
  };

  return (
    <div ref={containerRef} className="deal-floor">
      {/* Background SVG Grid / Pattern can go here */}
      <div className="grid-overlay" />

      {/* The Viewport Camera mapping D3 zoom coordinates */}
      <div 
        className="viewport-camera" 
        style={{ 
          transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.k})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%' 
        }}
      >
        {/* SVG Layer for Tension Bands */}
        <svg className="tension-layer" width="100%" height="100%">
          {linksRef.current.map((link, i) => {
          if (!link.source.x || !link.target.x) return null;
          
          // Calculate a subtle curve for the tension band
          const dx = link.target.x - link.source.x;
          const dy = link.target.y - link.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 2; // Control curve amount
          
          const pathData = `M${link.source.x},${link.source.y} Q${link.source.x + dx/2},${link.source.y + dy/2 + 50} ${link.target.x},${link.target.y}`;
          
          // Thickness based on strength
          const strokeWidth = (link.strength * 2) + 1;
          
          // Check if either connected node is selected to make band glow
          const isHighlighted = selectedInvestor && 
            (selectedInvestor.id === link.source.id || selectedInvestor.id === link.target.id);

          return (
            <path
              key={`link-${i}`}
              d={pathData}
              className={`tension-band ${isHighlighted ? 'active' : ''}`}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </svg>

      {/* DOM Layer for Capital Mass Tiles */}
      <div className="tiles-layer">
        {nodesRef.current.map(node => {
          const isFaded = activeFilter && !node.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())) && !node.type.toLowerCase().includes(activeFilter.toLowerCase());
          return (
          <CapitalTile 
            key={node.id} 
            node={node}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClick={(n) => { if(!isFaded) onSelectInvestor(n); }}
            selected={selectedInvestor && selectedInvestor.id === node.id}
            isFaded={isFaded}
          />
        )})}
        
        {/* Render Region Labels */}
        {isClustered && Object.entries(clusterCenters).map(([label, coord]) => (
          <div 
            key={label}
            className="region-label"
            style={{
              position: 'absolute',
              left: coord.x,
              top: coord.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {label}
          </div>
        ))}
      </div>
      </div>

      <Minimap nodes={nodesRef.current} viewTransform={viewTransform} />

      <style>{`
        .deal-floor {
          width: 100vw;
          height: 100vh;
          position: absolute;
          top: 0;
          left: 0;
          background: radial-gradient(circle at center, #111115 0%, #060608 100%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .tension-layer {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 10;
        }

        .tension-band {
          fill: none;
          stroke: var(--color-border-light);
          opacity: 0.4;
          transition: stroke 0.3s ease, opacity 0.3s ease;
        }

        .tension-band.active {
          stroke: var(--color-accent-green);
          opacity: 0.8;
          filter: drop-shadow(0 0 8px var(--color-accent-green));
        }

        .tiles-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
          pointer-events: auto;
        }

        .region-label {
          font-family: var(--font-family-base);
          font-size: 80px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.03);
          letter-spacing: 12px;
          pointer-events: none;
          z-index: -1;
          text-align: center;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
