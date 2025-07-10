"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Plus, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Cat {
  name: string;
  role: string;
  about: string;
  image: string;
}

export default function CatsClient() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [formData, setFormData] = useState<Cat>({
    name: '',
    role: '',
    about: '',
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const response = await fetch('/api/admin/cats');
      const data = await response.json();
      setCats(data.cats);
    } catch (error) {
      toast.error('Kedileri yüklerken bir hata oluştu');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/cats/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.path) {
        setFormData(prev => ({ ...prev, image: data.path }));
        toast.success('Görsel başarıyla yüklendi');
      }
    } catch (error) {
      toast.error('Görsel yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingCat ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/cats', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingCat ? 'Kedi güncellendi' : 'Yeni kedi eklendi');
        setIsModalOpen(false);
        setEditingCat(null);
        setFormData({ name: '', role: '', about: '', image: '' });
        fetchCats();
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Bu kediyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/admin/cats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        toast.success('Kedi silindi');
        fetchCats();
      }
    } catch (error) {
      toast.error('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const openEditModal = (cat: Cat) => {
    setEditingCat(cat);
    setFormData(cat);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Ofis Kedileri</h2>
        <button
          onClick={() => {
            setEditingCat(null);
            setFormData({ name: '', role: '', about: '', image: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-std5-accent text-white rounded-lg hover:bg-std5-accent/80 transition-colors"
        >
          <Plus size={20} />
          Yeni Kedi Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map((cat) => (
          <div key={cat.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
            <p className="text-std5-accent mb-2">{cat.role}</p>
            <p className="text-gray-400 text-sm mb-4">{cat.about}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(cat)}
                className="flex items-center gap-1 px-3 py-1.5 bg-std5-primary/20 text-std5-primary rounded hover:bg-std5-primary/30 transition-colors"
              >
                <Pencil size={16} />
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(cat.name)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
              >
                <Trash2 size={16} />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-std5-darker border border-white/10 rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingCat ? 'Kedi Düzenle' : 'Yeni Kedi Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-std5-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ünvan
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-std5-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hakkında
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-std5-accent h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Görsel
                </label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <Upload size={20} />
                    {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-std5-accent text-white rounded-lg hover:bg-std5-accent/80 transition-colors"
                  disabled={isUploading}
                >
                  {editingCat ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
