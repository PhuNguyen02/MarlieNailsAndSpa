import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Paper,
  alpha,
  Snackbar,
  Alert,
  Button,
  Popover,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DashboardOutlined as DashboardIcon,
  CalendarMonthOutlined as CalendarIcon,
  PeopleOutlined as PeopleIcon,
  LogoutOutlined as LogoutIcon,
  SettingsOutlined as SettingsIcon,
  AccessTimeOutlined as TimeIcon,
  NotificationsNoneOutlined as NotificationsIcon,
  Circle as CircleIcon,
  ArticleOutlined as ArticleIcon,
  CategoryOutlined as CategoryIcon,
  LocalOfferOutlined as TagIcon,
  ChatBubbleOutlineOutlined as ChatIcon,
  PhotoLibraryOutlined as MediaIcon,
  EditNoteOutlined as EditNoteIcon,
  MailOutline as MailIcon,
  SpaOutlined as SpaIcon,
  PersonOutlined as PersonIcon,
  RateReviewOutlined as CommentIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '@/store/slices/authSlice';
import { useBookingNotifications } from '@/hooks/useBookingNotifications';

const drawerWidth = 280;

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Giả sử có thông tin admin từ store
  const admin = useSelector((state: any) => state.auth.admin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    navigate('/admin/login');
  };

  const { notifications, latestNotification, markAsRead, markAllAsRead, clearLatest } =
    useBookingNotifications();

  const [notifAnchorEl, setNotifAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Play sound when new booking arrives
  useEffect(() => {
    if (latestNotification) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.play().catch((e) => console.error('Error playing notification sound:', e));
    }
  }, [latestNotification]);

  const handleNotificationIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotifAnchorEl(null);
  };

  const handleNotificationItemClick = (id: string) => {
    markAsRead(id);
    navigate('/admin/calendar');
    handleNotificationClose();
  };

  const handleSnackbarClick = () => {
    navigate('/admin/calendar');
    clearLatest();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Trang Chủ',
      icon: <GridViewIcon />,
      path: '/admin/homepage',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Hero Section',
      icon: <MediaIcon />,
      path: '/admin/banners',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Lịch Hẹn',
      icon: <CalendarIcon />,
      path: '/admin/calendar',
      roles: ['admin', 'super_admin', 'staff'],
    },
    { text: 'Nhân Viên', icon: <PeopleIcon />, path: '/admin/staff', roles: ['super_admin', 'admin'] },
    {
      text: 'Xếp Lịch',
      icon: <TimeIcon />,
      path: '/admin/time-slots',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Tin Nhắn Liên Hệ',
      icon: <MailIcon />,
      path: '/admin/contact-messages',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Dịch Vụ',
      icon: <SpaIcon />,
      path: '/admin/services',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Khách Hàng',
      icon: <PersonIcon />,
      path: '/admin/customers',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Khuyến Mãi',
      icon: <TagIcon />,
      path: '/admin/promotions',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Đánh Giá',
      icon: <CommentIcon />,
      path: '/admin/testimonials',
      roles: ['admin', 'super_admin'],
    },
    {
      text: 'Cài Đặt',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      roles: ['admin', 'super_admin'],
    },
  ];

  const blogMenuItems = [
    {
      text: 'Blog Overview',
      icon: <ArticleIcon />,
      path: '/admin/blog',
      roles: ['admin', 'super_admin'],
    },
    {
      text: 'Bài viết',
      icon: <EditNoteIcon />,
      path: '/admin/blog/posts',
      roles: ['admin', 'super_admin'],
    },
    {
      text: 'Chuyên mục',
      icon: <CategoryIcon />,
      path: '/admin/blog/categories',
      roles: ['admin', 'super_admin'],
    },
    { text: 'Thẻ', icon: <TagIcon />, path: '/admin/blog/tags', roles: ['admin', 'super_admin'] },
    {
      text: 'Bình luận',
      icon: <ChatIcon />,
      path: '/admin/blog/comments',
      roles: ['admin', 'super_admin', 'staff'],
    },
    {
      text: 'Media',
      icon: <MediaIcon />,
      path: '/admin/blog/media',
      roles: ['admin', 'super_admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(admin?.role || 'staff'),
  );
  const filteredBlogMenuItems = blogMenuItems.filter(
    (item) => !item.roles || item.roles.includes(admin?.role || 'staff'),
  );

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e293b',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            M
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(to right, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MARLIE SPA
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1, flexShrink: 0 }} />

      <List
        sx={{
          px: 1.5,
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.2)',
          },
        }}
      >
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: isActive ? alpha('#10b981', 0.1) : 'transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  '&:hover': {
                    backgroundColor: alpha('#10b981', 0.05),
                    color: '#f8fafc',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.88rem',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#10b981',
                      boxShadow: '0 0 8px #10b981',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 1.5 }} />
        <Typography
          variant="caption"
          sx={{
            px: 1,
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 0.5,
          }}
        >
          Blog
        </Typography>
        {filteredBlogMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '10px',
                  py: 0.8,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: isActive ? alpha('#6366f1', 0.1) : 'transparent',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  '&:hover': {
                    backgroundColor: alpha('#6366f1', 0.05),
                    color: '#f8fafc',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.83rem',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#6366f1',
                      boxShadow: '0 0 8px #6366f1',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 1.5, flexShrink: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            bgcolor: alpha('#ffffff', 0.03),
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                color: '#fca5a5',
                '&:hover': { bgcolor: alpha('#ef4444', 0.1), color: '#f87171' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Đăng Xuất"
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          color: '#1e293b',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {menuItems.find((item) => item.path === location.pathname)?.text ||
                blogMenuItems.find((item) => item.path === location.pathname)?.text ||
                'Bảng Điều Khiển'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit" onClick={handleNotificationIconClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(notifAnchorEl)}
              anchorEl={notifAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  width: 360,
                  maxHeight: 480,
                  borderRadius: '16px',
                  mt: 1,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  Thông báo
                </Typography>
                <Button size="small" onClick={markAllAsRead} sx={{ textTransform: 'none' }}>
                  Đánh dấu tất cả là đã đọc
                </Button>
              </Box>
              <Divider />
              <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">Không có thông báo mới</Typography>
                  </Box>
                ) : (
                  notifications.map((notif) => (
                    <ListItem
                      key={notif.id}
                      disablePadding
                      sx={{
                        bgcolor: notif.isRead ? 'white' : alpha('#10b981', 0.04),
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: alpha('#10b981', 0.08) },
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleNotificationItemClick(notif.id)}
                        sx={{ py: 1.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 50 }}>
                          <Avatar
                            sx={{
                              bgcolor: notif.isRead ? '#94a3b8' : '#10b981',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {notif.booking.customer.fullName.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={notif.isRead ? 500 : 700}>
                              {notif.booking.customer.fullName} đã đặt lịch mới
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Dịch vụ: {notif.booking.service.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: '#10b981', fontWeight: 600 }}
                              >
                                {new Date(notif.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                            </Box>
                          }
                        />
                        {!notif.isRead && (
                          <CircleIcon sx={{ fontSize: 12, color: '#ef4444', ml: 1 }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            </Popover>

            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1 }}
              >
                {admin?.fullName || 'Quản Trị Viên'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                admin@marliespa.com
              </Typography>
            </Box>
            <Tooltip title="Hồ sơ">
              <Avatar
                sx={{
                  bgcolor: '#34d399',
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  border: '2px solid #fff',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
              >
                {admin?.fullName?.charAt(0) || 'A'}
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          transition: 'all 0.3s ease',
        }}
      >
        <Outlet />
      </Box>

      {/* Real-time Booking Notification */}
      <Snackbar
        open={!!latestNotification}
        onClose={clearLatest}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={clearLatest}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            minWidth: '300px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            bgcolor: '#10b981',
            '& .MuiAlert-message': { width: '100%' },
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleSnackbarClick}
              sx={{
                fontWeight: 'bold',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              XEM LỊCH
            </Button>
          }
        >
          <Box sx={{ pr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>
              🔔 CÓ ĐƠN ĐẶT LỊCH MỚI!
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
              Khách: <strong>{latestNotification?.customer?.fullName}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
              Dịch vụ: {latestNotification?.service?.name}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLayout;
