import { useTranslation } from 'react-i18next';
import { FiEye, FiMousePointer, FiLogIn, FiUserPlus, FiShoppingBag, FiActivity } from 'react-icons/fi';

const eventIcons = {
  page_view: FiEye,
  button_click: FiMousePointer,
  login: FiLogIn,
  register: FiUserPlus,
  order: FiShoppingBag,
  default: FiActivity,
};

const eventColors = {
  page_view: '#3B82F6',
  button_click: '#FF6B00',
  login: '#22C55E',
  register: '#A855F7',
  order: '#F59E0B',
  default: '#A0A0A0',
};

export default function RecentEvents({ events = [] }) {
  const { t } = useTranslation();

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
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>
        {t('admin.analytics.recentEvents')}
      </h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {events.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px', fontSize: '0.9rem' }}>
            {t('common.noResults')}
          </p>
        ) : (
          events.map((event, idx) => {
            const Icon = eventIcons[event.eventType] || eventIcons.default;
            const color = eventColors[event.eventType] || eventColors.default;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 0',
                  borderBottom: idx < events.length - 1 ? '1px solid #333333' : 'none',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {event.eventType || 'Event'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#666', flexShrink: 0 }}>
                      {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
                    {event.page && <span>Page: {event.page}</span>}
                    {event.buttonName && <span> | Button: {event.buttonName}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
