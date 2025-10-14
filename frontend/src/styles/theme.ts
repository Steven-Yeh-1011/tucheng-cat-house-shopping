export const theme = {
  colors: {
    // 主要色彩
    salmonPink: '#FFB3BA',      // 鮭魚粉
    navyBlue: '#1a237e',         // 深海軍藍
    cream: '#FFF8E1',           // 淺米黃
    
    // 輔助色彩
    lightBlue: '#E3F2FD',       // 淺藍
    lightPink: '#FCE4EC',       // 淺粉
    lightGray: '#F5F5F5',       // 淺灰
    
    // 文字色彩
    textPrimary: '#1a237e',     // 主要文字
    textSecondary: '#666666',   // 次要文字
    textLight: '#999999',       // 淺色文字
    
    // 邊框色彩
    borderLight: '#E0E0E0',     // 淺色邊框
    borderMedium: '#BDBDBD',    // 中等邊框
    
    // 狀態色彩
    success: '#4CAF50',         // 成功
    warning: '#FF9800',         // 警告
    error: '#F44336',           // 錯誤
    info: '#2196F3',            // 資訊
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 2px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      secondary: 'Georgia, "Times New Roman", serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};



