/**
 * Button.jsx - Reusable Button Component
 * 
 * Variants:
 * - primary: Solid accent color
 * - outline: Bordered with accent color
 * - ghost: Transparent background
 */

import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
