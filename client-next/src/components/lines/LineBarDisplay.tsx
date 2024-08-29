import * as dayjs from "dayjs";
import { FC } from "react";
import { Leg } from "../../gql/graphql";
import { cn } from "../../util/cn";
import { getOperatorColor } from "../../util/routes";
import { LegIcon } from "../icons/TransitIcons";

export const LineDetails: FC<{
    leg: Leg;
    nextLeg?: Leg;
    previousLeg?: Leg;
    isFirst: boolean;
    isLast: boolean;
    index: number;
  }> = ({ leg, isFirst, isLast, previousLeg, nextLeg, index }) => {
    const isLegStartSameAsLegEnd = () => {
      return dayjs(previousLeg?.expectedEndTime).isSame(dayjs(leg.expectedStartTime));
      // return true;
    };
  
    return (
      <>
        {isFirst && (
          <div className="flex w-full">
            <LegDetailLeftContainer>
              {/* <LegTime aimedTime={leg.aimedStartTime} expectedTime={leg.expectedStartTime} hasRealtime={leg.realtime} /> */}
            </LegDetailLeftContainer>
            <div className="grow flex flex-row relative">
              <InterChangeDot />
              <Bar leg={leg} className="top-[12px]" />
              <span className="ml-6 w-full h-full truncate font-semibold text-md border-b pb-[26px]">{leg.name}</span>
            </div>
          </div>
        )}
  
        <div className="flex flex-col">
          {!isFirst && !isLast && (
            <div className="flex w-full">
              <LegDetailLeftContainer className="text-sm flex flex-col space-y-1 relative items-end mr-6 grow-0">
                <LegIcon leg={leg} />
              </LegDetailLeftContainer>
  
              <div
                className={cn('grow h-full flex flex-row relative mt-2', {
                  'pt-[26px] mt-0': index === 1,
                  'pb-[26px]': index === 5,
                })}
              >
                <Bar leg={leg} className="-top-[12px] -bottom-[12px]" />
                <div className="ml-6 w-full">
                  <div className="flex flex-col space-y-1">
                    {/* {isTransit(leg) && (
                    <span className="space-x-1.5">
                      <LineBadge leg={leg} />
                      <span>{leg.name}</span>
                    </span>
                  )}
                  {!isTransit(leg) && <>Walk</>}
                  <AboutTime leg={leg} />
                  <GeneralDetails leg={leg} /> */}
  
                    {/* {leg.intermediateQuays.length !== 0 && ( */}
                    <div className="flex flex-col space-y-2">
                      {/* {leg.intermediateQuays.map((quay) => { */}
                      {/* return ( */}
                      <div className="relative">
                        <InterChangeDot
                          className="-left-[26px] h-[10px] w-[10px] border-color-none"
                          style={{
                            borderColor: getOperatorColor(leg)?.color,
                          }}
                        />
                        <span className="truncate h-full font-semibold text-sm">{leg.name}</span>
                      </div>
                      {/* );
                      })} */}
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          )}
  
          {/* {isTransit(leg) && !isTransit(nextLeg) && (
            <div className="flex w-full relative">
              <LegDetailLeftContainer>
                <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} />
              </LegDetailLeftContainer>
              <div className="grow flex flex-row relative">
                <InterChangeDot />
                <Bar leg={leg} className="-top-[12px] bottom-[12px]" />
                <span className="truncate ml-6 h-full font-semibold text-md">{leg.name}</span>
              </div>
            </div>
          )} */}
        </div>
  
        {isLast && (
          <div className="flex w-full">
            <LegDetailLeftContainer>
              {/* <LegTime aimedTime={leg.aimedEndTime} expectedTime={leg.expectedEndTime} hasRealtime={leg.realtime} /> */}
            </LegDetailLeftContainer>
            <div className="grow flex flex-row relative">
              <InterChangeDot />
              <Bar leg={leg} className="bottom-[12px]" />
              <span className="ml-6 w-full h-full w-[calc(75%_-_16px)] font-semibold text-md">{leg.name}</span>
            </div>
          </div>
        )}
      </>
    );
  };
  