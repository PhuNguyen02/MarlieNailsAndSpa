import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  alpha,
  Divider,
} from '@mui/material';
import { PhotoCamera, Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAuthApi } from '../../api/customerAuthApi';

const CustomerProfilePage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await customerAuthApi.getProfile();
        const data = res.data.data;
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split('T')[0]
            : '',
          address: data.address || '',
          notes: data.notes || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await customerAuthApi.updateProfile(form);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Cập nhật thất bại' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#FFFCF9', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/my-account')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Quay lại Dashboard
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            border: '1px solid',
            borderColor: alpha('#d4af8c', 0.2),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#d4af8c',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {form.fullName.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
                size="small"
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif' }}
              >
                Hồ Sơ Cá Nhân
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý thông tin cá nhân của bạn để nhận dịch vụ tốt nhất
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {message.text && (
            <Alert severity={message.type as any} sx={{ mb: 4, borderRadius: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  disabled
                  value={form.phone}
                  helperText="Số điện thoại dùng làm định danh, không thể thay đổi"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Hướng dẫn & Sở thích đặc biệt
                </Typography>
                <TextField
                  fullWidth
                  name="notes"
                  placeholder="Ví dụ: Dị ứng với hóa chất nào đó, sở thích màu sắc, v.v."
                  value={form.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: '50px',
                    bgcolor: '#4a3728',
                    '&:hover': { bgcolor: '#2d1e16' },
                  }}
                >
                  {saving ? 'ĐANG LƯU...' : 'LƯU THÔNG TIN'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerProfilePage;
