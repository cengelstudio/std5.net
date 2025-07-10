'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, Trash2, Plus, X, Upload } from 'lucide-react';

interface Work {
  id: string;
  title: string;
  description: string;
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
}

interface CrewMember {
  id?: string;
  name: string;
  title: string;
  department: string;
  image: string;
  linkedin: string;
  cv: string;
}

interface Cat {
  name: string;
  role: string;
  about: string;
  image: string;
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<'works' | 'crew' | 'cats'>('works');
  const [works, setWorks] = useState<Work[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showCrewForm, setShowCrewForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [catFormData, setCatFormData] = useState<Cat>({
    name: '',
    role: '',
    about: '',
    image: ''
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (editingCat) {
      setCatFormData({
        name: editingCat.name || '',
        role: editingCat.role || '',
        about: editingCat.about || '',
        image: editingCat.image || ''
      });
    }
  }, [editingCat]);

  const fetchData = async () => {
    try {
      const [worksRes, crewRes, catsRes] = await Promise.all([
        fetch('/api/admin/works'),
        fetch('/api/admin/crew'),
        fetch('/api/admin/cats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        })
      ]);

      if (worksRes.ok && crewRes.ok && catsRes.ok) {
        const worksData = await worksRes.json();
        const crewData = await crewRes.json();
        const catsData = await catsRes.json();
        setWorks(worksData);
        setCrew(crewData);
        setCats(catsData.cats);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin/login');
  };

  const handleDeleteWork = async (id: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/works/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        });

        if (response.ok) {
          setWorks(works.filter(work => work.id !== id));
        }
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleDeleteCrew = async (id: string) => {
    if (confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/crew/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        });

        if (response.ok) {
          setCrew(crew.filter(member => member.id !== id));
        }
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleEditWork = (work: Work) => {
    setEditingWork(work);
    setShowWorkForm(true);
  };

  const handleEditCrew = (member: CrewMember) => {
    setEditingCrew(member);
    setShowCrewForm(true);
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/cats/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: formData,
      });
      const data = await response.json();

      if (data.path) {
        setCatFormData(prev => ({ ...prev, image: data.path }));
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingCat ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/cats', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(catFormData),
      });

      if (response.ok) {
        setShowCatForm(false);
        setEditingCat(null);
        setCatFormData({ name: '', role: '', about: '', image: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Kedi kaydetme hatası:', error);
    }
  };

  const handleDeleteCat = async (name: string) => {
    if (!confirm('Bu kediyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/admin/cats', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const openEditCatModal = (cat: Cat) => {
    setEditingCat(cat);
    setCatFormData({
      name: cat.name,
      role: cat.role,
      about: cat.about,
      image: cat.image
    });
    setShowCatForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Yönetim Paneli</h1>
              <p className="text-sm text-gray-600 mt-1">İçerik Yönetim Sistemi</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('works')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'works'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Projeler ({works.length})
              </button>
              <button
                onClick={() => setActiveTab('crew')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'crew'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ekip Üyeleri ({crew.length})
              </button>
              <button
                onClick={() => setActiveTab('cats')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'cats'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ofis Kedileri ({cats.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Works Tab */}
          {activeTab === 'works' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Projeler</h2>
                  <p className="text-sm text-gray-500 mt-1">Proje içeriklerini yönetin</p>
                </div>
                <button
                  onClick={() => setShowWorkForm(true)}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yeni Proje
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {works.map((work) => (
                  <div key={work.id} className="group">
                    <div className="relative bg-gray-200 rounded-md overflow-hidden border border-gray-200">
                      {/* 2:3 Aspect Ratio Container */}
                      <div className="aspect-[2/3] relative">
                        {work.image ? (
                          <img
                            src={work.image.startsWith('http') ? work.image : `/works/${work.image}`}
                            alt={work.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MEwxMjUgMTQwTDE3NSA5MFYyMTBIODVWMTMwTDc1IDkwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => handleEditWork(work)}
                            className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteWork(work.id)}
                            className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors cursor-pointer shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Title and Info */}
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{work.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{work.prod_year}</span>
                        <span className="mx-1">•</span>
                        <span className="truncate">{work.platform}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew Tab */}
          {activeTab === 'crew' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Ekip Üyeleri</h2>
                  <p className="text-sm text-gray-500 mt-1">Ekip üyelerini yönetin</p>
                </div>
                <button
                  onClick={() => setShowCrewForm(true)}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yeni Üye
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {crew.map((member, index) => (
                  <div key={member.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                        {member.image ? (
                          <img
                            src={member.image.startsWith('http') || member.image.startsWith('/') ? member.image : `/team/${member.image}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMzIgMjhhNCA0IDAgMTAwLTggNCA0IDAgMDAwIDh6bTAgNGExMCAxMCAwIDAwLTEwIDEwaDIwYTEwIDEwIDAgMDAtMTAtMTB6IiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{member.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">{member.title}</p>
                      <p className="text-xs text-gray-500">{member.department}</p>

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEditCrew(member)}
                          className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteCrew(member.id || index.toString())}
                          className="flex-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cats Tab */}
          {activeTab === 'cats' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Ofis Kedileri</h2>
                  <p className="text-sm text-gray-500 mt-1">Ofis kedilerini yönetin</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCat(null);
                    setCatFormData({ name: '', role: '', about: '', image: '' });
                    setShowCatForm(true);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yeni Kedi
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {cats.map((cat) => (
                  <div key={cat.name} className="group">
                    <div className="relative bg-gray-200 rounded-md overflow-hidden border border-gray-200">
                      <div className="aspect-square relative">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{cat.name}</h3>
                      <p className="text-gray-500 text-xs mt-1">{cat.role}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => openEditCatModal(cat)}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                        >
                          <Pencil size={12} />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.name)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          <Trash2 size={12} />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cat Form Modal */}
              {showCatForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingCat ? 'Kedi Düzenle' : 'Yeni Kedi'}
                      </h3>
                      <button
                        onClick={() => setShowCatForm(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleCatSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İsim
                          </label>
                          <input
                            type="text"
                            value={catFormData.name}
                            onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ünvan
                          </label>
                          <input
                            type="text"
                            value={catFormData.role}
                            onChange={(e) => setCatFormData({ ...catFormData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hakkında
                          </label>
                          <textarea
                            value={catFormData.about}
                            onChange={(e) => setCatFormData({ ...catFormData, about: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            rows={3}
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Görsel
                          </label>
                          <div className="mt-1 flex items-center gap-4">
                            {catFormData.image && (
                              <div className="relative w-20 h-20 rounded overflow-hidden">
                                <Image
                                  src={catFormData.image}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                              <Upload size={16} />
                              {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                              <input
                                type="file"
                                onChange={handleCatImageUpload}
                                accept="image/*"
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowCatForm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
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
          )}
        </div>
      </div>

      {/* Work Form Modal */}
      {(showWorkForm || editingWork) && (
        <WorkFormModal
          work={editingWork}
          onSave={(work) => {
            if (editingWork) {
              setWorks(works.map(w => w.id === work.id ? work : w));
            } else {
              setWorks([...works, work]);
            }
            setEditingWork(null);
            setShowWorkForm(false);
          }}
          onCancel={() => {
            setEditingWork(null);
            setShowWorkForm(false);
          }}
        />
      )}

      {/* Crew Form Modal */}
      {(showCrewForm || editingCrew) && (
        <CrewFormModal
          member={editingCrew}
          onSave={(member) => {
            if (editingCrew) {
              setCrew(crew.map(c => c.id === member.id ? member : c));
            } else {
              setCrew([...crew, member]);
            }
            setEditingCrew(null);
            setShowCrewForm(false);
          }}
          onCancel={() => {
            setEditingCrew(null);
            setShowCrewForm(false);
          }}
        />
      )}
    </div>
  );
}

// Work Form Modal Component
function WorkFormModal({
  work,
  onSave,
  onCancel
}: {
  work: Work | null;
  onSave: (work: Work) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Work>({
    id: '',
    title: '',
    description: '',
    prod_year: new Date().getFullYear(),
    genre: '',
    platform: '',
    trailer_embed_url: '',
    gallery: [],
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when component mounts or work changes
  useEffect(() => {
    if (work) {
      setFormData(work);
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        prod_year: new Date().getFullYear(),
        genre: '',
        platform: '',
        trailer_embed_url: '',
        gallery: [],
        image: ''
      });
    }
  }, [work]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);
        formDataUpload.append('type', 'work');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          },
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      const method = work ? 'PUT' : 'POST';
      const url = work ? `/api/admin/works/${work.id}` : '/api/admin/works';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ ...formData, image: imageUrl })
      });

      if (response.ok) {
        const savedWork = await response.json();
        onSave(savedWork);
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {work ? 'Proje Düzenle' : 'Yeni Proje Ekle'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yıl
              </label>
              <input
                type="number"
                value={formData.prod_year}
                onChange={(e) => setFormData({...formData, prod_year: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tür
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                value={formData.trailer_embed_url}
                onChange={(e) => setFormData({...formData, trailer_embed_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
              {formData.image && (
                <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.image.split('/').pop()}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Crew Form Modal Component
function CrewFormModal({
  member,
  onSave,
  onCancel
}: {
  member: CrewMember | null;
  onSave: (member: CrewMember) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<CrewMember>({
    name: '',
    title: '',
    department: '',
    image: '',
    linkedin: '',
    cv: '#'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when component mounts or member changes
  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        name: '',
        title: '',
        department: '',
        image: '',
        linkedin: '',
        cv: '#'
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      let cvUrl = formData.cv;

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);
        formDataUpload.append('type', 'team');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          },
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      if (cvFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', cvFile);
        formDataUpload.append('type', 'team-cv');

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          },
          body: formDataUpload
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          cvUrl = uploadData.url;
        }
      }

      const method = member ? 'PUT' : 'POST';
      const url = member ? `/api/admin/crew/${member.id}` : '/api/admin/crew';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ ...formData, image: imageUrl, cv: cvUrl })
      });

      if (response.ok) {
        const savedMember = await response.json();
        onSave(savedMember);
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {member ? 'Ekip Üyesi Düzenle' : 'Yeni Ekip Üyesi Ekle'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İsim
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pozisyon
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departman
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
              {formData.image && (
                <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.image.split('/').pop()}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
              {formData.cv && formData.cv !== '#' && (
                <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.split('/').pop()}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
