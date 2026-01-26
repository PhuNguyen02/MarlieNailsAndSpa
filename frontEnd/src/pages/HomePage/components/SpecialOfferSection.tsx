import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import StarIcon from '@mui/icons-material/Star'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import spaServices from '../../../data/spaServices'
import { formatPrice } from '../../../utils'
import BookingModal from '../../../components/BookingModal'
import { useBookingModal } from '../../../hooks/useBookingModal'

const SpecialOfferSection = () => {
  const { isOpen, selectedService, openModal, closeModal } = useBookingModal()

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 50%, #fff5e6 100%)',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Promotional Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ff6b35 100%)',
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 3, md: 4 },
            mb: { xs: 4, md: 5 },
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.3,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                mb: 2,
                flexWrap: 'wrap',
              }}
            >
              <WhatshotIcon
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  color: 'white',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                    '50%': {
                      transform: 'scale(1.15)',
                      opacity: 0.9,
                    },
                  },
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontFamily: '"Playfair Display", serif',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                MUA 5 TẶNG 1
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.25rem' },
                opacity: 0.95,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Chương trình ưu đãi đặc biệt - Mua 5 buổi trị liệu, tặng ngay 1 buổi miễn phí!
              <br />
              <Box component="span" sx={{ fontWeight: 700, fontSize: '1.1em' }}>
                Áp dụng cho tất cả dịch vụ dưới đây
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Services Grid - Horizontal Layout */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {spaServices.uu_dai_mua_5_tang_1.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'white',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'rgba(255, 107, 53, 0.2)',
                  boxShadow: '0 4px 20px rgba(255, 107, 53, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(255, 107, 53, 0.25)',
                    borderColor: '#ff6b35',
                  },
                }}
              >
                {/* Ribbon Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: -30,
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    px: 4,
                    py: 0.5,
                    transform: 'rotate(45deg)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)',
                    zIndex: 2,
                    width: '120px',
                    textAlign: 'center',
                  }}
                >
                  ƯU ĐÃI
                </Box>

                <CardContent sx={{ p: { xs: 2.5, md: 3 }, pt: { xs: 4, md: 4.5 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <LocalOfferIcon
                      sx={{
                        fontSize: '1.5rem',
                        color: '#ff6b35',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        flex: 1,
                      }}
                    >
                      {service.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 140, 66, 0.1) 100%)',
                      borderRadius: 2,
                      p: 2,
                      mb: 2.5,
                      border: '1px solid',
                      borderColor: 'rgba(255, 107, 53, 0.2)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 0.5,
                        fontSize: '0.85rem',
                      }}
                    >
                      Giá ưu đãi
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#ff6b35',
                        fontWeight: 800,
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {formatPrice(service.price)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => openModal(service.id)}
                    startIcon={<StarIcon />}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#ff6b35',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                      '&:hover': {
                        backgroundColor: '#e55a2b',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
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
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} initialService={selectedService} />
    </Box>
  )
}

export default SpecialOfferSection

