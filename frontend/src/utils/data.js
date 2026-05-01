import { FaHome, FaTasks, FaUsers, FaPlus, FaSignOutAlt } from "react-icons/fa"
import { FaCalendarDays } from "react-icons/fa6"

// ✅ ADMIN MENU
export const SIDE_MENU_DATA = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: FaHome,
  },
  {
    label: "Tasks",
    path: "/admin/tasks",
    icon: FaTasks,
  },
  {
    label: "Create Task",
    path: "/admin/create-task",
    icon: FaPlus,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },

  // 🔥 NEW: CALENDAR
  {
    label: "Calendar",
    path: "/admin/calendar",
    icon: FaCalendarDays,
  },

  {
    label: "Logout",
    path: "logout",
    icon: FaSignOutAlt,
  },
]

// ✅ USER MENU
export const USER_SIDE_MENU_DATA = [
  {
    label: "Dashboard",
    path: "/user/dashboard",
    icon: FaHome,
  },
  {
    label: "My Tasks",
    path: "/user/tasks",
    icon: FaTasks,
  },

  // 🔥 NEW: CALENDAR
  {
    label: "Calendar",
    path: "/user/calendar",
    icon: FaCalendarDays,
  },

  {
    label: "Logout",
    path: "logout",
    icon: FaSignOutAlt,
  },
]
