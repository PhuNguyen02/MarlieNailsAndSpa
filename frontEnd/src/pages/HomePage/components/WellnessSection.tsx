import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { wellnessStyles } from '../styles';
import { HomepageSection } from '../../../api/homepageApi';

const WellnessSection = ({ data }: { data?: HomepageSection }) => {
  // First part data (Wellness & Spa)
  const part1 = {
    title: data?.title || 'Wellness & Spa',
    subtitle: data?.subtitle || 'Unforgettable',
    content:
      data?.content ||
      `Nơi vẻ đẹp và sự thư giãn hòa làm một. Chúng tôi mang đến những
                liệu trình chăm sóc tinh tế, giúp bạn tái tạo năng lượng, cân bằng
                cơ thể và nuôi dưỡng cảm giác an yên từ bên trong. Mỗi khoảnh khắc
                tại đây là một trải nghiệm nhẹ nhàng, riêng tư và đáng nhớ.`,
    imageUrl: data?.imageUrl || '/images/spa-service.png',
    buttonText: data?.config?.buttonText || 'BOOK NOW',
  };

  // Second part data (Waiting Area)
  const part2 = {
    title: data?.config?.part2Title || 'Waiting Area',
    subtitle: data?.config?.part2Subtitle || 'Luxurious',
    content:
      data?.config?.part2Content ||
      `Không gian chờ sang trọng và thoải mái với nội thất cao cấp. Tại
              Marlie Nails & Spa, chúng tôi chú trọng từng chi tiết nhỏ nhất để
              mang lại cảm giác dễ chịu ngay từ khi bạn bước chân vào cửa.
              Thưởng thức một tách trà thơm trong khi chờ đợi được phục vụ.`,
    imageUrl: data?.config?.part2ImageUrl || '/images/waiting-area.png',
  };

  return (
    <Box sx={wellnessStyles.container}>
      <Container maxWidth="lg">
        {/* Part 1: Wellness & Spa */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={wellnessStyles.overline}>
              {part1.subtitle}
            </Typography>
            <Typography variant="h2" sx={wellnessStyles.title}>
              {part1.title}
            </Typography>
            {part1.content.includes('<') ? (
              <Box
                sx={{ ...wellnessStyles.description, mb: 4 }}
                dangerouslySetInnerHTML={{ __html: part1.content }}
              />
            ) : (
              <Typography variant="body1" sx={wellnessStyles.description}>
                {part1.content}
              </Typography>
            )}
            <Button variant="contained" sx={wellnessStyles.button}>
              {part1.buttonText}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={wellnessStyles.imageContainer}>
              <Box sx={wellnessStyles.image}>
                <Box component="img" src={part1.imageUrl} alt={part1.title} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Part 2: Waiting Area */}
        <Grid container spacing={6} alignItems="center" sx={{ mt: { xs: 4, md: 8 } }}>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box sx={wellnessStyles.imageContainer}>
              <Box sx={wellnessStyles.image}>
                <Box component="img" src={part2.imageUrl} alt={part2.title} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Typography variant="overline" sx={wellnessStyles.overline}>
              {part2.subtitle}
            </Typography>
            <Typography variant="h2" sx={wellnessStyles.title}>
              {part2.title}
            </Typography>
            {part2.content.includes('<') ? (
              <Box
                sx={{ ...wellnessStyles.description, mb: 4 }}
                dangerouslySetInnerHTML={{ __html: part2.content }}
              />
            ) : (
              <Typography variant="body1" sx={wellnessStyles.description}>
                {part2.content}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WellnessSection;
