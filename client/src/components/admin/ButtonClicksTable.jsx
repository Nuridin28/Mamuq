import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function ButtonClicksTable({ data = [] }) {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState('count');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (typeof aVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #3A3A3A',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '12px 16px',
    fontSize: '0.9rem',
    color: '#E0E0E0',
    borderBottom: '1px solid #2A2A2A',
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <FiArrowUp size={12} style={{ marginLeft: '4px' }} /> : <FiArrowDown size={12} style={{ marginLeft: '4px' }} />;
  };

  return (
    <div
      style={{
        background: '#2A2A2A',
        borderRadius: '14px',
        border: '1px solid #3A3A3A',
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', padding: '24px 24px 16px' }}>
        {t('admin.analytics.buttonClicksTable')}
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1A1A1A' }}>
              <th style={thStyle} onClick={() => handleSort('buttonName')}>
                Button Name <SortIcon field="buttonName" />
              </th>
              <th style={thStyle} onClick={() => handleSort('count')}>
                Click Count <SortIcon field="count" />
              </th>
              <th style={thStyle} onClick={() => handleSort('lastClicked')}>
                Last Clicked <SortIcon field="lastClicked" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#666', padding: '30px' }}>
                  {t('common.noResults')}
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <tr
                  key={idx}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={tdStyle}>
                    <span style={{
                      background: 'rgba(255, 107, 0, 0.12)',
                      color: '#FF6B00',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}>
                      {row.buttonName}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: '#FFFFFF' }}>{row.count}</td>
                  <td style={{ ...tdStyle, color: '#A0A0A0' }}>
                    {row.lastClicked ? new Date(row.lastClicked).toLocaleString() : '--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
