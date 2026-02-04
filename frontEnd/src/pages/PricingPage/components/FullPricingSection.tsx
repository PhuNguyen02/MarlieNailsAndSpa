import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import { pricingStyles } from "../../HomePage/styles";
import { formatPrice } from "../../../utils";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";
import { useServices } from "../../../hooks";
import { Skeleton } from "@mui/material";
import PromotionPricing from "./PromotionPricing";

const SKIN_CARE_STEPS: Record<string, string[]> = {
  "Lấy Nhân Mụn Cơ bản": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào da chết",
    "Massage mặt",
    "Xông hơi + Cà sủi",
    "Hút bã nhờn",
    "Sát khuẩn lần 1",
    "Lấy nhân mụn",
    "Sát khuẩn lần 2",
    "Điện tím",
    "Đắp mặt nạ + Chiếu đèn sinh học",
    "Massage đầu",
  ],
  "Lấy Nhân Mụn Cấp độ 2": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào da chết",
    "Massage mặt",
    "Xông hơi + Cà sủi",
    "Ủ mụn",
    "Hút bã nhờn",
    "Sát khuẩn lần 1",
    "Lấy nhân mụn",
    "Sát khuẩn lần 2",
    "Điện tím",
    "Đắp mặt nạ + Chiếu đèn",
    "Massage đầu",
  ],
  "Thải Độc Da": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào da chết",
    "Massage mặt nâng cơ",
    "Xông hơi + Cà sủi",
    "Aqua Peel",
    "Đắp mask",
    "Chiếu đèn sinh học",
    "Massage đầu",
    "Thoa Serum",
    "Điện di",
  ],
  "Cấy trắng NANO": [
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào chết da",
    "Massage mặt",
    "Xông hơi + Cà sủi",
    "Phun Oxyjet",
    "Cấy trắng bằng máy DOCTORPEN",
    "Chiếu ánh sáng",
    "Đắp mask",
    "Massage đầu",
    "Thoa Serum",
    "Điện di",
    "Thoa kem chống nắng",
  ],
  "Lấy nhân mụn chuyên sâu": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào da chết",
    "Massage Mặt",
    "Xông hơi + Cà sủi",
    "Ủ mụn",
    "Hút bã nhờn",
    "Sát khuẩn lần 1",
    "Lấy nhân mụn",
    "Sát khuẩn lần 2",
    "Đắp mặt nạ chiếu đèn",
    "Đi tinh chất",
    "Đùa nóng lạnh",
    "Massage đầu",
    "Đi điện tím",
  ],
  "Thải Độc CO2": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào da chết",
    "Massage mặt (Đối với da không có mụn viêm)",
    "Xông hơi + Cà sủi",
    "Hút bã nhờn",
    "Sát khuẩn lần 1",
    "Lấy nhân mụn nếu có ít",
    "Sát khuẩn lần 2",
    "Điện tím",
    "Thải độc CO2",
    "Chiếu đèn sinh học",
    "Massage đầu",
    "Đắp mask",
    "Thoa Serum",
    "Điện di",
    "Thoa Kem chống nắng",
  ],
  "PEEL DA": [
    "Soi da",
    "Tẩy trang",
    "Rửa mặt",
    "Tẩy tế bào chết",
    "Xông hơi + Cà sủi",
    "Hút bã nhờn",
    "Sát khuẩn lần 1",
    "Lấy nhân mụn nếu có ít",
    "Sát khuẩn lần 2",
    "Điện tím",
    "Peel da",
    "Điện di",
  ],
};

