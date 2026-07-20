import { FiPhone, FiMapPin } from 'react-icons/fi'
import logo from '@/assets/gwa.png'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-cream/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-gold/20">
                <img src={logo} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-cream font-display">Marina Yurkova massage</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-cream/50">
              Профессиональный массаж и обучение в Киселёвске. Индивидуальный подход, 
              проверенные техники, комфортная атмосфера.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">Навигация</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Услуги', '#services'],
                ['Акции', '#promotions'],
                ['Обучение', '#training'],
                ['Галерея', '#portfolio'],
                ['Сертификаты', '#certificates'],
                ['Контакты', '#contacts'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="hover:text-cream transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+79050715262" className="flex items-center gap-2 hover:text-cream transition-colors">
                  <FiPhone size={14} className="text-gold shrink-0" />
                  +7 (905) 071-52-62
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin size={14} className="text-gold mt-0.5 shrink-0" />
                <span>г. Киселёвск, ул. 50 лет города, д.7, офис 9</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/30">
          <p>© {new Date().getFullYear()} Массажный кабинет — Марина Юркова</p>
          <p>г. Киселёвск</p>
        </div>
      </div>
    </footer>
  )
}
