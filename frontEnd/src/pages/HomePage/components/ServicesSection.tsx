import { Box, Container, Grid, Typography } from '@mui/material';
import { servicesStyles } from '../styles/servicesStyles';
import { HomepageSection } from '../../../api/homepageApi';
import { motion } from 'framer-motion';

interface CuratedService {
  prefix: string;
  title: string;
  subtitle: string;
  description: string[];
  image: string;
  reverse: boolean;
}

const defaultCuratedServices: CuratedService[] = [
  {
    prefix: '🌿',
    title: 'GỘI ĐẦU DƯỠNG SINH',
    subtitle: 'THƯ GIÃN TỪ GỐC, KHỎE ĐẸP TỪ BÊN TRONG',
    description: [
      'Tại Marlie Spa, gội đầu dưỡng sinh không chỉ đơn thuần là làm sạch tóc, mà là một liệu trình chăm sóc toàn diện giúp thư giãn cơ thể và tái tạo năng lượng từ bên trong.',
      'Liệu trình bắt đầu với các thao tác massage nhẹ nhàng vùng đầu, cổ và vai gáy, giúp kích thích huyệt đạo, giảm căng thẳng và cải thiện tuần hoàn máu. Kết hợp cùng các sản phẩm thiên nhiên dịu nhẹ, mái tóc và da đầu được làm sạch sâu, đồng thời nuôi dưỡng để trở nên khỏe mạnh và mềm mượt hơn.',
      'Không gian yên tĩnh, hương thơm thảo mộc cùng kỹ thuật chăm sóc chuyên nghiệp mang lại cảm giác thư giãn sâu, giúp bạn giải tỏa áp lực, ngủ ngon hơn và phục hồi năng lượng sau những ngày làm việc căng thẳng.',
      'Gội đầu dưỡng sinh tại Marlie Spa không chỉ là chăm sóc tóc mà còn là chăm sóc sức khỏe và cảm xúc của bạn.',
    ],
    image: '/images/hair_spa_service.png',
    reverse: false,
  },
  {
    prefix: '🌿',
    title: 'CHĂM SÓC DA',
    subtitle: 'HÀNH TRÌNH NUÔI DƯỠNG VẺ ĐẸP TỰ NHIÊN TẠI MARLIE SPA',
    description: [
      'Tại Marlie Spa, chúng tôi tin rằng một làn da đẹp không chỉ đến từ sản phẩm, mà còn đến từ sự chăm sóc đúng cách và sự thư giãn từ bên trong.',
      'Chăm sóc da là quá trình kết hợp giữa làm sạch, nuôi dưỡng và phục hồi. Bắt đầu từ việc làm sạch sâu giúp loại bỏ bụi bẩn và dầu thừa, làn da được chuẩn bị để hấp thụ tốt hơn các dưỡng chất. Tiếp theo, các bước cân bằng, cấp ẩm và đặc trị sẽ giúp cải thiện các vấn đề như da khô, xỉn màu, mụn hay dấu hiệu lão hóa.',
      'Tại Marlie Spa, mỗi liệu trình đều được thiết kế riêng theo từng loại da và nhu cầu của khách hàng. Chúng tôi kết hợp kỹ thuật chăm sóc da chuyên nghiệp với các thao tác massage thư giãn, giúp kích thích tuần hoàn máu, mang lại làn da căng mịn và tràn đầy sức sống.',
      'Không chỉ là chăm sóc da, đó còn là khoảng thời gian để bạn thư giãn, tái tạo năng lượng và yêu thương bản thân nhiều hơn.',
      'Marlie Spa – Nơi làn da được nâng niu, và vẻ đẹp được đánh thức một cách tự nhiên.',
    ],
    image: '/images/skincare_service.png',
    reverse: true,
  },
  {
    prefix: '💅',
    title: 'DỊCH VỤ NAIL',
    subtitle: 'NÉT ĐẸP TINH TẾ TRONG TỪNG CHI TIẾT',
    description: [
      'Tại Marlie Spa, chúng tôi tin rằng một bộ móng đẹp không chỉ là điểm nhấn cho vẻ ngoài, mà còn thể hiện sự tinh tế và phong cách riêng của mỗi khách hàng.',
      'Dịch vụ nail tại Marlie Spa được thực hiện với sự tỉ mỉ trong từng bước: từ làm sạch, chăm sóc móng, xử lý da tay/chân đến sơn và thiết kế theo yêu cầu. Chúng tôi sử dụng các sản phẩm chất lượng cao, đảm bảo an toàn và giúp móng luôn chắc khỏe, bền màu và bóng đẹp.',
      'Bên cạnh đó, không gian thư giãn cùng quy trình chăm sóc nhẹ nhàng mang đến cho bạn cảm giác thoải mái, giúp bạn tận hưởng trọn vẹn khoảng thời gian làm đẹp của mình.',
      'Dù bạn yêu thích phong cách nhẹ nhàng, thanh lịch hay nổi bật, cá tính – đội ngũ Marlie Spa luôn sẵn sàng mang đến cho bạn một bộ móng hoàn hảo, phù hợp với mọi dịp.',
      'Marlie Spa – Nơi từng chi tiết nhỏ đều góp phần tạo nên vẻ đẹp hoàn hảo của bạn.',
    ],
    image: '/images/nail_service.png',
    reverse: false,
  },
  {
    prefix: '✨',
    title: 'TRIỆT LÔNG',
    subtitle: 'LÀN DA MỊN MÀNG, TỰ TIN TỎA SÁNG',
    description: [
      'Tại Marlie Spa, dịch vụ triệt lông được thiết kế nhằm mang lại làn da mịn màng, sạch thoáng và tự tin hơn cho khách hàng trong cuộc sống hằng ngày.',
      'Chúng tôi ứng dụng công nghệ triệt lông hiện đại, giúp tác động vào nang lông một cách nhẹ nhàng, hỗ trợ làm chậm quá trình mọc lại, đồng thời hạn chế tình trạng lông dày, cứng hay viêm nang lông. Quy trình được thực hiện bởi kỹ thuật viên giàu kinh nghiệm, đảm bảo an toàn, êm ái và phục hồi da.',
      'Không chỉ giúp loại bỏ lông không mong muốn, liệu trình còn góp phần cải thiện bề mặt da, mang lại cảm giác mịn màng, sáng khỏe và dễ dàng chăm sóc hơn.',
      'Marlie Spa – Giải pháp triệt lông an toàn, nhẹ nhàng và hiệu quả lâu dài, giúp bạn tự tin trong mọi khoảnh khắc.',
    ],
    image: '/images/hero-lifestyle.png',
    reverse: true,
  },
  {
    prefix: '💆‍♀️',
    title: 'MASSAGE BODY',
    subtitle: 'THƯ GIÃN TOÀN DIỆN, TÁI TẠO NĂNG LƯỢNG',
    description: [
      'Tại Marlie Spa, massage body không chỉ là một liệu trình thư giãn, mà còn là phương pháp chăm sóc sức khỏe giúp cơ thể cân bằng và phục hồi năng lượng sau những áp lực của cuộc sống.',
      'Với các kỹ thuật massage chuyên sâu kết hợp tinh dầu thiên nhiên, liệu trình giúp làm dịu cơ bắp căng cứng, cải thiện tuần hoàn máu và mang lại cảm giác thư thái cả về thể chất lẫn tinh thần. Từng động tác được thực hiện nhẹ nhàng, chính xác, giúp cơ thể thả lỏng hoàn toàn và giảm mệt mỏi hiệu quả.',
      'Không gian yên tĩnh, hương thơm dịu nhẹ cùng âm nhạc thư giãn sẽ đưa bạn vào trạng thái nghỉ ngơi sâu, giúp cải thiện giấc ngủ và nâng cao chất lượng cuộc sống.',
      'Marlie Spa – Nơi bạn tìm lại sự cân bằng, thư giãn và tái tạo năng lượng cho cơ thể mỗi ngày.',
    ],
    image: '/images/spa-service.png',
    reverse: false,
  },
];

