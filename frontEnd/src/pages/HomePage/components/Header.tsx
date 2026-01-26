import { AppBar, Toolbar, Box, Button, Typography, Container, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BookingModal from '../../../components/BookingModal'
import { useBookingModal } from '../../../hooks/useBookingModal'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isOpen, openModal, closeModal } = useBookingModal()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { label: 'TRANG CHỦ', path: '/' },
    { label: 'BẢNG GIÁ', path: '/pricing' },
    { label: 'DỊCH VỤ', path: '/' },
    { label: 'LIÊN HỆ', path: '/' },
  ]

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled 
          ? 'rgba(255, 255, 255, 0.98)' 
          : 'transparent',
        boxShadow: scrolled 
          ? '0 2px 20px rgba(0, 0, 0, 0.08)' 
          : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        color: scrolled ? 'text.primary' : 'white',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between', 
            py: scrolled ? 1.5 : 2,
            transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontWeight: 600,
              letterSpacing: '3px',
              color: scrolled ? 'primary.main' : 'white',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            REINA
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: 'inherit',
                  fontSize: '14px',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  letterSpacing: '0.5px',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor:
                    location.pathname === item.path
                      ? scrolled
                        ? 'rgba(212, 175, 140, 0.15)'
                        : 'rgba(255, 255, 255, 0.15)'
                      : 'transparent',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: scrolled 
                      ? 'rgba(212, 175, 140, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => openModal()}
              sx={{
                backgroundColor: scrolled ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: scrolled ? 'none' : 'blur(10px)',
                border: scrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: scrolled ? 'primary.dark' : 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                },
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              BOOK NOW
            </Button>
            <IconButton
              sx={{
                color: 'inherit',
                display: { xs: 'flex', md: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <BookingModal open={isOpen} onClose={closeModal} />
    </AppBar>
  )
}

export default Header

