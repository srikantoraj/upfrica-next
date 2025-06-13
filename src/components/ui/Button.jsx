import React from 'react';
import classNames from 'classnames';

const variantStyles = {
  primary: 'bg-[#1976d2] text-white hover:bg-[#115293]',
  outline: 'border border-[#1976d2] text-[#1976d2] bg-white hover:bg-[#f0f8ff]',
  ghost: 'text-[#1976d2] bg-transparent hover:bg-[#e3f2fd]',
  disabled: 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70',
};

const sizeStyles = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const appliedVariant =
    disabled && variant !== 'ghost' ? 'disabled' : variant;

  return (
    <button
      className={classNames(
        'rounded-md font-medium tracking-wide transition-all duration-150',
        variantStyles[appliedVariant],
        sizeStyles[size],
        {
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}