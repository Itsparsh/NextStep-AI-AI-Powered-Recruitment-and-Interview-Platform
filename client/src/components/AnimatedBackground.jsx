import React from 'react';
import './AnimatedBackground.css';

/**
 * AnimatedBackground
 * Clean, subtle, modern SaaS ambient backdrop.
 * Replaces heavy glowing orbs and floating particles with a restrained,
 * warm professional surface suitable for high-focus recruitment workflows.
 */
export default function AnimatedBackground() {
  return (
    <div className="animated-bg-wrapper" aria-hidden="true">
      <div className="animated-bg-canvas" />
    </div>
  );
}
