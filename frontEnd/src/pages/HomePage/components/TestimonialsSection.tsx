import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Skeleton,
  alpha,
} from '@mui/material';
import { publicTestimonialsApi } from '../../../api/testimonialsApi';
import type { Testimonial } from '../../../api/types';
import { HomepageSection } from '../../../api/homepageApi';

const TestimonialsSection = ({ data }: { data?: HomepageSection }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await publicTestimonialsApi.getActive();
        const data = Array.isArray(res) ? res : (res as any)?.data || [];
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: '#f8fafc',
        backgroundImage:
          'radial-gradient(circle at 10% 20%, rgba(212, 175, 140, 0.05) 0%, transparent 40%)',
      }}
    >
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
          {data?.title || 'Khách Hàng Nói Gì Về Marlie'}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            fontWeight: 400,
          }}
        >
          {data?.subtitle || 'Sự hài lòng của khách hàng là động lực lớn nhất để chúng tôi hoàn thiện mỗi ngày.'}
        </Typography>
        {data?.content && (
          <Box 
            sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }} 
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        )}

        <Grid container spacing={3}>
          {loading
            ? [1, 2, 3].map((i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Card sx={{ p: 4, borderRadius: 4 }}>
                    <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2 }} />
                    <Skeleton variant="text" height={30} width="60%" />
                    <Skeleton variant="text" height={100} />
                  </Card>
                </Grid>
              ))
            : testimonials.map((t) => (
                <Grid item xs={12} md={4} key={t.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      p: 1,
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(212, 175, 140, 0.15)',
                        borderColor: alpha('#d4af8c', 0.5),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                          src={t.avatarUrl}
                          sx={{
                            width: 56,
                            height: 56,
                            border: '2px solid #d4af8c',
                            p: 0.2,
                          }}
                        >
                          {t.customerName[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, color: '#1e293b' }}
                          >
                            {t.customerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {t.customerTitle || 'Khách hàng'}
                          </Typography>
                        </Box>
                      </Box>

                      <Rating
                        value={t.rating}
                        readOnly
                        size="small"
                        sx={{ color: '#d4af8c', mb: 2 }}
                      />

                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                          lineHeight: 1.8,
                          fontStyle: 'italic',
                          position: 'relative',
                          '&::before': {
                            content: '"\\201C"',
                            fontSize: '3rem',
                            color: alpha('#d4af8c', 0.2),
                            position: 'absolute',
                            top: -20,
                            left: -10,
                            fontFamily: 'serif',
                          },
                        }}
                      >
                        {t.content}
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

export default TestimonialsSection;
