// Currency formatter (Indian Rupee)
export const formatCurrency = (amount, includeSymbol = true) => {
  if (amount === null || amount === undefined) return '-';
  
  const formatted = Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return includeSymbol ? `₹${formatted}` : formatted;
};

// Date formatter
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

// DateTime formatter
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}`;
};

// Time formatter
export const formatTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${hours}:${minutes} ${ampm}`;
};

// Phone number formatter
export const formatPhone = (phone) => {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

// Percentage formatter
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${Number(value).toFixed(decimals)}%`;
};

// Number formatter with K, M, B suffixes
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '-';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 10000000) {
    return `${(num / 10000000).toFixed(2)}Cr`; // Crores
  } else if (absNum >= 100000) {
    return `${(num / 100000).toFixed(2)}L`; // Lakhs
  } else if (absNum >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Title case
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Truncate text
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

// Format address
export const formatAddress = (address) => {
  if (!address) return '-';
  
  const parts = [];
  
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);
  
  return parts.join(', ');
};

// Generate invoice number
export const generateInvoiceNumber = (prefix = 'INV', financialYear, sequenceNumber) => {
  const paddedSequence = String(sequenceNumber).padStart(6, '0');
  return `${prefix}/${financialYear}/${paddedSequence}`;
};

// Format GSTIN
export const formatGSTIN = (gstin) => {
  if (!gstin) return '-';
  
  // Format: 22AAAAA0000A1Z5
  if (gstin.length === 15) {
    return `${gstin.slice(0, 2)} ${gstin.slice(2, 7)} ${gstin.slice(7, 11)} ${gstin.slice(11, 12)} ${gstin.slice(12, 14)} ${gstin.slice(14)}`;
  }
  
  return gstin;
};

// Format discount
export const formatDiscount = (discount, type = 'percentage') => {
  if (!discount) return '-';
  
  if (type === 'percentage') {
    return `${discount}%`;
  } else {
    return formatCurrency(discount);
  }
};

// Relative time formatter
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatPhone,
  formatPercent,
  formatCompactNumber,
  formatFileSize,
  capitalize,
  titleCase,
  truncate,
  formatAddress,
  generateInvoiceNumber,
  formatGSTIN,
  formatDiscount,
  formatRelativeTime
};