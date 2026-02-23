'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  ToggleLeft,
  ToggleRight,
  Star,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { cn, formatPrice, getTempLabel } from '@/lib/utils';
import type { Category, MenuItem, DrinkTemp } from '@/types';
import { categories as categoryData } from '@/data/menu-data';
import { addMenuItem, deleteMenuItem, getCategories, getMenuItems, updateMenuItem } from '@/lib/firestore';
import { storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'sonner';

const fallbackCategories: Category[] = [
  { ...categoryData[0], id: 'milk-tea' },
  { ...categoryData[1], id: 'coffee' },
  { ...categoryData[2], id: 'italian-soda' },
  { ...categoryData[3], id: 'other' },
  { ...categoryData[4], id: 'matcha' },
];

interface EditState {
  id?: string;
  name_en: string;
  name_th: string;
  categoryId: string;
  available: boolean;
  popular: boolean;
  order: number;
  prices: Partial<Record<DrinkTemp, number>>;
  singlePrice?: number;
  image?: string;
}

const emptyForm: EditState = {
  name_en: '',
  name_th: '',
  categoryId: 'milk-tea',
  available: true,
  popular: false,
  order: 1,
  prices: {},
  singlePrice: undefined,
  image: '',
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [activeCategory, setActiveCategory] = useState('milk-tea');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<EditState>(emptyForm);

  useEffect(() => {
    async function load() {
      try {
        const [cats, menuItems] = await Promise.all([getCategories(), getMenuItems()]);
        if (cats.length > 0) setCategories(cats);
        setItems(menuItems);
      } catch (error) {
        console.error('Load menu error:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeCat = useMemo(
    () => categories.find((c) => c.id === activeCategory) || categories[0],
    [activeCategory, categories]
  );

  const filtered = items
    .filter((i) => i.categoryId === activeCategory)
    .filter(
      (i) =>
        !searchQuery ||
        i.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.name_th.includes(searchQuery)
    );

  const startCreate = () => {
    setForm({ ...emptyForm, categoryId: activeCategory });
    setIsModalOpen(true);
  };

  const startEdit = (item: MenuItem) => {
    setForm({
      id: item.id,
      name_en: item.name_en,
      name_th: item.name_th,
      categoryId: item.categoryId,
      available: item.available,
      popular: Boolean(item.popular),
      order: item.order,
      prices: item.prices || {},
      singlePrice: item.singlePrice,
      image: item.image || '',
    });
    setIsModalOpen(true);
  };

  const toggleAvailability = async (item: MenuItem) => {
    const next = !item.available;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: next } : i)));
    try {
      await updateMenuItem(item.id, { available: next });
    } catch (error) {
      console.error('Update availability error:', error);
      toast.error('Failed to update item');
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: item.available } : i)));
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name_en}"?`)) return;
    const prev = items;
    setItems((current) => current.filter((i) => i.id !== item.id));
    try {
      await deleteMenuItem(item.id);
      toast.success('Item deleted');
    } catch (error) {
      console.error('Delete item error:', error);
      toast.error('Failed to delete item');
      setItems(prev);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const safeName = file.name.replace(/\s+/g, '-');
      const storageRef = ref(storage, `menu-items/${Date.now()}-${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success('Photo uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name_en.trim() || !form.name_th.trim()) {
      toast.error('Name fields are required');
      return;
    }
    setSaving(true);
    const payload: Omit<MenuItem, 'id'> = {
      name_en: form.name_en.trim(),
      name_th: form.name_th.trim(),
      categoryId: form.categoryId,
      available: form.available,
      popular: form.popular,
      order: Number(form.order) || 1,
      prices: form.prices || {},
      singlePrice: form.singlePrice ? Number(form.singlePrice) : undefined,
      image: form.image || undefined,
    };

    try {
      if (form.id) {
        await updateMenuItem(form.id, payload);
        setItems((prev) =>
          prev.map((i) => (i.id === form.id ? { ...payload, id: form.id } : i))
        );
        toast.success('Item updated');
      } else {
        const id = await addMenuItem(payload);
        setItems((prev) => [{ ...payload, id }, ...prev]);
        toast.success('Item added');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save item error:', error);
      toast.error('Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const formCategory = categories.find((c) => c.id === form.categoryId) || activeCat;
  const priceColumns = formCategory?.priceColumns || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500">
            {items.filter((i) => i.available).length}/{items.length} items active
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-cameron-700 text-white px-4 py-2 text-sm font-medium hover:bg-cameron-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add item
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border',
              activeCategory === cat.id
                ? 'bg-cameron-700 text-white border-cameron-700'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            {cat.icon} {cat.name_en}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-cameron-400 focus:outline-none"
        />
      </div>

      {/* Items list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No items found
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'px-4 py-3 flex items-center gap-4 transition-colors',
                  !item.available && 'opacity-50 bg-gray-50/50'
                )}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name_en}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                  />
                )}

                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.name_en}</h3>
                    {item.popular && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-thai">{item.name_th}</p>
                </div>

                {/* Prices */}
                <div className="flex gap-2 shrink-0">
                  {item.singlePrice ? (
                    <span className="text-xs bg-matcha/10 text-matcha-dark font-medium px-2 py-1 rounded-lg">
                      {formatPrice(item.singlePrice)}
                    </span>
                  ) : (
                    (categories.find((c) => c.id === item.categoryId)?.priceColumns || []).map(
                      (temp) => {
                        const price = item.prices[temp];
                        if (price === undefined) return null;
                        return (
                          <span
                            key={temp}
                            className="text-xs bg-gray-50 text-gray-600 font-medium px-2 py-1 rounded-lg"
                          >
                            {getTempLabel(temp, 'en').charAt(0)}: {formatPrice(price)}
                          </span>
                        );
                      }
                    )
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="shrink-0"
                    title={item.available ? 'Click to disable' : 'Click to enable'}
                  >
                    {item.available ? (
                      <ToggleRight className="w-8 h-8 text-cameron-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {form.id ? 'Edit item' : 'Add item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Name (EN)</label>
                <input
                  value={form.name_en}
                  onChange={(e) => setForm((prev) => ({ ...prev, name_en: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Name (TH)</label>
                <input
                  value={form.name_th}
                  onChange={(e) => setForm((prev) => ({ ...prev, name_th: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Sort order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}
                  />
                  Popular
                </label>
              </div>
              <div>
                <label className="text-xs text-gray-500">Image URL</label>
                <input
                  value={form.image || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-gray-500">Upload photo</label>
              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Choose file'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                </label>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                  />
                )}
              </div>
            </div>

            <div className="mt-4">
              {priceColumns.length === 0 ? (
                <div>
                  <label className="text-xs text-gray-500">Single price</label>
                  <input
                    type="number"
                    value={form.singlePrice || ''}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, singlePrice: Number(e.target.value) }))
                    }
                    className="w-40 mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {priceColumns.map((temp) => (
                    <div key={temp}>
                      <label className="text-xs text-gray-500">
                        {getTempLabel(temp, 'en')}
                      </label>
                      <input
                        type="number"
                        value={form.prices[temp] ?? ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            prices: { ...prev.prices, [temp]: Number(e.target.value) },
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-cameron-700 text-white text-sm font-medium hover:bg-cameron-800 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
