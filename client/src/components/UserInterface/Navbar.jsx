import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, Rocket, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { getCurrentUser, logoutUser } from "../../api/authApi";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication status by calling backend API
    const checkAuthStatus = async () => {
        try {
            const res = await getCurrentUser();
            if (res.data?.success) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
            }
        } catch (error) {
            // Not authenticated or error
            setAuthenticated(false);
        } finally {
            setCheckingAuth(false);
        }
    };

    useEffect(() => {
        // Check auth on mount and when route changes
        checkAuthStatus();

        // Listen for auth state changes from login/register
        const handleAuthChange = () => {
            checkAuthStatus();
        };
        window.addEventListener("authStateChanged", handleAuthChange);

        return () => {
            window.removeEventListener("authStateChanged", handleAuthChange);
        };
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logoutUser();
            setAuthenticated(false);
            toast.success("Logged out successfully");
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
            // Even if API call fails, clear local state
            setAuthenticated(false);
            toast.error("Logout failed");
        }
    };

    const handleGetStarted = async () => {
        // Double-check auth status before navigating
        if (authenticated) {
            navigate("/create-resume");
        } else {
            // Try to check auth one more time
            try {
                const res = await getCurrentUser();
                if (res.data?.success) {
                    setAuthenticated(true);
                    navigate("/create-resume");
                } else {
                    toast.info("Please sign up to create your resume");
                    navigate("/user/register");
                }
            } catch (error) {
                toast.info("Please sign up to create your resume");
                navigate("/user/register");
            }
        }
    };

    const handleMyResumes = () => {
        navigate("/my_resume");
        if (open) setOpen(false); 
    };

    const shadowGlow = "shadow-[0_0_50px_rgba(109,40,217,0.3),_0_0_15px_rgba(255,255,255,0.05)]";

    return (
        <>
            <style>
                {`
                    /* Note: The float animation is removed for a cleaner look, but style tag remains for potential future use */
                `}
            </style>

            <div className={`
                fixed top-0 left-0 w-full h-16 z-50
                backdrop-blur-2xl bg-black/5 border-b border-white/10
                ${shadowGlow}
                flex justify-between items-center px-8 md:px-12
            `}>

                <Link to="/" className="flex items-center group">
                    <span className="
                        font-extrabold text-2xl text-white tracking-wider
                        transition-colors duration-300
                        group-hover:text-purple-400
                    ">NexFolio
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-4">

                    {authenticated && (
                        <button
                            onClick={handleMyResumes}
                            className="
                                flex items-center gap-2 text-gray-300 relative group
                                hover:text-white transition-all duration-300 text-base font-medium
                                py-1 px-3 border border-transparent hover:border-purple-600/50 rounded-lg
                                bg-white/5 hover:bg-white/10 cursor-pointer
                            "
                        >
                            <FileText size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                            <span className="relative overflow-hidden">My Resumes</span>
                        </button>
                    )}

                    {authenticated ? (
                        <button
                            onClick={handleLogout}
                            className="
                                flex items-center gap-2 text-gray-300 relative group
                                hover:text-white transition-all duration-300 text-base font-medium
                                py-1 px-3 border border-transparent hover:border-purple-600/50 rounded-lg
                                bg-white/5 hover:bg-white/10 cursor-pointer
                            "
                        >
                            <LogIn size={18} className="text-purple-400 group-hover:text-white transition-colors" />
                            <span className="relative overflow-hidden">Logout</span>
                        </button>
                    ) : (
                        <Link
                            to="/user/login"
                            className="
                                flex items-center gap-2 text-gray-300 relative group
                                hover:text-white transition-all duration-300 text-base font-medium
                                py-1 px-3 border border-transparent hover:border-purple-600/50 rounded-lg
                                bg-white/5 hover:bg-white/10 cursor-pointer
                            "
                        >
                            <LogIn size={18} className="text-purple-400 group-hover:text-white transition-colors" />
                            <span className="relative overflow-hidden">Sign In</span>
                        </Link>
                    )}

                    <button
                        onClick={handleGetStarted}
                        className="
                            relative overflow-hidden
                            flex items-center gap-2 
                            bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                            font-semibold
                            px-5 py-2 rounded-full transition-all duration-300 shadow-xl text-base
                            hover:scale-[1.03]
                            shadow-purple-700/50 hover:shadow-indigo-500/80
                            
                            before:absolute before:inset-0 before:rounded-full before:border before:border-purple-300 before:opacity-0 before:transition-opacity before:duration-500
                            hover:before:opacity-100 cursor-pointer
                        "
                    >
                        <Rocket size={18} className="rotate-45" />
                        <span className="relative z-10">Get Started</span>
                    </button>

                </div>

                <div
                    className="md:hidden text-white cursor-pointer hover:text-purple-400 transition"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </div>
            </div>

            <div
                className={`
                    md:hidden fixed top-16 left-0 w-full z-40 
                    backdrop-blur-xl bg-black/50 border-b border-white/10
                    transform transition-all duration-300 overflow-hidden
                    ${open ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <div className="flex flex-col py-4 px-6 space-y-4 text-white">

                    {authenticated && (
                        <Link
                            to="/my_resume"
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition text-lg py-1"
                            onClick={() => setOpen(false)}
                        >
                            <FileText size={20} className="text-blue-400" />
                            My Resumes
                        </Link>
                    )}

                    {authenticated ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition text-lg py-1 w-full justify-start"
                        >
                            <LogIn size={20} className="text-purple-400" />
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/user/login"
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition text-lg py-1"
                            onClick={() => setOpen(false)}
                        >
                            <LogIn size={20} className="text-purple-400" />
                            Sign In
                        </Link>
                    )}

                    <button
                        onClick={handleGetStarted}
                        className="
                            flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                            font-semibold
                            px-4 py-2 rounded-lg transition hover:bg-purple-700 w-full justify-center
                        "
                    >
                        <Rocket size={20} className="rotate-45" />
                        Get Started
                    </button>

                </div>
            </div>
        </>
    );
};

export default Navbar;