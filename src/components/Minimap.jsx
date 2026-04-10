import React, { useEffect, useState } from 'react';

export default function Minimap({ nodes, viewTransform }) {
  const miniWidth = 220;
  const miniHeight = 160;
  
  // Assuming the force graph nodes spread within roughly a 4000x4000 bounding box
  const worldSize = 4000; 
  
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map world coordinate to minimap coordinate
  const mapX = (worldX) => ((worldX + worldSize / 2) / worldSize) * miniWidth;
  const mapY = (worldY) => ((worldY + worldSize / 2) / worldSize) * miniHeight;

  // Viewport mapping (inverse of the d3 transform)
  // When zoomed out (k < 1), the viewport box is bigger on the minimap.
  // Transform format: { x: translate x, y: translate y, k: scale }
  
  // To find world coordinate of top-left screen corner (0,0):
  const worldTopLeftX = (0 - viewTransform.x) / viewTransform.k;
  const worldTopLeftY = (0 - viewTransform.y) / viewTransform.k;
  
  // Bottom Right screen corner:
  const worldBottomRightX = (viewportWidth - viewTransform.x) / viewTransform.k;
  const worldBottomRightY = (viewportHeight - viewTransform.y) / viewTransform.k;

  const miniBoxX = mapX(worldTopLeftX);
  const miniBoxY = mapY(worldTopLeftY);
  const miniBoxWidth = mapX(worldBottomRightX) - miniBoxX;
  const miniBoxHeight = mapY(worldBottomRightY) - miniBoxY;

  return (
    <div className="minimap-container glass-panel">
      <div className="minimap-header text-muted">
        <span>SECTOR GRID</span>
        <span className="mono text-green">{(viewTransform.k * 100).toFixed(0)}%</span>
      </div>
      
      <div className="minimap-canvas" style={{ width: miniWidth, height: miniHeight }}>
        {/* Draw the nodes as tiny dots */}
        {nodes.map(node => {
          if (!node.x || !node.y) return null;
          
          let bgColor = 'var(--color-accent-blue)';
          if (node.type === 'elite') bgColor = 'var(--color-accent-gold)';
          else if (node.type === 'flow') bgColor = 'var(--color-accent-green)';
          
          // Size dot slightly based on capital weight
          const dotSize = Math.max(1, (node.weight / 15) * 4);

          return (
            <div
              key={`mini-${node.id}`}
              className="minimap-node"
              style={{
                left: mapX(node.x),
                top: mapY(node.y),
                width: dotSize,
                height: dotSize,
                backgroundColor: bgColor,
                boxShadow: `0 0 4px ${bgColor}`
              }}
            />
          );
        })}

        {/* Draw the Viewport Extent Box */}
        <div 
          className="minimap-viewport"
          style={{
            left: miniBoxX,
            top: miniBoxY,
            width: miniBoxWidth,
            height: miniBoxHeight
          }}
        />
      </div>

      <style>{`
        .minimap-container {
          position: absolute;
          bottom: 24px;
          right: 24px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(10, 10, 13, 0.85);
          backdrop-filter: blur(24px);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .minimap-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .minimap-canvas {
          position: relative;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          border: 1px solid var(--color-border-light);
          overflow: hidden;
        }

        .minimap-node {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .minimap-viewport {
          position: absolute;
          border: 1px solid rgba(0, 255, 65, 0.6);
          background: rgba(0, 255, 65, 0.05);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.1) inset;
          pointer-events: none;
          transform-origin: 0 0;
        }
      `}</style>
    </div>
  );
}
