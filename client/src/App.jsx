import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Layout Components
import Layout from './components/layout/Layout'
import PublicLayout from './components/layout/PublicLayout'

// Auth Components
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DoctorRegister from './pages/auth/DoctorRegister'
import ForgotPassword from './pages/auth/ForgotPassword'

// Public Pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Doctors from './pages/public/Doctors'
import DoctorDetails from './pages/public/DoctorDetails'
import Blogs from './pages/public/Blogs'
import BlogDetails from './pages/public/BlogDetails'

// User Dashboard
import UserDashboard from './pages/user/Dashboard'
import UserProfile from './pages/user/Profile'
import UserAppointments from './pages/user/Appointments'
import UserPayments from './pages/user/Payments'
import UserReviews from './pages/user/Reviews'

// Doctor Dashboard
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorProfile from './pages/doctor/Profile'
import DoctorAppointments from './pages/doctor/Appointments'
import DoctorPatients from './pages/doctor/Patients'
import DoctorEarnings from './pages/doctor/Earnings'

// Admin Dashboard
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminDoctors from './pages/admin/Doctors'
import AdminAppointments from './pages/admin/Appointments'
import AdminPayments from './pages/admin/Payments'
import AdminBlogs from './pages/admin/Blogs'
import AdminDiseases from './pages/admin/Diseases'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

// Error Pages
import NotFound from './pages/error/NotFound'
import ServerError from './pages/error/ServerError'

function App() {
  return (
    <>
      <Helmet>
        <title>Doctor Appointment System</title>
        <meta name="description" content="Book appointments with certified doctors online" />
      </Helmet>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slug" element={<BlogDetails />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* User Routes */}
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="user/appointments" element={<UserAppointments />} />
          <Route path="user/payments" element={<UserPayments />} />
          <Route path="user/reviews" element={<UserReviews />} />

          {/* Doctor Routes */}
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doctor/profile" element={<DoctorProfile />} />
          <Route path="doctor/appointments" element={<DoctorAppointments />} />
          <Route path="doctor/patients" element={<DoctorPatients />} />
          <Route path="doctor/earnings" element={<DoctorEarnings />} />

          {/* Admin Routes */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="admin/doctors" element={
            <AdminRoute>
              <AdminDoctors />
            </AdminRoute>
          } />
          <Route path="admin/appointments" element={
            <AdminRoute>
              <AdminAppointments />
            </AdminRoute>
          } />
          <Route path="admin/payments" element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          } />
          <Route path="admin/blogs" element={
            <AdminRoute>
              <AdminBlogs />
            </AdminRoute>
          } />
          <Route path="admin/diseases" element={
            <AdminRoute>
              <AdminDiseases />
            </AdminRoute>
          } />
        </Route>

        {/* Error Routes */}
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />

        {/* Redirect old routes */}
        <Route path="/user/*" element={<Navigate to="/dashboard/user" replace />} />
        <Route path="/doctor/*" element={<Navigate to="/dashboard/doctor" replace />} />
        <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </>
  )
}

export default App
