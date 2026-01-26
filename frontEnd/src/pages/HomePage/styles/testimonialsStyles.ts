import { SxProps, Theme } from '@mui/material'

export const testimonialsStyles: Record<string, SxProps<Theme>> = {
  container: {
    py: { xs: 8, md: 12 },
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: { xs: '2.25rem', md: '3.5rem', lg: '4rem' },
    fontWeight: 300,
    mb: 2,
    color: 'text.primary',
    fontFamily: '"Playfair Display", serif',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: { xs: '1rem', md: '1.125rem' },
    color: 'text.secondary',
    maxWidth: '700px',
    mx: 'auto',
    lineHeight: 1.7,
  },
  card: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '"\\201C"',
      position: 'absolute',
      top: 20,
      left: 20,
      fontSize: '80px',
      color: 'primary.main',
      opacity: 0.1,
      fontFamily: '"Playfair Display", serif',
      lineHeight: 1,
    },
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  text: {
    fontStyle: 'italic',
    lineHeight: 1.8,
    color: 'text.secondary',
    fontSize: { xs: '0.95rem', md: '1rem' },
    position: 'relative',
    zIndex: 1,
  },
  author: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '0.95rem', md: '1rem' },
  },
}

