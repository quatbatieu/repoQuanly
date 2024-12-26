export const getIndexTagVehicleFromColor = (color) => {
	if(!color) {
		return 0;
	}
	
  return LICENSE_PLATE_COLOR.findIndex(item => item.color === color);
}

export const getListLicensePlateColorState = (translation) => {
	return {
		1: translation("color.white"),
		2: translation("color.green"),
		3: translation("color.yellow"),
		4: translation("colo.red")
	}
}

export const PAYMENT_STATE = {
  UNPAID: 0, // Chưa thanh toán
  PAID: 1, // Đã thanh toán
  CANCELED: 10, // Đã hủy
  PAYMENT_FAILED: 20, // Thanh toán thất bại
  PROCESSING: 30 // Đang xử lý
};

export const getPaymentStatusList = (translation) => {
  return {
    [PAYMENT_STATE.UNPAID]: translation("listSchedules.payment.unpaid"),
    [PAYMENT_STATE.PAID]: translation("listSchedules.payment.paid"),
    [PAYMENT_STATE.CANCELED]: translation("listSchedules.payment.canceled"),
    [PAYMENT_STATE.PAYMENT_FAILED]: translation("listSchedules.payment.paymentFailed"),
    [PAYMENT_STATE.PROCESSING]: translation("listSchedules.payment.processing"),
  };
};

export const LICENSE_PLATE_COLOR = [
	{
		color: "white",
		style: {
			background: "#fff",
			border: "2px solid #000000",
			color: "#000"
		},
		name: "Trắng" ,
		styleChildren: {}
	},
	{
		color: "blue",
		style: {
			background: "#0050B3",
			color: "#fff",
			padding: 2
		},
		name: "Xanh" ,
		styleChildren: {
			border: "2px solid #fff",
			background: "#0050B3",
		}
	},
	{
		color: "yellow",
		style: {
			background: "#FAAD14",
			border: "2px solid #0050B3",
			color: "#000"
		},
		name: "Vàng" ,
		styleChildren: {}
	},
	{
		color: "red",
		style: {
			border: "2px solid #CF1322",
			color: "#fff",
			padding: 2
		},
		name: "Đỏ" ,
		styleChildren: {
			border: "2px solid #fff",
			background: "#CF1322"
		}
	}
]

export const SCHEDULE_STATUS = {
	0: {
		color: "#FC8B06",
		text: "chưa xác nhận"
	},
	10: {
		color: "#427AFF",
		text: "đã xác nhận"
	},
	20: {
		color: "#E42310D9",
		text: "đã hủy"
	},
	30: {
		color: "#00A137D9",
		text: "Đăng kiểm thành công"
	},
}

export const getListVehicleTypes = (translation) => {
	return {
		1: translation("accreditation.car"),
		10: translation("accreditation.otherVehicles"),
		20: translation("accreditation.Trailers")
	}
}

const VEHICLE_SUB_TYPE_STATE = {
  CAR: 1, //'Xe ô tô con',
  OTHER: 10, //'Xe bán tải, phương tiện khác',
  XE_KHACH: 11, //'Xe khách'
  XE_TAI: 12, //'Xe tải'
  XE_TAI_DOAN: 13, //'Đoàn ô tô (ô tô đầu kéo + sơ mi rơ mooc)',
  XE_BAN_TAI: 14, //'Xe bán tải
  RO_MOOC: 20, //'Rơ moóc và sơ mi rơ moóc',
}

export const getVehicleSubTypes = (translation) => {
  return {
    [VEHICLE_SUB_TYPE_STATE.CAR]: translation("vehicleSubType.car"),
    [VEHICLE_SUB_TYPE_STATE.OTHER]: translation("vehicleSubType.other"),
    [VEHICLE_SUB_TYPE_STATE.XE_KHACH]: translation("vehicleSubType.xeKhach"),
    [VEHICLE_SUB_TYPE_STATE.XE_TAI]: translation("vehicleSubType.xeTai"),
    [VEHICLE_SUB_TYPE_STATE.XE_TAI_DOAN]: translation("vehicleSubType.xeTaiDoan"),
    [VEHICLE_SUB_TYPE_STATE.XE_BAN_TAI]: translation("vehicleSubType.xeBanTai"),
    [VEHICLE_SUB_TYPE_STATE.RO_MOOC]: translation("vehicleSubType.roMooc"),
  }
}

