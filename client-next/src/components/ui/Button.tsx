import { FC, HTMLProps } from 'react';
import { cn } from '../../util/cn';
import { IoMdArrowBack } from 'react-icons/io';
import { GoogleMapsIcon } from '../icons/GoogleMapsIcon';

type BaseButtonProps = HTMLProps<HTMLButtonElement>;

export const RoundButton: FC<BaseButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn('text-xs py-0.5 px-2 h-[32px] w-[32px] rounded-full text-black hover:bg-gray-300/30', className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const BackButton: FC<BaseButtonProps> = ({ className, ...props }) => {
  return (
    <RoundButton {...props}>
      <IoMdArrowBack className="h-[16px] w-[16px]" />
    </RoundButton>
  );
};

export const GoogleMapsLinkButton = ({ view }) => {
  const to = `${view.legs?.[0]?.toPlace?.latitude},+${view.legs?.[0]?.toPlace?.longitude}`;
  const dest = `${view.legs?.[view.legs.length - 1]?.toPlace?.latitude},+${view.legs?.[view.legs.length - 1]?.toPlace?.longitude}`;

  return (
    <a
      target="_blank"
      href={`https://www.google.com/maps/dir/${dest}/${to}/&dirflg=r`}
      className="flex border rounded-full h-[32px] w-[32px] text-xs hover:bg-gray-300/30 items-center justify-center"
      onClick={() => {
        console.log(view);
      }}
    >
      <GoogleMapsIcon />
    </a>
  );
};
