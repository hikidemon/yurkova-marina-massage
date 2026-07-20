import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import logo from '@/assets/gwa.png'

const navItems = [
  { label: 'Главная', href: '#hero' },
  { label: 'Услуги', href: '#services' },
  { label: 'Акции', href: '#promotions' },
  { label: 'Обучение', href: '#training' },
  { label: 'Галерея', href: '#portfolio' },
  { label: 'Сертификаты', href: '#certificates' },
  { label: 'Контакты', href: '#contacts' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-light/85 backdrop-blur-xl shadow-[0_1px_0_rgba(26,34,38,0.06)]'
          : 'bg-gradient-to-b from-black/20 to-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 sm:gap-3 group">
          <img src={logo} alt="Массажный кабинет" className="h-8 sm:h-10 w-auto rounded-full ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold font-display leading-tight tracking-wide" style={{ color: scrolled ? '#1A2226' : '#F8F4EF' }}>Marina Yurkova massage</p>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm rounded-lg transition-all duration-300"
              style={{
                color: scrolled ? 'rgba(22,20,18,0.7)' : 'rgba(248,244,239,0.85)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = scrolled ? 'rgba(26,34,38,0.05)' : 'rgba(248,244,239,0.1)'; e.currentTarget.style.color = scrolled ? '#1A2226' : '#F8F4EF' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = scrolled ? 'rgba(22,20,18,0.7)' : 'rgba(248,244,239,0.85)' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacts"
            className="ml-3 px-5 py-2.5 bg-gold text-charcoal text-sm font-semibold rounded-full hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Записаться
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: scrolled ? '#161412' : '#F8F4EF' }}
          aria-label="Меню"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-cream-light/95 backdrop-blur-xl border-t border-sage/20 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-charcoal/80 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contacts"
                onClick={() => setMenuOpen(false)}
                className="block mt-3 px-4 py-3 bg-gold text-charcoal text-center font-semibold rounded-xl"
              >
                Записаться
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
