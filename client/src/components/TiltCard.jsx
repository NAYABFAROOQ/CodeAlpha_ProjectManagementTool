import React, { useRef, useState } from 'react';

/**
 * High-performance 3D Perspective Tilt wrapper
 * Calculates mouse position relative to element center and applies smooth 3D rotation and glare.
 */
export const TiltCard = ({ children, className = '', maxTilt = 7, scale = 1.015, onClick, draggable, onDragStart }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);

    // Subtle 3D dynamic lighting glare
    setGlareStyle({
      opacity: 0.12,
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 3D Content */}
      <div className="relative z-10">{children}</div>

      {/* Dynamic 3D Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={glareStyle}
      />
    </div>
  );
};
