import { Box } from '@mui/material'
import { Header, Footer } from '../HomePage/components'
import FullPricingSection from './components/FullPricingSection'

const PricingPage = () => {
  return (
    <Box
      sx={{
        overflowX: 'hidden',
        '& *': {
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        },
      }}
    >
      <Header />
      <Box sx={{ pt: { xs: 8, md: 10 } }}>
        <FullPricingSection />
      </Box>
      <Footer />
    </Box>
  )
}

export default PricingPage

