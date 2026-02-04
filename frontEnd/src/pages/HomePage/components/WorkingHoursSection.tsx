import { Box, Container, Typography, Grid, Paper, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpaIcon from "@mui/icons-material/Spa";
import { useBookingModal } from "../../../hooks/useBookingModal";

const workingHours = [
  { day: "Thứ 2 - Thứ 6", time: "09:00 - 20:00" },
  { day: "Thứ 7", time: "Mở cửa cả ngày" },
  { day: "Chủ Nhật", time: "Mở cửa cả ngày" },
];

const WorkingHoursSection = () => {
  const { openModal } = useBookingModal();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        background:
          "linear-gradient(180deg, #fffcf9 0%, #ffffff 50%, #f7f0e8 100%)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c2-2 5-2 7 0s2 5 0 7-5 2-7 0-2-5 0-7z' fill='%23d4af8c' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
          opacity: 0.5,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 3, md: 4 }}
          sx={{ alignItems: "center" }}
        >
          {/* Left Box - OPEN HOURS */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 243, 0.95) 100%)",
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "primary.light",
                boxShadow: "0 8px 32px rgba(212, 175, 140, 0.15)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, primary.main, primary.dark)",
                  backgroundImage: "linear-gradient(90deg, #d4af8c, #b8956f)",
                },
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 48px rgba(212, 175, 140, 0.25)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(212, 175, 140, 0.3)",
                  }}
                >
                  <AccessTimeIcon sx={{ color: "white", fontSize: "2rem" }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                    color: "primary.dark",
                    letterSpacing: "1px",
                  }}
                >
                  Giờ Mở Cửa
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                Chào mừng bạn đến với spa của chúng tôi! Chúng tôi luôn sẵn sàng
                phục vụ bạn.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {workingHours.map((schedule, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: schedule.day.includes("Nghỉ")
                        ? "rgba(0, 0, 0, 0.02)"
                        : "linear-gradient(135deg, rgba(212, 175, 140, 0.08) 0%, rgba(248, 246, 243, 0.3) 100%)",
                      border: "1px solid",
                      borderColor: schedule.day.includes("Nghỉ")
                        ? "rgba(0, 0, 0, 0.05)"
                        : "primary.light",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: schedule.day.includes("Nghỉ")
                          ? "text.secondary"
                          : "primary.main",
                        flexShrink: 0,
                        boxShadow: schedule.day.includes("Nghỉ")
                          ? "none"
                          : "0 2px 8px rgba(212, 175, 140, 0.4)",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: { xs: "0.95rem", md: "1rem" },
                          mb: 0.5,
                        }}
                      >
                        {schedule.day}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: schedule.day.includes("Nghỉ")
                            ? "text.secondary"
                            : "primary.dark",
                          fontWeight: schedule.day.includes("Nghỉ") ? 400 : 600,
                          fontSize: { xs: "0.875rem", md: "0.9375rem" },
                        }}
                      >
                        {schedule.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Center Image */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 16px 64px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Box
                component="img"
                src="/images/working-hours.png"
                alt="Relaxing spa"
                sx={{
                  width: "100%",
                  height: { xs: "400px", md: "600px" },
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
                  p: 3,
                  color: "white",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Không gian thư giãn tuyệt vời
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Box - RELAX NOW */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                background:
                  "linear-gradient(135deg, primary.main 0%, primary.dark 100%)",
                backgroundImage:
                  "linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)",
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: "300px", md: "500px" },
                boxShadow: "0 8px 32px rgba(212, 175, 140, 0.3)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                  borderRadius: "50%",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -80,
                  left: -80,
                  width: "250px",
                  height: "250px",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
                  borderRadius: "50%",
                },
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 48px rgba(212, 175, 140, 0.4)",
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    mx: "auto",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <SpaIcon sx={{ color: "white", fontSize: "3rem" }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    color: "white",
                    mb: 2.5,
                    letterSpacing: "1px",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Thư Giãn Ngay!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.8,
                    mb: 4,
                    px: 2,
                    maxWidth: "300px",
                    mx: "auto",
                  }}
                >
                  Hãy để chúng tôi giúp bạn thư giãn và tận hưởng những khoảnh
                  khắc tuyệt vời nhất.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => openModal("")}
                  sx={{
                    backgroundColor: "white",
                    color: "primary.dark",
                    px: 5,
                    py: 1.5,
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    textTransform: "none",
                    letterSpacing: "0.5px",
                    borderRadius: 3,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Đặt Lịch Ngay
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WorkingHoursSection;
