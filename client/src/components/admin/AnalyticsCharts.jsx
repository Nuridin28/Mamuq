import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#FF6B00', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7'];

const chartContainerStyle = {
  background: '#2A2A2A',
  borderRadius: '14px',
  padding: '24px',
  border: '1px solid #3A3A3A',
};

const chartTitleStyle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#FFFFFF',
  marginBottom: '20px',
};

const customTooltipStyle = {
  background: '#333333',
  border: '1px solid #3A3A3A',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#E0E0E0',
  fontSize: '0.85rem',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={customTooltipStyle}>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color }}>{item.name}: {item.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsCharts({ buttonClicks = [], pageViews = [], userLanguages = [], sessions = [] }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}
    >
      {/* Line: Buy Button Clicks */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>{t('admin.analytics.buttonClicks')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={buttonClicks}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
            <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} />
            <YAxis stroke="#A0A0A0" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="clicks" stroke="#FF6B00" strokeWidth={2} dot={{ fill: '#FF6B00', r: 3 }} activeDot={{ r: 5 }} name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar: Page Views */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>{t('admin.analytics.pageViews')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pageViews}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
            <XAxis dataKey="page" stroke="#A0A0A0" fontSize={12} />
            <YAxis stroke="#A0A0A0" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="views" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie: User Languages */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>{t('admin.analytics.userLanguages')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={userLanguages}
              dataKey="count"
              nameKey="language"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ language, percent }) => `${language} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#A0A0A0' }}
            >
              {userLanguages.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#A0A0A0', fontSize: '0.85rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Area: Sessions Over Time */}
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>{t('admin.analytics.sessions')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={sessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
            <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} />
            <YAxis stroke="#A0A0A0" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sessions" stroke="#FF6B00" fill="rgba(255, 107, 0, 0.15)" strokeWidth={2} name="Sessions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
