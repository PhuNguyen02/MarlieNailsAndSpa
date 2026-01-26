export interface Staff {
  id: string
  name: string
  position: string
  avatar?: string
  specialties: string[] // Các dịch vụ họ có thể làm
  workingHours: {
    start: string // "09:00"
    end: string // "18:00"
  }
  status: 'available' | 'busy' | 'off' // Trạng thái hiện tại
}

export interface StaffSchedule {
  staffId: string
  date: string // YYYY-MM-DD
  bookedSlots: string[] // Array of time slots like ["09:00", "10:30", "14:00"]
}

export const staffMembers: Staff[] = [
  {
    id: 'staff-1',
    name: 'Nguyễn Thị Lan',
    position: 'Chuyên viên Gội Đầu & Massage',
    specialties: ['Gội Đầu Dưỡng Sinh', 'Massage Body'],
    workingHours: { start: '09:00', end: '18:00' },
    status: 'available',
  },
  {
    id: 'staff-2',
    name: 'Trần Thị Mai',
    position: 'Chuyên viên Chăm Sóc Da',
    specialties: ['Chăm Sóc Da', 'Gội Đầu Dưỡng Sinh'],
    workingHours: { start: '09:00', end: '18:00' },
    status: 'available',
  },
  {
    id: 'staff-3',
    name: 'Lê Thị Hoa',
    position: 'Chuyên viên Nail',
    specialties: ['Dịch Vụ Nail'],
    workingHours: { start: '10:00', end: '19:00' },
    status: 'available',
  },
  {
    id: 'staff-4',
    name: 'Phạm Thị Linh',
    position: 'Chuyên viên Triệt Lông',
    specialties: ['Triệt Lông', 'Chăm Sóc Da'],
    workingHours: { start: '09:00', end: '17:00' },
    status: 'busy',
  },
  {
    id: 'staff-5',
    name: 'Hoàng Thị Nga',
    position: 'Chuyên viên Tổng Hợp',
    specialties: ['Gội Đầu Dưỡng Sinh', 'Massage Body', 'Chăm Sóc Da'],
    workingHours: { start: '09:00', end: '18:00' },
    status: 'available',
  },
]

// Mock schedule data - trong thực tế sẽ lấy từ API
export const mockSchedules: StaffSchedule[] = [
  {
    staffId: 'staff-1',
    date: new Date().toISOString().split('T')[0], // Today
    bookedSlots: ['10:00', '11:00', '14:00', '15:30'],
  },
  {
    staffId: 'staff-2',
    date: new Date().toISOString().split('T')[0],
    bookedSlots: ['09:30', '13:00', '16:00'],
  },
  {
    staffId: 'staff-3',
    date: new Date().toISOString().split('T')[0],
    bookedSlots: ['11:00', '14:30', '17:00'],
  },
  {
    staffId: 'staff-4',
    date: new Date().toISOString().split('T')[0],
    bookedSlots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'],
  },
]

// Helper function to get available staff for a service
export const getAvailableStaffForService = (serviceCategory: string): Staff[] => {
  return staffMembers.filter(
    (staff) =>
      staff.specialties.some((specialty) => serviceCategory.includes(specialty)) &&
      staff.status === 'available'
  )
}

// Helper function to get booked slots for a staff on a specific date
export const getBookedSlots = (staffId: string, date: string): string[] => {
  const schedule = mockSchedules.find(
    (s) => s.staffId === staffId && s.date === date
  )
  return schedule?.bookedSlots || []
}

// Generate time slots (30-minute intervals)
export const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = []
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let currentHour = startHour
  let currentMin = startMin

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
    slots.push(timeString)

    currentMin += 30
    if (currentMin >= 60) {
      currentMin = 0
      currentHour += 1
    }
  }

  return slots
}

