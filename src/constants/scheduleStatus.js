export const getOptionScheduleStatus = (translation) => {
  return [
    { label: translation("scheduleStatus.unconfimred") , value: 0 },
    { label: translation("scheduleStatus.confirmed"), value: 10 },
    { label: translation("scheduleStatus.cancelled"), value: 20 },
    { label: translation("scheduleStatus.done"), value: 30 },
  ]
}

export const getOptionScheduleStatusState = (translation) => {
  return {
    0: translation("scheduleStatus.unconfimred"),
    10: translation("scheduleStatus.confirmed"),
    20: translation("scheduleStatus.cancelled"),
    30: translation("scheduleStatus.done")
  }
}

export const SCHEDULE_STATES = {
  unconfimred : 0,
  confirmed : 10,
  cancelled : 20 ,
  done : 30
}

export const VEHICLE_SUB_TYPE = [
  {
    label: 'Xe ô tô con',
    value: 1,
    vehicleType:1,
  },
  {
    label: 'Xe khách',
    value: 11,
    vehicleType:10,
  },
  {
    label: 'Xe tải',
    value: 12,
    vehicleType:10,
  },
  {
    label: 'Ô tô đầu kéo',
    value: 13,
    vehicleType:10,
  },
  {
    label: 'Rơ moóc và sơ mi rơ moóc',
    value: 20,
    vehicleType:20,
  },
  {
    label: 'Phương tiện khác',
    value: 10,
    vehicleType:10,
  },
  {
    label: 'Xe bán tải',
    value: 14,
    vehicleType:10,
  }
]

export const SCHEDULE_TYPE = [
  {
    label: 'Xe cũ (Đã từng đăng kiểm)',
    value: 1,
  },
  {
    label: 'Xe mới (Chưa đăng kiểm lần nào)',
    value: 2,
  },
]

export const PLATE_COLOR = [
  {
    label: 'Trắng',
    value: 1,
  },
  {
    label: 'Xanh',
    value: 2,
  },
  {
    label: 'Vàng',
    value: 3,
  },
  // {
  //   label: 'Đỏ',
  //   value: 4,
  // },
]

export const VEHICLE_SUB_CATEGORY = {
  CAR: 1, //- Ô tô con
  PASSENGER: 11, //- Ô tô khách
  TRUCKER: 12, //- Xe tải
  GROUP: 13, // đoàn oto
  ROMOOCL: 20, //- Romooc, sơmi romooc
  CAR_SPECIALIZED: 14, // xe bán tải
  ORTHER: 10 // phương tiện khác
}

export const VIHCLE_CATEGORY_OTO = [
  {
    label: 'Xe ô tô 4 chỗ',
    value: 1001,
    seat:4
  },
  {
    label: 'Xe ô tô 5 chỗ',
    value: 1002,
    seat:5
  },
  {
    label: 'Xe ô tô 6 chỗ',
    value: 1003,
    seat:6
  },
  {
    label: 'Xe ô tô 7 chỗ',
    value: 1004,
    seat:7
  },
  {
    label: 'Xe ô tô 8 chỗ',
    value: 1005,
    seat:8
  },
  {
    label: 'Xe ô tô 9 chỗ',
    value: 1006,
    seat:9
  }
]

export const VIHCLE_CATEGORY_BUS = [
  {
    label: 'Xe ô tô 10 chỗ',
    value: 1007,
    seat:10
  },
  {
    label: 'Xe ô tô 11 chỗ',
    value: 1008,
    seat:11
  },
  {
    label: 'Xe ô tô 12 chỗ',
    value: 1009,
    seat:12
  },
  {
    label: 'Xe ô tô 13 chỗ',
    value: 1010,
    seat:13
  },
  {
    label: 'Xe ô tô 14 chỗ',
    value: 1011,
    seat:14
  },
  {
    label: 'Xe ô tô 15 chỗ',
    value: 1012,
    seat:15
  },
  {
    label: 'Xe ô tô 16 chỗ',
    value: 1013,
    seat:16
  },
  {
    label: 'Xe ô tô 17 chỗ',
    value: 1014,
    seat:17
  },
  {
    label: 'Xe ô tô 18 chỗ',
    value: 1015,
    seat:18
  },
  {
    label: 'Xe ô tô 19 chỗ',
    value: 1016,
    seat:19
  },
  {
    label: 'Xe ô tô 20 chỗ',
    value: 1017,
    seat:20
  },
  {
    label: 'Xe ô tô 21 chỗ',
    value: 1018,
    seat:21
  },
  {
    label: 'Xe ô tô 22 chỗ',
    value: 1019,
    seat:22
  },
  {
    label: 'Xe ô tô 23 chỗ',
    value: 1020,
    seat:23
  },
  {
    label: 'Xe ô tô 24 chỗ',
    value: 1021,
    seat:24
  },
  {
    label: 'Xe ô tô 25 chỗ',
    value: 1022,
    seat:25
  },
  {
    label: 'Xe ô tô 29 chỗ',
    value: 1023,
    seat:29
  },
  {
    label: 'Xe ô tô 45 chỗ',
    value: 1024,
    seat:45
  },
  {
    label: 'Xe ô tô 52 chỗ',
    value: 1025,
    seat:52
  }
]

