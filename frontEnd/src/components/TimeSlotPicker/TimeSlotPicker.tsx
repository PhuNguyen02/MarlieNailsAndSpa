import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Alert,
} from '@mui/material'
import { Close as CloseIcon, AccessTime } from '@mui/icons-material'
import { useState, useMemo } from 'react'
import { generateTimeSlots, getBookedSlots, Staff } from '../../data/staff'

interface ConflictBooking {
  staff: string
  date: string
  time: string
  guestNumber?: number // Để hiển thị thông tin conflict
}

interface TimeSlotPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (date: string, time: string) => void
  selectedStaff: Staff | null
  selectedDate: string | null
  currentGuestNumber?: number // Số thứ tự người hiện tại đang chọn
  existingBookings?: ConflictBooking[] // Các bookings khác trong form để check conflict
}

const TimeSlotPicker = ({
  open,
  onClose,
  onSelect,
  selectedStaff,
  selectedDate,
  currentGuestNumber,
  existingBookings = [],
}: TimeSlotPickerProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const timeSlots = useMemo(() => {
    if (!selectedStaff || !selectedDate) return []

    const { start, end } = selectedStaff.workingHours
    const slots = generateTimeSlots(start, end)
    const bookedSlots = getBookedSlots(selectedStaff.id, selectedDate)

    return slots.map((slot) => {
      // Check if this slot conflicts with other bookings in the form
      const hasConflict = existingBookings.some(
        (booking) =>
          booking.staff === selectedStaff.id &&
          booking.date === selectedDate &&
          booking.time === slot &&
          booking.guestNumber !== currentGuestNumber // Không conflict với chính nó
      )

      const conflictBooking = existingBookings.find(
        (booking) =>
          booking.staff === selectedStaff.id &&
          booking.date === selectedDate &&
          booking.time === slot &&
          booking.guestNumber !== currentGuestNumber
      )

      return {
        time: slot,
        isBooked: bookedSlots.includes(slot),
        isPast: (() => {
          if (!selectedDate) return false
          const now = new Date()
          const slotDateTime = new Date(`${selectedDate}T${slot}`)
          return slotDateTime < now
        })(),
        hasConflict,
        conflictGuestNumber: conflictBooking?.guestNumber,
      }
    })
  }, [selectedStaff, selectedDate, existingBookings, currentGuestNumber])

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirm = () => {
    if (selectedTime && selectedDate) {
      onSelect(selectedDate, selectedTime)
      setSelectedTime(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedTime(null)
    onClose()
  }

  if (!selectedStaff || !selectedDate) {
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.dark', mb: 0.5 }}>
            Chọn Giờ Đặt Lịch
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chuyên viên: <strong>{selectedStaff.name}</strong> • Ngày:{' '}
            <strong>{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </Typography>
        </Box>
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
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            Các giờ đã được đặt, đã qua, hoặc đã được chọn bởi người khác trong cùng form sẽ không thể chọn. Vui lòng chọn một giờ trống.
          </Alert>

          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            Giờ làm việc: {selectedStaff.workingHours.start} - {selectedStaff.workingHours.end}
          </Typography>

          <Grid container spacing={1.5}>
            {timeSlots.map((slot) => {
              const isDisabled = slot.isBooked || slot.isPast || slot.hasConflict
              const isSelected = selectedTime === slot.time

              return (
                <Grid item xs={6} sm={4} md={3} key={slot.time}>
                  <Box
                    onClick={() => !isDisabled && handleTimeSelect(slot.time)}
                    sx={{
                      p: 2,
                      border: '2px solid',
                      borderColor: isSelected
                        ? 'primary.main'
                        : isDisabled
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(0, 0, 0, 0.2)',
                      borderRadius: 2,
                      backgroundColor: isSelected
                        ? 'primary.light'
                        : isDisabled
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'white',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isDisabled ? 0.5 : 1,
                      position: 'relative',
                      '&:hover': {
                        ...(!isDisabled && {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.light',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(212, 175, 140, 0.2)',
                        }),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: '1rem', color: isSelected ? 'primary.dark' : 'text.secondary' }} />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? 'primary.dark' : 'text.primary',
                        }}
                      >
                        {slot.time}
                      </Typography>
                    </Box>
                    {slot.isBooked && (
                      <Chip
                        label="Đã đặt"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          height: '20px',
                          fontSize: '0.65rem',
                          backgroundColor: 'error.light',
                          color: 'error.dark',
                        }}
                      />
                    )}
                    {slot.hasConflict && !slot.isBooked && (
                      <Chip
                        label={`Người ${slot.conflictGuestNumber}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          height: '20px',
                          fontSize: '0.65rem',
                          backgroundColor: 'warning.light',
                          color: 'warning.dark',
                        }}
                      />
                    )}
                    {slot.isPast && !slot.isBooked && !slot.hasConflict && (
                      <Chip
                        label="Đã qua"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          height: '20px',
                          fontSize: '0.65rem',
                          backgroundColor: 'grey.300',
                          color: 'grey.700',
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>

          {timeSlots.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Không có giờ trống trong ngày này
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedTime}
          sx={{
            minWidth: 120,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TimeSlotPicker

