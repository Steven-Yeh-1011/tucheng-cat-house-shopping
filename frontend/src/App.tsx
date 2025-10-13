import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { ProductListPage } from './pages/ProductListPage';

/**
 * 土城貓舍購物網主應用元件
 */
function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          {/* TODO: 添加其他路由 */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
          {/* <Route path="/admin" element={<AdminPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
