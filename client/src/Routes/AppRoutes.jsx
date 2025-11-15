import React from "react";
import { BrowserRouter as Router, Routes ,Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyUser from "../pages/VerifyUser";
import Dashboard from "../pages/Dashboard";





const AppRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/user/register" element={<Register/>}/>
                    <Route path="/user/login" element={<Login/>}/>
                    <Route path="/user/verifyUser" element={<VerifyUser/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default AppRoutes
