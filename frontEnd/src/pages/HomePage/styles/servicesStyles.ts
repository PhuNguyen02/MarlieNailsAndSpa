import { SxProps, Theme } from '@mui/material'

export const servicesStyles: Record<string, SxProps<Theme>> = {
  container: {
    position: 'relative',
    py: { xs: 8, md: 12 },
    backgroundColor: '#f8f6f3', // Light beige/off-white
    overflow: 'hidden',
    width: '100%',
  },
  botanicalPattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: { xs: '30%', md: '25%' },
    opacity: 0.15,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a574' fill-opacity='0.4'%3E%3Cpath d='M100 100c0-20 20-40 40-40s40 20 40 40-20 40-40 40-40-20-40-40zm-60 0c0-20 20-40 40-40s40 20 40 40-20 40-40 40-40-20-40-40zm120-60c0-20 20-40 40-40s40 20 40 40-20 40-40 40-40-20-40-40zM40 40c0-20 20-40 40-40s40 20 40 40-20 40-40 40-40-20-40-40z'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },
  containerInner: {
    position: 'relative',
    zIndex: 1,
    py: { xs: 4, md: 6 },
  },
  cardsGrid: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 2,
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(255, 107, 107, 0.2)',
    },
  },
  cardContent: {
    p: { xs: 3, md: 4 },
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 3,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& svg': {
      fontSize: { xs: '3.5rem', md: '4.5rem' },
      color: '#ff6b6b', // Coral-red color
      transition: 'all 0.3s ease',
    },
  },
  title: {
    fontWeight: 700,
    fontSize: { xs: '1rem', md: '1.125rem' },
    color: '#2c3e50', // Dark grey
    mb: 2,
    letterSpacing: '0.02em',
    lineHeight: 1.4,
    transition: 'color 0.3s ease',
  },
  description: {
    color: '#7f8c8d', // Lighter grey
    fontSize: { xs: '0.875rem', md: '0.9375rem' },
    lineHeight: 1.6,
    transition: 'color 0.3s ease',
    textAlign: 'center',
  },
  header: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    mb: 8,
    maxWidth: '800px',
    mx: 'auto',
    px: 2,
  },
  dandelionIcon: {
    mb: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    fontSize: { xs: '2.5rem', md: '3.5rem' },
    fontWeight: 400,
    color: '#2d5a5a',
    mb: 4,
    letterSpacing: '0.02em',
  },
  headerDescription: {
    fontSize: { xs: '0.95rem', md: '1.1rem' },
    color: '#666666',
    lineHeight: 1.8,
    textAlign: 'justify',
    maxWidth: '700px',
    mx: 'auto',
  },
}
