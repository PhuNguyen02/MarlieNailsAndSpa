import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Button,
  alpha,
} from '@mui/material';
import { EventAvailable, History, Person, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAuthApi } from '../../api/customerAuthApi';

const CustomerDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes]: [any, any] = await Promise.all([
          customerAuthApi.getProfile(),
          customerAuthApi.getMyBookings(),
        ]);
        setProfile(profileRes.data);
        setBookings(bookingsRes.data || []);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        // Chỉ redirect về login khi lỗi 401 (token hết hạn/không hợp lệ)
        if (err?.statusCode === 401) {
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_info');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ duyệt';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Đã xong';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: '#FFFCF9', minHeight: 'calc(100vh - 80px)' }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #4a3728 0%, #2d1e16 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          {loading ? (
            <Skeleton variant="circular" width={80} height={80} />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#d4af8c',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {profile?.fullName?.charAt(0)}
            </Avatar>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 0.5, fontFamily: '"Playfair Display", serif' }}
            >
              Chào mừng, {profile?.fullName || 'Khách hàng'}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Rất vui được gặp lại bạn tại Marlie Nails & Spa.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/booking')}
            sx={{
              bgcolor: '#d4af8c',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              '&:hover': { bgcolor: '#b8956f' },
            }}
          >
            ĐẶT LỊCH MỚI NGAY
          </Button>
        </Paper>

        <Grid container spacing={4}>
          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    TỔNG LẦN GHÉ
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#4a3728' }}>
                    {loading ? (
                      <Skeleton width={60} sx={{ mx: 'auto' }} />
                    ) : (
                      profile?.totalVisits || 0
                    )}
                  </Typography>
                  <EventAvailable sx={{ color: '#d4af8c', mt: 1 }} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    HẠNG THÀNH VIÊN
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d4af8c' }}>
                    Classic
                  </Typography>
                  <Star sx={{ color: '#d4af8c', mt: 1 }} />
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Person fontSize="small" /> Thông tin cá nhân
              </Typography>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    SỐ ĐIỆN THOẠI
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{profile?.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    EMAIL
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {profile?.email || 'Chưa cập nhật'}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/my-account/profile')}
                  sx={{ mt: 1, borderColor: '#d4af8c', color: '#d4af8c' }}
                >
                  SỦA THÔNG TIN
                </Button>
              </Paper>
            </Box>
          </Grid>

          {/* Bookings History */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <History fontSize="small" /> Lịch sử đặt hẹn
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: alpha('#d4af8c', 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Dịch vụ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày & Giờ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Nhân viên</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton width={120} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={60} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Bạn chưa có lịch hẹn nào.</Typography>
                        <Button color="primary" onClick={() => navigate('/booking')} sx={{ mt: 1 }}>
                          Đặt lịch ngay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking.id} hover sx={{ cursor: 'pointer' }}>
                        <TableCell sx={{ fontWeight: 600 }}>{booking.service?.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.timeSlot?.startTime}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{booking.employee?.fullName}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(booking.status)}
                            color={getStatusColor(booking.status)}
                            size="small"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
