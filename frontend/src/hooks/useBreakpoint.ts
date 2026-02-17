import { useSyncExternalStore } from "react";
const screenQuery = {
  md: "min-width:768px",
  lg: "min-width:1024px",
  xl: "min-width:1280px",
} as const;
type screenQuerykeys = keyof typeof screenQuery;
export const useBreakpoint = (breakpoint: screenQuerykeys): boolean => {
  const subscribe = (callback: () => void) => {
    const query = window.matchMedia(`(${screenQuery[breakpoint]})`);
    query.addEventListener("change", callback);
    return () => {
      query.removeEventListener("change", callback);
    };
  };
  const snapshot = () => {
    return window.matchMedia(`(${screenQuery[breakpoint]})`).matches;
  };
  return useSyncExternalStore(subscribe, snapshot);
};
