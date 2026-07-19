import { useState } from 'react'
import { motion } from 'framer-motion'
import heroBg from '@/assets/q2.avif'
import logoBadge from '@/assets/gwa.png'

export default function HeroSection() {
  const [badgeHover, setBadgeHover] = useState(false)

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-700"
          style={{ filter: 'brightness(0.3) saturate(0.9) contrast(1.1)', opacity: badgeHover ? 1 : 0 }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#1A2226] to-brand transition-opacity duration-700"
          style={{ opacity: badgeHover ? 0 : 1 }}
        />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #D49A6A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-8 bg-gold/60" />
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-medium">Массажный кабинет</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream-light font-display leading-[1.1] mb-4"
            >
              Юркова
              <br />
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">Марина Анатольевна</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base sm:text-lg text-cream/60 leading-relaxed mb-8 max-w-md font-light"
            >
              Профессиональный массаж для вашего здоровья и гармонии. 
              Индивидуальный подход, проверенные техники, атмосфера уюта.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#services"
                className="px-8 py-3.5 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gold/20 text-sm"
              >
                Наши услуги
              </a>
              <a
                href="#contacts"
                className="px-8 py-3.5 border border-cream/20 text-cream-light font-semibold rounded-full hover:bg-cream/10 transition-all duration-300 text-sm backdrop-blur-sm"
              >
                Записаться
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 flex items-center gap-6 text-cream/40 text-xs"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
                г. Киселёвск
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
                по записи
              </span>
              <a href="tel:+79050715262" className="flex items-center gap-2 hover:text-gold transition-colors">
                <span className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
                +7 (905) 071-52-62
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            className="hidden lg:flex justify-center items-center"
          >
            <motion.a
              href="#services"
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setBadgeHover(true)}
              onMouseLeave={() => setBadgeHover(false)}
              className="relative block cursor-pointer"
            >
              <motion.div
                whileTap={{
                  boxShadow: '0 0 80px 30px rgba(212, 154, 106, 0.5), 0 0 150px 60px rgba(212, 154, 106, 0.2)',
                }}
                className="relative flex items-center justify-center"
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    variants={{
                      animate: {
                        scale: [1, 2.5],
                        opacity: [0.4, 0],
                      },
                    }}
                    animate="animate"
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      delay: i * 0.6,
                      ease: 'easeOut',
                    }}
                    className="absolute w-72 h-72 rounded-full border border-gold/20"
                  />
                ))}

                <div className="absolute -inset-6 rounded-full bg-gold/10 blur-2xl transition-opacity duration-700"
                  style={{ opacity: badgeHover ? 0.6 : 0 }}
                />

                <div className="relative w-80 h-80 p-[10px]">
                  <img
                    src={logoBadge}
                    alt="Массажный кабинет Марины Юрковой"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#services" className="text-cream/20 hover:text-cream/40 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
