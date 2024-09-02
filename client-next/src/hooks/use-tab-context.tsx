import * as React from 'react';
import { createContext, useContext } from 'react';

export type Tab<T = any, A extends Record<string, any> = Record<string, any>> = {
  id: string;
  type: string;
  data: T;
  attributes: A;
};

export const TabContext = createContext<{
  tabs: Tab[];
  add: (type: string, data: any) => string;
  remove: (id: string) => void;
  clear: () => void;
  updateAttributes: <T>(id: string, attributes: T) => void;
}>({
  tabs: [],
  add: (type: string, tab: any) => '',
  remove: () => {},
  clear: () => {},
  // hasBack
});

export const useTabContext = () => {
  const context = useContext(TabContext);

  return context;
};

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = React.useState<Tab[]>([
    {
      id: 'idk',
      type: 'trip',
      data: undefined,
    },
  ]);

  const clear = () => {
    setTabs([]);
  };

  const add = (type: string, data: any, attributes): string => {
    const id = `${Math.random().toString(16).slice(2)}`;
    setTabs((prev) => [
      {
        id,
        type,
        data,
        attributes: attributes ?? {},
      },
      ...prev,
    ]);

    return id;
  };

  const remove = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
  };

  const updateAttributes = (id: string, attributes) => {
    setTabs((prev) => {
      const newArray = [...prev];
      const find = newArray.find((tab) => tab.id === id);

      if (!find) {
        return;
      }

      find.attributes = {
        ...find.attributes,
        ...attributes,
      };

      return newArray;
    });
  };

  return (
    <TabContext.Provider
      value={{
        tab: tabs[0],
        tabs,
        clear,
        add,
        remove,
        updateAttributes,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
