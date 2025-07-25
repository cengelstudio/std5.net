'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, Trash2, X, Upload } from 'lucide-react';

interface Work {
  id: string;
  title: string;
  description: string | { [key: string]: string };
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
  order?: number;
}

interface CrewMember {
  id?: string;
  name: string;
  title: string | { [key: string]: string };
  department: string | { [key: string]: string };
  image: string;
  linkedin: string;
  cv: string | { [key: string]: string };
  order?: number;
}

interface Cat {
  id: string;
  name: string;
  role: string | { [key: string]: string };
  about: string | { [key: string]: string };
  image: string;
  order?: number;
}

interface Founder {
  id?: string;
  name: string;
  title: string | { [key: string]: string };
  about: string | { [key: string]: string };
  image: string;
  linkedin?: string;
  imdb?: string;
  cv?: string | { [key: string]: string };
}

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<'works' | 'crew' | 'founders' | 'cats' | 'featured' | 'contacts'>('works');
  const [works, setWorks] = useState<Work[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [featuredProjectIds, setFeaturedProjectIds] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showCrewForm, setShowCrewForm] = useState(false);
  const [showFounderForm, setShowFounderForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [catFormData, setCatFormData] = useState<Cat>({
    id: '',
    name: '',
    role: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
    about: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
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
      const aboutData = typeof editingCat.about === 'string'
        ? { tr: editingCat.about, en: '', es: '', fr: '', ru: '', ar: '' }
        : editingCat.about;

      const roleData = typeof editingCat.role === 'string'
        ? { tr: editingCat.role, en: '', es: '', fr: '', ru: '', ar: '' }
        : editingCat.role;

      setCatFormData({
        id: editingCat.id || '',
        name: editingCat.name || '',
        role: roleData,
        about: aboutData,
        image: editingCat.image || ''
      });
    }
  }, [editingCat]);

  const fetchData = async () => {
    try {
      const [worksRes, crewRes, foundersRes, catsRes, featuredRes, contactsRes] = await Promise.all([
        fetch('/api/admin/works'),
        fetch('/api/admin/crew'),
        fetch('/api/admin/founders'),
        fetch('/api/admin/cats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        }),
        fetch('/api/admin/featured-projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        }),
        fetch('/api/contact')
      ]);

      if (worksRes.ok && crewRes.ok && foundersRes.ok && catsRes.ok && featuredRes.ok && contactsRes.ok) {
        const worksData = await worksRes.json();
        const crewData = await crewRes.json();
        const foundersData = await foundersRes.json();
        const catsData = await catsRes.json();
        const featuredData = await featuredRes.json();
        const contactsData = await contactsRes.json();
        setWorks(worksData);
        setCrew(crewData);
        setFounders(foundersData);
        setCats(catsData.cats);
        setFeaturedProjectIds(featuredData.featuredProjectIds || []);
        setContacts(contactsData);
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

  const handleDeleteFounder = async (id: string) => {
    if (confirm('Bu kurucuyu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/founders/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        });

        if (response.ok) {
          setFounders(founders.filter(founder => founder.id !== id));
        }
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const handleEditFounder = (founder: Founder) => {
    setEditingFounder(founder);
    setShowFounderForm(true);
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

      // For new cats, generate an ID
      const submitData = editingCat ? catFormData : { ...catFormData, id: Date.now().toString() };

      console.log('Submitting cat data:', submitData);
      console.log('Method:', method);

      const response = await fetch('/api/admin/cats', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        setShowCatForm(false);
        setEditingCat(null);
                setCatFormData({
          id: '',
          name: '',
          role: { tr: '', en: '', es: '', fr: '', ru: '', ar: '' },
          about: { tr: '', en: '', es: '', fr: '', ru: '', ar: '' },
          image: ''
        });
        fetchData();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(errorData.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Kedi kaydetme hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (!confirm('Bu kediyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/admin/cats', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Silme işlemi sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

    const openEditCatModal = (cat: Cat) => {
    setEditingCat(cat);
    const aboutData = typeof cat.about === 'string'
      ? { tr: cat.about, en: '', es: '', fr: '', ru: '', ar: '' }
      : cat.about;

    const roleData = typeof cat.role === 'string'
      ? { tr: cat.role, en: '', es: '', fr: '', ru: '', ar: '' }
      : cat.role;

    setCatFormData({
      id: cat.id,
      name: cat.name,
      role: roleData,
      about: aboutData,
      image: cat.image
    });
    setShowCatForm(true);
  };

  const handleFeaturedProjectsUpdate = async (selectedIds: string[]) => {
    try {
      const response = await fetch('/api/admin/featured-projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ featuredProjectIds: selectedIds }),
      });

      if (response.ok) {
        setFeaturedProjectIds(selectedIds);
        alert('Öne çıkan projeler başarıyla güncellendi!');
      } else {
        const errorData = await response.json();
        alert(`Hata: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Öne çıkan projeler güncelleme hatası:', error);
      alert('Öne çıkan projeler güncellenirken bir hata oluştu.');
    }
  };

  const toggleFeaturedProject = (projectId: string) => {
    const isCurrentlyFeatured = featuredProjectIds.includes(projectId);
    let newFeaturedIds: string[];

    if (isCurrentlyFeatured) {
      // Remove from featured
      newFeaturedIds = featuredProjectIds.filter(id => id !== projectId);
    } else {
      // Add to featured (check if we're at the limit)
      if (featuredProjectIds.length >= 6) {
        alert('Maksimum 6 öne çıkan proje seçebilirsiniz.');
        return;
      }
      newFeaturedIds = [...featuredProjectIds, projectId];
    }

    handleFeaturedProjectsUpdate(newFeaturedIds);
  };

  const handleContactStatusChange = async (contactId: string, newStatus: 'new' | 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setContacts(contacts.map(contact =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        ));
      }
    } catch (error) {
      console.error('Contact status update error:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Bu iletişim formunu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
      }
    } catch (error) {
      console.error('Contact deletion error:', error);
    }
  };

  // Sıralama fonksiyonları
  const handleMoveUp = async (type: 'works' | 'crew' | 'cats', id: string) => {
    try {
      const response = await fetch(`/api/${type}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, direction: 'up' }),
      });

      if (response.ok) {
        // Sayfayı yenile
        fetchData();
      }
    } catch (error) {
      console.error(`Error moving ${type} up:`, error);
    }
  };

  const handleMoveDown = async (type: 'works' | 'crew' | 'cats', id: string) => {
    try {
      const response = await fetch(`/api/${type}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, direction: 'down' }),
      });

      if (response.ok) {
        // Sayfayı yenile
        fetchData();
      }
    } catch (error) {
      console.error(`Error moving ${type} down:`, error);
    }
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
                onClick={() => setActiveTab('founders')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'founders'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Kurucular ({founders.length})
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
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'featured'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Öne Çıkan Projeler ({featuredProjectIds.length}/6)
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                İletişim Formları ({contacts.length})
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
                {works.sort((a, b) => (a.order || 0) - (b.order || 0)).map((work, index) => (
                  <div key={work.id} className="group">
                    <div className="relative bg-gray-200 rounded-md overflow-hidden border border-gray-200">
                      {/* 2:3 Aspect Ratio Container */}
                      <div className="aspect-[2/3] relative">
                        {work.image ? (
                          <Image
                            src={work.image.startsWith('http') ? work.image : work.image.startsWith('/') ? work.image : `/works/${work.image}`}
                            alt={work.title}
                            fill
                            className="object-cover"
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

                      {/* Sıra numarası ve sıralama butonları - alta taşındı */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{work.order || index + 1}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleMoveUp('works', work.id)}
                            disabled={index === 0}
                            className={`w-6 h-6 text-xs rounded ${index === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveDown('works', work.id)}
                            disabled={index === works.length - 1}
                            className={`w-6 h-6 text-xs rounded ${index === works.length - 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          >
                            ↓
                          </button>
                        </div>
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
                {crew.sort((a, b) => (a.order || 0) - (b.order || 0)).map((member, index) => (
                  <div key={member.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                        {member.image ? (
                          <Image
                            src={member.image.startsWith('http') || member.image.startsWith('/') ? member.image : `/team/${member.image}`}
                            alt={member.name}
                            width={64}
                            height={64}
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
                      <p className="text-xs text-gray-600 mb-1">
                        {typeof member.title === 'string' ? member.title : member.title.tr}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeof member.department === 'string' ? member.department : member.department.tr}
                      </p>

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEditCrew(member)}
                          className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => member.id && handleDeleteCrew(member.id)}
                          className="flex-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>

                      {/* Sıra numarası ve sıralama butonları - alta taşındı */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{member.order || index + 1}
                        </div>
                        <div className="flex space-x-1">
                                                  <button
                          onClick={() => member.id && handleMoveUp('crew', member.id)}
                          disabled={index === 0}
                          className={`w-6 h-6 text-xs rounded ${index === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => member.id && handleMoveDown('crew', member.id)}
                          disabled={index === crew.length - 1}
                          className={`w-6 h-6 text-xs rounded ${index === crew.length - 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                          ↓
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Founders Tab */}
          {activeTab === 'founders' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Kurucular</h2>
                  <p className="text-sm text-gray-500 mt-1">Kurucuları yönetin</p>
                </div>
                <button
                  onClick={() => setShowFounderForm(true)}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yeni Kurucu
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {founders.map((founder, index) => (
                  <div key={founder.id || index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                        {founder.image ? (
                          <Image
                            src={founder.image.startsWith('http') || founder.image.startsWith('/') ? founder.image : `/team/${founder.image}`}
                            alt={founder.name}
                            width={64}
                            height={64}
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
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{founder.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {typeof founder.title === 'string' ? founder.title : founder.title.tr}
                      </p>
                      {founder.about && (
                        <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                          {typeof founder.about === 'string' ? founder.about : founder.about.tr}
                        </p>
                      )}

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleEditFounder(founder)}
                          className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteFounder(founder.id || index.toString())}
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
                    setCatFormData({
                      id: '',
                      name: '',
                      role: { tr: '', en: '', es: '', fr: '', ru: '', ar: '' },
                      about: { tr: '', en: '', es: '', fr: '', ru: '', ar: '' },
                      image: ''
                    });
                    setShowCatForm(true);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Yeni Kedi
                </button>
              </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {cats.sort((a, b) => (a.order || 0) - (b.order || 0)).map((cat, index) => (
                  <div key={cat.id} className="group">
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
                      <p className="text-gray-500 text-xs mt-1">
                        {typeof cat.role === 'string' ? cat.role : cat.role.tr}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => openEditCatModal(cat)}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                        >
                          <Pencil size={12} />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat.id)}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          <Trash2 size={12} />
                          Sil
                        </button>
                      </div>

                      {/* Sıra numarası ve sıralama butonları - alta taşındı */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                        <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          #{cat.order || index + 1}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleMoveUp('cats', cat.id)}
                            disabled={index === 0}
                            className={`w-6 h-6 text-xs rounded ${index === 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveDown('cats', cat.id)}
                            disabled={index === cats.length - 1}
                            className={`w-6 h-6 text-xs rounded ${index === cats.length - 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cat Form Modal */}
              {showCatForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                      </div>

                      {/* Çok Dilli Ünvan Bölümü */}
                      <div className="border-t pt-6 mb-6">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Çok Dilli Ünvanlar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (Türkçe) *
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? catFormData.role : catFormData.role.tr}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? e.target.value
                                  : { ...catFormData.role, tr: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (İngilizce)
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? '' : catFormData.role.en}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? { tr: catFormData.role, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                                  : { ...catFormData.role, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (İspanyolca)
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? '' : catFormData.role.es}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? { tr: catFormData.role, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                                  : { ...catFormData.role, es: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (Fransızca)
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? '' : catFormData.role.fr}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? { tr: catFormData.role, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                                  : { ...catFormData.role, fr: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (Rusça)
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? '' : catFormData.role.ru}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? { tr: catFormData.role, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                                  : { ...catFormData.role, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ünvan (Arapça)
                            </label>
                            <input
                              type="text"
                              value={typeof catFormData.role === 'string' ? '' : catFormData.role.ar}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                role: typeof catFormData.role === 'string'
                                  ? { tr: catFormData.role, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                                  : { ...catFormData.role, ar: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Çok Dilli Hakkında Bölümü */}
                      <div className="border-t pt-6 mb-6">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Çok Dilli Açıklamalar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (Türkçe) *
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? catFormData.about : catFormData.about.tr}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? e.target.value
                                  : { ...catFormData.about, tr: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (İngilizce)
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? '' : catFormData.about.en}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? { tr: catFormData.about, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                                  : { ...catFormData.about, en: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (İspanyolca)
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? '' : catFormData.about.es}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? { tr: catFormData.about, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                                  : { ...catFormData.about, es: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (Fransızca)
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? '' : catFormData.about.fr}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? { tr: catFormData.about, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                                  : { ...catFormData.about, fr: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (Rusça)
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? '' : catFormData.about.ru}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? { tr: catFormData.about, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                                  : { ...catFormData.about, ru: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hakkında (Arapça)
                            </label>
                            <textarea
                              value={typeof catFormData.about === 'string' ? '' : catFormData.about.ar}
                              onChange={(e) => setCatFormData({
                                ...catFormData,
                                about: typeof catFormData.about === 'string'
                                  ? { tr: catFormData.about, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                                  : { ...catFormData.about, ar: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6 mb-6">
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

          {/* Featured Projects Tab */}
          {activeTab === 'featured' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Öne Çıkan Projeler</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ana sayfada gösterilecek projeleri seçin (Maksimum 6 adet)
                </p>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Seçili Projeler:</strong> {featuredProjectIds.length}/6
                  </p>
                  {featuredProjectIds.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Seçili projeler ana sayfada bu sırayla gösterilecektir.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {works.map((work) => {
                  const isFeatured = featuredProjectIds.includes(work.id);
                  return (
                    <div key={work.id} className={`group relative ${isFeatured ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="relative bg-gray-200 rounded-md overflow-hidden border border-gray-200">
                        {/* 2:3 Aspect Ratio Container */}
                        <div className="aspect-[2/3] relative">
                          {work.image ? (
                            <Image
                              src={work.image.startsWith('http') ? work.image : work.image.startsWith('/') ? work.image : `/works/${work.image}`}
                              alt={work.title}
                              fill
                              className="object-cover"
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

                          {/* Featured Badge */}
                          {isFeatured && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Öne Çıkan
                            </div>
                          )}

                          {/* Toggle Button */}
                          <button
                            onClick={() => toggleFeaturedProject(work.id)}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isFeatured
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-600'
                            } shadow-lg`}
                            title={isFeatured ? 'Öne çıkanlardan çıkar' : 'Öne çıkan yap'}
                          >
                            {isFeatured ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </button>
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
                  );
                })}
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">İletişim Formları</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Gelen iletişim formlarını görüntüleyin ve yönetin
                </p>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz iletişim formu yok</h3>
                  <p className="text-gray-500">İletişim formları burada görüntülenecek.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className={`border rounded-lg p-4 ${contact.status === 'new' ? 'border-blue-200 bg-blue-50' : contact.status === 'read' ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            contact.status === 'read' ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {contact.status === 'new' ? 'Yeni' : contact.status === 'read' ? 'Okundu' : 'Yanıtlandı'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(contact.timestamp).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">Konu: {contact.subject}</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContactStatusChange(contact.id, contact.status === 'new' ? 'read' : contact.status === 'read' ? 'replied' : 'new')}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          {contact.status === 'new' ? 'Okundu olarak işaretle' : contact.status === 'read' ? 'Yanıtlandı olarak işaretle' : 'Yeni olarak işaretle'}
                        </button>
                        <a
                          href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          E-posta Gönder
                        </a>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
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

      {/* Founder Form Modal */}
      {(showFounderForm || editingFounder) && (
        <FounderFormModal
          founder={editingFounder}
          onSave={(founder) => {
            if (editingFounder) {
              setFounders(founders.map(f => f.id === founder.id ? founder : f));
            } else {
              setFounders([...founders, founder]);
            }
            setEditingFounder(null);
            setShowFounderForm(false);
          }}
          onCancel={() => {
            setEditingFounder(null);
            setShowFounderForm(false);
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
    description: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
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
      const descriptionData = typeof work.description === 'string'
        ? { tr: work.description, en: '', es: '', fr: '', ru: '', ar: '' }
        : work.description;

      setFormData({
        ...work,
        description: descriptionData
      });
    } else {
      setFormData({
        id: '',
        title: '',
        description: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        },
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
                Açıklama (Çok Dilli)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Türkçe</label>
                  <textarea
                    value={typeof formData.description === 'string' ? formData.description : formData.description.tr}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        tr: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">English</label>
                  <textarea
                    value={typeof formData.description === 'string' ? '' : formData.description.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        en: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Español</label>
                  <textarea
                    value={typeof formData.description === 'string' ? '' : formData.description.es}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        es: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Français</label>
                  <textarea
                    value={typeof formData.description === 'string' ? '' : formData.description.fr}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        fr: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Русский</label>
                  <textarea
                    value={typeof formData.description === 'string' ? '' : formData.description.ru}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        ru: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">العربية</label>
                  <textarea
                    value={typeof formData.description === 'string' ? '' : formData.description.ar}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: {
                        ...(typeof formData.description === 'object' ? formData.description : { tr: '', en: '', es: '', fr: '', ru: '', ar: '' }),
                        ar: e.target.value
                      }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  />
                </div>
              </div>
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
    title: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
    department: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
    image: '',
    linkedin: '',
    cv: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    }
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cvFiles, setCvFiles] = useState<{ [key: string]: File | null }>({
    tr: null,
    en: null,
    es: null,
    fr: null,
    ru: null,
    ar: null
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when component mounts or member changes
  useEffect(() => {
    if (member) {
      const titleData = typeof member.title === 'string'
        ? { tr: member.title, en: '', es: '', fr: '', ru: '', ar: '' }
        : member.title;

      const departmentData = typeof member.department === 'string'
        ? { tr: member.department, en: '', es: '', fr: '', ru: '', ar: '' }
        : member.department;

      const cvData = typeof member.cv === 'string'
        ? { tr: member.cv, en: '', es: '', fr: '', ru: '', ar: '' }
        : member.cv;

      setFormData({
        ...member,
        title: titleData,
        department: departmentData,
        cv: cvData
      });
    } else {
      setFormData({
        name: '',
        title: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        },
        department: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        },
        image: '',
        linkedin: '',
        cv: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        }
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      const cvData = typeof formData.cv === 'string' ? { tr: formData.cv, en: '', es: '', fr: '', ru: '', ar: '' } : formData.cv;

      // Upload image if provided
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

      // Upload CV files for each language
      for (const [lang, file] of Object.entries(cvFiles)) {
        if (file) {
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);
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
            cvData[lang as keyof typeof cvData] = uploadData.url;
          }
        }
      }

      const method = member ? 'PUT' : 'POST';
      const url = member && member.id ? `/api/admin/crew/${member.id}` : '/api/admin/crew';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ ...formData, image: imageUrl, cv: cvData })
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
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {member ? 'Ekip Üyesi Düzenle' : 'Yeni Ekip Üyesi Ekle'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              />
            </div>
          </div>

          {/* Çok Dilli Pozisyon Bölümü */}
          <div className="border-t pt-6 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Çok Dilli Pozisyon</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (Türkçe) *
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? formData.title : formData.title.tr}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? e.target.value
                      : { ...formData.title, tr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (İngilizce)
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? '' : formData.title.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? { tr: formData.title, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                      : { ...formData.title, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (İspanyolca)
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? '' : formData.title.es}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? { tr: formData.title, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                      : { ...formData.title, es: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (Fransızca)
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? '' : formData.title.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? { tr: formData.title, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                      : { ...formData.title, fr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (Rusça)
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? '' : formData.title.ru}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? { tr: formData.title, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                      : { ...formData.title, ru: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pozisyon (Arapça)
                </label>
                <input
                  type="text"
                  value={typeof formData.title === 'string' ? '' : formData.title.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: typeof formData.title === 'string'
                      ? { tr: formData.title, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                      : { ...formData.title, ar: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Çok Dilli Departman Bölümü */}
          <div className="border-t pt-6 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Çok Dilli Departman</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (Türkçe) *
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? formData.department : formData.department.tr}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? e.target.value
                      : { ...formData.department, tr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (İngilizce)
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? '' : formData.department.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? { tr: formData.department, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                      : { ...formData.department, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (İspanyolca)
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? '' : formData.department.es}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? { tr: formData.department, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                      : { ...formData.department, es: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (Fransızca)
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? '' : formData.department.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? { tr: formData.department, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                      : { ...formData.department, fr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (Rusça)
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? '' : formData.department.ru}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? { tr: formData.department, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                      : { ...formData.department, ru: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departman (Arapça)
                </label>
                <input
                  type="text"
                  value={typeof formData.department === 'string' ? '' : formData.department.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: typeof formData.department === 'string'
                      ? { tr: formData.department, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                      : { ...formData.department, ar: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Çok Dilli CV Bölümü */}
          <div className="border-t pt-6 mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Çok Dilli CV</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (Türkçe)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, tr: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'string' && formData.cv !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.split('/').pop()}</p>
                )}
                {typeof formData.cv === 'object' && formData.cv.tr && formData.cv.tr !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.tr.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (İngilizce)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, en: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'object' && formData.cv.en && formData.cv.en !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.en.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (İspanyolca)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, es: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'object' && formData.cv.es && formData.cv.es !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.es.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (Fransızca)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, fr: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'object' && formData.cv.fr && formData.cv.fr !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.fr.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (Rusça)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, ru: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'object' && formData.cv.ru && formData.cv.ru !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.ru.split('/').pop()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV (Arapça)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFiles({...cvFiles, ar: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
                />
                {typeof formData.cv === 'object' && formData.cv.ar && formData.cv.ar !== '#' && (
                  <p className="text-sm text-gray-500 mt-1">Mevcut: {formData.cv.ar.split('/').pop()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
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

// Founder Form Modal Component
function FounderFormModal({
  founder,
  onSave,
  onCancel
}: {
  founder: Founder | null;
  onSave: (founder: Founder) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Founder>({
    id: '',
    name: '',
    title: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
    about: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    },
    image: '',
    linkedin: '',
    imdb: '',
    cv: {
      tr: '',
      en: '',
      es: '',
      fr: '',
      ru: '',
      ar: ''
    }
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when component mounts or founder changes
  useEffect(() => {
    if (founder) {
      const titleData = typeof founder.title === 'string'
        ? { tr: founder.title, en: '', es: '', fr: '', ru: '', ar: '' }
        : founder.title;

      const aboutData = typeof founder.about === 'string'
        ? { tr: founder.about, en: '', es: '', fr: '', ru: '', ar: '' }
        : founder.about;

      const cvData = typeof founder.cv === 'string'
        ? { tr: founder.cv, en: '', es: '', fr: '', ru: '', ar: '' }
        : founder.cv;

      setFormData({
        ...founder,
        title: titleData,
        about: aboutData,
        cv: cvData
      });
    } else {
      setFormData({
        id: '',
        name: '',
        title: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        },
        about: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        },
        image: '',
        linkedin: '',
        imdb: '',
        cv: {
          tr: '',
          en: '',
          es: '',
          fr: '',
          ru: '',
          ar: ''
        }
      });
    }
  }, [founder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile);
        formDataUpload.append('type', 'founder');

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

      const method = founder ? 'PUT' : 'POST';
      const url = founder ? `/api/admin/founders/${founder.id}` : '/api/admin/founders';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });

      if (response.ok) {
        const savedFounder = await response.json();
        onSave(savedFounder);
      } else {
        console.error('Kurucu kaydetme hatası');
      }
    } catch (error) {
      console.error('Kurucu kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            {founder ? 'Kurucu Düzenle' : 'Yeni Kurucu'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Unvan (Türkçe)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? formData.title : formData.title.tr}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: e.target.value, en: '', es: '', fr: '', ru: '', ar: '' }
                  : {...formData.title, tr: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unvan (İngilizce)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? '' : formData.title.en}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: formData.title, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                  : {...formData.title, en: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unvan (İspanyolca)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? '' : formData.title.es}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: formData.title, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                  : {...formData.title, es: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unvan (Fransızca)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? '' : formData.title.fr}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: formData.title, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                  : {...formData.title, fr: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unvan (Rusça)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? '' : formData.title.ru}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: formData.title, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                  : {...formData.title, ru: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unvan (Arapça)
            </label>
            <input
              type="text"
              value={typeof formData.title === 'string' ? '' : formData.title.ar}
              onChange={(e) => setFormData({
                ...formData,
                title: typeof formData.title === 'string'
                  ? { tr: formData.title, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                  : {...formData.title, ar: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (Türkçe)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? formData.about : formData.about.tr}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: e.target.value, en: '', es: '', fr: '', ru: '', ar: '' }
                  : {...formData.about, tr: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (İngilizce)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? '' : formData.about.en}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: formData.about, en: e.target.value, es: '', fr: '', ru: '', ar: '' }
                  : {...formData.about, en: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (İspanyolca)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? '' : formData.about.es}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: formData.about, en: '', es: e.target.value, fr: '', ru: '', ar: '' }
                  : {...formData.about, es: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (Fransızca)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? '' : formData.about.fr}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: formData.about, en: '', es: '', fr: e.target.value, ru: '', ar: '' }
                  : {...formData.about, fr: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (Rusça)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? '' : formData.about.ru}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: formData.about, en: '', es: '', fr: '', ru: e.target.value, ar: '' }
                  : {...formData.about, ru: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hakkında (Arapça)
            </label>
            <textarea
              value={typeof formData.about === 'string' ? '' : formData.about.ar}
              onChange={(e) => setFormData({
                ...formData,
                about: typeof formData.about === 'string'
                  ? { tr: formData.about, en: '', es: '', fr: '', ru: '', ar: e.target.value }
                  : {...formData.about, ar: e.target.value}
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IMDb URL
            </label>
            <input
              type="url"
              value={formData.imdb}
              onChange={(e) => setFormData({...formData, imdb: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
            />
          </div>

          <div>
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
