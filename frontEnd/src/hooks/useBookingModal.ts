import { useState } from 'react';

export interface BookingModalParams {
  serviceId?: string;
  employeeId?: string;
  date?: string;
  timeSlotId?: string;
  timeLabel?: string;
}

export const useBookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<BookingModalParams>({});

  const openModal = (newParams: BookingModalParams = {}) => {
    setParams(newParams);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setParams({});
  };

  return {
    isOpen,
    params,
    openModal,
    closeModal,
  };
};
