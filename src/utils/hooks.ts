import { useEffect, useState } from 'react';
import { AccessibilityInfo, useWindowDimensions } from 'react-native';

import { layout } from '../theme/tokens';

/** Three-tier layout: phone, tablet/small laptop, wide. */
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMd: width >= layout.breakpoints.md,
    isLg: width >= layout.breakpoints.lg,
  };
}

/** Honour the OS "reduce motion" setting: when on, entrances render in their final state. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => mounted && setReduced(value))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
