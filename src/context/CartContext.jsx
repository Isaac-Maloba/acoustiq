import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGetCart, apiAddToCart, apiRemoveFromCart, apiClearCart } from '../utils/api';
import { useAuth } from './AuthContext';

// ============================================================
//  CREATE THE CONTEXT
// ============================================================
const CartContext = createContext();

// ============================================================
//  PROVIDER — wraps the whole app in App.jsx
// ============================================================
export const CartProvider = ({ children }) => {

    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    // Whenever the logged-in user changes (login/logout),
    // fetch their cart from the API or clear it
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    // ── FETCH CART ────────────────────────────────────────
    const fetchCart = async () => {
        try {
            setCartLoading(true);
            const response = await apiGetCart(user.user_id);
            setCartItems(response.data);
            setCartLoading(false);
        } catch (error) {
            setCartLoading(false);
            console.error("Failed to fetch cart:", error);
        }
    };

    // ── ADD TO CART ───────────────────────────────────────
    // Returns true on success so the component can show feedback
    const addToCart = async (productId) => {
        if (!user) return false;
        try {
            const formData = new FormData();
            formData.append("user_id", user.user_id);
            formData.append("product_id", productId);
            await apiAddToCart(formData);
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Failed to add to cart:", error);
            return false;
        }
    };

    // ── REMOVE FROM CART ──────────────────────────────────
    const removeFromCart = async (cartId) => {
        try {
            await apiRemoveFromCart(cartId);
            setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    // ── CLEAR CART ────────────────────────────────────────
    // Called automatically after a successful M-Pesa payment
    const clearCart = async () => {
        if (!user) return;
        try {
            await apiClearCart(user.user_id);
            setCartItems([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    // ── CART COUNT ────────────────────────────────────────
    // Total number of items (respects quantity)
    // This is what shows on the cart badge in the Navbar
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // ── CART TOTAL ────────────────────────────────────────
    // Total price of all items in the cart
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.product_cost * item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            cartLoading,
            addToCart,
            removeFromCart,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

// ============================================================
//  CUSTOM HOOK
//  Usage: const { cartItems, cartCount, addToCart } = useCart();
// ============================================================
export const useCart = () => {
    return useContext(CartContext);
};