const VEHICLE_SUB_CATEGORY_STATE = {
  OTO_4CHO: 1001, //Ô tô 4 chỗ
  OTO_5CHO: 1002, //Ô tô 5 chỗ
  OTO_6CHO: 1003, //Ô tô 6 chỗ
  OTO_7CHO: 1004, //Ô tô 7 chỗ
  OTO_8CHO: 1005, //Ô tô 8 chỗ
  OTO_9CHO: 1006, //Ô tô 9 chỗ
  OTO_10CHO: 1007, //Ô tô 10 chỗ
  OTO_11CHO: 1008, //Ô tô 11 chỗ
  OTO_12CHO: 1009, //Ô tô 12 chỗ
  OTO_13CHO: 1010, //Ô tô 13 chỗ
  OTO_14CHO: 1011, //Ô tô 14 chỗ
  OTO_15CHO: 1012, //Ô tô 15 chỗ
  OTO_16CHO: 1013, //Ô tô 16 chỗ
  OTO_17CHO: 1014, //Ô tô 17 chỗ
  OTO_18CHO: 1015, //Ô tô 18 chỗ
  OTO_19CHO: 1016, //Ô tô 19 chỗ
  OTO_20CHO: 1017, //Ô tô 20 chỗ
  OTO_21CHO: 1018, //Ô tô 21 chỗ
  OTO_22CHO: 1019, //Ô tô 22 chỗ
  OTO_23CHO: 1020, //Ô tô 23 chỗ
  OTO_24CHO: 1021, //Ô tô 24 chỗ
  OTO_25CHO: 1022, //Ô tô 25 chỗ
  OTO_29CHO: 1023, //Ô tô 29 chỗ
  OTO_45CHO: 1024, //Ô tô 45 chỗ
  OTO_52CHO: 1025, //Ô tô 52 chỗ
  XE_BAN_TAI: 2001, //- Xe bán tải (20)
  XE_TAI_DUOI_1TAN: 2002, //- Xe tải dưới 1 tấn (21)
  XE_TAI_DUOI_2TAN: 2003, //- Xe tải 1-1.9 tấn
  XE_TAI_DUOI_3TAN: 2004, //- Xe tải 2-2.9 tấn
  XE_TAI_DUOI_4TAN: 2005, //- Xe tải 3-3.9 tấn
  XE_TAI_DUOI_5TAN: 2006, //- Xe tải 4-4.9 tấn
  XE_TAI_DUOI_6TAN: 2007, //- Xe tải 5-5.9 tấn
  XE_TAI_DUOI_7TAN: 2008, //- Xe tải 6-6.9 tấn
  XE_TAI_DUOI_8TAN: 2009, //- Xe tải 7-7.9 tấn
  XE_TAI_DUOI_9TAN: 2010, //- Xe tải 8-8.9 tấn
  XE_TAI_DUOI_10TAN: 2011, //- Xe tải 9-9.9 tấn
  XE_TAI_DUOI_11TAN: 2012, //- Xe tải 10-10.9 tấn
  XE_TAI_DUOI_12TAN: 2013, //- Xe tải 11-11.9 tấn
  XE_TAI_DUOI_13TAN: 2014, //- Xe tải 12-12.9 tấn
  XE_TAI_DUOI_14TAN: 2015, //- Xe tải 13-13.9 tấn
  XE_TAI_DUOI_15TAN: 2016, //- Xe tải 14-14.9 tấn
  XE_TAI_DUOI_16TAN: 2017, //- Xe tải 16-16.9 tấn
  XE_TAI_DUOI_17TAN: 2018, //- Xe tải 17-17.9 tấn
  XE_TAI_DUOI_18TAN: 2019, //- Xe tải 18-18.9 tấn
  XE_TAI_DUOI_19TAN: 2020, //- Xe tải 19-19.9 tấn
  XE_TAI_DUOI_27TAN: 2021, //- Xe tải 20-26.9 tấn
  XE_TAI_DUOI_40TAN: 2022, //- Xe tải 27-39.9 tấn
  XE_TAI_TREN_40TAN: 2023, //- Xe tải trên 40 tấn
  XE_DAU_KEO_DUOI_19TAN: 2024, //- Xe đầu kéo dưới 19 Tấn
  XE_DAU_KEO_DUOI_27TAN: 2025, //- Xe đầu kéo 19-26.9 Tấn
  XE_DAU_KEO_DUOI_40TAN: 2026, //- Xe đầu kéo 27-39.9 Tấn
  XE_DAU_KEO_TREN_40TAN: 2027, //- Xe đầu kéo trên 40 Tấn
  XE_ROMOOC: 3000, //- Romooc, sơmi romooc (23)
  XE_CHUYENDUNG: 4000, //- Xe chuyên dụng (30)
  XE_BONBANH_CO_DONG_CO: 5000, //- Xe bốn bánh có động cơ (40)
  XE_CUU_THUONG: 6000, //Xe cứu thương
}

