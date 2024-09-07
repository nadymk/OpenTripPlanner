import React, { FC, HTMLProps, ReactNode, useMemo, useRef } from 'react';
import { Tab, useTabContext } from '../hooks/use-tab-context';

export type TabProps<T = never, A extends Record<string, any> = Record<string, any>> = {
  tab: Tab<T, A>;
  onClose: () => void;
  context: TabRouterContext;
};

type Props = HTMLProps<HTMLDivElement> & {
  context: Record<string, any>;
};

export const TabRoute: FC<Props> = ({ children, context, ...props }) => {
  const { tab, remove } = useTabContext();

  const mapper = useMemo<Record<string, (props: TabProps) => ReactNode>>(
    () =>
      Object.fromEntries(
        React.Children.toArray(children).map((child, index) => {
          return [child.props.id, child.props.component];
        }),
      ),
    [children],
  );

  const getComponent = (tab: Tab) => {
    const Component = mapper[tab.type];

    if (!Component) {
      return () => null;
    }

    return Component;
  };

  const Component = useMemo(() => {
    return getComponent(tab);
  }, [tab]);

  return <Component tab={tab} onClose={() => remove(tab.id)} context={context} />;
};

type TabPathProps<T, A> = { id: string; component: FC<TabProps<T, A>> };

export const TabPath = <T, A>({ id, component, ...props }: TabPathProps<T, A>) => null;
