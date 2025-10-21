import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  error?: string;
};
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={name} className="font-medium text-gray-300">
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className="rounded-md border-gray-700 bg-gray-900 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          {...props}
        />
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';