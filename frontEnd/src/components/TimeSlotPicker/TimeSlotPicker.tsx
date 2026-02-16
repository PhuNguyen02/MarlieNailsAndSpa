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
} from '@mui/material';
import { Close as CloseIcon, AccessTime } from '@mui/icons-material';
import { useState, useMemo, useEffect } from 'react';
import { useBookings } from '../../hooks';
import { CircularProgress } from '@mui/material';
import { AvailableSlot } from '@/api';

interface ConflictBooking {
  staff?: string;
  date: string;
  time: string; // This will be timeSlotId
  timeLabel?: string; // For display
  guestNumber?: number;
}

interface TimeSlotPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (date: string, timeSlotId: string, timeLabel: string) => void;
  selectedDate: string | null;
  currentGuestNumber?: number;
  existingBookings?: ConflictBooking[];
  serviceId?: string;
  employeeId?: string;
}

const TimeSlotPicker = ({
  open,
  onClose,
  onSelect,
  selectedDate,
  currentGuestNumber,
  existingBookings = [],
  serviceId,
  employeeId,
}: TimeSlotPickerProps) => {
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const { getAvailableSlots, loading, error } = useBookings();

  useEffect(() => {
    if (open && selectedDate) {
      const fetchSlots = async () => {
        const availableSlots = await getAvailableSlots(selectedDate, serviceId, employeeId);
        setSlots(availableSlots);
      };
      fetchSlots();
    }
  }, [open, selectedDate, serviceId, employeeId, getAvailableSlots]);

  const timeSlots = useMemo(() => {
    return slots.map((slot) => {
      const timeLabel = slot.timeSlot.startTime.substring(0, 5);

      // Check if this slot conflicts with other bookings in the form
      const hasConflict = existingBookings.some(
        (booking) =>
          booking.date === selectedDate &&
          booking.time === slot.timeSlot.id &&
          booking.guestNumber !== currentGuestNumber,
      );

      const conflictBooking = existingBookings.find(
        (booking) =>
          booking.date === selectedDate &&
          booking.time === slot.timeSlot.id &&
          booking.guestNumber !== currentGuestNumber,
      );

      const isNotEnoughSpace = currentGuestNumber
        ? slot.availableSlots < currentGuestNumber
        : false;

      return {
        id: slot.timeSlot.id,
        time: timeLabel,
        isBooked: !slot.isAvailable || isNotEnoughSpace,
        isPast: (() => {
          if (!selectedDate) return false;
          const now = new Date();
          const slotDateTime = new Date(`${selectedDate}T${slot.timeSlot.startTime}`);
          return slotDateTime < now;
        })(),
        hasConflict,
        conflictGuestNumber: conflictBooking?.guestNumber,
        availableCount: slot.availableSlots,
      };
    });
  }, [slots, selectedDate, existingBookings, currentGuestNumber]);

  const handleTimeSelect = (id: string, time: string) => {
    setSelectedTimeSlotId(id);
    setSelectedTimeLabel(time);
  };

  const handleConfirm = () => {
    if (selectedTimeSlotId && selectedTimeLabel && selectedDate) {
      onSelect(selectedDate, selectedTimeSlotId, selectedTimeLabel);
      setSelectedTimeSlotId(null);
      setSelectedTimeLabel(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTimeSlotId(null);
    setSelectedTimeLabel(null);
    onClose();
  };

  if (!selectedDate) {
    return null;
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
            Ngày:{' '}
            <strong>
              {new Date(selectedDate).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
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
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            Các giờ đã hết chỗ, đã qua, hoặc đã được chọn bởi người khác trong cùng form sẽ không
            thể chọn. Vui lòng chọn một khung giờ trống.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={1.5}>
                {timeSlots.map((slot) => {
                  const isDisabled = slot.isBooked || slot.isPast || slot.hasConflict;
                  const isSelected = selectedTimeSlotId === slot.id;

                  return (
                    <Grid item xs={6} sm={4} md={3} key={slot.id}>
                      <Box
                        onClick={() => !isDisabled && handleTimeSelect(slot.id, slot.time)}
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
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <AccessTime
                              sx={{
                                fontSize: '1rem',
                                color: isSelected ? 'primary.dark' : 'text.secondary',
                              }}
                            />
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
                          <Typography variant="caption" color="text.secondary">
                            Còn {slot.availableCount} chỗ
                          </Typography>
                        </Box>
                        {slot.isBooked && (
                          <Chip
                            label="Hết chỗ"
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
                  );
                })}
              </Grid>

              {timeSlots.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có khung giờ trống trong ngày này
                  </Typography>
                </Box>
              )}
            </>
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
          disabled={!selectedTimeSlotId}
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
  );
};

export default TimeSlotPicker;
