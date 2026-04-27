import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { apiClient } from "@/api";

interface Employee {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "therapist" | "receptionist" | "manager";
  specialization: string;
  isActive: boolean;
  workSchedule?: string;
  hireDate?: string;
}

const ROLE_LABELS: Record<string, string> = {
  therapist: "Kỹ thuật viên",
  receptionist: "Lễ tân",
  manager: "Quản lý",
};

const EMPTY_EMPLOYEE: Partial<Employee> = {
  fullName: "",
  phone: "",
  email: "",
  role: "therapist",
  specialization: "",
  isActive: true,
  workSchedule: "",
  hireDate: "",
};

const StaffManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Partial<Employee> | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const result: any = await apiClient.get("/admin/employees");
      if (result.status === 200) {
        setEmployees(result.data?.data || result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (employee?: Employee) => {
    setSelectedEmployee(employee ? { ...employee } : { ...EMPTY_EMPLOYEE });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async () => {
    try {
      if (selectedEmployee?.id) {
        await apiClient.patch(
          `/admin/employees/${selectedEmployee.id}`,
          selectedEmployee,
        );
        showSnackbar("Cập nhật nhân viên thành công", "success");
      } else {
        await apiClient.post("/admin/employees", selectedEmployee);
        showSnackbar("Thêm nhân viên thành công", "success");
      }
      handleClose();
      fetchEmployees();
    } catch (err: any) {
      const msg = err?.message || "Lỗi khi lưu thông tin nhân viên";
      showSnackbar(msg, "error");
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(`/admin/employees/${employeeToDelete.id}`);
      showSnackbar("Xóa nhân viên thành công", "success");
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err: any) {
      const msg = err?.message || "Lỗi khi xóa nhân viên";
      showSnackbar(msg, "error");
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Quản Lý Nhân Viên</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm Nhân Viên
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ Tên</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai Trò</TableCell>
              <TableCell>Chuyên Môn</TableCell>
              <TableCell>Ngày Vào Làm</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  Chưa có nhân viên nào
                </TableCell>
              </TableRow>
            )}
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell sx={{ fontWeight: 600 }}>{emp.fullName}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>
                  <Chip
                    label={ROLE_LABELS[emp.role] || emp.role}
                    size="small"
                    color={
                      emp.role === "manager"
                        ? "secondary"
                        : emp.role === "receptionist"
                          ? "info"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>{emp.specialization || "—"}</TableCell>
                <TableCell>
                  {emp.hireDate
                    ? new Date(emp.hireDate).toLocaleDateString("vi-VN")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={emp.isActive ? "Đang làm" : "Nghỉ"}
                    color={emp.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(emp)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(emp)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedEmployee?.id ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Họ Tên *"
              fullWidth
              value={selectedEmployee?.fullName || ""}
              onChange={(e) =>
                setSelectedEmployee({ ...selectedEmployee, fullName: e.target.value })
              }
            />
            <TextField
              label="Số Điện Thoại *"
              fullWidth
              value={selectedEmployee?.phone || ""}
              onChange={(e) =>
                setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })
              }
            />
            <TextField
              label="Email *"
              fullWidth
              value={selectedEmployee?.email || ""}
              onChange={(e) =>
                setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Vai Trò</InputLabel>
              <Select
                label="Vai Trò"
                value={selectedEmployee?.role || "therapist"}
                onChange={(e) =>
                  setSelectedEmployee({
                    ...selectedEmployee,
                    role: e.target.value as Employee["role"],
                  })
                }
              >
                <MenuItem value="therapist">Kỹ thuật viên</MenuItem>
                <MenuItem value="receptionist">Lễ tân</MenuItem>
                <MenuItem value="manager">Quản lý</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Chuyên Môn"
              fullWidth
              value={selectedEmployee?.specialization || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  specialization: e.target.value,
                })
              }
            />
            <TextField
              label="Lịch Làm Việc"
              fullWidth
              multiline
              rows={2}
              placeholder="Ví dụ: Thứ 2-6 (8:00 - 17:00)"
              value={selectedEmployee?.workSchedule || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  workSchedule: e.target.value,
                })
              }
            />
            <TextField
              label="Ngày Vào Làm"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={
                selectedEmployee?.hireDate
                  ? selectedEmployee.hireDate.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  hireDate: e.target.value,
                })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selectedEmployee?.isActive ?? true}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Đang làm việc"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa nhân viên{" "}
            <strong>{employeeToDelete?.fullName}</strong> không? Hành động này
            không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffManagement;
