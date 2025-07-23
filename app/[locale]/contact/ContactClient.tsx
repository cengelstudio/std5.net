"use client";

import { motion } from "framer-motion";
import { useState } from 'react';
import { Send, Phone, Mail, Instagram, Youtube } from 'lucide-react';
import { ContactFormData, SubmitStatus } from '../../../types';
import { useTranslation } from '../../hooks/useTranslation';

export default function ContactClient() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

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
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Contact Content */}
      <section className="relative pt-16 sm:pt-24 pb-4 sm:pb-7 px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="relative mb-6 sm:mb-8">
              <motion.h1
                className="text-[32px] sm:text-[52px] font-bold text-white mb-4 sm:mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('contact.title')}
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto px-3 sm:px-0"
          >
            <form onSubmit={handleSubmit} className="glass rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-10">
              <div className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300 resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-4 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <p className="text-sm sm:text-base text-green-400 text-center">
                    Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-sm sm:text-base text-red-400 text-center">
                    Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 gap-3 sm:gap-8 mb-8 sm:mb-10 max-w-2xl mx-auto px-3 sm:px-0"
          >
            <a href="tel:+902122678094" className="block">
              <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center flex flex-col items-center h-full hover:bg-white/5 transition-all duration-300">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-std5-accent mb-1.5 sm:mb-2" />
                <span className="text-base sm:text-xl font-bold text-std5-accent mb-0.5 sm:mb-1">{t('contact.info.phone')}</span>
                <span className="text-white text-sm sm:text-lg font-medium">
                  +90 (212) 267 80 94
                </span>
              </div>
            </a>

            <a href="mailto:info@std5.net" className="block">
              <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center flex flex-col items-center h-full hover:bg-white/5 transition-all duration-300">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-std5-accent mb-1.5 sm:mb-2" />
                <span className="text-base sm:text-xl font-bold text-std5-accent mb-0.5 sm:mb-1">{t('contact.info.email')}</span>
                <span className="text-white text-sm sm:text-lg font-medium">
                  info@std5.net
                </span>
              </div>
            </a>

            <a href="https://instagram.com/std5_postproduction" target="_blank" rel="noopener noreferrer" className="block">
              <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center flex flex-col items-center h-full hover:bg-white/5 transition-all duration-300">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-std5-accent mb-1.5 sm:mb-2" />
                <span className="text-base sm:text-xl font-bold text-std5-accent mb-0.5 sm:mb-1">Instagram</span>
                <span className="text-white text-sm sm:text-lg font-medium break-all">
                  @std5_postproduction
                </span>
              </div>
            </a>

            <a href="https://youtube.com/@std5_postproduction" target="_blank" rel="noopener noreferrer" className="block">
              <div className="glass rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center flex flex-col items-center h-full hover:bg-white/5 transition-all duration-300">
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-std5-accent mb-1.5 sm:mb-2" />
                <span className="text-base sm:text-xl font-bold text-std5-accent mb-0.5 sm:mb-1">YouTube</span>
                <span className="text-white text-sm sm:text-lg font-medium break-all">
                  @std5_postproduction
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
