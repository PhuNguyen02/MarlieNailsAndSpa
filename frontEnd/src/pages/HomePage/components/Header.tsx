import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Spa as SpaIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BookingModal from "../../../components/BookingModal";
import { useBookingModal } from "../../../hooks/useBookingModal";

// Service dropdown items
const serviceItems = [
  { label: "Nail Art", path: "/services/nail-art" },
  { label: "Manicure & Pedicure", path: "/services/manicure-pedicure" },
  { label: "Spa Treatment", path: "/services/spa" },
  { label: "Waxing", path: "/services/waxing" },
  { label: "Eyelash Extensions", path: "/services/eyelash" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [serviceHover, setServiceHover] = useState(false);
  const location = useLocation();
  const { isOpen, openModal, closeModal } = useBookingModal();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Check if we're on homepage - only homepage has transparent header with white text
  const isHomePage = location.pathname === "/";

  // Use solid header style when scrolled OR when not on homepage
  const useSolidHeader = scrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { label: "TRANG CHỦ", path: "/", hasDropdown: false },
    { label: "BẢNG GIÁ", path: "/pricing", hasDropdown: false },
    {
      label: "DỊCH VỤ",
      path: "/services",
      hasDropdown: true,
      dropdownItems: serviceItems,
    },
    { label: "LIÊN HỆ", path: "/contact", hasDropdown: false },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Desktop Navigation Item with animated underline
  const NavItem = ({ item }: { item: (typeof menuItems)[0] }) => {
    const isActive =
      location.pathname === item.path ||
      item.dropdownItems?.some((sub) => location.pathname === sub.path);

    if (item.hasDropdown) {
      return (
        <Box
          onMouseEnter={() => setServiceHover(true)}
          onMouseLeave={() => setServiceHover(false)}
          sx={{ position: "relative" }}
        >
          <Button
            component={Link}
            to={item.path}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transition: "transform 0.3s ease",
                  transform: serviceHover ? "rotate(180deg)" : "rotate(0deg)",
                  fontSize: "18px !important",
                }}
              />
            }
            sx={{
              color: "inherit",
              fontSize: "13px",
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "1.5px",
              px: 2.5,
              py: 1.5,
              borderRadius: 0,
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                width: isActive ? "100%" : "0%",
                height: "2px",
                background: "linear-gradient(90deg, #d4af8c, #b8956f)",
                transform: "translateX(-50%)",
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "2px",
              },
              "&:hover": {
                backgroundColor: "transparent",
                "&::after": {
                  width: "100%",
                },
              },
            }}
          >
            {item.label}
          </Button>

          {/* Dropdown Menu */}
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: "50%",
              minWidth: "220px",
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1)",
              opacity: serviceHover ? 1 : 0,
              visibility: serviceHover ? "visible" : "hidden",
              transform: serviceHover
                ? "translateX(-50%) translateY(8px)"
                : "translateX(-50%) translateY(20px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              py: 1.5,
              zIndex: 1000,
              // Invisible bridge to connect button and dropdown for smooth hover
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-20px",
                left: 0,
                width: "100%",
                height: "20px",
                backgroundColor: "transparent",
              },
            }}
          >
            {item.dropdownItems?.map((subItem, index) => (
              <Box
                key={subItem.label}
                component={Link}
                to={subItem.path}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                  animation: serviceHover
                    ? `fadeInUp 0.3s ease forwards ${index * 0.05}s`
                    : "none",
                  opacity: serviceHover ? 1 : 0,
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(10px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: "3px",
                    background: "linear-gradient(180deg, #d4af8c, #b8956f)",
                    transform: "scaleY(0)",
                    transition: "transform 0.2s ease",
                  },
                  "&:hover": {
                    backgroundColor: alpha("#d4af8c", 0.1),
                    color: "#b8956f",
                    pl: 3.5,
                    "&::before": {
                      transform: "scaleY(1)",
                    },
                  },
                }}
              >
                <SpaIcon sx={{ fontSize: "16px", opacity: 0.7 }} />
                {subItem.label}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    return (
      <Button
        component={Link}
        to={item.path}
        sx={{
          color: "inherit",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 500,
          letterSpacing: "1.5px",
          px: 2.5,
          py: 1.5,
          borderRadius: 0,
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: isActive ? "100%" : "0%",
            height: "2px",
            background: "linear-gradient(90deg, #d4af8c, #b8956f)",
            transform: "translateX(-50%)",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: "2px",
          },
          "&:hover": {
            backgroundColor: "transparent",
            "&::after": {
              width: "100%",
            },
          },
        }}
      >
        {item.label}
      </Button>
    );
  };

  // Mobile Drawer Content
  const drawer = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            letterSpacing: "3px",
            background: "linear-gradient(135deg, #d4af8c 0%, #e8d4c0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MARLIE
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "rotate(90deg)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <List sx={{ flex: 1, py: 3 }}>
        {menuItems.map((item, index) => (
          <Box key={item.label}>
            {item.hasDropdown ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setServicesOpen(!servicesOpen)}
                    sx={{
                      py: 2.5,
                      px: 4,
                      "&:hover": {
                        backgroundColor: "rgba(212, 175, 140, 0.1)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "16px",
                          fontWeight: 500,
                          letterSpacing: "2px",
                        },
                      }}
                    />
                    <ExpandMoreIcon
                      sx={{
                        transition: "transform 0.3s ease",
                        transform: servicesOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Collapse in={servicesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.dropdownItems?.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          py: 1.5,
                          pl: 6,
                          pr: 4,
                          "&:hover": {
                            backgroundColor: "rgba(212, 175, 140, 0.15)",
                          },
                        }}
                      >
                        <SpaIcon
                          sx={{ fontSize: "16px", mr: 2, color: "#d4af8c" }}
                        />
                        <ListItemText
                          primary={subItem.label}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: "14px",
                              fontWeight: 400,
                              letterSpacing: "0.5px",
                              color: "rgba(255,255,255,0.8)",
                            },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                disablePadding
                sx={{
                  animation: `slideInLeft 0.4s ease forwards ${index * 0.1}s`,
                  opacity: 0,
                  "@keyframes slideInLeft": {
                    from: {
                      opacity: 0,
                      transform: "translateX(-20px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                  },
                }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    py: 2.5,
                    px: 4,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: "3px",
                      background: "linear-gradient(180deg, #d4af8c, #b8956f)",
                      transform:
                        location.pathname === item.path
                          ? "scaleY(1)"
                          : "scaleY(0)",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(212, 175, 140, 0.1)",
                      "&::before": {
                        transform: "scaleY(1)",
                      },
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(212, 175, 140, 0.15)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: "2px",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </Box>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Contact Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <PhoneIcon sx={{ fontSize: "18px", color: "#d4af8c" }} />
          <Typography variant="body2" sx={{ letterSpacing: "0.5px" }}>
            0905 969 063
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <ScheduleIcon sx={{ fontSize: "18px", color: "#d4af8c" }} />
          <Typography variant="body2" sx={{ letterSpacing: "0.5px" }}>
            Mở cửa: 9:00 - 20:00
          </Typography>
        </Box>

        {/* CTA Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setMobileOpen(false);
            openModal();
          }}
          sx={{
            py: 2,
            background: "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "2px",
            borderRadius: "50px",
            boxShadow: "0 8px 30px rgba(212, 175, 140, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #e8d4c0 0%, #d4af8c 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(212, 175, 140, 0.4)",
            },
          }}
        >
          ĐẶT LỊCH NGAY
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: useSolidHeader
            ? "rgba(255, 255, 255, 0.98)"
            : "rgba(255, 252, 249, 0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: useSolidHeader ? "0 4px 30px rgba(0, 0, 0, 0.05)" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "text.primary",
          borderBottom: useSolidHeader
            ? "1px solid rgba(0, 0, 0, 0.05)"
            : "none",
        }}
      >
        {/* Top Bar - Contact Info (Desktop Only) */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            backgroundColor: "rgba(26, 26, 26, 0.05)",
            backdropFilter: "blur(10px)",
            transition: "all 0.4s ease",
            py: 0.8,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: "14px", opacity: 0.8 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      letterSpacing: "0.5px",
                      fontWeight: 500,
                    }}
                  >
                    0905 969 063
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon sx={{ fontSize: "14px", opacity: 0.8 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      letterSpacing: "0.5px",
                      fontWeight: 500,
                    }}
                  >
                    Mở cửa: 9:00 - 20:00
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  letterSpacing: "0.5px",
                  fontWeight: 500,
                }}
              >
                🎉 Giảm 20% cho khách hàng mới
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Main Navigation */}
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              py: scrolled ? 1 : 2,
              transition: "padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              minHeight: { xs: "64px", md: "72px" },
            }}
          >
            {/* Logo */}
            <Typography
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: "4px",
                fontSize: { xs: "1.3rem", md: "1.6rem" },
                textDecoration: "none",
                position: "relative",
                color: "inherit",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              MARLIE
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontSize: "8px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  WebkitTextFillColor: "#8b6f47",
                  textAlign: "center",
                  mt: -0.5,
                }}
              >
                Nails & Spa
              </Box>
            </Typography>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {menuItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </Box>

            {/* Right Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Book Now Button - Desktop */}
              <Button
                variant="contained"
                onClick={() => openModal()}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  px: 4,
                  py: 1.5,
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  borderRadius: "50px",
                  background:
                    "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
                  backdropFilter: "blur(10px)",
                  border: useSolidHeader
                    ? "none"
                    : "1px solid rgba(212, 175, 140, 0.3)",
                  color: "white",
                  boxShadow: useSolidHeader
                    ? "0 4px 20px rgba(212, 175, 140, 0.35)"
                    : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: useSolidHeader
                      ? "linear-gradient(135deg, #e8d4c0 0%, #d4af8c 100%)"
                      : "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-2px)",
                    boxShadow: useSolidHeader
                      ? "0 8px 30px rgba(212, 175, 140, 0.45)"
                      : "0 8px 30px rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                ĐẶT LỊCH
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                onClick={handleDrawerToggle}
                aria-label="Toggle navigation menu"
                sx={{
                  display: { xs: "flex", md: "none" },
                  color: "inherit",
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  backgroundColor: useSolidHeader
                    ? "rgba(212, 175, 140, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: useSolidHeader
                    ? "1px solid rgba(212, 175, 140, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: useSolidHeader
                      ? "rgba(212, 175, 140, 0.2)"
                      : "rgba(255, 255, 255, 0.2)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "360px" },
            background: "transparent",
          },
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Booking Modal */}
      <BookingModal open={isOpen} onClose={closeModal} />
    </>
  );
};

export default Header;
