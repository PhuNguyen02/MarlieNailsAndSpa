import { Box, Container, Grid, Typography, Button, Link } from '@mui/material';
import { footerStyles } from '../styles';

const Footer = () => {
  return (
    <Box sx={footerStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Marlie Nails & Spa
            </Typography>
            <Typography variant="body2" sx={footerStyles.description}>
              Chào mừng bạn đến với Marlie Nails & Spa - nơi mang đến cho bạn trải nghiệm làm đẹp và
              thư giãn tuyệt vời nhất. Chúng tôi luôn sẵn sàng phục vụ bạn với đội ngũ chuyên viên
              giàu kinh nghiệm.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(212, 175, 140, 0.4)',
                },
              }}
            >
              Đặt Lịch Online
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Liên Kết Nhanh
            </Typography>
            <Box sx={footerStyles.links}>
              <Link href="/" sx={footerStyles.link}>
                Trang Chủ
              </Link>
              <Link href="/pricing" sx={footerStyles.link}>
                Bảng Giá
              </Link>
              <Link href="/services" sx={footerStyles.link}>
                Dịch Vụ
              </Link>
              <Link href="/contact" sx={footerStyles.link}>
                Liên Hệ
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Thông Tin Liên Hệ
            </Typography>
            <Typography variant="body2" sx={footerStyles.contact}>
              250 Tạ Quang Bửu, Phường Bình Đông
              <br />
              TP. Hồ Chí Minh
              <br />
              Điện thoại: 0905 969 063
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ ...footerStyles.title, mt: 3 }}>
              Vị Trí Của Chúng Tôi
            </Typography>
            <Box sx={{ mt: 1, borderRadius: 2, overflow: 'hidden', height: 150 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122698.15290034024!2d108.14087547366!3d16.047579042498844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436f38!2sDa%20Nang!5e0!3m2!1sen!2s!4v1709888000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Marlie Map"
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={footerStyles.bottom}>
          <Typography variant="body2" color="text.secondary">
            © 2026 Marlie Nails & Spa. All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
