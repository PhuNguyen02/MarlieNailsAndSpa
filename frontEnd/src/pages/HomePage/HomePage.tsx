import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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
  USPSection,
  Footer,
} from './components';
import { publicHomepageApi, HomepageSection, SectionType } from '../../api/homepageApi';

const HomePage = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await publicHomepageApi.getSections();
        setSections(res);
      } catch (err) {
        console.error('Failed to fetch sections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  const renderSection = (section: HomepageSection) => {
    switch (section.type) {
      case SectionType.HERO:
        return <HeroSection key={section.id} data={section} />;
      case SectionType.USP:
        return <USPSection key={section.id} data={section} />;
      case SectionType.SERVICES:
        return <ServicesSection key={section.id} data={section} />;
      case SectionType.PROMOTION:
        return <SpecialOfferSection key={section.id} data={section} />;
      case SectionType.BLOG:
        return <BlogSection key={section.id} data={section} />;
      case SectionType.WELLNESS:
        return <WellnessSection key={section.id} data={section} />;
      case SectionType.WORKING_HOURS:
        return <WorkingHoursSection key={section.id} data={section} />;
      case SectionType.PRICING:
        return <PricingSection key={section.id} data={section} />;
      case SectionType.TESTIMONIALS:
        return <TestimonialsSection key={section.id} data={section} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        '& *': {
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        },
      }}
    >
      <Header />

      {loading ? (
        <>
          <HeroSection />
          <USPSection />
          <ServicesSection />
          <SpecialOfferSection />
          <BlogSection />
        </>
      ) : sections.length > 0 ? (
        sections.map((section) => renderSection(section))
      ) : (
        <>
          {/* Fallback to default if no sections found */}
          <HeroSection />
          <USPSection />
          <WellnessSection />
          <WorkingHoursSection />
          <ServicesSection />
          <PricingSection />
          <BlogSection />
          <TestimonialsSection />
          <SpecialOfferSection />
        </>
      )}
      <Footer />
    </Box>
  );
};

export default HomePage;
