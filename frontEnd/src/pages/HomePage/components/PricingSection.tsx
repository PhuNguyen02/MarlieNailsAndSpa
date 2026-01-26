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
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Star, Spa } from '@mui/icons-material'
import { pricingStyles } from '../styles'
import spaServices from '../../../data/spaServices'
import { formatPrice } from '../../../utils'
import BookingModal from '../../../components/BookingModal'
import { useBookingModal } from '../../../hooks/useBookingModal'

const PricingSection = () => {
  // Chỉ hiển thị 3 combo phổ biến nhất (Combo 1, 2, 3)
  const featuredCombos = spaServices.goi_dau_duong_sinh.slice(0, 3)
  const { isOpen, selectedService, openModal, closeModal } = useBookingModal()

  return (
    <Box sx={pricingStyles.featuredContainer}>
      {/* Background decorative elements */}
      <Box sx={pricingStyles.backgroundPattern} />
      
      <Container maxWidth="lg">
        <Box sx={pricingStyles.header}>
          <Chip
            icon={<Star sx={{ color: 'primary.main' }} />}
            label="Nổi Bật"
            sx={{
              mb: 2,
              backgroundColor: 'primary.light',
              color: 'primary.dark',
              fontWeight: 600,
              fontSize: '0.85rem',
              height: '32px',
            }}
          />
          <Typography variant="h2" sx={pricingStyles.featuredTitle}>
            Dịch Vụ Nổi Bật
          </Typography>
          <Typography variant="body1" sx={pricingStyles.description}>
            Khám phá các gói dịch vụ chăm sóc sức khỏe và sắc đẹp được yêu thích nhất với giá cả hợp lý và chất lượng cao.
          </Typography>
        </Box>

        {/* Featured combos with enhanced design */}
        <Grid container spacing={4} sx={{ mt: 2, mb: 6 }}>
          {featuredCombos.map((combo, index) => {
            const isFeatured = index === 1 // Combo 2 là featured
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
                      <Star sx={{ fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                        PHỔ BIẾN NHẤT
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={pricingStyles.featuredCardContent}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Spa
                        sx={{
                          fontSize: '2rem',
                          color: isFeatured ? 'primary.main' : 'primary.light',
                          mr: 1.5,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: isFeatured ? 'primary.dark' : 'text.primary',
                            mb: 0.5,
                          }}
                        >
                          {combo.name}
                        </Typography>
                        {combo.duration && (
                          <Chip
                            label={combo.duration}
                            size="small"
                            sx={{
                              backgroundColor: isFeatured ? 'primary.main' : 'primary.light',
                              color: isFeatured ? 'white' : 'primary.dark',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: '24px',
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ my: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          ...pricingStyles.featuredPrice,
                          color: isFeatured ? 'primary.main' : 'text.primary',
                          fontSize: isFeatured ? '2.5rem' : '2rem',
                        }}
                      >
                        {formatPrice(combo.price)}
                      </Typography>
                    </Box>

                    {combo.steps && (
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: isFeatured ? 'primary.light' : 'rgba(212, 175, 140, 0.1)',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: isFeatured ? 'primary.dark' : 'text.secondary',
                              fontWeight: 600,
                            }}
                          >
                            {combo.steps.length}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: isFeatured ? 'primary.dark' : 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            bước chăm sóc chuyên nghiệp
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    <Button
                      variant={isFeatured ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => openModal(combo.id)}
                      sx={{
                        ...(isFeatured
                          ? {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(212, 175, 140, 0.4)',
                              },
                            }
                          : {
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'primary.light',
                                transform: 'translateY(-2px)',
                              },
                            }),
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Đặt Lịch Ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
          <Button
            component={Link}
            to="/pricing"
            variant="outlined"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              borderColor: 'primary.main',
              borderWidth: 2,
              color: 'primary.main',
              backgroundColor: 'white',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
                color: 'primary.dark',
                borderWidth: 2,
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(212, 175, 140, 0.3)',
              },
            }}
          >
            Xem Tất Cả Bảng Giá
          </Button>
        </Box>
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} initialService={selectedService} />
    </Box>
  )
}

export default PricingSection

