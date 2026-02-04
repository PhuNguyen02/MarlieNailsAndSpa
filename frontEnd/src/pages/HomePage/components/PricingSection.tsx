import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Star, Spa } from "@mui/icons-material";
import { pricingStyles } from "../styles";
import { formatPrice } from "../../../utils";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";
import { useServices, ServiceItem } from "../../../hooks";
import { Skeleton } from "@mui/material";

const PricingSection = () => {
  const { servicesByCategory, loading } = useServices();

  // Helper function to find a service by name pattern in specific categories
  const findService = (namePart: string, categories: ServiceItem[][]) => {
    for (const cat of categories) {
      const found = cat.find((s) =>
        s.name.toLowerCase().includes(namePart.toLowerCase()),
      );
      if (found) return found;
    }
    return null;
  };

  // Define the target services with fallbacks to prevent blank cards
  const displayServices = [
    // 1. Combo 2
    findService("Combo 2", [servicesByCategory.goi_dau_duong_sinh]) || {
      id: "fallback-combo2",
      name: "Gội Đầu Dưỡng Sinh Combo 2",
      price: 150000,
      duration: "60 phút",
      steps_count: 11,
      category: "Gội đầu",
    },
    // 2. Combo 4 (Phổ biến nhất)
    findService("Combo 4", [servicesByCategory.goi_dau_duong_sinh]) || {
      id: "fallback-combo4",
      name: "Gội Đầu Dưỡng Sinh Combo 4",
      price: 250000,
      duration: "90 phút",
      steps_count: 14,
      category: "Gội đầu",
    },
    // 3. Thải độc CO2
    findService("Thải độc CO2", [servicesByCategory.cham_soc_da]) || {
      id: "fallback-co2",
      name: "Thải Độc CO2 - Gồm 18 bước",
      price: 450000,
      duration: "75 phút",
      steps_count: 18,
      category: "Chăm sóc da",
    },
  ];

  const { isOpen, selectedService, openModal, closeModal } = useBookingModal();

  return (
    <Box sx={pricingStyles.featuredContainer}>
      {/* Background decorative elements */}
      <Box sx={pricingStyles.backgroundPattern} />

      <Container maxWidth="lg">
        <Box sx={pricingStyles.header}>
          <Chip
            icon={<Star sx={{ color: "primary.main" }} />}
            label="Nổi Bật"
            sx={{
              mb: 2,
              backgroundColor: "primary.light",
              color: "primary.dark",
              fontWeight: 600,
              fontSize: "0.85rem",
              height: "32px",
            }}
          />
          <Typography variant="h2" sx={pricingStyles.featuredTitle}>
            Dịch Vụ Nổi Bật
          </Typography>
          <Typography variant="body1" sx={pricingStyles.description}>
            Khám phá các gói dịch vụ chăm sóc sức khỏe và sắc đẹp được yêu thích
            nhất với giá cả hợp lý và chất lượng cao.
          </Typography>
        </Box>

        {/* Featured combos with enhanced design */}
        <Grid container spacing={4} sx={{ mt: 2, mb: 6 }}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{ borderRadius: 4 }}
                  />
                </Grid>
              ))
            : displayServices.map((combo: any, index) => {
                const isFeatured = index === 1; // Combo 4 ở vị trí giữa
                return (
                  <Grid item xs={12} sm={6} md={4} key={combo.id}>
                    <Card
                      sx={{
                        ...pricingStyles.featuredCard,
                        ...(isFeatured && pricingStyles.featuredCardHighlight),
                      }}
                    >
                      {isFeatured && (
                        <Box sx={pricingStyles.featuredBadge}>
                          <Star sx={{ fontSize: "1rem", mr: 0.5 }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                          >
                            PHỔ BIẾN NHẤT
                          </Typography>
                        </Box>
                      )}
                      <CardContent sx={pricingStyles.featuredCardContent}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Spa
                            sx={{
                              fontSize: "2.5rem",
                              color: isFeatured
                                ? "primary.main"
                                : "primary.light",
                              mr: 2,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.4rem",
                                color: isFeatured
                                  ? "primary.dark"
                                  : "text.primary",
                                mb: 0.5,
                                fontFamily: '"Playfair Display", serif',
                              }}
                            >
                              {combo.name}
                            </Typography>
                            {combo.duration && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 600 }}
                              >
                                {combo.duration}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ my: 4, textAlign: "center" }}>
                          <Typography
                            variant="h3"
                            sx={{
                              ...pricingStyles.featuredPrice,
                              color: isFeatured
                                ? "primary.main"
                                : "text.primary",
                              fontSize: isFeatured ? "2.75rem" : "2.25rem",
                              fontWeight: 800,
                            }}
                          >
                            {combo.price_range || formatPrice(combo.price)}
                          </Typography>
                        </Box>

                        <Stack spacing={1} sx={{ mb: 4 }}>
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: "16px",
                              backgroundColor: isFeatured
                                ? "rgba(212, 175, 140, 0.15)"
                                : "rgba(0, 0, 0, 0.02)",
                              border: isFeatured
                                ? "1px dashed rgba(212, 175, 140, 0.5)"
                                : "none",
                              minHeight: "80px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: isFeatured
                                  ? "primary.dark"
                                  : "text.secondary",
                                fontWeight: 600,
                                textAlign: "center",
                                lineHeight: 1.6,
                              }}
                            >
                              {combo.name.toLowerCase().includes("thải độc")
                                ? "Liệu trình chuyên sâu giải độc tố cho da hoàn hảo (18 bước)"
                                : `${combo.steps_count || combo.steps?.length || 11} bước chăm sóc chuyên sâu & thư giãn tuyệt đối`}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          variant={isFeatured ? "contained" : "outlined"}
                          fullWidth
                          onClick={() => openModal(combo.id)}
                          sx={{
                            ...(isFeatured
                              ? {
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "primary.dark",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                      "0 12px 25px rgba(212, 175, 140, 0.4)",
                                  },
                                }
                              : {
                                  borderColor: "primary.main",
                                  color: "primary.main",
                                  "&:hover": {
                                    borderColor: "primary.dark",
                                    backgroundColor:
                                      "rgba(212, 175, 140, 0.05)",
                                    transform: "translateY(-4px)",
                                  },
                                }),
                            py: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          Đặt Lịch Ngay
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 2 }}>
          <Button
            component={Link}
            to="/pricing"
            variant="outlined"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 3,
              textTransform: "none",
              borderColor: "primary.main",
              borderWidth: 2,
              color: "primary.main",
              backgroundColor: "white",
              "&:hover": {
                borderColor: "primary.dark",
                backgroundColor: "primary.light",
                color: "primary.dark",
                borderWidth: 2,
                transform: "translateY(-3px)",
                boxShadow: "0 8px 25px rgba(212, 175, 140, 0.3)",
              },
            }}
          >
            Xem Tất Cả Bảng Giá
          </Button>
        </Box>
      </Container>
      <BookingModal
        open={isOpen}
        onClose={closeModal}
        initialService={selectedService}
      />
    </Box>
  );
};

export default PricingSection;
