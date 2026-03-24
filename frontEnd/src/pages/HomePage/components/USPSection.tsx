import { Box, Container, Typography, Grid, Paper, alpha } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpaIcon from '@mui/icons-material/Spa';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { HomepageSection } from '../../../api/homepageApi';

interface USPCard {
  iconType?: string;
  title: string;
  desc: string;
}

const defaultUsps: USPCard[] = [
  {
    iconType: 'verified',
    title: 'Dịch vụ Chuyên nghiệp',
    desc: 'Đội ngũ kỹ thuật viên tay nghề cao, được đào tạo bài bản và tận tâm.',
  },
  {
    iconType: 'spa',
    title: 'Không gian Thư giãn',
    desc: 'Không gian sang trọng, tinh tế cùng âm nhạc nhẹ nhàng giúp bạn giải tỏa căng thẳng.',
  },
  {
    iconType: 'technology',
    title: 'Công nghệ Hiện đại',
    desc: 'Luôn cập nhật các xu hướng và công nghệ làm đẹp tiên tiến nhất trên thế giới.',
  },
  {
    iconType: 'favorite',
    title: 'Sản phẩm Cao cấp',
    desc: 'Chúng tôi chỉ sử dụng các dòng mỹ phẩm chính hãng, an toàn cho sức khỏe.',
  },
];

const getIcon = (type?: string) => {
  switch (type) {
    case 'verified':
      return <VerifiedIcon sx={{ fontSize: 40, color: '#d4af8c' }} />;
    case 'spa':
      return <SpaIcon sx={{ fontSize: 40, color: '#d4af8c' }} />;
    case 'technology':
      return <PsychologyIcon sx={{ fontSize: 40, color: '#d4af8c' }} />;
    case 'favorite':
      return <FavoriteIcon sx={{ fontSize: 40, color: '#d4af8c' }} />;
    default:
      return <VerifiedIcon sx={{ fontSize: 40, color: '#d4af8c' }} />;
  }
};

const USPSection = ({ data }: { data?: HomepageSection }) => {
  const cards = data?.config?.cards || defaultUsps;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'white' }}>
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
          {data?.title || 'Tại Sao Chọn Marlie Nails & Spa?'}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: 'text.secondary',
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          {data?.subtitle ||
            'Chúng tôi mang đến trải nghiệm làm đẹp khác biệt, nơi vẻ đẹp và sự thư giãn giao hòa.'}
        </Typography>

        {data?.content && (
          <Box
            sx={{ mb: 6, textAlign: 'center', color: 'text.secondary' }}
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        )}

        <Grid container spacing={4}>
          {cards.map((usp: USPCard, idx: number) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    borderColor: alpha('#d4af8c', 0.3),
                    bgcolor: alpha('#d4af8c', 0.02),
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{getIcon(usp.iconType)}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                  {usp.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {usp.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default USPSection;
