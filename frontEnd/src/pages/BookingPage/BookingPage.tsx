import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Person,
  CalendarMonth,
  ViewDay,
  ViewWeek,
  EventBusy,
  EventAvailable,
  Schedule,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';
import { apiClient, employeesApi } from '@/api';
import type { Booking, Employee } from '@/api/types';
import Header from '@/pages/HomePage/components/Header';
import BookingModal from '@/components/BookingModal';
import QuickBookingModal from '@/components/BookingModal/QuickBookingModal';
import { useBookingModal } from '@/hooks/useBookingModal';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.locale('vi');

// ============================================
// Simplified Booking Calendar Page (Public)
// Shows employee busy status + quick booking modal
// ============================================

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

interface EmployeeScheduleInfo {
  employeeId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  breakStartTime: string | null;
  breakEndTime: string | null;
  isDayOff: boolean;
}

const BookingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [view, setView] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSchedules, setEmployeeSchedules] = useState<EmployeeScheduleInfo[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const { isOpen, params, openModal, closeModal } = useBookingModal();

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const result = await employeesApi.getAll({ isActive: true });
      if (result.status === 200) {
        setEmployees(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoadingCalendar(true);
    try {
      let params: any = {};

      if (view === 'day') {
        params.startDate = currentDate.format('YYYY-MM-DD');
      } else if (view === 'week') {
        params.startDate = currentDate.startOf('week').format('YYYY-MM-DD');
        params.endDate = currentDate.endOf('week').format('YYYY-MM-DD');
      }

      const result: any = await apiClient.get('/bookings', { params });

      if (result.status === 200) {
        setBookings(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoadingCalendar(false);
    }
  }, [currentDate, view]);

  useEffect(() => {
    fetchEmployees();
    fetchEmployeeSchedules();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const fetchEmployeeSchedules = async () => {
    try {
      const result: any = await apiClient.get('/bookings/employee-schedules');
      if (result.status === 200) {
        // API trả về nested: [{ employee: { id, ... }, schedules: [...] }]
        // Flatten thành flat array với employeeId
        const flat: EmployeeScheduleInfo[] = [];
        (result.data || []).forEach((item: any) => {
          const empId = item.employee?.id;
          if (!empId) return;
          (item.schedules || []).forEach((s: any) => {
            flat.push({
              employeeId: empId,
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              breakStartTime: s.breakStartTime,
              breakEndTime: s.breakEndTime,
              isDayOff: s.isDayOff,
            });
          });
        });
        console.log('Flattened Schedules:', flat); // DEBUG LOG
        setEmployeeSchedules(flat);
      }
    } catch (err) {
      console.error('Failed to fetch employee schedules', err);
    }
  };

  // Kiểm tra nhân viên có làm việc vào giờ cụ thể không
  const isEmployeeWorkingAtHour = (
    employeeId: string,
    date: dayjs.Dayjs,
    hour: number,
  ): boolean => {
    const dayOfWeek = date.format('dddd').toLowerCase();
    const dayMap: Record<string, string> = {
      monday: 'monday',
      'thứ hai': 'monday',
      tuesday: 'tuesday',
      'thứ ba': 'tuesday',
      wednesday: 'wednesday',
      'thứ tư': 'wednesday',
      thursday: 'thursday',
      'thứ năm': 'thursday',
      friday: 'friday',
      'thứ sáu': 'friday',
      saturday: 'saturday',
      'thứ bảy': 'saturday',
      sunday: 'sunday',
      'chủ nhật': 'sunday',
    };
    const mappedDay = dayMap[dayOfWeek] || dayOfWeek;

    const schedule = employeeSchedules.find(
      (s) => s.employeeId === employeeId && s.dayOfWeek === mappedDay,
    );

    // console.log(`Checking ${employeeId} for ${mappedDay} (${dayOfWeek}):`, schedule); // DEBUG LOG checking

    if (!schedule || schedule.isDayOff) return false;

    // Handle time formats 'HH:mm' or 'HH:mm:ss'
    const cleanTime = (t: string | null) => (t ? t.split(':').slice(0, 2).join(':') : '00:00');

    const startHour = parseInt(cleanTime(schedule.startTime).split(':')[0] || '0');
    const endHour = parseInt(cleanTime(schedule.endTime).split(':')[0] || '0');

    if (hour < startHour || hour >= endHour) return false;

    if (schedule.breakStartTime && schedule.breakEndTime) {
      const breakStart = parseInt(cleanTime(schedule.breakStartTime).split(':')[0]);
      const breakEnd = parseInt(cleanTime(schedule.breakEndTime).split(':')[0]);
      if (hour >= breakStart && hour < breakEnd) return false;
    }

    return true;
  };

  // Lấy lịch làm việc cho ngày cụ thể
  const getEmployeeScheduleForDate = (
    employeeId: string,
    date: dayjs.Dayjs,
  ): EmployeeScheduleInfo | null => {
    const dayOfWeek = date.format('dddd').toLowerCase();
    const dayMap: Record<string, string> = {
      monday: 'monday',
      'thứ hai': 'monday',
      tuesday: 'tuesday',
      'thứ ba': 'tuesday',
      wednesday: 'wednesday',
      'thứ tư': 'wednesday',
      thursday: 'thursday',
      'thứ năm': 'thursday',
      friday: 'friday',
      'thứ sáu': 'friday',
      saturday: 'saturday',
      'thứ bảy': 'saturday',
      sunday: 'sunday',
      'chủ nhật': 'sunday',
    };
    const mappedDay = dayMap[dayOfWeek] || dayOfWeek;
    return (
      employeeSchedules.find((s) => s.employeeId === employeeId && s.dayOfWeek === mappedDay) ||
      null
    );
  };

  // Navigation
  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, view));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, view));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // Helper: check if employee is busy at a given slot
  const isEmployeeBusyAtSlot = (employeeId: string, date: dayjs.Dayjs, hour: number): boolean => {
    return bookings.some((b) => {
      const isSameDate = dayjs(b.bookingDate).isSame(date, 'day');
      const bHour = parseInt(b.timeSlot.startTime.split(':')[0]);
      const isBookedByEmployee = b.bookingEmployees?.some((be) => be.employee.id === employeeId);
      return isSameDate && bHour === hour && isBookedByEmployee && b.status !== 'cancelled';
    });
  };

  // Count busy employees at a given slot
  const getBusyCountForSlot = (date: dayjs.Dayjs, hour: number): number => {
    return employees.filter((emp) => isEmployeeBusyAtSlot(emp.id, date, hour)).length;
  };

  // ============================================
  // DAY VIEW - Shows employee columns with busy markers
  // ============================================
  const renderDayView = () => {
    return (
      <Box
        sx={{
          mt: 1,
          height: isMobile ? 'auto' : 'calc(100vh - 340px)',
          overflow: 'auto',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Employee Header */}
        <Box
          sx={{
            display: 'flex',
            minWidth: 'fit-content',
            borderBottom: '2px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 10,
          }}
        >
          {/* Time column header */}
          <Box
            sx={{
              width: isMobile ? 55 : 70,
              flexShrink: 0,
              p: 1.5,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: '#faf7f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Schedule sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          </Box>

          {/* Employee Headers */}
          {employees.map((emp) => {
            const schedule = getEmployeeScheduleForDate(emp.id, currentDate);
            const isOff = !schedule || schedule.isDayOff;
            const workTime =
              schedule && !schedule.isDayOff
                ? `${schedule.startTime?.substring(0, 5)} - ${schedule.endTime?.substring(0, 5)}`
                : 'Nghỉ';

            return (
              <Box
                key={emp.id}
                sx={{
                  width: isMobile ? 80 : isTablet ? 120 : 160,
                  minWidth: isMobile ? 80 : isTablet ? 120 : 160,
                  p: isMobile ? 0.5 : 1,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: isOff ? '#fff3e0' : '#faf7f5',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 28 : 36,
                    height: isMobile ? 28 : 36,
                    borderRadius: '50%',
                    background: isOff
                      ? 'linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%)'
                      : 'linear-gradient(135deg, #d4af8c 0%, #c49b7a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOff ? '#e65100' : '#fff',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.7rem' : '0.85rem',
                    boxShadow: isOff
                      ? '0 2px 8px rgba(255, 152, 0, 0.3)'
                      : '0 2px 8px rgba(196, 155, 122, 0.3)',
                  }}
                >
                  {emp.fullName.charAt(0)}
                </Box>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  noWrap
                  sx={{
                    maxWidth: '100%',
                    textAlign: 'center',
                    fontSize: isMobile ? '0.6rem' : '0.72rem',
                  }}
                >
                  {emp.fullName}
                </Typography>
                <Chip
                  label={isOff ? 'Nghỉ' : workTime}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    bgcolor: isOff ? 'rgba(230, 81, 0, 0.12)' : 'rgba(212, 175, 140, 0.15)',
                    color: isOff ? '#e65100' : '#8B6F47',
                    fontWeight: isOff ? 'bold' : 'normal',
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Time Grid */}
        <Box sx={{ minWidth: 'fit-content' }}>
          {HOURS.map((hour) => (
            <Box
              key={hour}
              sx={{
                display: 'flex',
                borderBottom: '1px solid',
                borderColor: 'divider',
                minHeight: isMobile ? 50 : 60,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(212, 175, 140, 0.04)',
                },
              }}
            >
              {/* Time Column */}
              <Box
                sx={{
                  width: isMobile ? 55 : 70,
                  flexShrink: 0,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#faf7f5',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="600"
                  sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </Typography>
              </Box>

              {/* Employee Columns */}
              {employees.map((emp) => {
                const isBusy = isEmployeeBusyAtSlot(emp.id, currentDate, hour);
                const isWorking = isEmployeeWorkingAtHour(emp.id, currentDate, hour);
                const isOff = !isWorking;

                return (
                  <Box
                    key={`${hour}-${emp.id}`}
                    sx={{
                      width: isMobile ? 80 : isTablet ? 120 : 160,
                      minWidth: isMobile ? 80 : isTablet ? 120 : 160,
                      p: 0.5,
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: isOff ? 'not-allowed' : isBusy ? 'default' : 'pointer',
                      bgcolor: isOff
                        ? '#f5f5f5'
                        : isBusy
                          ? 'rgba(244, 67, 54, 0.06)'
                          : 'transparent',
                      backgroundImage: isOff
                        ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)'
                        : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: isOff
                          ? '#f5f5f5'
                          : isBusy
                            ? 'rgba(244, 67, 54, 0.08)'
                            : 'rgba(76, 175, 80, 0.06)',
                      },
                    }}
                    onClick={() => {
                      if (!isOff && !isBusy) {
                        openModal({
                          employeeId: emp.id,
                          date: currentDate.format('YYYY-MM-DD'),
                          timeLabel: `${hour.toString().padStart(2, '0')}:00`,
                        });
                      }
                    }}
                  >
                    {isOff ? (
                      <Typography
                        variant="caption"
                        sx={{ color: '#bdbdbd', fontStyle: 'italic', fontSize: '0.6rem' }}
                      >
                        Nghỉ
                      </Typography>
                    ) : isBusy ? (
                      <Fade in>
                        <Tooltip title="Nhân viên đang bận" arrow>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              px: 1,
                              py: 0.4,
                              borderRadius: 1.5,
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                              border: '1px solid rgba(244, 67, 54, 0.25)',
                            }}
                          >
                            <EventBusy
                              sx={{
                                fontSize: isMobile ? '0.8rem' : '1rem',
                                color: '#d32f2f',
                              }}
                            />
                            {!isMobile && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#d32f2f',
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                }}
                              >
                                Bận
                              </Typography>
                            )}
                          </Box>
                        </Tooltip>
                      </Fade>
                    ) : (
                      <Tooltip title="Nhấn để đặt lịch" arrow>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.4,
                            borderRadius: 1.5,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '.MuiBox-root:hover > &': {
                              opacity: 1,
                            },
                          }}
                        >
                          <EventAvailable
                            sx={{
                              fontSize: isMobile ? '0.8rem' : '1rem',
                              color: '#2e7d32',
                            }}
                          />
                          {!isMobile && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#2e7d32',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                              }}
                            >
                              Trống
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // ============================================
  // WEEK VIEW - Shows a mini-overview of busy/free per day
  // ============================================
  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf('week');
    const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

    return (
      <Box
        sx={{
          mt: 1,
          height: isMobile ? 'auto' : 'calc(100vh - 340px)',
          overflowY: 'auto',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: 'flex',
            borderBottom: '2px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: isMobile ? 55 : 70,
              flexShrink: 0,
              p: 1,
              borderRight: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: '#faf7f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Schedule sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          </Box>
          {weekDays.map((date, index) => {
            const isToday = date.isSame(dayjs(), 'day');
            return (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  p: isMobile ? 0.5 : 1,
                  borderRight: index < 6 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  bgcolor: isToday ? 'rgba(212, 175, 140, 0.12)' : '#faf7f5',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(212, 175, 140, 0.08)',
                  },
                }}
                onClick={() => {
                  setCurrentDate(date);
                  setView('day');
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color={isToday ? 'primary' : 'text.primary'}
                  sx={{ fontSize: isMobile ? '0.65rem' : '0.8rem' }}
                >
                  {date.format('ddd')}
                </Typography>
                <Typography variant="caption" color={isToday ? 'primary' : 'text.secondary'}>
                  {date.format('DD/MM')}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Time Slots */}
        {HOURS.map((hour) => (
          <Box
            key={hour}
            sx={{
              display: 'flex',
              borderBottom: '1px solid',
              borderColor: 'divider',
              minHeight: isMobile ? 40 : 50,
            }}
          >
            <Box
              sx={{
                width: isMobile ? 55 : 70,
                flexShrink: 0,
                p: 0.5,
                borderRight: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#faf7f5',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
                sx={{ fontSize: isMobile ? '0.6rem' : '0.72rem' }}
              >
                {`${hour.toString().padStart(2, '0')}:00`}
              </Typography>
            </Box>

            {weekDays.map((date, dayIndex) => {
              const busyCount = getBusyCountForSlot(date, hour);
              const totalEmp = employees.length;
              const busyRatio = totalEmp > 0 ? busyCount / totalEmp : 0;

              return (
                <Box
                  key={dayIndex}
                  sx={{
                    flex: 1,
                    p: 0.5,
                    borderRight: dayIndex < 6 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor:
                      busyRatio === 1
                        ? 'rgba(244, 67, 54, 0.06)'
                        : busyRatio > 0
                          ? 'rgba(255, 152, 0, 0.04)'
                          : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(212, 175, 140, 0.08)',
                    },
                  }}
                  onClick={() => {
                    setCurrentDate(date);
                    setView('day');
                  }}
                >
                  {busyCount > 0 ? (
                    <Tooltip title={`${busyCount}/${totalEmp} nhân viên đang bận`} arrow>
                      <Chip
                        icon={
                          <Person
                            sx={{
                              fontSize: '0.7rem !important',
                            }}
                          />
                        }
                        label={`${busyCount}/${totalEmp}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          bgcolor:
                            busyRatio === 1 ? 'rgba(244, 67, 54, 0.12)' : 'rgba(255, 152, 0, 0.12)',
                          color: busyRatio === 1 ? '#d32f2f' : '#e65100',
                          border: 'none',
                          '& .MuiChip-icon': {
                            color: busyRatio === 1 ? '#d32f2f' : '#e65100',
                          },
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Box
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '.MuiBox-root:hover > &': { opacity: 0.6 },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#2e7d32',
                          fontSize: '0.55rem',
                          fontWeight: 500,
                        }}
                      >
                        Trống
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    );
  };

  // ============================================
  // Legend
  // ============================================
  const renderLegend = () => (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mt: 1.5,
        mb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: 0.5,
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.25)',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Đang bận
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: 0.5,
            bgcolor: 'rgba(76, 175, 80, 0.08)',
            border: '1px solid rgba(76, 175, 80, 0.25)',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Còn trống
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: 0.5,
            bgcolor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Nghỉ
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fdfbf9',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          pt: { xs: 12, md: 14 },
          pb: 6,
        }}
      >
        {/* Page Title & CTA */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#3E2723',
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Đặt Lịch Hẹn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Xem lịch trống của nhân viên và đặt lịch ngay
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarMonth />}
            onClick={() => openModal()}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #d4af8c 0%, #c49b7a 100%)',
              boxShadow: '0 4px 16px rgba(196, 155, 122, 0.4)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #c49b7a 0%, #b08968 100%)',
                boxShadow: '0 6px 20px rgba(196, 155, 122, 0.5)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Đặt Lịch Ngay
          </Button>
        </Box>

        {/* Calendar Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, md: 2.5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: '#fff',
          }}
        >
          {/* Calendar Toolbar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 1,
            }}
          >
            {/* Navigation */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#faf7f5',
                borderRadius: 3,
                p: 0.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <IconButton onClick={handlePrev} size="small">
                <ChevronLeft />
              </IconButton>
              <Button
                onClick={handleToday}
                size="small"
                variant="text"
                sx={{
                  mx: 0.5,
                  minWidth: 'auto',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  color: '#8B6F47',
                }}
              >
                Hôm nay
              </Button>
              <IconButton onClick={handleNext} size="small">
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Current Date */}
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                textTransform: 'capitalize',
                color: '#3E2723',
                fontFamily: '"Playfair Display", serif',
                fontSize: { xs: '0.95rem', md: '1.15rem' },
              }}
            >
              {view === 'day'
                ? currentDate.format('dddd, DD MMMM YYYY')
                : `${currentDate.startOf('week').format('DD/MM')} - ${currentDate.endOf('week').format('DD/MM/YYYY')}`}
            </Typography>

            {/* View Tabs */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#faf7f5',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Tabs
                value={view}
                onChange={(_, v) => setView(v)}
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  },
                  '& .MuiTabs-indicator': {
                    bgcolor: '#d4af8c',
                  },
                }}
              >
                <Tab
                  label="Ngày"
                  value="day"
                  icon={<ViewDay sx={{ fontSize: '1rem' }} />}
                  iconPosition="start"
                />
                <Tab
                  label="Tuần"
                  value="week"
                  icon={<ViewWeek sx={{ fontSize: '1rem' }} />}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>
          </Box>

          <Divider sx={{ mb: 0.5 }} />

          {/* Legend */}
          {renderLegend()}

          {/* Loading State */}
          {loadingCalendar ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 10,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '3px solid rgba(212, 175, 140, 0.2)',
                    borderTopColor: '#d4af8c',
                    animation: 'spin 1s linear infinite',
                    mx: 'auto',
                    mb: 2,
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Đang tải lịch...
                </Typography>
              </Box>
            </Box>
          ) : employees.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Person sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Chưa có nhân viên nào
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Vui lòng liên hệ để biết thêm thông tin
              </Typography>
            </Box>
          ) : (
            <>
              {view === 'day' && renderDayView()}
              {view === 'week' && renderWeekView()}
            </>
          )}
        </Paper>

        {/* Info Section */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            background:
              'linear-gradient(135deg, rgba(212, 175, 140, 0.08) 0%, rgba(196, 155, 122, 0.04) 100%)',
            border: '1px solid rgba(212, 175, 140, 0.2)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#3E2723',
              mb: 1,
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Hướng dẫn đặt lịch
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Xem lịch trống/bận của từng nhân viên trên lịch
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Nhấn vào ô trống trên lịch hoặc nút <strong>"Đặt Lịch Ngay"</strong> để mở form đặt
              lịch
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Ở chế độ xem tuần, nhấn vào ngày để chuyển sang chế độ xem ngày
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Điền đầy đủ thông tin: chọn dịch vụ, nhân viên, ngày và giờ để hoàn tất đặt lịch
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Booking Modal Logic */}
      {params.employeeId ? (
        <QuickBookingModal
          open={isOpen}
          onClose={closeModal}
          params={params}
          onSwitchToRegular={() => openModal({ serviceId: params.serviceId })}
        />
      ) : (
        <BookingModal open={isOpen} onClose={closeModal} initialService={params.serviceId} />
      )}
    </Box>
  );
};

export default BookingPage;
