import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [menuData, setMenuData] = useState([])
  const { currentUser } = useSelector((state) => state.user)

  // 🔥 Handle navigation
  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout()
      return
    }
    navigate(route)
  }

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out")

      if (response?.data) {
        dispatch(signOutSuccess())
        navigate("/login")
      }
    } catch (error) {
      console.log("Logout error:", error)
    }
  }

  // 🔥 Load menu based on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        setMenuData(SIDE_MENU_DATA)
      } else {
        setMenuData(USER_SIDE_MENU_DATA)
      }
    }
  }, [currentUser])

  return (
    <div className="w-64 p-6 h-full flex flex-col border-r border-gray-200 bg-white">
      
      {/* USER INFO */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-blue-200">
          <img
            src={
              currentUser?.profileImageUrl ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {currentUser?.role === "admin" && (
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Admin
          </div>
        )}

        <h5 className="text-lg font-semibold text-gray-800">
          {currentUser?.name || "User"}
        </h5>

        <p className="text-sm text-gray-500">
          {currentUser?.email || ""}
        </p>
      </div>

      {/* MENU ITEMS */}
      <div className="flex-1 overflow-y-auto">
        {menuData.map((item, index) => {
          const Icon = item.icon

          return (
            <button
              key={index}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-4 text-[15px] px-5 py-3 mb-2 rounded-lg transition-all duration-200
              
              ${
                activeMenu === item.label
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }
              
              `}
            >
              <Icon className="text-xl" />
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SideMenu
