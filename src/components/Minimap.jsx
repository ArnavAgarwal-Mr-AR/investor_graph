import React, { useEffect, useState } from 'react';

export default function Minimap({ nodes, viewTransform }) {
  const miniWidth = 220;
  const miniHeight = 160;
  
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

  // Dynamic Bounding Box calculation so it perfectly frames all points
  const minX = Math.min(...nodes.map(n => n.x || 0));
  const maxX = Math.max(...nodes.map(n => n.x || 0));
  const minY = Math.min(...nodes.map(n => n.y || 0));
  const maxY = Math.max(...nodes.map(n => n.y || 0));

  // Add structural padding and set absolute minimums to prevent jumpy scaling on init
  const dataWidth = Math.max(maxX - minX + 800, 2000);
  const dataHeight = Math.max(maxY - minY + 800, 1500);
  
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Derive optimal scale to fit dimensions perfectly
  const scale = Math.min(miniWidth / dataWidth, miniHeight / dataHeight);

  // Map world coordinate to minimap coordinate using derived center offset
  const mapX = (worldX) => miniWidth / 2 + (worldX - centerX) * scale;
  const mapY = (worldY) => miniHeight / 2 + (worldY - centerY) * scale;

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

  // Clamp the green viewport box so the borders don't get clipped by 'overflow: hidden'
  // and instead cleanly hug the inner walls of the minimap canvas when zoomed out.
  const clampedX = Math.max(0, miniBoxX);
  const clampedY = Math.max(0, miniBoxY);
  const clampedWidth = Math.min(miniWidth - clampedX, (miniBoxX + miniBoxWidth) - clampedX);
  const clampedHeight = Math.min(miniHeight - clampedY, (miniBoxY + miniBoxHeight) - clampedY);

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
        {clampedWidth > 0 && clampedHeight > 0 && (
          <div 
            className="minimap-viewport"
            style={{
              left: clampedX,
              top: clampedY,
              width: clampedWidth,
              height: clampedHeight
            }}
          />
        )}
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
          border: 1.5px solid rgba(0, 255, 65, 0.8);
          background: rgba(0, 255, 65, 0.05);
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.1) inset;
          pointer-events: none;
          transform-origin: 0 0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
