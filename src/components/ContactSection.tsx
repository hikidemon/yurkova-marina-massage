import { motion } from 'framer-motion'
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi'

export default function ContactSection() {
  return (
    <section id="contacts" className="py-20 sm:py-28 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #D49A6A 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Свяжитесь с нами</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-cream-light font-display mt-3">Контакты</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display text-gold mb-8">Юркова Марина Анатольевна</h3>

            <div className="space-y-6">
              <a href="tel:+79050715262" className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-brand/30 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <FiPhone className="text-gold" size={18} />
                </div>
                <div>
                  <p className="text-sm text-cream/50 uppercase tracking-wider">Телефон</p>
                  <p className="text-cream-light font-semibold text-lg group-hover:text-gold transition-colors">+7 (905) 071-52-62</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand/30 flex items-center justify-center shrink-0">
                  <FiMapPin className="text-gold" size={18} />
                </div>
                <div>
                  <p className="text-sm text-cream/50 uppercase tracking-wider">Адрес</p>
                  <p className="text-cream-light font-semibold">г. Киселёвск, ул. 50 лет города, д.7, офис 9</p>
                  <p className="text-cream/60 text-sm mt-0.5">3 этаж</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand/30 flex items-center justify-center shrink-0">
                  <FiClock className="text-gold" size={18} />
                </div>
                <div>
                  <p className="text-sm text-cream/50 uppercase tracking-wider">Режим работы</p>
                  <p className="text-cream-light font-semibold">По записи</p>
                  <p className="text-cream/60 text-sm mt-0.5">Звоните — договоримся об удобном времени</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-brand/20 rounded-2xl border border-brand/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/30" />
              <p className="text-cream/80 text-sm leading-relaxed pl-3">
                Я — дипломированный специалист с многолетним опытом в массаже. 
                Использую только профессиональные техники и индивидуальный подход 
                к каждому клиенту. Приходите — я помогу вам расслабиться, 
                восстановить силы и улучшить самочувствие.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+79050715262"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all shadow-lg text-sm"
              >
                <FiPhone size={16} />
                Позвонить сейчас
              </a>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl h-[400px] lg:h-[500px] ring-1 ring-white/10"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2345.133806838386!2d86.5541877767999!3d54.00040047248616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x42da0052e3b830cd%3A0x8c5a5127616be9b6!2sAssol%2C%20hotel%20and%20recreation%20complex!5e0!3m2!1sen!2sru!4v1784475110041!5m2!1sen!2sru"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Массажный кабинет на карте"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
