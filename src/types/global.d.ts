import { HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: HTMLAttributes<HTMLMarqueeElement> & {
        scrollAmount?: number;
        scrollDelay?: number;
        behavior?: 'scroll' | 'slide' | 'alternate';
        direction?: 'left' | 'right' | 'up' | 'down';
        loop?: number | 'infinite';
        width?: string | number;
        height?: string | number;
      };
    }
  }
}
