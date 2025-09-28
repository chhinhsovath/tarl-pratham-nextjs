'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface TourContextType {
  startTour: (page?: string) => void;
  isTourActive: boolean;
  shouldShowTour: (page: string) => boolean;
  completedTours: string[];
  markTourCompleted: (tourKey: string) => void;
  resetAllTours: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: React.ReactNode;
}

export default function TourProvider({ children }: TourProviderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isTourActive, setIsTourActive] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  useEffect(() => {
    // Load completed tours from localStorage
    const completed = localStorage.getItem('tarl-completed-tours');
    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
  }, []);

  const startTour = (page?: string) => {
    if (!session?.user?.role) return;

    const currentPage = page || getCurrentPageFromPath(pathname);
    const tourKey = `${session.user.role}-${currentPage}`;

    setIsTourActive(true);

    // Broadcast tour start event
    window.dispatchEvent(new CustomEvent('startTour', {
      detail: { page: currentPage, role: session.user.role }
    }));
  };

  const shouldShowTour = (page: string): boolean => {
    if (!session?.user?.role) return false;

    const tourKey = `${session.user.role}-${page}`;
    return !completedTours.includes(tourKey);
  };

  const markTourCompleted = (tourKey: string) => {
    const newCompleted = [...completedTours, tourKey];
    setCompletedTours(newCompleted);
    localStorage.setItem('tarl-completed-tours', JSON.stringify(newCompleted));
    setIsTourActive(false);
  };

  const resetAllTours = () => {
    localStorage.removeItem('tarl-completed-tours');
    setCompletedTours([]);
    setIsTourActive(false);
  };

  const getCurrentPageFromPath = (path: string): string => {
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/assessments')) return 'assessments';
    if (path.includes('/students')) return 'students';
    if (path.includes('/mentoring')) return 'mentoring';
    if (path.includes('/users')) return 'admin';
    if (path.includes('/coordinator')) return 'coordinator';
    return 'navigation';
  };

  const value = {
    startTour,
    isTourActive,
    shouldShowTour,
    completedTours,
    markTourCompleted,
    resetAllTours,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}