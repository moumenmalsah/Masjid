import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint: number = 768): boolean {
  const [isAbove, setIsAbove] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsAbove(window.innerWidth >= breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isAbove;
}
