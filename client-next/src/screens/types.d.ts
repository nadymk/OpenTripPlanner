declare type TabRouterContext = {
  addLineToMap: (id: string, ...line: any) => void;
  removeLineFromMap: (id: string, line?: any) => void;
};
