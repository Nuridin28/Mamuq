import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const AnalyticsContext = createContext(null);

function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

export function AnalyticsProvider({ children }) {
  const [sessionId] = useState(() => {
    let sid = sessionStorage.getItem('analyticsSessionId');
    if (!sid) {
      sid = generateSessionId();
      sessionStorage.setItem('analyticsSessionId', sid);
    }
    return sid;
  });

  const wsRef = useRef(null);
  const location = useLocation();

  const trackEvent = useCallback(
    async (eventType, data = {}) => {
      try {
        await api.post('/analytics/event', {
          sessionId,
          eventType,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          ...data,
        });
      } catch (err) {
        // Silently fail analytics
      }
    },
    [sessionId]
  );

  const trackButtonClick = useCallback(
    (buttonName, page) => {
      trackEvent('button_click', {
        buttonName,
        page: page || window.location.pathname,
      });
    },
    [trackEvent]
  );

  // Track page views on route change
  useEffect(() => {
    trackEvent('page_view', { page: location.pathname });
  }, [location.pathname, trackEvent]);

  // WebSocket connection
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    let wsUrl;
    if (apiUrl) {
      const url = new URL(apiUrl);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${url.host}/ws`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${window.location.host}/ws`;
    }

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'session_start', sessionId }));
      };

      ws.onclose = () => {
        // Connection closed
      };

      ws.onerror = () => {
        // WebSocket error - silently handle
      };
    } catch (err) {
      // WebSocket not available
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'session_end', sessionId }));
        wsRef.current.close();
      }
    };
  }, [sessionId]);

  const value = { sessionId, trackEvent, trackButtonClick };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}

export default AnalyticsContext;
