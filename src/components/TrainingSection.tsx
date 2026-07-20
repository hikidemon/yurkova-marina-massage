import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload, FiAlertCircle, FiClock, FiUsers, FiSave } from 'react-icons/fi'
import { getTrainings, addTraining, updateTraining, deleteTraining, uploadImage, type Training, type Detail } from '@/api/api'
import { formatDescription } from '@/utils/formatDescription'
import certImage from '@/assets/f1.webp'

const adminKey = import.meta.env.VITE_ADMIN_KEY

export default function TrainingSection() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Training | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDesc, setModalDesc] = useState('')
  const [modalImage, setModalImage] = useState('')
  const [modalPrice, setModalPrice] = useState('')
  const [modalDuration, setModalDuration] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [selectedItem, setSelectedItem] = useState<Training | null>(null)
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

  const fetch = useCallback(async () => {
    try {
      const data = await getTrainings()
      setTrainings(data)
    } catch {
      setError('Не удалось загрузить программы обучения')
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  function openNew() {
    setEditingItem(null)
    setIsNew(true)
    setModalTitle('')
    setModalDesc('')
    setModalImage('')
    setModalPrice('')
    setModalDuration('')
    setUploadedFile(null)
    setShowModal(true)
  }

  function openEdit(t: Training) {
    setEditingItem(t)
    setIsNew(false)
    setModalTitle(t.title)
    setModalDesc(t.description)
    setModalImage(t.image)
    setModalPrice(t.price)
    setModalDuration(t.duration)
    setUploadedFile(null)
    setShowModal(true)
  }

  async function handleSave() {
    const image = uploadedFile ? await uploadImage(uploadedFile) : modalImage
    if (isNew) {
      await addTraining({ title: modalTitle, description: modalDesc, image, price: modalPrice, duration: modalDuration, details: [] })
    } else if (editingItem) {
      await updateTraining(editingItem.id, { title: modalTitle, description: modalDesc, image, price: modalPrice, duration: modalDuration })
    }
    setShowModal(false)
    fetch()
  }

  async function handleDelete(id: number) {
    if (confirm('Удалить программу обучения?')) {
      await deleteTraining(id)
      fetch()
    }
  }

  function openDetails(t: Training) {
    setSelectedItem(t)
    setDetails(t.details ? [...t.details] : [])
    setNewDetail({ name: '', duration: '', price: '' })
    setEditingDetailIndex(null)
    setDetailsDirty(false)
    setShowDetailModal(true)
  }

  async function handleSaveDetails() {
    if (!selectedItem) return
    setSaving(true)
    try {
      const updated = await updateTraining(selectedItem.id, { details } as Partial<Training>)
      setSelectedItem(updated)
      setTrainings(prev => prev.map(s => s.id === updated.id ? updated : s))
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
    <section id="training" className="py-20 sm:py-28 bg-cream-light relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Обучение массажу</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-dark font-display mt-3">Станьте профессионалом</h2>
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
              <FiPlus /> Добавить программу
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trainings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                onClick={() => openDetails(item)}
                className="group bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover cursor-pointer border border-sage/10"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-display text-brand-dark font-semibold">{item.title}</h3>
                    {item.duration && (
                      <span className="text-lg font-display font-bold text-gold tracking-wide whitespace-nowrap shrink-0 leading-none mt-0.5">
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-sm text-charcoal/60 leading-relaxed line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: formatDescription(item.description) }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    {item.price && (
                      <span className="text-gold font-semibold text-sm">{item.price} ₽</span>
                    )}
                    <span className="text-xs text-brand/60 font-medium flex items-center gap-1">
                      <FiUsers size={12} /> Подробнее →
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="mt-3 pt-3 border-t border-sage/10 flex gap-2">
                      <button onClick={e => { e.stopPropagation(); openEdit(item) }}
                        className="flex items-center gap-1 text-xs text-charcoal/50 hover:text-brand transition-colors px-2 py-1">
                        <FiEdit2 size={12} /> Редактировать
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#contacts"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-cream-light font-semibold rounded-full hover:bg-brand-light transition-all shadow-md text-sm"
          >
            Записаться на обучение
          </a>
        </motion.div>
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
                <h3 className="text-xl font-display text-brand-dark">{isNew ? 'Новая программа' : 'Редактировать'}</h3>
                <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal"><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Название</label>
                  <input value={modalTitle} onChange={e => setModalTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Стоимость (₽)</label>
                    <input value={modalPrice} onChange={e => setModalPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Длительность</label>
                    <input value={modalDuration} onChange={e => setModalDuration(e.target.value)} placeholder="например: 3 месяца"
                      className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Описание</label>
                  <textarea value={modalDesc} onChange={e => setModalDesc(e.target.value)} rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none" />
                  <p className="text-xs text-charcoal/40 mt-1.5">**жирный**, *курсив*, __подчеркнутый__, - подпункт</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">Изображение</label>
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); setUploadedFile(e.dataTransfer.files[0]) }}
                    className="border-2 border-dashed border-sage/30 rounded-xl p-6 text-center hover:border-brand/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('training-image-upload')?.click()}
                  >
                    <input id="training-image-upload" type="file" accept="image/*" className="hidden"
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
        {showDetailModal && selectedItem && (
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
                {selectedItem.image && (
                  <div className="aspect-[16/7] overflow-hidden">
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {selectedItem.price && (
                      <span className="px-3 py-1 bg-gold/15 text-gold font-semibold text-sm rounded-full">{selectedItem.price} ₽</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-display text-brand-dark">{selectedItem.title}</h3>
                    {selectedItem.duration && (
                      <span className="text-2xl font-display font-bold text-gold tracking-wide whitespace-nowrap shrink-0 leading-none">
                        {selectedItem.duration}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-charcoal/70 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: formatDescription(selectedItem.description) }} />

                  <div className="border-t border-sage/15 pt-6">
                    <div
                      className="rounded-xl overflow-hidden card-shadow select-none relative bg-cream print:hidden"
                      onContextMenu={e => e.preventDefault()}
                      style={{ aspectRatio: '16/11', backgroundImage: `url(${certImage})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                    >
                      <div className="absolute inset-0" style={{ userSelect: 'none', WebkitUserSelect: 'none' }} />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                        <span className="text-white/20 text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-[0.25em] -rotate-[25deg] whitespace-nowrap select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                          СЕРТИФИКАТ
                        </span>
                      </div>
                      <div className="absolute inset-0 pointer-events-none select-none" style={{
                        userSelect: 'none', WebkitUserSelect: 'none',
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 80px)'
                      }} />
                    </div>
                    <p className="text-xs text-charcoal/50 text-center mt-3 leading-relaxed">
                      После прохождения мастер-класса по массажу выдается сертификат участника
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#contacts"
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2.5 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all">
                      Записаться на обучение
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
