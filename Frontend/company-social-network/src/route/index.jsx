import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Menu from "../components/Menu/MainMenu";
// import Footer from "../components/Footer/Footer";
import HomePage from "../pages/home";
import Layout from "../components/layout/Layout";
import Friends from "../pages/friend";
import Tasks from "../pages/task";
import Statistic from "../pages/statistic";
import Profile from "../pages/profile";
import Login from "../pages/login";
import Register from "../pages/register";
import ProtectedRoute from "./ProtectedRoute";
import Messenger from "../pages/messenger";

const RootRoute = ({ setToken, token }) => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/friends" element={<Friends />} />
            <Route exact path="/tasks" element={<Tasks />} />
            <Route exact path="/chart" element={<Statistic />} />
            <Route exact path="/chat/:id?" element={<Messenger />} />
            <Route exact path="/profile/:id" element={<Profile />} />
          </Route>

          <Route exact path="/login" element={<Login {...{ setToken }} />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default RootRoute;
