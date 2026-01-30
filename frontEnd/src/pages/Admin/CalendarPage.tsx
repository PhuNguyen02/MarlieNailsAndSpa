import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  AccessTime,
  Person,
  AttachMoney,
  Notes,
  CalendarMonth,
  Event,
  ViewWeek,
  ViewDay,
} from "@mui/icons-material";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/vi";
import { apiClient, employeesApi } from "@/api";
import CreateBookingDialog from "@/components/Admin/CreateBookingDialog";
import type { Booking, Employee } from "@/api/types";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.locale("vi");

const STATUS_COLORS = {
  pending: { bg: "#fff9c4", text: "#fbc02d", border: "#fbc02d" },
  confirmed: { bg: "#e3f2fd", text: "#1976d2", border: "#1976d2" },
  completed: { bg: "#e8f5e9", text: "#2e7d32", border: "#2e7d32" },
  cancelled: { bg: "#ffebee", text: "#d32f2f", border: "#d32f2f" },
};

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [presetSlotId, setPresetSlotId] = useState<string | undefined>();
  const [presetEmployeeId, setPresetEmployeeId] = useState<
    string | undefined
  >();
  const [presetStartTime, setPresetStartTime] = useState<string | undefined>();

  useEffect(() => {
    fetchBookings();
    if (view === "day") {
      fetchEmployees();
    }
  }, [currentDate, view]);

  const fetchEmployees = async () => {
    try {
      const result = await employeesApi.getAll({ isActive: true });
      if (result.status === 200) {
        setEmployees(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchBookings = async () => {
    try {
      let params: any = {};

      if (view === "day") {
        params.startDate = currentDate.format("YYYY-MM-DD");
      } else if (view === "week") {
        params.startDate = currentDate.startOf("week").format("YYYY-MM-DD");
        params.endDate = currentDate.endOf("week").format("YYYY-MM-DD");
      } else if (view === "month") {
        params.startDate = currentDate.startOf("month").format("YYYY-MM-DD");
        params.endDate = currentDate.endOf("month").format("YYYY-MM-DD");
      }

      const result: any = await apiClient.get("/bookings", { params });

      if (result.status === 200) {
        setBookings(result.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setOpenDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    try {
      const result: any = await apiClient.patch(
        `/bookings/${selectedBooking.id}`,
        { status: newStatus },
      );

      if (result.status === 200) {
        setOpenDialog(false);
        fetchBookings(); // Refresh data
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, view));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, view));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // Helper to get bookings for a specific day
  const getBookingsForDate = (date: dayjs.Dayjs) => {
    return bookings.filter((b) => dayjs(b.bookingDate).isSame(date, "day"));
  };

  // Helper to get bookings for a day and hour
  const getBookingsForSlot = (date: dayjs.Dayjs, hour: number) => {
    return bookings.filter((b) => {
      const isSameDate = dayjs(b.bookingDate).isSame(date, "day");
      const bHour = parseInt(b.timeSlot.startTime.split(":")[0]);
      return isSameDate && bHour === hour;
    });
  };

  const renderEventCard = (booking: Booking, isSmall = false) => {
    const color = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;

    return (
      <Paper
        key={booking.id}
        elevation={1}
        onClick={(e) => handleBookingClick(booking, e)}
        sx={{
          p: 0.5,
          mb: 0.5,
          cursor: "pointer",
          backgroundColor: color.bg,
          borderLeft: `3px solid ${color.border}`,
          overflow: "hidden",
          transition: "all 0.2s",
          "&:hover": {
            opacity: 0.9,
            transform: "translateY(-1px)",
            boxShadow: 2,
          },
        }}
      >
        <Typography
          variant="caption"
          display="block"
          sx={{
            fontWeight: "bold",
            lineHeight: 1.2,
            fontSize: isSmall ? "0.65rem" : "0.75rem",
          }}
        >
          {booking.timeSlot.startTime.substring(0, 5)} -{" "}
          {booking.customer.fullName}
        </Typography>

        {/* Employee Name - Prominent Display */}
        {booking.bookingEmployees && booking.bookingEmployees.length > 0 && (
          <Box
            sx={{
              mt: 0.5,
              mb: 0.2,
              display: "flex",
              alignItems: "center",
              color: "secondary.main", // Use secondary color for prominence
            }}
          >
            <Person sx={{ fontSize: isSmall ? "0.7rem" : "0.8rem", mr: 0.5 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                fontSize: isSmall ? "0.65rem" : "0.75rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {booking.bookingEmployees
                .map((be) => be.employee.fullName)
                .join(", ")}
            </Typography>
          </Box>
        )}

        {!isSmall && (
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {booking.service.name}
          </Typography>
        )}
      </Paper>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    // Helper to check if a booking belongs to an employee
    const isBookingForEmployee = (booking: Booking, employeeId: string) => {
      return booking.bookingEmployees.some(
        (be) => be.employee.id === employeeId,
      );
    };

    return (
      <Box sx={{ mt: 2, height: "calc(100vh - 250px)", overflow: "auto" }}>
        {/* Employee Header */}
        <Box
          sx={{
            display: "flex",
            minWidth: "fit-content",
            borderBottom: "1px solid #ddd",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: 80,
              flexShrink: 0,
              p: 2,
              borderRight: "1px solid #ddd",
              bgcolor: "#f5f5f5",
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              Time
            </Typography>
          </Box>
          {employees.map((emp) => (
            <Box
              key={emp.id}
              sx={{
                width: 200,
                minWidth: 200,
                p: 1,
                borderRight: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                }}
              >
                {emp.fullName.charAt(0)}
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {emp.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {emp.role}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Time Grid */}
        <Box sx={{ minWidth: "fit-content" }}>
          {hours.map((hour) => {
            const slotBookings = getBookingsForSlot(currentDate, hour);

            return (
              <Box
                key={hour}
                sx={{
                  display: "flex",
                  borderBottom: "1px solid #f0f0f0",
                  minHeight: 100, // Taller cells for cards
                }}
              >
                {/* Time Column */}
                <Box
                  sx={{
                    width: 80,
                    flexShrink: 0,
                    borderRight: "1px solid #f0f0f0",
                    p: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </Typography>
                </Box>

                {/* Employee Columns */}
                {employees.map((emp) => {
                  const empBookings = slotBookings.filter((b) =>
                    isBookingForEmployee(b, emp.id),
                  );

                  return (
                    <Box
                      key={`${hour}-${emp.id}`}
                      sx={{
                        width: 200,
                        minWidth: 200,
                        p: 0.5,
                        borderRight: "1px solid #f0f0f0",
                        position: "relative",
                        "&:hover": { backgroundColor: "#fafafa" },
                      }}
                      onClick={() => {
                        // Find slot ID for this hour
                        const hourStr = hour.toString().padStart(2, "0");
                        // This is a bit tricky since we don't have all slots pre-loaded for the UI logic here
                        // but we can try to find a booking in this slot and use its slot ID,
                        // or just pass the hour and let the dialog handle it.
                        // However, the dialog expects timeSlotId.

                        // Let's check if any booking exists in this hour to get the slotId
                        const slotBooking = slotBookings[0];
                        if (slotBooking) {
                          setPresetSlotId(slotBooking.timeSlot.id);
                        } else {
                          setPresetSlotId(undefined); // Will let user pick
                        }
                        setPresetStartTime(hourStr);
                        setPresetEmployeeId(emp.id);
                        setOpenCreateDialog(true);
                      }}
                    >
                      {empBookings.map((b) => renderEventCard(b, true))}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf("week");
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, "day"),
    );
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <Box sx={{ mt: 2, height: "calc(100vh - 250px)", overflowY: "auto" }}>
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #ddd",
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: 60,
              flexShrink: 0,
              p: 1,
              borderRight: "1px solid #ddd",
              textAlign: "center",
            }}
          >
            <AccessTime fontSize="small" color="disabled" />
          </Box>
          {weekDays.map((date, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                textAlign: "center",
                p: 1,
                borderRight: index < 6 ? "1px solid #ddd" : "none",
                bgcolor: date.isSame(dayjs(), "day") ? "#e3f2fd" : "inherit",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color={date.isSame(dayjs(), "day") ? "primary" : "text.primary"}
              >
                {date.format("ddd")}
              </Typography>
              <Typography
                variant="caption"
                color={
                  date.isSame(dayjs(), "day") ? "primary" : "text.secondary"
                }
              >
                {date.format("DD/MM")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Time Slots */}
        {hours.map((hour) => (
          <Box
            key={hour}
            sx={{
              display: "flex",
              borderBottom: "1px solid #eee",
              minHeight: 60,
            }}
          >
            <Box
              sx={{
                width: 60,
                flexShrink: 0,
                p: 1,
                borderRight: "1px solid #eee",
                textAlign: "right",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {hour}:00
              </Typography>
            </Box>

            {weekDays.map((date, dayIndex) => {
              const slotBookings = getBookingsForSlot(date, hour);
              return (
                <Box
                  key={dayIndex}
                  sx={{
                    flex: 1,
                    p: 0.5,
                    borderRight: dayIndex < 6 ? "1px solid #eee" : "none",
                    position: "relative",
                    "&:hover": { bgcolor: "#fafafa" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const hourStr = hour.toString().padStart(2, "0");
                    setPresetStartTime(hourStr);
                    setCurrentDate(date);
                    setOpenCreateDialog(true);
                  }}
                >
                  {slotBookings.map((b) => (
                    <Box key={b.id} sx={{ mb: 0.5 }}>
                      {renderEventCard(b, true)}
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    );
  };

  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");

    // Grid generation logic
    const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday) - assuming vi locale might be different but dayjs handles it
    // In VI locale, week usually starts Monday (1).
    // Let's rely on standard grid filling.

    const daysArray = [];
    const prevMonthEnd = startOfMonth.subtract(1, "day");

    // Fill initial empty slots or previous month days
    // Adjust logic based on locale start of week.
    // dayjs.locale('vi') makes week start on Monday? Let's check visually or normalize.
    // Standardizing to start Monday for UI consistency if needed, but dayjs().day() returns 0 for Sunday.

    // Let's assume standard Monday start for Vietnam
    let paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    for (let i = 0; i < paddingDays; i++) {
      daysArray.push({
        date: startOfMonth.subtract(paddingDays - i, "day"),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= endOfMonth.date(); i++) {
      daysArray.push({
        date: startOfMonth.date(i),
        isCurrentMonth: true,
      });
    }

    // Fill remaining slots to make a full grid (optional)
    const totalSlots = Math.ceil(daysArray.length / 7) * 7;
    const remainingSlots = totalSlots - daysArray.length;

    for (let i = 1; i <= remainingSlots; i++) {
      daysArray.push({
        date: endOfMonth.add(i, "day"),
        isCurrentMonth: false,
      });
    }

    return (
      <Box sx={{ mt: 2 }}>
        {/* Month Header */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map(
            (day) => (
              <Grid
                item
                xs={12 / 7}
                key={day}
                sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {day}
                </Typography>
              </Grid>
            ),
          )}
        </Grid>

        {/* Days Grid */}
        <Grid
          container
          spacing={0}
          sx={{ borderTop: "1px solid #ddd", borderLeft: "1px solid #ddd" }}
        >
          {daysArray.map((item, idx) => {
            const dayBookings = getBookingsForDate(item.date);
            const isToday = item.date.isSame(dayjs(), "day");

            return (
              <Grid
                item
                xs={12 / 7}
                key={idx}
                sx={{
                  height: 120,
                  borderRight: "1px solid #ddd",
                  borderBottom: "1px solid #ddd",
                  bgcolor: isToday
                    ? "#fffde7"
                    : item.isCurrentMonth
                      ? "#fff"
                      : "#f9f9f9",
                  p: 0.5,
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCurrentDate(item.date);
                  setOpenCreateDialog(true);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={isToday ? "bold" : "normal"}
                    color={
                      item.isCurrentMonth ? "text.primary" : "text.disabled"
                    }
                  >
                    {item.date.date()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    overflowY: "auto",
                    maxHeight: 90,
                  }}
                >
                  {dayBookings.slice(0, 3).map((b) => (
                    <Paper
                      key={b.id}
                      elevation={0}
                      onClick={(e) => handleBookingClick(b, e)}
                      sx={{
                        p: 0.5,
                        fontSize: "0.65rem",
                        bgcolor: STATUS_COLORS[b.status]?.bg || "#eee",
                        color: STATUS_COLORS[b.status]?.text || "#333",
                        cursor: "pointer",
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {b.timeSlot.startTime.substring(0, 5)}{" "}
                      {b.customer.fullName}
                      {b.bookingEmployees?.length ? (
                        <Typography
                          variant="inherit"
                          component="span"
                          sx={{
                            fontWeight: "bold",
                            display: "block",
                            color: "secondary.dark",
                          }}
                        >
                          (
                          {b.bookingEmployees
                            .map((e) => e.employee.fullName)
                            .join(", ")}
                          )
                        </Typography>
                      ) : null}
                    </Paper>
                  ))}
                  {dayBookings.length > 3 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                      sx={{ display: "block" }}
                    >
                      +{dayBookings.length - 3} nữa
                    </Typography>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Lịch Hẹn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý lịch đặt hẹn của khách hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Event />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Tạo Booking Mới
        </Button>
      </Box>

      {/* Main Calendar Area */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f5f5f5",
              borderRadius: 3,
              p: 0.5,
            }}
          >
            <IconButton onClick={handlePrev} size="small">
              <ChevronLeft />
            </IconButton>
            <Button
              onClick={handleToday}
              size="small"
              variant="text"
              sx={{ mx: 1, minWidth: "auto", fontWeight: "bold" }}
            >
              Hôm nay
            </Button>
            <IconButton onClick={handleNext} size="small">
              <ChevronRight />
            </IconButton>
          </Box>

          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{
              textTransform: "capitalize",
              minWidth: 200,
              textAlign: "center",
            }}
          >
            {currentDate.format("MMMM, YYYY")}
          </Typography>

          <Paper elevation={0} sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Tabs
              value={view}
              onChange={(_, v) => setView(v)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ minHeight: 40 }}
            >
              <Tab
                label="Ngày"
                value="day"
                icon={<ViewDay fontSize="small" />}
                iconPosition="start"
                sx={{ minHeight: 40, textTransform: "none" }}
              />
              <Tab
                label="Tuần"
                value="week"
                icon={<ViewWeek fontSize="small" />}
                iconPosition="start"
                sx={{ minHeight: 40, textTransform: "none" }}
              />
              <Tab
                label="Tháng"
                value="month"
                icon={<CalendarMonth fontSize="small" />}
                iconPosition="start"
                sx={{ minHeight: 40, textTransform: "none" }}
              />
            </Tabs>
          </Paper>
        </Box>

        <Divider />

        {/* Views */}
        {view === "day" && renderDayView()}
        {view === "week" && renderWeekView()}
        {view === "month" && renderMonthView()}
      </Paper>

      {/* Booking Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6">Chi tiết Booking</Typography>
          {selectedBooking && selectedBooking.status && (
            <Chip
              label={
                STATUS_LABELS[selectedBooking.status] || selectedBooking.status
              }
              sx={{
                bgcolor: STATUS_COLORS[selectedBooking.status]?.bg,
                color: STATUS_COLORS[selectedBooking.status]?.text,
                fontWeight: "bold",
                border: `1px solid ${STATUS_COLORS[selectedBooking.status]?.border}`,
              }}
            />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedBooking && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {/* Customer Info */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Person color="action" fontSize="medium" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedBooking.customer.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBooking.customer.phone}
                  </Typography>
                  {selectedBooking.customer.email && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedBooking.customer.email}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider
                variant="inset"
                component="li"
                sx={{ listStyle: "none" }}
              />

              {/* Time & Service Info */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <AccessTime color="action" fontSize="medium" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body1">
                    {dayjs(selectedBooking.bookingDate).format(
                      "dddd, DD/MM/YYYY",
                    )}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {selectedBooking.timeSlot.startTime.substring(0, 5)} -{" "}
                    {selectedBooking.timeSlot.endTime.substring(0, 5)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Event color="action" fontSize="medium" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedBooking.service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBooking.service.category}
                  </Typography>
                  {selectedBooking.service.steps && (
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{
                        mt: 0.5,
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    >
                      Các bước:{" "}
                      {Array.isArray(selectedBooking.service.steps)
                        ? selectedBooking.service.steps.join(" • ")
                        : selectedBooking.service.steps}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Price & Payment */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <AttachMoney
                  color="action"
                  fontSize="medium"
                  sx={{ mt: 0.5 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="bold" color="error">
                    {Number(selectedBooking.totalPrice).toLocaleString()} đ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Thanh toán tại quầy
                  </Typography>
                </Box>
              </Box>

              <Divider
                variant="inset"
                component="li"
                sx={{ listStyle: "none" }}
              />

              {/* Employees */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  NHÂN VIÊN THỰC HIỆN
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedBooking.bookingEmployees &&
                  selectedBooking.bookingEmployees.length > 0 ? (
                    selectedBooking.bookingEmployees.map((be) => (
                      <Chip
                        key={be.id}
                        avatar={<Person />}
                        label={be.employee.fullName}
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" fontStyle="italic">
                      Chưa chỉ định nhân viên
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Notes */}
              {selectedBooking.notes && (
                <Box
                  sx={{
                    bgcolor: "#fffdeb",
                    p: 1.5,
                    borderRadius: 1,
                    border: "1px dashed #fdd835",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Notes fontSize="inherit" /> Ghi chú
                  </Typography>
                  <Typography variant="body2">
                    {selectedBooking.notes}
                  </Typography>
                </Box>
              )}

              {/* Status Update */}
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cập nhật trạng thái</InputLabel>
                  <Select
                    value={newStatus}
                    label="Cập nhật trạng thái"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="completed">Đã hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Đóng
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            disabled={!selectedBooking || selectedBooking.status === newStatus}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Booking Dialog */}
      <CreateBookingDialog
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
          setPresetSlotId(undefined);
          setPresetEmployeeId(undefined);
          setPresetStartTime(undefined);
        }}
        onSuccess={() => {
          setOpenCreateDialog(false);
          setPresetSlotId(undefined);
          setPresetEmployeeId(undefined);
          setPresetStartTime(undefined);
          fetchBookings();
        }}
        initialDate={currentDate.format("YYYY-MM-DD")}
        initialTimeSlotId={presetSlotId}
        initialEmployeeId={presetEmployeeId}
        initialStartTime={presetStartTime}
      />
    </Box>
  );
};

export default CalendarPage;
