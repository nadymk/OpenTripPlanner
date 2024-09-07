import { FC, HTMLProps } from 'react';
import { cn } from '../../util/cn';
import { IoMdArrowBack } from 'react-icons/io';
import { GoogleMapsIcon } from '../icons/GoogleMapsIcon';
import { cva, VariantProps } from 'class-variance-authority';

const button = cva('text-xs py-0.5 px-2 rounded-md text-black hover:bg-gray-300/30 disabled:cursor-forbidden', {
  variants: {
    variant: {
      outline: 'border bg-none',
      primary: ['text-black', 'border-transparent'],
      // **or**
      // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: ['bg-white', 'text-gray-800', 'border-gray-400', 'hover:bg-gray-100'],
    },
    size: {
      xs: "text-xs py-0.5 px-2",
      sm: "text-xs py-0.5 px-2",
      md: ['text-base', 'py-2', 'px-4'],
    },
  },
  // compoundVariants: [
  //   {
  //     intent: 'primary',
  //     size: 'medium',
  //     class: 'uppercase',
  //     // **or** if you're a React.js user, `className` may feel more consistent:
  //     // className: "uppercase"
  //   },
  // ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type BaseButtonProps = HTMLProps<HTMLButtonElement> & VariantProps<typeof button>;

export const Button: FC<BaseButtonProps> = ({ className, size, variant, ...props }) => {
  return (
    <button className={cn(button({ size, variant }), className)} {...props}/>
  );
};

export const RoundButton: FC<BaseButtonProps> = ({ className, children, ...props }) => {
  return (
    <Button
      className={cn('text-xs py-0.5 px-2 h-[32px] w-[32px] rounded-full text-black hover:bg-gray-300/30', className)}
      {...props}
    >
      {children}
    </Button>
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
    >
      <GoogleMapsIcon />
    </a>
  );
};

export const LinkButton: FC<BaseButtonProps> = ({ className, ...props }) => {
  return (
    <a
      className={cn(
        'flex border rounded-full h-[32px] w-[32px] text-xs hover:bg-gray-300/30 items-center justify-center',
        className,
      )}
      {...props}
    />
  );
};
