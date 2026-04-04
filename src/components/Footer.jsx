import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import '../css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">

                {/* ── BRAND COL ── */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        Acou<span>stiq</span>
                    </div>
                    <p className="footer-tagline">
                        Premium sound gear for musicians at every level.
                        Based in Nairobi, delivering across Kenya.
                    </p>
                    <div className="footer-contact">
                        <div className="footer-contact-item">
                            <FiMapPin size={13} />
                            <span>Nairobi, Kenya</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiPhone size={13} />
                            <span>+254 700 000 000</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiMail size={13} />
                            <span>hello@acoustiq.co.ke</span>
                        </div>
                    </div>
                </div>

                {/* ── SHOP COL ── */}
                <div className="footer-col">
                    <h4>Shop</h4>
                    <Link to="/?category=Physical+Instrument">Instruments</Link>
                    <Link to="/?category=VST+Plugin">VST Plugins</Link>
                    <Link to="/?category=Accessory">Accessories</Link>
                    <Link to="/">New Arrivals</Link>
                </div>

                {/* ── ACCOUNT COL ── */}
                <div className="footer-col">
                    <h4>Account</h4>
                    <Link to="/signin">Sign In</Link>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/cart">My Cart</Link>
                    <Link to="/favourites">Favourites</Link>
                    <Link to="/profile">My Profile</Link>
                </div>

                {/* ── INFO COL ── */}
                <div className="footer-col">
                    <h4>Info</h4>
                    <Link to="/">About Us</Link>
                    <Link to="/">Contact</Link>
                    <Link to="/">Returns Policy</Link>
                    <Link to="/">Shipping Info</Link>
                </div>

            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="footer-bottom">
                <div className="footer-inner">
                    <p className="footer-copy">
                        © {new Date().getFullYear()} Acoustiq. All rights reserved.
                    </p>
                    <div className="footer-mpesa">
                        <span>Payments secured via</span>
                        <span className="mpesa-badge">M-PESA</span>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;