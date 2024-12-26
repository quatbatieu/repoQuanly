/// refer Ký hiệu biển số xe ô tô, xe máy của 63 tỉnh, thành trong nước

/// https://luatvietnam.vn/tin-phap-luat/ky-hieu-bien-so-xe-o-to-xe-may-cua-63-tinh-thanh-trong-nuoc-230-26792-article.html
const MA_VUNG = [
  "11", ///: Cao Bằng
  "12", ///: Lạng Sơn
  "14", ///:Quảng Ninh
  "15", ///:Hải Phòng dùng cho ô tô
  "16", ///:Hải Phòng dùng cho xe máy
  "17", ///:Thái Bình
  "18", ///:Nam Định
  "19", ///:Phú Thọ
  "20", ///:Thái Nguyên
  "21", ///:Yên Bái
  "22", ///:Tuyên Quang
  "23", ///:Hà Giang
  "24", ///:Lao Cai
  "25", ///:Lai Châu
  "26", ///:Sơn La
  "27", ///:Điện Biên
  "28", ///:Hoà Bình
  "29", ///:Hà Nội
  "30", ///:Hà Nội
  "31", ///:Hà Nội
  "32", ///:Hà Nội
  "33", ///:Hà Nội
  "34", ///:Hải Dương
  "35", ///:Ninh Bình
  "36", ///:Thanh Hóa
  "37", ///:Nghệ An
  "38", ///:Hà Tĩnh
  "39", ///:Đồng Nai
  "40", ///:Hà Nội
  "41", ///:TPHCM
  "43", ///:Đà Nẵng
  "44", ///:không có
  "45", ///:không có
  "46", ///:không có
  "47", ///:ĐắkLak
  "48", ///:Đắc Nông
  "49", ///:Lâm Đồng
  "50", ///:TPHCM
  "51", ///:TPHCM
  "52", ///:TPHCM
  "53", ///:TPHCM
  "54", ///:TPHCM
  "55", ///:TPHCM
  "56", ///:TPHCM
  "57", ///:TPHCM
  "58", ///:TPHCM
  "59", ///:TPHCM
  "60", ///:Đồng Nai
  "61", ///:Bình Dương
  "62", ///:Long An
  "63", ///:Tiền Giang
  "64", ///:Vĩnh Long
  "65", ///:Cần Thơ
  "66", ///:Đồng Tháp
  "67", ///:An Giang
  "68", ///:Kiên Giang
  "69", ///:Cà Mau
  "70", ///:Tây Ninh
  "71", ///:Bến Tre
  "72", ///:Vũng Tàu
  "73", ///:Quảng Bình
  "74", ///:Quảng Trị
  "75", ///:Huế
  "76", ///:Quảng Ngãi
  "77", ///:Bình Định
  "78", ///:Phú Yên
  "79", ///:Nha Trang
  "81", ///:Gia Lai
  "82", ///:Kon Tum
  "83", ///:Sóc Trăng
  "84", ///:Trà Vinh
  "85", ///:Ninh Thuận
  "86", ///:Bình Thuận
  "88", ///:Vĩnh Phúc
  "89", ///:Hưng Yên
  "90", ///:Hà Nam
  "92", ///:Quảng Nam
  "93", ///:Bình Phước
  "94", ///:Bạc Liêu
  "95", ///:Hậu Giang
  "97", ///:Bắc Cạn
  "98", ///:Bắc Giang
  "99", ///:Bắc Ninh
  "80", ///:Cục Cảnh sát Giao thông đường bộ - Bộ Công An
  "01"  ///:Đại sứ và Tổng Lãnh sứ cao nhất của một nước có đại sứ quan tại Việt Nam
];

