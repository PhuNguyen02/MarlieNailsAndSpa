import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { wellnessStyles } from "../styles";

const WellnessSection = () => {
  return (
    <Box sx={wellnessStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={wellnessStyles.overline}>
              Unforgettable
            </Typography>
            <Typography variant="h2" sx={wellnessStyles.title}>
              Wellness & Spa
            </Typography>
            <Typography variant="body1" sx={wellnessStyles.description}>
              Nơi vẻ đẹp và sự thư giãn hòa làm một. Chúng tôi mang đến những
              liệu trình chăm sóc tinh tế, giúp bạn tái tạo năng lượng, cân bằng
              cơ thể và nuôi dưỡng cảm giác an yên từ bên trong. Mỗi khoảnh khắc
              tại đây là một trải nghiệm nhẹ nhàng, riêng tư và đáng nhớ.
            </Typography>
            <Button variant="contained" sx={wellnessStyles.button}>
              BOOK NOW
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={wellnessStyles.imageContainer}>
              <Box sx={wellnessStyles.image}>
                <Box
                  component="img"
                  src="/images/spa-service.png"
                  alt="Wellness & Spa"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={6}
          alignItems="center"
          sx={{ mt: { xs: 4, md: 8 } }}
        >
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Box sx={wellnessStyles.imageContainer}>
              <Box sx={wellnessStyles.image}>
                <Box
                  component="img"
                  src="/images/waiting-area.png"
                  alt="Luxurious Waiting Area"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Typography variant="overline" sx={wellnessStyles.overline}>
              Luxurious
            </Typography>
            <Typography variant="h2" sx={wellnessStyles.title}>
              Waiting Area
            </Typography>
            <Typography variant="body1" sx={wellnessStyles.description}>
              Không gian chờ sang trọng và thoải mái với nội thất cao cấp. Tại
              Marlie Nails & Spa, chúng tôi chú trọng từng chi tiết nhỏ nhất để
              mang lại cảm giác dễ chịu ngay từ khi bạn bước chân vào cửa.
              Thưởng thức một tách trà thơm trong khi chờ đợi được phục vụ.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WellnessSection;
