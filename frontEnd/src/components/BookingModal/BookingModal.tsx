import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  Paper,
} from '@mui/material'
import { Close as CloseIcon, AttachMoney } from '@mui/icons-material'
import { useState, useEffect, useMemo } from 'react'
import spaServices from '../../data/spaServices'
import { formatVND } from '../../utils'
import BookingItemCard from './BookingItemCard'

interface BookingModalProps {
  open: boolean
  onClose: () => void
  initialService?: string
}

interface BookingItem {
  guestNumber: number
  service: string
  staff: string
  date: string
  time: string
}

interface BookingFormData {
  name: string
  phone: string
  email: string
  numberOfGuests: string
  bookings: BookingItem[]
  note: string
}

// Tạo danh sách dịch vụ từ spaServices
const getAllServices = () => {
    const services: { id: string; name: string; category: string; price?: number; price_range?: string }[] = []

    // Gội đầu dưỡng sinh
    spaServices.goi_dau_duong_sinh.forEach((combo) => {
      services.push({
        id: combo.id,
        name: `${combo.name} - ${combo.duration || ''}`,
        category: 'Gội Đầu Dưỡng Sinh',
        price: typeof combo.price === 'number' ? combo.price : undefined,
      })
    })

    // Nail services
    spaServices.nail.gel_polish.forEach((service) => {
      services.push({
        id: service.id || '',
        name: service.name,
        category: 'Dịch Vụ Nail - Sơn Gel',
        price: typeof service.price === 'number' ? service.price : undefined,
        price_range: service.price_range,
      })
    })

    spaServices.nail.extensions.forEach((service) => {
      services.push({
        id: service.id || '',
        name: service.name,
        category: 'Dịch Vụ Nail - Nối Móng',
        price: typeof service.price === 'number' ? service.price : undefined,
      })
    })

    // Chăm sóc da
    spaServices.cham_soc_da.forEach((service) => {
      services.push({
        id: service.id,
        name: service.name,
        category: 'Chăm Sóc Da',
        price: typeof service.price === 'number' ? service.price : undefined,
      })
    })

    // Triệt lông
    spaServices.triet_long.forEach((service) => {
      services.push({
        id: service.id,
        name: service.zone || '',
        category: 'Triệt Lông',
        price: service.single_price,
      })
    })

    return services
  }

