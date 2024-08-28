import { Leg } from '../gql/graphql';

export const isDLR = (leg: Leg) => leg.mode === 'rail' && leg.authority?.name === 'Docklands Light Railway';

export const isOverground = (leg: Leg) => leg.mode === 'rail' && leg.authority?.name === 'London Overground';

export const isTfLRail = (leg: Leg) => leg.mode === 'rail' && leg.authority?.name === 'TfL Rail';

export const isBus = (leg: Leg) => leg?.mode === 'bus';

export const isUnderground = (leg: Leg) => leg.mode === 'metro' && leg.authority?.name === 'London Underground';

export const isLine = (leg: Leg, line: string) => leg.line?.publicCode === line;

export const isMode = (leg: Leg, mode: string) => leg?.mode === mode;

export const isRail = (leg: Leg) => isMode(leg, 'rail');

export const isFoot = (leg: Leg) => isMode(leg, 'foot');

const tubeColors = {
  'Circle line': {
    color: '#FFD300',
    text: '#000000',
  },
  'Bakerloo line': {
    color: '#a45a2a',
  },
  'Central line': {
    color: '#da291c',
  },
  'District line': {
    color: '#007a33',
  },
  'Hammersmith & City line': {
    color: '#e89cae',
    text: '#000000'
  },
  'Jubilee line': {
    color: '#7c878e',
  },
  'Metropolitan line': {
    color: '#840b55',
  },
  'Piccadilly line': {
    color: '#10069f',
  },
  'Victoria line': {
    color: '#00a3e0',
  },
  'Northern line': {
    color: '#000000',
    text: '#ffffff',
  },
  'Waterloo and City line': {
    color: '#6eceb2',
    text: '#ffffff',
  },
};

export const operatorColors = {
  ...tubeColors,
  'London Overground': {
    color: '#EE7C0E',
  },
  'London Underground': {
    color: '#10069F',
  },
  Southeastern: {
    color: '#389cff',
  },
  'Greater Anglia': {
    color: '#d70428',
  },
  Thameslink: {
    color: '#ff5aa4',
  },
  Southern: {
    color: '#8cc63e',
  },
  'South Western Railway': {
    color: '#24398c',
  },
  'Great Northern': {
    color: '#30104d',
  },
  'TfL Rail': {
    color: '#6950a1',
  },
  'Docklands Light Railway': {
    color: '#00b2a9',
  },
  'c2c': {
    color: '#b7007c',
  },
  bus: {
    color: '#d42e12',
  },
  rail: {
    color: '#000000',
  },
  metro: {
    color: '#10069F',
  },
  foot: {
    color: '#37a0ff',
  },
};

export const getOperatorColor = (leg: Leg): { color: string; text?: string } => {
  if (operatorColors[leg.line?.publicCode]) {
    return operatorColors[leg.line?.publicCode];
  }

  if (operatorColors[leg.authority?.name]) {
    return operatorColors[leg.authority?.name];
  }

  if (isBus(leg)) {
    return operatorColors['bus'];
  }

  if (isRail(leg)) {
    return operatorColors['rail'];
  }

  if (isFoot(leg)) {
    return operatorColors['foot'];
  }

  return {
    color: '#ff00ff',
  };
};
