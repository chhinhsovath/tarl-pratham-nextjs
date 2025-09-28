'use client';

import React from 'react';

interface TourTargetProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component to add tour targeting to any element
 * Usage: <TourTarget id="dashboard-stats">...</TourTarget>
 */
export default function TourTarget({ id, children, className = '' }: TourTargetProps) {
  return (
    <div data-tour-target={id} className={className}>
      {children}
    </div>
  );
}

/**
 * Higher-order component to add tour targeting
 * Usage: const TourButton = withTourTarget(Button, 'create-assessment');
 */
export function withTourTarget<P extends object>(
  Component: React.ComponentType<P>,
  tourId: string
) {
  const TourWrappedComponent = (props: P) => {
    return (
      <TourTarget id={tourId}>
        <Component {...props} />
      </TourTarget>
    );
  };

  TourWrappedComponent.displayName = `withTourTarget(${Component.displayName || Component.name})`;
  return TourWrappedComponent;
}

/**
 * Hook to get tour target selector
 */
export const useTourSelector = (id: string) => {
  return `[data-tour-target="${id}"]`;
};