interface ServicesSectionProps {
  data?: HomepageSection;
}

const ServicesSection = ({ data }: ServicesSectionProps) => {
  const services = data?.config?.services || defaultCuratedServices;

  return (
    <Box sx={servicesStyles.container} id="services">
      {/* Botanical pattern background */}
      <Box sx={servicesStyles.botanicalPattern} />

      <Container maxWidth="lg" sx={servicesStyles.containerInner}>
        {(data?.title || data?.subtitle) && (
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            {data?.title && (
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontFamily: '"Playfair Display", serif',
                  color: '#2d5a5a',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                }}
              >
                {data.title}
              </Typography>
            )}
            {data?.subtitle && (
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ fontStyle: 'italic', maxWidth: '600px', mx: 'auto' }}
              >
                {data.subtitle}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={servicesStyles.premiumContainer}>
          {services.map((service: CuratedService, index: number) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={servicesStyles.serviceStory}
              direction={service.reverse ? 'row-reverse' : 'row'}
              alignItems="center"
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: service.reverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                >
                  <Box
                    sx={{
                      ...servicesStyles.imageWrapper,
                      ...(service.reverse && servicesStyles.imageWrapperReverse),
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      ...servicesStyles.contentWrapper,
                      ...(service.reverse && servicesStyles.contentWrapperReverse),
                    }}
                  >
                    <Typography
                      sx={{
                        ...servicesStyles.servicePreTitle,
                        ...(service.reverse && servicesStyles.servicePreTitleReverse),
                      }}
                    >
                      {service.prefix} {service.title}
                    </Typography>

                    <Typography variant="h3" sx={servicesStyles.serviceMainTitle}>
                      {service.subtitle}
                    </Typography>

                    <Box
                      sx={{
                        ...servicesStyles.divider,
                        ...(service.reverse && servicesStyles.dividerReverse),
                      }}
                    />

                    {service.description.map((p: string, i: number) => (
                      <Typography key={i} sx={servicesStyles.serviceText}>
                        {p}
                      </Typography>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesSection;
