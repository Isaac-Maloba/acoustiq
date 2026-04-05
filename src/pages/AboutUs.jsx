import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMusic, FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import '../css/InfoPages.css';

const AboutUs = () => {
    const navigate = useNavigate();

    const values = [
        {
            icon: <FiMusic size={22} />,
            title: 'Curated Selection',
            body:  'Every product on Acoustiq is hand-picked for quality. We stock only gear we would trust on stage or in the studio.'
        },
        {
            icon: <FiUsers size={22} />,
            title: 'For Every Musician',
            body:  'From the beginner picking up their first guitar to the professional producer finishing a mix — we have something for every stage of your journey.'
        },
        {
            icon: <FiMapPin size={22} />,
            title: 'Proudly Kenyan',
            body:  'Based in Nairobi, we understand the local music scene. Prices are in KES and checkout is via M-Pesa — no friction, no surprises.'
        },
        {
            icon: <FiStar size={22} />,
            title: 'Community First',
            body:  'Acoustiq is built around honest reviews, transparent listings, and a community of musicians helping each other find the right sound.'
        },
    ];

    return (
        <div className="info-page">

            {/* ── HERO ── */}
            <div className="info-hero">
                <div className="info-hero-tag">Our Story</div>
                <h1 className="info-hero-title">
                    Sound gear, <em>built for Kenya</em>
                </h1>
                <p className="info-hero-sub">
                    Acoustiq started with a simple frustration: finding quality instruments
                    in Nairobi meant endless searching, inconsistent prices, and zero
                    transparency. We built the store we always wanted — one that respects
                    musicians' time and money.
                </p>
            </div>

            <div className="info-divider" />

            {/* ── VALUES ── */}
            <div className="info-values-grid">
                {values.map((v, i) => (
                    <div key={i} className="info-value-card">
                        <div className="info-value-icon">{v.icon}</div>
                        <h3>{v.title}</h3>
                        <p>{v.body}</p>
                    </div>
                ))}
            </div>

            <div className="info-divider" />

            {/* ── CTA ── */}
            <div className="info-cta">
                <h2>Ready to find your sound?</h2>
                <p>Browse hundreds of instruments, plugins and accessories — all available right now.</p>
                <button className="btn btn-ice" onClick={() => navigate('/')}>
                    Shop Now
                </button>
            </div>

        </div>
    );
};

export default AboutUs;