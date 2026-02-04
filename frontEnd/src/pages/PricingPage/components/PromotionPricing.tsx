import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { pricingStyles } from "../../HomePage/styles";
import { formatPrice } from "../../../utils";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";

const promoServices = [
  { name: "Các loại mặt nạ", price: 30000 },
  { name: "Máy thải độc trị đau chân", price: 60000 },
  { name: "Bắn tàn nhang, nốt ruồi", price_range: "30.000 - 300.000" },
  { name: "Tẩy tế bào chết da đầu", price: 35000 },
  { name: "Tẩy tế bào chết da mặt", price: 35000 },
  { name: "Xông nến tai", price: 35000 },
  { name: "Ngâm chân thảo dược - massage chân", price: 149000 },
  {
    name: "Chà gót chân + massage chân",
    price: 200000,
    description: "Ngâm chân thảo dược + massage",
  },
  { name: "Massage mặt chuyên sâu nâng cơ", price: 99000, duration: "30p" },
  { name: "Đá ngọc thạch (thêm)", price: 40000, isAddon: true },
  { name: "Massage body - 30 phút", price: 189000, duration: "30p" },
  { name: "Massage body - 60 phút", price: 355000, duration: "60p" },
  { name: "Massage body - 90 phút", price: 499000, duration: "90p" },
  { name: "Đá nóng (thêm)", price: 40000, isAddon: true },
  { name: "Tắm trắng máy hấp", price: 450000 },
];

const PromotionPricing = () => {
  const { isOpen, selectedService, openModal, closeModal } = useBookingModal();

  return (
    <Box sx={{ mb: 10 }}>
      {/* Banner Khuyến Mãi */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
          color: "white",
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 6,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(212, 175, 140, 0.3)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Decor */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            background:
              "radial-gradient(circle, rgba(212, 175, 140, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
              }}
            >
              <LocalOfferIcon />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontFamily: '"Playfair Display", serif',
                letterSpacing: "1px",
              }}
            >
              CHƯƠNG TRÌNH KHUYẾN MÃI MUA 5 TẶNG 1
            </Typography>
            <Chip
              label="SPECIAL OFFER"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: 700,
                px: 1,
                fontSize: "0.8rem",
                animation: "pulse 2s infinite",
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              maxWidth: "800px",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Tận hưởng liệu trình chăm sóc sắc đẹp cao cấp với ưu đãi đặc biệt:
            Mua gói 5 buổi tặng ngay 1 buổi miễn phí. Áp dụng cho danh sách các
            dịch vụ đa dạng dưới đây giúp bạn duy trì vẻ đẹp rạng ngời một cách
            tiết kiệm nhất.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          {promoServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  background: service.isAddon
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  border: "1px solid rgba(212, 175, 140, 0.2)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: service.isAddon
                          ? "rgba(255,255,255,0.7)"
                          : "white",
                        lineHeight: 1.4,
                      }}
                    >
                      {service.name}
                    </Typography>
                    {service.isAddon && (
                      <AutoAwesomeIcon
                        sx={{ color: "primary.main", fontSize: "1.2rem" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    {service.duration && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "primary.light",
                          fontWeight: 600,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        {service.duration}
                      </Typography>
                    )}

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "primary.light",
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {service.price_range
                        ? service.price_range
                        : formatPrice(service.price)}
                    </Typography>

                    {service.description && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          mt: 1,
                          display: "block",
                        }}
                      >
                        ({service.description})
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={() => openModal()}
                      sx={{
                        mt: 2,
                        py: 1,
                        background:
                          "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #e8d4c0 0%, #d4af8c 100%)",
                        },
                      }}
                    >
                      Đặt Lịch
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <BookingModal open={isOpen} onClose={closeModal} />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default PromotionPricing;
