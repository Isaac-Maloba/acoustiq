import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── CONTEXTS ──────────────────────────────────────────────
import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider }  from './context/CartContext';

// ── LAYOUT ────────────────────────────────────────────────
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';

// ── PAGES ─────────────────────────────────────────────────
import Home          from './pages/Home';
import Signin        from './pages/Signin';
import Signup        from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import AddProduct    from './pages/AddProduct';
import EditProduct   from './pages/EditProduct';
import Cart          from './pages/Cart';
import Favourites    from './pages/Favourites';
import Profile       from './pages/Profile';
import NotFound      from './pages/NotFound';

// ── GLOBAL STYLES ─────────────────────────────────────────
import './css/global.css';

// ============================================================
//  LAYOUT WRAPPER
//  Navbar and Footer appear on every page.
//  The page content sits between them.
// ============================================================
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

// ============================================================
//  APP
// ============================================================
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/"                      element={<Home />} />
                <Route path="/signin"                element={<Signin />} />
                <Route path="/signup"                element={<Signup />} />
                <Route path="/product/:product_id"   element={<ProductDetail />} />
                <Route path="/add-product"           element={<AddProduct />} />
                <Route path="/edit-product/:product_id" element={<EditProduct />} />
                <Route path="/cart"                  element={<Cart />} />
                <Route path="/favourites"            element={<Favourites />} />
                <Route path="/profile"               element={<Profile />} />
                <Route path="*"                      element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;