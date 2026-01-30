import { Box } from "@mui/material";
import {
  Header,
  HeroSection,
  ServicesSection,
  WellnessSection,
  WorkingHoursSection,
  PricingSection,
  SpecialOfferSection,
  TestimonialsSection,
  BlogSection,
  Footer,
} from "./components";

const HomePage = () => {
  return (
    <Box
      sx={{
        overflowX: "hidden",
        "& *": {
          transition: "opacity 0.3s ease, transform 0.3s ease",
        },
      }}
    >
      <Header />
      <HeroSection />
      <ServicesSection />
      <WellnessSection />
      <WorkingHoursSection />
      <PricingSection />
      <SpecialOfferSection />
      {/* <TestimonialsSection /> */}
      {/* <BlogSection /> */}
      <Footer />
    </Box>
  );
};

export default HomePage;
