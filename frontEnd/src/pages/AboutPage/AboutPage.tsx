import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  Spa,
  Star,
  Diamond,
  Groups,
  EmojiNature,
  VerifiedUser,
  WorkspacePremium,
  LocalFlorist,
} from '@mui/icons-material';
import Header from '../HomePage/components/Header';
import Footer from '../HomePage/components/Footer';
import { apiClient } from '../../api';
import type { Employee } from '../../api/types';

const uspItems = [
  {
    icon: <Diamond />,
    title: 'Chất Lượng Cao Cấp',
    desc: 'Sử dụng sản phẩm chính hãng, nhập khẩu từ các thương hiệu uy tín hàng đầu thế giới.',
  },
  {
    icon: <Groups />,
    title: 'Đội Ngũ Chuyên Nghiệp',
    desc: 'Kỹ thuật viên được đào tạo bài bản với nhiều năm kinh nghiệm trong ngành.',
  },
  {
    icon: <EmojiNature />,
    title: 'Không Gian Thư Giãn',
    desc: 'Thiết kế hiện đại, sang trọng, mang đến trải nghiệm thư giãn tuyệt đối.',
  },
  {
    icon: <VerifiedUser />,
    title: 'An Toàn & Vệ Sinh',
    desc: 'Tuân thủ nghiêm ngặt quy trình vệ sinh, khử trùng dụng cụ sau mỗi khách hàng.',
  },
  {
    icon: <WorkspacePremium />,
    title: 'Giá Cả Minh Bạch',
    desc: 'Bảng giá rõ ràng, không phát sinh, cam kết giá tốt nhất thị trường.',
  },
  {
    icon: <LocalFlorist />,
    title: 'Ưu Đãi Thành Viên',
    desc: 'Chương trình tích điểm và ưu đãi đặc biệt dành cho khách hàng thân thiết.',
  },
];

const AboutPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/admin/employees');
        const data = Array.isArray(res) ? res : (res as any)?.data || [];
        setEmployees(data.filter((e: Employee) => e.isActive));
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFCF9' }}>
      <Header />

      {/* Hero Banner */}
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2420 50%, #1a1a1a 100%)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #d4af8c 0%, transparent 50%), radial-gradient(circle at 80% 50%, #b8956f 0%, transparent 50%)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Spa sx={{ fontSize: 48, color: '#d4af8c', mb: 2 }} />
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, letterSpacing: 3, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            VỀ MARLIE NAILS & SPA
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, maxWidth: 600, mx: 'auto' }}
          >
            Nơi vẻ đẹp được chăm chút tỉ mỉ, nơi bạn được thư giãn và tận hưởng
          </Typography>
        </Container>
      </Box>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{ color: '#b8956f', letterSpacing: 3, fontWeight: 600 }}
            >
              CÂU CHUYỆN CỦA CHÚNG TÔI
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mt: 1, mb: 3, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
            >
              Hành Trình Kiến Tạo Vẻ Đẹp
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 2 }}>
              Marlie Nails & Spa ra đời từ niềm đam mê mang đến dịch vụ chăm sóc sắc đẹp chất lượng
              cao với mức giá hợp lý nhất. Chúng tôi tin rằng mỗi người phụ nữ đều xứng đáng được
              chăm sóc và yêu thương bản thân.
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
              Với đội ngũ kỹ thuật viên giàu kinh nghiệm và không gian được thiết kế sang trọng,
              Marlie cam kết mang đến cho bạn những trải nghiệm thư giãn tuyệt vời nhất.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: 400,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(180, 149, 111, 0.2)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Spa sx={{ fontSize: 80, color: '#b8956f', opacity: 0.6 }} />
                <Typography sx={{ mt: 2, color: '#8b6f47', fontWeight: 500, letterSpacing: 2 }}>
                  MARLIE NAILS & SPA
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* USP Section */}
      <Box sx={{ bgcolor: alpha('#d4af8c', 0.06), py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
            }}
          >
            Vì Sao Chọn Marlie?
          </Typography>
          <Typography
            sx={{ textAlign: 'center', color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Chúng tôi tự hào mang đến dịch vụ chất lượng vượt trội với trải nghiệm không thể quên
          </Typography>
          <Grid container spacing={3}>
            {uspItems.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    bgcolor: 'white',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                      borderColor: '#d4af8c',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        color: 'white',
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            mb: 1,
            fontSize: { xs: '1.8rem', md: '2.4rem' },
          }}
        >
          Đội Ngũ Của Chúng Tôi
        </Typography>
        <Typography
          sx={{ textAlign: 'center', color: 'text.secondary', mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Những kỹ thuật viên tài năng và tận tâm, luôn sẵn sàng phục vụ bạn
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          ) : employees.length > 0 ? (
            employees.map((emp) => (
              <Grid item xs={6} sm={4} md={3} key={emp.id}>
                <Card
                  elevation={0}
                  sx={{
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        fontSize: 28,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)',
                      }}
                    >
                      {emp.fullName.split(' ').pop()?.charAt(0) || 'M'}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {emp.fullName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#b8956f', fontWeight: 500, textTransform: 'capitalize' }}
                    >
                      {emp.specialization || emp.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Chưa có thông tin đội ngũ
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Mission */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2420 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Star sx={{ fontSize: 40, color: '#d4af8c', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Sứ Mệnh Của Chúng Tôi
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, fontSize: '1.05rem' }}>
            Marlie Nails & Spa cam kết trở thành điểm đến tin cậy cho mọi nhu cầu chăm sóc sắc đẹp.
            Chúng tôi không ngừng đổi mới, nâng cao chất lượng dịch vụ và đào tạo đội ngũ để mang
            lại giá trị tốt nhất cho khách hàng.
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutPage;
