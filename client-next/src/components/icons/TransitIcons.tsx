import londonUndergroundIcon from '../../static/img/uk-london-underground.svg';
import overgroundIcon from '../../static/img/uk-london-overground.svg';
import elizabethLineIcon from '../../static/img/uk-london-tfl-elizabeth-train.svg';
import walkIcon from '../../static/img/walk.svg';
import busIcon from '../../static/img/uk-london-bus.svg';
import dlrIcon from '../../static/img/uk-london-dlr.svg';
import railIcon from '../../static/img/uk-rail.svg';
import tramIcon from '../../static/img/uk-london-tramlink.svg';
import cableCarIcon from '../../static/img/uk-london-ifs-cloud-cable-car.svg';
import boatIcon from '../../static/img/uk-london-thames-clippers-ferry.svg';
import { FC } from 'react';
import { Leg } from '../../gql/graphql';
import { isMode, isAuthority, isDLR, isOverground, isUnderground, isTfLRail, isBus, isRail } from '../../util/routes';

export const LegIcon: FC<{
    leg: Leg;
  }> = ({ leg }) => {
    const getIcon = () => {
      if (isMode(leg, 'tram')) {
        return tramIcon;
      }
  
      if (isMode(leg, 'water')) {
        return boatIcon;
      }
  
      if (isAuthority(leg, 'London Cable Car')) {
        return cableCarIcon;
      }
  
      return undefined;
    };
  
    const icon = getIcon();
  
    if (icon) {
      return <img alt="" src={icon} className="w-[16px] h-[16px]" />;
    }
  
    return (
      <>
        {isDLR(leg) && <img alt="" src={dlrIcon} className="w-[16px] h-[16px]" />}
        {isOverground(leg) && <img alt="" src={overgroundIcon} className="w-[16px] h-[16px]" />}
        {isUnderground(leg) && <img alt="" src={londonUndergroundIcon} className="w-[16px] h-[16px]" />}
        {isTfLRail(leg) && <img alt="" src={elizabethLineIcon} className="w-[16px] h-[16px]" />}
        {isMode(leg, 'foot') && <img alt="" src={walkIcon} className="w-[16px] h-[16px]" />}
        {isBus(leg) && <img alt="" src={busIcon} className="w-[16px] h-[16px]" />}
        {isRail(leg) && !isDLR(leg) && !isOverground(leg) && !isTfLRail(leg) && (
          <img alt="" src={railIcon} className="w-[16px] h-[16px]" />
        )}
      </>
    );
  };
  