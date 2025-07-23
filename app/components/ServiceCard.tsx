import { motion } from "framer-motion";
import {
  Clapperboard,
  Mic2,
  PaintBucket,
  Sparkles,
  Computer,
  UtensilsCrossed
} from "lucide-react";
import React, { memo } from "react";

// Service icon mapping for performance
const SERVICE_ICONS = {
  // Turkish
  'Kurgu': Clapperboard,
  'Ses Tasarımı ve Dublaj': Mic2,
  'Renk Tasarımı': PaintBucket,
  'Görsel Efektler': Sparkles,
  'Özel Post Setleri': Computer,
  'Kafe': UtensilsCrossed,

  // English
  'Editing': Clapperboard,
  'Sound Design & Dubbing': Mic2,
  'Color Design': PaintBucket,
  'Visual Effects': Sparkles,
  'Special Post Production': Computer,
  'Cafe': UtensilsCrossed,

  // French
  'Montage': Clapperboard,
  'Design Sonore et Doublage': Mic2,
  'Design Couleur': PaintBucket,
  'Effets Visuels': Sparkles,
  'Post-Production Spéciale': Computer,
  'Café': UtensilsCrossed,

  // Spanish
  'Edición': Clapperboard,
  'Diseño de Sonido y Doblaje': Mic2,
  'Diseño de Color': PaintBucket,
  'Efectos Visuales': Sparkles,
  'Post-Producción Especial': Computer,

  // Arabic
  'التحرير': Clapperboard,
  'تصميم الصوت والدبلجة': Mic2,
  'تصحيح الألوان': PaintBucket,
  'المؤثرات البصرية': Sparkles,
  'مجموعات ما بعد الإنتاج الخاصة': Computer,
  'المقهى': UtensilsCrossed,
};

export interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    color: string;
  };
  index: number;
}

const ServiceCard = memo(({ service, index }: ServiceCardProps) => {
  const IconComponent = SERVICE_ICONS[service.title as keyof typeof SERVICE_ICONS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 group hover:bg-white/5 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: service.color }}
        >
          {IconComponent && <IconComponent className="w-4 h-4 md:w-6 md:h-6 text-white" />}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-std5-accent transition-colors duration-300">
          {service.title}
        </h3>
      </div>
      <div className="text-sm leading-relaxed">
        {service.description.split('\n').map((text: string, i: number) => (
          <p key={i} className={i === 0 ? 'text-gray-300 mb-2' : 'text-gray-500 text-xs italic flex items-center'}>
            {i === 0 ? text : (
              <>
                <span className="mr-2 text-gray-500">•</span>
                {text.replace(/^• /, '')}
              </>
            )}
          </p>
        ))}
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
