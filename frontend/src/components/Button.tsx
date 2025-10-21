import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  isLoading?: boolean;
};

export function Button({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}