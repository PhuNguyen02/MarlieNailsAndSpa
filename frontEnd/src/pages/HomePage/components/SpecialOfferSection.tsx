import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  alpha,
  Skeleton,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BookingModal from '../../../components/BookingModal';
import { useBookingModal } from '../../../hooks/useBookingModal';
import { publicPromotionsApi } from '../../../api/promotionsApi';
import type { Promotion } from '../../../api/types';
import { HomepageSection } from '../../../api/homepageApi';

const SpecialOfferSection = ({ data }: { data?: HomepageSection }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const { isOpen, openModal, closeModal } = useBookingModal();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await publicPromotionsApi.getActive();
        const data = Array.isArray(res) ? res : (res as any)?.data || [];
        setPromotions(data);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
      } finally {
        setLoadingPromos(false);
      }
    };
    fetchPromos();
  }, []);

  const formatDiscount = (p: Promotion) => {
    if (p.discountType === 'percent') return `Giảm ${p.discountValue}%`;
    if (p.discountType === 'fixed') return `Giảm ${p.discountValue?.toLocaleString('vi-VN')}đ`;
    return p.badge || 'Ưu đãi';
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 50%, #fff5e6 100%)',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Promotional Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ff6b35 100%)',
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 3, md: 4 },
            mb: { xs: 4, md: 5 },
            boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                mb: 2,
              }}
            >
              <WhatshotIcon sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, color: 'white' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {data?.title || 'KHUYẾN MÃI ĐANG DIỄN RA'}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mb: 4 }}>
              {data?.subtitle ||
                'Khám phá các ưu đãi đặc biệt dành riêng cho bạn tại Marlie Nails & Spa'}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
              {[
                '✨ Giảm ngay 20% cho khách hàng lần đầu trải nghiệm dịch vụ',
                '✨ Combo tiết kiệm: Gội đầu dưỡng sinh + Massage body chỉ từ 399k',
                '✨ Ưu đãi theo liệu trình: Mua 5 buổi tặng 1 buổi',
                '✨ Triệt lông trọn gói – Giá ưu đãi đặc biệt theo từng vùng',
                '✨ Tặng voucher 100.000đ cho lần sử dụng tiếp theo',
              ].map((offer, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      p: 2,
                      borderRadius: 2,
                      height: '100%',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.25)',
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {offer}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {data?.content && (
              <Box
                sx={{ color: 'white', mt: 2, opacity: 0.8 }}
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            )}

            <Typography
              variant="body2"
              sx={{ color: 'white', opacity: 0.9, mt: 2, fontStyle: 'italic' }}
            >
              🎉 Số lượng ưu đãi có hạn – áp dụng trong thời gian nhất định. Đặt lịch ngay hôm nay!
            </Typography>
          </Box>
        </Box>

        {/* Promotions Grid */}
        <Grid container spacing={3}>
          {loadingPromos
            ? [1, 2, 3].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{ height: '100%', borderRadius: 3, p: 3 }}>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                    <Skeleton variant="rectangular" height={40} />
                  </Card>
                </Grid>
              ))
            : promotions.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'white',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: 'rgba(255, 107, 53, 0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(255, 107, 53, 0.15)',
                        borderColor: '#ff6b35',
                      },
                    }}
                  >
                    {/* Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: -10,
                        bgcolor: '#ff6b35',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: '4px 0 0 4px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        zIndex: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {p.badge || 'HOT'}
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocalOfferIcon sx={{ color: '#ff6b35' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {p.title}
                        </Typography>
                      </Box>

                      <Box sx={{ bgcolor: alpha('#ff6b35', 0.05), p: 2, borderRadius: 2, mb: 2 }}>
                        <Typography variant="h5" sx={{ color: '#ff6b35', fontWeight: 800 }}>
                          {formatDiscount(p)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {p.description}
                        </Typography>
                      </Box>

                      {p.validUntil && (
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', mb: 2, color: 'text.secondary' }}
                        >
                          Hết hạn: {new Date(p.validUntil).toLocaleDateString('vi-VN')}
                        </Typography>
                      )}

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => openModal()}
                        startIcon={<StarIcon />}
                        sx={{
                          bgcolor: '#ff6b35',
                          '&:hover': { bgcolor: '#e55a2b' },
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      >
                        Nhận Ưu Đãi Ngay
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          {!loadingPromos && promotions.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Hiện chưa có chương trình khuyến mãi nào. Hãy quay lại sau nhé!
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      <BookingModal open={isOpen} onClose={closeModal} />
    </Box>
  );
};

export default SpecialOfferSection;
