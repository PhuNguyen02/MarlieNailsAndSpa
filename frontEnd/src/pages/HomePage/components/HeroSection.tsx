import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Grid, Skeleton } from "@mui/material";
import { heroStyles } from "../styles";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";
import { publicBannersApi, Banner } from "../../../api/bannersApi";
import { HomepageSection } from "../../../api/homepageApi";

interface HeroSectionProps {
  data?: HomepageSection;
}

const HeroSection = ({ data }: HeroSectionProps) => {
  const { isOpen, openModal, closeModal } = useBookingModal();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(!data); // Don't load if data is provided

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await publicBannersApi.getBanners();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Use the first active banner or fall back to defaults
  const currentBanner = banners.length > 0 ? banners[0] : null;

  const title = data?.title || currentBanner?.title || "Marlie Nails & Spa";
  const subtitle = data?.subtitle || currentBanner?.subtitle || "Nâng tầm vẻ đẹp tự nhiên của bạn với các dịch vụ chăm sóc móng và spa chuyên nghiệp. Tại Marlie, chúng tôi kết hợp nghệ thuật tinh tế cùng không gian thư giãn tuyệt đối để mang lại cho bạn trải nghiệm làm đẹp hoàn hảo nhất.";
  const imageUrl = data?.imageUrl || currentBanner?.imageUrl || "/images/hero-lifestyle.png";
  const buttonText = data?.config?.buttonText || currentBanner?.buttonText || "ĐẶT LỊCH NGAY";

  if (loading) {
    return (
      <Box sx={heroStyles.container}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Skeleton variant="text" width="60%" height={80} />
              <Skeleton variant="text" width="90%" height={24} />
              <Skeleton variant="text" width="90%" height={24} />
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={150} height={50} sx={{ borderRadius: '50px' }} />
                <Skeleton variant="rectangular" width={150} height={50} sx={{ borderRadius: '50px' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Skeleton variant="circular" width={400} height={400} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={heroStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={heroStyles.content}>
              <Typography variant="h1" sx={heroStyles.title}>
                {title}
              </Typography>
              <Typography variant="body1" sx={heroStyles.description}>
                {subtitle}
              </Typography>
              {data?.content && (
                <Box 
                  sx={{ color: 'white', opacity: 0.9, mb: 4, textAlign: 'left' }} 
                  dangerouslySetInnerHTML={{ __html: data.content }} 
                />
              )}
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
                  {buttonText}
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
                  href="#services"
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
                src={imageUrl}
                alt={title}
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
