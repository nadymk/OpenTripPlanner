import { FC, HTMLProps } from 'react';
import { cn } from '../../util/cn';

export const Badge: FC<HTMLProps<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <span {...props} className={cn('flex font-semibold text-xs rounded-[12px] py-1 border bg-white px-2', className)}>
      {children}
    </span>
  );
};
