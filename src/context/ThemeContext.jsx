import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================
//  CREATE THE CONTEXT
// ============================================================
const ThemeContext = createContext();

// ============================================================
//  PROVIDER — wraps the whole app in App.jsx
// ============================================================
export const ThemeProvider = ({ children }) => {

    const [isDark, setIsDark] = useState(true);

    // When the app first loads, check if the user had
    // previously set a theme preference
    useEffect(() => {
        const stored = localStorage.getItem("acoustiq_theme");
        if (stored) {
            const dark = stored === "dark";
            setIsDark(dark);
            applyTheme(dark);
        } else {
            // Default is dark mode
            applyTheme(true);
        }
    }, []);

    // ── APPLY THEME ───────────────────────────────────────
    // Adds or removes the "light" class on <body>
    // global.css handles the rest via CSS variables
    const applyTheme = (dark) => {
        if (dark) {
            document.body.classList.remove("light");
        } else {
            document.body.classList.add("light");
        }
    };

    // ── TOGGLE ────────────────────────────────────────────
    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        applyTheme(newDark);
        localStorage.setItem("acoustiq_theme", newDark ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ============================================================
//  CUSTOM HOOK
//  Usage: const { isDark, toggleTheme } = useTheme();
// ============================================================
export const useTheme = () => {
    return useContext(ThemeContext);
};