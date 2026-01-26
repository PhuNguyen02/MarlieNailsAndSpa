export interface SpaService {
  id: string
  name: string
  price: number | string
  duration?: string
  steps?: string[]
  steps_count?: number
  price_range?: string
  zone?: string
  single_price?: number
  package_10_sessions?: number
}

export interface ServiceCategory {
  name: string
  services: SpaService[]
}

export const spaServices = {
  goi_dau_duong_sinh: [
    {
      id: 'combo-1',
      name: 'Combo 1',
      price: 79000,
      duration: '35 phút',
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Gội 2 nước',
        'Ủ xả tóc (massage đầu)',
        'Massage CVG ngửa',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      id: 'combo-2',
      name: 'Combo 2',
      price: 179000,
      duration: '55 phút',
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Massage mặt nâng cơ',
        'Đắp mặt nạ',
        'Gội 2 nước',
        'Ủ xả tóc (massage đầu)',
        'Ngâm chảy tóc thảo dược',
        'Massage CVG tay',
        'Xông nền tai',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      id: 'combo-3',
      name: 'Combo 3',
      price: 229000,
      duration: '70 phút',
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Tẩy tế bào chết da mặt',
        'Massage mặt chuyên sâu',
        'Đắp mặt nạ',
        'Tẩy tế bào chết da đầu',
        'Massage CVG-tay-chân up',
        'Gội 2 nước',
        'Ủ xá tóc (massage đầu)',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
    {
      id: 'combo-4',
      name: 'Combo 4',
      price: 329000,
      duration: '90 phút',
      steps: [
        'Khai thông kinh lạc',
        'Tẩy trang rửa mặt',
        'Tẩy tế bào chết da mặt',
        'Tẩy tế bào chết da đầu',
        'Massage mặt chuyên sâu (đá ngọc thạch)',
        'Đắp mặt nạ',
        'Massage CVG-tay-chân up',
        'Gội 2 nước',
        'Ủ xá tóc (massage đầu)',
        'Rửa bọt tai (massage tai)',
        'Sấy tóc',
        'Máy massage chân',
      ],
    },
  ],
  nail: {
    gel_polish: [
      { id: 'nail-1', name: 'Cắt da tay chân', price: 50000 },
      { id: 'nail-2', name: 'Tháo sơn gel', price: 30000 },
      { id: 'nail-3', name: 'Sơn gel Hàn cao cấp', price: 50000 },
      { id: 'nail-4', name: 'Sơn gel thạch', price_range: '120.000 - 150.000' },
      { id: 'nail-5', name: 'Sơn mắt mèo (chưa gồm nền)', price: 1000000 },
    ],
    extensions: [
      { id: 'nail-ext-1', name: 'Tạo cầu móng Hàn Quốc', price: 50000 },
      { id: 'nail-ext-2', name: 'Úp móng xgel (bét)', price: 150000 },
      { id: 'nail-ext-3', name: 'Nối móng đắp bột', price: 180000 },
      { id: 'nail-ext-4', name: 'Nối móng đắp gel', price: 250000 },
    ],
  },
  cham_soc_da: [
    {
      id: 'skin-1',
      name: 'Lấy Nhân Mụn Cơ Bản',
      price: 200000,
      steps_count: 13,
    },
    {
      id: 'skin-2',
      name: 'Lấy Nhân Mụn Cấp Độ 2',
      price: 250000,
      steps_count: 14,
    },
    {
      id: 'skin-3',
      name: 'Thải Độc Da',
      price: 250000,
      steps_count: 12,
    },
    {
      id: 'skin-4',
      name: 'Cấy trắng NANO',
      price: 350000,
      steps_count: 13,
    },
    {
      id: 'skin-5',
      name: 'Thải Độc CO2',
      price: 450000,
      steps_count: 18,
    },
    {
      id: 'skin-6',
      name: 'PEEL DA',
      price: 590000,
      steps_count: 12,
    },
  ],
  triet_long: [
    {
      id: 'hair-1',
      zone: 'Nách',
      single_price: 129000,
      package_10_sessions: 899000,
    },
    {
      id: 'hair-2',
      zone: 'Bikini',
      single_price: 349000,
      package_10_sessions: 2799000,
    },
    {
      id: 'hair-3',
      zone: 'Full Body',
      single_price: 1799000,
      package_10_sessions: 13999000,
    },
  ],
  uu_dai_mua_5_tang_1: [
    { id: 'promo-1', name: 'Mặt nạ', price: 30000 },
    { id: 'promo-2', name: 'Massage body - 60 phút', price: 355000 },
    { id: 'promo-3', name: 'Tắm trắng máy hấp', price: 450000 },
  ],
}

export default spaServices

