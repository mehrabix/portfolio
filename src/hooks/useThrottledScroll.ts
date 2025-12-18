import { useEffect, useRef } from 'react';

export const useThrottledScroll = (callback: () => void, delay = 16) => {
  const lastRan = useRef(Date.now());
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => {
      if (Date.now() - lastRan.current >= delay) {
        callbackRef.current();
        lastRan.current = Date.now();
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [delay]);
};

