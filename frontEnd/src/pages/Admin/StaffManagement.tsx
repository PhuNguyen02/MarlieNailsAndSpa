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
  specialization: string;
  isActive: boolean;
  workSchedule?: string;
}

const StaffManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Partial<Employee> | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const result: any = await apiClient.get("/admin/employees");
      if (result.status === 200) {
        setEmployees(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleOpen = (employee?: Employee) => {
    setSelectedEmployee(
      employee || {
        fullName: "",
        phone: "",
        email: "",
        specialization: "",
        isActive: true,
        workSchedule: "",
      },
    );
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
      } else {
        await apiClient.post("/admin/employees", selectedEmployee);
      }
      handleClose();
      fetchEmployees();
    } catch (err) {
      console.error("Failed to save employee", err);
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
              <TableCell>Chuyên Môn</TableCell>
              <TableCell>Lịch Làm Việc</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.fullName}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.specialization}</TableCell>
                <TableCell>{emp.workSchedule || "Chưa xếp lịch"}</TableCell>
                <TableCell>
                  <Chip
                    label={emp.isActive ? "Đang làm" : "Nghỉ"}
                    color={emp.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(emp)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedEmployee?.id ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Họ Tên"
              fullWidth
              value={selectedEmployee?.fullName || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  fullName: e.target.value,
                })
              }
            />
            <TextField
              label="Số Điện Thoại"
              fullWidth
              value={selectedEmployee?.phone || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  phone: e.target.value,
                })
              }
            />
            <TextField
              label="Email"
              fullWidth
              value={selectedEmployee?.email || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  email: e.target.value,
                })
              }
            />
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
              label="Lịch Làm Việc (Shift)"
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
            <FormControlLabel
              control={
                <Switch
                  checked={selectedEmployee?.isActive || false}
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
    </Box>
  );
};

export default StaffManagement;
