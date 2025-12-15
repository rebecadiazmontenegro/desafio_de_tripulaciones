import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from "./Home/Home"
import Login from './Login/Login'
import SignUp from './SignUp/SignUp'
import Dashboard from './Dashboards/Dashboards'
import ChangePassword from './ChangePassword/ChangePassword'
import UsersList from './UsersList/UsersList'

const Main = () => {
  return <main>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/users/list" element={<UsersList />} />
      </Routes>
    </main>;
};

export default Main;
