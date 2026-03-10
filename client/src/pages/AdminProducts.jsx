import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import api from '../utils/api';

const defaultForm = {
  nameEn: '', nameRu: '', nameKz: '',
  descriptionEn: '', descriptionRu: '', descriptionKz: '',
  price: '', category: 'shirts', fastenerType: 'buttons',
  neckWidth: 'standard', wheelchairFriendly: false, softSeams: false,
  image: '', inStock: true,
};

export default function AdminProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || response.data || []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ ...defaultForm });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      nameEn: product.name?.en || '',
      nameRu: product.name?.ru || '',
      nameKz: product.name?.kz || '',
      descriptionEn: product.description?.en || '',
      descriptionRu: product.description?.ru || '',
      descriptionKz: product.description?.kz || '',
      price: product.price || '',
      category: product.category || 'shirts',
      fastenerType: product.fastenerType || 'buttons',
      neckWidth: product.neckWidth || 'standard',
      wheelchairFriendly: product.wheelchairFriendly || false,
      softSeams: product.softSeams || false,
      image: product.image || '',
      inStock: product.inStock !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: { en: form.nameEn, ru: form.nameRu, kz: form.nameKz },
      description: { en: form.descriptionEn, ru: form.descriptionRu, kz: form.descriptionKz },
      price: parseFloat(form.price) || 0,
      category: form.category,
      fastenerType: form.fastenerType,
      neckWidth: form.neckWidth,
      wheelchairFriendly: form.wheelchairFriendly,
      softSeams: form.softSeams,
      image: form.image,
      inStock: form.inStock,
    };
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id || editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      // Error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      // Error
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#1A1A1A', border: '1px solid #3A3A3A',
    borderRadius: '8px', color: '#E0E0E0', fontSize: '0.9rem', outline: 'none', fontFamily: "'Inter', sans-serif",
  };

  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600,
    color: '#A0A0A0', borderBottom: '1px solid #3A3A3A', textTransform: 'uppercase',
  };

  const tdStyle = {
    padding: '14px 16px', fontSize: '0.9rem', color: '#E0E0E0', borderBottom: '1px solid #2A2A2A',
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <aside
        style={{ width: '240px', background: '#111111', borderRight: '1px solid #2A2A2A', padding: '30px 16px', flexShrink: 0 }}
        className="admin-sidebar"
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', padding: '0 12px', marginBottom: '24px' }}>
          {t('admin.title')}
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#A0A0A0', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('admin.sidebar.dashboard')}
          </Link>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#FF6B00', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, background: 'rgba(255,107,0,0.1)' }}>
            <FiPackage size={18} /> {t('admin.sidebar.products')}
          </Link>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#A0A0A0', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('admin.sidebar.orders')}
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
              {t('admin.products.title')}
            </h1>
            <Button variant="primary" icon={FiPlus} onClick={openAdd} trackName="admin_add_product">
              {t('admin.products.addProduct')}
            </Button>
          </div>

          <div style={{ background: '#2A2A2A', borderRadius: '14px', border: '1px solid #3A3A3A', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1A1A1A' }}>
                    <th style={thStyle}>{t('admin.products.name')}</th>
                    <th style={thStyle}>{t('admin.products.category')}</th>
                    <th style={thStyle}>{t('admin.products.price')}</th>
                    <th style={thStyle}>{t('admin.products.inStock')}</th>
                    <th style={thStyle}>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#666', padding: '30px' }}>{t('common.noResults')}</td></tr>
                  ) : products.map((product) => (
                    <tr
                      key={product._id || product.id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={tdStyle}>{product.name?.en || product.name || '--'}</td>
                      <td style={tdStyle}>{product.category || '--'}</td>
                      <td style={{ ...tdStyle, color: '#FF6B00', fontWeight: 600 }}>${product.price?.toFixed(2) || '0.00'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500,
                          background: product.inStock !== false ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                          color: product.inStock !== false ? '#22C55E' : '#EF4444',
                        }}>
                          {product.inStock !== false ? t('common.yes') : t('common.no')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEdit(product)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', padding: '4px' }}>
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteConfirm(product._id || product.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Product Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? t('admin.products.editProduct') : t('admin.products.addProduct')}
        maxWidth="550px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input id="nameEn" label={t('admin.products.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
          <Input id="nameRu" label={t('admin.products.nameRu')} value={form.nameRu} onChange={(e) => setForm({ ...form, nameRu: e.target.value })} />
          <Input id="nameKz" label={t('admin.products.nameKz')} value={form.nameKz} onChange={(e) => setForm({ ...form, nameKz: e.target.value })} />
          <div>
            <label style={{ fontSize: '0.9rem', color: '#E0E0E0', display: 'block', marginBottom: '6px' }}>{t('admin.products.descriptionEn')}</label>
            <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: '#E0E0E0', display: 'block', marginBottom: '6px' }}>{t('admin.products.descriptionRu')}</label>
            <textarea value={form.descriptionRu} onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: '#E0E0E0', display: 'block', marginBottom: '6px' }}>{t('admin.products.descriptionKz')}</label>
            <textarea value={form.descriptionKz} onChange={(e) => setForm({ ...form, descriptionKz: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <Input id="price" label={t('admin.products.price')} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <div>
            <label style={{ fontSize: '0.9rem', color: '#E0E0E0', display: 'block', marginBottom: '6px' }}>{t('admin.products.category')}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {['shirts', 'pants', 'outerwear', 'underwear', 'accessories', 'dresses'].map((c) => (
                <option key={c} value={c}>{t(`catalog.categories.${c}`)}</option>
              ))}
            </select>
          </div>
          <Input id="image" label={t('admin.products.image')} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#E0E0E0' }}>
              <input type="checkbox" checked={form.wheelchairFriendly} onChange={(e) => setForm({ ...form, wheelchairFriendly: e.target.checked })} />
              {t('catalog.wheelchairFriendly')}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#E0E0E0' }}>
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
              {t('admin.products.inStock')}
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title={t('admin.products.deleteProduct')}>
        <p style={{ color: '#A0A0A0', marginBottom: '24px' }}>{t('admin.products.deleteConfirm')}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>{t('common.delete')}</Button>
        </div>
      </Modal>

      <style>{`@media (max-width: 768px) { .admin-sidebar { display: none; } }`}</style>
    </div>
  );
}
