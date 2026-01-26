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
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import StarIcon from '@mui/icons-material/Star'
import { pricingStyles } from '../../HomePage/styles'
import spaServices from '../../../data/spaServices'
import { formatPrice } from '../../../utils'
import BookingModal from '../../../components/BookingModal'
import { useBookingModal } from '../../../hooks/useBookingModal'

const FullPricingSection = () => {
  const { isOpen, selectedService, openModal, closeModal } = useBookingModal()
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
            Khám phá các gói dịch vụ chăm sóc sức khỏe và sắc đẹp với giá cả hợp lý và chất lượng cao.
          </Typography>
        </Box>

        {/* Gội đầu dưỡng sinh */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Gội Đầu Dưỡng Sinh
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2, alignItems: { xs: 'stretch', md: 'flex-start' } }}>
            {spaServices.goi_dau_duong_sinh.map((combo) => (
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                      {formatPrice(combo.price)}
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
                          sx={{ px: 0, minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}
                        >
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
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
                                  sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
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

        {/* Nail Services */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Dịch Vụ Nail
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={pricingStyles.card}>
                <CardContent sx={pricingStyles.cardContent}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                    Sơn Gel & Chăm Sóc
                  </Typography>
                  <List>
                    {spaServices.nail.gel_polish.map((service) => (
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
                              sx: { color: 'primary.main', fontWeight: 600, mt: 0.5 },
                            }}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openModal(service.id || '')}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={pricingStyles.card}>
                <CardContent sx={pricingStyles.cardContent}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                    Nối Móng & Tạo Form
                  </Typography>
                  <List>
                    {spaServices.nail.extensions.map((service) => (
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
                            secondary={formatPrice(service.price)}
                            secondaryTypographyProps={{
                              sx: { color: 'primary.main', fontWeight: 600, mt: 0.5 },
                            }}
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openModal(service.id || '')}
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
            </Grid>
          </Grid>
        </Box>

        {/* Chăm sóc da */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Chăm Sóc Da
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {spaServices.cham_soc_da.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card sx={pricingStyles.card}>
                  <CardContent sx={pricingStyles.cardContent}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                      {service.name}
                    </Typography>
                    <Typography variant="h5" sx={pricingStyles.price}>
                      {formatPrice(service.price)}
                    </Typography>
                    {service.steps_count && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                        {service.steps_count} bước chăm sóc
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openModal(service.id)}
                      sx={{
                        mt: service.steps_count ? 0 : 2,
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

        {/* Triệt lông */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Triệt Lông
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {spaServices.triet_long.map((service) => (
              <Grid item xs={12} md={4} key={service.id}>
                <Card sx={pricingStyles.card}>
                  <CardContent sx={pricingStyles.cardContent}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1.2rem' }}>
                      {service.zone}
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
                      <Typography variant="h6" sx={{ ...pricingStyles.price, color: '#2e7d32' }}>
                        {formatPrice(service.package_10_sessions)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Tiết kiệm{' '}
                        {formatPrice(
                          (service.single_price || 0) * 10 - (service.package_10_sessions || 0)
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

        {/* Ưu đãi */}
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h4" sx={pricingStyles.categoryTitle}>
            Ưu Đãi Đặc Biệt
          </Typography>
          <Box
            sx={{
              mt: 4,
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(212, 175, 140, 0.15) 0%, rgba(184, 149, 111, 0.2) 50%, rgba(212, 175, 140, 0.15) 100%)',
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: '0 8px 32px rgba(212, 175, 140, 0.25)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(212, 175, 140, 0.05) 0%, transparent 50%, rgba(212, 175, 140, 0.05) 100%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, md: 5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                }}
              >
                <LocalOfferIcon
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: 'primary.main',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                      '50%': {
                        transform: 'scale(1.1)',
                        opacity: 0.8,
                      },
                    },
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.dark',
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontFamily: '"Playfair Display", serif',
                    textAlign: 'center',
                  }}
                >
                  Mua 5 Tặng 1
                </Typography>
                <Chip
                  icon={<StarIcon sx={{ color: '#ff6b35 !important' }} />}
                  label="HOT"
                  sx={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    px: 1,
                    height: '32px',
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                      '0%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '50%': {
                        transform: 'translateY(-4px)',
                      },
                    },
                  }}
                />
              </Box>
              <Grid container spacing={3}>
                {spaServices.uu_dai_mua_5_tang_1.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.95) 100%)',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'primary.light',
                        boxShadow: '0 4px 20px rgba(212, 175, 140, 0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'visible',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(212, 175, 140, 0.3)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 16,
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(212, 175, 140, 0.4)',
                          }}
                        >
                          <StarIcon sx={{ color: 'white', fontSize: '1.25rem' }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: 'text.primary',
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            pt: 1,
                          }}
                        >
                          {service.name}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: 'primary.dark',
                            fontWeight: 700,
                            mb: 2.5,
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                            fontFamily: '"Playfair Display", serif',
                          }}
                        >
                          {formatPrice(service.price)}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => openModal(service.id)}
                          sx={{
                            py: 1.5,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(212, 175, 140, 0.3)',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(212, 175, 140, 0.4)',
                            },
                          }}
                        >
                          Đặt Lịch Ngay
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} initialService={selectedService} />
    </Box>
  )
}

export default FullPricingSection

