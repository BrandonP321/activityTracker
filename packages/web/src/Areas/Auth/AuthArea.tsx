import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login/Login';

export default function AuthArea() {
  return (
    <Routes>
        <Route path={"/"} element={<Login/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/register"} element={<Login showRegistration/>}/>
    </Routes>
  )
}