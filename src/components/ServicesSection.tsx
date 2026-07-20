import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiAlertCircle } from 'react-icons/fi'
import { getServices, addService, updateService, deleteService, uploadImage, getServiceDuration, setServiceDuration, type Service } from '@/api/api'
import { formatDescription } from '@/utils/formatDescription'

const adminKey = import.meta.env.VITE_ADMIN_KEY

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDesc, setModalDesc] = useState('')
  const [modalImage, setModalImage] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [modalDuration, setModalDuration] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === adminKey) setIsAdmin(true)
  }, [])

  const fetchServices = useCallback(async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch {
      setError('Не удалось загрузить услуги')
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  function openNew() {
    setEditingService(null)
    setIsNew(true)
    setModalTitle('')
    setModalDesc('')
    setModalImage('')
    setModalDuration('')
    setUploadedFile(null)
    setShowModal(true)
  }

  function openEdit(s: Service) {
    setEditingService(s)
    setIsNew(false)
    setModalTitle(s.title)
    setModalDesc(s.description)
    setModalImage(s.image)
    setModalDuration(getServiceDuration(s))
    setUploadedFile(null)
    setShowModal(true)
  }

  async function handleSave() {
    const image = uploadedFile ? await uploadImage(uploadedFile) : modalImage
    if (isNew) {
      const details = setServiceDuration([], modalDuration)
      await addService({ title: modalTitle, description: modalDesc, image, price: '', details })
    } else if (editingService) {
      const details = setServiceDuration(editingService.details || [], modalDuration)
      await updateService(editingService.id, { title: modalTitle, description: modalDesc, image, details })
    }
    setShowModal(false)
    fetchServices()
  }

  async function handleDelete(id: number) {
    if (confirm('Удалить услугу?')) {
      await deleteService(id)
      fetchServices()
    }
  }

  function openDetails(s: Service) {
    setSelectedService(s)
    setShowDetailModal(true)
  }

  return (
    <section id="services" className="py-20 sm:py-28 bg-cream relative">
      <style>{`
        .fmt-subitem {
          display: block;
          padding-left: 1.25rem;
          position: relative;
          margin: 0;
          color: rgba(40,35,30,0.7);
          font-size: 0.875rem;
          line-height: 1.4;
        }
        .fmt-subitem::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b8944c;
        }
        .fmt-subheading {
          font-family: var(--font-display, 'Georgia', serif);
          color: #2b2925;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        h2.fmt-subheading { font-size: 1.25rem; }
        h3.fmt-subheading { font-size: 1.1rem; }
        h4.fmt-subheading { font-size: 1rem; }
        .fmt-underline {
          text-decoration: underline;
          text-decoration-color: #b8944c;
          text-underline-offset: 2px;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Что мы предлагаем</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-dark font-display mt-3">Наши услуги</h2>
          <p className="text-charcoal/60 mt-3 max-w-lg mx-auto">
            Профессиональный массаж для оздоровления и расслабления
          </p>
        </motion.div>

        {error && (
          <div className="flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-3 rounded-xl mb-8 text-sm max-w-xl mx-auto">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {isAdmin && (
          <div className="text-center mb-10">
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-cream-light rounded-full text-sm font-semibold hover:bg-brand-light transition-all"
            >
              <FiPlus /> Добавить услугу
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                onClick={() => openDetails(service)}
                className="group bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover cursor-pointer border border-sage/10"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-display text-brand-dark font-semibold">{service.title}</h3>
                    {getServiceDuration(service) && (
                      <span className="text-lg font-display font-bold text-gold tracking-wide whitespace-nowrap shrink-0 leading-none mt-0.5">
                        {getServiceDuration(service)}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-sm text-charcoal/60 leading-relaxed line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: formatDescription(service.description) }}
                  />
                  {service.price && (
                    <p className="mt-3 text-gold font-semibold text-sm">от {service.price} ₽</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-sage/10">
                    <span className="text-xs text-brand/60 font-medium flex items-center gap-1">
                      Подробнее
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="mt-3 pt-3 border-t border-sage/10 flex gap-2">
                      <button onClick={e => { e.stopPropagation(); openEdit(service) }}
                        className="flex items-center gap-1 text-xs text-charcoal/50 hover:text-brand transition-colors px-2 py-1">
                        <FiEdit2 size={12} /> Редактировать
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(service.id) }}
                        className="flex items-center gap-1 text-xs text-charcoal/50 hover:text-terracotta transition-colors px-2 py-1">
                        <FiTrash2 size={12} /> Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-cream-light rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display text-brand-dark">{isNew ? 'Новая услуга' : 'Редактировать'}</h3>
                <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal"><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Название</label>
                  <input value={modalTitle} onChange={e => setModalTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Описание</label>
                  <textarea value={modalDesc} onChange={e => setModalDesc(e.target.value)} rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none" />
                  <p className="text-xs text-charcoal/40 mt-1.5">**жирный**, *курсив*, __подчеркнутый__, - подпункт</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Длительность сеанса</label>
                  <input value={modalDuration} onChange={e => setModalDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" placeholder="например: 60 мин" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Изображение</label>
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); setUploadedFile(e.dataTransfer.files[0]) }}
                    className="border-2 border-dashed border-sage/30 rounded-xl p-6 text-center hover:border-brand/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('service-image-upload')?.click()}
                  >
                    <input id="service-image-upload" type="file" accept="image/*" className="hidden"
                      onChange={e => setUploadedFile(e.target.files?.[0] || null)} />
                    {uploadedFile || modalImage ? (
                      <div className="relative">
                        <img src={uploadedFile ? URL.createObjectURL(uploadedFile) : modalImage}
                          alt="preview" className="max-h-32 mx-auto rounded-lg" />
                        <p className="text-xs text-charcoal/40 mt-2">Нажмите чтобы изменить</p>
                      </div>
                    ) : (
                      <div className="text-charcoal/40">
                        <FiUpload size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Перетащите файл или нажмите для выбора</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm text-charcoal/60 hover:text-charcoal border border-sage/30 rounded-xl hover:bg-sage/5 transition-all">Отмена</button>
                <button onClick={handleSave}
                  className="px-6 py-2.5 bg-brand text-cream-light text-sm font-semibold rounded-xl hover:bg-brand-light transition-all flex items-center gap-2">
                  <FiCheck /> {isNew ? 'Создать' : 'Сохранить'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailModal && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-cream-light rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="overflow-y-auto">
                {selectedService.image && (
                  <div className="aspect-[16/7] overflow-hidden">
                    <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-display text-brand-dark">{selectedService.title}</h3>
                    {getServiceDuration(selectedService) && (
                      <span className="text-2xl font-display font-bold text-gold tracking-wide whitespace-nowrap shrink-0 leading-none">
                        {getServiceDuration(selectedService)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-charcoal/70 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: formatDescription(selectedService.description) }} />

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#contacts"
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2.5 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all">
                      Записаться
                    </a>
                    <button onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2.5 border border-sage/30 text-charcoal/60 rounded-full text-sm hover:bg-sage/5 transition-all">
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
