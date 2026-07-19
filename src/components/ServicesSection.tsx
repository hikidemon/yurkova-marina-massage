import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiAlertCircle, FiSave } from 'react-icons/fi'
import { getServices, addService, updateService, deleteService, uploadImage, type Service, type Detail } from '@/api/api'
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
  const [details, setDetails] = useState<Detail[]>([])
  const [newDetail, setNewDetail] = useState<Detail>({ name: '', duration: '', price: '' })
  const [editingDetailIndex, setEditingDetailIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [detailsDirty, setDetailsDirty] = useState(false)

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
    setUploadedFile(null)
    setShowModal(true)
  }

  function openEdit(s: Service) {
    setEditingService(s)
    setIsNew(false)
    setModalTitle(s.title)
    setModalDesc(s.description)
    setModalImage(s.image)
    setUploadedFile(null)
    setShowModal(true)
  }

  async function handleSave() {
    const image = uploadedFile ? await uploadImage(uploadedFile) : modalImage
    if (isNew) {
      await addService({ title: modalTitle, description: modalDesc, image, price: '', details: [] })
    } else if (editingService) {
      await updateService(editingService.id, { title: modalTitle, description: modalDesc, image })
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
    setDetails(s.details ? [...s.details] : [])
    setNewDetail({ name: '', duration: '', price: '' })
    setEditingDetailIndex(null)
    setDetailsDirty(false)
    setShowDetailModal(true)
  }

  async function handleSaveDetails() {
    if (!selectedService) return
    setSaving(true)
    try {
      const updated = await updateService(selectedService.id, { details } as Partial<Service>)
      setSelectedService(updated)
      setServices(prev => prev.map(s => s.id === updated.id ? updated : s))
    } catch (err) {
      console.error('Ошибка сохранения деталей:', err)
    } finally {
      setSaving(false)
    }
  }

  function handleAddDetail() {
    if (!newDetail.name.trim() && !newDetail.duration.trim() && !newDetail.price.trim()) return
    setDetails(prev => [...prev, { ...newDetail }])
    setNewDetail({ name: '', duration: '', price: '' })
    setDetailsDirty(true)
  }

  function handleDeleteDetail(index: number) {
    setDetails(prev => prev.filter((_, i) => i !== index))
    setDetailsDirty(true)
  }

  function handleUpdateDetail(index: number, field: keyof Detail, value: string) {
    setDetails(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
    setDetailsDirty(true)
  }

  return (
    <section id="services" className="py-20 sm:py-28 bg-cream relative">
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
                  <h3 className="text-lg font-display text-brand-dark font-semibold mb-2">{service.title}</h3>
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
                  <h3 className="text-2xl font-display text-brand-dark mb-3">{selectedService.title}</h3>
                  <div className="text-sm text-charcoal/70 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: formatDescription(selectedService.description) }} />

                  <div className="border-t border-sage/15 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Программы</h4>
                      {details.length > 0 && (
                        <span className="text-xs text-charcoal/40">{details.length} позиций</span>
                      )}
                    </div>

                    {details.length > 0 ? (
                      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scroll">
                        <div className="hidden sm:grid sm:grid-cols-[1fr_0.7fr_2fr_auto] gap-3 px-4 py-2 text-xs text-charcoal/40 uppercase tracking-wider font-medium sticky top-0 bg-cream-light z-10">
                          <span>Название</span>
                          <span>Время</span>
                          <span>Описание</span>
                          {isAdmin && <span className="text-center">Действия</span>}
                        </div>
                        {details.map((d, i) => (
                          <div key={i}
                            className={`grid grid-cols-1 sm:grid-cols-[1fr_0.7fr_2fr_auto] gap-2 sm:gap-3 py-3 px-4 rounded-xl transition-colors ${
                              editingDetailIndex === i ? 'bg-brand/5 ring-1 ring-brand/20' : 'bg-cream hover:bg-cream/80'
                            }`}
                          >
                            {editingDetailIndex === i ? (
                              <>
                                <input value={d.name} onChange={e => handleUpdateDetail(i, 'name', e.target.value)}
                                  className="px-3 py-1.5 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full" placeholder="Название" />
                                <input value={d.duration} onChange={e => handleUpdateDetail(i, 'duration', e.target.value)}
                                  className="px-3 py-1.5 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full" placeholder="мин" />
                                <textarea value={d.price} onChange={e => handleUpdateDetail(i, 'price', e.target.value)} rows={2}
                                  className="px-3 py-1.5 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none w-full" placeholder="Описание процедуры" />
                                <div className="flex gap-1 items-center">
                                  <button onClick={() => setEditingDetailIndex(null)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><FiCheck size={14} /></button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="min-w-0">
                                  <span className="text-xs text-charcoal/40 sm:hidden">Название: </span>
                                  <span className="font-medium text-charcoal text-sm break-words">{d.name}</span>
                                </div>
                                <div>
                                  <span className="text-xs text-charcoal/40 sm:hidden">Время: </span>
                                  <span className="text-brand text-sm whitespace-nowrap">{d.duration} мин</span>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs text-charcoal/40 sm:hidden">Описание: </span>
                                  <span className="text-charcoal/70 text-sm break-words line-clamp-2">{d.price || '—'}</span>
                                </div>
                                {isAdmin && (
                                  <div className="flex gap-1 items-center sm:justify-center">
                                    <button onClick={() => setEditingDetailIndex(i)}
                                      className="p-1.5 text-charcoal/40 hover:text-brand hover:bg-brand/5 rounded-lg transition-all shrink-0"><FiEdit2 size={13} /></button>
                                    <button onClick={() => handleDeleteDetail(i)}
                                      className="p-1.5 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-all shrink-0"><FiTrash2 size={13} /></button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-charcoal/40 text-sm bg-cream rounded-xl">
                        <p>Нет добавленных программ</p>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="mt-4 p-4 bg-brand/5 rounded-xl border border-dashed border-brand/20">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
                          <input value={newDetail.name} onChange={e => setNewDetail({ ...newDetail, name: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full" placeholder="Название" />
                          <input value={newDetail.duration} onChange={e => setNewDetail({ ...newDetail, duration: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-full" placeholder="Время (мин)" />
                          <textarea value={newDetail.price} onChange={e => setNewDetail({ ...newDetail, price: e.target.value })} rows={2}
                            className="px-3 py-2 rounded-lg border border-sage/20 bg-white text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none w-full" placeholder="Описание процедуры" />
                          <button onClick={handleAddDetail}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand text-cream-light text-sm font-medium rounded-lg hover:bg-brand-light transition-all">
                            <FiPlus size={14} /> Добавить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#contacts"
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2.5 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all">
                      Записаться
                    </a>
                    {isAdmin && detailsDirty && (
                      <button onClick={handleSaveDetails} disabled={saving}
                        className="px-6 py-2.5 bg-brand text-cream-light font-semibold rounded-full text-sm hover:bg-brand-light transition-all flex items-center gap-2 disabled:opacity-50">
                        <FiSave size={14} /> {saving ? 'Сохранение...' : 'Сохранить изменения'}
                      </button>
                    )}
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
