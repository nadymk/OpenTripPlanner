import { FC, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Line, QueryType } from '../../gql/graphql';
import { useRoutesQuery } from '../../hooks/useRoutesQuery';
import { LegIcon } from '../icons/TransitIcons';

export const LineTab: FC<{
  data: QueryType | null;
  isLoading: boolean;
  onRefresh: (pageCursor?: string) => Promise<void>;
  onLineSelected: (line: Line) => void;
}> = ({ data, isLoading, onRefresh, onLineSelected }) => {
  //   useEffect(() => {
  //     refetch();
  //   }, []);

  return (
    <div className="w-full h-full">
      <section className="h-full relative overflow-y-auto">
        <div className="flex flex-col space-y-0 pb-6">
          <div className="sticky bg-white top-0 flex flex-row border-bottom p-3 space-x-3 shadow-sm items-center">
            <div className="flex justify-center h-full">
              <Button
                variant="outline-primary"
                className="h-[32px] leading-[0px]"
                onClick={() => onRefresh()}
                // disabled={loading}
              >
                {/* {loading && (
                    <>
                    </>
                )} */}
                Test
              </Button>
            </div>
            {/* <LocationInputField location={tripQueryVariables.from} label="From" id="fromInputField" />
              <LocationInputField location={tripQueryVariables.to} label="To" id="toInputField" /> */}
          </div>
          {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
          <div className="flex flex-col h-full pb-6">
            {data?.lines
              .sort((a, b) => a?.name?.localeCompare(b.name))
              ?.map((line) => (
                <div
                  key={line.id}
                  className="flex flex-row items-center h-full w-full border-b py-3 px-3 hover:bg-gray-100 hover:cursor-pointer space-x-2"
                  onClick={() => onLineSelected(line)}
                >
                  <LegIcon leg={line} />
                  <span className="truncate">{line?.name}</span>
                </div>
              ))}
          </div>
          {/* <div className='fixed bottom-0 right-0 left-0 bg-white'>
              <ItineraryPaginationControl
                onPagination={pageResults}
                previousPageCursor={tripQueryResult?.trip.previousPageCursor}
                nextPageCursor={tripQueryResult?.trip.nextPageCursor}
                loading={loading}
              />
            </div> */}
        </div>
      </section>
    </div>
  );
};
