import { FC, useEffect } from 'react';
import { Line, TripPattern } from '../../gql/graphql';
import { useScrollPosition } from '../../hooks/use-scroll-position';
import { useTabContext } from '../../hooks/use-tab-context';
import { TabProps } from '../../screens/TabRouter';
import { BackButton, GoogleMapsLinkButton } from '../ui/Button';
import { ItineraryDetails } from './ItineraryDetails';

export const TripDetailTab: FC<TabProps<TripPattern, { scrollPosition: number }>> = ({
  tab: { id, data, attributes },
  onClose,
  context: { addLineToMap, removeLineFromMap },
}) => {
  const { add, updateAttributes } = useTabContext();
  const { ref: refView, position: scrollPosition } = useScrollPosition(attributes.scrollPosition);

  useEffect(() => {
    if (!data) {
      return;
    }

    addLineToMap(id, data);
    return () => removeLineFromMap(id);
  }, []);

  const onClick = (line: Line) => {
    updateAttributes(id, { scrollPosition, view: data });
    add('lines:detail', line.id);
  };

  return (
    <div className="w-full h-full">
      <section className="overflow-y-auto relative h-full" ref={refView}>
        <div className="flex flex-row space-x-3 py-3 px-3 border-bottom sticky top-0 bg-white z-[10]">
          <div className="relative h-full">
            <BackButton onClick={() => onClose()} />
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col">
              <span className="text-sm">
                <span className="text-sm">from </span>
                <span className="text-sm font-medium">
                  {data.legs?.[0]?.fromPlace?.latitude}, {data.legs?.[0]?.fromPlace?.longitude}
                </span>
              </span>
              <span className="text-sm">
                <span className="text-sm">to </span>
                <span className="text-sm font-medium">
                  {data.legs?.[data.legs.length - 1]?.toPlace?.latitude},{' '}
                  {data.legs?.[data.legs.length - 1]?.toPlace?.longitude}
                </span>
              </span>
            </div>
            <div className="flex">
              <GoogleMapsLinkButton view={data} />
            </div>
          </div>
        </div>
        <ItineraryDetails tripPattern={data} onLineSelected={onClick} />
      </section>
    </div>
  );
};
