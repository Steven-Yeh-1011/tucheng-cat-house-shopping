// 可愛粉色手機版主題
export const theme = {
  colors: {
    // 可愛粉色主題色彩
    primary: '#FF69B4',           // 熱情粉紅
    primaryLight: '#FFB3D9',      // 淺粉紅
    primaryDark: '#FF1493',       // 深粉紅
    secondary: '#FFC0CB',         // 櫻花粉
    accent: '#FFE4E1',            // 薄霧玫瑰
    
    // 背景色彩
    background: '#FFF5F7',        // 粉色背景
    surface: '#FFFFFF',           // 白色表面
    card: '#FFFAFC',              // 卡片背景
    
    // 文字色彩
    text: '#4A4A4A',              // 主要文字
    textSecondary: '#8B8B8B',     // 次要文字
    textLight: '#B8B8B8',         // 淺色文字
    textOnPrimary: '#FFFFFF',     // 主色上的文字
    
    // 邊框色彩
    border: '#FFD6E8',            // 粉色邊框
    borderLight: '#FFE8F0',       // 淺粉色邊框
    
    // 狀態色彩
    success: '#FF69B4',           // 成功（粉紅）
    warning: '#FFB347',           // 警告（橙粉）
    error: '#FF6B9D',             // 錯誤（粉紅）
    info: '#87CEEB',              // 資訊（天藍）
    
    // 舊版相容（逐步移除）
    salmonPink: '#FF69B4',
    navyBlue: '#FF69B4',
    cream: '#FFF8E1',
    lightBlue: '#E3F2FD',
    lightPink: '#FCE4EC',
    lightGray: '#F5F5F5',
    textPrimary: '#4A4A4A',
    borderMedium: '#FFD6E8',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    round: '50%',
  },
  
  shadows: {
    sm: '0 2px 4px rgba(255, 105, 180, 0.1)',
    md: '0 4px 8px rgba(255, 105, 180, 0.15)',
    lg: '0 6px 16px rgba(255, 105, 180, 0.2)',
    xl: '0 8px 24px rgba(255, 105, 180, 0.25)',
  },
  
  // 移除響應式斷點（固定手機版）
  breakpoints: {
    mobile: '100vw',
  },
  
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      secondary: 'Georgia, "Times New Roman", serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      xxl: '1.5rem',    // 24px
      xxxl: '2rem',     // 32px
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
    bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
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

// 導出類型定義
export type Theme = typeof theme;
