export interface BookingItem {
  guestNumber: number;
  service: string;
  staff: string;
  date: string;
  time: string; // This is timeSlotId
  timeLabel?: string; // This is for display (e.g. "09:00")
  price?: number;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  numberOfGuests: string;
  bookings: BookingItem[];
  note: string;
}
