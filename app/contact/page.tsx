"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import tr from '../../locales/tr.json';
import en from '../../locales/en.json';
import Image from 'next/image';
import { ChevronLeft, Send } from 'lucide-react';

const locales = { tr, en };

export default function Contact() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState('tr');
  const [translations, setTranslations] = useState(tr);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const validLang = langParam === 'en' ? 'en' : 'tr';
    setLocale(validLang);
    setTranslations(locales[validLang as keyof typeof locales]);
  }, [searchParams]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const switchLanguage = (newLocale: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', newLocale);
    router.push(currentUrl.pathname + currentUrl.search);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Contact Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              {locale === 'tr' ? 'İletişim' : 'Contact'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {locale === 'tr'
                ? "Her zaman yoğun çalışıyoruz ama misafirlerimizin de yeri her zaman ayrıdır. Renk, kurgu, animasyon, ses miksajı ve teknik desteğin yanında, Türk kahvesi de elbette sunuyoruz, her zaman bekleriz."
                : "We are always working hard, but our guests always have a special place. Along with color, editing, animation, sound mixing, and technical support, we also offer Turkish coffee, you're always welcome."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {locale === 'tr' ? 'Ad Soyad' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={locale === 'tr' ? 'Adınız ve soyadınız' : 'Your full name'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {locale === 'tr' ? 'E-posta' : 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={locale === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    {locale === 'tr' ? 'Konu' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={locale === 'tr' ? 'Mesajınızın konusu' : 'Message subject'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {locale === 'tr' ? 'Mesaj' : 'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300 resize-none"
                    placeholder={locale === 'tr' ? 'Mesajınız' : 'Your message'}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {locale === 'tr' ? 'Gönder' : 'Send Message'}
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-center">
                    {locale === 'tr'
                      ? 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
                      : 'Your message has been sent successfully. We will get back to you soon.'}
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-center">
                    {locale === 'tr'
                      ? 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
                      : 'An error occurred. Please try again later.'}
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
