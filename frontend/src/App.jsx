import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"

// Admin
import Dashboard from "./pages/admin/Dashboard"
import ManageTasks from "./pages/admin/ManageTasks"
import ManageUsers from "./pages/admin/ManageUsers"
import CreateTask from "./pages/admin/CreateTask"

// User
import UserDashboard from "./pages/user/UserDashboard"
import TaskDetails from "./pages/user/TaskDetails"
import MyTasks from "./pages/user/MyTasks"

// ✅ NEW: Calendar
import TaskCalendar from "./pages/calendar/TaskCalendar"

import PrivateRoute from "./routes/PrivateRoute"

import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>

            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/create-task" element={<CreateTask />} />

            {/* ✅ Admin Calendar */}
            <Route path="/admin/calendar" element={<TaskCalendar />} />

          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>

            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<TaskDetails />} />

            {/* ✅ User Calendar */}
            <Route path="/user/calendar" element={<TaskCalendar />} />

          </Route>

          {/* Default */}
          <Route path="/" element={<Root />} />

        </Routes>
      </BrowserRouter>

      <Toaster />
    </div>
  )
}

export default App


// Redirect based on role
const Root = () => {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return currentUser.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />
}
