import React from 'react';
import '../../index.scss';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {

  const variantClass = `btn-${variant}`;
  const baseClass = "btn";

  return (
    <button
      className={`${baseClass} ${variantClass} ${className} `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
