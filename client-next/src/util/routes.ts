import { Leg } from '../gql/graphql';

export const isMode = (leg: Leg, mode: string) => leg?.mode === mode || leg?.transportMode === mode;

export const isAuthority = (leg: Leg, authority: string) => leg?.authority?.name === authority;

export const isDLR = (leg: Leg) => isRail(leg) && leg.authority?.name === 'Docklands Light Railway';

export const isOverground = (leg: Leg) => isRail(leg) && leg.authority?.name === 'London Overground';

export const isTfLRail = (leg: Leg) => isRail(leg) && leg.authority?.name === 'TfL Rail';

export const isBus = (leg: Leg) => isMode(leg, 'bus');

export const isMetro = (leg: Leg) => isMode(leg, 'metro');

export const isUnderground = (leg: Leg) => isMetro(leg) && leg.authority?.name === 'London Underground';

export const isLine = (leg: Leg, line: string) => leg.line?.publicCode === line;

export const isRail = (leg: Leg) => isMode(leg, 'rail');

export const isFoot = (leg: Leg) => isMode(leg, 'foot');

export const isTransit = (leg?: Leg) => {
  if (!leg) {
    return false;
  }

  return (
    isMode(leg, 'rail') || isMode(leg, 'tram') || isMode(leg, 'water') || isMode(leg, 'metro') || isMode(leg, 'bus')
  );
};

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
    text: '#000000',
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
  'Waterloo & City line': {
    color: '#6eceb2',
  },
};

const riverBusColors = {
  RB1: {
    color: '#2d3039',
  },
  RB2: {
    color: '#0072bc',
  },
  RB4: {
    color: '#61c29d',
    text: '#000000',
  },
  RB6: {
    color: '#df64b0',
  },
  "Woolwich Ferry": {
    color: '#00a3e0',
  }
};

export const operatorColors = {
  ...tubeColors,
  ...riverBusColors,
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
  'Chiltern Railways': {
    color: '#00bfff',
  },
  'Great Western Railway': {
    color: '#0a493e',
  },
  'Avanti West Coast': {
    color: '#004354',
  },
  'West Midlands Trains': {
    color: '#ff8300',
  },
  'East Midlands Railway': {
    color: '#713563',
  },
  'Gatwick Express': {
    color: '#EB1E2D',
  },
  'Heathrow Express': {
    color: '#532e63',
  },
  'TfL Rail': {
    color: '#6950a1',
  },
  'London Trams': {
    color: '#00bd19',
  },
  'London Cable Car': {
    color: '#dc241f',
  },
  'Docklands Light Railway': {
    color: '#00b2a9',
  },
  c2c: {
    color: '#b7007c',
  },
  bus: {
    color: '#dc241f',
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
  if (operatorColors[leg?.publicCode]) {
    return operatorColors[leg?.publicCode];
  }

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
