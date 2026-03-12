import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  alpha,
} from '@mui/material';
import { Phone, Email, Schedule, LocationOn, Send } from '@mui/icons-material';
import Header from '../HomePage/components/Header';
import Footer from '../HomePage/components/Footer';
import { publicContactApi } from '../../api/contactApi';

const contactInfo = [
  { icon: <Phone />, label: 'Hotline', value: '0905 969 063' },
  { icon: <Email />, label: 'Email', value: 'contact@marlienails.com' },
  { icon: <Schedule />, label: 'Giờ mở cửa', value: '9:00 - 20:00 (Thứ 2 - CN)' },
  { icon: <LocationOn />, label: 'Địa chỉ', value: 'Đà Nẵng, Việt Nam' },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicContactApi.send(form);
      setSnackbar({
        open: true,
        message: 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.',
        severity: 'success',
      });
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': { borderColor: '#d4af8c' },
      '&.Mui-focused fieldset': { borderColor: '#b8956f' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#b8956f' },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFCF9' }}>
      <Header />

      {/* Hero */}
      <Box
        sx={{
          pt: { xs: 14, md: 16 },
          pb: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2420 100%)',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: 2,
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}
          >
            LIÊN HỆ VỚI CHÚNG TÔI
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Gửi Tin Nhắn
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Họ và tên"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Chủ đề"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={5}
                        label="Nội dung tin nhắn"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        sx={inputSx}
                        inputProps={{ minLength: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress size={20} color="inherit" /> : <Send />
                        }
                        sx={{
                          px: 5,
                          py: 1.5,
                          borderRadius: '50px',
                          fontWeight: 600,
                          letterSpacing: 1,
                          background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #e8d4c0 0%, #d4af8c 100%)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Thông Tin Liên Hệ
              </Typography>
              {contactInfo.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#d4af8c', 0.06),
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: alpha('#d4af8c', 0.12) },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)',
                      color: 'white',
                      flexShrink: 0,
                      '& .MuiSvgIcon-root': { fontSize: 22 },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, mt: 0.3 }}>{item.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Google Map Embed */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122698.15290034024!2d108.14087547366!3d16.047579042498844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436f38!2sDa%20Nang!5e0!3m2!1sen!2s!4v1709888000000"
                width="100%"
                height="250"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Marlie Nails & Spa Location"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
