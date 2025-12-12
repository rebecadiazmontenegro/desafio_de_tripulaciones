import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './SignUp/SignUp'


const Main = () => {
  return <main>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </main>;
};

export default Main;
