import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  maxPull?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  maxPull = 150,
}: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    let touchStartHandler: (e: TouchEvent) => void;
    let touchMoveHandler: (e: TouchEvent) => void;
    let touchEndHandler: () => void;

    // Only enable on touch devices
    if ('ontouchstart' in window) {
      touchStartHandler = (e: TouchEvent) => {
        // Only start pull if at the top of the page
        if (window.scrollY === 0 && !isRefreshing) {
          const touch = e.touches[0];
          startY.current = touch.clientY;
          setIsPulling(true);
        }
      };

      touchMoveHandler = (e: TouchEvent) => {
        if (!isPulling || isRefreshing) return;

        const touch = e.touches[0];
        currentY.current = touch.clientY;
        
        const distance = currentY.current - startY.current;
        
        if (distance > 0) {
          // Apply resistance factor and cap at maxPull
          const adjustedDistance = Math.min(
            distance / resistance,
            maxPull
          );
          
          setPullDistance(adjustedDistance);
          
          // Prevent page scroll while pulling
          if (adjustedDistance > 10) {
            e.preventDefault();
          }
        }
      };

      touchEndHandler = async () => {
        if (!isPulling || isRefreshing) return;

        setIsPulling(false);

        // If pulled beyond threshold, trigger refresh
        if (pullDistance > threshold) {
          setIsRefreshing(true);
          
          try {
            await onRefresh();
          } catch (error) {
            console.error('Refresh failed:', error);
          } finally {
            setIsRefreshing(false);
          }
        }

        // Reset pull distance with animation
        setPullDistance(0);
      };

      // Add event listeners
      document.addEventListener('touchstart', touchStartHandler, { passive: false });
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
      document.addEventListener('touchend', touchEndHandler);

      return () => {
        // Clean up event listeners
        document.removeEventListener('touchstart', touchStartHandler);
        document.removeEventListener('touchmove', touchMoveHandler);
        document.removeEventListener('touchend', touchEndHandler);
      };
    }
  }, [isPulling, isRefreshing, pullDistance, onRefresh, threshold, resistance, maxPull]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullPercentage: Math.min((pullDistance / threshold) * 100, 100),
  };
}