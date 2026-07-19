import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPercent } from 'react-icons/fi'
import { promotions } from '@/data/promotions'

export default function PromotionsSection() {
  const [activePromo, setActivePromo] = useState<number | null>(null)

  return (
    <section id="promotions" className="py-20 sm:py-28 bg-cream-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Специальные предложения</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-dark font-display mt-3">Акции</h2>
          <p className="text-charcoal/60 mt-3 max-w-lg mx-auto text-sm">
            Выгодные предложения для вашего здоровья и красоты
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={() => setActivePromo(promotions[0].id)}
          className="group cursor-pointer max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden card-shadow card-shadow-hover h-[50vh]">
            <img
              src={promotions[0].image}
              alt={promotions[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/60" />

            {/* gold border */}
            <div className="absolute inset-3 rounded-xl border border-gold/25 pointer-events-none" />

            {/* discount badge */}
            <div className="absolute top-4 sm:top-5 right-4 sm:right-5">
              <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-lg">{promotions[0].icon}</span>
              </div>
            </div>

            {/* content */}
            <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FiPercent size={13} className="text-gold-light" />
                  <span className="text-gold-light/60 text-[10px] uppercase tracking-[0.2em] font-medium">Акция</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-display text-white font-semibold drop-shadow-sm">{promotions[0].title}</h3>
                <p className="text-white/60 text-xs sm:text-sm mt-2 leading-relaxed drop-shadow-sm max-w-[90%] sm:max-w-[80%]">{promotions[0].description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-gold/40" />
                  <span className="text-xs text-gold/50 uppercase tracking-wider font-medium">Подробнее</span>
                </div>
              </div>
            </div>

            {/* shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {activePromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActivePromo(null)}
          >
            {promotions.filter(p => p.id === activePromo).map(promo => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-lg"
                style={{ aspectRatio: '4/5' }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />

                  {/* frame */}
                  <div className="absolute inset-5 sm:inset-7 rounded-xl border border-gold/40 pointer-events-none" />

                  {/* corner ornaments */}
                  {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map(pos => (
                    <div key={pos} className={`absolute ${pos} w-12 h-12 sm:w-14 sm:h-14 pointer-events-none`}>
                      <svg viewBox="0 0 64 64" className="w-full h-full text-gold/40">
                        <path
                          d={pos.includes('top') && pos.includes('left')
                            ? 'M56 8 L56 0 L0 0 L0 56 L8 56'
                            : pos.includes('top') && pos.includes('right')
                            ? 'M8 8 L8 0 L64 0 L64 56 L56 56'
                            : pos.includes('bottom') && pos.includes('left')
                            ? 'M56 56 L56 64 L0 64 L0 8 L8 8'
                            : 'M8 56 L8 64 L64 64 L64 8 L56 8'}
                          stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  ))}

                  {/* content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 sm:px-12">
                    <span className="text-4xl mb-4">{promo.icon}</span>

                    <p className="text-gold-light/70 text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-3 font-medium">
                      Специальное предложение
                    </p>

                    <div className="w-12 h-px bg-gold/40 mx-auto mb-5" />

                    <h3 className="text-2xl sm:text-3xl font-display text-white font-semibold leading-tight drop-shadow-md">
                      {promo.title}
                    </h3>

                    <p className="text-white/60 text-xs sm:text-sm mt-4 max-w-[280px] leading-relaxed drop-shadow-sm">
                      {promo.description}
                    </p>

                    <div className="w-12 h-px bg-gold/30 mx-auto mt-8 mb-5" />

                    <p className="text-gold-light/40 text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
                      massage salon
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePromo(null)}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="flex justify-center gap-3 mt-5">
                  <a
                    href="#contacts"
                    onClick={() => setActivePromo(null)}
                    className="inline-flex items-center gap-2 px-7 py-2.5 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all shadow-md"
                  >
                    Записаться
                  </a>
                  <button
                    onClick={() => setActivePromo(null)}
                    className="px-6 py-2.5 border border-white/20 text-white/70 rounded-full text-sm hover:bg-white/10 transition-all"
                  >
                    Закрыть
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
