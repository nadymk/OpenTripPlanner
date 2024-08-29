import { FC, ReactNode } from 'react';
import { cn } from '../util/cn';
import { GearIcon } from './icons/GearIcon';
import { RailIcon } from './icons/TrainIcon';
import logo from '../static/img/otp-logo.svg';

export const Sidebar: FC<{
  tab: string;
  onTabChange: (tab: string) => void;
}> = ({ tab, onTabChange }) => {
  return (
    <div className="min-w-[80px] bg-white z-[20] border-r shadow-md">
      <div className="flex flex-col space-y-0">
        <div className="border-b flex flex-col px-3 py-3 items-center justify-center">
          <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />
        </div>

        <SidebarButton
          active={tab}
          value="plan"
          onTabChange={onTabChange}
          icon={
            <RailIcon
              className={cn('h-[22px] w-[22px]', {
                'fill-gray-400': tab !== 'plan',
                'fill-white': tab == 'plan',
              })}
            />
          }
        >
          Plan
        </SidebarButton>
        <SidebarButton
          active={tab}
          value="lines"
          onTabChange={onTabChange}
          icon={
            <GearIcon
              className={cn('h-[22px] w-[22px]', {
                'fill-gray-400': tab !== 'lines',
                'fill-white': tab == 'lines',
              })}
            />
          }
        >
          Lines
        </SidebarButton>
        <SidebarButton
          active={tab}
          value="config"
          onTabChange={onTabChange}
          icon={
            <GearIcon
              className={cn('h-[22px] w-[22px]', {
                'fill-gray-400': tab !== 'config',
                'fill-white': tab == 'config',
              })}
            />
          }
        >
          Config
        </SidebarButton>
      </div>
    </div>
  );
};

const SidebarButton: FC<{
  icon?: ReactNode;
  active: string;
  value: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}> = ({ icon, active, value, onTabChange, children }) => {
  const isActive = active === value;
  return (
    <button
      className="flex flex-col space-y-2 px-3 py-3 items-center justify-center"
      onClick={() => onTabChange(value)}
    >
      <div
        className={cn('flex justify-center items-center h-[38px] w-[38px] rounded-lg', {
          'bg-blue-500': isActive,
          'bg-gray-100': !isActive,
        })}
      >
        {icon && icon}
      </div>
      <span
        className={cn('font-medium text-xs', {
          'text-blue-500': isActive,
          'text-gray-500': !isActive,
        })}
      >
        {children}
      </span>
    </button>
  );
};
