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
      <div className="font-khmer">
        {step.title && <h4 className="text-lg font-semibold mb-2">{step.title}</h4>}
        <p className="text-sm">{step.content}</p>
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

  const { setIsOpen, isOpen, setSteps } = useTour();

  useEffect(() => {
    // Load completed tours and language from localStorage
    const completed = localStorage.getItem('tarl-completed-tours');
    const langSetting = localStorage.getItem('tarl-tour-language');

    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
    if (langSetting) {
      setLanguage(langSetting as 'km' | 'en');
    }

    // Auto-start tour for first-time users
    if (autoStart && session?.user?.role) {
      const tourKey = `${session.user.role}-${page}`;
      const hasCompletedTour = completed ? JSON.parse(completed).includes(tourKey) : false;

      if (!hasCompletedTour) {
        setTimeout(() => {
          startTour();
        }, 1000);
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

  const handleTourClose = () => {
    setIsOpen(false);

    // Mark tour as completed
    if (session?.user?.role) {
      const tourKey = `${session.user.role}-${page}`;
      const newCompleted = [...completedTours, tourKey];
      setCompletedTours(newCompleted);
      localStorage.setItem('tarl-completed-tours', JSON.stringify(newCompleted));
      message.success(language === 'km' ? 'បានបញ្ចប់ការណែនាំដោយជោគជ័យ!' : 'Tour completed successfully!');
    }
  };

  const resetAllTours = () => {
    localStorage.removeItem('tarl-completed-tours');
    setCompletedTours([]);
    message.success(language === 'km' ? 'បានកំណត់ការណែនាំឡើងវិញ' : 'Tours reset successfully');
  };

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

  if (!session?.user) {
    return null;
  }

  // Tour configuration
  const tourConfig = {
    steps: [],
    onRequestClose: () => {},
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
        padding: '20px',
        fontSize: '14px',
        lineHeight: '1.6',
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