import { Box, Typography, Button, Container } from '@mui/material'
import { heroStyles } from '../styles'
import BookingModal from '../../../components/BookingModal'
import { useBookingModal } from '../../../hooks/useBookingModal'

const HeroSection = () => {
  const { isOpen, openModal, closeModal } = useBookingModal()

  return (
    <Box sx={heroStyles.container}>
      <Container maxWidth="lg">
        <Box sx={heroStyles.content}>
          <Typography
            variant="h1"
            sx={heroStyles.title}
          >
            Beauty and Spa Center
          </Typography>
          <Typography
            variant="body1"
            sx={heroStyles.description}
          >
            Lorem ipsum dolor sit amet, eum modus ludus efficiendi ad, in sea ceteros postulant imperdiet, mel ei harum appellantur disputationi. Ridens pertinax eos ei, mel ad mazim nominati sensibus. Unum dolorum epicurei eum ne. Voluptaria quaerendum.
          </Typography>
          <Box sx={heroStyles.buttonContainer}>
            <Button
              variant="contained"
              size="large"
              onClick={() => openModal()}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '14px', md: '16px' },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'primary.main',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              BOOK NOW
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '14px', md: '16px' },
                borderColor: 'rgba(255, 255, 255, 0.8)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              LEARN MORE
            </Button>
          </Box>
        </Box>
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} />
    </Box>
  )
}

export default HeroSection

