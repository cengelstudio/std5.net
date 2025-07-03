"use client";

import { motion } from "framer-motion";
import { useState } from 'react';
import { Send, Phone, Mail, Instagram, Youtube } from 'lucide-react';
import { ContactFormData, SubmitStatus } from '../../types';

export default function ContactClient() {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Contact Content */}
      <section className="relative pt-24 pb-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="relative mb-8">
              <motion.h1
                className="text-[28px] md:text-[52px] font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                İletişim
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
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
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder="E-posta adresiniz"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300 resize-none"
                    placeholder="Mesajınız"
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
                      Gönder
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <p className="text-green-400 text-center">
                    Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-400 text-center">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-2xl mx-auto mt-12"
          >
            <div className="glass rounded-2xl p-6 text-center flex flex-col items-center">
              <Phone className="w-6 h-6 text-std5-accent mb-2" />
              <span className="text-xl font-bold text-white mb-1">Telefon</span>
              <a href="tel:+902122678094" className="text-std5-accent hover:text-std5-accent/80 transition-colors text-lg font-medium">
                +90 (212) 267 80 94
              </a>
            </div>
            <div className="glass rounded-2xl p-6 text-center flex flex-col items-center">
              <Mail className="w-6 h-6 text-std5-accent mb-2" />
              <span className="text-xl font-bold text-white mb-1">E-posta</span>
              <a href="mailto:info@std5.net" className="text-std5-accent hover:text-std5-accent/80 transition-colors text-lg font-medium">
                info@std5.net
              </a>
            </div>
            <div className="glass rounded-2xl p-6 text-center flex flex-col items-center">
              <Instagram className="w-6 h-6 text-std5-accent mb-2" />
              <span className="text-xl font-bold text-white mb-1">Instagram</span>
              <a href="https://instagram.com/std5_postproduction" target="_blank" rel="noopener noreferrer" className="text-std5-accent hover:text-std5-accent/80 transition-colors text-lg font-medium">@std5_postproduction</a>
            </div>
            <div className="glass rounded-2xl p-6 text-center flex flex-col items-center">
              <Youtube className="w-6 h-6 text-std5-accent mb-2" />
              <span className="text-xl font-bold text-white mb-1">YouTube</span>
              <a href="https://youtube.com/@std5_postproduction" target="_blank" rel="noopener noreferrer" className="text-std5-accent hover:text-std5-accent/80 transition-colors text-lg font-medium">@std5_postproduction</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
