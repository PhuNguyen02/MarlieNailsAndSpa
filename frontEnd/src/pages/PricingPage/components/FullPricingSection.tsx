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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pricingStyles } from '../../HomePage/styles';
import { formatPrice } from '../../../utils';
import BookingModal from '../../../components/BookingModal';
import { useBookingModal } from '../../../hooks/useBookingModal';
import { useServices } from '../../../hooks';
import { Skeleton } from '@mui/material';
import PromotionPricing from './PromotionPricing';

// Helper component for a simple service list (name + price + book button)
const ServiceListCard = ({
  title,
  services,
  loading,
  openModal,
}: {
  title: string;
  services: any[];
  loading: boolean;
  openModal: (opts: { serviceId: string }) => void;
}) => (
  <Card sx={pricingStyles.card}>
    <CardContent sx={pricingStyles.cardContent}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
        {title}
      </Typography>
      <List>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <ListItem key={index}>
                <Skeleton variant="text" width="100%" />
              </ListItem>
            ))
          : services.map((service) => (
              <ListItem
                key={service.id}
                sx={{
                  px: 0,
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <ListItemText
                    primary={service.name}
                    secondary={formatPrice(service.price, service.price_range)}
                    secondaryTypographyProps={{
                      sx: {
                        color: 'primary.main',
                        fontWeight: 600,
                        mt: 0.5,
                      },
                    }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openModal({ serviceId: service.id || '' })}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    py: 0.75,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.light',
                      color: 'primary.dark',
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
);

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
            Khám phá các gói dịch vụ chăm sóc sức khỏe và sắc đẹp với giá cả hợp lý và chất lượng
            cao.
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
            sx={{ mt: 2, alignItems: { xs: 'stretch', md: 'flex-start' } }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
              : servicesByCategory.goi_dau_duong_sinh.map((combo) => (
                <Grid item xs={12} sm={6} md={3} key={combo.id}>
                  <Card
                    sx={{
                      ...pricingStyles.card,
                      height: { xs: '100%', md: 'auto' },
                      minHeight: { md: '100%' },
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent
                      sx={{
                        ...pricingStyles.cardContent,
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
                          {combo.name}
                        </Typography>
                        {combo.duration && (
                          <Chip
                            label={combo.duration}
                            size="small"
                            sx={{
                              backgroundColor: 'primary.light',
                              color: 'primary.dark',
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
                            boxShadow: 'none',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                              margin: '16px 0',
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              px: 0,
                              minHeight: 'auto',
                              '& .MuiAccordionSummary-content': { my: 1 },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.85rem',
                                color: 'text.secondary',
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
                                      variant: 'body2',
                                      fontSize: '0.85rem',
                                    }}
                                    sx={{
                                      '& .MuiListItemText-primary': {
                                        color: 'text.secondary',
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
                        onClick={() => openModal({ serviceId: combo.id })}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(212, 175, 140, 0.4)',
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

        {/* Eye Lash */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Eye Lash
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <ServiceListCard
                title="Dịch Vụ Nối Mi"
                services={servicesByCategory.eye_lash}
                loading={loading}
                openModal={openModal}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Chăm Sóc Da */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Chăm Sóc Da
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {loading
              ? Array.from({ length: 1 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
              : servicesByCategory.cham_soc_da.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card sx={pricingStyles.card}>
                    <CardContent sx={pricingStyles.cardContent}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}
                      >
                        {service.name}
                      </Typography>
                      <Typography variant="h5" sx={pricingStyles.price}>
                        {formatPrice(service.price)}
                      </Typography>
                      {service.steps && (
                        <Accordion
                          sx={{
                            mt: 2,
                            boxShadow: 'none',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                              margin: '12px 0',
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              px: 0,
                              minHeight: 'auto',
                              '& .MuiAccordionSummary-content': { my: 1 },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.85rem',
                                color: 'text.secondary',
                                fontWeight: 500,
                              }}
                            >
                              Xem chi tiết {service.steps.length} bước
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 0, pt: 0 }}>
                            <List dense sx={{ py: 0 }}>
                              {service.steps.map((step: string, idx: number) => (
                                <ListItem
                                  key={idx}
                                  sx={{
                                    py: 0.25,
                                    px: 0,
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      mr: 1,
                                      color: 'primary.main',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {idx + 1}.
                                  </Typography>
                                  <ListItemText
                                    primary={step}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                      fontSize: '0.8rem',
                                      lineHeight: 1.4,
                                    }}
                                    sx={{
                                      m: 0,
                                      '& .MuiListItemText-primary': {
                                        color: 'text.secondary',
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
                        onClick={() => openModal({ serviceId: service.id })}
                        sx={{
                          mt: service.steps ? 1 : 2,
                          py: 1.5,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(212, 175, 140, 0.4)',
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

        {/* Dịch Vụ Da */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Dịch Vụ Da
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <ServiceListCard
                title="Dịch Vụ Chăm Sóc Da"
                services={servicesByCategory.dich_vu_da}
                loading={loading}
                openModal={openModal}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Dịch Vụ Lẻ (Mua 5 tặng 1) */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Dịch Vụ Lẻ
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'error.main', fontWeight: 600, mt: 1, mb: 2 }}
          >
            Tất cả các dịch vụ Mua 5 tặng 1
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ServiceListCard
                title="Dịch Vụ Lẻ"
                services={servicesByCategory.dich_vu_le}
                loading={loading}
                openModal={openModal}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Design (Nail Art) */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Design
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mt: 1, mb: 2, fontStyle: 'italic' }}
          >
            Vui lòng liên hệ trước, giá sẽ phụ thuộc chi tiết của hình vẽ
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ServiceListCard
                title="Nail Art & Trang Trí"
                services={servicesByCategory.design}
                loading={loading}
                openModal={openModal}
              />
            </Grid>
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
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
              : servicesByCategory.triet_long.map((service) => (
                <Grid item xs={12} md={4} key={service.id}>
                  <Card sx={pricingStyles.card}>
                    <CardContent sx={pricingStyles.cardContent}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 2, fontSize: '1.2rem' }}
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
                          sx={{ ...pricingStyles.price, color: '#2e7d32' }}
                        >
                          {formatPrice(service.package_10_sessions)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          Tiết kiệm{' '}
                          {formatPrice(
                            (service.single_price || 0) * 10 - (service.package_10_sessions || 0),
                          )}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => openModal({ serviceId: service.id })}
                        sx={{
                          mt: 3,
                          py: 1.5,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(212, 175, 140, 0.4)',
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
      <BookingModal open={isOpen} onClose={closeModal} initialService={selectedService} />
    </Box>
  );
};

export default FullPricingSection;
