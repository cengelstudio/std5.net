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
            className="max-w-2xl mx-auto px-0 sm:px-0"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 sm:p-6 mb-8">
              <div className="space-y-5">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                {/* Message */}
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300 resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-std5-primary to-std5-accent hover:from-std5-primary/90 hover:to-std5-accent/90 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center">
                    <p className="text-sm font-medium">Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                    <p className="text-sm font-medium">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                  </div>
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
