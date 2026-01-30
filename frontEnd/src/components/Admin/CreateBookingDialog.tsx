import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Autocomplete,
  CircularProgress,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { bookingsApi, customersApi, servicesApi } from "@/api";
import type {
  Service,
  Employee,
  Customer,
  CreateBookingRequest,
  CreateCustomerRequest,
} from "@/api/types";

interface CreateBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
  initialTimeSlotId?: string;
  initialEmployeeId?: string;
  initialStartTime?: string;
}

const CreateBookingDialog: React.FC<CreateBookingDialogProps> = ({
  open,
  onClose,
  onSuccess,
  initialDate,
  initialTimeSlotId,
  initialEmployeeId,
  initialStartTime,
}) => {
  // Form State
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const [date, setDate] = useState(initialDate || dayjs().format("YYYY-MM-DD"));
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState(initialTimeSlotId || "");

  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    initialEmployeeId ? [initialEmployeeId] : [],
  );

  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (open) {
      fetchServices();
      fetchSlots(date);
      // Reset selections if they change from props
      if (initialTimeSlotId) setSelectedSlotId(initialTimeSlotId);
      if (initialEmployeeId) setSelectedEmployeeIds([initialEmployeeId]);
    }
  }, [open, date, initialTimeSlotId, initialEmployeeId]);

  useEffect(() => {
    if (selectedSlotId && date) {
      fetchEmployees(date, selectedSlotId);
    }
  }, [selectedSlotId, date]);

  useEffect(() => {
    if (selectedService) {
      setTotalPrice(selectedService.singlePrice || 0);
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      const res = await servicesApi.getAll({ active: true });
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const fetchSlots = async (targetDate: string) => {
    try {
      const res = await bookingsApi.getAvailableSlots(targetDate);
      setAvailableSlots(res.data);

      // If we have an initialStartTime, find the matching slot
      if (initialStartTime && !selectedSlotId) {
        const matchingSlot = res.data.find((slot: any) =>
          slot.timeSlot.startTime.startsWith(initialStartTime),
        );
        if (matchingSlot) {
          setSelectedSlotId(matchingSlot.timeSlot.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch slots", err);
    }
  };

  const fetchEmployees = async (targetDate: string, slotId: string) => {
    try {
      const res = await bookingsApi.getAvailableEmployees(targetDate, slotId);
      setAvailableEmployees(res.data.availableEmployees);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleSearchCustomer = async () => {
    if (!phone) return;
    setIsSearching(true);
    setError(null);
    try {
      const res = await customersApi.getByPhone(phone);
      if (res.data) {
        setCustomer(res.data);
      } else {
        setCustomer(null);
        setNewCustomer({ ...newCustomer, phone });
      }
    } catch (err) {
      console.error("Search failed", err);
      setError("Lỗi khi tìm kiếm khách hàng");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      let finalCustomerId = customer?.id;

      // 1. Create customer if new (either manually entered or search failed)
      if (!customer && newCustomer.fullName) {
        const custRes = await customersApi.create(newCustomer);
        finalCustomerId = custRes.data.id;
      }

      if (!finalCustomerId) {
        setError("Vui lòng chọn khách hàng hoặc nhập thông tin khách mới");
        setLoading(false);
        return;
      }

      if (!selectedService || !selectedSlotId) {
        setError("Vui lòng chọn dịch vụ và khung giờ");
        setLoading(false);
        return;
      }

      // 2. Create booking
      const bookingData: CreateBookingRequest = {
        customerId: finalCustomerId,
        serviceId: selectedService.id,
        employeeIds: selectedEmployeeIds,
        bookingDate: date,
        timeSlotId: selectedSlotId,
        numberOfGuests,
        totalPrice,
        notes,
      };

      await bookingsApi.create(bookingData);
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Booking failed", err);
      setError(err.message || "Lỗi khi tạo booking");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setCustomer(null);
    setPhone("");
    setSelectedService(null);
    setSelectedEmployeeIds([]);
    setTotalPrice(0);
    setNotes("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Tạo Booking Mới</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Customer Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Thông tin khách hàng
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Số điện thoại"
                size="small"
                fullWidth
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  setPhone(val);
                  setNewCustomer((prev) => ({ ...prev, phone: val }));
                  if (customer) setCustomer(null);
                }}
              />
              <Button
                variant="outlined"
                onClick={handleSearchCustomer}
                disabled={isSearching || !phone}
              >
                {isSearching ? <CircularProgress size={20} /> : "Tìm"}
              </Button>
            </Box>

            {customer ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#e3f2fd",
                  borderRadius: 1,
                  border: "1px solid #90caf9",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Khách cũ: {customer.fullName}
                  </Typography>
                  <Button size="small" onClick={() => setCustomer(null)}>
                    Thay đổi
                  </Button>
                </Box>
                <Typography variant="caption" display="block">
                  Email: {customer.email}
                </Typography>
                <Typography variant="caption">
                  Số lần đến: {customer.totalVisits}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2,
                  border: "1px dashed #ccc",
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Chưa chọn khách hàng hoặc khách hàng mới
                </Typography>
                <TextField
                  label="Họ tên khách mới"
                  size="small"
                  fullWidth
                  required
                  value={newCustomer.fullName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCustomer({ ...newCustomer, fullName: val });
                  }}
                />
                <TextField
                  label="Email (tùy chọn)"
                  size="small"
                  fullWidth
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
              </Box>
            )}
          </Grid>

          {/* Service & Time Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Dịch vụ & Thời gian
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Dịch vụ</InputLabel>
                <Select
                  value={selectedService?.id || ""}
                  label="Dịch vụ"
                  onChange={(e) => {
                    const s = services.find((sv) => sv.id === e.target.value);
                    setSelectedService(s || null);
                  }}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} - {s.singlePrice?.toLocaleString()}đ
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Ngày đặt"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Khung giờ</InputLabel>
                <Select
                  value={selectedSlotId}
                  label="Khung giờ"
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                >
                  {availableSlots.map((slot) => (
                    <MenuItem
                      key={slot.timeSlot.id}
                      value={slot.timeSlot.id}
                      disabled={!slot.isAvailable}
                    >
                      {slot.timeSlot.startTime.substring(0, 5)} -{" "}
                      {slot.timeSlot.endTime.substring(0, 5)}
                      {!slot.isAvailable && " (Hết chỗ)"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Staff & Details Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Nhân viên phụ trách
            </Typography>
            <Autocomplete
              multiple
              options={availableEmployees}
              getOptionLabel={(option) => option.fullName}
              value={availableEmployees.filter((e) =>
                selectedEmployeeIds.includes(e.id),
              )}
              onChange={(_, newValue) => {
                setSelectedEmployeeIds(newValue.map((v) => v.id));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn nhân viên"
                  size="small"
                  placeholder="Phụ trách"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Chi tiết khác
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Số khách"
                  type="number"
                  size="small"
                  fullWidth
                  value={numberOfGuests}
                  inputProps={{ min: 1 }}
                  onChange={(e) =>
                    setNumberOfGuests(parseInt(e.target.value) || 1)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tổng tiền"
                  type="number"
                  size="small"
                  fullWidth
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(parseInt(e.target.value) || 0)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ghi chú"
                  multiline
                  rows={2}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {error && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 2, display: "block" }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateBooking}
          disabled={
            loading ||
            !selectedSlotId ||
            !selectedService ||
            (!customer && !newCustomer.fullName)
          }
          sx={{ minWidth: 150 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Xác nhận đặt lịch"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBookingDialog;
