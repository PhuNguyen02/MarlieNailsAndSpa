import { SxProps, Theme } from "@mui/material";

export const heroStyles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fffcf9 0%, #f7f0e8 100%)",
    display: "flex",
    alignItems: "center",
    position: "relative",
    pt: { xs: 12, md: 14 },
    pb: { xs: 8, md: 12 },
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "10%",
      right: "-5%",
      width: "40%",
      height: "80%",
      background:
        "radial-gradient(circle, rgba(212, 175, 140, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(60px)",
      zIndex: 0,
    },
  },
  content: {
    textAlign: { xs: "center", md: "left" },
    color: "text.primary",
    position: "relative",
    zIndex: 1,
    animation: "fadeInLeft 1s ease-out",
    "@keyframes fadeInLeft": {
      from: {
        opacity: 0,
        transform: "translateX(-30px)",
      },
      to: {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
  },
  title: {
    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5.5rem" },
    fontWeight: 300,
    mb: { xs: 3, md: 4 },
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    color: "primary.dark",
    fontFamily: '"Playfair Display", serif',
  },
  description: {
    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
    lineHeight: 1.8,
    color: "text.secondary",
    maxWidth: "600px",
    mx: { xs: "auto", md: "0" },
    mb: { xs: 4, md: 5 },
  },
  buttonContainer: {
    display: "flex",
    gap: 2,
    justifyContent: { xs: "center", md: "flex-start" },
    flexWrap: "wrap",
    mt: { xs: 3, md: 4 },
  },
  imageWrapper: {
    position: "relative",
    zIndex: 1,
    display: { xs: "none", md: "block" },
    animation: "fadeInRight 1s ease-out",
    "@keyframes fadeInRight": {
      from: {
        opacity: 0,
        transform: "translateX(30px)",
      },
      to: {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
  },
  heroImage: {
    width: "100%",
    height: "auto",
    borderRadius: "40px 100px 40px 100px",
    boxShadow: "20px 20px 60px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.02) rotate(1deg)",
    },
  },
  accentCircle: {
    position: "absolute",
    bottom: "-20px",
    left: "-20px",
    width: "120px",
    height: "120px",
    background: "rgba(212, 175, 140, 0.2)",
    borderRadius: "50%",
    zIndex: -1,
    backdropFilter: "blur(10px)",
  },
} satisfies Record<string, SxProps<Theme>>;
