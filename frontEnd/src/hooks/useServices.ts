// ==========================================
// Custom Hook for Services API
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import servicesApi from '../api/servicesApi';
import type { ApiResponse, Service } from '../api/types';

// Interface matching the component expectations (from spaServices.ts)
export interface ServiceItem {
  id: string;
  name: string;
  price: number | string;
  duration?: string;
  steps?: string[];
  steps_count?: number;
  price_range?: string;
  zone?: string;
  single_price?: number;
  package_10_sessions?: number;
  category: string;
}

export interface ServicesByCategory {
  goi_dau_duong_sinh: ServiceItem[];
  design: ServiceItem[];
  eye_lash: ServiceItem[];
  cham_soc_da: ServiceItem[];
  dich_vu_da: ServiceItem[];
  dich_vu_le: ServiceItem[];
  triet_long: ServiceItem[];
}

// Transform API Service to ServiceItem
const transformService = (service: Service): ServiceItem => {
  const item: ServiceItem = {
    id: service.id,
    name: service.name,
    price: service.singlePrice || 0,
    category: service.category,
  };

  // Map price based on priceType
  if (service.priceType === 'single' && service.singlePrice) {
    item.price = service.singlePrice;
  } else if (service.priceType === 'range' && service.priceRangeMin && service.priceRangeMax) {
    item.price_range = `${service.priceRangeMin.toLocaleString('vi-VN')} - ${service.priceRangeMax.toLocaleString('vi-VN')} VNĐ`;
    item.price = service.priceRangeMin;
  } else if (service.priceType === 'package') {
    item.single_price = service.singlePrice;
    item.package_10_sessions = service.packagePrice;
    item.price = service.singlePrice || 0;
  }

  // Map optional fields
  if (service.duration) item.duration = service.duration;
  if (service.steps) item.steps = service.steps;
  if (service.stepsCount) item.steps_count = service.stepsCount;
  if (service.zone) {
    item.zone = service.zone;
    item.name = service.zone; // For triệt lông, zone is displayed as name
  }

  return item;
};

// Group services by category
const groupServicesByCategory = (services: Service[]): ServicesByCategory => {
  const result: ServicesByCategory = {
    goi_dau_duong_sinh: [],
    design: [],
    eye_lash: [],
    cham_soc_da: [],
    dich_vu_da: [],
    dich_vu_le: [],
    triet_long: [],
  };

  services.forEach((service) => {
    if (!service.isActive) return;

    const item = transformService(service);
    const category = service.category?.toLowerCase() ?? '';

    if (category.includes('gội đầu') || category.includes('goi dau')) {
      result.goi_dau_duong_sinh.push(item);
    } else if (category === 'design') {
      result.design.push(item);
    } else if (category === 'eye lash') {
      result.eye_lash.push(item);
    } else if (category === 'chăm sóc da' || category.includes('skin')) {
      result.cham_soc_da.push(item);
    } else if (category === 'dịch vụ da') {
      result.dich_vu_da.push(item);
    } else if (category === 'dịch vụ lẻ') {
      result.dich_vu_le.push(item);
    } else if (category.includes('triệt lông') || category.includes('hair removal')) {
      result.triet_long.push(item);
    }
  });

  return result;
};

export interface UseServicesResult {
  services: Service[];
  servicesByCategory: ServicesByCategory;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServices(): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Service[]> = await servicesApi.getAll({
        active: true,
      });
      setServices(response.data || []);
    } catch (err) {
      setError('Không thể tải danh sách dịch vụ');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const servicesByCategory = groupServicesByCategory(services);

  return {
    services,
    servicesByCategory,
    loading,
    error,
    refetch: fetchServices,
  };
}

// Hook to get all services as flat list (for booking modal)
export interface FlatServiceItem {
  id: string;
  name: string;
  category: string;
  price?: number;
  price_range?: string;
}

export function useServicesFlat(): {
  services: FlatServiceItem[];
  loading: boolean;
  error: string | null;
} {
  const { services, loading, error } = useServices();

  const flatServices: FlatServiceItem[] = services
    .filter((s) => s.isActive)
    .map((service) => ({
      id: service.id,
      name: service.zone
        ? `${service.zone}`
        : service.duration
          ? `${service.name} - ${service.duration}`
          : service.name,
      category: service.category,
      price: Number(service.singlePrice || service.priceRangeMin || service.packagePrice || 0),
      price_range:
        service.priceType === 'range' && service.priceRangeMin && service.priceRangeMax
          ? `${Number(service.priceRangeMin).toLocaleString('vi-VN')} - ${Number(
              service.priceRangeMax,
            ).toLocaleString('vi-VN')} VNĐ`
          : undefined,
    }));

  return { services: flatServices, loading, error };
}

export default useServices;
