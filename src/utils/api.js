import axios from 'axios';

// ============================================================
//  BASE URL — update this if your AlwaysData domain changes
// ============================================================
const BASE_URL = "https://maloba.alwaysdata.net";

// ============================================================
//  IMAGE URL HELPER
//  Usage: imgUrl("filename.jpg")
// ============================================================
export const imgUrl = (filename) => {
    return `${BASE_URL}/static/images/${filename}`;
};

// ============================================================
//  AUTH
// ============================================================
export const apiSignup = (formData) =>
    axios.post(`${BASE_URL}/api/signup`, formData);

export const apiSignin = (formData) =>
    axios.post(`${BASE_URL}/api/signin`, formData);


// ============================================================
//  PROFILE
// ============================================================
export const apiUpdateProfile = (formData) =>
    axios.put(`${BASE_URL}/api/profile/update`, formData);

export const apiChangePassword = (formData) =>
    axios.put(`${BASE_URL}/api/profile/password`, formData);

export const apiDeleteAccount = (userId) =>
    axios.delete(`${BASE_URL}/api/profile/delete/${userId}`);


// ============================================================
//  PRODUCTS
// ============================================================
export const apiGetProducts = (params = {}) =>
    axios.get(`${BASE_URL}/api/products`, { params });

export const apiGetProduct = (productId) =>
    axios.get(`${BASE_URL}/api/product/${productId}`);

export const apiAddProduct = (formData) =>
    axios.post(`${BASE_URL}/api/add_product`, formData);

export const apiEditProduct = (productId, formData) =>
    axios.put(`${BASE_URL}/api/edit_product/${productId}`, formData);


// ============================================================
//  CART
// ============================================================
export const apiGetCart = (userId) =>
    axios.get(`${BASE_URL}/api/cart/${userId}`);

export const apiAddToCart = (formData) =>
    axios.post(`${BASE_URL}/api/cart/add`, formData);

export const apiRemoveFromCart = (cartId) =>
    axios.delete(`${BASE_URL}/api/cart/remove/${cartId}`);

export const apiClearCart = (userId) =>
    axios.delete(`${BASE_URL}/api/cart/clear/${userId}`);


// ============================================================
//  FAVOURITES
// ============================================================
export const apiToggleFavourite = (formData) =>
    axios.post(`${BASE_URL}/api/favourites/toggle`, formData);

export const apiGetFavourites = (userId) =>
    axios.get(`${BASE_URL}/api/favourites/${userId}`);


// ============================================================
//  RATINGS
// ============================================================
export const apiAddRating = (formData) =>
    axios.post(`${BASE_URL}/api/ratings/add`, formData);

export const apiGetRatings = (productId) =>
    axios.get(`${BASE_URL}/api/ratings/${productId}`);


// ============================================================
//  PAYMENTS
// ============================================================
export const apiMpesaPayment = (formData) =>
    axios.post(`${BASE_URL}/api/mpesa_payment`, formData);