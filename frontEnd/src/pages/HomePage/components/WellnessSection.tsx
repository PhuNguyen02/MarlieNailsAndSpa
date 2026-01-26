import { Box, Container, Typography, Button, Grid } from '@mui/material'
import { wellnessStyles } from '../styles'

const WellnessSection = () => {
  return (
    <Box sx={wellnessStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={wellnessStyles.overline}>
              Unforgettable
            </Typography>
            <Typography variant="h2" sx={wellnessStyles.title}>
              Wellness & Spa
            </Typography>
            <Typography variant="body1" sx={wellnessStyles.description}>
              Vix te soleat eirmod civibus. Ius ad autem dicam exerci, sed et erremasc simul phaedrum, ex latine minimum deleniti has. No mei case assenna. Mea nobis putent discere no. Duo ea homero senserit, fugit quando intellegat dicam no his ullum.
            </Typography>
            <Button
              variant="contained"
              sx={wellnessStyles.button}
            >
              BOOK NOW
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={wellnessStyles.imageContainer}>
              <Box sx={wellnessStyles.image}>
                <Box
                  component="img"
                  src="https://picsum.photos/800/500?random=3"
                  alt="Wellness & Spa"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default WellnessSection

