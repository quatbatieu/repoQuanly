export const hidePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return ""
  }

  // Kiểm tra độ dài số điện thoại
  if (phoneNumber.length < 5) {
   return "*".repeat(phoneNumber.length);
  }

  // Ẩn số điện thoại
  const visibleDigits = phoneNumber.slice(-4);
  const hiddenDigits = "*".repeat(phoneNumber.length - 4);

  return hiddenDigits + visibleDigits;
}