const FullPricingSection = () => {
  const { servicesByCategory, loading } = useServices();
  const { isOpen, selectedService, openModal, closeModal } = useBookingModal();
  return (
    <Box sx={pricingStyles.container}>
      <Container maxWidth="lg">
        <Box sx={pricingStyles.header}>
          <Typography variant="overline" sx={pricingStyles.overline}>
            Bảng Giá
          </Typography>
          <Typography variant="h2" sx={pricingStyles.title}>
            Dịch Vụ Spa
          </Typography>
          <Typography variant="body1" sx={pricingStyles.description}>
            Khám phá các gói dịch vụ chăm sóc sức khỏe và sắc đẹp với giá cả hợp
            lý và chất lượng cao.
          </Typography>
        </Box>

        {/* Gội đầu dưỡng sinh */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Gội Đầu Dưỡng Sinh
          </Typography>
          <Grid
            container
            spacing={3}
            sx={{ mt: 2, alignItems: { xs: "stretch", md: "flex-start" } }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))
              : servicesByCategory.goi_dau_duong_sinh.map((combo) => (
                  <Grid item xs={12} sm={6} md={3} key={combo.id}>
                    <Card
                      sx={{
                        ...pricingStyles.card,
                        height: { xs: "100%", md: "auto" },
                        minHeight: { md: "100%" },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent
                        sx={{
                          ...pricingStyles.cardContent,
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, fontSize: "1.25rem" }}
                          >
                            {combo.name}
                          </Typography>
                          {combo.duration && (
                            <Chip
                              label={combo.duration}
                              size="small"
                              sx={{
                                backgroundColor: "primary.light",
                                color: "primary.dark",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="h5" sx={pricingStyles.price}>
                          {formatPrice(combo.price, combo.price_range)}
                        </Typography>
                        {combo.steps && (
                          <Accordion
                            sx={{
                              mt: 2,
                              boxShadow: "none",
                              "&:before": { display: "none" },
                              "&.Mui-expanded": {
                                margin: "16px 0",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                px: 0,
                                minHeight: "auto",
                                "& .MuiAccordionSummary-content": { my: 1 },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "0.85rem",
                                  color: "text.secondary",
                                }}
                              >
                                Xem chi tiết các bước
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pt: 0 }}>
                              <List dense sx={{ py: 0 }}>
                                {combo.steps.map((step, idx) => (
                                  <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                                    <ListItemText
                                      primary={step}
                                      primaryTypographyProps={{
                                        variant: "body2",
                                        fontSize: "0.85rem",
                                      }}
                                      sx={{
                                        "& .MuiListItemText-primary": {
                                          color: "text.secondary",
                                        },
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        )}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openModal(combo.id)}
                          sx={{
                            mt: 2,
                            py: 1.5,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "primary.dark",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(212, 175, 140, 0.4)",
                            },
                          }}
                        >
                          Đặt Lịch
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* Nail Services */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Dịch Vụ Nail
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={pricingStyles.card}>
                <CardContent sx={pricingStyles.cardContent}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "primary.dark" }}
                  >
                    Sơn Gel & Chăm Sóc
                  </Typography>
                  <List>
                    {loading
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <ListItem key={index}>
                            <Skeleton variant="text" width="100%" />
                          </ListItem>
                        ))
                      : servicesByCategory.nail.gel_polish.map((service) => (
                          <ListItem
                            key={service.id}
                            sx={{
                              px: 0,
                              py: 1.5,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <ListItemText
                                primary={service.name}
                                secondary={formatPrice(
                                  service.price,
                                  service.price_range,
                                )}
                                secondaryTypographyProps={{
                                  sx: {
                                    color: "primary.main",
                                    fontWeight: 600,
                                    mt: 0.5,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openModal(service.id || "")}
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                py: 0.75,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textTransform: "none",
                                borderColor: "primary.main",
                                color: "primary.main",
                                "&:hover": {
                                  borderColor: "primary.dark",
                                  backgroundColor: "primary.light",
                                  color: "primary.dark",
                                },
                              }}
                            >
                              Đặt Lịch
                            </Button>
                          </ListItem>
                        ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={pricingStyles.card}>
                <CardContent sx={pricingStyles.cardContent}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "primary.dark" }}
                  >
                    Nối Móng & Tạo Form
                  </Typography>
                  <List>
                    {loading
                      ? Array.from({ length: 3 }).map((_, index) => (
                          <ListItem key={index}>
                            <Skeleton variant="text" width="100%" />
                          </ListItem>
                        ))
                      : servicesByCategory.nail.extensions.map((service) => (
                          <ListItem
                            key={service.id}
                            sx={{
                              px: 0,
                              py: 1.5,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <ListItemText
                                primary={service.name}
                                secondary={formatPrice(service.price)}
                                secondaryTypographyProps={{
                                  sx: {
                                    color: "primary.main",
                                    fontWeight: 600,
                                    mt: 0.5,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openModal(service.id || "")}
                              sx={{
                                minWidth: "auto",
                                px: 2,
                                py: 0.75,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                textTransform: "none",
                                borderColor: "primary.main",
                                color: "primary.main",
                                "&:hover": {
                                  borderColor: "primary.dark",
                                  backgroundColor: "primary.light",
                                  color: "primary.dark",
                                },
                              }}
                            >
                              Đặt Lịch
                            </Button>
                          </ListItem>
                        ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Chăm sóc da */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Chăm Sóc Da
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton
                      variant="rectangular"
                      height={150}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))
              : servicesByCategory.cham_soc_da.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Card sx={pricingStyles.card}>
                      <CardContent sx={pricingStyles.cardContent}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, fontSize: "1.1rem" }}
                        >
                          {service.name}
                        </Typography>
                        <Typography variant="h5" sx={pricingStyles.price}>
                          {formatPrice(service.price)}
                        </Typography>
                        {/* Hiển thị các bước nếu có trong database hoặc trong bản đồ local */}
                        {(service.steps || SKIN_CARE_STEPS[service.name]) && (
                          <Accordion
                            sx={{
                              mt: 2,
                              boxShadow: "none",
                              "&:before": { display: "none" },
                              "&.Mui-expanded": {
                                margin: "12px 0",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                px: 0,
                                minHeight: "auto",
                                "& .MuiAccordionSummary-content": { my: 1 },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "0.85rem",
                                  color: "text.secondary",
                                  fontWeight: 500,
                                }}
                              >
                                Xem chi tiết{" "}
                                {
                                  (
                                    service.steps ||
                                    SKIN_CARE_STEPS[service.name]
                                  ).length
                                }{" "}
                                bước
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pt: 0 }}>
                              <List dense sx={{ py: 0 }}>
                                {(
                                  service.steps || SKIN_CARE_STEPS[service.name]
                                ).map((step: string, idx: number) => (
                                  <ListItem
                                    key={idx}
                                    sx={{
                                      py: 0.25,
                                      px: 0,
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        mr: 1,
                                        color: "primary.main",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {idx + 1}.
                                    </Typography>
                                    <ListItemText
                                      primary={step}
                                      primaryTypographyProps={{
                                        variant: "body2",
                                        fontSize: "0.8rem",
                                        lineHeight: 1.4,
                                      }}
                                      sx={{
                                        m: 0,
                                        "& .MuiListItemText-primary": {
                                          color: "text.secondary",
                                        },
                                      }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        )}
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openModal(service.id)}
                          sx={{
                            mt:
                              service.steps || SKIN_CARE_STEPS[service.name]
                                ? 1
                                : 2,
                            py: 1.5,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "primary.dark",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(212, 175, 140, 0.4)",
                            },
                          }}
                        >
                          Đặt Lịch
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* Triệt lông */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Triệt Lông
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Skeleton
                      variant="rectangular"
                      height={250}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))
              : servicesByCategory.triet_long.map((service) => (
                  <Grid item xs={12} md={4} key={service.id}>
                    <Card sx={pricingStyles.card}>
                      <CardContent sx={pricingStyles.cardContent}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 2, fontSize: "1.2rem" }}
                        >
                          {service.name}
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Lần 1:
                          </Typography>
                          <Typography variant="h6" sx={pricingStyles.price}>
                            {formatPrice(service.single_price)}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Gói 10 lần:
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ ...pricingStyles.price, color: "#2e7d32" }}
                          >
                            {formatPrice(service.package_10_sessions)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            Tiết kiệm{" "}
                            {formatPrice(
                              (service.single_price || 0) * 10 -
                                (service.package_10_sessions || 0),
                            )}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openModal(service.id)}
                          sx={{
                            mt: 3,
                            py: 1.5,
                            backgroundColor: "primary.main",
                            color: "white",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            "&:hover": {
                              backgroundColor: "primary.dark",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(212, 175, 140, 0.4)",
                            },
                          }}
                        >
                          Đặt Lịch
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Box>
        <PromotionPricing />
      </Container>
      <BookingModal
        open={isOpen}
        onClose={closeModal}
        initialService={selectedService}
      />
    </Box>
  );
};

export default FullPricingSection;