// Helper function to parse price range (e.g., "120.000 - 150.000" -> 120000)
const parsePriceRange = (priceRange: string): number => {
  // Remove dots and spaces, then extract first number
  const cleaned = priceRange.replace(/\./g, '').replace(/\s/g, '')
  const match = cleaned.match(/(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return 0
}

// Helper function to get service price (always returns a number)
const getServicePrice = (serviceId: string): number => {
  const services = getAllServices()
  const service = services.find((s) => s.id === serviceId)
  if (!service) return 0
  
  // If has direct price, return it
  if (service.price) {
    return service.price
  }
  
  // If has price_range, parse and return min price
  if (service.price_range) {
    return parsePriceRange(service.price_range)
  }
  
  return 0
}

// Helper function to get service price info (for display)
const getServicePriceInfo = (serviceId: string): { price: number; priceRange?: string } => {
  const services = getAllServices()
  const service = services.find((s) => s.id === serviceId)
  if (!service) return { price: 0 }
  
  if (service.price) {
    return { price: service.price }
  }
  
  if (service.price_range) {
    return { price: parsePriceRange(service.price_range), priceRange: service.price_range }
  }
  
  return { price: 0 }
}

const BookingModal = ({ open, onClose, initialService }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    numberOfGuests: '1',
    bookings: [
      {
        guestNumber: 1,
        service: initialService || '',
        staff: '',
        date: '',
        time: '',
      },
    ],
    note: '',
  })

  const [errors, setErrors] = useState<{
    form?: Partial<Record<keyof Omit<BookingFormData, 'bookings'>, string>>
    bookings?: Record<number, Partial<Record<keyof BookingItem, string>>>
  }>({})

  const services = getAllServices()
  const guestOptions = ['1', '2', '3', '4', '5', '6+']

  // Calculate total price
  const totalPrice = useMemo(() => {
    return formData.bookings.reduce((total, booking) => {
      if (!booking.service) return total
      const price = getServicePrice(booking.service)
      return total + price
    }, 0)
  }, [formData.bookings])

  // Initialize or update bookings array when numberOfGuests changes
  useEffect(() => {
    const guestCount = parseInt(formData.numberOfGuests) || 1
    const currentCount = formData.bookings.length

    if (guestCount > currentCount) {
      // Add new booking items
      const newBookings = Array.from({ length: guestCount - currentCount }, (_, i) => ({
        guestNumber: currentCount + i + 1,
        service: '',
        staff: '',
        date: '',
        time: '',
      }))
      setFormData((prev) => ({
        ...prev,
        bookings: [...prev.bookings, ...newBookings],
      }))
    } else if (guestCount < currentCount) {
      // Remove excess booking items
      setFormData((prev) => ({
        ...prev,
        bookings: prev.bookings.slice(0, guestCount),
      }))
    } else if (guestCount === 1 && currentCount > 1) {
      // Reset to single booking
      setFormData((prev) => ({
        ...prev,
        bookings: [
          {
            guestNumber: 1,
            service: initialService || '',
            staff: '',
            date: '',
            time: '',
          },
        ],
      }))
    }
  }, [formData.numberOfGuests, initialService])

  const validateForm = (): boolean => {
    const formErrors: Partial<Record<keyof Omit<BookingFormData, 'bookings'>, string>> = {}
    const bookingErrors: Record<number, Partial<Record<keyof BookingItem, string>>> = {}

    // Validate form fields
    if (!formData.name.trim()) {
      formErrors.name = 'Vui lòng nhập tên'
    }

    if (!formData.phone.trim()) {
      formErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      formErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.email.trim()) {
      formErrors.email = 'Vui lòng nhập email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = 'Email không hợp lệ'
    }

    // Validate each booking item
    formData.bookings.forEach((booking) => {
      const itemErrors: Partial<Record<keyof BookingItem, string>> = {}

      if (!booking.service) {
        itemErrors.service = 'Vui lòng chọn dịch vụ'
      }

      if (!booking.staff) {
        itemErrors.staff = 'Vui lòng chọn nhân viên'
      }

      if (!booking.date) {
        itemErrors.date = 'Vui lòng chọn ngày đặt lịch'
      } else {
        const selectedDate = new Date(booking.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          itemErrors.date = 'Ngày đặt lịch phải trong tương lai hoặc hôm nay'
        }
      }

      if (!booking.time) {
        itemErrors.time = 'Vui lòng chọn giờ đặt lịch'
      } else {
        // Check for conflicts with other bookings in the form
        const hasConflict = formData.bookings.some(
          (otherBooking) =>
            otherBooking.guestNumber !== booking.guestNumber &&
            otherBooking.staff === booking.staff &&
            otherBooking.date === booking.date &&
            otherBooking.time === booking.time
        )

        if (hasConflict) {
          const conflictGuest = formData.bookings.find(
            (b) =>
              b.guestNumber !== booking.guestNumber &&
              b.staff === booking.staff &&
              b.date === booking.date &&
              b.time === booking.time
          )
          itemErrors.time = `Giờ này đã được chọn bởi Người ${conflictGuest?.guestNumber}. Vui lòng chọn giờ khác.`
        }
      }

      if (Object.keys(itemErrors).length > 0) {
        bookingErrors[booking.guestNumber] = itemErrors
      }
    })

    setErrors({
      form: formErrors,
      bookings: Object.keys(bookingErrors).length > 0 ? bookingErrors : undefined,
    })

    return Object.keys(formErrors).length === 0 && Object.keys(bookingErrors).length === 0
  }

  const handleChange = (field: keyof Omit<BookingFormData, 'bookings'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors.form?.[field]) {
      setErrors((prev) => ({
        ...prev,
        form: { ...prev.form, [field]: undefined },
      }))
    }
  }

  const handleBookingUpdate = (index: number, field: keyof BookingItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bookings: prev.bookings.map((booking, i) =>
        i === index ? { ...booking, [field]: value } : booking
      ),
    }))
    // Clear error when user updates
    if (errors.bookings?.[formData.bookings[index].guestNumber]?.[field]) {
      setErrors((prev) => {
        const newBookingErrors = { ...prev.bookings }
        const guestNumber = formData.bookings[index].guestNumber
        if (newBookingErrors[guestNumber]) {
          delete newBookingErrors[guestNumber][field]
          if (Object.keys(newBookingErrors[guestNumber]).length === 0) {
            delete newBookingErrors[guestNumber]
          }
        }
        return {
          ...prev,
          bookings: Object.keys(newBookingErrors).length > 0 ? newBookingErrors : undefined,
        }
      })
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Format bookings with datetime
      const formattedBookings = formData.bookings.map((booking) => ({
        ...booking,
        dateTime: `${booking.date}T${booking.time}:00`,
      }))

      // Here you would typically send the data to your backend
      console.log('Booking data:', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        numberOfGuests: formData.numberOfGuests,
        bookings: formattedBookings,
        note: formData.note,
      })

      // Show success message (you can add a toast notification here)
      alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.')

      // Close modal (form will be reset in useEffect)
      onClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  // Set initial service when modal opens
  useEffect(() => {
    if (open && initialService) {
      setFormData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((booking, i) =>
          i === 0 ? { ...booking, service: initialService } : booking
        ),
      }))
    } else if (!open) {
      // Reset form when modal closes
      setFormData({
        name: '',
        phone: '',
        email: '',
        numberOfGuests: '1',
        bookings: [
          {
            guestNumber: 1,
            service: '',
            staff: '',
            date: '',
            time: '',
          },
        ],
        note: '',
      })
      setErrors({})
    }
  }, [open, initialService])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.dark' }}>
          Đặt Lịch Hẹn
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Number of Guests - Moved to top */}
          <TextField
            select
            label="Số Khách Hàng"
            fullWidth
            required
            value={formData.numberOfGuests}
            onChange={handleChange('numberOfGuests')}
            variant="outlined"
            helperText="Chọn số lượng người sẽ sử dụng dịch vụ"
          >
            {guestOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === '6+' ? '6 người trở lên' : `${option} người`}
              </MenuItem>
            ))}
          </TextField>

          {/* Contact Information */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Thông Tin Liên Hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Name */}
              <TextField
                label="Họ và Tên"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.form?.name}
                helperText={errors.form?.name}
                variant="outlined"
              />

              {/* Phone */}
              <TextField
                label="Số Điện Thoại"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.form?.phone}
                helperText={errors.form?.phone}
                variant="outlined"
                placeholder="0901234567"
              />

              {/* Email */}
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={!!errors.form?.email}
                helperText={errors.form?.email}
                variant="outlined"
                placeholder="example@email.com"
              />
            </Box>
          </Box>

          {/* Booking Items */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Thông Tin Đặt Lịch {formData.numberOfGuests !== '1' && 'Cho Từng Người'}
            </Typography>
            {formData.numberOfGuests === '1' ? (
              // Single booking - show inline form
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <BookingItemCard
                  item={formData.bookings[0]}
                  index={0}
                  services={services}
                  onUpdate={handleBookingUpdate}
                  errors={errors.bookings?.[1] || {}}
                  allBookings={formData.bookings}
                />
              </Box>
            ) : (
              // Multiple bookings - show accordion cards
              <Box>
                {formData.bookings.length > 0 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Mỗi người có thể chọn dịch vụ, chuyên viên và thời gian khác nhau. Lưu ý: Nếu chọn cùng chuyên viên và cùng ngày, không thể chọn cùng giờ. Vui lòng điền đầy đủ thông tin cho tất cả {formData.numberOfGuests} người.
                  </Alert>
                )}
                {formData.bookings.map((booking, index) => (
                  <BookingItemCard
                    key={booking.guestNumber}
                    item={booking}
                    index={index}
                    services={services}
                    onUpdate={handleBookingUpdate}
                    errors={errors.bookings?.[booking.guestNumber] || {}}
                    allBookings={formData.bookings}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Note */}
          <TextField
            label="Ghi Chú Thêm"
            fullWidth
            multiline
            rows={4}
            value={formData.note}
            onChange={handleChange('note')}
            variant="outlined"
            placeholder="Vui lòng cho chúng tôi biết thêm thông tin nếu có..."
          />

          {/* Total Price Summary */}
          {formData.bookings.some((b) => b.service) && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                backgroundColor: 'primary.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                  Chi Tiết Giá
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {formData.bookings.map((booking) => {
                  if (!booking.service) return null
                  const service = services.find((s) => s.id === booking.service)
                  const priceInfo = getServicePriceInfo(booking.service)
                  
                  return (
                    <Box
                      key={booking.guestNumber}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Người {booking.guestNumber}: {service?.name || 'Chưa chọn dịch vụ'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.dark',
                        }}
                      >
                        {priceInfo.priceRange 
                          ? `${priceInfo.priceRange} đ`
                          : formatVND(priceInfo.price)}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Tổng Cộng:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ color: 'primary.dark', fontSize: '1.5rem' }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.dark',
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    {totalPrice > 0 ? formatVND(totalPrice) : '0 đ'}
                  </Typography>
                </Box>
              </Box>
              {formData.bookings.some((b) => {
                if (!b.service) return false
                const priceInfo = getServicePriceInfo(b.service)
                return !!priceInfo.priceRange
              }) && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  * Tổng giá được tính dựa trên giá thấp nhất của các dịch vụ có khoảng giá
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            minWidth: 120,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Đặt Lịch
        </Button>
      </DialogActions>

    </Dialog>
  )
}

export default BookingModal

