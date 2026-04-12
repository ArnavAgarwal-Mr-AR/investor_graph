import React from 'react';
import { motion } from 'framer-motion';

export default function CapitalTile({
  node,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick,
  selected,
  isFaded
}) {
  // Visuals driven by "Capital Weight"
  const scale = node.weight > 8 ? 1.05 : node.weight < 5 ? 0.95 : 1;
  const shadow = node.weight > 8
    ? 'var(--shadow-heavy-weight)'
    : node.weight < 5
      ? 'var(--shadow-light-weight)'
      : 'var(--shadow-medium-weight)';

  const accentColor = node.type === 'elite'
    ? 'var(--color-accent-gold)'
    : node.type === 'flow'
      ? 'var(--color-accent-green)'
      : 'var(--color-accent-blue)';

  return (
    <motion.div
      // Translate to absolute coordinates.
      // D3 sets x and y on the node directly.
      // We position them out of flow via Framer Motion's style transform.
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x: node.x ? node.x - 125 : 0, // 125 is half the width
        y: node.y ? node.y - 80 : 0, // 80 is half the height
        transformOrigin: 'center center',
        pointerEvents: isFaded ? 'none' : 'auto'
      }}
      drag={!isFaded}
      dragMomentum={false}
      onDragStart={() => onDragStart(node)}
      onDrag={(e, info) => onDrag(node, info)}
      onDragEnd={() => onDragEnd(node)}
      onClick={() => onClick(node)}

      // Idle animation vs Dragging animation
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale,
        opacity: isFaded ? 0.15 : 1,
        // When selected or elite, maybe a slight pulse
        boxShadow: selected ? `0 0 30px ${accentColor}40, ${shadow}` : shadow,
        borderColor: selected ? accentColor : 'var(--color-border-light)',
        filter: isFaded ? 'grayscale(100%)' : 'none'
      }}
      whileHover={isFaded ? {} : { scale: scale * 1.02, boxShadow: `0 0 20px ${accentColor}40, ${shadow}` }}
      whileTap={isFaded ? {} : { scale: scale * 0.98, cursor: 'grabbing' }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}

      className={`capital-tile glass-panel ${selected ? 'selected' : ''}`}
    >
      <div className="tile-glow-top" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />

      <div className="tile-header">
        <img src={node.image} alt={node.name} className="tile-avatar" />
        <div className="tile-title">
          <div className="tile-name">{node.name}</div>
          <div className="tile-firm text-muted">{node.firm}</div>
        </div>
      </div>

      <div className="tile-metric text-green mono">
        {node.deployed}
      </div>

      <div className="tile-tags">
        {node.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <style>{`
        .capital-tile {
          width: 250px;
          height: 160px;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: grab;
          user-select: none;
          background: rgba(20, 20, 25, 0.7);
          overflow: hidden;
          position: relative;
        }

        .tile-glow-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
        }

        .tile-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid var(--color-border-light);
        }

        .tile-title {
          display: flex;
          flex-direction: column;
        }
        
        .tile-name {
          font-weight: 600;
          font-size: 15px;
          letter-spacing: -0.2px;
        }

        .tile-firm {
          font-size: 12px;
          font-weight: 500;
        }

        .tile-metric {
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.5px;
          margin-top: 8px;
        }

        .tile-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 12px;
          color: var(--color-text-secondary);
        }
      `}</style>
    </motion.div>
  );
}
