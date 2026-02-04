import { Box, Container, Grid, Typography, Button, Link } from "@mui/material";
import { footerStyles } from "../styles";

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
              Chào mừng bạn đến với Marlie Nails & Spa - nơi mang đến cho bạn
              trải nghiệm làm đẹp và thư giãn tuyệt vời nhất. Chúng tôi luôn sẵn
              sàng phục vụ bạn với đội ngũ chuyên viên giàu kinh nghiệm.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(212, 175, 140, 0.4)",
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
            <Typography
              variant="h6"
              gutterBottom
              sx={{ ...footerStyles.title, mt: 3 }}
            >
              Giờ Mở Cửa
            </Typography>
            <Typography variant="body2" sx={footerStyles.contact}>
              Thứ 2 - Thứ 6: 09:00 - 20:00
              <br />
              Thứ 7 - Chủ Nhật: Mở cửa cả ngày
            </Typography>
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
