// Mobile Configuration and Optimizations for TaRL Pratham

export const mobileConfig = {
  // Touch target sizes (minimum 44px as per Apple guidelines)
  touchTargets: {
    button: 48,
    icon: 44,
    menuItem: 48,
    cardAction: 44,
  },

  // Font sizes optimized for mobile
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16, // Minimum to prevent zoom on iOS
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },

  // Spacing optimized for mobile
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },

  // Viewport breakpoints
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
  },

  // Khmer font configuration
  fonts: {
    khmer: {
      primary: '"Hanuman", "Khmer OS", sans-serif',
      fallback: '"Khmer OS", "Khmer Unicode", sans-serif',
    },
    latin: {
      primary: '"Inter", system-ui, sans-serif',
      mono: '"JetBrains Mono", Consolas, monospace',
    },
  },

  // Color palette optimized for mobile readability
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#1890ff',
      600: '#1570ff',
      700: '#1454e0',
    },
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      300: '#d1d5db',
      500: '#6b7280',
      700: '#374151',
      900: '#111827',
    },
  },

  // Animation durations
  animations: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
};

// Mobile-specific utility functions
export const mobileUtils = {
  // Check if device is mobile
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= mobileConfig.breakpoints.mobile;
  },

  // Check if device is iOS
  isIOS: () => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Check if device is Android
  isAndroid: () => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  },

  // Get safe area insets for iOS
  getSafeAreaInsets: () => ({
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  }),

  // Format date for Khmer context
  formatKhmerDate: (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('km-KH', options);
  },

  // Format numbers for Khmer context
  formatKhmerNumber: (num: number) => {
    return num.toLocaleString('km-KH');
  },

  // Haptic feedback for mobile interactions
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window === 'undefined') return;
    
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
      };
      navigator.vibrate(patterns[type]);
    }
  },

  // Prevent zoom on input focus (iOS)
  preventZoom: () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
  },

  // Show/hide loading spinner with Khmer text
  showLoading: (text = 'កំពុងផ្ទុក...') => {
    // This would integrate with your loading component
    console.log(`Loading: ${text}`);
  },
};

// Ant Design theme configuration for mobile
export const mobileTheme = {
  token: {
    fontFamily: mobileConfig.fonts.khmer.primary,
    fontSize: mobileConfig.fontSizes.base,
    borderRadius: 8,
    colorPrimary: mobileConfig.colors.primary[500],
    colorSuccess: mobileConfig.colors.success,
    colorWarning: mobileConfig.colors.warning,
    colorError: mobileConfig.colors.error,
    screenXS: mobileConfig.breakpoints.mobile,
    screenSM: mobileConfig.breakpoints.tablet,
    screenMD: mobileConfig.breakpoints.desktop,
  },
  components: {
    Button: {
      controlHeight: mobileConfig.touchTargets.button,
      fontSize: mobileConfig.fontSizes.base,
      borderRadius: 8,
    },
    Input: {
      controlHeight: mobileConfig.touchTargets.button,
      fontSize: mobileConfig.fontSizes.base,
      borderRadius: 8,
    },
    Select: {
      controlHeight: mobileConfig.touchTargets.button,
      fontSize: mobileConfig.fontSizes.base,
    },
    DatePicker: {
      controlHeight: mobileConfig.touchTargets.button,
    },
    Card: {
      borderRadius: 12,
      paddingLG: mobileConfig.spacing.lg,
    },
    Form: {
      itemMarginBottom: mobileConfig.spacing.lg,
    },
    Menu: {
      itemHeight: mobileConfig.touchTargets.menuItem,
      fontSize: mobileConfig.fontSizes.base,
    },
    Table: {
      cellPaddingBlock: mobileConfig.spacing.md,
      cellPaddingInline: mobileConfig.spacing.sm,
    },
  },
};

// Mobile gestures configuration
export const gestureConfig = {
  swipe: {
    threshold: 50,
    velocity: 0.3,
  },
  tap: {
    maxDuration: 300,
    maxMovement: 10,
  },
  longPress: {
    duration: 500,
  },
};

// Performance optimizations for mobile
export const performanceConfig = {
  // Image lazy loading
  lazyLoading: {
    rootMargin: '100px',
    threshold: 0.1,
  },

  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: ['5', '10', '20'],
  },

  // Cache settings
  cache: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxSize: 50, // Maximum number of cached items
  },
};

// Accessibility configurations for mobile
export const a11yConfig = {
  // ARIA labels in Khmer
  labels: {
    menu: 'ម៉ឺនុយ',
    search: 'ស្វែងរក',
    filter: 'ត្រង',
    close: 'បិទ',
    next: 'បន្ទាប់',
    previous: 'មុន',
    loading: 'កំពុងផ្ទុក',
    error: 'មានបញ្ហា',
  },

  // Focus management
  focus: {
    outline: '2px solid #1890ff',
    outlineOffset: '2px',
  },

  // Color contrast ratios
  contrast: {
    normal: 4.5,
    large: 3.0,
  },
};

export default {
  mobileConfig,
  mobileUtils,
  mobileTheme,
  gestureConfig,
  performanceConfig,
  a11yConfig,
};