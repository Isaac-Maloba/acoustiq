import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import '../css/Navbar.css';

const Navbar = () => {
    const { user, logout }      = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { cartCount }          = useCart();
    const navigate               = useNavigate();

    const [menuOpen,    setMenuOpen]    = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* ── LOGO ── */}
                <Link to="/" className="navbar-logo">
                    Acou<span>stiq</span>
                </Link>

                {/* ── NAV LINKS (desktop) ── */}
                <div className="navbar-links">
                    <Link to="/">Shop</Link>
                    <Link to="/?category=Physical+Instrument">Instruments</Link>
                    <Link to="/?category=VST+Plugin">Plugins</Link>
                    <Link to="/?category=Accessory">Accessories</Link>
                </div>

                {/* ── RIGHT SIDE ── */}
                <div className="navbar-right">

                    {/* Theme toggle */}
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                        {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
                    </button>

                    {user ? (
                        <>
                            {/* Greeting */}
                            <span className="navbar-greeting">
                                Hi, {user.first_name} ✦
                            </span>

                            {/* Favourites */}
                            <Link to="/favourites" className="navbar-icon-btn" title="Favourites">
                                <FiHeart size={18} />
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="navbar-icon-btn cart-btn" title="Cart">
                                <FiShoppingCart size={18} />
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </Link>

                            {/* Profile dropdown */}
                            <div className="profile-menu-wrapper">
                                <button
                                    className="profile-avatar"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    title="Account"
                                >
                                    {user.first_name.charAt(0).toUpperCase()}
                                    {user.last_name.charAt(0).toUpperCase()}
                                </button>

                                {profileOpen && (
                                    <div className="profile-dropdown">
                                        <div className="profile-dropdown-header">
                                            <p className="profile-name">
                                                {user.first_name} {user.last_name}
                                            </p>
                                            <p className="profile-email">{user.email}</p>
                                        </div>
                                        <div className="profile-dropdown-divider" />
                                        <Link
                                            to="/profile"
                                            className="profile-dropdown-item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <FiSettings size={14} /> My Profile
                                        </Link>
                                        <Link
                                            to="/add-product"
                                            className="profile-dropdown-item"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <FiUser size={14} /> Add Product
                                        </Link>
                                        <div className="profile-dropdown-divider" />
                                        <button
                                            className="profile-dropdown-item danger"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className="btn btn-ghost" style={{ padding: '7px 16px', fontSize: '13px' }}>
                                Sign In
                            </Link>
                            <Link to="/signup" className="btn btn-ice" style={{ padding: '7px 16px', fontSize: '13px' }}>
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── MOBILE MENU ── */}
            {menuOpen && (
                <div className="mobile-menu">
                    <Link to="/"                            onClick={() => setMenuOpen(false)}>Shop</Link>
                    <Link to="/?category=Physical+Instrument" onClick={() => setMenuOpen(false)}>Instruments</Link>
                    <Link to="/?category=VST+Plugin"        onClick={() => setMenuOpen(false)}>Plugins</Link>
                    <Link to="/?category=Accessory"         onClick={() => setMenuOpen(false)}>Accessories</Link>
                    {user ? (
                        <>
                            <Link to="/favourites" onClick={() => setMenuOpen(false)}>Favourites</Link>
                            <Link to="/cart"       onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
                            <Link to="/profile"    onClick={() => setMenuOpen(false)}>My Profile</Link>
                            <Link to="/add-product" onClick={() => setMenuOpen(false)}>Add Product</Link>
                            <button onClick={handleLogout}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;