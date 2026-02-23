/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, NoNavLayout } from './components/Layout';
import Home from './pages/Home';
import Publish from './pages/Publish';
import Profile from './pages/Profile';
import LostDetails from './pages/LostDetails';
import AdoptionApply from './pages/AdoptionApply';
import Login from './pages/Login';
import Categories from './pages/Categories';
import Messages from './pages/Messages';
import PetDetails from './pages/PetDetails';
import MyAdoptions from './pages/MyAdoptions';
import MyPosts from './pages/MyPosts';
import Discovery from './pages/Discovery';
import Applications from './pages/Applications';
import Chat from './pages/Chat';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/discovery" element={<AuthGuard><Discovery /></AuthGuard>} />
          <Route path="/messages" element={<AuthGuard><Messages /></AuthGuard>} />
        </Route>

        <Route element={<NoNavLayout />}>
          <Route path="/publish" element={<AuthGuard><Publish /></AuthGuard>} />
          <Route path="/pet/:id" element={<AuthGuard><PetDetails /></AuthGuard>} />
          <Route path="/lost/:id" element={<AuthGuard><LostDetails /></AuthGuard>} />
          <Route path="/adopt/:id" element={<AuthGuard><AdoptionApply /></AuthGuard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-adoptions" element={<AuthGuard><MyAdoptions /></AuthGuard>} />
          <Route path="/my-posts" element={<AuthGuard><MyPosts /></AuthGuard>} />
          <Route path="/applications" element={<AuthGuard><Applications /></AuthGuard>} />
          <Route path="/chat/:id" element={<AuthGuard><Chat /></AuthGuard>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
