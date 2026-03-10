import { useAnalyticsContext } from '../context/AnalyticsContext';

export function useAnalytics() {
  const context = useAnalyticsContext();
  if (!context) {
    return {
      trackEvent: () => {},
      trackButtonClick: () => {},
    };
  }
  return {
    trackEvent: context.trackEvent,
    trackButtonClick: context.trackButtonClick,
  };
}

export default useAnalytics;
