import { useEffect, useRef } from 'react';

export const useThrottledMouseMove = (
  callback: (x: number, y: number) => void,
  delay = 16
) => {
  const lastRan = useRef(Date.now());
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (Date.now() - lastRan.current >= delay) {
        callbackRef.current(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
        lastRan.current = Date.now();
      }
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [delay]);
};

