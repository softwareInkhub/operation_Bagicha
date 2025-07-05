import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const banners = [
  {
    tag: 'Limited Time',
    title: 'Gift a Plant, Spread Joy! 🌱',
    subtitle: 'Perfect gifts for plant lovers. Free gift wrapping + care guide included!',
    button: 'Shop Gift Plants',
    gradient: 'from-pink-500 via-orange-400 to-yellow-300',
    icon: (
      <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="7" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
    ),
  },
  {
    tag: 'Hot Deal',
    title: 'Summer Sale – Up to 30% Off! ☀️',
    subtitle: 'Grab your favorite plants at unbeatable prices.',
    button: 'Shop Sale',
    gradient: 'from-yellow-400 via-pink-400 to-red-400',
    icon: (
      <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m6.364 1.636l-1.414 1.414M22 12h-2M19.364 19.364l-1.414-1.414M12 22v-2M4.636 19.364l1.414-1.414M2 12h2M4.636 4.636l1.414 1.414"/></svg>
    ),
  },
  {
    tag: 'Just In',
    title: 'New Arrivals – Trending Plants! 🪴',
    subtitle: 'Discover the latest additions to our collection.',
    button: 'See New Arrivals',
    gradient: 'from-green-400 via-blue-300 to-purple-400',
    icon: (
      <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    ),
  },
];

export default function GiftBannerSlider() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

  // Determine slide direction
  const direction = index > prevIndex || (index === 0 && prevIndex === banners.length - 1) ? 1 : -1;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`relative h-32 min-h-[120px] shadow-lg overflow-hidden transition-all duration-500 bg-gradient-to-br ${banners[index].gradient}`}>
        {/* Glass effect overlay - lighter and beautiful */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-lg z-0 pointer-events-none" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 60 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 * direction }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col justify-center px-6 py-4 text-white items-start z-10"
          >
            <span className="inline-block bg-white/30 text-xs font-semibold px-2 py-0.5 mb-1 w-fit backdrop-blur-sm">{banners[index].tag}</span>
            <div className="font-bold text-sm leading-tight mb-1 flex items-center gap-1 flex-wrap text-left">
              {banners[index].icon}
              <span className="whitespace-normal break-words">{banners[index].title}</span>
            </div>
            <div className="text-xs mb-2 opacity-90 leading-snug whitespace-normal break-words max-w-full text-left">{banners[index].subtitle}</div>
            <button className="mt-auto bg-white text-orange-500 font-semibold text-xs px-2.5 py-1.5 rounded shadow flex items-center gap-1 hover:bg-orange-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="7" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
              {banners[index].button}
            </button>
          </motion.div>
        </AnimatePresence>
        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {banners.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white/90' : 'bg-white/40'} transition-all`}></span>
          ))}
        </div>
      </div>
    </div>
  );
} 