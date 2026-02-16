import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  alpha,
  TextField,
  FormControlLabel,
  Switch,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  CalendarMonthOutlined as CalendarIcon,
  SaveOutlined as SaveIcon,
  AccessTime as TimeIcon,
  EventBusyOutlined as OffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiClient } from '@/api';

// Mapping DayOfWeek BE -> FE
const DAYS_VI = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ Nhật',
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const STANDARD_SCHEDULES: Record<string, any> = {
  monday: { startTime: '09:00', endTime: '20:00', breakStartTime: '12:00', breakEndTime: '13:00' },
  tuesday: { startTime: '09:00', endTime: '20:00', breakStartTime: '12:00', breakEndTime: '13:00' },
  wednesday: {
    startTime: '09:00',
    endTime: '20:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  thursday: {
    startTime: '09:00',
    endTime: '20:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  friday: { startTime: '09:00', endTime: '20:00', breakStartTime: '12:00', breakEndTime: '13:00' },
  saturday: {
    startTime: '08:30',
    endTime: '21:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
  },
  sunday: { startTime: '08:30', endTime: '21:00', breakStartTime: '12:00', breakEndTime: '13:00' },
};

const ShiftManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response: any = await apiClient.get('/admin/employee-schedules');
      if (response.status === 200) {
        setData(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenEdit = (empData: any) => {
    setSelectedStaff({
      ...empData,
      // Đảm bảo schedules có đủ 7 ngày nếu BE thiếu
      schedules: DAY_ORDER.map((day) => {
        const found = empData.schedules.find((s: any) => s.dayOfWeek === day);
        return (
          found || {
            dayOfWeek: day,
            ...STANDARD_SCHEDULES[day],
            isDayOff: true,
          }
        );
      }),
    });
    setOpenDialog(true);
  };

  const handleUpdateSchedule = (dayIndex: number, field: string, value: any) => {
    const newSchedules = [...selectedStaff.schedules];
    newSchedules[dayIndex] = { ...newSchedules[dayIndex], [field]: value };
    setSelectedStaff({ ...selectedStaff, schedules: newSchedules });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      // Helper: cắt time từ HH:mm:ss về HH:mm
      const toHHmm = (time: string | null) => (time ? time.substring(0, 5) : undefined);

      const payload = {
        employeeId: selectedStaff.employee.id,
        schedules: selectedStaff.schedules.map((s: any) => {
          const defaults = STANDARD_SCHEDULES[s.dayOfWeek];
          return {
            dayOfWeek: s.dayOfWeek,
            startTime: s.isDayOff ? '00:00' : toHHmm(s.startTime) || defaults.startTime,
            endTime: s.isDayOff ? '00:00' : toHHmm(s.endTime) || defaults.endTime,
            breakStartTime: toHHmm(s.breakStartTime) || defaults.breakStartTime,
            breakEndTime: toHHmm(s.breakEndTime) || defaults.breakEndTime,
            isDayOff: s.isDayOff,
            note: s.note,
          };
        }),
      };

      const result: any = await apiClient.post('/admin/employee-schedules/bulk', payload);
      if (result.status === 200) {
        setOpenDialog(false);
        fetchSchedules();
      }
    } catch (err) {
      console.error('Failed to save schedule', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            Lịch Làm Việc Định Kỳ
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Quản lý lịch chuẩn hàng tuần và giờ nghỉ của nhân viên Marlie Spa.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSchedules}
          sx={{ borderRadius: '12px' }}
        >
          Làm mới
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 220 }}>Nhân Viên</TableCell>
              {DAY_ORDER.map((day) => (
                <TableCell key={day} align="center" sx={{ fontWeight: 700 }}>
                  {DAYS_VI[day as keyof typeof DAYS_VI]}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.employee.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 'bold',
                        width: 36,
                        height: 36,
                      }}
                    >
                      {item.employee.fullName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.employee.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.employee.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                {DAY_ORDER.map((day) => {
                  const schedule = item.schedules.find((s: any) => s.dayOfWeek === day);
                  return (
                    <TableCell key={day} align="center">
                      {schedule?.isDayOff ? (
                        <Chip
                          label="Nghỉ"
                          size="small"
                          variant="outlined"
                          sx={{ color: '#94a3b8' }}
                        />
                      ) : (
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                            {schedule?.startTime.substring(0, 5)} -{' '}
                            {schedule?.endTime.substring(0, 5)}
                          </Typography>
                          {schedule?.breakStartTime && (
                            <Typography
                              variant="caption"
                              sx={{ color: '#64748b', fontSize: '0.7rem' }}
                            >
                              Nghỉ: {schedule.breakStartTime.substring(0, 5)}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      bgcolor: '#10b981',
                      '&:hover': { bgcolor: '#059669' },
                    }}
                    onClick={() => handleOpenEdit(item)}
                  >
                    Sửa lịch
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa lịch tuần */}
      <Dialog
        open={openDialog}
        onClose={() => !submitting && setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #f1f5f9' }}>
          Thiết lập lịch tuần: {selectedStaff?.employee.fullName}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {selectedStaff?.schedules.map((dayData: any, index: number) => (
              <Grid item xs={12} key={dayData.dayOfWeek}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: dayData.isDayOff ? '#f8fafc' : '#fff',
                    border: '1px solid',
                    borderColor: dayData.isDayOff ? 'transparent' : '#e2e8f0',
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={2}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 800, color: dayData.isDayOff ? '#94a3b8' : '#1e293b' }}
                      >
                        {DAYS_VI[dayData.dayOfWeek as keyof typeof DAYS_VI]}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!dayData.isDayOff}
                            onChange={(e) => {
                              const isWorking = e.target.checked;
                              const newSchedules = [...selectedStaff.schedules];
                              const day = newSchedules[index].dayOfWeek;

                              if (isWorking) {
                                // Nếu bật làm việc, tự điền giờ chuẩn nếu đang trống hoặc là 00:00
                                const current = newSchedules[index];
                                const defaults = STANDARD_SCHEDULES[day];

                                newSchedules[index] = {
                                  ...current,
                                  isDayOff: false,
                                  startTime: defaults.startTime,
                                  endTime: defaults.endTime,
                                  breakStartTime: defaults.breakStartTime,
                                  breakEndTime: defaults.breakEndTime,
                                };
                              } else {
                                newSchedules[index] = { ...newSchedules[index], isDayOff: true };
                              }

                              setSelectedStaff({ ...selectedStaff, schedules: newSchedules });
                            }}
                            color="success"
                          />
                        }
                        label={!dayData.isDayOff ? 'Làm việc' : 'Nghỉ'}
                      />
                    </Grid>

                    {!dayData.isDayOff && (
                      <>
                        <Grid item xs={2}>
                          <TextField
                            label="Giờ vào"
                            type="time"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={
                              dayData.startTime || STANDARD_SCHEDULES[dayData.dayOfWeek].startTime
                            }
                            onChange={(e) =>
                              handleUpdateSchedule(index, 'startTime', e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Giờ ra"
                            type="time"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={dayData.endTime || STANDARD_SCHEDULES[dayData.dayOfWeek].endTime}
                            onChange={(e) => handleUpdateSchedule(index, 'endTime', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Nghỉ trưa (Từ)"
                            type="time"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={
                              dayData.breakStartTime ||
                              STANDARD_SCHEDULES[dayData.dayOfWeek].breakStartTime
                            }
                            onChange={(e) =>
                              handleUpdateSchedule(index, 'breakStartTime', e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Nghỉ trưa (Đến)"
                            type="time"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={
                              dayData.breakEndTime ||
                              STANDARD_SCHEDULES[dayData.dayOfWeek].breakEndTime
                            }
                            onChange={(e) =>
                              handleUpdateSchedule(index, 'breakEndTime', e.target.value)
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={submitting}
            sx={{
              borderRadius: '12px',
              px: 4,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            {submitting ? 'Đang lưu...' : 'Lưu lịch làm việc'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftManagementPage;