///+ Biển số nền màu xanh, chữ và số màu trắng, sêri biển số sử dụng lần lượt một trong 11 chữ cái sau đây: A, B, C, D,
/// E, F, G, H, K, L, M cấp cho xe của các cơ quan của Đảng; Văn phòng Chủ tịch nước; Văn phòng Quốc hội và các cơ quan
/// của Quốc hội; Văn phòng Đoàn đại biểu Quốc hội, Hội đồng nhân dân các cấp; các Ban chỉ đạo Trung ương; Công an nhân
/// dân, Tòa án nhân dân, Viện kiểm sát nhân dân…;
///
///+ Biển số nền màu xanh, chữ và số màu trắng có ký hiệu "CD" cấp cho xe máy chuyên dùng của lực lượng Công an nhân dân
/// sử dụng vào mục đích an ninh;
///
///+ Biển số nền màu trắng, chữ và số màu đen, sêri biển số sử dụng lần lượt một trong 20 chữ cái sau đây: A, B, C, D,
/// E, F, G, H, K, L, M, N, P, S, T, U, V, X, Y, Z cấp cho xe của cá nhân, xe của doanh nghiệp, các tổ chức xã hội, xã
/// hội - nghề nghiệp, xe của đơn vị sự nghiệp ngoài công lập, xe của Trung tâm đào tạo sát hạch lái xe công lập;
///
///+ Biển số nền màu vàng, chữ và số màu đỏ, có ký hiệu địa phương đăng ký và hai chữ cái viết tắt của khu kinh tế -
/// thương mại đặc biệt, khu kinh tế cửa khẩu quốc tế, cấp cho xe của khu kinh tế - thương mại đặc biệt hoặc khu kinh tế
/// cửa khẩu quốc tế;
///
///+ Biển số nền màu vàng, chữ và số màu đen sêri biển số sử dụng lần lượt một trong 20 chữ cái sau đây: A, B, C, D, E,
/// F, G, H, K, L, M, N, P, S, T, U, V, X, Y, Z cấp cho xe hoạt động kinh doanh vận tải (quy định mới).
const validateChar = "A,B,C,D,E,F,G,H,K,L,M,N,P,R,S,T,U,V,X,Y,Z".split(",");
const validateSpecChar = "KT,LD,DA,MK,MD,MĐ,TD,TĐ,HC,NG,QT,NN,CV,CD,LB".split(",");

function _verifyCarNumber(carNumber = "") {
  if(!carNumber) {
    return false
  }

  
  /// Verify car plater string (min 7 chars, max 10 chars)
  const carNumberStrLength = carNumber.replace("-", "").replace(".", "").length;
  if (carNumberStrLength < 7 || carNumberStrLength > 10)
  {
    console.log(`Biển số không đúng định dạng: ${carNumber}`)
    return false
  }

  /// Verify ma vung bien so
  const mavung = carNumber.substring(0, 2);
  if (MA_VUNG.indexOf(mavung) === -1)
  {
    console.log(`Sai mã vùng:  ${mavung}`)
    return false;
  }


  let verifyResult = false;
  /// Verify special plate string
  verifyResult = _verifySpecialPlateString(carNumber);
  if (verifyResult === true)
  {
    return true;
  }
  /// Verify normal plate string
  verifyResult = _verifyNormalCarNumber(carNumber);

  return verifyResult;
}

function _verifySpecialPlateString(verifingNumber) {
  /// Verify series
  // Sample 50-QT-051.02
  let seri = verifingNumber.substring(2, 4).toUpperCase();
  if (validateSpecChar.indexOf(seri) === -1)
  {
    // Sample 29-121-CV-101
    seri = verifingNumber.substring(5, 7).toUpperCase();
    if (validateSpecChar.indexOf(seri) === -1)
    {
      console.log("Khong phai seri dac biet: ", seri)
      return false;
    }
  }

    /// Verify plate string format
  // verify type 1: // Sample 50-QT-051.02
  let verifyResult = _verifySpecialPlateNumberType1(verifingNumber);
  if (verifyResult === false)
  {
    verifyResult = _verifySpecialPlateNumberType2(verifingNumber);
  }
  if (verifyResult === false)
  {
    return false;
  }
  
  return true;
}

