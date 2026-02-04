import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useState } from "react";
import { servicesStyles } from "../styles";

const services = [
  {
    title: "GỘI ĐẦU DƯỠNG SINH",
    description:
      "Chăm sóc tóc và da đầu với các liệu pháp thảo dược tự nhiên, giúp thư giãn và phục hồi sức sống cho mái tóc.",
    icon: "/images/icon-hair-spa.png",
  },
  {
    title: "CHĂM SÓC DA",
    description:
      "Các liệu trình chăm sóc da chuyên sâu, từ lấy nhân mụn đến thải độc và làm trắng da bằng công nghệ hiện đại.",
    icon: "/images/icon-skin-care.png",
  },
  {
    title: "DỊCH VỤ NAIL",
    description:
      "Sơn gel cao cấp, nối móng và tạo form theo phong cách Hàn Quốc, mang đến vẻ đẹp hoàn hảo cho đôi tay.",
    icon: "/images/icon-nails.png",
  },
  {
    title: "TRIỆT LÔNG",
    description:
      "Dịch vụ triệt lông chuyên nghiệp với công nghệ tiên tiến, an toàn và hiệu quả cho mọi vùng da.",
    icon: "/images/icon-hair-removal.png",
  },
  {
    title: "MASSAGE BODY",
    description:
      "Massage toàn thân giúp thư giãn cơ bắp, giảm căng thẳng và tăng cường tuần hoàn máu.",
    icon: "/images/icon-massage.png",
  },
  {
    title: "ƯU ĐÃI ĐẶC BIỆT",
    description:
      "Chương trình khuyến mãi hấp dẫn: Mua 5 tặng 1 cho các dịch vụ chăm sóc sắc đẹp và sức khỏe.",
    icon: "/images/icon-promo.png",
  },
];

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    icon: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={servicesStyles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={0}
      >
        <CardContent sx={servicesStyles.cardContent}>
          <Box
            sx={{
              ...servicesStyles.iconContainer,
              ...(isHovered && {
                "& img": {
                  transform: "scale(1.1) rotate(5deg)",
                },
              }),
            }}
          >
            <Box
              component="img"
              src={service.icon}
              alt={service.title}
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                objectFit: "contain",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.05))",
              }}
            />
          </Box>
          <Typography variant="h6" sx={servicesStyles.title}>
            {service.title}
          </Typography>
          <Typography variant="body2" sx={servicesStyles.description}>
            {service.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

const ServicesSection = () => {
  return (
    <Box sx={servicesStyles.container}>
      {/* Botanical pattern background */}
      <Box sx={servicesStyles.botanicalPattern} />

      <Container maxWidth="lg" sx={servicesStyles.containerInner}>
        <Grid container spacing={4} sx={servicesStyles.cardsGrid}>
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
