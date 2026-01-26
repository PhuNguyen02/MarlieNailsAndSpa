import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material'
import { testimonialsStyles } from '../styles'

const testimonials = [
  {
    text: 'Lorem ipsum dolor sit amet, ut zril eirmod cotidieque eum. Vis dico enim in, sit feugiat vocibus at, ne doctus ullum labores dolorem ut, ex pro discere philosophia delicatissimi his.',
    author: 'Malia Bourne',
    service: 'Relax massage',
  },
  {
    text: 'Lorem ipsum dolor sit amet, ut zril eirmod cotidieque eum. Vis dico enim in, sit feugiat vocibus at, ne doctus ullum labores dolorem ut, ex pro discere philosophia delicatissimi his.',
    author: 'Alyce Charlton',
    service: 'Relax massage',
  },
  {
    text: 'Lorem ipsum dolor sit amet, ut zril eirmod cotidieque eum. Vis dico enim in, sit feugiat vocibus at, ne doctus ullum labores dolorem ut, ex pro discere philosophia delicatissimi his.',
    author: 'Alexia Mason',
    service: 'Relax massage',
  },
]

const TestimonialsSection = () => {
  return (
    <Box sx={testimonialsStyles.container}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" sx={testimonialsStyles.title}>
          A Place of True Splendor
        </Typography>
        <Typography variant="body1" align="center" sx={testimonialsStyles.subtitle}>
          Vide epicurei repudiare qui eu. Quo ea omnium voluptaria dolorum, mandamus vitae comprehensam nec eu option.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={testimonialsStyles.card}>
                <CardContent>
                  <Typography variant="body1" sx={testimonialsStyles.text}>
                    {testimonial.text}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" sx={testimonialsStyles.author}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - {testimonial.service}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default TestimonialsSection

