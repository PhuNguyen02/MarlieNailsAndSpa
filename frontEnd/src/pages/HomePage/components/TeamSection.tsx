import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Skeleton,
  alpha,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { publicEmployeesApi } from '../../../api/employeesPublicApi';
import type { Employee } from '../../../api/employeesPublicApi';

const TeamSection = () => {
  const [team, setTeam] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await publicEmployeesApi.getActive();
        const data = res.data || [];
        // Lọc chỉ lấy nhân viên active và là therapist hoặc manager
        setTeam(data.filter((e) => e.isActive && e.role !== 'receptionist'));
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!loading && team.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#fff5f0' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontFamily: '"Playfair Display", serif',
            color: '#1e293b',
          }}
        >
          Đội Ngũ Chuyên Gia
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 8,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Những bàn tay tài hoa luôn sẵn sàng mang đến cho bạn vẻ đẹp và sự tự tin.
        </Typography>

        <Grid container spacing={4}>
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={300} />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="80%" />
                      <Skeleton variant="text" height={20} width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : team.map((member) => (
                <Grid item xs={12} sm={6} md={3} key={member.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      '&:hover .social-overlay': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                      '&:hover img': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden', pt: '120%' }}>
                      <CardMedia
                        component="img"
                        image={
                          member.avatarUrl ||
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop'
                        }
                        alt={member.fullName}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                      <Box
                        className="social-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: alpha('#d4af8c', 0.8),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          opacity: 0,
                          transform: 'translateY(20px)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <IconButton
                          sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.2) } }}
                        >
                          <FacebookIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.2) } }}
                        >
                          <InstagramIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: 'white', '&:hover': { bgcolor: alpha('#fff', 0.2) } }}
                        >
                          <TwitterIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1e293b' }}>
                        {member.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#d4af8c',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '1px',
                        }}
                      >
                        {member.specialization || 'Therapist'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
