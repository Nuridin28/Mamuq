import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';

export default function ProductGrid({ products, loading, total }) {
  const { t } = useTranslation();

  if (loading) {
    return <Loading text={t('common.loading')} />;
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <FiPackage size={48} color="#3A3A3A" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', color: '#A0A0A0', fontWeight: 500, marginBottom: '8px' }}>
          {t('common.noResults')}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {t('catalog.noResults')}
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      {total !== undefined && (
        <p style={{ fontSize: '0.9rem', color: '#A0A0A0', marginBottom: '20px' }}>
          {t('catalog.resultsCount', { count: total })}
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {products.map((product, index) => (
          <ProductCard key={product._id || product.id || index} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
