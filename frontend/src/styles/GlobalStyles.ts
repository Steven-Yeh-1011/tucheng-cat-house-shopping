import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* 主要色彩 */
    --salmon-pink: #FFB3BA;
    --navy-blue: #1a237e;
    --cream: #FFF8E1;
    
    /* 輔助色彩 */
    --light-blue: #E3F2FD;
    --light-pink: #FCE4EC;
    --light-gray: #F5F5F5;
    
    /* 文字色彩 */
    --text-primary: #1a237e;
    --text-secondary: #666666;
    --text-light: #999999;
    
    /* 邊框色彩 */
    --border-light: #E0E0E0;
    --border-medium: #BDBDBD;
    
    /* 狀態色彩 */
    --success: #4CAF50;
    --warning: #FF9800;
    --error: #F44336;
    --info: #2196F3;
    
    /* 間距 */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* 圓角 */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    
    /* 陰影 */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.2);
    
    /* 過渡動畫 */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--light-gray);
    color: var(--text-primary);
    line-height: 1.5;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* 按鈕重置 */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* 輸入框重置 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  /* 連結重置 */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* 圖片重置 */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Mobile-First 設計 */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* 滾動條樣式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--light-gray);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-light);
  }

  /* 選擇文字樣式 */
  ::selection {
    background: var(--salmon-pink);
    color: var(--navy-blue);
  }

  /* 焦點樣式 */
  :focus {
    outline: 2px solid var(--navy-blue);
    outline-offset: 2px;
  }

  /* 無障礙設計 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;