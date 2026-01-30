import React from "react";
import { Typography, Paper, Grid, Box } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng Quan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Booking Hôm Nay
            </Typography>
            <Typography variant="h3">12</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="secondary" gutterBottom>
              Doanh Thu Ước Tính
            </Typography>
            <Typography variant="h3">5.2M</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="success.main" gutterBottom>
              Nhân Viên Đang Làm
            </Typography>
            <Typography variant="h3">4/6</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
