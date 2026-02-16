import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, AccessTime } from "@mui/icons-material";
import { timeSlotsApi } from "@/api";
import type { TimeSlot, CreateTimeSlotRequest } from "@/api/types";

const TimeSlotsPage: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<CreateTimeSlotRequest>({
    startTime: "08:00",
    endTime: "09:00",
    maxCapacity: 2,
  });

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const result = await timeSlotsApi.getAll();
      if (result.status === 200) {
        setTimeSlots(result.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const handleOpenDialog = (slot?: TimeSlot) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: slot.maxCapacity,
      });
    } else {
      setEditingSlot(null);
      setFormData({
        startTime: "09:00",
        endTime: "10:00",
        maxCapacity: 2,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSlot) {
        await timeSlotsApi.update(editingSlot.id, formData);
      } else {
        await timeSlotsApi.create(formData);
      }
      handleCloseDialog();
      fetchTimeSlots();
    } catch (err: any) {
      setError(err.message || "Action failed");
    }
  };

  const handleToggleActive = async (slot: TimeSlot) => {
    try {
      await timeSlotsApi.update(slot.id, { isActive: !slot.isActive });
      fetchTimeSlots();
    } catch (err: any) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khung giờ này?")) {
      try {
        await timeSlotsApi.delete(id);
        fetchTimeSlots();
      } catch (err: any) {
        console.error("Failed to delete", err);
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Quản lý Khung Giờ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xếp lịch làm việc chung cho toàn tiệm
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Thêm Khung Giờ
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell>Giờ Bắt Đầu</TableCell>
              <TableCell>Giờ Kết Thúc</TableCell>
              <TableCell>Số Lượng Khách tối đa</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Chưa có khung giờ nào được tạo.
                </TableCell>
              </TableRow>
            ) : (
              timeSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime
                        sx={{ mr: 1, fontSize: "1rem", color: "primary.main" }}
                      />
                      {slot.startTime}
                    </Box>
                  </TableCell>
                  <TableCell>{slot.endTime}</TableCell>
                  <TableCell>{slot.maxCapacity} khách</TableCell>
                  <TableCell>
                    <Switch
                      checked={slot.isActive}
                      onChange={() => handleToggleActive(slot)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(slot)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(slot.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingSlot ? "Chỉnh sửa khung giờ" : "Thêm khung giờ mới"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              label="Giờ bắt đầu"
              type="time"
              fullWidth
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Giờ kết thúc"
              type="time"
              fullWidth
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Sức chứa tối đa (số khách)"
              type="number"
              fullWidth
              value={formData.maxCapacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxCapacity: parseInt(e.target.value),
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingSlot ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlotsPage;
