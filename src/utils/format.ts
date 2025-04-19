export const truncateString = (str: string | null | undefined, maxLength: number): string => {
    // Kiểm tra nếu str là null, undefined hoặc chuỗi rỗng
    if (!str || str.length === 0) {
      return '';  // Hoặc trả về một giá trị mặc định khác tùy nhu cầu
    }
  
    // Nếu độ dài của str nhỏ hơn hoặc bằng maxLength, trả về str nguyên vẹn
    if (str.length <= maxLength) {
      return str;
    }
  
    // Nếu str dài hơn maxLength, cắt chuỗi và thêm "..." vào giữa
    const halfLength = Math.floor(maxLength / 2) - 1;
    return str.slice(0, halfLength) + "..." + str.slice(str.length - halfLength);
  };
  
export const formatNumberWithSuffix = (input: number | string): string => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  
  if (isNaN(num)) {
    return '0';
  }

  const formatNumber = (n: number) => {
    const absNum = Math.abs(n);
    return n?.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: absNum < 0.01 ? 6 : 2
    });
  };

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1000000000) {
    return sign + formatNumber(absNum / 1000000000) + 'B';
  }
  if (absNum >= 1000000) {
    return sign + formatNumber(absNum / 1000000) + 'M';
  }
  if (absNum >= 1000) {
    return sign + formatNumber(absNum / 1000) + 'K';
  }
  return formatNumber(num);
};
  