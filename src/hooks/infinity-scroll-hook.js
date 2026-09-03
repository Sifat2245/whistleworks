import { useState, useRef, useEffect, useCallback } from "react";

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
  const timeoutIdRef = useRef(null);

  const totalItemsRef = useRef(totalItems);
  totalItemsRef.current = totalItems;

  const visibleCountRef = useRef(visibleCount);
  visibleCountRef.current = visibleCount;

  const reset = useCallback(() => {
    setVisibleCount(itemsPerPage);
  }, [itemsPerPage]);

  const checkAndLoadMore = useCallback(() => {
    if (isLoadingMoreRef.current) return;
    if (visibleCountRef.current >= totalItemsRef.current) return;

    if (!loaderRef.current || !scrollContainerRef.current) return;

    const loaderRect = loaderRef.current.getBoundingClientRect();
    const containerRect = scrollContainerRef.current.getBoundingClientRect();

    // Check if loader element is within or touching the visible area of scroll container
    const isVisible =
      loaderRect.top <= containerRect.bottom + 50 &&
      loaderRect.bottom >= containerRect.top - 50;

    if (isVisible) {
      isLoadingMoreRef.current = true;
      setVisibleCount((prev) =>
        Math.min(prev + itemsPerPage, totalItemsRef.current)
      );

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        isLoadingMoreRef.current = false;
        checkAndLoadMore();
      }, 150);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    const loaderNode = loaderRef.current;
    const containerNode = scrollContainerRef.current;

    if (!loaderNode || !containerNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          checkAndLoadMore();
        }
      },
      {
        root: containerNode,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderNode);

    // Initial check in case loader is already visible
    checkAndLoadMore();

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      observer.disconnect();
    };
  }, [checkAndLoadMore, totalItems]);

  return {
    visibleCount,
    loaderRef,
    scrollContainerRef,
    reset,
  };
}
