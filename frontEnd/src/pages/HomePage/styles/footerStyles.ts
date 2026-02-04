import { SxProps, Theme } from "@mui/material";

export const footerStyles = {
  container: {
    py: { xs: 6, md: 10 },
    backgroundColor: "#1a1a1a",
    color: "white",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(212, 175, 140, 0.5), transparent)",
    },
  },
  title: {
    color: "white",
    fontWeight: 600,
    mb: 3,
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    letterSpacing: "0.5px",
  },
  description: {
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 1.8,
    mb: 3,
    fontSize: { xs: "0.9rem", md: "1rem" },
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },
  link: {
    color: "rgba(255, 255, 255, 0.75)",
    textDecoration: "none",
    fontSize: { xs: "0.9rem", md: "1rem" },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-block",
    "&:hover": {
      color: "primary.main",
      transform: "translateX(4px)",
    },
  },
  contact: {
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 2,
    fontSize: { xs: "0.9rem", md: "1rem" },
  },
  bottom: {
    mt: { xs: 5, md: 8 },
    pt: 4,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  },
} satisfies Record<string, SxProps<Theme>>;