export const getVehicleSubCategories = (translation) => {
  return {
    [VEHICLE_SUB_CATEGORY_STATE.OTO_4CHO]: translation("vehicleSubCategory.oto4Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_5CHO]: translation("vehicleSubCategory.oto5Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_6CHO]: translation("vehicleSubCategory.oto6Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_7CHO]: translation("vehicleSubCategory.oto7Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_8CHO]: translation("vehicleSubCategory.oto8Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_9CHO]: translation("vehicleSubCategory.oto9Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_10CHO]: translation("vehicleSubCategory.oto10Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_11CHO]: translation("vehicleSubCategory.oto11Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_12CHO]: translation("vehicleSubCategory.oto12Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_13CHO]: translation("vehicleSubCategory.oto13Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_14CHO]: translation("vehicleSubCategory.oto14Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_15CHO]: translation("vehicleSubCategory.oto15Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_16CHO]: translation("vehicleSubCategory.oto16Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_17CHO]: translation("vehicleSubCategory.oto17Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_18CHO]: translation("vehicleSubCategory.oto18Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_19CHO]: translation("vehicleSubCategory.oto19Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_20CHO]: translation("vehicleSubCategory.oto20Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_21CHO]: translation("vehicleSubCategory.oto21Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_22CHO]: translation("vehicleSubCategory.oto22Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_23CHO]: translation("vehicleSubCategory.oto23Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_24CHO]: translation("vehicleSubCategory.oto24Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_25CHO]: translation("vehicleSubCategory.oto25Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_29CHO]: translation("vehicleSubCategory.oto29Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_45CHO]: translation("vehicleSubCategory.oto45Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.OTO_52CHO]: translation("vehicleSubCategory.oto52Cho"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_BAN_TAI]: translation("vehicleSubCategory.xeBanTai"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_1TAN]: translation("vehicleSubCategory.xeTaiDuoi1Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_2TAN]: translation("vehicleSubCategory.xeTaiDuoi2Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_3TAN]: translation("vehicleSubCategory.xeTaiDuoi3Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_4TAN]: translation("vehicleSubCategory.xeTaiDuoi4Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_5TAN]: translation("vehicleSubCategory.xeTaiDuoi5Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_6TAN]: translation("vehicleSubCategory.xeTaiDuoi6Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_7TAN]: translation("vehicleSubCategory.xeTaiDuoi7Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_8TAN]: translation("vehicleSubCategory.xeTaiDuoi8Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_9TAN]: translation("vehicleSubCategory.xeTaiDuoi9Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_10TAN]: translation("vehicleSubCategory.xeTaiDuoi10Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_11TAN]: translation("vehicleSubCategory.xeTaiDuoi11Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_12TAN]: translation("vehicleSubCategory.xeTaiDuoi12Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_13TAN]: translation("vehicleSubCategory.xeTaiDuoi13Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_14TAN]: translation("vehicleSubCategory.xeTaiDuoi14Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_15TAN]: translation("vehicleSubCategory.xeTaiDuoi15Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_16TAN]: translation("vehicleSubCategory.xeTaiDuoi16Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_17TAN]: translation("vehicleSubCategory.xeTaiDuoi17Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_18TAN]: translation("vehicleSubCategory.xeTaiDuoi18Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_19TAN]: translation("vehicleSubCategory.xeTaiDuoi19Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_27TAN]: translation("vehicleSubCategory.xeTaiDuoi27Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_DUOI_40TAN]: translation("vehicleSubCategory.xeTaiDuoi40Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_TAI_TREN_40TAN]: translation("vehicleSubCategory.xeTaiTren40Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_DAU_KEO_DUOI_19TAN]: translation("vehicleSubCategory.xeDauKeoDuoi19Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_DAU_KEO_DUOI_27TAN]: translation("vehicleSubCategory.xeDauKeoDuoi27Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_DAU_KEO_DUOI_40TAN]: translation("vehicleSubCategory.xeDauKeoDuoi40Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_DAU_KEO_TREN_40TAN]: translation("vehicleSubCategory.xeDauKeoTren40Tan"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_ROMOOC]: translation("vehicleSubCategory.xeRomooc"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_CHUYENDUNG]: translation("vehicleSubCategory.xeChuyenDung"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_BONBANH_CO_DONG_CO]: translation("vehicleSubCategory.xeBonBanhCoDongCo"),
    [VEHICLE_SUB_CATEGORY_STATE.XE_CUU_THUONG]: translation("vehicleSubCategory.xeCuuThuong")
  }
}