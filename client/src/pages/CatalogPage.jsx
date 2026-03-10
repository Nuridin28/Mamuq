import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FilterSidebar from '../components/catalog/FilterSidebar';
import ProductGrid from '../components/catalog/ProductGrid';
import api from '../utils/api';

export default function CatalogPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    categories: [],
    fastenerTypes: [],
    neckWidth: '',
    wheelchairFriendly: false,
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.categories.length) params.category = filters.categories.join(',');
      if (filters.fastenerTypes.length) params.fastenerType = filters.fastenerTypes.join(',');
      if (filters.neckWidth) params.neckWidth = filters.neckWidth;
      if (filters.wheelchairFriendly) params.wheelchairFriendly = true;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await api.get('/products', { params });
      const data = response.data;
      setProducts(data.products || data || []);
      setTotal(data.total || (data.products || data || []).length);
    } catch (err) {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '32px' }}
      >
        <p style={{ fontSize: '0.85rem', color: '#A0A0A0', marginBottom: '8px' }}>{t('catalog.breadcrumb')}</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF' }}>
          {t('catalog.title')}
        </h1>
      </motion.div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }} className="catalog-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} onApply={fetchProducts} />
        <ProductGrid products={products} loading={loading} total={total} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .catalog-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
