import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiWifi } from 'react-icons/fi';

export default function OnlineUsers({ initialCount = 0 }) {
  const { t } = useTranslation();
  const [onlineCount, setOnlineCount] = useState(initialCount);
  const [sessions, setSessions] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    setOnlineCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'online_count') {
            setOnlineCount(data.count);
          }
          if (data.type === 'active_sessions') {
            setSessions(data.sessions || []);
          }
        } catch (e) {
          // Parse error
        }
      };

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'get_online_count' }));
      };
    } catch (err) {
      // WebSocket unavailable
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div
      style={{
        background: '#2A2A2A',
        borderRadius: '14px',
        padding: '24px',
        border: '1px solid #3A3A3A',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FiWifi size={18} />
        {t('admin.analytics.onlineUsers')}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }}
        />
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{onlineCount}</span>
        <span style={{ fontSize: '0.9rem', color: '#A0A0A0' }}>{t('admin.stats.onlineNow')}</span>
      </div>

      {sessions.length > 0 && (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {sessions.map((session, idx) => (
            <div
              key={session.id || idx}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: idx < sessions.length - 1 ? '1px solid #3A3A3A' : 'none',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#E0E0E0' }}>{session.id || `Session ${idx + 1}`}</span>
              <span style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>{session.startedAt ? new Date(session.startedAt).toLocaleTimeString() : '--'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
