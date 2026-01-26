import { Box, Container, Grid, Typography, TextField, Button, Link } from '@mui/material'
import { footerStyles } from '../styles'

const Footer = () => {
  return (
    <Box sx={footerStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Reina Spa Center
            </Typography>
            <Typography variant="body2" sx={footerStyles.description}>
              Step into an oasis of magnificence we devised for your new beauty center, resort or spa site. We are sure you'll love your time with Reina.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 2,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(212, 175, 140, 0.4)',
                },
              }}
            >
              book online
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Important Links
            </Typography>
            <Box sx={footerStyles.links}>
              <Link href="#" sx={footerStyles.link}>Book Online</Link>
              <Link href="#" sx={footerStyles.link}>Purchase a Gift Certificate</Link>
              <Link href="#" sx={footerStyles.link}>Spa Promotions</Link>
              <Link href="#" sx={footerStyles.link}>Exclusive Offers & Events</Link>
              <Link href="#" sx={footerStyles.link}>Blog and News</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={footerStyles.title}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={footerStyles.contact}>
              Vesturbraut 17-3<br />
              Keflavík, Iceland<br />
              [email protected]<br />
              Phone: +351 258 548
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ ...footerStyles.title, mt: 3 }}>
              Opening Hours
            </Typography>
            <Typography variant="body2" sx={footerStyles.contact}>
              Monday to Friday 09:00 - 20:00 hrs<br />
              Saturday 09:00 - 18:00 hrs<br />
              Sunday 09:00 - 18:00 hrs
            </Typography>
          </Grid>
        </Grid>
        <Box sx={footerStyles.bottom}>
          <Typography variant="body2" color="text.secondary">
            © 2021 Qode Interactive, All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

