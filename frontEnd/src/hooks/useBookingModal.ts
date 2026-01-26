import { useState } from 'react'

export const useBookingModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)

  const openModal = (serviceId?: string) => {
    setSelectedService(serviceId)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedService(undefined)
  }

  return {
    isOpen,
    selectedService,
    openModal,
    closeModal,
  }
}

