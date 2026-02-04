import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { heroStyles } from "../styles";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";

const HeroSection = () => {
  const { isOpen, openModal, closeModal } = useBookingModal();

  return (
    <Box sx={heroStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={heroStyles.content}>
              <Typography variant="h1" sx={heroStyles.title}>
                Marlie Nails & Spa
              </Typography>
              <Typography variant="body1" sx={heroStyles.description}>
                Nâng tầm vẻ đẹp tự nhiên của bạn với các dịch vụ chăm sóc móng
                và spa chuyên nghiệp. Tại Marlie, chúng tôi kết hợp nghệ thuật
                tinh tế cùng không gian thư giãn tuyệt đối để mang lại cho bạn
                trải nghiệm làm đẹp hoàn hảo nhất.
              </Typography>
              <Box sx={heroStyles.buttonContainer}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => openModal()}
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 600,
                    letterSpacing: "1px",
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: "50px",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 25px rgba(212, 175, 140, 0.4)",
                    },
                  }}
                >
                  ĐẶT LỊCH NGAY
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 600,
                    letterSpacing: "1px",
                    borderColor: "primary.main",
                    color: "primary.main",
                    borderRadius: "50px",
                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "rgba(212, 175, 140, 0.1)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  XEM DỊCH VỤ
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={heroStyles.imageWrapper}>
              <Box sx={heroStyles.accentCircle} />
              <Box
                component="img"
                src="/images/hero-lifestyle.png"
                alt="Marlie Nails & Spa Lifestyle"
                sx={heroStyles.heroImage}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} />
    </Box>
  );
};

export default HeroSection;
