"use client";

import { motion } from "framer-motion";
import Image from 'next/image';

const managementTeam = [
  {
    name: "Bülent Taban",
    title: "Kurucu Ortak",
    image: "/team/bulent-taban.jpg"
  },
  {
    name: "Serdar Öngören",
    title: "Kurucu Ortak",
    image: "/team/serdar-ongoren.jpg"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* About Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              STD5, İstanbul merkezli yerel ve küresel eğlence endüstrisine hizmet veren tam kapasiteli bir post prodüksiyon şirketidir. TV kanalları, sinemalar, dijital platformlar ve bağımsız yapımlar için kurgu, ses tasarım, renk düzenleme, dublaj ve cast hizmetleri sunar.
            </p>
          </motion.div>

          {/* Management Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Yönetim Ekibi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {managementTeam.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="glass rounded-2xl p-6 text-center group"
                >
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-std5-primary/30 to-std5-accent/30">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,${encodeURIComponent(
                            `<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                              <rect width="192" height="192" fill="#430086"/>
                              <text x="96" y="96" text-anchor="middle" fill="white" font-size="20">${member.name}</text>
                            </svg>`
                          )}`;
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-std5-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-gray-400">
                    {member.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
