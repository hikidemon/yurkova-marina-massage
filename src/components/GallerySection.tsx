import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi'

const imageModules = import.meta.glob('/src/assets/z*.webp', { eager: true, query: '?url', import: 'default' })
const galleryImages = Object.values(imageModules).filter(Boolean) as string[]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const imageCache = new Map<string, string>()

function getRatio(url: string): string {
  if (imageCache.has(url)) return imageCache.get(url)!
  return '3/4'
}

function preloadImage(url: string): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const r = img.naturalWidth / img.naturalHeight
      const ratio = `${Math.round(r * 100)}/${100}`
      imageCache.set(url, ratio)
      resolve(ratio)
    }
    img.onerror = () => resolve('3/4')
    img.src = url
  })
}

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [, forceRender] = useState(0)
  const loaded = useRef(0)

  useEffect(() => {
    let cancelled = false
    Promise.all(galleryImages.map(url => preloadImage(url))).then(() => {
      if (!cancelled) { setReady(true); forceRender(n => n + 1) }
    })
    return () => { cancelled = true }
  }, [])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev + 1) % galleryImages.length : 0)
  }, [])

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-[#1A2226] relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0 !opacity-[0.08]" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-cream-light font-display mt-3">Портфолио</h2>
          <p className="text-gold/70 mt-3 text-sm">Мои дипломы и сертификаты</p>

        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 lg:gap-5"
        >
          {galleryImages.map((src, i) => {
            return (
              <motion.button
                key={i}
                variants={itemVariants}
                onClick={() => openLightbox(i)}
                className="break-inside-avoid mb-3 sm:mb-4 lg:mb-5 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold w-full"
              >
                <div
                  className="relative w-full rounded-xl overflow-hidden card-shadow transition-shadow duration-500 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  style={{ aspectRatio: getRatio(src) }}
                >
                  <img
                    src={src}
                    alt={`Фото салона ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-gold/40 transition-all duration-500 pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm text-white/50 group-hover:text-gold text-[10px] font-mono font-medium transition-all duration-400">
                      {i + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
                    <div className="p-1.5 bg-white/15 backdrop-blur-md rounded-full transition-transform duration-400 group-hover:scale-110">
                      <FiMaximize2 size={11} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="#contacts"
            className="inline-flex px-8 py-3 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all shadow-lg"
          >
            Записаться на массаж
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              aria-label="Закрыть"
            >
              <FiX size={22} />
            </button>

            <button
              onClick={e => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              aria-label="Предыдущее"
            >
              <FiChevronLeft size={22} />
            </button>

            <button
              onClick={e => { e.stopPropagation(); goNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              aria-label="Следующее"
            >
              <FiChevronRight size={22} />
            </button>

            <div
              onClick={e => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] mx-4"
            >
              <img
                src={galleryImages[lightboxIndex]}
                alt={`Фото салона ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg">
                <p className="text-white/80 text-sm text-center">
                  {lightboxIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
