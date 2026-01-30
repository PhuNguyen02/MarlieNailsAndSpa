import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  CalendarToday,
  AccessTime,
  Person,
} from "@mui/icons-material";
import { useState, useMemo, useEffect } from "react";
import { useBookings } from "../../hooks";
import { formatPrice } from "../../utils";
import TimeSlotPicker from "../TimeSlotPicker";

import { BookingItem } from "./types";

interface BookingItemCardProps {
  item: BookingItem;
  index: number;
  services: {
    id: string;
    name: string;
    category: string;
    price?: number;
    price_range?: string;
  }[];
  onUpdate: (index: number, field: keyof BookingItem, value: string) => void;
  errors?: Partial<Record<keyof BookingItem, string>>;
  allBookings?: BookingItem[]; // Tất cả bookings để check conflict
}

const BookingItemCard = ({
  item,
  index,
  services,
  onUpdate,
  errors = {},
  allBookings = [],
}: BookingItemCardProps) => {
  const [timeSlotPickerOpen, setTimeSlotPickerOpen] = useState(false);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const { getActiveBookableEmployees, loading: employeesLoading } =
    useBookings();

  // Fetch all active employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      const emps = await getActiveBookableEmployees();
      setAllEmployees(emps);
    };
    fetchEmployees();
  }, [getActiveBookableEmployees]);

  // Filter employees by service category
  const filteredEmployees = useMemo(() => {
    if (!item.service || allEmployees.length === 0) return [];

    const serviceItem = services.find((s) => s.id === item.service);
    if (!serviceItem) return [];

    const category = serviceItem.category.toLowerCase();

    // Trong flow mới, ta cho phép chọn nhân viên 'trùng' nếu họ rảnh ở khung giờ khác
    // Việc check trùng giờ sẽ do TimeSlotPicker đảm nhận (hoặc logic getAvailableSlots)
    // Tuy nhiên, nếu muốn tránh chọn cùng 1 nhân viên cho 2 khách trong CÙNG 1 booking request (nếu logic business cấm),
    // ta có thể filter ở đây. Nhưng business thường cho phép 1 nhân viên phục vụ nhiều khách nếu thời gian khác nhau.
    // Tạm thời hiển thị hết những ai có skill.

    return allEmployees.filter((emp) => {
      if (!emp.specialization) return true;
      const specs = emp.specialization
        .toLowerCase()
        .split(",")
        .map((s: string) => s.trim());
      return specs.some((spec: string) => category.includes(spec));
    });
  }, [item.service, services, allEmployees]);

  // Get selected service price info
  const selectedServicePriceInfo = useMemo(() => {
    if (!item.service) return { price: 0, priceRange: undefined };
    const service = services.find((s) => s.id === item.service);
    if (!service) return { price: 0, priceRange: undefined };

    return {
      price: service.price || 0,
      priceRange: service.price_range,
    };
  }, [item.service, services]);

  const handleServiceChange = (serviceId: string) => {
    onUpdate(index, "service", serviceId);
    // Reset following fields
    onUpdate(index, "staff", "");
    onUpdate(index, "date", "");
    onUpdate(index, "time", "");
    onUpdate(index, "timeLabel", "");
  };

  const handleStaffChange = (staffId: string) => {
    onUpdate(index, "staff", staffId);
    // Reset following fields
    onUpdate(index, "date", "");
    onUpdate(index, "time", "");
    onUpdate(index, "timeLabel", "");
  };

  const handleDateChange = (date: string) => {
    onUpdate(index, "date", date);
    // Reset following fields
    onUpdate(index, "time", "");
    onUpdate(index, "timeLabel", "");
  };

  const handleTimeSlotSelect = (
    date: string,
    timeSlotId: string,
    timeLabel: string,
  ) => {
    onUpdate(index, "date", date); // Should stay same
    onUpdate(index, "time", timeSlotId);
    onUpdate(index, "timeLabel", timeLabel);
    setTimeSlotPickerOpen(false);
  };

  const isComplete = item.service && item.staff && item.date && item.time;

  return (
    <>
      <Accordion
        defaultExpanded={index === 0}
        sx={{
          mb: 2,
          border: isComplete ? "2px solid" : "1px solid",
          borderColor: isComplete ? "primary.main" : "rgba(0, 0, 0, 0.12)",
          borderRadius: 2,
          "&:before": { display: "none" },
          boxShadow: isComplete
            ? "0 4px 12px rgba(212, 175, 140, 0.15)"
            : "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            px: 2,
            py: 1.5,
            "& .MuiAccordionSummary-content": {
              my: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: isComplete ? "primary.main" : "grey.300",
                color: isComplete ? "white" : "grey.600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {item.guestNumber}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: "1rem" }}
              >
                Người {item.guestNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isComplete
                  ? `${services.find((s) => s.id === item.service)?.name || ""} - ${item.date} ${item.timeLabel || ""}`
                  : "Chưa hoàn tất thông tin đặt lịch"}
              </Typography>
              {item.service && selectedServicePriceInfo.price > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  {selectedServicePriceInfo.priceRange
                    ? `${selectedServicePriceInfo.priceRange} đ`
                    : formatPrice(selectedServicePriceInfo.price)}
                </Typography>
              )}
            </Box>
            {isComplete && (
              <Chip
                label="Hoàn tất"
                size="small"
                color="success"
                sx={{ height: 24 }}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* 1. Service Selection */}
            <TextField
              select
              label="Chọn Dịch Vụ"
              fullWidth
              required
              value={item.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              error={!!errors.service}
              helperText={errors.service}
              variant="outlined"
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.category}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            {/* 2. Staff Selection (Moved Up) */}
            <TextField
              select
              label="Chọn Nhân Viên / Chuyên Viên"
              fullWidth
              required
              value={item.staff}
              onChange={(e) => handleStaffChange(e.target.value)}
              error={!!errors.staff}
              helperText={errors.staff}
              variant="outlined"
              disabled={!item.service}
              InputProps={{
                startAdornment: employeesLoading ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ) : (
                  <Person
                    sx={{ mr: 1, color: "text.secondary", fontSize: "1.2rem" }}
                  />
                ),
              }}
            >
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((staff) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {staff.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {staff.role}{" "}
                        {staff.specialization
                          ? `(${staff.specialization})`
                          : ""}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  {item.service
                    ? employeesLoading
                      ? "Đang tải..."
                      : "Không có nhân viên phù hợp"
                    : "Vui lòng chọn dịch vụ trước"}
                </MenuItem>
              )}
            </TextField>

            {/* 3. Date Selection */}
            <TextField
              label="Chọn Ngày"
              fullWidth
              required
              type="date"
              value={item.date}
              onChange={(e) => handleDateChange(e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              disabled={!item.staff}
              InputProps={{
                startAdornment: (
                  <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />

            {/* 4. Time Selection Button */}
            <Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => item.date && setTimeSlotPickerOpen(true)}
                disabled={!item.date}
                sx={{
                  py: 1.5,
                  borderColor: item.time
                    ? "primary.main"
                    : "rgba(0, 0, 0, 0.23)",
                  backgroundColor: item.time ? "primary.light" : "transparent",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <AccessTime />
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: item.time ? 600 : 400 }}
                  >
                    {item.timeLabel
                      ? `Giờ đã chọn: ${item.timeLabel}`
                      : "Chọn Giờ Đặt Lịch"}
                  </Typography>
                </Box>
              </Button>
              {errors.time && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.time}
                </Typography>
              )}
              {item.timeLabel && !errors.time && (
                <Chip
                  label={`${item.timeLabel}`}
                  size="small"
                  color="primary"
                  sx={{ mt: 1 }}
                  onDelete={() => {
                    onUpdate(index, "time", "");
                    onUpdate(index, "timeLabel", "");
                  }}
                />
              )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Time Slot Picker Modal */}
      <TimeSlotPicker
        open={timeSlotPickerOpen}
        onClose={() => setTimeSlotPickerOpen(false)}
        onSelect={handleTimeSlotSelect}
        selectedDate={item.date}
        serviceId={item.service}
        employeeId={item.staff}
        currentGuestNumber={item.guestNumber}
        existingBookings={allBookings
          .filter((b) => b.guestNumber !== item.guestNumber && b.date && b.time)
          .map((b) => ({
            date: b.date,
            time: b.time,
            guestNumber: b.guestNumber,
          }))}
      />
    </>
  );
};

export default BookingItemCard;
