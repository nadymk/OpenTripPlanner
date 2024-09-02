import { useEffect, useRef, useState } from 'react';

export const useScrollPosition = (initial: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() => {
    return initial ?? 0;
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scroll({ top: position });

    const listener = (e) => setPosition(e.target.scrollTop);

    ref.current.addEventListener('scroll', listener);
    return () => ref.current?.removeEventListener('scroll', listener);
  }, [ref.current]);

  return {
    ref,
    position,
  };
};
