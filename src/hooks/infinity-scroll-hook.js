import { useEffect, useRef, useState } from "react";

/**
 * useInfiniteScroll
 *
 * @param {number} totalItems - total items count
 * @param {number} itemsPerPage - items per load (default: 10)
 *
 * @returns {
 *  visibleCount,
 *  loaderRef,
 *  scrollContainerRef,
 *  reset
 * }
 */
export default function useInfiniteScroll(totalItems, itemsPerPage = 10) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const loaderRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  // Note: Reset helper
  const reset = () => {
    setVisibleCount(itemsPerPage);
  };

  useEffect(() => {
    if (!loaderRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          visibleCount < totalItems &&
          !isLoadingMoreRef.current
        ) {
          isLoadingMoreRef.current = true;

          setVisibleCount((prev) => prev + itemsPerPage);

          // small delay to prevent double trigger
          setTimeout(() => {
            isLoadingMoreRef.current = false;
          }, 150);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [totalItems, visibleCount, itemsPerPage]);

  return {
    visibleCount,
    loaderRef,
    scrollContainerRef,
    reset,
  };
}
