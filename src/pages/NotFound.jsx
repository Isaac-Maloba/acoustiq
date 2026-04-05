import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="notfound-wrapper">

            {/* Decorative background glows */}
            <div className="notfound-glow notfound-glow-1" />
            <div className="notfound-glow notfound-glow-2" />

            {/* 404 large text */}
            <div className="notfound-code">404</div>

            {/* Message */}
            <h1 className="notfound-title">Lost in the mix</h1>
            <p className="notfound-sub">
                This page doesn't exist — or it may have been moved.
            </p>

            {/* Actions */}
            <div className="notfound-actions">
                <button className="btn btn-ice" onClick={() => navigate('/')}>
                    Back to Store
                </button>
                <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>

        </div>
    );
};

export default NotFound;