function _verifySpecialPlateNumberType1(verifingNumber)
{
  // Sample 50-QT-051.02
  let mavung = MA_VUNG.indexOf(parseInt(verifingNumber.substring(0, 2))); //50
  let validateNumber = parseInt(mavung).toString()
  if(mavung[0] === '0')
    validateNumber++;
  let conversionResult = validateNumber.length === 2;

  if (mavung === -1 && conversionResult === false)
  {
    console.log("Bang so khong dung ma vung 50-QT-051.02: ", verifingNumber);
    return false;
  }

  let soxe = verifingNumber.substring(3, verifingNumber.length-1);
  validateNumber = parseInt(soxe).toString().length
  let i = 0;
  while(soxe[i]) {
    if(soxe[i] === '0') {
      validateNumber++
      i++
    }
    else
      break;
  }
  conversionResult = validateNumber === soxe.length
  if (conversionResult === false)
  {
    soxe = verifingNumber.substring(4, verifingNumber.length-1);
    validateNumber = parseInt(soxe).toString().length
    i = 0;
    while(soxe[i]) {
      if(soxe[i] === '0') {
        validateNumber++
        i++
      }
      else
        break;
    }
    conversionResult = validateNumber === soxe.length
    if (conversionResult == false)
    {
      console.log("Bang so khong dung dinh dang 50-QT-051.02: ", verifingNumber);
      return false;
    }
  }
  return true;
}

function _verifySpecialPlateNumberType2(verifingNumber)
{
  // Sample 29-121-CV-101
  // verify type 2: // Sample 29-121-CV-101
  let mavung = MA_VUNG.indexOf(parseInt(verifingNumber.substring(0, 2))); //29
  let validateNumber = parseInt(mavung).toString().length
  if(mavung[0] === '0')
    validateNumber++

  let conversionResult = validateNumber === 2;
  
  if (mavung === -1 && conversionResult === false)
  {
    console.log("Bang so khong dung ma vung 29-121-CV-101: ", verifingNumber)
    return false;
  }


  let soxe = verifingNumber.substring(0, 4)
  validateNumber = parseInt(soxe).toString().length
  let i = 0;
  while(soxe[i]) {
    if(soxe[i] === '0') {
      validateNumber++
      i++
    }
    else
      break;
  }
  conversionResult = validateNumber === soxe.length
  if (conversionResult === false)
  {
    console.log("Bang so khong dung dinh dang 29-121-CV-101: ", verifingNumber)
    return false;
  }
  
  soxe = verifingNumber.substring(verifingNumber.length - 4, verifingNumber.length-1);
  validateNumber = parseInt(soxe).toString().length
  i = 0;
  while(soxe[i]) {
    if(soxe[i] === '0') {
      validateNumber++
      i++
    }
    else
      break;
  }
  conversionResult = validateNumber === soxe.length
  if (conversionResult === false)
  {
    soxe = verifingNumber.substring(verifingNumber.length - 3, verifingNumber.length-1)
    validateNumber = parseInt(soxe).toString().length
    i = 0;
    while(soxe[i]) {
      if(soxe[i] === '0') {
        validateNumber++
        i++
      }
      else
        break;
    }
    conversionResult = validateNumber === soxe.length
    if (conversionResult === false)
    {
      console.log("Bang so khong dung dinh dang 29-121-CV-101: ", verifingNumber)
      return false;
    }
  }
  return true;
}

function _verifyNormalCarNumber(verifingNumber) {
  /// Verify series
  let seri = verifingNumber.substring(2, 3).toUpperCase(); //55 "A" ...
  if (validateChar.indexOf(seri) === -1)
  {
    console.log("Sai seri: ", seri)
    return false;
  }

  /// Verify plate string format 
  let rawCarNumber = verifingNumber.substring(3, verifingNumber.length);
  let validNumber = parseInt(rawCarNumber).toString().length;
  let i = 0;
  while(rawCarNumber[i]) {
    if(rawCarNumber[i] === '0') {
      validNumber++
      i++
    }
    else
      break;
  }
  let conversionResult = validNumber === rawCarNumber.length;

  if (conversionResult === false)
  {
    console.log("Bang so khong dung dinh dang: ", verifingNumber)
    return false;
  }

  return true;
}

function _verifyNormal(carNumber = "") {
  if(!carNumber) {
    return false
  }
  //"29KT112234",
  //'30a223.44'
  let verifingNumber = carNumber.substring(0, 3); //get 29K, 30a
  let validateLength = parseInt(verifingNumber).toString().length; //parseInt to rm 'K' , 'a'
  if(verifingNumber.length - 1 === validateLength) {
    verifingNumber = carNumber.substring(3, 4); //get 29K'T', 30a'2'
    validateLength = parseInt(verifingNumber).toString().length; //parseInt to rm 'T'
    if(verifingNumber.length === validateLength) {
      return true;
    }
  }
  return false
}

export default {
  _verifyCarNumber,
  _verifyNormal
}

export const widthLicensePlate = 160;