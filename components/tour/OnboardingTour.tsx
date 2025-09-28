'use client';

import React, { useState, useEffect } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { Button, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getTourSteps,
  getDashboardTourSteps,
  getReportsTourSteps,
  getAssessmentsTourSteps,
  tourTexts,
  TourStep
} from '@/lib/tour/tourSteps';

interface OnboardingTourProps {
  page?: 'navigation' | 'dashboard' | 'reports' | 'assessments' | 'students' | 'mentoring';
  autoStart?: boolean;
  showStartButton?: boolean;
}

// Convert our TourStep format to @reactour/tour format
const convertSteps = (steps: TourStep[]) => {
  return steps.map(step => ({
    selector: step.target || 'body',
    content: (
      <div className="font-khmer" style={{ minWidth: '280px' }}>
        {step.title && <h4 className="text-lg font-semibold mb-3">{step.title}</h4>}
        <p className="text-sm leading-relaxed">{step.content}</p>
      </div>
    ),
    position: step.placement || 'bottom',
    action: step.target === 'body' ? undefined : (elem: any) => {
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }));
};

function TourContent({ page, autoStart, showStartButton }: OnboardingTourProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<'km' | 'en'>('km');
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { setIsOpen, isOpen, setSteps } = useTour();

  useEffect(() => {
    // Load completed tours and language from localStorage
    const completed = localStorage.getItem('tarl-completed-tours');
    const langSetting = localStorage.getItem('tarl-tour-language');
    const lastVisit = localStorage.getItem('tarl-last-tour-prompt');
    const skipCount = localStorage.getItem('tarl-tour-skip-count');

    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
    if (langSetting) {
      setLanguage(langSetting as 'km' | 'en');
    }

    // Smart tour display logic
    if (autoStart && session?.user?.role) {
      const tourKey = `${session.user.role}-${page}`;
      const hasCompletedTour = completed ? JSON.parse(completed).includes(tourKey) : false;

      // Don't show if already completed
      if (hasCompletedTour) return;

      // Check if this is truly first visit (no last visit recorded)
      const isFirstVisit = !lastVisit;

      // Check if enough time has passed since last prompt (24 hours)
      const hoursSinceLastPrompt = lastVisit ?
        (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60) : Infinity;

      // Check skip count (don't show if skipped more than 3 times)
      const skips = skipCount ? parseInt(skipCount) : 0;

      // Show tour only if:
      // 1. First visit ever, OR
      // 2. More than 24 hours since last prompt AND less than 3 skips
      if (isFirstVisit || (hoursSinceLastPrompt > 24 && skips < 3)) {
        setTimeout(() => {
          startTour();
          localStorage.setItem('tarl-last-tour-prompt', Date.now().toString());
        }, 2000); // Increased delay for better UX
      }
    }
  }, [session, page, autoStart]);

  const getStepsForPage = (currentPage: string, role: string, lang: 'km' | 'en') => {
    switch (currentPage) {
      case 'dashboard':
        return getDashboardTourSteps(role, lang);
      case 'reports':
        return getReportsTourSteps(lang);
      case 'assessments':
        return getAssessmentsTourSteps(lang);
      case 'navigation':
      default:
        return getTourSteps(role, lang);
    }
  };

  const startTour = () => {
    if (!session?.user?.role) {
      message.warning('សូមចូលប្រើប្រាស់ជាមុនសិន');
      return;
    }

    const steps = getStepsForPage(page || 'navigation', session.user.role, language);
    const convertedSteps = convertSteps(steps);

    setSteps(convertedSteps);
    setIsOpen(true);
  };

  const handleTourClose = (completed: boolean = false) => {
    setIsOpen(false);

    if (completed && session?.user?.role) {
      // Mark tour as completed
      const tourKey = `${session.user.role}-${page}`;
      const newCompleted = [...completedTours, tourKey];
      setCompletedTours(newCompleted);
      localStorage.setItem('tarl-completed-tours', JSON.stringify(newCompleted));

      // Reset skip count on completion
      localStorage.removeItem('tarl-tour-skip-count');

      message.success(language === 'km' ? 'បានបញ្ចប់ការណែនាំដោយជោគជ័យ!' : 'Tour completed successfully!');
    } else {
      // Track skip count when closed without completing
      const currentSkips = localStorage.getItem('tarl-tour-skip-count');
      const skips = currentSkips ? parseInt(currentSkips) + 1 : 1;
      localStorage.setItem('tarl-tour-skip-count', skips.toString());

      // Don't show again for 7 days if skipped 2+ times
      if (skips >= 2) {
        const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
        localStorage.setItem('tarl-last-tour-prompt', sevenDaysFromNow.toString());
        message.info(language === 'km' ? 'ការណែនាំនឹងមិនបង្ហាញម្តងទៀតរយៈពេល 7 ថ្ងៃ' : 'Tour will not show again for 7 days');
      }
    }
  };

  const resetAllTours = () => {
    localStorage.removeItem('tarl-completed-tours');
    setCompletedTours([]);
    message.success(language === 'km' ? 'បានកំណត់ការណែនាំឡើងវិញ' : 'Tours reset successfully');
  };

  // Listen for tour completion event
  useEffect(() => {
    const handleTourCompleted = (e: CustomEvent) => {
      if (e.detail?.completed) {
        handleTourClose(true);
      }
    };

    window.addEventListener('tourCompleted' as any, handleTourCompleted);
    return () => {
      window.removeEventListener('tourCompleted' as any, handleTourCompleted);
    };
  }, [session, page, language]);

  // Handle tour close when X button is clicked
  useEffect(() => {
    if (!isOpen && typeof localStorage !== 'undefined') {
      // Check if tour was closed without completion
      const tourKey = `${session?.user?.role}-${page}`;
      const completed = localStorage.getItem('tarl-completed-tours');
      const hasCompleted = completed ? JSON.parse(completed).includes(tourKey) : false;

      // If tour was open but now closed and not completed, treat as skip
      if (!hasCompleted) {
        const wasOpen = localStorage.getItem('tarl-tour-was-open');
        if (wasOpen === 'true') {
          handleTourClose(false);
          localStorage.removeItem('tarl-tour-was-open');
        }
      }
    } else if (isOpen) {
      localStorage.setItem('tarl-tour-was-open', 'true');
    }
  }, [isOpen]);

  const texts = tourTexts[language];

  if (!session?.user) {
    return null;
  }

  return (
    <>
      {showStartButton && (
        <div className="fixed bottom-6 right-6 z-50 space-y-2">
          <Button
            type="primary"
            onClick={startTour}
            className="shadow-lg hover:shadow-xl transition-shadow font-khmer"
            size="large"
          >
            {language === 'km' ? '🎯 ការណែនាំប្រព័ន្ធ' : '🎯 Start Tour'}
          </Button>

          {/* Language Toggle */}
          <Button
            onClick={() => {
              const newLang = language === 'km' ? 'en' : 'km';
              setLanguage(newLang);
              localStorage.setItem('tarl-tour-language', newLang);
            }}
            className="shadow-lg hover:shadow-xl transition-shadow font-khmer block w-full"
            size="small"
          >
            {language === 'km' ? 'EN' : 'ខ្មែរ'}
          </Button>

          {/* Reset Tours (Dev Helper) */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              onClick={resetAllTours}
              className="shadow-lg hover:shadow-xl transition-shadow font-khmer block w-full"
              size="small"
              danger
            >
              🔄 Reset Tours
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default function OnboardingTour(props: OnboardingTourProps) {
  const { data: session } = useSession();
  const [tourCompleted, setTourCompleted] = useState(false);

  if (!session?.user) {
    return null;
  }

  // Tour configuration
  const tourConfig = {
    steps: [],
    onRequestClose: () => {
      // Will be handled by TourContent
    },
    styles: {
      popover: (base: any) => ({
        ...base,
        borderRadius: '12px',
        padding: 0,
        fontFamily: '"Hanuman", "Khmer OS", sans-serif',
      }),
      maskArea: (base: any) => ({
        ...base,
        rx: 8,
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: '#1890ff',
      }),
      controls: (base: any) => ({
        ...base,
        padding: '16px 20px',
        borderTop: '1px solid #f0f0f0',
      }),
      content: (base: any) => ({
        ...base,
        padding: '28px 32px', // Increased padding for better text clarity
        fontSize: '14px',
        lineHeight: '1.8', // Slightly increased line height
      }),
    },
    className: 'tour-popover',
    padding: 10,
    disableInteraction: false,
    disableDotsNavigation: false,
    showPrevNextButtons: true,
    showCloseButton: true,
    showNavigation: true,
    nextButton: ({
      currentStep,
      stepsLength,
      setIsOpen,
      setCurrentStep,
    }: any) => {
      const isLast = currentStep === stepsLength - 1;
      return (
        <Button
          type="primary"
          onClick={() => {
            if (isLast) {
              // Mark tour as completed before closing
              const event = new CustomEvent('tourCompleted', { detail: { completed: true } });
              window.dispatchEvent(event);
              setIsOpen(false);
            } else {
              setCurrentStep((s: number) => s + 1);
            }
          }}
          className="font-khmer"
        >
          {isLast ? 'បញ្ចប់' : 'បន្ទាប់'}
        </Button>
      );
    },
    prevButton: ({ currentStep, setCurrentStep }: any) => {
      return currentStep > 0 ? (
        <Button
          onClick={() => setCurrentStep((s: number) => s - 1)}
          className="font-khmer mr-2"
        >
          ត្រលប់
        </Button>
      ) : null;
    },
  };

  return (
    <TourProvider {...tourConfig}>
      <TourContent {...props} />

      {/* Custom styles for mobile responsiveness */}
      <style jsx global>{`
        .tour-popover {
          max-width: 90vw !important;
        }

        @media (max-width: 768px) {
          .tour-popover {
            max-width: 95vw !important;
            margin: 10px !important;
          }

          .tour-popover div {
            font-size: 13px !important;
          }

          .tour-popover h4 {
            font-size: 16px !important;
          }
        }

        /* Ensure tours work with our mobile layout */
        [data-tour-elem="mask"] {
          z-index: 9999 !important;
        }

        [data-tour-elem="popover"] {
          z-index: 10000 !important;
        }

        [data-tour-elem="badge"] {
          z-index: 10001 !important;
        }
      `}</style>
    </TourProvider>
  );
}