export const VIHCLE_CATEGORY_TRUCK = [
  {
    label: 'Xe tải dưới 1 tấn',
    value: 2002,
    maxWeight:999,
    minWeight:0
  },
  {
    label: 'Xe tải dưới 2 tấn',
    value: 2003,
    maxWeight:1999,
    minWeight:1000
  },
  {
    label: 'Xe tải dưới 3 tấn',
    value: 2004,
    maxWeight:2999,
    minWeight:2000
  },
  {
    label: 'Xe tải dưới 4 tấn',
    value: 2005,
    maxWeight:3999,
    minWeight:3000
  },
  {
    label: 'Xe tải dưới 5 tấn',
    value: 2006,
    maxWeight:4999,
    minWeight:4000
  },
  {
    label: 'Xe tải dưới 6 tấn',
    value: 2007,
    maxWeight:5999,
    minWeight:5000
  },
  {
    label: 'Xe tải dưới 7 tấn',
    value: 2008,
    maxWeight:6999,
    minWeight:6000
  },
  {
    label: 'Xe tải dưới 8 tấn',
    value: 2009,
    maxWeight:7999,
    minWeight:7000
  },
  {
    label: 'Xe tải dưới 9 tấn',
    value: 2010,
    maxWeight:8999,
    minWeight:8000
  },
  {
    label: 'Xe tải dưới 10 tấn',
    value: 2011,
    maxWeight:9999,
    minWeight:9000
  },
  {
    label: 'Xe tải dưới 11 tấn',
    value: 2012,
    maxWeight:10999,
    minWeight:10000
  },
  {
    label: 'Xe tải dưới 12 tấn',
    value: 2013,
    maxWeight:11999,
    minWeight:11000
  },
  {
    label: 'Xe tải dưới 13 tấn',
    value: 2014,
    maxWeight:12999,
    minWeight:12000
  },
  {
    label: 'Xe tải dưới 14 tấn',
    value: 2015,
    maxWeight:13999,
    minWeight:13000
  },
  {
    label: 'Xe tải dưới 15 tấn',
    value: 2016,
    maxWeight:14999,
    minWeight:14000
  },
  {
    label: 'Xe tải dưới 16 tấn',
    value: 2017,
    maxWeight:15999,
    minWeight:15000
  },
  {
    label: 'Xe tải dưới 17 tấn',
    value: 2018,
    maxWeight:16999,
    minWeight:16000
  },
  {
    label: 'Xe tải dưới 18 tấn',
    value: 2019,
    maxWeight:17999,
    minWeight:17000
  },
  {
    label: 'Xe tải dưới 19 tấn',
    value: 2020,
    maxWeight:18999,
    minWeight:18000
  },
  {
    label: 'Xe tải dưới 27 tấn',
    value: 2021,
    maxWeight:26999,
    minWeight:26000
  },
  {
    label: 'Xe tải dưới 40 tấn',
    value: 2022,
    maxWeight:39999,
    minWeight:27000
  },
  {
    label: 'Xe tải trên 40 tấn',
    value: 2023,
    maxWeight:99999,
    minWeight:40000
  }
]

export const VIHCLE_CATEGORY_GROUP = [
  {
    label: 'Xe đầu kéo dưới 19 tấn',
    value: 2024,
    maxWeight:18999,
    minWeight:0,
  },
  {
    label: 'Xe đầu kéo dưới 27 tấn',
    value: 2025,
    maxWeight:26999,
    minWeight:19000,
  },
  {
    label: 'Xe đầu kéo dưới 40 tấn',
    value: 2026,
    maxWeight:39999,
    minWeight:27000,
  },
  {
    label: 'Xe đầu kéo trên 40 tấn',
    value: 2027,
    maxWeight:99999,
    minWeight:40000,
  }
]

export const VIHCLE_CATEGORY_MOOC = [
  {
    label: 'Xe rơ moóc',
    value: 3000,
    maxWeight:99999,
    minWeight:0,
  }
]

export const VIHCLE_CATEGORY_PICKUP = [
  {
    label: 'Xe bán tải',
    value: 2001,
    maxWeight:3999,
    minWeight:0,
    seat:5
  }
]

export const VIHCLE_CATEGORY_SPECIALIZED = [
  {
    label: 'Xe chuyên dụng',
    value: 4000
  },
  {
    label: 'Xe 4 bánh có động cơ',
    value: 5000
  },
  {
    label: 'Xe cứu thương',
    value: 6000
  }
]