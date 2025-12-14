import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './SignUp/SignUp'
import Login from './Login/Login'
import Dashboard from './Dashboards/Dashboards'
import ChangePassword from './ChangePassword/ChangePassword'
import Home from "./Home/Home"

const Main = () => {
  return <main>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change/password" element={<ChangePassword />} />
      </Routes>
    </main>;
};

export default Main;
