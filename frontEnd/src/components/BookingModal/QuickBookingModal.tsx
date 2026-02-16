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
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useServicesFlat, useBookings } from '../../hooks';
import { formatVND } from '../../utils';
import { ApiResponse, Employee } from '../../api/types';
import { apiClient } from '../../api';
import dayjs from 'dayjs';

interface QuickBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegular: () => void;
  params: {
    serviceId?: string;
    employeeId?: string;
    date?: string;
    timeSlotId?: string;
    timeLabel?: string;
  };
}

const QuickBookingModal = ({
  open,
  onClose,
  onSwitchToRegular,
  params,
}: QuickBookingModalProps) => {
  const { services, loading: servicesLoading } = useServicesFlat();
  const { submitBooking, loading: bookingLoading, error: bookingError } = useBookings();

  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
    note: '',
  });

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeSlotId, setTimeSlotId] = useState(params.timeSlotId || '');

  // Fetch employee details if employeeId is provided
  useEffect(() => {
    const fetchEmployeeAndSlot = async () => {
      if (params.employeeId) {
        try {
          // Fetch employees to get details
          const res: ApiResponse<any[]> = await apiClient.get('/bookings/employees');
          const emp = res.data.find((e: any) => e.id === params.employeeId);
          setEmployee(emp || null);

          // Resolve TimeSlot ID if not provided
          if (!params.timeSlotId && params.date && params.timeLabel) {
            const slotRes: any = await apiClient.get(`/bookings/available-slots/${params.date}`);
            const matchingSlot = (slotRes.data as any[]).find((s: any) =>
              s.timeSlot.startTime.startsWith(params.timeLabel!.substring(0, 5)),
            );
            if (matchingSlot) {
              setTimeSlotId(matchingSlot.timeSlot.id);
            }
          }
        } catch (err) {
          console.error('Failed to fetch modal data', err);
        }
      }
    };

    if (open) {
      fetchEmployeeAndSlot();
      setSelectedServiceId(params.serviceId || '');
      setTimeSlotId(params.timeSlotId || '');
    }
  }, [open, params.employeeId, params.serviceId, params.timeSlotId, params.date, params.timeLabel]);

  // Filter services based on employee specialization
  const filteredServices = useMemo(() => {
    if (!employee || !employee.specialization) return services;

    const specs = employee.specialization
      .toLowerCase()
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (specs.length === 0) return services;

    return services.filter((service) => {
      const category = (service.category || '').toLowerCase();
      const name = service.name.toLowerCase();
      return specs.some((spec) => category.includes(spec) || name.includes(spec));
    });
  }, [employee, services]);

  const selectedService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId);
  }, [selectedServiceId, services]);

  const handleSubmit = async () => {
    if (!contact.name || !contact.phone || !selectedServiceId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await submitBooking({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        numberOfGuests: 1,
        note: contact.note,
        totalPrice: selectedService?.price || 0,
        bookings: [
          {
            guestNumber: 1,
            serviceId: selectedServiceId,
            employeeId: params.employeeId,
            date: params.date || dayjs().format('YYYY-MM-DD'),
            time: timeSlotId || params.timeLabel || '',
            price: selectedService?.price,
          },
        ],
      });

      alert('Đặt lịch thành công!');
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleClose = () => {
    setContact({ name: '', phone: '', email: '', note: '' });
    setSelectedServiceId('');
    setEmployee(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: 'hidden' },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Đặt Lịch Nhanh
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {bookingError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {bookingError}
          </Alert>
        )}

        {/* Selected Context Info */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'rgba(212, 175, 140, 0.1)',
            borderRadius: 3,
            border: '1px solid rgba(212, 175, 140, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {employee?.fullName?.charAt(0) || <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nhân viên phụ trách
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {employee?.fullName || 'Đang tải...'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: 'rgba(0,0,0,0.05)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
              <Typography variant="body2">{params.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700}>
                {params.timeLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Họ và Tên"
            fullWidth
            required
            size="small"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
          />
          <TextField
            label="Số Điện Thoại"
            fullWidth
            required
            size="small"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />

          <TextField
            select
            label="Chọn Dịch Vụ"
            fullWidth
            required
            size="small"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            disabled={servicesLoading}
            helperText={
              !timeSlotId
                ? 'Đang xác thực khung giờ...'
                : employee
                  ? `Đã lọc dịch vụ theo chuyên môn của ${employee.fullName}`
                  : 'Chọn dịch vụ mong muốn'
            }
          >
            {filteredServices.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">{service.name}</Typography>
                  <Typography variant="caption" fontWeight={700} color="primary.main">
                    {formatVND(service.price || 0)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Ghi chú (nếu có)"
            fullWidth
            multiline
            rows={2}
            size="small"
            value={contact.note}
            onChange={(e) => setContact({ ...contact, note: e.target.value })}
          />
        </Box>

        {selectedService && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">Tổng thanh toán dự kiến:</Typography>
            <Typography variant="h6" fontWeight={800}>
              {formatVND(selectedService.price || 0)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button onClick={handleClose} fullWidth variant="outlined">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            disabled={bookingLoading || !timeSlotId}
            sx={{
              py: 1,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(212, 175, 140, 0.4)',
            }}
          >
            {bookingLoading ? <CircularProgress size={24} color="inherit" /> : 'Xác Nhận'}
          </Button>
        </Box>

        <Button
          fullWidth
          size="small"
          onClick={onSwitchToRegular}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            textDecoration: 'underline',
            '&:hover': { background: 'transparent', color: 'primary.main' },
          }}
        >
          Bạn muốn chọn nhân viên hoặc thời gian khác?
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickBookingModal;
