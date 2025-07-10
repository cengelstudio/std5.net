import { motion } from "framer-motion";
import {
  Film,
  Music,
  Palette,
  Wand2,
  MonitorPlay,
  Coffee,
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
  'Montage': Clapperboard,
  'Editing': Clapperboard,
  'Design Sonore et Doublage': Mic2,
  'Sound Design & Dubbing': Mic2,
  'Ses Tasarımı ve Seslendirme': Mic2,
  'Design Couleur': PaintBucket,
  'Color Design': PaintBucket,
  'Renk Tasarımı': PaintBucket,
  'Effets Visuels': Sparkles,
  'Visual Effects': Sparkles,
  'Görsel Efektler': Sparkles,
  'Post-Production Spéciale': Computer,
  'Special Post Production': Computer,
  'Özel Post Prodüksiyon': Computer,
  'Café': UtensilsCrossed,
  'Cafe': UtensilsCrossed,
  'Kafe': UtensilsCrossed,
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
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: service.color }}
      >
        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-std5-accent transition-colors duration-300">
        {service.title}
      </h3>
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
