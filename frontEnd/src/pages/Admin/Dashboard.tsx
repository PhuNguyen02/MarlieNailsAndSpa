import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  alpha,
  LinearProgress,
  Avatar,
} from "@mui/material";
import {
  TrendingUp,
  PeopleAltOutlined,
  CalendarMonthOutlined,
  AttachMoneyOutlined,
  BoltOutlined,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      bgcolor: "white",
      border: "1px solid rgba(0,0,0,0.03)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: "12px",
          bgcolor: alpha(color, 0.1),
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      {trend && (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            bgcolor: "#f0fdf4",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <TrendingUp sx={{ fontSize: "0.9rem" }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {trend}
          </Typography>
        </Box>
      )}
    </Box>
    <Typography
      variant="body2"
      sx={{ color: "#64748b", fontWeight: 600, mb: 0.5 }}
    >
      {title}
    </Typography>
    <Typography
      variant="h4"
      sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-1px" }}
    >
      {value}
    </Typography>
  </Paper>
);

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ animation: "fadeIn 0.5s ease" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}
        >
          Chào buổi sáng, Marlie 👋
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Đứng sau một thương hiệu spa thành công là một người quản lý tài ba.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sức Chứa Hiện Tại"
            value="85%"
            icon={<BoltOutlined />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lịch Hẹn Hôm Nay"
            value="12"
            icon={<CalendarMonthOutlined />}
            color="#3b82f6"
            trend="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng Doanh Thu"
            value="₫5.2M"
            icon={<AttachMoneyOutlined />}
            color="#10b981"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách Hàng Mới"
            value="24"
            icon={<PeopleAltOutlined />}
            color="#8b5cf6"
            trend="+18%"
          />
        </Grid>

        {/* Placeholder cho Charts hoặc Recent Activities */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "24px",
              minHeight: 400,
              bgcolor: "white",
              border: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              backgroundImage:
                "radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.05) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.05) 0, transparent 50%)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Tăng trưởng doanh thu
            </Typography>
            <Box sx={{ width: "100%", maxWidth: 400, my: 3 }}>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: "#f1f5f9",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    background: "linear-gradient(to right, #10b981, #3b82f6)",
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              Dữ liệu đang được phân tích từ hệ thống Booking theo thời gian
              thực...
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "24px",
              minHeight: 400,
              bgcolor: "white",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Hoạt động gần đây
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ display: "flex", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <CalendarMonthOutlined sx={{ fontSize: "1.2rem" }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1e293b" }}
                    >
                      Đặt lịch Nail Pro #{i + 2500}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block" }}
                    >
                      Khách hàng mới - 2 giờ trước
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
