import { SxProps, Theme } from "@mui/material";

export const blogStyles = {
  container: {
    py: { xs: 8, md: 12 },
    backgroundColor: "white",
  },
  title: {
    fontSize: { xs: "2.25rem", md: "3.5rem", lg: "4rem" },
    fontWeight: 300,
    mb: 2,
    color: "text.primary",
    fontFamily: '"Playfair Display", serif',
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: { xs: "1rem", md: "1.125rem" },
    color: "text.secondary",
    maxWidth: "700px",
    mx: "auto",
    lineHeight: 1.7,
  },
  card: {
    height: "100%",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "white",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
      "& $image": {
        transform: "scale(1.1)",
      },
    },
  },
  image: {
    objectFit: "cover",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    width: "100%",
    height: "250px",
    display: "block",
  },
  date: {
    display: "block",
    mb: 1.5,
    fontSize: "0.8rem",
    color: "text.secondary",
    letterSpacing: "0.5px",
  },
  postTitle: {
    fontWeight: 600,
    mb: 2,
    color: "text.primary",
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    transition: "color 0.3s ease",
    "&:hover": {
      color: "primary.main",
    },
  },
  description: {
    lineHeight: 1.7,
    mb: 2,
    fontSize: { xs: "0.9rem", md: "1rem" },
    color: "text.secondary",
  },
  readMore: {
    color: "primary.main",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "inline-block",
    transition: "all 0.3s ease",
    letterSpacing: "0.5px",
    "&:hover": {
      transform: "translateX(4px)",
      textDecoration: "underline",
    },
  },
} satisfies Record<string, SxProps<Theme>>;
