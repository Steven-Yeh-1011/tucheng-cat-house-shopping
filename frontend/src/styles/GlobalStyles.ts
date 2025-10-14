import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* 可愛粉色主題色彩 */
    --color-primary: #FF69B4;        /* 熱情粉紅 */
    --color-primary-light: #FFB3D9;  /* 淺粉紅 */
    --color-primary-dark: #FF1493;   /* 深粉紅 */
    --color-secondary: #FFC0CB;      /* 櫻花粉 */
    --color-accent: #FFE4E1;         /* 薄霧玫瑰 */
    
    /* 背景色彩 */
    --color-background: #FFF5F7;     /* 粉色背景 */
    --color-surface: #FFFFFF;        /* 白色表面 */
    --color-card: #FFFAFC;           /* 卡片背景 */
    
    /* 文字色彩 */
    --color-text: #4A4A4A;           /* 主要文字 */
    --color-text-secondary: #8B8B8B; /* 次要文字 */
    --color-text-light: #B8B8B8;     /* 淺色文字 */
    --color-text-on-primary: #FFFFFF;/* 主色上的文字 */
    
    /* 邊框色彩 */
    --color-border: #FFD6E8;         /* 粉色邊框 */
    --color-border-light: #FFE8F0;   /* 淺粉色邊框 */
    
    /* 狀態色彩 */
    --color-success: #FF69B4;        /* 成功（粉紅） */
    --color-warning: #FFB347;        /* 警告（橙粉） */
    --color-error: #FF6B9D;          /* 錯誤（粉紅） */
    --color-info: #87CEEB;           /* 資訊（天藍） */
    
    /* 固定手機寬度 */
    --mobile-width: 100vw;
    --mobile-max-width: 100%;
    
    /* 間距（針對手機優化） */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-xxl: 32px;
    
    /* 圓角（可愛風格） */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-round: 50%;
    
    /* 陰影（柔和風格） */
    --shadow-sm: 0 2px 4px rgba(255, 105, 180, 0.1);
    --shadow-md: 0 4px 8px rgba(255, 105, 180, 0.15);
    --shadow-lg: 0 6px 16px rgba(255, 105, 180, 0.2);
    --shadow-xl: 0 8px 24px rgba(255, 105, 180, 0.25);
    
    /* 過渡動畫 */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
    --transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* 字體大小（手機優化） */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-xxl: 24px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    /* 固定手機版本，不允許縮放 */
    width: 100vw;
    max-width: 100%;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    /* 固定手機寬度 */
    width: 100vw;
    max-width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    
    /* 字體設定 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    font-size: var(--font-size-md);
    line-height: 1.6;
    
    /* 可愛粉色背景 */
    background: linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 100%);
    color: var(--color-text);
    
    /* 平滑渲染 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* 觸控優化 */
    -webkit-tap-highlight-color: rgba(255, 105, 180, 0.2);
    touch-action: manipulation;
  }

  #root {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
    background: var(--color-accent);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.9em;
  }

  /* 按鈕預設樣式（可愛風格） */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
    transition: all var(--transition-normal);
    border-radius: var(--radius-md);
    
    /* 觸控優化 */
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
    
    &:active {
      transform: scale(0.95);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* 輸入框預設樣式（可愛風格） */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    transition: all var(--transition-normal);
    
    /* 觸控優化 */
    min-height: 44px;
    touch-action: manipulation;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    }
    
    &::placeholder {
      color: var(--color-text-light);
    }
  }

  /* 連結預設樣式 */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: all var(--transition-fast);
    
    &:hover {
      color: var(--color-primary-dark);
      text-decoration: underline;
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  /* 圖片預設樣式（圓潤風格） */
  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
  }

  /* 標題樣式（可愛風格） */
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text);
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: var(--spacing-md);
  }

  h1 {
    font-size: var(--font-size-xxl);
  }

  h2 {
    font-size: var(--font-size-xl);
  }

  h3 {
    font-size: var(--font-size-lg);
  }

  /* 段落樣式 */
  p {
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
  }

  /* 列表樣式 */
  ul, ol {
    padding-left: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
  }

  li {
    margin-bottom: var(--spacing-sm);
  }

  /* 滾動條樣式（粉色主題） */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-accent);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-primary-light);
    border-radius: var(--radius-sm);
    
    &:hover {
      background: var(--color-primary);
    }
  }

  /* 選取文字樣式（粉色主題） */
  ::selection {
    background: var(--color-primary-light);
    color: var(--color-text);
  }

  ::-moz-selection {
    background: var(--color-primary-light);
    color: var(--color-text);
  }

  /* 焦點樣式（可愛風格） */
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* 載入動畫 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* 通用工具類別 */
  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .font-bold {
    font-weight: 700;
  }

  .font-semibold {
    font-weight: 600;
  }

  .font-normal {
    font-weight: 400;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: var(--spacing-sm);
  }

  .gap-md {
    gap: var(--spacing-md);
  }

  .gap-lg {
    gap: var(--spacing-lg);
  }

  .rounded {
    border-radius: var(--radius-md);
  }

  .rounded-lg {
    border-radius: var(--radius-lg);
  }

  .rounded-full {
    border-radius: var(--radius-round);
  }

  .shadow-sm {
    box-shadow: var(--shadow-sm);
  }

  .shadow-md {
    box-shadow: var(--shadow-md);
  }

  .shadow-lg {
    box-shadow: var(--shadow-lg);
  }

  /* 無障礙設定（減少動畫） */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* 深色模式支援（可選） */
  @media (prefers-color-scheme: dark) {
    /* 如果需要深色模式，可以在這裡添加樣式 */
    /* 目前保持可愛粉色主題 */
  }
`;
