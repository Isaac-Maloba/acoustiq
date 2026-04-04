import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================
//  CREATE THE CONTEXT
// ============================================================
const AuthContext = createContext();

// ============================================================
//  PROVIDER — wraps the whole app in App.jsx
// ============================================================
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    // When the app first loads, check if a user is already
    // stored in localStorage (i.e. they logged in previously)
    useEffect(() => {
        const stored = localStorage.getItem("acoustiq_user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    // ── LOGIN ─────────────────────────────────────────────
    // Called from Signin.jsx after a successful API response
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("acoustiq_user", JSON.stringify(userData));
    };

    // ── LOGOUT ────────────────────────────────────────────
    // Clears user from state and localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem("acoustiq_user");
    };

    // ── UPDATE USER ───────────────────────────────────────
    // Called from Profile.jsx after details are edited
    // so the navbar greeting updates immediately
    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData };
        setUser(merged);
        localStorage.setItem("acoustiq_user", JSON.stringify(merged));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================
//  CUSTOM HOOK — how every component accesses auth state
//  Usage: const { user, login, logout } = useAuth();
// ============================================================
export const useAuth = () => {
    return useContext(AuthContext);
};