import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGift } from 'react-icons/fi'
import { certificates } from '@/data/certificates'

export default function CertificatesSection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="certificates" className="py-20 sm:py-28 bg-cream relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-60 h-60 border border-gold/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-80 h-80 border border-gold/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Идеальный подарок</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-dark font-display mt-3">Подарочные сертификаты</h2>
          <p className="text-charcoal/60 mt-3 max-w-lg mx-auto text-sm">
            Подарите моменты гармонии и уюта своим близким
          </p>
        </motion.div>

        {/* horizontal row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setActive(cert.id)}
              className="group cursor-pointer"
            >
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-500 card-shadow card-shadow-hover"
                style={{ width: '300px', height: '420px' }}
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* subtle gold border */}
                <div className="absolute inset-3 border border-gold/30 rounded-xl pointer-events-none" />

                {/* bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FiGift size={14} className="text-gold-light" />
                    <span className="text-gold-light/70 text-[10px] uppercase tracking-[0.2em] font-medium">Подарочный</span>
                  </div>
                  <h3 className="text-2xl font-display text-white font-semibold drop-shadow-sm">{cert.title}</h3>
                  <p className="text-white/60 text-xs mt-1.5 max-w-[240px] leading-relaxed font-light drop-shadow-sm">
                    {cert.description}
                  </p>
                </div>

                {/* shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            {certificates.filter(c => c.id === active).map(cert => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-md"
              >
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/85" />

                  {/* single clean border */}
                  <div className="absolute inset-5 sm:inset-6 rounded-xl border border-white/15 pointer-events-none" />

                  {/* content */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-7 sm:px-10">
                    <div className="flex-1" />

                    <p className="text-gold-light/80 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium">
                      Gift certificate
                    </p>

                    <div className="w-10 h-px bg-gold-light/40 mx-auto my-5" />

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display text-white font-semibold leading-[1.15]">
                      {cert.title}
                    </h3>

                    <p className="text-white/55 text-xs sm:text-sm mt-4 max-w-[240px] leading-[1.7] font-light">
                      {cert.description}
                    </p>

                    <div className="flex-1" />

                    <div className="w-10 h-px bg-white/15 mx-auto mb-5" />

                    <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] pb-7 sm:pb-8">
                      massage salon
                    </p>
                  </div>

                  <button
                    onClick={() => setActive(null)}
                    className="absolute top-3 right-3 z-20 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex justify-center mt-5"
                >
                  <a
                    href="#contacts"
                    onClick={() => setActive(null)}
                    className="inline-flex items-center gap-2.5 px-8 py-3 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
                  >
                    <FiGift size={15} />
                    Приобрести сертификат
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
