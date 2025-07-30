"use client";
import { useEffect, useRef, useState } from "react";
interface UseInViewOptions {
  threshold?: number; // how much of element should be visible (0.1 = 10%)
  rootMargin?: string; // start loading before element is fully visible
  triggerOnce?: boolean; // only trigger once, or every time it comes into view
}
export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = "100px", triggerOnce = true } = options;

  const [inView, setInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // check if element is intersecting AKA visible
        if (entry.isIntersecting) {
          setInView(true);

          if (triggerOnce) {
            setHasTriggered(true);
            observer.unobserve(element); // stop watching after first trigger
          }
        } else {
          if (!triggerOnce) {
            setInView(false); // reset if we want to trigger multiple times
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return {
    ref,
    inView, // true when element is visible
    hasTriggered,
  };
}
