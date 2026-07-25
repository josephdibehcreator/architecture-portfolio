'use client'

import { useState, useEffect, useRef } from 'react'
import { UploadCloud, Lock, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './InquirySection.module.css'
import { 
  createInquiryIdentity, 
  updateInquiryContext, 
  updateInquiryPath, 
  submitGeneralInquiry,
  updateConsultationDetails,
  saveBusinessBilling,
  getBookedSlots
} from '@/services/inquiries'
import { createCheckoutSession } from '@/services/stripe'

const services = [
  'Architecture',
  'Interior Design',
  'Landscaping',
  'Architecture Photography',
  '3D Scanning',
  'Branding',
  'Déclaration Préalable',
]

interface InquirySectionProps {
  sectionNumber?: number
}

interface CalendarSlot {
  date: Date
  isoDate: string
  label: string
  time: string
}

const normalizeVat = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '')
const normalizeSiretDigits = (value: string) => value.replace(/\D/g, '')

export default function InquirySection({ sectionNumber }: InquirySectionProps = {}) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPath, setSelectedPath] = useState<'general' | 'consult' | ''>('')
  const [inquiryId, setInquiryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('') // stores ISO date (YYYY-MM-DD)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set())
  const [loadingBookedSlots, setLoadingBookedSlots] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    clientType: 'private' as 'private' | 'business',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    selectedServices: [] as string[],
    budget: '',
    timeline: 'asap' as 'asap' | '3m' | '6m' | '1y',
    surface: '',
    description: '',
    duration: '60',
    roadmapReport: false,
    format: 'online' as 'online' | 'onsite',
  })

  const [businessBilling, setBusinessBilling] = useState({
    companyName: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postalCode: '',
      country: 'FR'
    },
    vatNumber: '',
    siret: ''
  })

  const steps = [
    { number: 1, label: t('inquiry_step_identity') },
    { number: 2, label: t('inquiry_step_context') },
    { number: 3, label: t('inquiry_step_path') },
    { number: 4, label: t('inquiry_step_review') },
  ]

  // Generate calendar slots (only Tue, Wed, Thu, Fri, starting 1 week from today)
  const generateCalendarSlots = (weekOffset: number): CalendarSlot[] => {
    const slots: CalendarSlot[] = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 7 + (weekOffset * 7)) // Start 1 week from today + week offset
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const allowedDays = [2, 3, 4, 5] // Tue, Wed, Thu, Fri
    
    // Find the first allowed day
    let currentDate = new Date(startDate)
    while (!allowedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Generate slots for the week
    let count = 0
    while (count < 4 && currentDate <= new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
      if (allowedDays.includes(currentDate.getDay())) {
        const dateStr = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`
        const isoDate = currentDate.toISOString().slice(0, 10)
        slots.push({
          date: new Date(currentDate),
          isoDate,
          label: dateStr,
          time: '10:00'
        })
        count++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return slots
  }

  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>(generateCalendarSlots(0))

  // Fetch booked slots when component mounts or when consultation path is selected
  useEffect(() => {
    if (selectedPath === 'consult') {
      const fetchBooked = async () => {
        setLoadingBookedSlots(true)
        try {
          const response = await getBookedSlots()
          if (response.success && response.data) {
            // Create a Set of "date|time" strings for quick lookup
            const bookedSet = new Set<string>()
            response.data.forEach(slot => {
              if (slot.date && slot.time) {
                bookedSet.add(`${slot.date}|${slot.time}`)
              }
            })
            setBookedSlots(bookedSet)
          }
        } catch (err) {
          console.error('Error fetching booked slots:', err)
        } finally {
          setLoadingBookedSlots(false)
        }
      }
      fetchBooked()
    }
  }, [selectedPath])

  useEffect(() => {
    setCalendarSlots(generateCalendarSlots(currentWeekOffset))
  }, [currentWeekOffset])

  // Helper function to check if a slot is booked (uses canonical ISO date)
  const isSlotBooked = (isoDate: string, time: string): boolean => {
    return bookedSlots.has(`${isoDate}|${time}`)
  }

  const handleStep1Continue = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError(t('inquiry_error_required_fields'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await createInquiryIdentity({
        clientType: formData.clientType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      })

      if (result.success && result.data?._id) {
        setInquiryId(result.data._id)
        setCurrentStep(2)
      } else {
        setError(result.message || t('inquiry_error_identity'))
      }
    } catch (err) {
      setError(t('inquiry_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Continue = async () => {
    if (!inquiryId) {
      setError(t('inquiry_error_id_not_found'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updateInquiryContext(inquiryId, {
        address: formData.address,
        selectedServices: formData.selectedServices,
        budget: formData.budget,
        timeline: formData.timeline,
        surface: formData.surface,
        description: formData.description,
        documents: uploadedFiles,
      })

      if (result.success) {
        setCurrentStep(3)
      } else {
        setError(result.message || t('inquiry_error_context'))
      }
    } catch (err) {
      setError(t('inquiry_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleStep3Continue = async () => {
    if (!selectedPath) {
      setError(t('inquiry_error_select_path'))
      return
    }

    if (!inquiryId) {
      setError(t('inquiry_error_id_not_found'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updateInquiryPath(inquiryId, { selectedPath })

      if (result.success) {
        setCurrentStep(4)
      } else {
        setError(result.message || t('inquiry_error_path'))
      }
    } catch (err) {
      setError(t('inquiry_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitGeneral = async () => {
    if (!inquiryId) {
      setError(t('inquiry_error_id_not_found_simple'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await submitGeneralInquiry(inquiryId)

      if (result.success) {
        alert(t('inquiry_success_submitted'))
        // Reset form
        setCurrentStep(1)
        setInquiryId(null)
        setFormData({
          clientType: 'private',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          selectedServices: [],
          budget: '',
          timeline: 'asap',
          surface: '',
          description: '',
          duration: '60',
          roadmapReport: false,
          format: 'online',
        })
        setUploadedFiles([])
      } else {
        setError(result.message || t('inquiry_error_submit'))
      }
    } catch (err) {
      setError(t('inquiry_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      return validTypes.includes(file.type)
    })
    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      return validTypes.includes(file.type)
    })
    setUploadedFiles(prev => [...prev, ...validFiles])
  }

      const handleCheckout = async () => {
    if (!inquiryId) {
      setError(t('inquiry_error_id_not_found_simple'))
      return
    }

    if (!selectedDate || !selectedTime) {
      setError(t('inquiry_error_select_datetime'))
      return
    }

    if (!formData.format) {
      setError('Please select a consultation format (Online or On-site)')
      return
    }

    // Check if slot is booked (double-check before proceeding)
    if (isSlotBooked(selectedDate, selectedTime)) {
      setError('This date and time slot is already booked. Please select another slot.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Update consultation details first (backend will also check for conflicts)
      const updateResult = await updateConsultationDetails(inquiryId, {
        duration: formData.duration,
        roadmapReport: formData.roadmapReport,
        format: formData.format,
        selectedDate,
        selectedTime,
      })

      if (!updateResult.success) {
        // Backend conflict check failed
        if (updateResult.message?.includes('already booked') || updateResult.message?.includes('409')) {
          setError('This date and time slot is already booked. Please select another slot.')
          // Refresh booked slots
          const response = await getBookedSlots()
          if (response.success && response.data) {
            const bookedSet = new Set<string>()
            response.data.forEach(slot => {
              if (slot.date && slot.time) {
                bookedSet.add(`${slot.date}|${slot.time}`)
              }
            })
            setBookedSlots(bookedSet)
          }
        } else {
          setError(updateResult.message || t('inquiry_error_generic'))
        }
        return
      }

      // NEW business flow: require billing details BEFORE redirecting to Checkout.
      if (formData.clientType === 'business') {
        if (!businessBilling.companyName.trim()) {
          setError('Company name is required for invoicing')
          return
        }
        if (
          !businessBilling.address.line1.trim() ||
          !businessBilling.address.city.trim() ||
          !businessBilling.address.postalCode.trim() ||
          !businessBilling.address.country.trim()
        ) {
          setError('Business billing address is required to issue your invoice')
          return
        }
        if (businessBilling.address.country.toUpperCase() === 'FR' && businessBilling.siret.trim()) {
          const digitsOnly = normalizeSiretDigits(businessBilling.siret)
          if (digitsOnly.length !== 9 && digitsOnly.length !== 14) {
            setError('SIRET/SIREN must be 9 digits (SIREN) or 14 digits (SIRET)')
            return
          }
        }

        const billingSave = await saveBusinessBilling(inquiryId, {
          companyName: businessBilling.companyName.trim(),
          address: {
            line1: businessBilling.address.line1.trim(),
            line2: businessBilling.address.line2.trim() || undefined,
            city: businessBilling.address.city.trim(),
            postalCode: businessBilling.address.postalCode.trim(),
            country: businessBilling.address.country.trim().toUpperCase()
          },
          vatNumber: businessBilling.vatNumber.trim()
            ? normalizeVat(businessBilling.vatNumber)
            : undefined,
          siret:
            businessBilling.address.country.toUpperCase() === 'FR' && businessBilling.siret.trim()
              ? normalizeSiretDigits(businessBilling.siret).trim()
              : undefined
        })

        if (!billingSave.success) {
          setError(billingSave.message || 'Failed to save business billing details')
          return
        }
      }

      // Create Stripe checkout session
      const checkoutResult = await createCheckoutSession({
        inquiryId,
        duration: formData.duration,
        roadmapReport: formData.roadmapReport,
      })

      if (checkoutResult.success && checkoutResult.data?.url) {
        window.location.href = checkoutResult.data.url
      } else {
        setError(checkoutResult.message || t('inquiry_error_payment'))
      }
    } catch (err) {
      setError(t('inquiry_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  const toggleService = (service: string) => {
    setFormData(prev => {
      // Natural toggle behavior: supports both single and multi-select seamlessly
      // If service is already selected, deselect it; otherwise, add it to the selection
      return {
        ...prev,
        selectedServices: prev.selectedServices.includes(service)
          ? prev.selectedServices.filter(s => s !== service)
          : [...prev.selectedServices, service]
      }
    })
  }

  const selectPath = (path: 'general' | 'consult') => {
    setSelectedPath(path)
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
    setError(null)
  }

  const nextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1)
  }

  const prevWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(prev => prev - 1)
    }
  }

  return (
    <section className={styles.inquiry} id="inquiry">
      <div className="container-fluid">
        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              {sectionNumber ? `${sectionNumber.toString().padStart(2, '0')}. ${t('inquiry_label')}` : t('inquiry_label')}
            </span>
            <h2 className={styles.title}>{t('inquiry_title')}</h2>
          </div>
        </div>
        <div className={styles.stepsContainer}>
          <div className={styles.stepsLine}></div>
          <div className={styles.stepsDots}>
            {steps.map((step) => (
              <div
                key={step.number}
                className={`${styles.stepDot} ${
                  currentStep === step.number ? styles.active : ''
                } ${currentStep > step.number ? styles.completed : ''}`}
              >
                {step.number}
              </div>
            ))}
          </div>
          <div className={styles.stepLabels}>
            {steps.map((step) => (
              <span key={step.number} className={styles.stepLabel}>
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage} style={{ color: '#EF4444', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* STEP 1: IDENTITY */}
          <div
            className={`${styles.stepPane} ${
              currentStep === 1 ? styles.active : styles.hidden
            }`}
          >
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepTitle}>{t('inquiry_step1_title')}</h3>
                <p className={styles.stepSubtitle}>{t('inquiry_step1_subtitle')}</p>
              </div>
              <div className={styles.stepBody}>
                <div className={styles.radioGroup}>
                  <label className={`${styles.radioLabel} hover-trigger`}>
                    <input
                      type="radio"
                      name="client_type"
                      value="private"
                      checked={formData.clientType === 'private'}
                      onChange={() => setFormData(prev => ({ ...prev, clientType: 'private' }))}
                      className={styles.radioInput}
                    />
                    <div className={styles.radioCard}>
                      <span>{t('inquiry_client_private')}</span>
                    </div>
                  </label>
                  <label className={`${styles.radioLabel} hover-trigger`}>
                    <input
                      type="radio"
                      name="client_type"
                      value="business"
                      checked={formData.clientType === 'business'}
                      onChange={() => setFormData(prev => ({ ...prev, clientType: 'business' }))}
                      className={styles.radioInput}
                    />
                    <div className={styles.radioCard}>
                      <span>{t('inquiry_client_business')}</span>
                    </div>
                  </label>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_firstname')}</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_lastname')}</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_email')}</label>
                    <input
                      type="email"
                      className={styles.input}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_phone')}</label>
                    <input
                      type="tel"
                      className={styles.input}
                      placeholder="+33 6 00 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.stepActions}>
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    disabled={loading}
                    className={`${styles.btn} ${styles.btnPrimary} hover-trigger`}
                  >
                    {loading ? t('inquiry_btn_saving') : t('inquiry_btn_continue_context')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: CONTEXT */}
          <div
            className={`${styles.stepPane} ${
              currentStep === 2 ? styles.active : styles.hidden
            }`}
          >
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepTitle}>{t('inquiry_step2_title')}</h3>
                <p className={styles.stepSubtitle}>{t('inquiry_step2_subtitle')}</p>
              </div>
              <div className={styles.stepBody}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('inquiry_form_address')}</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="123 Avenue des Champs-Élysées, Paris"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('inquiry_form_services')}</label>
                  <div className={styles.servicesGrid}>
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`${styles.serviceBtn} ${
                          formData.selectedServices.includes(service) ? styles.serviceBtnActive : ''
                        } hover-trigger`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.formGrid3}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_budget')}</label>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder="100000"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_timeline')}</label>
                    <select
                      className={styles.input}
                      value={formData.timeline}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value as any }))}
                    >
                      <option value="asap">{t('inquiry_form_timeline_asap')}</option>
                      <option value="3m">{t('inquiry_form_timeline_3m')}</option>
                      <option value="6m">{t('inquiry_form_timeline_6m')}</option>
                      <option value="1y">{t('inquiry_form_timeline_1y')}</option>
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>{t('inquiry_form_surface')}</label>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder="85"
                      value={formData.surface}
                      onChange={(e) => setFormData(prev => ({ ...prev, surface: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>{t('inquiry_form_description')}</label>
                  <textarea
                    rows={4}
                    className={styles.textarea}
                    placeholder={t('inquiry_form_description_placeholder')}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div
                  className={styles.uploadArea}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud size={24} />
                  <span>{t('inquiry_upload_drag')}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className={styles.uploadedFiles}>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className={styles.uploadedFile}>
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className={styles.removeFileBtn}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.stepActions}>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    {t('inquiry_btn_back')}
                  </button>
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    disabled={loading}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    {loading ? t('inquiry_btn_saving') : t('inquiry_btn_continue')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: THE PATH */}
          <div
            className={`${styles.stepPane} ${
              currentStep === 3 ? styles.active : styles.hidden
            }`}
          >
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3 className={styles.stepTitle}>{t('inquiry_step3_title')}</h3>
                <p className={styles.stepSubtitle}>{t('inquiry_step3_subtitle')}</p>
              </div>
              <div className={styles.stepBody}>
                <div className={styles.pathGrid}>
                  <div
                    onClick={() => selectPath('general')}
                    className={`${styles.pathCard} ${
                      selectedPath === 'general' ? styles.pathCardActive : ''
                    } hover-trigger`}
                  >
                    <div className={styles.pathRadio}>
                      <div className={`${styles.pathRadioDot} ${
                        selectedPath === 'general' ? styles.pathRadioDotActive : ''
                      }`}></div>
                    </div>
                    <h4 className={styles.pathTitle}>{t('inquiry_path_general_title')}</h4>
                    <p className={styles.pathDescription}>
                      {t('inquiry_path_general_desc')}
                    </p>
                    <div className={styles.pathFooter}>
                      <span>{t('inquiry_path_general_footer')}</span>
                    </div>
                  </div>
                  <div
                    onClick={() => selectPath('consult')}
                    className={`${styles.pathCard} ${
                      selectedPath === 'consult' ? styles.pathCardActive : ''
                    } hover-trigger`}
                  >
                    <div className={styles.pathRadio}>
                      <div className={`${styles.pathRadioDot} ${
                        selectedPath === 'consult' ? styles.pathRadioDotActive : ''
                      }`}></div>
                    </div>
                    <h4 className={styles.pathTitle}>{t('inquiry_path_consult_title')}</h4>
                    <p className={styles.pathDescription}>
                      {t('inquiry_path_consult_desc')}
                    </p>
                    <div className={styles.pathFooter}>
                      <span>{t('inquiry_path_consult_footer')}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.stepActions}>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    {t('inquiry_btn_back')}
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    disabled={!selectedPath || loading}
                    className={`${styles.btn} ${styles.btnPrimary} ${
                      !selectedPath ? styles.btnDisabled : ''
                    }`}
                  >
                    {loading ? t('inquiry_btn_saving') : t('inquiry_btn_continue')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: BRANCHING */}
          <div
            className={`${styles.stepPane} ${
              currentStep === 4 ? styles.active : styles.hidden
            }`}
          >
            {/* GENERAL BRANCH */}
            {selectedPath === 'general' && (
              <div className={styles.branchGeneral}>
                <div className={styles.stepHeader}>
                  <h3 className={styles.stepTitle}>{t('inquiry_review_title')}</h3>
                  <p className={styles.stepSubtitle}>{t('inquiry_review_subtitle')}</p>
                </div>
                <div className={styles.reviewBox}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>{t('inquiry_review_client')}</span>
                    <span className={styles.reviewValue}>
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>{t('inquiry_review_type')}</span>
                    <span className={styles.reviewValue}>
                      {formData.clientType === 'private' ? t('inquiry_client_private') : t('inquiry_client_business')}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>{t('inquiry_review_services')}</span>
                    <span className={styles.reviewValue}>
                      {formData.selectedServices.length > 0
                        ? formData.selectedServices.join(', ')
                        : '-'}
                    </span>
                  </div>
                  <div className={styles.reviewMessage}>
                    <span className={styles.reviewLabel}>Message Preview</span>
                    <p className={styles.reviewText}>
                      {formData.description || 'No message provided'}
                    </p>
                  </div>
                </div>
                <div className={styles.stepActions}>
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                  >
                    {t('inquiry_btn_back')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitGeneral}
                    disabled={loading}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    {loading ? t('inquiry_btn_loading') : t('inquiry_btn_submit')}
                  </button>
                </div>
              </div>
            )}

            {/* CONSULTATION BRANCH */}
            {selectedPath === 'consult' && (
              <div className={styles.branchConsult}>
                <div className={styles.consultGrid}>
                  <div className={styles.consultLeft}>
                    <h3 className={styles.consultTitle}>{t('inquiry_consult_session_details')}</h3>
                    <div className={styles.durationOptions}>
                      <label className={styles.durationLabel}>
                        <input
                          type="radio"
                          name="duration"
                          value="30"
                          checked={formData.duration === '30'}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className={styles.radioInput}
                        />
                        <div className={styles.durationCard}>
                          <span>{t('inquiry_consult_duration_30')}</span>
                          <span className={styles.durationPrice}>€1.00</span>
                        </div>
                      </label>
                      <label className={styles.durationLabel}>
                        <input
                          type="radio"
                          name="duration"
                          value="60"
                          checked={formData.duration === '60'}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className={styles.radioInput}
                        />
                        <div className={styles.durationCard}>
                          <span>
                            {t('inquiry_consult_duration_60')}
                            <span className={styles.recommended}>{t('inquiry_consult_recommended')}</span>
                          </span>
                          <span className={styles.durationPrice}>€2.00</span>
                        </div>
                      </label>
                      <label className={styles.durationLabel}>
                        <input
                          type="radio"
                          name="duration"
                          value="90"
                          checked={formData.duration === '90'}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className={styles.radioInput}
                        />
                        <div className={styles.durationCard}>
                          <span>{t('inquiry_consult_duration_90')}</span>
                          <span className={styles.durationPrice}>€3.00</span>
                        </div>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.roadmapReport}
                          onChange={(e) => setFormData(prev => ({ ...prev, roadmapReport: e.target.checked }))}
                          className={styles.checkboxInput}
                        />
                        <div className={styles.checkboxContent}>
                          <span className={styles.checkboxTitle}>{t('inquiry_consult_roadmap_title')}</span>
                          <span className={styles.checkboxSubtitle}>
                            {t('inquiry_consult_roadmap_price')}
                          </span>
                        </div>
                      </label>
                    </div>

                    {formData.clientType === 'business' && (
                      <div style={{ marginTop: '1.25rem' }}>
                        <h3 className={styles.consultTitle}>Business billing details</h3>
                        <p style={{ opacity: 0.8, marginBottom: '0.75rem' }}>
                          These details will be used for your invoice.
                        </p>

                        <div className={styles.formField}>
                          <label className={styles.fieldLabel}>
                            Company name <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={businessBilling.companyName}
                            onChange={(e) =>
                              setBusinessBilling((prev) => ({ ...prev, companyName: e.target.value }))
                            }
                            placeholder="Company name"
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.fieldLabel}>
                            Billing address line 1 <span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={businessBilling.address.line1}
                            onChange={(e) =>
                              setBusinessBilling((prev) => ({
                                ...prev,
                                address: { ...prev.address, line1: e.target.value }
                              }))
                            }
                            placeholder="Street address"
                            required
                          />
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.fieldLabel}>Address line 2 (optional)</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={businessBilling.address.line2}
                            onChange={(e) =>
                              setBusinessBilling((prev) => ({
                                ...prev,
                                address: { ...prev.address, line2: e.target.value }
                              }))
                            }
                            placeholder="Apartment, suite, etc."
                          />
                        </div>

                        <div className={styles.formGrid}>
                          <div className={styles.formField}>
                            <label className={styles.fieldLabel}>
                              City <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={businessBilling.address.city}
                              onChange={(e) =>
                                setBusinessBilling((prev) => ({
                                  ...prev,
                                  address: { ...prev.address, city: e.target.value }
                                }))
                              }
                              placeholder="City"
                              required
                            />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.fieldLabel}>
                              Postal code <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={businessBilling.address.postalCode}
                              onChange={(e) =>
                                setBusinessBilling((prev) => ({
                                  ...prev,
                                  address: { ...prev.address, postalCode: e.target.value }
                                }))
                              }
                              placeholder="75001"
                              required
                            />
                          </div>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.fieldLabel}>Country</label>
                          <select
                            className={styles.input}
                            value={businessBilling.address.country}
                            onChange={(e) =>
                              setBusinessBilling((prev) => ({
                                ...prev,
                                address: { ...prev.address, country: e.target.value }
                              }))
                            }
                          >
                            <option value="FR">France</option>
                            <option value="BE">Belgium</option>
                            <option value="DE">Germany</option>
                            <option value="ES">Spain</option>
                            <option value="IT">Italy</option>
                            <option value="NL">Netherlands</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                        </div>

                        <div className={styles.formField}>
                          <label className={styles.fieldLabel}>VAT number (optional)</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={businessBilling.vatNumber}
                            onChange={(e) =>
                              setBusinessBilling((prev) => ({ ...prev, vatNumber: e.target.value }))
                            }
                            placeholder="FR12345678901"
                          />
                        </div>

                        {businessBilling.address.country.toUpperCase() === 'FR' && (
                          <div className={styles.formField}>
                            <label className={styles.fieldLabel}>SIRET / SIREN (optional)</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              className={styles.input}
                              value={businessBilling.siret}
                              onChange={(e) =>
                                setBusinessBilling((prev) => ({ ...prev, siret: e.target.value }))
                              }
                              placeholder="123 456 789 01234"
                              maxLength={20}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.consultRight}>
                    <h3 className={styles.consultTitle}>{t('inquiry_consult_schedule_pay')}</h3>
                    <div className={styles.scheduleBox}>
                      <div className={styles.scheduleSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span className={styles.scheduleLabel}>
                            {t('inquiry_consult_select_date')}
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={prevWeek}
                              disabled={currentWeekOffset === 0}
                              className={styles.weekNavBtn}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={nextWeek}
                              className={styles.weekNavBtn}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                        <div className={styles.calendarSlots}>
                          {calendarSlots.map((slot, index) => {
                            const isBooked = isSlotBooked(slot.isoDate, slot.time)
                            return (
                              <label
                                key={index}
                                className={`${styles.calendarSlot} ${
                                  selectedDate === slot.isoDate ? styles.calendarSlotActive : ''
                                } ${isBooked ? styles.calendarSlotBooked : ''}`}
                                title={isBooked ? 'This slot is already booked' : ''}
                              >
                                <input
                                  type="radio"
                                  name="slot"
                                  value={slot.isoDate}
                                  checked={selectedDate === slot.isoDate}
                                  onChange={() => {
                                    if (!isBooked) {
                                      setSelectedDate(slot.isoDate)
                                      setSelectedTime(slot.time)
                                    }
                                  }}
                                  className={styles.radioInput}
                                  disabled={isBooked}
                                />
                                <div className={styles.calendarSlotContent}>
                                  <span className={styles.calendarSlotDate}>{slot.label}</span>
                                  <span className={styles.calendarSlotTime}>
                                    {isBooked ? '10:00 AM (Booked)' : '10:00 AM'}
                                  </span>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                      <div className={styles.scheduleSection}>
                        <span className={styles.scheduleLabel}>{t('inquiry_consult_format')}</span>
                        <div className={styles.formatOptions}>
                          <label className={styles.formatLabel}>
                            <input
                              type="radio"
                              name="format"
                              value="online"
                              checked={formData.format === 'online'}
                              onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as 'online' | 'onsite' }))}
                              className={styles.radioInput}
                              aria-label={t('inquiry_consult_format_online_label')}
                            />
                            <div className={styles.formatCard}>
                              <span>{t('inquiry_consult_format_online_label')}</span>
                            </div>
                          </label>
                          <label className={styles.formatLabel}>
                            <input
                              type="radio"
                              name="format"
                              value="onsite"
                              checked={formData.format === 'onsite'}
                              onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as 'online' | 'onsite' }))}
                              className={styles.radioInput}
                              aria-label={t('inquiry_consult_format_onsite_label')}
                            />
                            <div className={styles.formatCard}>
                              <span>{t('inquiry_consult_format_onsite_label')}</span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={loading || !selectedDate || !formData.format}
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.checkoutBtn} hover-trigger`}
                      >
                        <span>{loading ? t('inquiry_btn_loading') : t('inquiry_btn_proceed_payment')}</span>
                        <Lock size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className={styles.backLink}
                    >
                      Back to Options
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
