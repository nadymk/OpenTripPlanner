import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { cn } from '../../util/cn';

const TabProps = {};

export const BadgeCellContext = createContext<{
  value: string;
  isActive: (key: string) => boolean;
  props: TabProps;
}>({
  value: '',
  isActive: (key: string) => false,
  props: {},
});

export const Tabs = ({ value, onTabChange, children }) => {
  const isActive = (key: string) => value === key;

  return (
    <BadgeCellContext.Provider value={{ value, onTabChange, isActive }}>
      <div className="flex flex-row">{children}</div>
    </BadgeCellContext.Provider>
  );
};

export const TabsView: FC<{}> = ({ value, children, ...props }) => {
  const { isActive, onTabChange } = useContext(BadgeCellContext);

  if (!isActive(value)) {
    return null;
  }

  return (
    <button
      className="flex flex-col space-y-2 px-3 py-3 items-center justify-center"
      onClick={() => onTabChange(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, ...props }) => {
  const context = useContext(BadgeCellContext);

  const child = useMemo(
    () =>
      React.Children.toArray(children).filter((child, i) => {
        return child.props.value === context.value;
      }),
    [context.value, children],
  );

  return <div>{child}</div>;
};

export const TabsValue = ({ children, ...props }) => {
  const context = useContext(BadgeCellContext);

  const child = useMemo(
    () =>
      React.Children.toArray(children).map((child, i) => {
        return child;
        // return child.props.value === context.value;
      }),
    [context.value, children],
  );

  return <div>{children}</div>;
};

export const TabValue: FC<{
  value: string;
  children: ReactNode;
}> = ({ className, value, children }) => {
  const context = useContext(BadgeCellContext);
  const isActive = context.isActive(value);

  return (
    <button
      className={cn('flex flex-col space-y-2 px-3 py-3 items-center justify-center', className)}
      onClick={() => context?.onTabChange(value)}
    >
      {children}
    </button>
  );
};
