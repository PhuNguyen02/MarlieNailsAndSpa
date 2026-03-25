import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, PhoneIphone, Lock } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { customerAuthApi } from '../../api/customerAuthApi';

const LoginPage = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await customerAuthApi.login(form);
      localStorage.setItem('customer_token', res.data.access_token);
      localStorage.setItem('customer_info', JSON.stringify(res.data));
      navigate('/my-account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Số điện thoại hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFFCF9 0%, #F5E6D3 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            border: '1px solid',
            borderColor: alpha('#d4af8c', 0.2),
            boxShadow: '0 20px 40px rgba(212, 175, 140, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 800,
              mb: 1,
              color: '#4a3728',
            }}
          >
            Chào Mừng Trở Lại
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            Đăng nhập để quản lý lịch hẹn và nhận ưu đãi riêng
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphone sx={{ color: '#d4af8c' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#d4af8c' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ color: '#d4af8c', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: '50px',
                bgcolor: '#d4af8c',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(212, 175, 140, 0.3)',
                '&:hover': { bgcolor: '#b8956f' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn chưa có tài khoản?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ color: '#d4af8c', fontWeight: 700, textDecoration: 'none' }}
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Paper>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{ color: 'text.secondary', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            ← Trở về Trang chủ
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
