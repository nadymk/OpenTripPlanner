import { FC, HTMLProps } from 'react';
import { COORDINATE_PRECISION } from '../SearchBar/constants';
import { Location } from '../../gql/graphql';
import { cn } from '../../util/cn';

type InputProps = HTMLProps<HTMLInputElement>;

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return <input type="text" className={cn('border rounded-md px-2 py-2 text-sm', className)} {...props} />;
};

export const LocationInput: FC<Omit<InputProps, 'value'> & { value: Location }> = ({ value, ...props }) => {
  return (
    <Input
      {...props}
      value={
        value.coordinates
          ? `${value.coordinates?.latitude.toPrecision(
              COORDINATE_PRECISION,
            )} ${value.coordinates?.longitude.toPrecision(COORDINATE_PRECISION)}`
          : ''
      }
    />
  );
};
