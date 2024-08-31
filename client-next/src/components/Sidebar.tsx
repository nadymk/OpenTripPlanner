import { FC, ReactNode, useContext } from 'react';
import { cn } from '../util/cn';
import { GearIcon } from './icons/GearIcon';
import { RailIcon } from './icons/TrainIcon';
import logo from '../static/img/otp-logo.svg';
import { BadgeCellContext, TabValue } from './ui/Tabs';

export const Sidebar: FC<{
  tab: string;
  onTabChange: (tab: string) => void;
}> = ({ lineCount, tripCount, tab, onTabChange }) => {
  return (
    <div className="min-w-[80px] bg-white z-[20] border-r shadow-md">
      <div className="flex flex-col space-y-0">
        <div className="border-b h-[65px] flex flex-col px-3 py-3 items-center justify-center">
          <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />
        </div>

        <SidebarButton
          active={tab}
          value="plan"
          onTabChange={onTabChange}
          tag={
            <>
              {tripCount > 0 && (
                <div className="absolute bg-gray-500 rounded-lg px-1.5 py-0.5 flex -top-[6px] -right-[6px]">
                  <span className="text-white text-[9px] font-medium">{tripCount}</span>
                </div>
              )}
            </>
          }
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
          tag={
            <>
              {lineCount > 0 && (
                <div className="absolute bg-gray-500 rounded-lg px-1.5 py-0.5 flex -top-[8px] -right-[8px]">
                  <span className="text-white text-[9px] font-medium">{lineCount}</span>
                </div>
              )}
            </>
          }
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
          value="stops"
          onTabChange={onTabChange}
          tag={
            <>
              {lineCount > 0 && (
                <div className="absolute bg-gray-500 rounded-lg px-1.5 py-0.5 flex -top-[8px] -right-[8px]">
                  <span className="text-white text-[9px] font-medium">{lineCount}</span>
                </div>
              )}
            </>
          }
          icon={
            <GearIcon
              className={cn('h-[22px] w-[22px]', {
                'fill-gray-400': tab !== 'stops',
                'fill-white': tab == 'stops',
              })}
            />
          }
        >
          Stops
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

export const SidebarButton: FC<{
  icon?: ReactNode;
  tag?: ReactNode;
  active: string;
  value: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}> = ({ icon, tag, active, value, onTabChange, children }) => {
  const isActive = active === value;
  return (
    <button
      className="flex flex-col space-y-2 px-3 py-3 items-center justify-center"
      onClick={() => onTabChange(value)}
    >
      <div
        className={cn('flex relative justify-center items-center h-[38px] w-[38px] rounded-lg', {
          'bg-gray-700': isActive,
          'bg-gray-100': !isActive,
        })}
      >
        {tag && tag}
        {icon && icon}
      </div>
      <span
        className={cn('font-medium text-xs', {
          'text-gray-700': isActive,
          'text-gray-500': !isActive,
        })}
      >
        {children}
      </span>
    </button>
  );
};

export const SidebarTabValue: FC<{
  icon?: ReactNode;
  tag?: ReactNode;
  value: string;
  children: ReactNode;
}> = ({ icon, tag, value, children }) => {
  const { isActive: check } = useContext(BadgeCellContext);

  const isActive = check(value);
  return (
    <TabValue className="flex flex-col space-y-2 px-3 py-3 items-center justify-center">
      <div
        className={cn('flex relative justify-center items-center h-[38px] w-[38px] rounded-lg', {
          'bg-gray-700': isActive,
          'bg-gray-100': !isActive,
        })}
      >
        {tag && tag}
        {icon && icon}
      </div>
      <span
        className={cn('font-medium text-xs', {
          'text-gray-700': isActive,
          'text-gray-500': !isActive,
        })}
      >
        {children}
      </span>
    </TabValue>
  );
};
