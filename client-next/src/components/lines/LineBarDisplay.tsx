import { FC } from 'react';
import { Trip } from '../../gql/graphql';
import { cn } from '../../util/cn';
import { getOperatorColor } from '../../util/routes';
import { Bar, InterChangeDot, LegDetailLeftContainer, LineDetailStop } from '../ui/LineDetail';

export const LineDetails: FC<{
  trip: Trip;
}> = ({ trip: selectedLine }) => {
  const first = selectedLine.quays[0];
  const last = selectedLine.quays[selectedLine.quays.length - 1];

  return (
    <div className="flex flex-col py-6">
      <LineDetailStop
        leg={{
          ...selectedLine,
          ...first,
        }}
        type="start"
      />

      {selectedLine?.quays?.map((leg, index) => {
        const isFirst = index === 0;
        const isLast = selectedLine.quays.length - 1 === index;
        return (
          <>
            {!isFirst && !isLast && (
              <div className="flex w-full">
                <LegDetailLeftContainer className="text-sm flex flex-col space-y-1 relative items-end mr-6 grow-0 items-bottom" />
                <div
                  className={cn('grow h-full flex flex-row relative mt-2', {
                    'pt-[26px] mt-0': index === 1,
                    'pb-[26px]': selectedLine.quays.length - 2 === index,
                  })}
                >
                  <Bar leg={selectedLine} className="-top-[12px] -bottom-[12px]" />
                  <div className="ml-6 w-full">
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-col space-y-2">
                        <div className="relative">
                          <InterChangeDot
                            className="-left-[26px] h-[10px] w-[10px] border-color-none"
                            style={{
                              borderColor: getOperatorColor(selectedLine)?.color,
                            }}
                          />
                          <div className="flex flex-col space-y-1 pb-2">
                            <span className="truncate h-full font-semibold text-sm">{leg.name}</span>
                            <div className="flex flex-row gap-2">
                              <span className="text-xs text-gray-500">
                                {leg.id}, ({leg.latitude}, {leg.longitude})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })}

      <LineDetailStop
        leg={{
          ...selectedLine,
          ...last,
        }}
        type="destination"
      />
    </div>
  );
};
