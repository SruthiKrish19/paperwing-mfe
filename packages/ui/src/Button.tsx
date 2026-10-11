import type { ButtonHTMLAttributes } from 'react';
export function Button({ variant = 'primary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  return <button className={`pw-btn pw-btn-${variant} ${className}`} {...rest} />;
}
