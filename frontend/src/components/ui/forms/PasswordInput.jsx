import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

export const PasswordInput = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      id={id}
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      label={label}
      error={error}
      leftIcon={<Lock className="h-5 w-5 shrink-0" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-text/40 hover:text-text focus:outline-none transition-colors p-1"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      }
      className={className}
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
